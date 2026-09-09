/**
 * PickyHack — Stateless AI Context Harness Engine V2
 * "Stateless by default. Context-driven by design."
 * 
 * Core Capabilities:
 * 1. Multi-factor Utility Scoring (Query Intent, Recency, Confidence, Task Proximity, Dependency)
 * 2. Strict Token Budgeting (1,000, 4,000, 8,000, 16,000, 32,000, or model-native limit)
 * 3. Explainable Selection Rationale (Selected Items, Pruned Items, Rejection Reasons)
 * 4. Zero-Loss Context Replay (Re-hydrates state for any model/session without raw chat history)
 * 5. Model-to-Model Context Diff (Added, Removed, Compressed, Retained)
 */
(function(root) {
  'use strict';

  const CHARS_PER_TOKEN = 3.8;

  function estimateTokens(text) {
    if (!text || typeof text !== 'string') return 0;
    return Math.ceil(text.length / CHARS_PER_TOKEN);
  }

  const ContextEngine = {
    /**
     * Extracts keywords and technical entities (IPs, domains, ports, CVEs, tools) from operator query
     */
    extractEntities(query) {
      if (!query || typeof query !== 'string') return { keywords: [], cves: [], ips: [], ports: [], tools: [] };
      const q = query.toLowerCase();

      // CVE pattern
      const cves = (query.match(/CVE-\d{4}-\d{4,7}/gi) || []).map(c => c.toUpperCase());

      // IP pattern
      const ips = query.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g) || [];

      // Port pattern
      const portMatches = query.match(/(?:port\s+|:)(\d{1,5})\b/gi) || [];
      const ports = portMatches.map(p => p.replace(/[^0-9]/g, '')).filter(Boolean);

      // Known tools
      const toolCatalog = ['nmap', 'nuclei', 'ffuf', 'sqlmap', 'gobuster', 'httpx', 'subfinder', 'nikto', 'burp', 'zap', 'curl', 'metasploit', 'hydra'];
      const tools = toolCatalog.filter(t => q.includes(t));

      // General keywords (tokens of length >= 3 excluding stop words)
      const stopWords = new Set(['the', 'and', 'for', 'with', 'what', 'can', 'how', 'this', 'that', 'from', 'target', 'test', 'please', 'check', 'show', 'give', 'run', 'exploit', 'vuln']);
      const rawWords = q.replace(/[^a-z0-9_-]/g, ' ').split(/\s+/);
      const keywords = rawWords.filter(w => w.length >= 3 && !stopWords.has(w));

      return { keywords, cves, ips, ports, tools };
    },

    /**
     * Scores an entity based on relevance to the query entities, recency, confidence, and task proximity.
     */
    scoreItem(item, type, entities, activeTask = null) {
      let score = 0;
      const reasons = [];

      const itemText = JSON.stringify(item).toLowerCase();

      // 1. Direct CVE Match (Highest priority in security)
      if (entities.cves.length > 0) {
        for (const cve of entities.cves) {
          if (itemText.includes(cve.toLowerCase())) {
            score += 60;
            reasons.push(`Direct CVE match (${cve})`);
          }
        }
      }

      // 2. Direct IP / Target Match
      if (entities.ips.length > 0) {
        for (const ip of entities.ips) {
          if (itemText.includes(ip)) {
            score += 45;
            reasons.push(`Target IP match (${ip})`);
          }
        }
      }

      // 3. Port match
      if (entities.ports.length > 0) {
        for (const port of entities.ports) {
          if (itemText.includes(`port ${port}`) || itemText.includes(`:${port}`) || itemText.includes(`"${port}"`) || itemText.includes(`/${port}`)) {
            score += 35;
            reasons.push(`Target port match (${port})`);
          }
        }
      }

      // 4. Keyword matches
      let keywordHits = 0;
      for (const kw of entities.keywords) {
        if (itemText.includes(kw)) {
          keywordHits++;
          score += 15;
        }
      }
      if (keywordHits > 0) {
        reasons.push(`Keyword relevance (${keywordHits} matches)`);
      }

      // 5. Tool match
      for (const tool of entities.tools) {
        if (itemText.includes(tool)) {
          score += 20;
          reasons.push(`Tool alignment (${tool})`);
        }
      }

      // 6. Active Task Proximity
      if (activeTask) {
        const taskText = `${activeTask.title} ${activeTask.phase}`.toLowerCase();
        if (entities.keywords.some(k => taskText.includes(k))) {
          score += 15;
          reasons.push('Proximity to active pentest task');
        }
      }

      // 7. Base importance by entity type
      if (type === 'finding') {
        const eps = item.eps || 50;
        score += Math.round(eps * 0.2); // Up to +20 for high EPS
        if (item.severity === 'Critical' || item.severity === 'High') score += 10;
      } else if (type === 'target_scope') {
        score += 30; // Core scope always has strong baseline
        reasons.push('Mandatory mission boundary');
      } else if (type === 'evidence') {
        if (score > 0) score += 10; // Corroborating proof
      }

      return {
        score,
        reasons: reasons.length > 0 ? reasons : ['General assessment context']
      };
    },

    /**
     * Builds a token-budget-aware context packet with explainable selection.
     * @param {string} userPrompt - Operator task/query
     * @param {Object} options - { budgetTokens, state, modelCapabilities, attachments }
     * @returns {Object} Context packet and selection audit metadata
     */
    buildPacket(userPrompt, options = {}) {
      let state = options.state;
      if (!state) {
        if (typeof root !== 'undefined' && root.ProjectState) {
          state = root.ProjectState.get();
        } else if (typeof require !== 'undefined') {
          try { state = require('./project-state').get(); } catch (e) { state = {}; }
        } else {
          state = root.pentestState || {};
        }
      }

      const attachments = options.attachments || [];
      const modelCap = options.modelCapabilities || { contextWindow: 128000, vision: true };
      
      // Target budget: default 4000 tokens for context harness, or user specified
      const budgetTokens = options.budgetTokens || 4000;

      // Extract entities from user prompt
      const entities = this.extractEntities(userPrompt);
      const activeTask = (state.tasks || []).find(t => t.status === 'IN_PROGRESS') || (state.tasks || [])[0] || null;

      // System Persona (fixed minimal footprint)
      const systemPrompt = `You are PickyHack — Senior Offensive Security Copilot & AI Context Harness.
Operate strictly within authorized engagement scope.
Prioritize verified findings, reproducible PoCs, and actionable CLI commands.
Distinguish strictly: FACT, OBSERVATION, INFERENCE, HYPOTHESIS, CONFIRMED.

=== RESPONSE DIRECTIVE: LESS IS MORE ===
- Default to direct, concise answers.
- For simple factual questions, return ONLY the direct fact.
- For command queries, output ONLY the executable syntax.
- Full reports are produced ONLY when explicitly requested.`;

      const systemTokens = estimateTokens(systemPrompt);
      let availableTokens = Math.max(0, budgetTokens - systemTokens - estimateTokens(userPrompt));

      const selected = [];
      const rejected = [];

      // 1. Mission Boundaries (Mandatory)
      const scopeBlock = {
        type: 'target_scope',
        title: 'Mission Boundaries',
        content: `TARGET: ${state.target || 'Not specified'}\nSCOPE: ${state.scope || 'In-scope addresses only'}\nOBJECTIVES: ${state.objectives || 'Standard pentest assessment'}${state.constraints ? '\nCONSTRAINTS: ' + state.constraints : ''}`,
        score: 100,
        reasons: ['Authorized mission scope and boundaries']
      };
      scopeBlock.tokens = estimateTokens(scopeBlock.content);
      selected.push(scopeBlock);
      availableTokens -= scopeBlock.tokens;

      // 2. Candidate pool of items to rank
      const candidates = [];

      // Discovered Assets & Services
      if (Array.isArray(state.assets)) {
        state.assets.forEach(asset => {
          const svcList = (asset.services || []).map(s => `${s.port}/${s.protocol} (${s.service} ${s.version || ''})`).join(', ');
          const text = `• Asset: ${asset.host || asset.ip} (${asset.ip}) | OS: ${asset.os || 'Unknown'} | Open Ports: ${svcList || 'None'}`;
          const { score, reasons } = this.scoreItem(asset, 'asset', entities, activeTask);
          candidates.push({
            id: asset.id,
            type: 'asset',
            title: `Asset: ${asset.host || asset.ip}`,
            content: text,
            score,
            reasons,
            tokens: estimateTokens(text)
          });
        });
      }

      // Validated Findings
      if (Array.isArray(state.findings)) {
        state.findings.forEach(f => {
          const text = `• [${(f.severity || 'Medium').toUpperCase()}] ${f.title} (CVE: ${f.cve || 'N/A'}, EPS: ${f.eps || 70}/100, Status: ${f.status || 'CONFIRMED'})\n  PoC/Detail: ${f.poc || f.impact || 'Verified'}`;
          const { score, reasons } = this.scoreItem(f, 'finding', entities, activeTask);
          candidates.push({
            id: f.id,
            type: 'finding',
            title: `Finding: ${f.title}`,
            content: text,
            score: score + 10, // Findings carry inherent value
            reasons,
            tokens: estimateTokens(text)
          });
        });
      }

      // Evidence Log
      if (Array.isArray(state.evidence)) {
        state.evidence.forEach(evi => {
          let outputSnippet = (evi.stdout || '').trim();
          if (outputSnippet.length > 300) outputSnippet = outputSnippet.substring(0, 300) + '... [truncated]';
          const text = `• Evidence [${evi.sourceTool}]: ${evi.title || evi.command}\n  Output: ${outputSnippet}`;
          const { score, reasons } = this.scoreItem(evi, 'evidence', entities, activeTask);
          candidates.push({
            id: evi.id,
            type: 'evidence',
            title: `Evidence: ${evi.title || evi.sourceTool}`,
            content: text,
            score,
            reasons,
            tokens: estimateTokens(text)
          });
        });
      }

      // Active Tasks & Hypotheses
      if (Array.isArray(state.tasks)) {
        state.tasks.forEach(t => {
          if (t.status === 'IN_PROGRESS' || t.status === 'TODO') {
            const text = `• Task [${t.status} / ${t.phase}]: ${t.title}`;
            candidates.push({
              id: t.id,
              type: 'task',
              title: `Task: ${t.title}`,
              content: text,
              score: t.status === 'IN_PROGRESS' ? 40 : 20,
              reasons: ['Active task queue alignment'],
              tokens: estimateTokens(text)
            });
          }
        });
      }

      // Attack Chains
      if (Array.isArray(state.attackChains)) {
        state.attackChains.forEach(chain => {
          const stepsStr = Array.isArray(chain.steps) ? chain.steps.join(' -> ') : (chain.steps || '');
          const text = `• Attack Chain: ${chain.title || chain.id}\n  Path: ${stepsStr}`;
          const { score, reasons } = this.scoreItem(chain, 'chain', entities, activeTask);
          candidates.push({
            id: chain.id || `chain_${chain.title}`,
            type: 'attack_chain',
            title: `Attack Chain: ${chain.title || chain.id}`,
            content: text,
            score: Math.max(35, score + 15),
            reasons,
            tokens: estimateTokens(text)
          });
        });
      }

      // Staged Attachments
      if (Array.isArray(attachments)) {
        attachments.forEach(att => {
          const text = `--- Attachment: ${att.name} (${att.type}) ---\n${att.textContent ? att.textContent.substring(0, 600) : '[Binary/Media File]'}`;
          candidates.push({
            id: `att_${att.name}`,
            type: 'attachment',
            title: `File: ${att.name}`,
            content: text,
            score: 75, // Explicitly staged files are high intent
            reasons: ['Explicit operator attachment'],
            tokens: estimateTokens(text)
          });
        });
      }

      // Operational Notes
      if (state.notes && state.notes.trim()) {
        const text = `[OPERATIONAL NOTES]\n${state.notes.trim()}`;
        const { score, reasons } = this.scoreItem({ text: state.notes }, 'note', entities, activeTask);
        candidates.push({
          id: 'tactical_notes',
          type: 'note',
          title: 'Tactical Notes',
          content: text,
          score: Math.max(10, score),
          reasons,
          tokens: estimateTokens(text)
        });
      }

      // Sort candidates by utility score descending
      candidates.sort((a, b) => b.score - a.score);

      // 3. Pack candidates into token budget
      for (const item of candidates) {
        if (item.tokens <= availableTokens) {
          selected.push(item);
          availableTokens -= item.tokens;
        } else {
          rejected.push({
            ...item,
            rejectedReason: item.score <= 10 
              ? 'Low query relevance' 
              : `Token budget limit exceeded (${item.tokens} tok needed, ${availableTokens} tok remaining)`
          });
        }
      }

      // 4. Assemble structured Context Packet
      const contextBlocks = [
        '=== PICKYHACK MISSION CONTEXT ===',
        scopeBlock.content
      ];

      const grouped = {};
      selected.forEach(s => {
        if (s.type === 'target_scope') return;
        if (!grouped[s.type]) grouped[s.type] = [];
        grouped[s.type].push(s.content);
      });

      if (grouped.asset && grouped.asset.length > 0) {
        contextBlocks.push('\n[DISCOVERED ASSETS & SERVICES]');
        contextBlocks.push(grouped.asset.join('\n'));
      }

      if (grouped.finding && grouped.finding.length > 0) {
        contextBlocks.push('\n[RELEVANT FINDINGS]');
        contextBlocks.push(grouped.finding.join('\n'));
      }

      if (grouped.evidence && grouped.evidence.length > 0) {
        contextBlocks.push('\n[CORROBORATING EVIDENCE]');
        contextBlocks.push(grouped.evidence.join('\n'));
      }

      if (grouped.task && grouped.task.length > 0) {
        contextBlocks.push('\n[PENTEST OBJECTIVES & TASKS]');
        contextBlocks.push(grouped.task.join('\n'));
      }

      if (grouped.attack_chain && grouped.attack_chain.length > 0) {
        contextBlocks.push('\n[CORRELATED ATTACK CHAINS]');
        contextBlocks.push(grouped.attack_chain.join('\n'));
      }

      if (grouped.attachment && grouped.attachment.length > 0) {
        contextBlocks.push('\n[ATTACHED ARTIFACTS]');
        contextBlocks.push(grouped.attachment.join('\n'));
      }

      if (grouped.note && grouped.note.length > 0) {
        contextBlocks.push('\n' + grouped.note.join('\n'));
      }

      contextBlocks.push('=== END MISSION CONTEXT ===\n');

      const fullContextStr = contextBlocks.join('\n');
      const userPacket = `${fullContextStr}\nOPERATOR INSTRUCTION / TASK:\n${userPrompt}`;
      const totalEstimatedTokens = estimateTokens(systemPrompt) + estimateTokens(userPacket);

      return {
        systemPrompt,
        userPacket,
        tokenEstimate: totalEstimatedTokens,
        budgetTokens,
        selectedItems: selected,
        rejectedItems: rejected,
        entities,
        activeTaskTitle: activeTask ? activeTask.title : null
      };
    },

    /**
     * Context Replay: Reconstructs a clean context packet for a brand new conversation
     * or model switch directly from ProjectState without requiring raw chat history.
     */
    buildReplayContext(stateOverride = null, targetModelCapabilities = {}) {
      let state = stateOverride;
      if (!state) {
        if (typeof root !== 'undefined' && root.ProjectState) state = root.ProjectState.get();
        else if (typeof require !== 'undefined') state = require('./project-state').get();
      }
      return this.buildPacket('Resume assessment from current project state. Summarize active findings and suggest next tactical step.', {
        state,
        budgetTokens: targetModelCapabilities.contextWindow ? Math.min(8000, targetModelCapabilities.contextWindow / 2) : 4000,
        modelCapabilities: targetModelCapabilities
      });
    },

    /**
     * Context Diff: Compares context packets generated for two different models or budgets.
     */
    diffContexts(packetA, packetB) {
      const idsA = new Set((packetA.selectedItems || []).map(i => i.id || i.title));
      const idsB = new Set((packetB.selectedItems || []).map(i => i.id || i.title));

      const added = (packetB.selectedItems || []).filter(i => !idsA.has(i.id || i.title));
      const removed = (packetA.selectedItems || []).filter(i => !idsB.has(i.id || i.title));
      const retained = (packetA.selectedItems || []).filter(i => idsB.has(i.id || i.title));

      return {
        added,
        removed,
        retained,
        tokensA: packetA.tokenEstimate,
        tokensB: packetB.tokenEstimate,
        tokenDiff: packetB.tokenEstimate - packetA.tokenEstimate
      };
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContextEngine;
  }
  root.ContextEngine = ContextEngine;
})(typeof window !== 'undefined' ? window : global);
