/**
 * PickyHack — Stateless AI Context Harness Engine
 * Stateless by default. Context-driven by design.
 * Dynamically compiles structured operational intelligence into an optimized,
 * model-agnostic context packet for any LLM at any turn.
 */
(function(root) {
  'use strict';

  const ContextEngine = {
    /**
     * Builds a comprehensive, token-optimized context packet for an AI query.
     * @param {string} userPrompt - Current query from operator
     * @param {Object} options - Options (stagedAttachments, activeChain, notesOverride)
     * @returns {{ systemPrompt: string, userPacket: string, tokenEstimate: number }}
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

      // 1. System Persona & Strict Security Guidelines
      let systemPrompt = `You are PickyHack — Senior Offensive Security Copilot & AI Context Harness.
You operate strictly within authorized rules of engagement.
Your analysis must be actionable, technically rigorous, and prioritized by real-world exploitability (Exploitability Priority Score / 100).
Never execute commands automatically; provide concrete, testable CLI syntax (curl, nmap, nuclei, metasploit, impacket).
Treat all external scans and outputs as raw evidence to correlate against CISA KEV and public PoC databases.`;

      // 2. Structured Operational Context Block
      let contextParts = [];

      contextParts.push(`=== PICKYHACK MISSION CONTEXT ===`);
      contextParts.push(`TARGET: ${state.target || 'Not specified'}`);
      contextParts.push(`SCOPE: ${state.scope || 'In-scope addresses only'}`);
      contextParts.push(`OBJECTIVES: ${state.objectives || 'General security assessment'}`);
      if (state.constraints) {
        contextParts.push(`CONSTRAINTS: ${state.constraints}`);
      }

      // 3. Discovered Assets & Services
      if (state.assets && state.assets.length > 0) {
        contextParts.push(`\n[DISCOVERED ASSETS & OPEN PORTS]`);
        state.assets.forEach(a => {
          contextParts.push(`• ${a.host || a.ip} (${a.ip || ''}): ${a.ports}`);
        });
      }

      // 4. Validated Findings Ranked by EPS
      if (state.findings && state.findings.length > 0) {
        contextParts.push(`\n[VALIDATED FINDINGS (EPS RANKED)]`);
        const sorted = [...state.findings].sort((a, b) => (b.eps || 0) - (a.eps || 0));
        sorted.forEach(f => {
          contextParts.push(`• [${f.severity.toUpperCase()}] ${f.title} (CVE: ${f.cve || 'N/A'}, EPS: ${f.eps || 'N/A'}/100)`);
          if (f.poc) contextParts.push(`  PoC/Evidence: ${f.poc}`);
        });
      }

      // 5. Active Attack Chains
      if (state.attackChains && state.attackChains.length > 0) {
        contextParts.push(`\n[ACTIVE ATTACK PATHS]`);
        state.attackChains.forEach(c => {
          contextParts.push(`• Chain: ${c.title} -> Steps: ${Array.isArray(c.steps) ? c.steps.join(' -> ') : c.steps}`);
        });
      }

      // 6. Staged Security Artifacts & Scan Dumps
      if (attachments && attachments.length > 0) {
        contextParts.push(`\n[ATTACHED SECURITY ARTIFACTS (${attachments.length} files)]`);
        attachments.forEach((att, idx) => {
          contextParts.push(`--- Attachment ${idx + 1}: ${att.name} (${(att.size / 1024).toFixed(1)} KB, type: ${att.type}) ---`);
          if (att.type === 'text' && att.textContent) {
            contextParts.push(att.textContent);
          } else if (att.type === 'image') {
            contextParts.push(`[Image Attachment: ${att.name} (Dispatched via Multimodal Vision API)]`);
          }
          contextParts.push(`--- End Attachment ${idx + 1} ---`);
        });
      }

      // 7. Scratchpad Operational Notes
      if (state.notes && state.notes.trim().length > 0) {
        contextParts.push(`\n[TACTICAL NOTES & HYPOTHESES]`);
        contextParts.push(state.notes.trim());
      }

      contextParts.push(`=== END MISSION CONTEXT ===\n`);

      const fullContextStr = contextParts.join('\n');
      const userPacket = `${fullContextStr}\nOPERATOR INSTRUCTION / TASK:\n${userPrompt}`;

      // Estimate tokens (~3.8 characters per token)
      const tokenEstimate = Math.ceil((systemPrompt.length + userPacket.length) / 3.8);

      return {
        systemPrompt,
        userPacket,
        tokenEstimate
      };
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContextEngine;
  }
  root.ContextEngine = ContextEngine;
})(typeof window !== 'undefined' ? window : global);
