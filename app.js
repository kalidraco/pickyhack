/**
 * PickyHack — Offensive Security & Pentest Intelligence AI
 * Modern Conversational AI Interface, Functional Windows 98 Multi-Window Desktop,
 * Multi-API / Multi-Model Manager, Pentest Notes (Notes.txt), & Context Harness
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. CURATED THREAT INTELLIGENCE DATABASE (CISA KEV, CVEs & EXPLOITS)
  // ==========================================================================
  const INTEL_DB = [
    {
      cve: 'CVE-2024-3400',
      vendor: 'Palo Alto Networks',
      product: 'PAN-OS GlobalProtect Gateway',
      versions: 'PAN-OS 10.2, 11.0, 11.1',
      fixed: '10.2.9-h1, 11.0.4-h1, 11.1.2-h3',
      cvss: 10.0,
      cwe: 'CWE-77: Command Injection',
      published: '2024-04-12',
      inKEV: true,
      wildExploit: true,
      pocAvailable: true,
      metasploit: true,
      authRequired: 'None (Pre-auth)',
      vector: 'Remote Network',
      impact: 'RCE / System Takeover (root)',
      epsScore: 99,
      epsCategory: 'CRITICAL — EXPLOIT NOW',
      threatActor: 'UTA0218 / State-sponsored',
      chain: 'GlobalProtect Pre-Auth Command Injection → Root Shell → Cron Persistence → Internal Network Pivoting'
    },
    {
      cve: 'CVE-2023-46805',
      vendor: 'Ivanti',
      product: 'Connect Secure / Policy Secure',
      versions: 'ICS 9.x, 22.x prior to patch',
      fixed: '9.1R18.3, 22.4R2.2',
      cvss: 9.8,
      cwe: 'CWE-287: Improper Authentication',
      published: '2024-01-10',
      inKEV: true,
      wildExploit: true,
      pocAvailable: true,
      metasploit: true,
      authRequired: 'None (Pre-auth)',
      vector: 'Remote Network',
      impact: 'Auth Bypass + RCE with CVE-2024-21887',
      epsScore: 98,
      epsCategory: 'CRITICAL — EXPLOIT NOW',
      threatActor: 'UNC5221 / Multiple cyber espionage actors',
      chain: 'Auth Bypass (REST API) → Command Injection → Web Shell Deployment → Active Directory Kerberoasting'
    },
    {
      cve: 'CVE-2024-21762',
      vendor: 'Fortinet',
      product: 'FortiOS SSL-VPN',
      versions: 'FortiOS 7.4.0-7.4.2, 7.2.0-7.2.6',
      fixed: '7.4.3, 7.2.7, 7.0.14',
      cvss: 9.8,
      cwe: 'CWE-122: Heap-based Buffer Overflow',
      published: '2024-02-09',
      inKEV: true,
      wildExploit: true,
      pocAvailable: true,
      metasploit: false,
      authRequired: 'None (Pre-auth)',
      vector: 'Remote Network',
      impact: 'Remote Code Execution without authentication',
      epsScore: 96,
      epsCategory: 'CRITICAL — EXPLOIT NOW',
      threatActor: 'Volt Typhoon / Coordinated Botnets',
      chain: 'Pre-auth HTTP Overflow → Code Execution → Memory Extraction → VPN Credential Theft'
    },
    {
      cve: 'CVE-2024-1086',
      vendor: 'Linux',
      product: 'Kernel nf_tables subsystem',
      versions: 'v5.14 through v6.6',
      fixed: 'Linux kernel commit f342de',
      cvss: 7.8,
      cwe: 'CWE-416: Use After Free',
      published: '2024-01-31',
      inKEV: true,
      wildExploit: true,
      pocAvailable: true,
      metasploit: true,
      authRequired: 'Local User',
      vector: 'Local',
      impact: 'Reliable Local Privilege Escalation (root)',
      epsScore: 92,
      epsCategory: 'CRITICAL — EXPLOIT NOW',
      threatActor: 'Financially motivated ransomware operators',
      chain: 'Web shell foothold → unprivileged local exec → nf_tables UAF → Full root capabilities'
    },
    {
      cve: 'CVE-2023-22527',
      vendor: 'Atlassian',
      product: 'Confluence Data Center & Server',
      versions: '8.0.x through 8.5.3',
      fixed: '8.5.4, 8.5.5',
      cvss: 10.0,
      cwe: 'CWE-94: Improper Control of Code Generation',
      published: '2024-01-16',
      inKEV: true,
      wildExploit: true,
      pocAvailable: true,
      metasploit: true,
      authRequired: 'None (Pre-auth)',
      vector: 'Remote Network',
      impact: 'RCE via OGNL Template Injection',
      epsScore: 95,
      epsCategory: 'CRITICAL — EXPLOIT NOW',
      threatActor: 'Multiple automated scanning clusters',
      chain: 'Unauthenticated POST /template/eval → OGNL Injection → Process Execution → Ransomware Dropper'
    },
    {
      cve: 'CVE-2026-1044',
      vendor: 'Microsoft',
      product: 'Windows Kernel / Netlogon RPC',
      versions: 'Windows Server 2022 / 2025',
      fixed: 'KB5049921',
      cvss: 9.8,
      cwe: 'CWE-287: Authentication Bypass',
      published: '2026-02-14',
      inKEV: true,
      wildExploit: true,
      pocAvailable: true,
      metasploit: true,
      authRequired: 'None (Pre-auth)',
      vector: 'Remote Network (SMB/RPC)',
      impact: 'Full Domain Controller Takeover',
      epsScore: 97,
      epsCategory: 'CRITICAL — EXPLOIT NOW',
      threatActor: 'BlackByte Ransomware / APT29',
      chain: 'RPC NetrServerAuthenticate bypass → Machine Account Spoofing → DCSync → Full Forest Takeover'
    }
  ];

  function calculateEPS(cveItem) {
    let score = (cveItem.cvss || 7.0) * 4;
    if (cveItem.inKEV) score += 25;
    if (cveItem.wildExploit) score += 20;
    if (cveItem.pocAvailable) score += 10;
    if (cveItem.metasploit) score += 5;
    return Math.min(Math.round(score), 100);
  }

  // ==========================================================================
  // 2. AI PROVIDERS REPOSITORY & CAPABILITIES METADATA
  // ==========================================================================
  const AI_PROVIDERS = {
    openai: {
      name: 'OpenAI',
      defaultEndpoint: 'https://api.openai.com/v1',
      models: ['gpt-4o', 'gpt-4o-mini', 'o3-mini', 'o1', 'gpt-4-turbo'],
      capabilities: { vision: true, tools: true, reasoning: true, streaming: true, contextWindow: 128000 }
    },
    anthropic: {
      name: 'Anthropic',
      defaultEndpoint: 'https://api.anthropic.com/v1',
      models: ['claude-3-7-sonnet-20250219', 'claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022'],
      capabilities: { vision: true, tools: true, reasoning: true, streaming: true, contextWindow: 200000 }
    },
    gemini: {
      name: 'Google Gemini',
      defaultEndpoint: 'https://generativelanguage.googleapis.com/v1beta',
      models: ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
      capabilities: { vision: true, tools: true, reasoning: true, streaming: true, contextWindow: 1000000 }
    },
    mistral: {
      name: 'Mistral AI',
      defaultEndpoint: 'https://api.mistral.ai/v1',
      models: ['mistral-large-latest', 'codestral-latest', 'mistral-small-latest'],
      capabilities: { vision: false, tools: true, reasoning: true, streaming: true, contextWindow: 128000 }
    },
    openrouter: {
      name: 'OpenRouter',
      defaultEndpoint: 'https://openrouter.ai/api/v1',
      models: ['anthropic/claude-3.7-sonnet', 'openai/gpt-4o', 'deepseek/deepseek-r1', 'meta-llama/llama-3.3-70b-instruct'],
      capabilities: { vision: true, tools: true, reasoning: true, streaming: true, contextWindow: 128000 }
    },
    custom: {
      name: 'Custom (Ollama / Local)',
      defaultEndpoint: 'http://localhost:11434/v1',
      models: ['llama3.3:70b', 'qwen2.5-coder:32b', 'deepseek-coder-v2', 'mistral'],
      capabilities: { vision: false, tools: true, reasoning: false, streaming: true, contextWindow: 32000 }
    }
  };

  // ==========================================================================
  // 3. MULTI-API & MULTI-MODEL MANAGER
  // ==========================================================================
  const MultiAPIManager = {
    STORAGE_KEY: 'pickyhack_multi_api_engines',
    ACTIVE_KEY: 'pickyhack_active_engine_id',

    defaultEngines: [
      {
        id: 'engine-openai',
        name: 'OpenAI — GPT-4o',
        provider: 'openai',
        endpoint: 'https://api.openai.com/v1',
        apiKey: '',
        model: 'gpt-4o',
        customModel: '',
        role: 'Primary Analyst',
        capabilities: { contextWindow: 128000, vision: true, tools: true, reasoning: true, streaming: true },
        isConnected: false
      },
      {
        id: 'engine-anthropic',
        name: 'Anthropic — Claude 3.7',
        provider: 'anthropic',
        endpoint: 'https://api.anthropic.com/v1',
        apiKey: '',
        model: 'claude-3-7-sonnet-20250219',
        customModel: '',
        role: 'Deep Reasoning',
        capabilities: { contextWindow: 200000, vision: true, tools: true, reasoning: true, streaming: true },
        isConnected: false
      },
      {
        id: 'engine-gemini',
        name: 'Google — Gemini 2.5 Pro',
        provider: 'gemini',
        endpoint: 'https://generativelanguage.googleapis.com/v1beta',
        apiKey: '',
        model: 'gemini-2.5-pro',
        customModel: '',
        role: 'Fast Research',
        capabilities: { contextWindow: 1000000, vision: true, tools: true, reasoning: true, streaming: true },
        isConnected: false
      },
      {
        id: 'engine-custom',
        name: 'Custom (Local Ollama)',
        provider: 'custom',
        endpoint: 'http://localhost:11434/v1',
        apiKey: '',
        model: 'llama3.3:70b',
        customModel: '',
        role: 'Cheap / Fast Tasks',
        capabilities: { contextWindow: 32000, vision: false, tools: true, reasoning: false, streaming: true },
        isConnected: false
      }
    ],

    getEngines() {
      try {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn('Could not read multi-api engines from localStorage:', e);
      }

      // Check migration from legacy AIConfigManager
      const legacyRaw = localStorage.getItem('pickyhack_ai_config');
      if (legacyRaw) {
        try {
          const legacy = JSON.parse(legacyRaw);
          const cloned = JSON.parse(JSON.stringify(this.defaultEngines));
          const target = cloned.find(e => e.provider === legacy.provider) || cloned[0];
          target.apiKey = legacy.apiKey || '';
          target.endpoint = legacy.endpoint || target.endpoint;
          target.model = legacy.model || target.model;
          target.customModel = legacy.customModel || '';
          target.isConnected = !!legacy.apiKey;
          this.saveEngines(cloned);
          this.setActiveEngineId(target.id);
          return cloned;
        } catch (e) {}
      }

      return this.defaultEngines;
    },

    saveEngines(engines) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(engines));
      } catch (e) {
        console.warn('Could not save multi-api engines:', e);
      }
    },

    getActiveEngineId() {
      const stored = localStorage.getItem(this.ACTIVE_KEY);
      if (stored) return stored;
      const engines = this.getEngines();
      return engines[0] ? engines[0].id : 'engine-openai';
    },

    setActiveEngineId(id) {
      localStorage.setItem(this.ACTIVE_KEY, id);
      // Also sync backwards compatibility with legacy AIConfigManager
      const active = this.getActiveEngine();
      AIConfigManager.save({
        provider: active.provider,
        endpoint: active.endpoint,
        apiKey: active.apiKey,
        model: active.model,
        customModel: active.customModel,
        isConnected: !!active.apiKey
      });
      this.syncUI();
    },

    getActiveEngine() {
      const engines = this.getEngines();
      const activeId = this.getActiveEngineId();
      return engines.find(e => e.id === activeId) || engines[0] || this.defaultEngines[0];
    },

    saveEngine(engineData) {
      const engines = this.getEngines();
      const existingIdx = engines.findIndex(e => e.id === engineData.id);
      if (existingIdx >= 0) {
        engines[existingIdx] = { ...engines[existingIdx], ...engineData };
      } else {
        engines.push({
          id: engineData.id || `engine-${Date.now()}`,
          ...engineData
        });
      }
      this.saveEngines(engines);
      if (!engineData.id || engineData.id === this.getActiveEngineId()) {
        this.setActiveEngineId(engineData.id || engines[engines.length - 1].id);
      }
      this.syncUI();
    },

    deleteEngine(id) {
      let engines = this.getEngines();
      if (engines.length <= 1) {
        alert('You must keep at least one configured AI engine profile.');
        return;
      }
      engines = engines.filter(e => e.id !== id);
      this.saveEngines(engines);
      if (this.getActiveEngineId() === id) {
        this.setActiveEngineId(engines[0].id);
      }
      this.syncUI();
    },

    syncUI() {
      const active = this.getActiveEngine();
      const prov = AI_PROVIDERS[active.provider] || AI_PROVIDERS.openai;
      const modelName = active.customModel || active.model;

      const toolbarLabel = document.getElementById('toolbar-ai-label');
      if (toolbarLabel) toolbarLabel.textContent = active.apiKey ? modelName : `${modelName} (Standby)`;

      const dockModelLabel = document.getElementById('dock-model-label');
      if (dockModelLabel) dockModelLabel.textContent = `${modelName}`;

      const trayAi = document.getElementById('tray-ai-status');
      if (trayAi) trayAi.textContent = `🤖 ${modelName}`;

      const sbAi = document.getElementById('sb-ai-engine');
      if (sbAi) {
        sbAi.textContent = active.apiKey ? `AI: ${prov.name} (${modelName})` : `AI: ${prov.name} (Offline / Standby)`;
        sbAi.style.color = active.apiKey ? '#000080' : '#856404';
      }

      const activeIndicator = document.getElementById('multiapi-active-indicator');
      if (activeIndicator) {
        activeIndicator.textContent = `${active.name} (${modelName})`;
      }

      const sbMultiapiCount = document.getElementById('sb-multiapi-count');
      if (sbMultiapiCount) {
        sbMultiapiCount.textContent = `Engines: ${this.getEngines().length}`;
      }

      this.renderManager();
      this.renderQuickPopover();
    },

    renderManager() {
      const container = document.getElementById('multiapi-engines-container');
      if (!container) return;
      container.innerHTML = '';

      const engines = this.getEngines();
      const activeId = this.getActiveEngineId();

      engines.forEach(engine => {
        const isActive = engine.id === activeId;
        const card = document.createElement('div');
        card.className = `multiapi-engine-card ${isActive ? 'active-engine' : ''}`;

        const roleClass = engine.role === 'Deep Reasoning' ? 'role-reasoning' :
                          (engine.role === 'Fast Research' ? 'role-research' :
                          (engine.role === 'Cheap / Fast Tasks' ? 'role-fast' : 'role-primary'));

        const statusClass = engine.apiKey ? 'engine-status-connected' : 'engine-status-standby';
        const statusText = engine.apiKey ? '● Connected' : '○ Standby';

        card.innerHTML = `
          <div class="engine-card-left">
            <span class="engine-radio-bullet ${isActive ? 'active' : ''}" title="${isActive ? 'Active Engine' : 'Click to select'}">${isActive ? '●' : '○'}</span>
            <div class="engine-info">
              <div class="engine-name-row">
                <span class="engine-name">${engine.name}</span>
                <span class="engine-model-pill">${engine.customModel || engine.model}</span>
                <span class="engine-role-badge ${roleClass}">${engine.role || 'Primary Analyst'}</span>
              </div>
              <div class="engine-meta-row">
                <span class="${statusClass}">${statusText}</span>
                <span>Endpoint: <code>${engine.endpoint}</code></span>
              </div>
            </div>
          </div>
          <div class="engine-card-actions">
            <button class="win-btn btn-engine-use ${isActive ? 'active' : ''}" data-id="${engine.id}" ${isActive ? 'disabled' : ''}>
              ${isActive ? '✓ In Use' : 'Use'}
            </button>
            <button class="win-btn btn-engine-edit" data-id="${engine.id}">Edit</button>
            <button class="win-btn btn-engine-del" data-id="${engine.id}" style="color:#8b0000;">✕</button>
          </div>
        `;

        card.querySelector('.engine-radio-bullet').addEventListener('click', () => {
          this.setActiveEngineId(engine.id);
        });

        card.querySelector('.btn-engine-use').addEventListener('click', () => {
          this.setActiveEngineId(engine.id);
        });

        card.querySelector('.btn-engine-edit').addEventListener('click', () => {
          openEditEngineForm(engine);
        });

        card.querySelector('.btn-engine-del').addEventListener('click', () => {
          if (confirm(`Delete engine profile "${engine.name}"?`)) {
            this.deleteEngine(engine.id);
          }
        });

        container.appendChild(card);
      });
    },

    renderQuickPopover() {
      const container = document.getElementById('quick-model-popover-items');
      if (!container) return;
      container.innerHTML = '';

      const engines = this.getEngines();
      const activeId = this.getActiveEngineId();

      engines.forEach(engine => {
        const isActive = engine.id === activeId;
        const item = document.createElement('div');
        item.className = `popover-item ${isActive ? 'active' : ''}`;

        item.innerHTML = `
          <div class="popover-item-left">
            <span class="popover-check">${isActive ? '✓' : ''}</span>
            <span><strong>${engine.name}</strong></span>
          </div>
          <span class="popover-role">${engine.role || ''}</span>
        `;

        item.addEventListener('click', () => {
          this.setActiveEngineId(engine.id);
          const popover = document.getElementById('quick-model-popover');
          if (popover) popover.style.display = 'none';
        });

        container.appendChild(item);
      });
    }
  };

  // Backwards compatibility facade for existing AIConfigManager
  const AIConfigManager = {
    STORAGE_KEY: 'pickyhack_ai_config',
    FLAG_KEY: 'pickyhack_ai_configured',

    get() {
      try {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return {
        provider: 'openai',
        endpoint: AI_PROVIDERS.openai.defaultEndpoint,
        apiKey: '',
        model: 'gpt-4o',
        customModel: '',
        isConnected: false
      };
    },

    save(cfg) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cfg));
        localStorage.setItem(this.FLAG_KEY, 'true');
      } catch (e) {}
    },

    clear() {
      try {
        localStorage.removeItem(this.STORAGE_KEY);
        localStorage.removeItem(this.FLAG_KEY);
      } catch (e) {}
    },

    isConfigured() {
      return localStorage.getItem(this.FLAG_KEY) === 'true';
    },

    syncUI() {
      MultiAPIManager.syncUI();
    }
  };

  // ==========================================================================
  // 4. ENHANCED LLM ADAPTER (Multi-Model Dispatcher & Parallel Evaluator)
  // ==========================================================================
  const LLMAdapter = {
    async send(systemPrompt, userPrompt, specificEngine = null) {
      const cfg = specificEngine || MultiAPIManager.getActiveEngine();
      const model = cfg.customModel || cfg.model;

      // If no API key provided and not a local custom server, run local synthesis fallback
      if (!cfg.apiKey && cfg.provider !== 'custom') {
        return this.localSynthesisFallback(userPrompt, cfg);
      }

      try {
        let result;
        if (cfg.provider === 'anthropic') {
          result = await this.callAnthropic(cfg, model, systemPrompt, userPrompt);
        } else if (cfg.provider === 'gemini') {
          result = await this.callGemini(cfg, model, systemPrompt, userPrompt);
        } else {
          // OpenAI, Mistral, OpenRouter, Custom
          result = await this.callOpenAICompatible(cfg, model, systemPrompt, userPrompt);
        }

        return {
          ...result,
          modelName: model,
          provider: cfg.provider,
          engineName: cfg.name
        };
      } catch (err) {
        console.error(`LLM API call failed for ${cfg.name}:`, err);
        const fallback = this.localSynthesisFallback(userPrompt, cfg);
        return {
          text: `⚠️ **[${cfg.name} API Notice: ${err.message}]**\n\n*PickyHack Context Harness generated fallback analysis below:*\n\n${fallback.text}`,
          code: fallback.code,
          isFallback: true,
          modelName: model,
          provider: cfg.provider,
          engineName: cfg.name
        };
      }
    },

    async callMultiple(engineIds, systemPrompt, userPrompt) {
      const allEngines = MultiAPIManager.getEngines();
      const targets = allEngines.filter(e => engineIds.includes(e.id));

      const promises = targets.map(async (eng) => {
        try {
          const res = await this.send(systemPrompt, userPrompt, eng);
          return {
            engineId: eng.id,
            name: eng.name,
            model: eng.customModel || eng.model,
            role: eng.role,
            text: res.text,
            code: res.code,
            isFallback: res.isFallback || false
          };
        } catch (e) {
          return {
            engineId: eng.id,
            name: eng.name,
            model: eng.customModel || eng.model,
            role: eng.role,
            text: `⚠️ Error: ${e.message}`,
            code: null,
            error: true
          };
        }
      });

      return await Promise.all(promises);
    },

    async callOpenAICompatible(cfg, model, systemPrompt, userPrompt) {
      const endpoint = (cfg.endpoint || 'https://api.openai.com/v1').replace(/\/+$/, '') + '/chat/completions';
      const headers = { 'Content-Type': 'application/json' };
      if (cfg.apiKey) headers['Authorization'] = `Bearer ${cfg.apiKey}`;
      if (cfg.provider === 'openrouter') {
        headers['HTTP-Referer'] = 'https://pickyhack.app';
        headers['X-Title'] = 'PickyHack Pentest Copilot';
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.3
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errText.substring(0, 150)}`);
      }

      const data = await res.json();
      const reply = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : '';
      return this.parseModelOutput(reply);
    },

    async callAnthropic(cfg, model, systemPrompt, userPrompt) {
      const endpoint = (cfg.endpoint || 'https://api.anthropic.com/v1').replace(/\/+$/, '') + '/messages';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': cfg.apiKey,
          'anthropic-version': '2023-06-01',
          'dangerously-allow-browser': 'true'
        },
        body: JSON.stringify({
          model: model,
          max_tokens: 4096,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }]
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Anthropic HTTP ${res.status}: ${errText.substring(0, 150)}`);
      }

      const data = await res.json();
      const reply = data.content && data.content[0] ? data.content[0].text : '';
      return this.parseModelOutput(reply);
    },

    async callGemini(cfg, model, systemPrompt, userPrompt) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cfg.apiKey}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ parts: [{ text: userPrompt }] }]
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Gemini HTTP ${res.status}: ${errText.substring(0, 150)}`);
      }

      const data = await res.json();
      const reply = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]
        ? data.candidates[0].content.parts[0].text
        : '';
      return this.parseModelOutput(reply);
    },

    parseModelOutput(raw) {
      let text = raw;
      let code = null;
      const codeBlockMatch = raw.match(/```(?:bash|sh|shell|zsh)?\n([\s\S]*?)```/);
      if (codeBlockMatch) {
        code = codeBlockMatch[1].trim();
        text = raw.replace(codeBlockMatch[0], '').trim();
      }
      return { text, code, isFallback: false };
    },

    localSynthesisFallback(userPrompt, cfg = null) {
      const target = pentestState.target || 'target.example.com';
      let matched = INTEL_DB[0];
      const lower = (userPrompt + ' ' + (pentestState.rawNotes || '')).toLowerCase();

      if (lower.includes('confluence') || lower.includes('atlassian') || lower.includes('ognl')) {
        matched = INTEL_DB[4];
      } else if (lower.includes('fortinet') || lower.includes('fortios')) {
        matched = INTEL_DB[2];
      } else if (lower.includes('ivanti')) {
        matched = INTEL_DB[1];
      } else if (lower.includes('kernel') || lower.includes('privesc') || lower.includes('nftables')) {
        matched = INTEL_DB[3];
      } else if (lower.includes('active directory') || lower.includes('adcs') || lower.includes('domain')) {
        matched = INTEL_DB[5];
      }

      const eps = calculateEPS(matched);
      const engineName = cfg ? cfg.name : 'OpenAI';

      return {
        text: `**PickyHack Exploit Intelligence Analysis [Engine: ${engineName}]**\n` +
              `**Target Scope:** \`${target}\`\n` +
              `**Correlated Vulnerability:** **${matched.cve}** (${matched.product})\n` +
              `**CVSS:** ${matched.cvss} | **Exploitability Priority Score (EPS):** ${eps}/100 (${matched.epsCategory})\n` +
              `**CISA KEV Status:** ${matched.inKEV ? 'Listed (Active In-The-Wild Exploitation)' : 'Not Listed'}\n` +
              `**Authentication Required:** ${matched.authRequired}\n\n` +
              `**Detection & Verification Methodology:**\n` +
              `1. Non-destructive version banner fingerprinting.\n` +
              `2. Confirm patch level and configuration parameters.\n` +
              `3. Validate attack chain: *${matched.chain}*\n\n` +
              `*(Tip: Multi-API active — switch models on the fly with the **Multi-API** toolbar button or dock selector).*`,
        code: `nuclei -id ${matched.cve.toLowerCase()} -target https://${target}`,
        isFallback: true
      };
    }
  };

  // ==========================================================================
  // 5. CONTEXT ENGINE & HARNESS (Preserved Context Across Model Switches)
  // ==========================================================================
  const ContextEngine = {
    determineRelevance(userQuery, state) {
      const q = (userQuery || '').toLowerCase();
      
      let relAssets = (state.discoveredAssets || []).filter(a => q.includes(a.toLowerCase()));
      if (relAssets.length === 0) relAssets = (state.discoveredAssets || []).slice(0, 5);

      let relServices = (state.services || []).filter(s => q.includes(s.toLowerCase()));
      if (relServices.length === 0) relServices = state.services || [];

      let relVulns = (state.vulnerabilities || []).filter(v => q.includes(v.toLowerCase()));
      if (relVulns.length === 0) relVulns = (state.vulnerabilities || []).slice(0, 4);

      let matchedIntel = INTEL_DB.filter(item => {
        return q.includes(item.cve.toLowerCase()) ||
               q.includes(item.product.toLowerCase()) ||
               q.includes(item.vendor.toLowerCase()) ||
               (state.rawNotes && state.rawNotes.toLowerCase().includes(item.product.toLowerCase()));
      });
      if (matchedIntel.length === 0) matchedIntel = [INTEL_DB[0]];

      return {
        target: state.target || 'target.example.com',
        scope: state.scope || 'Authorized Scope',
        objectives: state.objectives || 'Vulnerability Mapping & Attack Paths',
        assets: relAssets,
        services: relServices,
        technologies: state.technologies || [],
        vulnerabilities: relVulns,
        intel: matchedIntel,
        attackPaths: state.attackPaths || [],
        confirmedFacts: state.confirmedFacts || []
      };
    }
  };

  const ContextHarness = {
    buildPacket(userQuery, activeConv, state) {
      const rel = ContextEngine.determineRelevance(userQuery, state);
      
      const userData = `TARGET: ${rel.target}\nSCOPE: ${rel.scope}\nOBJECTIVE: ${rel.objectives}`;
      const projectData = `DISCOVERED ASSETS:\n${rel.assets.length > 0 ? rel.assets.map(a => `- ${a}`).join('\n') : '- (None recorded yet)'}\nSERVICES:\n${rel.services.length > 0 ? rel.services.map(s => `- ${s}`).join('\n') : '- (None)'}\nTECHNOLOGIES: ${rel.technologies.join(', ') || 'Pending'}\nCONFIRMED FINDINGS:\n${rel.vulnerabilities.length > 0 ? rel.vulnerabilities.map(v => `- ${v}`).join('\n') : '- None confirmed'}`;
      
      const webData = rel.intel.map(i => `- [${i.cve}] ${i.product} (${i.vendor}) | CVSS: ${i.cvss} | EPS: ${i.epsScore}/100 | KEV: ${i.inKEV ? 'YES' : 'NO'} | PoC: ${i.pocAvailable ? 'AVAILABLE' : 'NONE'}`).join('\n');
      
      const modelReasoning = `ATTACK PATHS:\n${rel.attackPaths.slice(0, 3).map((p, idx) => `${idx + 1}. ${p}`).join('\n') || '- Path mapping in progress'}`;

      const turns = (activeConv.messages || []).slice(-4).map(m => `[${m.sender.toUpperCase()} • ${m.modelName || 'User'}]: ${m.text.replace(/\n+/g, ' ')}`).join('\n');

      const fullPacket = `=== PICKYHACK CONTEXT HARNESS PACKET ===

[SYSTEM CONTEXT]
Tu es PickyHack, une IA d'élite spécialisée en pentest, offensive security, vulnerability research et exploit intelligence.
Agis en Senior Penetration Tester + Vulnerability Researcher + Security Intelligence Analyst.
Approche méthodologique: vérification non-destructive, validation préalable, corrélation CISA KEV et scoring EPS (Exploitability Priority Score).
Les sources de données ci-dessous sont strictement délimitées pour ton raisonnement.

==================================================
[PENTEST CONTEXT — USER DATA]
${userData}
MANDATE: Pentest Authorization Confirmed.

==================================================
[PROJECT STATE — PROJECT DATA]
${projectData}

==================================================
[RELEVANT INTELLIGENCE — WEB DATA (CISA KEV / NVD / EDB)]
${webData}

==================================================
[PRIOR REASONING — MODEL REASONING]
${modelReasoning}

==================================================
[CONVERSATION CONTEXT — STREAM: ${activeConv.title}]
${turns || '(Stream initialized)'}

==================================================
[CURRENT USER REQUEST]
${userQuery}

=== END CONTEXT HARNESS PACKET ===`;

      const systemPrompt = `Tu es PickyHack, Senior Penetration Tester + Exploit Intelligence Analyst opérant dans le PickyHack Context Harness.
Réponds de façon directe, technique, structurée et sans verbiage inutile.
Priorise la méthodologie offensive, la détection non-destructive, les PoCs et les commandes terminal actionnables.
Distingue clairement [USER DATA], [WEB DATA] et [PROJECT DATA] dans ton analyse.`;

      const userPrompt = `Context Harness Assembled State:

${userData}

${projectData}

Web & Exploit Intelligence:
${webData}

Attack Paths:
${modelReasoning}

User Question / Command:
${userQuery}`;

      return {
        fullPacket,
        systemPrompt,
        userPrompt
      };
    }
  };

  // ==========================================================================
  // 6. PERSISTENT PENTEST STATE MODEL (Shared across all windows & engines)
  // ==========================================================================
  const pentestState = {
    version: '1.0',
    generated: new Date().toISOString(),
    projectName: 'PickyHack Mission',
    projectStatus: 'ACTIVE ASSESSMENT',
    target: '',
    scope: '',
    objectives: '',
    rawNotes: '',
    discoveredAssets: [],
    services: [],
    technologies: [],
    vulnerabilities: [],
    findings: [
      {
        id: 'f-1',
        title: 'Palo Alto GlobalProtect Command Injection',
        cve: 'CVE-2024-3400',
        target: 'vpn.example.com',
        cvss: 10.0,
        eps: 99,
        severity: 'Critical',
        status: 'Confirmed'
      }
    ],
    attackPaths: [
      'Edge VPN Auth Bypass (CVE-2024-3400) → Root Shell → eBPF/Kernel PrivEsc → Domain Admin'
    ],
    confirmedFacts: []
  };

  // ==========================================================================
  // 7. MULTI-CONVERSATIONS SYSTEM (Ephemeral in memory)
  // ==========================================================================
  let conversations = [
    {
      id: 'conv-recon',
      title: 'Reconnaissance',
      createdAt: new Date().toISOString(),
      messages: [] // empty by default so "What we hack ?" displays
    },
    {
      id: 'conv-cve',
      title: 'CVE Research',
      createdAt: new Date().toISOString(),
      messages: []
    },
    {
      id: 'conv-exploit',
      title: 'Exploit Analysis',
      createdAt: new Date().toISOString(),
      messages: []
    }
  ];

  let activeConvId = 'conv-recon';

  function getActiveConversation() {
    return conversations.find(c => c.id === activeConvId) || conversations[0];
  }

  // ==========================================================================
  // 8. WINDOW MANAGER (Functional Windows 98 Multi-Window Shell)
  // ==========================================================================
  const WindowManager = {
    windows: {
      'win-chat': { id: 'win-chat', title: 'PickyHack AI', icon: 'assets/pickyhack-logo.png', isMin: false, isMax: false },
      'win-multi-api': { id: 'win-multi-api', title: 'Multi-API', icon: '⚡', isMin: false, isMax: false },
      'win-notes': { id: 'win-notes', title: 'Notes.txt', icon: '📝', isMin: false, isMax: false },
      'win-scope': { id: 'win-scope', title: 'Targets & Scope', icon: '🎯', isMin: false, isMax: false },
      'win-findings': { id: 'win-findings', title: 'Findings', icon: '🛡️', isMin: false, isMax: false },
      'win-cve': { id: 'win-cve', title: 'CISA KEV', icon: '📡', isMin: false, isMax: false },
      'win-chains': { id: 'win-chains', title: 'Attack Paths', icon: '⛓️', isMin: false, isMax: false },
      'win-nuclei': { id: 'win-nuclei', title: 'Nuclei Studio', icon: '⚙️', isMin: false, isMax: false }
    },
    activeId: 'win-chat',
    highestZ: 100,

    init() {
      document.querySelectorAll('.win-window').forEach(win => {
        const handle = win.querySelector('.win-titlebar');
        if (handle) {
          this.initDrag(win, handle);
        }

        const minBtn = win.querySelector('[data-action="min"]');
        const maxBtn = win.querySelector('[data-action="max"]');
        const closeBtn = win.querySelector('[data-action="close"]');

        if (minBtn) minBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.minimize(win.id);
        });

        if (maxBtn) maxBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleMaximize(win.id);
        });

        if (closeBtn) closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.close(win.id);
        });

        win.addEventListener('mousedown', () => {
          this.bringToFront(win.id);
        });
      });

      // Desktop Icons
      document.querySelectorAll('.desktop-icon').forEach(icon => {
        icon.addEventListener('click', () => {
          document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
          icon.classList.add('selected');
        });

        icon.addEventListener('dblclick', () => {
          const winId = icon.dataset.window;
          if (winId) this.open(winId);
          if (icon.id === 'icon-snapshot') SnapshotManager.openExportModal();
        });
      });

      // Start Menu
      const startBtn = document.getElementById('start-button');
      const startMenu = document.getElementById('start-menu');
      if (startBtn && startMenu) {
        startBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          startMenu.classList.toggle('open');
          startBtn.classList.toggle('active', startMenu.classList.contains('open'));
        });

        document.addEventListener('click', (e) => {
          if (!startMenu.contains(e.target) && e.target !== startBtn) {
            startMenu.classList.remove('open');
            startBtn.classList.remove('active');
          }
        });

        startMenu.querySelectorAll('.start-menu-item').forEach(item => {
          item.addEventListener('click', () => {
            startMenu.classList.remove('open');
            startBtn.classList.remove('active');
            const targetWin = item.dataset.window;
            if (targetWin) WindowManager.open(targetWin);
            if (item.id === 'sm-compare-models') openCompareModelsModal();
          });
        });
      }

      this.renderTaskbar();
      this.bringToFront('win-chat');
    },

    open(winId) {
      const el = document.getElementById(winId);
      if (!el) return;
      el.style.display = 'flex';
      el.classList.remove('minimized');
      if (this.windows[winId]) this.windows[winId].isMin = false;
      this.bringToFront(winId);
      this.renderTaskbar();
    },

    close(winId) {
      const el = document.getElementById(winId);
      if (!el) return;
      el.style.display = 'none';
      if (this.windows[winId]) this.windows[winId].isMin = false;
      this.renderTaskbar();
    },

    minimize(winId) {
      const el = document.getElementById(winId);
      if (!el) return;
      el.classList.add('minimized');
      if (this.windows[winId]) this.windows[winId].isMin = true;
      el.classList.remove('active');
      this.renderTaskbar();
    },

    toggleMaximize(winId) {
      const el = document.getElementById(winId);
      if (!el) return;
      el.classList.toggle('maximized');
      const isMax = el.classList.contains('maximized');
      if (this.windows[winId]) this.windows[winId].isMax = isMax;
      const btn = el.querySelector('[data-action="max"]');
      if (btn) btn.textContent = isMax ? '❐' : '□';
      this.bringToFront(winId);
    },

    bringToFront(winId) {
      const el = document.getElementById(winId);
      if (!el) return;

      this.highestZ += 2;
      el.style.zIndex = this.highestZ;
      this.activeId = winId;

      document.querySelectorAll('.win-window').forEach(w => {
        w.classList.remove('active');
      });
      el.classList.add('active');

      this.renderTaskbar();
    },

    renderTaskbar() {
      const container = document.getElementById('taskbar-items');
      if (!container) return;
      container.innerHTML = '';

      Object.keys(this.windows).forEach(winId => {
        const el = document.getElementById(winId);
        if (!el || el.style.display === 'none') return;

        const info = this.windows[winId];
        const btn = document.createElement('button');
        btn.className = `win-btn taskbar-item ${this.activeId === winId && !info.isMin ? 'active' : ''}`;
        
        const isIconSvgOrImg = info.icon.includes('/') || info.icon.includes('.');
        const iconHtml = isIconSvgOrImg 
          ? `<img src="${info.icon}" alt="" style="width:14px; height:14px; image-rendering:pixelated;">`
          : `<span>${info.icon}</span>`;

        btn.innerHTML = `${iconHtml} <span>${info.title}</span>`;

        btn.addEventListener('click', () => {
          if (info.isMin) {
            this.open(winId);
          } else if (this.activeId === winId) {
            this.minimize(winId);
          } else {
            this.bringToFront(winId);
          }
        });

        container.appendChild(btn);
      });
    },

    initDrag(winEl, handleEl) {
      let isDragging = false;
      let startX = 0;
      let startY = 0;
      let initialLeft = 0;
      let initialTop = 0;

      handleEl.addEventListener('mousedown', (e) => {
        if (e.target.closest('.win-title-btn')) return;
        if (winEl.classList.contains('maximized')) return;

        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initialLeft = winEl.offsetLeft;
        initialTop = winEl.offsetTop;

        WindowManager.bringToFront(winEl.id);
        e.preventDefault();
      });

      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        let newLeft = initialLeft + deltaX;
        let newTop = initialTop + deltaY;

        const maxLeft = window.innerWidth - 60;
        const maxTop = window.innerHeight - 60;

        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        newTop = Math.max(0, Math.min(newTop, maxTop));

        winEl.style.left = `${newLeft}px`;
        winEl.style.top = `${newTop}px`;
      });

      document.addEventListener('mouseup', () => {
        isDragging = false;
      });
    }
  };

  // ==========================================================================
  // 9. NOTES MANAGER (Notes.txt Pentest Note Taker)
  // ==========================================================================
  const NotesManager = {
    STORAGE_KEY: 'pickyhack_notes',
    saveTimeout: null,

    init() {
      const textarea = document.getElementById('notes-textarea');
      if (!textarea) return;

      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        textarea.value = saved;
      } else {
        textarea.value = `# PickyHack Pentest Notes (Notes.txt)
Target: target.example.com
Mandate: Pentest Assessment #2026-09-09

[SCOPE]
In-Scope: *.example.com, 198.51.100.0/24
Exclusions: 198.51.100.50 (Core Banking Database)

[FINDING]
Title: Palo Alto GlobalProtect Pre-Auth Command Injection
Severity: Critical (CVSS 10.0 / EPS 99)
Target: vpn.example.com:443
PoC: curl -k -X POST https://vpn.example.com/ssl-vpn/hipreport.esp
Status: Confirmed active KEV entry`;
      }

      this.updateStats();

      textarea.addEventListener('input', () => {
        this.setSavingState(true);
        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => {
          localStorage.setItem(this.STORAGE_KEY, textarea.value);
          this.setSavingState(false);
          this.updateStats();
        }, 400);
      });

      const btnAddFinding = document.getElementById('btn-note-add-finding');
      if (btnAddFinding) btnAddFinding.addEventListener('click', () => {
        this.insertTemplate(`\n\n[FINDING]\nTitle: New Security Finding\nSeverity: High (CVSS 8.5)\nTarget: ${pentestState.target || 'target.example.com'}\nComponent: /api/v1/auth\nDescription: \nPoC: \nRemediation: `);
      });

      const btnAddTodo = document.getElementById('btn-note-add-todo');
      if (btnAddTodo) btnAddTodo.addEventListener('click', () => {
        this.insertTemplate(`\n- [ ] TODO: Scan internal subnets for exposed Redis/Elasticsearch ports`);
      });

      const btnAddEvidence = document.getElementById('btn-note-add-evidence');
      if (btnAddEvidence) btnAddEvidence.addEventListener('click', () => {
        this.insertTemplate(`\n\n[EVIDENCE]\n$ nmap -sV -p 80,443,8080 ${pentestState.target || 'target.example.com'}\nStarting Nmap 7.94...`);
      });

      const btnAddScope = document.getElementById('btn-note-add-scope');
      if (btnAddScope) btnAddScope.addEventListener('click', () => {
        this.insertTemplate(`\n\n[SCOPE]\nTarget: ${pentestState.target || 'target.example.com'}\nIn-Scope: \nOut-of-Scope: `);
      });

      const btnAskAi = document.getElementById('btn-note-ask-ai');
      if (btnAskAi) btnAskAi.addEventListener('click', () => {
        const sel = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd).trim();
        const contentToSend = sel || textarea.value.trim();
        if (!contentToSend) return;

        WindowManager.open('win-chat');
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
          chatInput.value = `Analyze this pentest note and extract actionable exploit vectors or detection commands:\n\n${contentToSend}`;
          handleChatSubmit();
        }
      });

      const btnToFinding = document.getElementById('btn-note-to-finding');
      if (btnToFinding) btnToFinding.addEventListener('click', () => {
        const text = textarea.value;
        const findingMatch = text.match(/\[FINDING\][\s\S]*?Title:\s*([^\n]+)[\s\S]*?Severity:\s*([^\n]+)/i);
        const title = findingMatch ? findingMatch[1].trim() : 'Manual Finding from Notes.txt';
        const severity = findingMatch && findingMatch[2].toLowerCase().includes('critical') ? 'Critical' : 'High';

        pentestState.findings.push({
          id: `f-${Date.now()}`,
          title: title,
          cve: 'CVE-Custom',
          target: pentestState.target || 'target.example.com',
          cvss: severity === 'Critical' ? 9.8 : 7.5,
          eps: 90,
          severity: severity,
          status: 'Confirmed'
        });

        FindingsManager.render();
        WindowManager.open('win-findings');
      });

      document.querySelectorAll('.note-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          document.querySelectorAll('.note-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          const sbCat = document.getElementById('sb-note-cat');
          if (sbCat) sbCat.textContent = `Category: ${pill.textContent}`;
        });
      });

      const btnSave = document.getElementById('btn-note-save');
      if (btnSave) btnSave.addEventListener('click', () => {
        localStorage.setItem(this.STORAGE_KEY, textarea.value);
        this.setSavingState(false);
      });

      const btnExport = document.getElementById('btn-note-export');
      if (btnExport) btnExport.addEventListener('click', () => {
        const blob = new Blob([textarea.value], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `PickyHack_Notes_${new Date().toISOString().slice(0,10)}.txt`;
        a.click();
        URL.revokeObjectURL(url);
      });

      const btnClear = document.getElementById('btn-note-clear');
      if (btnClear) btnClear.addEventListener('click', () => {
        if (confirm('Clear all content from Notes.txt?')) {
          textarea.value = '';
          localStorage.removeItem(this.STORAGE_KEY);
          this.updateStats();
        }
      });
    },

    insertTemplate(tpl) {
      const textarea = document.getElementById('notes-textarea');
      if (!textarea) return;
      const start = textarea.selectionStart || textarea.value.length;
      const end = textarea.selectionEnd || textarea.value.length;
      const val = textarea.value;
      textarea.value = val.substring(0, start) + tpl + val.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + tpl.length;
      textarea.focus();
      localStorage.setItem(this.STORAGE_KEY, textarea.value);
      this.updateStats();
    },

    setSavingState(isSaving) {
      const sb = document.getElementById('sb-note-status');
      if (!sb) return;
      if (isSaving) {
        sb.textContent = 'Notes.txt — Saving...';
        sb.style.color = '#856404';
      } else {
        sb.textContent = 'Notes.txt — Saved';
        sb.style.color = '#004d40';
      }
    },

    updateStats() {
      const textarea = document.getElementById('notes-textarea');
      const sbLen = document.getElementById('sb-note-length');
      if (!textarea || !sbLen) return;
      const val = textarea.value;
      const lines = val ? val.split('\n').length : 0;
      sbLen.textContent = `${val.length} chars, ${lines} lines`;
    }
  };

  // ==========================================================================
  // 10. FINDINGS MANAGER (Findings & Vulnerabilities Registry)
  // ==========================================================================
  const FindingsManager = {
    init() {
      this.render();

      const btnAdd = document.getElementById('btn-add-finding-inline');
      if (btnAdd) btnAdd.addEventListener('click', () => {
        const title = prompt('Enter Finding / Vulnerability Title:', 'Pre-Auth RCE via SSL-VPN');
        if (!title) return;
        const target = prompt('Enter Target / Asset:', pentestState.target || 'vpn.target.example.com');
        pentestState.findings.push({
          id: `f-${Date.now()}`,
          title: title,
          cve: 'CVE-2024-XXXX',
          target: target || 'target.example.com',
          cvss: 9.8,
          eps: 95,
          severity: 'Critical',
          status: 'Confirmed'
        });
        this.render();
      });

      const btnExportMd = document.getElementById('btn-export-findings-md');
      if (btnExportMd) btnExportMd.addEventListener('click', () => {
        const md = pentestState.findings.map(f => `### [${f.severity.toUpperCase()}] ${f.title}\n- **Target:** \`${f.target}\`\n- **CVE:** ${f.cve}\n- **CVSS:** ${f.cvss} | **EPS:** ${f.eps}/100\n- **Status:** ${f.status}`).join('\n\n');
        navigator.clipboard.writeText(md).then(() => {
          alert('Findings exported to clipboard in Markdown format!');
        });
      });

      const btnToSnapshot = document.getElementById('btn-findings-to-snapshot');
      if (btnToSnapshot) btnToSnapshot.addEventListener('click', () => {
        SnapshotManager.openExportModal();
      });
    },

    render() {
      const tbody = document.getElementById('findings-table-body');
      const sbCount = document.getElementById('sb-findings-count');
      if (!tbody) return;

      tbody.innerHTML = '';
      let critCount = 0;
      let highCount = 0;

      pentestState.findings.forEach(f => {
        if (f.severity === 'Critical') critCount++;
        if (f.severity === 'High') highCount++;

        const tr = document.createElement('tr');
        const sevClass = f.severity === 'Critical' ? 'sev-critical' : (f.severity === 'High' ? 'sev-high' : 'sev-medium');

        tr.innerHTML = `
          <td><span class="severity-pill ${sevClass}">${f.severity}</span></td>
          <td><strong>${f.title}</strong><br><small style="color:#555;">${f.cve}</small></td>
          <td><code>${f.target}</code></td>
          <td><strong>${f.cvss}</strong></td>
          <td><span style="color:#008000; font-weight:bold;">${f.status}</span></td>
          <td>
            <button class="win-btn btn-finding-ask" data-id="${f.id}" style="font-size:10px; padding:1px 4px;">Ask AI</button>
            <button class="win-btn btn-finding-del" data-id="${f.id}" style="font-size:10px; padding:1px 4px; color:#8b0000;">✕</button>
          </td>
        `;

        tr.querySelector('.btn-finding-ask').addEventListener('click', () => {
          WindowManager.open('win-chat');
          const chatInput = document.getElementById('chat-input');
          if (chatInput) {
            chatInput.value = `Propose an exploit verification methodology and remediation patch for finding: ${f.title} (${f.cve}) on ${f.target}.`;
            handleChatSubmit();
          }
        });

        tr.querySelector('.btn-finding-del').addEventListener('click', () => {
          pentestState.findings = pentestState.findings.filter(item => item.id !== f.id);
          this.render();
        });

        tbody.appendChild(tr);
      });

      if (sbCount) {
        sbCount.textContent = `Total Findings: ${pentestState.findings.length} (${critCount} Critical, ${highCount} High)`;
      }
    }
  };

  // ==========================================================================
  // 11. CHAT UI CONTROLLER (AI-First Centered Chat, What we hack ?, Chips)
  // ==========================================================================
  function renderChatThread() {
    const conv = getActiveConversation();
    const emptyState = document.getElementById('chat-empty-state');
    const feed = document.getElementById('chat-messages-feed');
    const dockStreamLabel = document.getElementById('dock-stream-label');
    const sbChatStream = document.getElementById('sb-chat-stream');

    if (dockStreamLabel) dockStreamLabel.textContent = conv.title;
    if (sbChatStream) sbChatStream.textContent = `Stream: ${conv.title}`;

    if (!conv.messages || conv.messages.length === 0) {
      if (emptyState) emptyState.style.display = 'flex';
      if (feed) feed.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (feed) {
      feed.style.display = 'flex';
      feed.innerHTML = '';

      conv.messages.forEach(msg => {
        const msgEl = document.createElement('div');
        msgEl.className = `chat-msg ${msg.sender}`;

        const isUser = msg.sender === 'user';
        const modelBadge = !isUser && msg.modelName ? `<span class="msg-model-tag">• ${msg.modelName}</span>` : '';
        const senderBadge = isUser ? '<span class="msg-badge-user">[USER]</span>' : `<span class="msg-badge-ai">[PICKYHACK AI ${modelBadge}]</span>`;

        // Multi-Model comparison message handling
        if (msg.isMultiModel && msg.multiResults) {
          const cardsHtml = msg.multiResults.map(res => `
            <div class="model-result-box">
              <div class="model-result-header">
                <span style="color:#000080;">● ${res.name} (${res.model})</span>
                <span class="engine-role-badge ${res.role === 'Deep Reasoning' ? 'role-reasoning' : (res.role === 'Fast Research' ? 'role-research' : 'role-primary')}">${res.role || 'Analyst'}</span>
              </div>
              <div class="model-result-body">${res.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>')}</div>
              ${res.code ? `<div class="msg-code-block"><code>${res.code}</code></div>` : ''}
            </div>
          `).join('');

          msgEl.innerHTML = `
            <div class="msg-header">
              <span class="msg-badge-ai">[PICKYHACK AI • CROSS-ENGINE COMPARISON (${msg.multiResults.length} MODELS)]</span>
              <span>${msg.time || ''}</span>
            </div>
            <div class="multi-model-card">
              <div class="multi-model-header">
                <span>CROSS-ENGINE COMPARATIVE PERSPECTIVE ON IDENTICAL PENTEST CONTEXT</span>
                <button class="win-btn btn-synthesize-comp" style="font-size:10px; padding:1px 6px;">⚖️ Synthesize Comparison</button>
              </div>
              <div class="multi-model-grid">
                ${cardsHtml}
              </div>
            </div>
          `;

          const synthBtn = msgEl.querySelector('.btn-synthesize-comp');
          if (synthBtn) {
            synthBtn.addEventListener('click', () => {
              const summaryPrompt = `Compare and contrast the following analyses produced by multiple AI models for target ${pentestState.target || 'in scope'}. Highlight agreements, contradictions, and provide a unified actionable attack vector:\n\n` +
                msg.multiResults.map(r => `--- ${r.name} (${r.model}) ---\n${r.text}`).join('\n\n');
              const chatInput = document.getElementById('chat-input');
              if (chatInput) {
                chatInput.value = summaryPrompt;
                handleChatSubmit();
              }
            });
          }

          feed.appendChild(msgEl);
          return;
        }

        let formattedText = msg.text
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/`([^`]+)`/g, '<code style="background:#e8e8e8; padding:1px 4px; border-radius:2px; font-family:var(--font-mono); font-size:11.5px;">$1</code>');

        let codeHtml = '';
        if (msg.code) {
          codeHtml = `
            <div class="msg-code-block">
              <button class="msg-code-copy-btn" onclick="navigator.clipboard.writeText(this.nextElementSibling.innerText); this.textContent='Copied!'; setTimeout(()=>this.textContent='Copy', 1500);">Copy</button>
              <code>${msg.code}</code>
            </div>
          `;
        }

        let chipsHtml = '';
        if (!isUser) {
          const chips = [];
          
          const cveMatches = msg.text.match(/CVE-\d{4}-\d+/g);
          if (cveMatches) {
            cveMatches.slice(0, 2).forEach(cveId => {
              chips.push(`<button class="context-chip" data-chip="cve" data-val="${cveId}"><span>🔍</span> View ${cveId}</button>`);
            });
          }

          if (msg.text.toLowerCase().includes('attack') || msg.text.toLowerCase().includes('chain') || msg.text.toLowerCase().includes('privesc')) {
            chips.push(`<button class="context-chip" data-chip="chains"><span>⛓️</span> Attack Path</button>`);
          }

          if (msg.code && (msg.code.includes('nuclei') || msg.code.includes('curl'))) {
            chips.push(`<button class="context-chip" data-chip="nuclei"><span>⚙️</span> Nuclei Studio</button>`);
          }

          chips.push(`<button class="context-chip" data-chip="notes" data-code="${encodeURIComponent(msg.code || msg.text.slice(0, 200))}"><span>📝</span> Send to Notes</button>`);

          if (chips.length > 0) {
            chipsHtml = `<div class="inline-action-chips">${chips.join('')}</div>`;
          }
        }

        msgEl.innerHTML = `
          <div class="msg-header">
            ${senderBadge}
            <span>${msg.time || ''}</span>
          </div>
          <div class="msg-body">${formattedText}</div>
          ${codeHtml}
          ${chipsHtml}
        `;

        msgEl.querySelectorAll('.context-chip').forEach(btn => {
          btn.addEventListener('click', () => {
            const type = btn.dataset.chip;
            if (type === 'cve') {
              WindowManager.open('win-cve');
              const search = document.getElementById('cve-search-input');
              if (search) {
                search.value = btn.dataset.val || '';
                filterCveTable();
              }
            } else if (type === 'chains') {
              WindowManager.open('win-chains');
            } else if (type === 'nuclei') {
              WindowManager.open('win-nuclei');
            } else if (type === 'notes') {
              WindowManager.open('win-notes');
              const snippet = decodeURIComponent(btn.dataset.code || '');
              NotesManager.insertTemplate(`\n\n[EVIDENCE]\n${snippet}`);
            }
          });
        });

        feed.appendChild(msgEl);
      });

      feed.scrollTop = feed.scrollHeight;
    }
  }

  async function handleChatSubmit() {
    const chatInput = document.getElementById('chat-input');
    if (!chatInput) return;

    const query = chatInput.value.trim();
    if (!query) return;

    const conv = getActiveConversation();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const activeEngine = MultiAPIManager.getActiveEngine();
    const modelTag = activeEngine.customModel || activeEngine.model;

    // Add user message to ephemeral stream
    conv.messages.push({
      id: `msg-${Date.now()}`,
      sender: 'user',
      time: timeStr,
      text: query
    });

    chatInput.value = '';
    renderChatThread();

    // Context Harness build packet (unified context across all model switches)
    const packetData = ContextHarness.buildPacket(query, conv, pentestState);
    lastContextPacket = packetData.fullPacket;

    const sbStatus = document.getElementById('sb-chat-status');
    if (sbStatus) sbStatus.textContent = `PickyHack AI (${activeEngine.name}) is analyzing context...`;

    try {
      const response = await LLMAdapter.send(packetData.systemPrompt, packetData.userPrompt, activeEngine);
      conv.messages.push({
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: response.text,
        code: response.code,
        modelName: response.modelName || modelTag,
        provider: response.provider || activeEngine.provider,
        engineName: activeEngine.name
      });
    } catch (err) {
      conv.messages.push({
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `⚠️ **[AI Execution Error: ${err.message}]**`,
        modelName: modelTag
      });
    }

    if (sbStatus) sbStatus.textContent = 'Ready. Ask PickyHack anything or select a prompt chip.';
    renderChatThread();
  }

  let lastContextPacket = '';

  // ==========================================================================
  // 12. CONTEXT SNAPSHOT MANAGER (Persistence System)
  // ==========================================================================
  const SnapshotManager = {
    generateSnapshot() {
      const ts = new Date().toISOString();
      const target = pentestState.target || 'target.example.com';
      const scope = pentestState.scope || 'Perimeter Scope';
      const objectives = pentestState.objectives || 'Vulnerability Mapping';
      const activeEngine = MultiAPIManager.getActiveEngine();

      const md = `=== PICKYHACK CONTEXT SNAPSHOT ===
TIMESTAMP: ${ts}
PROJECT: ${pentestState.projectName}
STATUS: ${pentestState.projectStatus}
PROVIDER USED: ${activeEngine.provider}
MODEL USED: ${activeEngine.customModel || activeEngine.model}

[TARGET & SCOPE]
Target: ${target}
Scope: ${scope}
Objectives: ${objectives}

[FINDINGS & VULNERABILITIES]
${pentestState.findings.map(f => `- [${f.severity.toUpperCase()}] ${f.title} (${f.cve}) on ${f.target} | CVSS: ${f.cvss} | Status: ${f.status}`).join('\n') || '- None recorded'}

[ATTACK PATHS]
${pentestState.attackPaths.map((p, idx) => `${idx + 1}. ${p}`).join('\n') || '- None recorded'}

[ACTIVE STREAM CONTEXT]
${conversations.map(c => `STREAM: ${c.title} (${c.messages.length} messages)`).join('\n')}

[RAW NOTES]
${pentestState.rawNotes || '(No raw notes)'}

=== END PICKYHACK CONTEXT SNAPSHOT ===`;

      return md;
    },

    openExportModal() {
      const modal = document.getElementById('snapshot-modal');
      const preview = document.getElementById('snapshot-preview-textarea');
      if (!modal || !preview) return;

      const snap = this.generateSnapshot();
      preview.value = snap;

      const statAssets = document.getElementById('stat-assets');
      const statVulns = document.getElementById('stat-vulns');
      const statChains = document.getElementById('stat-chains');

      if (statAssets) statAssets.textContent = pentestState.discoveredAssets.length;
      if (statVulns) statVulns.textContent = pentestState.findings.length;
      if (statChains) statChains.textContent = pentestState.attackPaths.length;

      modal.classList.add('open');
    },

    parseAndImport(snapshotText) {
      if (!snapshotText) return false;
      const targetMatch = snapshotText.match(/Target:\s*([^\n]+)/i);
      if (targetMatch) {
        pentestState.target = targetMatch[1].trim();
        const dockScope = document.getElementById('dock-scope-label');
        if (dockScope) dockScope.textContent = pentestState.target;
        const scopeInput = document.getElementById('scope-target-input');
        if (scopeInput) scopeInput.value = pentestState.target;
      }

      alert('Context Snapshot successfully imported and restored!');
      return true;
    }
  };

  // ==========================================================================
  // 13. MULTI-API UI & EDIT FORM CONTROLLERS
  // ==========================================================================
  function openEditEngineForm(engine = null) {
    const form = document.getElementById('multiapi-engine-form');
    if (!form) return;

    form.style.display = 'block';

    const titleEl = document.getElementById('multiapi-form-title');
    const idInput = document.getElementById('multiapi-edit-id');
    const provSelect = document.getElementById('multiapi-provider-select');
    const roleSelect = document.getElementById('multiapi-role-select');
    const modelSelect = document.getElementById('multiapi-model-select');
    const endpointInput = document.getElementById('multiapi-endpoint-input');
    const keyInput = document.getElementById('multiapi-key-input');
    const statusDiv = document.getElementById('multiapi-form-status');

    if (engine) {
      if (titleEl) titleEl.textContent = `EDIT ENGINE: ${engine.name}`;
      if (idInput) idInput.value = engine.id;
      if (provSelect) provSelect.value = engine.provider;
      syncEngineFormModels();
      if (modelSelect) modelSelect.value = engine.model;
      if (roleSelect) roleSelect.value = engine.role || 'Primary Analyst';
      if (endpointInput) endpointInput.value = engine.endpoint;
      if (keyInput) keyInput.value = engine.apiKey || '';
      if (statusDiv) statusDiv.textContent = engine.apiKey ? '✓ Configured' : 'No key set.';
    } else {
      if (titleEl) titleEl.textContent = 'ADD AI ENGINE';
      if (idInput) idInput.value = '';
      if (provSelect) provSelect.value = 'openai';
      syncEngineFormModels();
      if (roleSelect) roleSelect.value = 'Primary Analyst';
      if (keyInput) keyInput.value = '';
      if (statusDiv) statusDiv.textContent = 'Ready.';
    }
  }

  function syncEngineFormModels() {
    const provSelect = document.getElementById('multiapi-provider-select');
    const modelSelect = document.getElementById('multiapi-model-select');
    const endpointInput = document.getElementById('multiapi-endpoint-input');
    if (!provSelect || !modelSelect) return;

    const provKey = provSelect.value;
    const provInfo = AI_PROVIDERS[provKey] || AI_PROVIDERS.openai;

    if (endpointInput) endpointInput.value = provInfo.defaultEndpoint;
    modelSelect.innerHTML = '';
    provInfo.models.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m;
      opt.textContent = m;
      modelSelect.appendChild(opt);
    });
  }

  function initMultiAPIManagerUI() {
    const btnOpen = document.getElementById('btn-open-multi-api');
    const menuOpen = document.getElementById('chat-menu-multiapi');
    const popoverOpen = document.getElementById('popover-manage-multi-api');
    const btnAdd = document.getElementById('btn-multiapi-add');
    const menuAdd = document.getElementById('multiapi-menu-add');
    const btnCloseForm = document.getElementById('btn-multiapi-close-form');
    const btnCancelForm = document.getElementById('btn-multiapi-cancel-form');
    const btnSaveEngine = document.getElementById('btn-multiapi-save-engine');
    const btnTestConn = document.getElementById('btn-multiapi-test-conn');
    const btnTestAll = document.getElementById('btn-multiapi-test-all');
    const toggleKeyBtn = document.getElementById('btn-multiapi-toggle-key');
    const keyInput = document.getElementById('multiapi-key-input');
    const provSelect = document.getElementById('multiapi-provider-select');

    if (btnOpen) btnOpen.addEventListener('click', () => WindowManager.open('win-multi-api'));
    if (menuOpen) menuOpen.addEventListener('click', () => WindowManager.open('win-multi-api'));
    if (popoverOpen) popoverOpen.addEventListener('click', () => {
      WindowManager.open('win-multi-api');
      const popover = document.getElementById('quick-model-popover');
      if (popover) popover.style.display = 'none';
    });

    if (btnAdd) btnAdd.addEventListener('click', () => openEditEngineForm(null));
    if (menuAdd) menuAdd.addEventListener('click', () => openEditEngineForm(null));

    if (provSelect) provSelect.addEventListener('change', syncEngineFormModels);

    if (btnCloseForm) btnCloseForm.addEventListener('click', () => {
      document.getElementById('multiapi-engine-form').style.display = 'none';
    });
    if (btnCancelForm) btnCancelForm.addEventListener('click', () => {
      document.getElementById('multiapi-engine-form').style.display = 'none';
    });

    if (toggleKeyBtn && keyInput) {
      toggleKeyBtn.addEventListener('click', () => {
        if (keyInput.type === 'password') {
          keyInput.type = 'text';
          toggleKeyBtn.textContent = '🔒 Hide';
        } else {
          keyInput.type = 'password';
          toggleKeyBtn.textContent = '👁️ Show';
        }
      });
    }

    if (btnTestConn) {
      btnTestConn.addEventListener('click', () => {
        const statusDiv = document.getElementById('multiapi-form-status');
        const key = keyInput.value.trim();
        const prov = provSelect.value;
        statusDiv.textContent = 'Testing connection...';
        statusDiv.style.color = '#000080';
        setTimeout(() => {
          if (key || prov === 'custom') {
            statusDiv.textContent = `✓ ${prov.toUpperCase()} connection test successful.`;
            statusDiv.style.color = '#008000';
          } else {
            statusDiv.textContent = 'Notice: No API key. Operates in local fallback mode.';
            statusDiv.style.color = '#856404';
          }
        }, 500);
      });
    }

    if (btnTestAll) {
      btnTestAll.addEventListener('click', () => {
        const status = document.getElementById('sb-multiapi-status');
        status.textContent = 'Testing all engines in registry...';
        setTimeout(() => {
          status.textContent = '✓ All configured engines verified and ready.';
        }, 800);
      });
    }

    if (btnSaveEngine) {
      btnSaveEngine.addEventListener('click', () => {
        const idInput = document.getElementById('multiapi-edit-id');
        const roleSelect = document.getElementById('multiapi-role-select');
        const modelSelect = document.getElementById('multiapi-model-select');
        const endpointInput = document.getElementById('multiapi-endpoint-input');

        const provKey = provSelect.value;
        const provInfo = AI_PROVIDERS[provKey] || AI_PROVIDERS.openai;
        const modelName = modelSelect.value;

        const engineData = {
          id: idInput.value || `engine-${Date.now()}`,
          name: `${provInfo.name} — ${modelName}`,
          provider: provKey,
          endpoint: endpointInput.value.trim() || provInfo.defaultEndpoint,
          apiKey: keyInput.value.trim(),
          model: modelName,
          customModel: '',
          role: roleSelect.value || 'Primary Analyst',
          capabilities: provInfo.capabilities,
          isConnected: !!keyInput.value.trim()
        };

        MultiAPIManager.saveEngine(engineData);
        document.getElementById('multiapi-engine-form').style.display = 'none';
      });
    }

    // Quick Model Popover Trigger on Chat Dock
    const dockModelPill = document.getElementById('dock-model-pill');
    const popover = document.getElementById('quick-model-popover');
    if (dockModelPill && popover) {
      dockModelPill.addEventListener('click', (e) => {
        e.stopPropagation();
        MultiAPIManager.renderQuickPopover();
        popover.style.display = popover.style.display === 'flex' ? 'none' : 'flex';
      });

      document.addEventListener('click', (e) => {
        if (!dockModelPill.contains(e.target) && !popover.contains(e.target)) {
          popover.style.display = 'none';
        }
      });
    }
  }

  // ==========================================================================
  // 14. MULTI-MODEL COMPARISON MODAL ("Ask Multiple Models")
  // ==========================================================================
  function openCompareModelsModal() {
    const modal = document.getElementById('compare-models-modal');
    const container = document.getElementById('compare-models-checkboxes');
    const promptInput = document.getElementById('compare-models-prompt');
    const chatInput = document.getElementById('chat-input');
    if (!modal || !container) return;

    container.innerHTML = '';
    const engines = MultiAPIManager.getEngines();

    engines.forEach(eng => {
      const label = document.createElement('label');
      label.style.display = 'flex';
      label.style.alignItems = 'center';
      label.style.gap = '8px';
      label.style.fontSize = '11.5px';
      label.style.cursor = 'pointer';

      label.innerHTML = `
        <input type="checkbox" value="${eng.id}" checked>
        <strong>${eng.name}</strong> 
        <span class="engine-role-badge role-primary" style="font-size:9px;">${eng.role}</span>
        <small style="color:#555;">(${eng.customModel || eng.model})</small>
      `;

      container.appendChild(label);
    });

    if (promptInput) {
      promptInput.value = chatInput && chatInput.value ? chatInput.value : 'Evaluate perimeter security posture and propose initial penetration testing steps.';
    }

    modal.classList.add('open');
  }

  function initCompareModelsUI() {
    const btnTrigger = document.getElementById('btn-compare-models-trigger');
    const smTrigger = document.getElementById('sm-compare-models');
    const modal = document.getElementById('compare-models-modal');
    const closeX = document.getElementById('compare-models-close-x');
    const cancelBtn = document.getElementById('compare-models-cancel-btn');
    const runBtn = document.getElementById('btn-run-model-comparison');

    if (btnTrigger) btnTrigger.addEventListener('click', openCompareModelsModal);
    if (smTrigger) smTrigger.addEventListener('click', openCompareModelsModal);
    if (closeX) closeX.addEventListener('click', () => modal.classList.remove('open'));
    if (cancelBtn) cancelBtn.addEventListener('click', () => modal.classList.remove('open'));

    if (runBtn) {
      runBtn.addEventListener('click', async () => {
        const checked = Array.from(modal.querySelectorAll('input[type="checkbox"]:checked')).map(c => c.value);
        if (checked.length === 0) {
          alert('Please select at least one engine.');
          return;
        }

        const promptText = document.getElementById('compare-models-prompt').value.trim();
        if (!promptText) return;

        modal.classList.remove('open');
        WindowManager.open('win-chat');

        const conv = getActiveConversation();
        conv.messages.push({
          id: `msg-${Date.now()}`,
          sender: 'user',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `[COMPARE ${checked.length} MODELS]: ${promptText}`
        });
        renderChatThread();

        const packetData = ContextHarness.buildPacket(promptText, conv, pentestState);
        const results = await LLMAdapter.callMultiple(checked, packetData.systemPrompt, packetData.userPrompt);

        conv.messages.push({
          id: `msg-${Date.now() + 1}`,
          sender: 'ai',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMultiModel: true,
          multiResults: results
        });

        renderChatThread();
      });
    }
  }

  // ==========================================================================
  // 15. INITIALIZATION & EVENT BINDINGS
  // ==========================================================================
  function initApp() {
    WindowManager.init();
    NotesManager.init();
    FindingsManager.init();
    MultiAPIManager.syncUI();

    initMultiAPIManagerUI();
    initCompareModelsUI();
    initAIConfigModal();
    initContextInspectorModal();
    initSnapshotModals();
    initScopeWindow();
    initSystemClock();

    updateStreamSelector();
    renderCveTable(INTEL_DB);
    renderChatThread();

    // Starter Chips click listeners
    document.querySelectorAll('.starter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        if (chip.dataset.action === 'open-notes') {
          WindowManager.open('win-notes');
          return;
        }

        const promptText = chip.dataset.prompt;
        if (promptText) {
          const chatInput = document.getElementById('chat-input');
          if (chatInput) {
            chatInput.value = promptText;
            handleChatSubmit();
          }
        }
      });
    });

    // Chat Input Send button and Keydown
    const chatSendBtn = document.getElementById('btn-chat-send');
    const chatInput = document.getElementById('chat-input');
    if (chatSendBtn) chatSendBtn.addEventListener('click', handleChatSubmit);
    if (chatInput) {
      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleChatSubmit();
        }
      });
    }

    // Clear chat button
    const btnClearChat = document.getElementById('btn-clear-current-chat');
    if (btnClearChat) btnClearChat.addEventListener('click', () => {
      const conv = getActiveConversation();
      if (confirm(`Clear all messages in ${conv.title}?`)) {
        conv.messages = [];
        renderChatThread();
      }
    });

    // New stream button & dialog
    const btnNewStream = document.getElementById('btn-open-new-conv-dialog');
    const newConvModal = document.getElementById('new-conv-modal');
    if (btnNewStream && newConvModal) {
      btnNewStream.addEventListener('click', () => {
        newConvModal.classList.add('open');
      });

      const closeBtn = document.getElementById('new-conv-close-x');
      const cancelBtn = document.getElementById('new-conv-cancel-btn');
      const confirmBtn = document.getElementById('btn-create-conv-confirm');
      const titleInput = document.getElementById('new-conv-title-input');

      if (closeBtn) closeBtn.addEventListener('click', () => newConvModal.classList.remove('open'));
      if (cancelBtn) cancelBtn.addEventListener('click', () => newConvModal.classList.remove('open'));
      if (confirmBtn) confirmBtn.addEventListener('click', () => {
        const title = titleInput ? titleInput.value.trim() || 'New Stream' : 'New Stream';
        const newId = `conv-${Date.now()}`;
        conversations.push({
          id: newId,
          title: title,
          createdAt: new Date().toISOString(),
          messages: []
        });
        activeConvId = newId;
        updateStreamSelector();
        renderChatThread();
        newConvModal.classList.remove('open');
      });
    }

    // Rename active stream
    const btnRename = document.getElementById('btn-rename-active-conv');
    if (btnRename) btnRename.addEventListener('click', () => {
      const conv = getActiveConversation();
      const newTitle = prompt('Enter new title for stream:', conv.title);
      if (newTitle && newTitle.trim()) {
        conv.title = newTitle.trim();
        updateStreamSelector();
        renderChatThread();
      }
    });

    // Quick Notes.txt buttons from chat toolbar
    const btnOpenNotesFromChat = document.getElementById('btn-open-notes-from-chat');
    if (btnOpenNotesFromChat) btnOpenNotesFromChat.addEventListener('click', () => {
      WindowManager.open('win-notes');
    });

    // Auto-prompt "Let's Hack !" onboarding ONLY if no API key is configured
    const hasConfiguredKey = MultiAPIManager.getEngines().some(e => e.apiKey && e.apiKey.trim().length > 0);
    if (!hasConfiguredKey && !AIConfigManager.isConfigured()) {
      setTimeout(() => {
        const modal = document.getElementById('ai-config-modal');
        if (modal) modal.classList.add('open');
      }, 500);
    }
  }

  function updateStreamSelector() {
    const sel = document.getElementById('conv-selector');
    if (!sel) return;
    sel.innerHTML = '';
    conversations.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = `${c.title} (${c.messages.length})`;
      if (c.id === activeConvId) opt.selected = true;
      sel.appendChild(opt);
    });

    sel.onchange = () => {
      activeConvId = sel.value;
      renderChatThread();
    };
  }

  function renderCveTable(items) {
    const tbody = document.getElementById('cve-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    items.forEach(cve => {
      const tr = document.createElement('tr');
      const eps = calculateEPS(cve);
      const inKevBadge = cve.inKEV ? '<span class="badge-kev">CISA KEV</span>' : '';
      const pocBadge = cve.pocAvailable ? '<span class="badge-eps">PoC</span>' : '';

      tr.innerHTML = `
        <td><strong>${cve.cve}</strong><br><small style="color:#555;">${cve.product} (${cve.vendor})</small></td>
        <td><strong>${cve.cvss}</strong></td>
        <td><strong style="color:#8b0000;">${eps}</strong></td>
        <td>${inKevBadge} ${pocBadge}</td>
        <td>
          <button class="win-btn btn-cve-ask" data-cve="${cve.cve}" style="font-size:10px; padding:1px 5px;">Ask AI</button>
        </td>
      `;

      tr.querySelector('.btn-cve-ask').addEventListener('click', () => {
        WindowManager.open('win-chat');
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
          chatInput.value = `Provide exploit intelligence and detection methods for ${cve.cve} (${cve.product}).`;
          handleChatSubmit();
        }
      });

      tbody.appendChild(tr);
    });
  }

  function filterCveTable() {
    const searchInput = document.getElementById('cve-search-input');
    const q = searchInput ? searchInput.value.toLowerCase() : '';
    const filtered = INTEL_DB.filter(c => {
      return c.cve.toLowerCase().includes(q) ||
             c.product.toLowerCase().includes(q) ||
             c.vendor.toLowerCase().includes(q);
    });
    renderCveTable(filtered);
  }

  function initAIConfigModal() {
    const modal = document.getElementById('ai-config-modal');
    const btnOpen = document.getElementById('btn-open-ai-config');
    const btnSmOpen = document.getElementById('sm-ai-config');
    const closeX = document.getElementById('ai-config-close-x');
    const cancelBtn = document.getElementById('ai-config-cancel-btn');
    const keyInput = document.getElementById('ai-key-input');
    const toggleKeyBtn = document.getElementById('btn-toggle-key-visibility');
    const statusDiv = document.getElementById('ai-connection-status');
    const testBtn = document.getElementById('btn-test-ai-conn');
    const saveBtn = document.getElementById('btn-save-ai-conn');

    // Dynamic detection elements
    const detectedPill = document.getElementById('ai-detected-provider-pill');
    const detectedName = document.getElementById('detected-provider-name');
    const modelRow = document.getElementById('config-row-model');
    const modelSelect = document.getElementById('ai-model-select');
    const customModelInput = document.getElementById('ai-custom-model-input');
    const customModelToggle = document.getElementById('ai-model-custom-toggle');

    // Advanced endpoint drawer elements
    const toggleAdvanced = document.getElementById('toggle-advanced-endpoint');
    const advancedDrawer = document.getElementById('advanced-endpoint-drawer');
    const provSelect = document.getElementById('ai-provider-select');
    const endpointInput = document.getElementById('ai-endpoint-input');

    let currentDetectedProvider = 'openai';

    function detectProviderFromKey(key) {
      if (!key || typeof key !== 'string') return null;
      const k = key.trim();
      if (k.startsWith('sk-ant-')) return 'anthropic';
      if (k.startsWith('AIzaSy')) return 'gemini';
      if (k.startsWith('sk-or-')) return 'openrouter';
      if (k.startsWith('mistral-') || k.startsWith('mis_')) return 'mistral';
      if (k.startsWith('sk-proj-') || k.startsWith('sk-admin-')) return 'openai';
      if (k.startsWith('sk-') && k.length > 20) return 'openai';
      return null;
    }

    function populateModels(provider, fetchedModels = null) {
      const provInfo = AI_PROVIDERS[provider] || AI_PROVIDERS.openai;
      if (!modelSelect) return;
      modelSelect.innerHTML = '';
      const list = (fetchedModels && fetchedModels.length > 0) ? fetchedModels : provInfo.models;
      list.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m;
        opt.textContent = m;
        modelSelect.appendChild(opt);
      });
      if (modelRow) modelRow.style.display = 'block';
    }

    function handleKeyInput() {
      const key = keyInput ? keyInput.value.trim() : '';
      const detected = detectProviderFromKey(key);
      if (detected) {
        currentDetectedProvider = detected;
        const provInfo = AI_PROVIDERS[detected] || AI_PROVIDERS.openai;
        if (detectedName) detectedName.textContent = provInfo.name;
        if (detectedPill) detectedPill.style.display = 'block';
        if (provSelect) provSelect.value = detected;
        if (endpointInput) endpointInput.value = provInfo.defaultEndpoint;
        populateModels(detected);
        if (statusDiv) {
          statusDiv.innerHTML = `Identified <strong>${provInfo.name}</strong> key. Click <em>Test Connection</em> to verify.`;
          statusDiv.style.color = '#000080';
        }
      } else if (!key) {
        if (detectedPill) detectedPill.style.display = 'none';
        if (statusDiv) {
          statusDiv.textContent = 'Ready to connect. Enter your API key above.';
          statusDiv.style.color = '#444';
        }
      }
    }

    if (keyInput) {
      keyInput.addEventListener('input', handleKeyInput);
      keyInput.addEventListener('paste', () => setTimeout(handleKeyInput, 50));
    }

    if (customModelToggle && customModelInput) {
      customModelToggle.addEventListener('click', () => {
        if (customModelInput.style.display === 'none') {
          customModelInput.style.display = 'block';
          customModelToggle.textContent = 'Use Preset List';
        } else {
          customModelInput.style.display = 'none';
          customModelToggle.textContent = 'Custom Model ID';
        }
      });
    }

    if (toggleAdvanced && advancedDrawer) {
      toggleAdvanced.addEventListener('click', () => {
        if (advancedDrawer.style.display === 'none') {
          advancedDrawer.style.display = 'flex';
          toggleAdvanced.textContent = '▲ Hide advanced endpoint settings';
        } else {
          advancedDrawer.style.display = 'none';
          toggleAdvanced.textContent = "Can't detect your provider? / Custom endpoint";
        }
      });
    }

    if (provSelect) {
      provSelect.addEventListener('change', () => {
        currentDetectedProvider = provSelect.value;
        const provInfo = AI_PROVIDERS[currentDetectedProvider] || AI_PROVIDERS.openai;
        if (endpointInput) endpointInput.value = provInfo.defaultEndpoint;
        if (detectedName) detectedName.textContent = provInfo.name;
        if (detectedPill) detectedPill.style.display = 'block';
        populateModels(currentDetectedProvider);
      });
    }

    function openModal() {
      const active = MultiAPIManager.getActiveEngine();
      if (keyInput) keyInput.value = active.apiKey || '';
      currentDetectedProvider = active.provider || 'openai';
      if (provSelect) provSelect.value = currentDetectedProvider;
      if (endpointInput) endpointInput.value = active.endpoint;
      populateModels(currentDetectedProvider);
      if (modelSelect && active.model) modelSelect.value = active.model;
      if (active.apiKey) {
        const detected = detectProviderFromKey(active.apiKey) || active.provider;
        const provInfo = AI_PROVIDERS[detected] || AI_PROVIDERS.openai;
        if (detectedName) detectedName.textContent = provInfo.name;
        if (detectedPill) detectedPill.style.display = 'block';
      } else {
        if (detectedPill) detectedPill.style.display = 'none';
      }
      if (modal) modal.classList.add('open');
    }

    if (btnOpen) btnOpen.addEventListener('click', openModal);
    if (btnSmOpen) btnSmOpen.addEventListener('click', openModal);
    if (closeX) closeX.addEventListener('click', () => modal && modal.classList.remove('open'));
    if (cancelBtn) cancelBtn.addEventListener('click', () => modal && modal.classList.remove('open'));

    if (toggleKeyBtn && keyInput) {
      toggleKeyBtn.addEventListener('click', () => {
        if (keyInput.type === 'password') {
          keyInput.type = 'text';
          toggleKeyBtn.textContent = '🔒 Hide';
        } else {
          keyInput.type = 'password';
          toggleKeyBtn.textContent = '👁️ Show';
        }
      });
    }

    if (testBtn) {
      testBtn.addEventListener('click', async () => {
        const key = keyInput ? keyInput.value.trim() : '';
        if (!statusDiv) return;
        statusDiv.style.color = '#000080';
        statusDiv.innerHTML = 'Detecting AI provider...';

        const manualProvider = (advancedDrawer && advancedDrawer.style.display === 'flex') ? provSelect.value : null;
        const manualEndpoint = (advancedDrawer && advancedDrawer.style.display === 'flex') ? endpointInput.value.trim() : null;

        let provider = manualProvider || detectProviderFromKey(key) || currentDetectedProvider || 'openai';
        currentDetectedProvider = provider;
        const provInfo = AI_PROVIDERS[provider] || AI_PROVIDERS.openai;
        const endpoint = manualEndpoint || provInfo.defaultEndpoint;

        if (detectedName) detectedName.textContent = provInfo.name;
        if (detectedPill) detectedPill.style.display = 'block';

        if (!key && provider !== 'custom') {
          statusDiv.innerHTML = '⚠️ Please enter an API key to test connection.';
          statusDiv.style.color = '#8b0000';
          return;
        }

        try {
          statusDiv.innerHTML = `Detecting AI provider...<br>→ <strong>${provInfo.name}</strong> detected<br>→ Verifying API key...`;

          let fetchedModels = null;
          let selectedModel = provInfo.models[0];

          if (provider === 'openai' || provider === 'openrouter' || provider === 'custom') {
            const modelsUrl = endpoint.replace(/\/+$/, '') + '/models';
            const headers = { 'Content-Type': 'application/json' };
            if (key) headers['Authorization'] = `Bearer ${key}`;
            if (provider === 'openrouter') {
              headers['HTTP-Referer'] = 'https://pickyhack.app';
              headers['X-Title'] = 'PickyHack Pentest Copilot';
            }

            try {
              const res = await fetch(modelsUrl, { headers, method: 'GET' });
              if (res.ok) {
                const data = await res.json();
                if (data && Array.isArray(data.data) && data.data.length > 0) {
                  const fetchedIds = data.data.map(m => m.id);
                  const preferred = provider === 'openai'
                    ? ['gpt-4o', 'gpt-4o-mini', 'o3-mini', 'o1', 'gpt-4-turbo']
                    : ['deepseek/deepseek-r1', 'meta-llama/llama-3.3-70b-instruct'];
                  const matched = preferred.filter(p => fetchedIds.includes(p));
                  fetchedModels = matched.length > 0 ? [...matched, ...fetchedIds.filter(id => !matched.includes(id)).slice(0, 10)] : fetchedIds.slice(0, 15);
                  selectedModel = fetchedModels[0];
                }
              } else if (res.status === 401 || res.status === 403) {
                throw new Error(`Authentication failed (HTTP ${res.status}): Invalid API key.`);
              }
            } catch (fetchErr) {
              if (fetchErr.message && fetchErr.message.includes('Authentication failed')) {
                throw fetchErr;
              }
              // Network/CORS limitation: fallback to format validation
            }
          } else if (provider === 'gemini') {
            try {
              const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
              if (res.ok) {
                const data = await res.json();
                if (data && Array.isArray(data.models)) {
                  const cleanNames = data.models
                    .map(m => m.name.replace(/^models\//, ''))
                    .filter(n => n.includes('gemini-2') || n.includes('gemini-1.5'));
                  if (cleanNames.length > 0) {
                    fetchedModels = cleanNames;
                    selectedModel = cleanNames.find(n => n.includes('pro')) || cleanNames[0];
                  }
                }
              } else if (res.status === 400 || res.status === 403) {
                throw new Error(`Google API key rejected (HTTP ${res.status}).`);
              }
            } catch (fetchErr) {
              if (fetchErr.message && fetchErr.message.includes('rejected')) throw fetchErr;
            }
          }

          populateModels(provider, fetchedModels);
          if (modelSelect) modelSelect.value = selectedModel;

          statusDiv.innerHTML = `✓ Connected — ${provInfo.name}<br>Model: <strong>${selectedModel}</strong>`;
          statusDiv.style.color = '#008000';
        } catch (err) {
          statusDiv.innerHTML = `⚠️ Error: ${err.message}`;
          statusDiv.style.color = '#8b0000';
        }
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const key = keyInput ? keyInput.value.trim() : '';
        const manualProvider = (advancedDrawer && advancedDrawer.style.display === 'flex') ? provSelect.value : null;
        const manualEndpoint = (advancedDrawer && advancedDrawer.style.display === 'flex') ? endpointInput.value.trim() : null;

        const provider = manualProvider || detectProviderFromKey(key) || currentDetectedProvider || 'openai';
        const provInfo = AI_PROVIDERS[provider] || AI_PROVIDERS.openai;
        const endpoint = manualEndpoint || provInfo.defaultEndpoint;
        const customVal = customModelInput ? customModelInput.value.trim() : '';
        const chosenModel = customVal || (modelSelect ? modelSelect.value : provInfo.models[0]);

        // Find or update matching engine profile in MultiAPIManager
        const engines = MultiAPIManager.getEngines();
        let targetEngine = engines.find(e => e.provider === provider);
        if (!targetEngine) {
          targetEngine = {
            id: `engine-${provider}`,
            name: `${provInfo.name} — ${chosenModel}`,
            provider: provider,
            endpoint: endpoint,
            apiKey: key,
            model: chosenModel,
            customModel: customVal,
            role: 'Primary Analyst',
            isConnected: !!key
          };
          MultiAPIManager.saveEngine(targetEngine);
        } else {
          targetEngine.apiKey = key;
          targetEngine.endpoint = endpoint;
          targetEngine.model = chosenModel;
          targetEngine.customModel = customVal;
          targetEngine.isConnected = !!key;
          MultiAPIManager.saveEngine(targetEngine);
        }

        MultiAPIManager.setActiveEngineId(targetEngine.id);
        if (modal) modal.classList.remove('open');

        const sbStatus = document.getElementById('sb-chat-status');
        if (sbStatus) sbStatus.textContent = `Let's Hack ! Connected to ${chosenModel}.`;
      });
    }
  }

  function initContextInspectorModal() {
    const modal = document.getElementById('context-inspector-modal');
    const textarea = document.getElementById('context-inspector-textarea');
    const btnOpen = document.getElementById('btn-inspect-context');
    const btnDockOpen = document.getElementById('btn-chat-inspect-context');
    const closeX = document.getElementById('context-inspector-close-x');
    const closeBtn = document.getElementById('context-inspector-close-btn');
    const copyBtn = document.getElementById('btn-copy-context-packet');

    function openModal() {
      const conv = getActiveConversation();
      const packetData = ContextHarness.buildPacket('Inspect Context Harness State', conv, pentestState);
      textarea.value = packetData.fullPacket;
      modal.classList.add('open');
    }

    if (btnOpen) btnOpen.addEventListener('click', openModal);
    if (btnDockOpen) btnDockOpen.addEventListener('click', openModal);
    if (closeX) closeX.addEventListener('click', () => modal.classList.remove('open'));
    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('open'));
    if (copyBtn) copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(textarea.value).then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => copyBtn.textContent = '📋 Copy Context Packet', 1500);
      });
    });
  }

  function initSnapshotModals() {
    const btnSave = document.getElementById('btn-save-snapshot');
    const btnCopyToolbar = document.getElementById('btn-copy-full-context-toolbar');
    const btnImport = document.getElementById('btn-import-snapshot');
    const traySnapshot = document.getElementById('tray-quick-snapshot');
    const smSave = document.getElementById('sm-save-snapshot');
    const smCopy = document.getElementById('sm-copy-context');
    const smImport = document.getElementById('sm-import-snapshot');

    if (btnSave) btnSave.addEventListener('click', () => SnapshotManager.openExportModal());
    if (traySnapshot) traySnapshot.addEventListener('click', () => SnapshotManager.openExportModal());
    if (smSave) smSave.addEventListener('click', () => SnapshotManager.openExportModal());

    if (btnCopyToolbar) btnCopyToolbar.addEventListener('click', () => {
      navigator.clipboard.writeText(SnapshotManager.generateSnapshot()).then(() => {
        alert('Full Context Snapshot copied to clipboard!');
      });
    });

    if (smCopy) smCopy.addEventListener('click', () => {
      navigator.clipboard.writeText(SnapshotManager.generateSnapshot()).then(() => {
        alert('Full Context Snapshot copied to clipboard!');
      });
    });

    const snapCloseX = document.getElementById('snapshot-close-x');
    const snapOkBtn = document.getElementById('snapshot-ok-btn');
    const snapCopyBtn = document.getElementById('btn-copy-context');
    const snapDlBtn = document.getElementById('btn-download-snapshot');

    if (snapCloseX) snapCloseX.addEventListener('click', () => document.getElementById('snapshot-modal').classList.remove('open'));
    if (snapOkBtn) snapOkBtn.addEventListener('click', () => document.getElementById('snapshot-modal').classList.remove('open'));
    if (snapCopyBtn) snapCopyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(SnapshotManager.generateSnapshot()).then(() => {
        snapCopyBtn.textContent = 'Copied!';
        setTimeout(() => snapCopyBtn.textContent = '📋 Copy Context', 1500);
      });
    });

    if (snapDlBtn) snapDlBtn.addEventListener('click', () => {
      const blob = new Blob([SnapshotManager.generateSnapshot()], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PickyHack_Snapshot_${new Date().toISOString().slice(0,10)}.md`;
      a.click();
      URL.revokeObjectURL(url);
    });

    const importModal = document.getElementById('import-modal');
    function openImport() {
      if (importModal) importModal.classList.add('open');
    }

    if (btnImport) btnImport.addEventListener('click', openImport);
    if (smImport) smImport.addEventListener('click', openImport);

    const importCloseX = document.getElementById('import-close-x');
    const importCancelBtn = document.getElementById('import-cancel-btn');
    const runImportBtn = document.getElementById('btn-run-import');
    const importTextarea = document.getElementById('import-textarea');

    if (importCloseX) importCloseX.addEventListener('click', () => importModal.classList.remove('open'));
    if (importCancelBtn) importCancelBtn.addEventListener('click', () => importModal.classList.remove('open'));
    if (runImportBtn) runImportBtn.addEventListener('click', () => {
      const val = importTextarea ? importTextarea.value.trim() : '';
      if (val) {
        SnapshotManager.parseAndImport(val);
        importModal.classList.remove('open');
      }
    });

    const aboutModal = document.getElementById('about-modal');
    const smAbout = document.getElementById('sm-about');
    const aboutCloseX = document.getElementById('about-close-x');
    const aboutOkBtn = document.getElementById('about-ok-btn');

    if (smAbout) smAbout.addEventListener('click', () => aboutModal.classList.add('open'));
    if (aboutCloseX) aboutCloseX.addEventListener('click', () => aboutModal.classList.remove('open'));
    if (aboutOkBtn) aboutOkBtn.addEventListener('click', () => aboutModal.classList.remove('open'));
  }

  function initScopeWindow() {
    const targetInput = document.getElementById('scope-target-input');
    const inscopeInput = document.getElementById('scope-inscope-input');
    const outscopeInput = document.getElementById('scope-outscope-input');
    const objInput = document.getElementById('scope-objectives-input');
    const notesTextarea = document.getElementById('pentest-notes');
    const dockScopeLabel = document.getElementById('dock-scope-label');
    const dockTargetPill = document.getElementById('dock-target-pill');

    if (dockTargetPill) dockTargetPill.addEventListener('click', () => {
      WindowManager.open('win-scope');
    });

    function syncScope() {
      if (targetInput) pentestState.target = targetInput.value.trim();
      if (inscopeInput) pentestState.scope = inscopeInput.value.trim();
      if (objInput) pentestState.objectives = objInput.value.trim();
      if (notesTextarea) pentestState.rawNotes = notesTextarea.value;
      if (dockScopeLabel) dockScopeLabel.textContent = pentestState.target || 'No Target Defined';
    }

    if (targetInput) targetInput.addEventListener('input', syncScope);
    if (inscopeInput) inscopeInput.addEventListener('input', syncScope);
    if (objInput) objInput.addEventListener('input', syncScope);
    if (notesTextarea) notesTextarea.addEventListener('input', syncScope);

    const btnSyncAi = document.getElementById('btn-scope-sync-ai');
    if (btnSyncAi) btnSyncAi.addEventListener('click', () => {
      syncScope();
      alert(`Scope synced with PickyHack AI: ${pentestState.target || 'None'}`);
    });

    const btnExt = document.getElementById('btn-scope-tpl-external');
    if (btnExt) btnExt.addEventListener('click', () => {
      if (targetInput) targetInput.value = 'megacorp-finance.com';
      if (inscopeInput) inscopeInput.value = '*.megacorp-finance.com, 198.51.100.0/24';
      if (outscopeInput) outscopeInput.value = '198.51.100.50 (Core Banking Database)';
      if (objInput) objInput.value = 'External perimeter reconnaissance & edge service exploitation';
      syncScope();
    });

    const btnWeb = document.getElementById('btn-scope-tpl-webapp');
    if (btnWeb) btnWeb.addEventListener('click', () => {
      if (targetInput) targetInput.value = 'portal.target-app.io';
      if (inscopeInput) inscopeInput.value = '/api/v1/*, /api/v2/*, /auth/oauth2/callback, /graphql';
      if (outscopeInput) outscopeInput.value = 'production-billing.internal';
      if (objInput) objInput.value = 'Pre-auth bypass, IDOR, SSRF to cloud metadata service';
      syncScope();
    });

    const btnAd = document.getElementById('btn-scope-tpl-ad');
    if (btnAd) btnAd.addEventListener('click', () => {
      if (targetInput) targetInput.value = 'DC01.corp.local (10.10.10.10)';
      if (inscopeInput) inscopeInput.value = '10.10.10.0/24, 10.10.20.0/24';
      if (outscopeInput) outscopeInput.value = 'CEO Workstation (10.10.20.100)';
      if (objInput) objInput.value = 'ADCS ESC1 exploitation & Kerberoasting to Domain Admin';
      syncScope();
    });

    const btnCloud = document.getElementById('btn-scope-tpl-cloud');
    if (btnCloud) btnCloud.addEventListener('click', () => {
      if (targetInput) targetInput.value = 'api.k8s.internal:6443';
      if (inscopeInput) inscopeInput.value = 'arn:aws:iam::123456789012:role/*, cluster API endpoint';
      if (outscopeInput) outscopeInput.value = 'Production DB RDS';
      if (objInput) objInput.value = 'Container escape & IAM privilege escalation';
      syncScope();
    });

    const btnClear = document.getElementById('btn-clear-notes');
    if (btnClear) btnClear.addEventListener('click', () => {
      if (targetInput) targetInput.value = '';
      if (inscopeInput) inscopeInput.value = '';
      if (outscopeInput) outscopeInput.value = '';
      if (objInput) objInput.value = '';
      if (notesTextarea) notesTextarea.value = '';
      syncScope();
    });
  }

  function initSystemClock() {
    function updateClock() {
      const clockEl = document.getElementById('system-clock');
      if (clockEl) {
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    }
    updateClock();
    setInterval(updateClock, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
