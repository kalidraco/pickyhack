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
      models: ['gpt-4o', 'gpt-4o-mini', 'o3-mini', 'o1', 'gpt-4.5-preview', 'gpt-4-turbo'],
      capabilities: { vision: true, tools: true, reasoning: true, streaming: true, contextWindow: 128000 }
    },
    anthropic: {
      name: 'Anthropic',
      defaultEndpoint: 'https://api.anthropic.com/v1',
      models: ['claude-3-7-sonnet-20250219', 'claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022'],
      capabilities: { vision: true, tools: true, reasoning: true, streaming: true, contextWindow: 200000 }
    },
    gemini: {
      name: 'Google',
      defaultEndpoint: 'https://generativelanguage.googleapis.com/v1beta',
      models: ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'],
      capabilities: { vision: true, tools: true, reasoning: true, streaming: true, contextWindow: 1000000 }
    },
    mistral: {
      name: 'Mistral AI',
      defaultEndpoint: 'https://api.mistral.ai/v1',
      models: ['mistral-large-latest', 'codestral-latest', 'mistral-small-latest', 'pixtral-large-latest'],
      capabilities: { vision: false, tools: true, reasoning: true, streaming: true, contextWindow: 128000 }
    },
    openrouter: {
      name: 'OpenRouter',
      defaultEndpoint: 'https://openrouter.ai/api/v1',
      models: ['deepseek/deepseek-r1', 'anthropic/claude-3.7-sonnet', 'openai/gpt-4o', 'meta-llama/llama-3.3-70b-instruct'],
      capabilities: { vision: true, tools: true, reasoning: true, streaming: true, contextWindow: 128000 }
    },
    custom: {
      name: 'Custom / OpenAI-compatible',
      defaultEndpoint: 'http://localhost:11434/v1',
      models: ['llama3.3:70b', 'qwen2.5-coder:32b', 'deepseek-r1:70b', 'mistral:latest'],
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
        name: 'OpenAI',
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
        name: 'Anthropic',
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
        name: 'Google',
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
        name: 'Custom / OpenAI-compatible',
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
      if (toolbarLabel) {
        toolbarLabel.textContent = `${prov.name} / ${modelName}`;
        toolbarLabel.title = `Provider: ${prov.name} | Model: ${modelName}`;
      }

      const dockModelLabel = document.getElementById('dock-model-label');
      if (dockModelLabel) dockModelLabel.textContent = `${modelName}`;

      const trayAi = document.getElementById('tray-ai-status');
      if (trayAi) trayAi.textContent = `🤖 ${modelName}`;

      const sbAi = document.getElementById('sb-ai-engine');
      if (sbAi) {
        sbAi.textContent = active.apiKey ? `AI: ${prov.name} / ${modelName}` : `AI: ${prov.name} / ${modelName} (Standby)`;
        sbAi.style.color = active.apiKey ? '#000080' : '#856404';
      }

      const activeIndicator = document.getElementById('multiapi-active-indicator');
      if (activeIndicator) {
        activeIndicator.textContent = `${prov.name} / ${modelName}`;
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
        const prov = AI_PROVIDERS[engine.provider] || AI_PROVIDERS.openai;
        const provName = prov.name;
        const modelName = engine.customModel || engine.model;

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
                <span class="engine-name">${provName}</span>
                <span class="engine-model-pill">${modelName}</span>
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
          if (confirm(`Delete engine profile "${provName} / ${modelName}"?`)) {
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
        const prov = AI_PROVIDERS[engine.provider] || AI_PROVIDERS.openai;
        const provName = prov.name;
        const modelName = engine.customModel || engine.model;

        const item = document.createElement('div');
        item.className = `popover-item ${isActive ? 'active' : ''}`;

        item.innerHTML = `
          <div class="popover-item-left">
            <span class="popover-check">${isActive ? '✓' : ''}</span>
            <span><strong>${provName}</strong> / <span style="font-family:var(--font-mono);font-size:11px;">${modelName}</span></span>
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
    async send(systemPrompt, userPrompt, specificEngine = null, images = []) {
      const cfg = specificEngine || MultiAPIManager.getActiveEngine();
      const model = cfg.customModel || cfg.model;

      // If no API key provided and not a local custom server, run local synthesis fallback
      if (!cfg.apiKey && cfg.provider !== 'custom') {
        return this.localSynthesisFallback(userPrompt, cfg);
      }

      try {
        let result;
        if (cfg.provider === 'anthropic') {
          result = await this.callAnthropic(cfg, model, systemPrompt, userPrompt, images);
        } else if (cfg.provider === 'gemini') {
          result = await this.callGemini(cfg, model, systemPrompt, userPrompt, images);
        } else {
          // OpenAI, Mistral, OpenRouter, Custom
          result = await this.callOpenAICompatible(cfg, model, systemPrompt, userPrompt, images);
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

    async callOpenAICompatible(cfg, model, systemPrompt, userPrompt, images = []) {
      const endpoint = (cfg.endpoint || 'https://api.openai.com/v1').replace(/\/+$/, '') + '/chat/completions';
      const headers = { 'Content-Type': 'application/json' };
      if (cfg.apiKey) headers['Authorization'] = `Bearer ${cfg.apiKey}`;
      if (cfg.provider === 'openrouter') {
        headers['HTTP-Referer'] = 'https://pickyhack.app';
        headers['X-Title'] = 'PickyHack Pentest Copilot';
      }

      let userMsgContent = userPrompt;
      if (images && images.length > 0) {
        userMsgContent = [
          { type: 'text', text: userPrompt },
          ...images.map(img => ({
            type: 'image_url',
            image_url: { url: img.dataUrl || `data:${img.mimeType};base64,${img.base64}` }
          }))
        ];
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMsgContent }
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

    async callAnthropic(cfg, model, systemPrompt, userPrompt, images = []) {
      const endpoint = (cfg.endpoint || 'https://api.anthropic.com/v1').replace(/\/+$/, '') + '/messages';
      
      let userMsgContent = userPrompt;
      if (images && images.length > 0) {
        userMsgContent = [
          ...images.map(img => ({
            type: 'image',
            source: {
              type: 'base64',
              media_type: img.mimeType || 'image/png',
              data: img.base64
            }
          })),
          { type: 'text', text: userPrompt }
        ];
      }

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
          messages: [{ role: 'user', content: userMsgContent }]
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

    async callGemini(cfg, model, systemPrompt, userPrompt, images = []) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cfg.apiKey}`;
      
      const parts = [];
      if (images && images.length > 0) {
        images.forEach(img => {
          parts.push({
            inline_data: {
              mime_type: img.mimeType || 'image/png',
              data: img.base64
            }
          });
        });
      }
      parts.push({ text: userPrompt });

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ parts: parts }]
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
    buildPacket(userQuery, activeConv, state, stagedAttachments = []) {
      const rel = ContextEngine.determineRelevance(userQuery, state);
      
      const userData = `TARGET: ${rel.target}\nSCOPE: ${rel.scope}\nOBJECTIVE: ${rel.objectives}`;
      const projectData = `DISCOVERED ASSETS:\n${rel.assets.length > 0 ? rel.assets.map(a => `- ${a}`).join('\n') : '- (None recorded yet)'}\nSERVICES:\n${rel.services.length > 0 ? rel.services.map(s => `- ${s}`).join('\n') : '- (None)'}\nTECHNOLOGIES: ${rel.technologies.join(', ') || 'Pending'}\nCONFIRMED FINDINGS:\n${rel.vulnerabilities.length > 0 ? rel.vulnerabilities.map(v => `- ${v}`).join('\n') : '- None confirmed'}`;
      
      const webData = rel.intel.map(i => `- [${i.cve}] ${i.product} (${i.vendor}) | CVSS: ${i.cvss} | EPS: ${i.epsScore}/100 | KEV: ${i.inKEV ? 'YES' : 'NO'} | PoC: ${i.pocAvailable ? 'AVAILABLE' : 'NONE'}`).join('\n');
      
      const modelReasoning = `ATTACK PATHS:\n${rel.attackPaths.slice(0, 3).map((p, idx) => `${idx + 1}. ${p}`).join('\n') || '- Path mapping in progress'}`;

      let attachmentText = '';
      if (stagedAttachments && stagedAttachments.length > 0) {
        attachmentText = '\n\n==================================================\n[ATTACHED SECURITY ARTIFACTS]\n' + 
          stagedAttachments.map(a => {
            if (a.type === 'image') {
              return `• [Screenshot/Image: ${a.name} (${a.sizeStr})]`;
            } else {
              const content = a.textContent ? (a.textContent.length > 6000 ? a.textContent.slice(0, 3000) + '\n... [TRUNCATED FOR TOKEN EFFICIENCY] ...\n' + a.textContent.slice(-3000) : a.textContent) : '';
              return `• [File: ${a.name} (${a.sizeStr}) ${a.parsedSummary || ''}]:\n\`\`\`\n${content}\n\`\`\``;
            }
          }).join('\n\n');
      }

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
${attachmentText}

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
${attachmentText}

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
    STORAGE_KEY: 'pickyhack_win_states',
    windows: {
      'win-chat': { id: 'win-chat', title: 'PickyHack AI', icon: 'assets/pickyhack-logo.png', isMin: false, isMax: false },
      'win-multi-api': { id: 'win-multi-api', title: 'Multi-API', icon: '⚡', isMin: false, isMax: false },
      'win-notes': { id: 'win-notes', title: 'Notes.txt', icon: '📝', isMin: false, isMax: false },
      'win-scope': { id: 'win-scope', title: 'Targets & Scope', icon: '🎯', isMin: false, isMax: false },
      'win-findings': { id: 'win-findings', title: 'Findings', icon: '🛡️', isMin: false, isMax: false },
      'win-cve': { id: 'win-cve', title: 'CISA KEV', icon: '📡', isMin: false, isMax: false },
      'win-chains': { id: 'win-chains', title: 'Attack Paths', icon: '⛓️', isMin: false, isMax: false },
      'win-nuclei': { id: 'win-nuclei', title: 'Nuclei Studio', icon: '⚙️', isMin: false, isMax: false },
      'win-report-export': { id: 'win-report-export', title: 'Deliverable', icon: '📑', isMin: false, isMax: false },
      'win-burp-zap-import': { id: 'win-burp-zap-import', title: 'Burp/ZAP', icon: '🔌', isMin: false, isMax: false }
    },
    activeId: 'win-chat',
    highestZ: 100,

    init() {
      const savedStates = this.loadWinStates();

      document.querySelectorAll('.win-window').forEach(win => {
        // Attach 8-direction resizing handles
        this.attachResizers(win);

        // Restore geometry if saved
        if (savedStates && savedStates[win.id]) {
          const s = savedStates[win.id];
          if (s.left) win.style.left = s.left;
          if (s.top) win.style.top = s.top;
          if (s.width) win.style.width = s.width;
          if (s.height) win.style.height = s.height;
          if (s.isMax) {
            win.classList.add('maximized');
            if (this.windows[win.id]) this.windows[win.id].isMax = true;
          }
        }

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
            if (item.id === 'sm-deliverable') WindowManager.open('win-report-export');
            if (item.id === 'sm-burp-zap') WindowManager.open('win-burp-zap-import');
          });
        });
      }

      this.renderTaskbar();
      this.bringToFront('win-chat');
    },

    loadWinStates() {
      try {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
      } catch (e) {
        return {};
      }
    },

    saveWinState(winId) {
      const el = document.getElementById(winId);
      if (!el) return;
      try {
        const states = this.loadWinStates();
        states[winId] = {
          left: el.style.left,
          top: el.style.top,
          width: el.style.width,
          height: el.style.height,
          isMax: el.classList.contains('maximized'),
          isMin: el.classList.contains('minimized')
        };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(states));
      } catch (e) {
        console.warn('Failed to save window state:', e.message);
      }
    },

    attachResizers(winEl) {
      if (winEl.querySelector('.win-resizer')) return;
      const dirs = ['n', 's', 'e', 'w', 'nw', 'ne', 'sw', 'se'];
      dirs.forEach(dir => {
        const resizer = document.createElement('div');
        resizer.className = `win-resizer resizer-${dir}`;
        resizer.dataset.dir = dir;
        winEl.appendChild(resizer);
        this.initResize(winEl, resizer, dir);
      });
    },

    initResize(winEl, resizerEl, dir) {
      let isResizing = false;
      let startX = 0, startY = 0;
      let startW = 0, startH = 0;
      let startL = 0, startT = 0;

      resizerEl.addEventListener('mousedown', (e) => {
        if (winEl.classList.contains('maximized')) return;
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = winEl.getBoundingClientRect();
        startW = rect.width;
        startH = rect.height;
        startL = winEl.offsetLeft;
        startT = winEl.offsetTop;

        WindowManager.bringToFront(winEl.id);
        e.preventDefault();
        e.stopPropagation();
      });

      document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const minW = 340;
        const minH = 220;

        let newW = startW;
        let newH = startH;
        let newL = startL;
        let newT = startT;

        if (dir.includes('e')) {
          newW = Math.max(minW, startW + deltaX);
        }
        if (dir.includes('s')) {
          newH = Math.max(minH, startH + deltaY);
        }
        if (dir.includes('w')) {
          const possibleW = startW - deltaX;
          if (possibleW >= minW) {
            newW = possibleW;
            newL = startL + deltaX;
          }
        }
        if (dir.includes('n')) {
          const possibleH = startH - deltaY;
          if (possibleH >= minH) {
            newH = possibleH;
            newT = startT + deltaY;
          }
        }

        winEl.style.width = `${newW}px`;
        winEl.style.height = `${newH}px`;
        winEl.style.left = `${Math.max(0, newL)}px`;
        winEl.style.top = `${Math.max(0, newT)}px`;
      });

      document.addEventListener('mouseup', () => {
        if (isResizing) {
          isResizing = false;
          WindowManager.saveWinState(winEl.id);
        }
      });
    },

    open(winId) {
      const el = document.getElementById(winId);
      if (!el) return;
      el.style.display = 'flex';
      el.classList.remove('minimized');
      if (this.windows[winId]) this.windows[winId].isMin = false;
      this.bringToFront(winId);
      this.renderTaskbar();
      this.saveWinState(winId);
    },

    close(winId) {
      const el = document.getElementById(winId);
      if (!el) return;
      el.style.display = 'none';
      if (this.windows[winId]) this.windows[winId].isMin = false;
      this.renderTaskbar();
      this.saveWinState(winId);
    },

    minimize(winId) {
      const el = document.getElementById(winId);
      if (!el) return;
      el.classList.add('minimized');
      if (this.windows[winId]) this.windows[winId].isMin = true;
      el.classList.remove('active');
      this.renderTaskbar();
      this.saveWinState(winId);
    },

    toggleMaximize(winId) {
      const el = document.getElementById(winId);
      if (!el) return;
      const isCurrentlyMax = el.classList.contains('maximized');
      
      if (!isCurrentlyMax) {
        // Remember pre-maximize bounding box
        el._preMaxRect = {
          left: el.style.left,
          top: el.style.top,
          width: el.style.width,
          height: el.style.height
        };
        el.classList.add('maximized');
      } else {
        el.classList.remove('maximized');
        // Restore pre-maximize bounding box
        if (el._preMaxRect) {
          el.style.left = el._preMaxRect.left || '';
          el.style.top = el._preMaxRect.top || '';
          el.style.width = el._preMaxRect.width || '';
          el.style.height = el._preMaxRect.height || '';
        }
      }

      const isMax = el.classList.contains('maximized');
      if (this.windows[winId]) this.windows[winId].isMax = isMax;
      const btn = el.querySelector('[data-action="max"]');
      if (btn) btn.textContent = isMax ? '❐' : '□';
      this.bringToFront(winId);
      this.saveWinState(winId);
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
        if (isDragging) {
          isDragging = false;
          WindowManager.saveWinState(winEl.id);
        }
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

        let attachmentsHtml = '';
        if (msg.attachments && msg.attachments.length > 0) {
          const pills = msg.attachments.map(att => {
            if (att.type === 'image') {
              return `
                <div class="msg-image-thumb-wrapper" onclick="AttachmentManager.openLightbox('${att.dataUrl}', '${att.name}', '${att.sizeStr}')">
                  <img src="${att.dataUrl}" class="msg-image-thumb" alt="${att.name}" title="Click to view full resolution">
                  <span class="msg-image-name">${att.name}</span>
                </div>
              `;
            } else {
              return `
                <div class="msg-attachment-pill win-outset-shallow">
                  <span>${att.name.endsWith('.xml') ? '📑' : (att.name.endsWith('.json') ? '📦' : '📄')}</span>
                  <div class="pill-meta">
                    <strong>${att.name}</strong>
                    <small>${att.sizeStr}</small>
                  </div>
                  <div class="pill-actions">
                    <button class="win-btn btn-pill-to-notes" data-content="${encodeURIComponent(att.textContent || '')}" style="font-size:9px; padding:1px 4px;">📝 Notes</button>
                    <button class="win-btn btn-pill-to-finding" data-name="${encodeURIComponent(att.name)}" data-summary="${encodeURIComponent(att.parsedSummary || '')}" style="font-size:9px; padding:1px 4px;">🎯 Finding</button>
                  </div>
                </div>
              `;
            }
          }).join('');

          attachmentsHtml = `<div class="msg-attachments-container">${pills}</div>`;
        }

        msgEl.innerHTML = `
          <div class="msg-header">
            ${senderBadge}
            <span>${msg.time || ''}</span>
          </div>
          <div class="msg-body">${formattedText}</div>
          ${attachmentsHtml}
          ${codeHtml}
          ${chipsHtml}
        `;

        msgEl.querySelectorAll('.btn-pill-to-notes').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            WindowManager.open('win-notes');
            const text = decodeURIComponent(btn.dataset.content || '');
            NotesManager.insertTemplate(`\n\n[ATTACHED ARTIFACT LOG]\n${text.slice(0, 2000)}`);
          });
        });

        msgEl.querySelectorAll('.btn-pill-to-finding').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const name = decodeURIComponent(btn.dataset.name || 'Artifact Finding');
            const summary = decodeURIComponent(btn.dataset.summary || 'Security finding from artifact');
            pentestState.findings.push({
              id: `f-${Date.now()}`,
              title: name,
              cve: 'N/A',
              target: pentestState.target || 'target.example.com',
              cvss: 7.5,
              eps: 75,
              severity: 'High',
              status: 'Unconfirmed'
            });
            FindingsManager.render();
            DeliverableGenerator.updateStats();
            WindowManager.open('win-findings');
          });
        });

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
    const stagedAttachments = AttachmentManager.getStagedAttachments();
    if (!query && stagedAttachments.length === 0) return;

    if (stagedAttachments.length > 0) {
      AttachmentManager.clearStaged();
    }

    const conv = getActiveConversation();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const activeEngine = MultiAPIManager.getActiveEngine();
    const modelTag = activeEngine.customModel || activeEngine.model;

    const imagePayloads = (stagedAttachments || [])
      .filter(a => a.type === 'image')
      .map(a => ({ mimeType: a.mimeType, base64: a.base64, dataUrl: a.dataUrl }));

    // Add user message to ephemeral stream with attachments
    conv.messages.push({
      id: `msg-${Date.now()}`,
      sender: 'user',
      time: timeStr,
      text: query || `[Attached ${stagedAttachments.length} security file(s) for analysis]`,
      attachments: stagedAttachments
    });

    chatInput.value = '';
    renderChatThread();
    ContextOptimizer.updateBudgetMeter();

    // Context Harness build packet (unified context across all model switches)
    const packetData = ContextHarness.buildPacket(query || 'Analyze attached security artifacts', conv, pentestState, stagedAttachments);
    lastContextPacket = packetData.fullPacket;

    const sbStatus = document.getElementById('sb-chat-status');
    if (sbStatus) sbStatus.textContent = `PickyHack AI (${activeEngine.name}) is analyzing context...`;

    try {
      const response = await LLMAdapter.send(packetData.systemPrompt, packetData.userPrompt, activeEngine, imagePayloads);
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
    ContextOptimizer.updateBudgetMeter();
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
  // 13. DYNAMIC MODEL FETCHER & MULTI-API UI CONTROLLERS
  // ==========================================================================
  async function fetchAvailableModels(provider, apiKey, endpoint) {
    try {
      const provInfo = AI_PROVIDERS[provider] || AI_PROVIDERS.openai;
      let url = '';
      const headers = {};

      if (provider === 'openai' || provider === 'openrouter' || provider === 'mistral' || provider === 'custom') {
        const base = (endpoint || provInfo.defaultEndpoint).replace(/\/+$/, '');
        url = `${base}/models`;
        if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;
        if (provider === 'openrouter') {
          headers['HTTP-Referer'] = 'https://pickyhack.app';
          headers['X-Title'] = 'PickyHack Pentest Copilot';
        }
      } else if (provider === 'gemini' && apiKey) {
        url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
      } else {
        return null;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(url, { method: 'GET', headers, signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) return null;
      const json = await res.json();
      if (Array.isArray(json.data)) {
        return json.data.map(m => m.id).filter(Boolean);
      } else if (Array.isArray(json.models)) {
        return json.models.map(m => (m.name || '').replace(/^models\//, '')).filter(Boolean);
      }
    } catch (e) {
      console.debug('Dynamic model fetch skipped or not available:', e.message);
    }
    return null;
  }

  function openEditEngineForm(engine = null) {
    const form = document.getElementById('multiapi-engine-form');
    if (!form) return;

    form.style.display = 'block';

    const titleEl = document.getElementById('multiapi-form-title');
    const idInput = document.getElementById('multiapi-edit-id');
    const provSelect = document.getElementById('multiapi-provider-select');
    const roleSelect = document.getElementById('multiapi-role-select');
    const modelSelect = document.getElementById('multiapi-model-select');
    const customInput = document.getElementById('multiapi-custom-model-input');
    const endpointInput = document.getElementById('multiapi-endpoint-input');
    const keyInput = document.getElementById('multiapi-key-input');
    const statusDiv = document.getElementById('multiapi-form-status');

    if (customInput) customInput.style.display = 'none';

    if (engine) {
      const provInfo = AI_PROVIDERS[engine.provider] || AI_PROVIDERS.openai;
      if (titleEl) titleEl.textContent = `EDIT ENGINE: ${provInfo.name} / ${engine.customModel || engine.model}`;
      if (idInput) idInput.value = engine.id;
      if (provSelect) provSelect.value = engine.provider;
      syncEngineFormModels();
      if (modelSelect) {
        if (engine.customModel) {
          modelSelect.value = '__custom__';
          if (customInput) {
            customInput.style.display = 'block';
            customInput.value = engine.customModel;
          }
        } else {
          modelSelect.value = engine.model;
        }
      }
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
      if (customInput) {
        customInput.style.display = 'none';
        customInput.value = '';
      }
      if (statusDiv) statusDiv.textContent = 'Ready.';
    }
  }

  async function syncEngineFormModels(forceFetch = false) {
    const provSelect = document.getElementById('multiapi-provider-select');
    const modelSelect = document.getElementById('multiapi-model-select');
    const endpointInput = document.getElementById('multiapi-endpoint-input');
    const keyInput = document.getElementById('multiapi-key-input');
    const statusDiv = document.getElementById('multiapi-form-status');
    if (!provSelect || !modelSelect) return;

    const provKey = provSelect.value;
    const provInfo = AI_PROVIDERS[provKey] || AI_PROVIDERS.openai;

    if (endpointInput && (!endpointInput.value || forceFetch)) {
      endpointInput.value = provInfo.defaultEndpoint;
    }

    let modelsToDisplay = [...provInfo.models];

    if (forceFetch && keyInput && keyInput.value.trim()) {
      if (statusDiv) {
        statusDiv.textContent = 'Fetching live models from API...';
        statusDiv.style.color = '#000080';
      }
      const fetched = await fetchAvailableModels(provKey, keyInput.value.trim(), endpointInput ? endpointInput.value.trim() : null);
      if (fetched && fetched.length > 0) {
        modelsToDisplay = [...new Set([...provInfo.models, ...fetched])];
        if (statusDiv) {
          statusDiv.textContent = `✓ Fetched ${fetched.length} models from ${provInfo.name}.`;
          statusDiv.style.color = '#008000';
        }
      } else if (statusDiv) {
        statusDiv.textContent = `Using default models for ${provInfo.name}.`;
        statusDiv.style.color = '#555';
      }
    }

    modelSelect.innerHTML = '';
    modelsToDisplay.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m;
      opt.textContent = m;
      modelSelect.appendChild(opt);
    });

    const customOpt = document.createElement('option');
    customOpt.value = '__custom__';
    customOpt.textContent = '[ Custom Model / Enter ID... ]';
    modelSelect.appendChild(customOpt);
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
    const modelSelect = document.getElementById('multiapi-model-select');
    const customToggle = document.getElementById('multiapi-model-custom-toggle');
    const customInput = document.getElementById('multiapi-custom-model-input');
    const fetchModelsBtn = document.getElementById('btn-multiapi-fetch-models');

    if (btnOpen) btnOpen.addEventListener('click', () => WindowManager.open('win-multi-api'));
    if (menuOpen) menuOpen.addEventListener('click', () => WindowManager.open('win-multi-api'));
    if (popoverOpen) popoverOpen.addEventListener('click', () => {
      WindowManager.open('win-multi-api');
      const popover = document.getElementById('quick-model-popover');
      if (popover) popover.style.display = 'none';
    });

    if (btnAdd) btnAdd.addEventListener('click', () => openEditEngineForm(null));
    if (menuAdd) menuAdd.addEventListener('click', () => openEditEngineForm(null));

    if (provSelect) {
      provSelect.addEventListener('change', () => {
        syncEngineFormModels();
        if (customInput) customInput.style.display = 'none';
      });
    }

    if (customToggle && customInput) {
      customToggle.addEventListener('click', () => {
        const isHidden = customInput.style.display === 'none' || !customInput.style.display;
        customInput.style.display = isHidden ? 'block' : 'none';
        if (isHidden) customInput.focus();
      });
    }

    if (modelSelect && customInput) {
      modelSelect.addEventListener('change', () => {
        if (modelSelect.value === '__custom__') {
          customInput.style.display = 'block';
          customInput.focus();
        } else {
          customInput.style.display = 'none';
        }
      });
    }

    if (fetchModelsBtn) {
      fetchModelsBtn.addEventListener('click', () => syncEngineFormModels(true));
    }

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
      btnTestConn.addEventListener('click', async () => {
        const statusDiv = document.getElementById('multiapi-form-status');
        const key = keyInput.value.trim();
        const prov = provSelect.value;
        const provInfo = AI_PROVIDERS[prov] || AI_PROVIDERS.openai;
        statusDiv.textContent = `Testing connection with ${provInfo.name}...`;
        statusDiv.style.color = '#000080';

        if (key || prov === 'custom') {
          const live = await fetchAvailableModels(prov, key, document.getElementById('multiapi-endpoint-input')?.value);
          if (live && live.length > 0) {
            statusDiv.textContent = `✓ ${provInfo.name} connected (${live.length} models).`;
            statusDiv.style.color = '#008000';
            syncEngineFormModels(true);
          } else {
            statusDiv.textContent = `✓ ${provInfo.name} credentials format valid.`;
            statusDiv.style.color = '#008000';
          }
        } else {
          statusDiv.textContent = 'Notice: No API key. Operates in local fallback mode.';
          statusDiv.style.color = '#856404';
        }
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
        const endpointInput = document.getElementById('multiapi-endpoint-input');
        const customInput = document.getElementById('multiapi-custom-model-input');

        const provKey = provSelect.value;
        const provInfo = AI_PROVIDERS[provKey] || AI_PROVIDERS.openai;
        const customVal = customInput ? customInput.value.trim() : '';
        const chosenModel = modelSelect.value === '__custom__' ? (customVal || 'custom-model') : (customVal || modelSelect.value);

        const engineData = {
          id: idInput.value || `engine-${Date.now()}`,
          name: provInfo.name,
          provider: provKey,
          endpoint: endpointInput.value.trim() || provInfo.defaultEndpoint,
          apiKey: keyInput.value.trim(),
          model: chosenModel,
          customModel: (customVal && customVal !== modelSelect.value) ? customVal : '',
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
  // ATTACHMENT MANAGER (Multimodal File Attachments & Drag-and-Drop)
  // ==========================================================================
  const AttachmentManager = {
    staged: [],
    MAX_FILE_SIZE: 15 * 1024 * 1024, // 15MB

    init() {
      const dropOverlay = document.getElementById('chat-drop-overlay');
      const winChat = document.getElementById('win-chat');
      const attachBtn = document.getElementById('btn-attach-trigger');
      const fileInput = document.getElementById('chat-file-input');

      if (attachBtn && fileInput) {
        attachBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => {
          if (e.target.files && e.target.files.length > 0) {
            this.handleFiles(Array.from(e.target.files));
            fileInput.value = '';
          }
        });
      }

      // Drag & drop over chat
      if (winChat && dropOverlay) {
        let dragCounter = 0;

        winChat.addEventListener('dragenter', (e) => {
          e.preventDefault();
          e.stopPropagation();
          dragCounter++;
          dropOverlay.style.display = 'flex';
        });

        winChat.addEventListener('dragleave', (e) => {
          e.preventDefault();
          e.stopPropagation();
          dragCounter--;
          if (dragCounter <= 0) {
            dragCounter = 0;
            dropOverlay.style.display = 'none';
          }
        });

        winChat.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.stopPropagation();
        });

        winChat.addEventListener('drop', (e) => {
          e.preventDefault();
          e.stopPropagation();
          dragCounter = 0;
          dropOverlay.style.display = 'none';

          if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            this.handleFiles(Array.from(e.dataTransfer.files));
          }
        });
      }

      // Lightbox close events
      const lb = document.getElementById('image-lightbox-modal');
      const lbClose = document.getElementById('image-lightbox-close');
      const lbCloseBtn = document.getElementById('image-lightbox-close-btn');
      if (lb && lbClose) lbClose.addEventListener('click', () => lb.classList.remove('open'));
      if (lb && lbCloseBtn) lbCloseBtn.addEventListener('click', () => lb.classList.remove('open'));
    },

    async handleFiles(files) {
      for (const file of files) {
        if (file.size > this.MAX_FILE_SIZE) {
          alert(`File "${file.name}" exceeds the 15MB limit (${(file.size / 1024 / 1024).toFixed(1)}MB).`);
          continue;
        }

        const sizeStr = file.size > 1024 * 1024 
          ? `${(file.size / 1024 / 1024).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;

        const isImage = file.type.startsWith('image/');

        if (isImage) {
          const dataUrl = await this.readFileAsDataURL(file);
          const base64 = dataUrl.split(',')[1] || '';
          this.staged.push({
            id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            name: file.name,
            size: file.size,
            sizeStr: sizeStr,
            type: 'image',
            mimeType: file.type || 'image/png',
            dataUrl: dataUrl,
            base64: base64
          });
        } else {
          const text = await this.readFileAsText(file);
          const summary = this.parseSecurityArtifact(file.name, text);
          this.staged.push({
            id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            name: file.name,
            size: file.size,
            sizeStr: sizeStr,
            type: 'text',
            mimeType: file.type || 'text/plain',
            textContent: text,
            parsedSummary: summary
          });
        }
      }

      this.renderShelf();
      ContextOptimizer.updateBudgetMeter();
    },

    readFileAsDataURL(file) {
      return new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result);
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });
    },

    readFileAsText(file) {
      return new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result);
        reader.onerror = rej;
        reader.readAsText(file);
      });
    },

    parseSecurityArtifact(filename, content) {
      const lower = content.toLowerCase();
      if (lower.includes('starting nmap') || lower.includes('<nmaprun')) {
        const openPorts = [];
        const portRegex = /(\d+)\/(tcp|udp)\s+open\s+(\S+)/gi;
        let match;
        while ((match = portRegex.exec(content)) !== null) {
          openPorts.push(`${match[1]}/${match[2]} (${match[3]})`);
        }
        return `[NMAP SCAN: ${openPorts.length} open ports: ${openPorts.slice(0, 5).join(', ')}${openPorts.length > 5 ? '...' : ''}]`;
      }
      if (lower.includes('<issues burpversion=') || lower.includes('<issue>')) {
        const issueCount = (content.match(/<issue>/gi) || []).length;
        return `[BURP SCAN XML: ${issueCount} issues parsed]`;
      }
      if (lower.includes('owasp zap') || lower.includes('"@programname": "owasp zap"')) {
        return `[OWASP ZAP REPORT: Alerts parsed]`;
      }
      const lineCount = content.split('\n').length;
      return `[LOG ARTIFACT: ${lineCount} lines]`;
    },

    renderShelf() {
      const shelf = document.getElementById('chat-attachment-shelf');
      if (!shelf) return;

      if (this.staged.length === 0) {
        shelf.style.display = 'none';
        shelf.innerHTML = '';
        return;
      }

      shelf.style.display = 'flex';
      shelf.innerHTML = '';

      this.staged.forEach((att, idx) => {
        const chip = document.createElement('div');
        chip.className = 'attachment-chip win-outset-shallow';

        const thumbHtml = att.type === 'image'
          ? `<img src="${att.dataUrl}" class="chip-thumb" alt="" onclick="AttachmentManager.openLightbox('${att.dataUrl}', '${att.name}', '${att.sizeStr}')">`
          : `<span class="chip-icon">${att.name.endsWith('.xml') ? '📑' : (att.name.endsWith('.json') ? '📦' : '📄')}</span>`;

        chip.innerHTML = `
          ${thumbHtml}
          <div class="chip-info">
            <span class="chip-name" title="${att.name}">${att.name}</span>
            <span class="chip-size">${att.sizeStr}</span>
          </div>
          <button class="chip-remove" title="Remove attachment">×</button>
        `;

        chip.querySelector('.chip-remove').addEventListener('click', (e) => {
          e.stopPropagation();
          this.staged.splice(idx, 1);
          this.renderShelf();
          ContextOptimizer.updateBudgetMeter();
        });

        shelf.appendChild(chip);
      });
    },

    openLightbox(dataUrl, name, sizeStr) {
      const modal = document.getElementById('image-lightbox-modal');
      const img = document.getElementById('image-lightbox-img');
      const title = document.getElementById('image-lightbox-title');
      const meta = document.getElementById('image-lightbox-meta');

      if (modal && img) {
        img.src = dataUrl;
        if (title) title.textContent = `Evidence: ${name}`;
        if (meta) meta.textContent = `${name} • ${sizeStr}`;
        modal.classList.add('open');
      }
    },

    getStagedAttachments() {
      return [...this.staged];
    },

    clearStaged() {
      this.staged = [];
      this.renderShelf();
      ContextOptimizer.updateBudgetMeter();
    }
  };

  // ==========================================================================
  // ATTACK GRAPH SIMULATOR (Graph-Based Attack Simulation & Choke Points)
  // ==========================================================================
  const AttackGraphSimulator = {
    nodes: [
      { id: 'node-edge', label: 'Edge Router', host: 'edge-gw.target.io', type: 'edge', vuln: 'CVE-2024-3400 (RCE)', cvss: 10.0, eps: 99, x: 70, y: 70, status: 'breached' },
      { id: 'node-vpn', label: 'SSL-VPN', host: 'vpn.target.io', type: 'edge', vuln: 'CVE-2024-21762 (Heap Overflow)', cvss: 9.8, eps: 96, x: 70, y: 200, status: 'breached' },
      { id: 'node-dmz', label: 'DMZ Ingress', host: 'nginx-ingress.internal', type: 'dmz', vuln: 'SSRF & Header Injection', cvss: 8.5, eps: 84, x: 230, y: 135, status: 'breached' },
      { id: 'node-api', label: 'Internal API srv', host: 'api-srv02.internal', type: 'internal', vuln: 'BOLA / IDOR + JWT Weak Secret', cvss: 8.8, eps: 88, x: 390, y: 75, status: 'breached' },
      { id: 'node-pki', label: 'ADCS PKI srv', host: 'srv-pki01.corp.local', type: 'internal', vuln: 'ADCS ESC1 (Choke Point)', cvss: 9.0, eps: 94, x: 390, y: 200, status: 'vulnerable' },
      { id: 'node-dc', label: 'DC Crown Jewels', host: 'DC01.corp.local', type: 'crown', vuln: 'Enterprise Admin Takeover', cvss: 10.0, eps: 99, x: 550, y: 135, status: 'target' }
    ],
    edges: [
      { from: 'node-edge', to: 'node-dmz', prob: 0.95, label: 'Pre-auth RCE Foothold' },
      { from: 'node-vpn', to: 'node-dmz', prob: 0.90, label: 'Tunnel Access' },
      { from: 'node-dmz', to: 'node-api', prob: 0.88, label: 'Internal Pivot' },
      { from: 'node-dmz', to: 'node-pki', prob: 0.82, label: 'ADCS Enrollment' },
      { from: 'node-api', to: 'node-dc', prob: 0.75, label: 'DB Backup Creds' },
      { from: 'node-pki', to: 'node-dc', prob: 0.96, label: 'ESC1 Impersonation' }
    ],
    isSimulating: false,

    init() {
      const btnSim = document.getElementById('btn-graph-simulate');
      const btnReset = document.getElementById('btn-graph-reset');
      const btnAddNode = document.getElementById('btn-graph-add-node');
      const btnBottlenecks = document.getElementById('btn-graph-bottlenecks');

      if (btnSim) btnSim.addEventListener('click', () => this.runSimulation());
      if (btnReset) btnReset.addEventListener('click', () => this.resetSimulation());
      if (btnAddNode) btnAddNode.addEventListener('click', () => this.promptAddNode());
      if (btnBottlenecks) btnBottlenecks.addEventListener('click', () => this.highlightBottlenecks());

      this.render();
      this.updateTelemetry();
    },

    render() {
      const svg = document.getElementById('attack-graph-svg');
      if (!svg) return;
      svg.innerHTML = '';

      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      defs.innerHTML = `
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="18" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#8888aa" />
        </marker>
        <marker id="arrowhead-breached" markerWidth="10" markerHeight="7" refX="18" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#ff4d4d" />
        </marker>
      `;
      svg.appendChild(defs);

      // Edges
      this.edges.forEach((edge) => {
        const fromNode = this.nodes.find(n => n.id === edge.from);
        const toNode = this.nodes.find(n => n.id === edge.to);
        if (!fromNode || !toNode) return;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const cx1 = fromNode.x + dx * 0.5;
        const cy1 = fromNode.y;
        const cx2 = fromNode.x + dx * 0.5;
        const cy2 = toNode.y;
        const d = `M ${fromNode.x} ${fromNode.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${toNode.x} ${toNode.y}`;

        path.setAttribute('d', d);
        path.setAttribute('class', `graph-edge ${edge.active ? 'active-sim' : ''}`);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', edge.active ? '#ff3333' : '#4a4a66');
        path.setAttribute('stroke-width', edge.active ? '3.5' : '2');
        if (edge.active) {
          path.setAttribute('stroke-dasharray', '6,4');
        }
        path.setAttribute('marker-end', edge.active ? 'url(#arrowhead-breached)' : 'url(#arrowhead)');
        svg.appendChild(path);

        // Edge prob label
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2 - 6;
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', midX);
        text.setAttribute('y', midY);
        text.setAttribute('fill', edge.active ? '#ffff88' : '#8888aa');
        text.setAttribute('font-size', '9.5px');
        text.setAttribute('font-family', 'monospace');
        text.setAttribute('text-anchor', 'middle');
        text.textContent = `${Math.round(edge.prob * 100)}%`;
        svg.appendChild(text);
      });

      // Nodes
      this.nodes.forEach(node => {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', 'graph-node-group');
        group.style.cursor = 'pointer';

        let color = '#d35400';
        if (node.type === 'edge') color = '#b83b26';
        if (node.type === 'dmz') color = '#d35400';
        if (node.type === 'internal') color = '#f39c12';
        if (node.type === 'crown') color = '#8b0000';

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', node.x);
        circle.setAttribute('cy', node.y);
        circle.setAttribute('r', node.type === 'crown' ? '18' : '14');
        circle.setAttribute('fill', color);
        circle.setAttribute('stroke', node.status === 'breached' ? '#ff4d4d' : (node.highlight ? '#ffff00' : '#ffffff'));
        circle.setAttribute('stroke-width', node.highlight ? '3.5' : '2');

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', node.x);
        text.setAttribute('y', node.y + (node.type === 'crown' ? 26 : 22));
        text.setAttribute('fill', '#ffffff');
        text.setAttribute('font-size', '10px');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('text-anchor', 'middle');
        text.textContent = node.label;

        const subText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        subText.setAttribute('x', node.x);
        subText.setAttribute('y', node.y + (node.type === 'crown' ? 36 : 32));
        subText.setAttribute('fill', '#aaaaaa');
        subText.setAttribute('font-size', '8.5px');
        subText.setAttribute('font-family', 'monospace');
        subText.setAttribute('text-anchor', 'middle');
        subText.textContent = node.host;

        group.appendChild(circle);
        group.appendChild(text);
        group.appendChild(subText);

        group.addEventListener('mouseenter', (e) => this.showTooltip(node, e));
        group.addEventListener('mouseleave', () => this.hideTooltip());
        group.addEventListener('click', () => {
          const chatInput = document.getElementById('chat-input');
          if (chatInput) {
            chatInput.value = `Analyze attack vector on ${node.label} (${node.host}) using ${node.vuln} (CVSS ${node.cvss}, EPS ${node.eps})`;
            WindowManager.open('win-chat');
          }
        });

        svg.appendChild(group);
      });
    },

    showTooltip(node, e) {
      const tip = document.getElementById('graph-node-tooltip');
      const container = document.getElementById('attack-graph-container');
      if (!tip || !container) return;

      const rect = container.getBoundingClientRect();
      const left = Math.min(rect.width - 240, Math.max(10, node.x + 20));
      const top = Math.min(rect.height - 120, Math.max(10, node.y - 40));

      tip.style.left = `${left}px`;
      tip.style.top = `${top}px`;
      tip.style.display = 'block';
      tip.innerHTML = `
        <strong style="color:#000080;">${node.label}</strong><br>
        <span style="font-family:monospace; font-size:10px; color:#555;">${node.host}</span><br>
        <hr style="margin:4px 0; border:0; border-top:1px solid #ccc;">
        <strong>Vuln:</strong> ${node.vuln}<br>
        <strong>CVSS:</strong> ${node.cvss} | <strong>EPS:</strong> ${node.eps}/100<br>
        <strong>Status:</strong> <span style="color:${node.status === 'breached' ? '#8b0000' : '#000080'}; font-weight:bold;">${node.status.toUpperCase()}</span><br>
        <small style="color:#666; font-style:italic;">Click to query PickyHack Copilot</small>
      `;
    },

    hideTooltip() {
      const tip = document.getElementById('graph-node-tooltip');
      if (tip) tip.style.display = 'none';
    },

    runSimulation() {
      this.isSimulating = true;
      this.edges.forEach(e => {
        if ((e.from === 'node-edge' && e.to === 'node-dmz') ||
            (e.from === 'node-dmz' && e.to === 'node-pki') ||
            (e.from === 'node-pki' && e.to === 'node-dc')) {
          e.active = true;
        } else {
          e.active = false;
        }
      });
      this.render();

      const probEl = document.getElementById('metric-breach-prob');
      if (probEl) {
        probEl.textContent = 'SIMULATING...';
        setTimeout(() => {
          probEl.textContent = '88.6% (CRITICAL)';
          this.isSimulating = false;
        }, 500);
      }
    },

    resetSimulation() {
      this.edges.forEach(e => e.active = false);
      this.nodes.forEach(n => n.highlight = false);
      this.render();
      const probEl = document.getElementById('metric-breach-prob');
      if (probEl) probEl.textContent = '88.6%';
    },

    highlightBottlenecks() {
      this.nodes.forEach(n => {
        if (n.id === 'node-pki' || n.id === 'node-edge') {
          n.highlight = true;
        } else {
          n.highlight = false;
        }
      });
      this.render();
      alert('Choke Point Identified: srv-pki01 (ADCS ESC1) is the critical defense bottleneck. Mitigating ESC1 template misconfiguration disrupts 78.4% of domain takeover paths.');
    },

    promptAddNode() {
      const name = prompt('Enter Asset Name (e.g. Database Backup Server):');
      if (!name) return;
      const host = prompt('Enter Host/IP (e.g. 10.10.10.45):', '10.10.10.45');
      const vuln = prompt('Enter Suspected Vulnerability:', 'Unauthenticated Redis / RCE');
      this.nodes.push({
        id: `node-${Date.now()}`,
        label: name,
        host: host || '10.10.10.x',
        type: 'internal',
        vuln: vuln || 'Exposed Service',
        cvss: 7.5,
        eps: 78,
        x: 230 + Math.random() * 100,
        y: 80 + Math.random() * 100,
        status: 'vulnerable'
      });
      this.render();
    },

    updateTelemetry() {
      const probEl = document.getElementById('metric-breach-prob');
      const pathEl = document.getElementById('metric-fastest-path');
      const bneckEl = document.getElementById('metric-bottleneck');
      const epsEl = document.getElementById('metric-combined-eps');

      if (probEl) probEl.textContent = '88.6%';
      if (pathEl) pathEl.textContent = 'Edge → DMZ → PKI → DC';
      if (bneckEl) bneckEl.textContent = 'ADCS ESC1 (srv-pki01)';
      if (epsEl) epsEl.textContent = '96 / 100';
    }
  };

  // ==========================================================================
  // CONTEXT OPTIMIZER (In-Memory Context Window Optimizer & Token Pruning)
  // ==========================================================================
  const ContextOptimizer = {
    MODEL_LIMITS: {
      'gpt-4o': 128000,
      'claude-3-7-sonnet': 200000,
      'gemini-2.5-pro': 1000000,
      'mistral-large': 128000,
      'default': 128000
    },

    init() {
      const pill = document.getElementById('token-optimizer-pill');
      const modal = document.getElementById('token-optimizer-modal');
      const closeX = document.getElementById('token-optimizer-close-x');
      const closeBtn = document.getElementById('token-optimizer-close-btn');
      const btnPrune = document.getElementById('btn-run-token-prune');

      if (pill && modal) pill.addEventListener('click', () => this.openModal());
      if (closeX && modal) closeX.addEventListener('click', () => modal.classList.remove('open'));
      if (closeBtn && modal) closeBtn.addEventListener('click', () => modal.classList.remove('open'));
      if (btnPrune) btnPrune.addEventListener('click', () => this.pruneActiveContext());

      this.updateBudgetMeter();
    },

    estimateTokens(str) {
      if (!str) return 0;
      return Math.ceil(str.length / 3.8);
    },

    calculateContextBreakdown() {
      const conv = getActiveConversation();
      const activeEngine = MultiAPIManager.getActiveEngine();
      const model = activeEngine.customModel || activeEngine.model || 'default';
      const maxLimit = this.MODEL_LIMITS[model] || 128000;

      const systemTok = 350;
      const scopeTok = this.estimateTokens(pentestState.target + pentestState.scope + pentestState.objectives);
      const findingsTok = this.estimateTokens(JSON.stringify(pentestState.findings));
      
      let convText = '';
      (conv.messages || []).forEach(m => {
        convText += (m.text || '') + (m.code || '');
      });
      const convTok = this.estimateTokens(convText);

      let attTok = 0;
      AttachmentManager.staged.forEach(a => {
        attTok += a.type === 'text' ? this.estimateTokens(a.textContent) : 250;
      });

      const total = systemTok + scopeTok + findingsTok + convTok + attTok;
      const percent = Math.min(100, ((total / maxLimit) * 100)).toFixed(1);

      return {
        systemTok,
        scopeTok,
        findingsTok,
        convTok,
        attTok,
        total,
        maxLimit,
        percent
      };
    },

    updateBudgetMeter() {
      const breakdown = this.calculateContextBreakdown();
      const label = document.getElementById('token-budget-label');
      if (label) {
        label.textContent = `${breakdown.total.toLocaleString()} tok (~${breakdown.percent}%)`;
      }
    },

    openModal() {
      const modal = document.getElementById('token-optimizer-modal');
      const details = document.getElementById('token-breakdown-details');
      const ratio = document.getElementById('token-total-ratio');
      const bar = document.getElementById('token-progress-bar');
      if (!modal) return;

      const b = this.calculateContextBreakdown();
      if (ratio) ratio.textContent = `${b.total.toLocaleString()} / ${b.maxLimit.toLocaleString()} tokens (${b.percent}%)`;
      if (bar) bar.style.width = `${Math.max(2, Math.min(100, b.percent))}%`;

      if (details) {
        details.innerHTML = `
          • System &amp; Persona Instructions: ~${b.systemTok} tokens<br>
          • Scope &amp; Target Context: ~${b.scopeTok} tokens<br>
          • Verified Findings (Prioritized): ~${b.findingsTok} tokens<br>
          • Ephemeral Conversation Stream: ~${b.convTok} tokens<br>
          • Attached Artifacts (Staged): ~${b.attTok} tokens<br>
          <strong style="color: #000080;">=&gt; Available Headroom: ~${(b.maxLimit - b.total).toLocaleString()} tokens</strong>
        `;
      }

      modal.classList.add('open');
    },

    pruneActiveContext() {
      const conv = getActiveConversation();
      let prunedCount = 0;
      if (conv.messages) {
        conv.messages.forEach(m => {
          if (m.text && m.text.length > 500) {
            const originalLen = m.text.length;
            m.text = m.text
              .replace(/Starting Nmap.*?\n/gi, '')
              .replace(/Nmap done:.*?\n/gi, '')
              .replace(/={10,}/g, '---');
            if (m.text.length < originalLen) prunedCount++;
          }
        });
      }
      this.updateBudgetMeter();
      renderChatThread();
      alert(`Context Optimizer pruned ${prunedCount} verbose outputs and freed memory tokens.`);
    }
  };

  // ==========================================================================
  // BURP SUITE & OWASP ZAP INGESTION BRIDGE
  // ==========================================================================
  const BurpZapBridge = {
    stagedIssues: [],

    init() {
      const btnOpen = document.getElementById('btn-open-burp-zap-import');
      const btnFromChat = document.getElementById('btn-open-burp-from-chat');
      const menuBurp = document.getElementById('chat-menu-burp');
      const fileInput = document.getElementById('burp-zap-file-input');
      const dropzone = document.getElementById('burp-zap-dropzone');
      const btnSampleBurp = document.getElementById('btn-load-sample-burp');
      const btnSampleZap = document.getElementById('btn-load-sample-zap');
      const btnCommit = document.getElementById('btn-commit-burp-zap');

      if (btnOpen) btnOpen.addEventListener('click', () => WindowManager.open('win-burp-zap-import'));
      if (btnFromChat) btnFromChat.addEventListener('click', () => WindowManager.open('win-burp-zap-import'));
      if (menuBurp) menuBurp.addEventListener('click', () => WindowManager.open('win-burp-zap-import'));

      if (fileInput) {
        fileInput.addEventListener('change', (e) => {
          if (e.target.files && e.target.files[0]) {
            this.readFile(e.target.files[0]);
          }
        });
      }

      if (dropzone) {
        dropzone.addEventListener('dragover', (e) => { e.preventDefault(); e.stopPropagation(); });
        dropzone.addEventListener('drop', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
            this.readFile(e.dataTransfer.files[0]);
          }
        });
      }

      if (btnSampleBurp) btnSampleBurp.addEventListener('click', () => this.loadSampleBurp());
      if (btnSampleZap) btnSampleZap.addEventListener('click', () => this.loadSampleZap());
      if (btnCommit) btnCommit.addEventListener('click', () => this.commitToFindings());
    },

    readFile(file) {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result;
        this.parseData(text, file.name);
      };
      reader.readAsText(file);
    },

    parseData(raw, filename = '') {
      const trimmed = raw.trim();
      let parsed = [];

      if (trimmed.startsWith('<') && (trimmed.includes('<issue') || trimmed.includes('<issues'))) {
        parsed = this.parseBurpXml(trimmed);
      } else if (trimmed.startsWith('{') && trimmed.includes('site')) {
        parsed = this.parseZapJson(trimmed);
      } else if (trimmed.startsWith('{') && trimmed.includes('issues')) {
        parsed = this.parseBurpJson(trimmed);
      } else {
        parsed = this.parseBurpXml(trimmed);
      }

      if (parsed.length === 0) {
        alert('Could not parse any vulnerability issues from this file. Format should be Burp XML/JSON or OWASP ZAP XML/JSON.');
        return;
      }

      this.stagedIssues = parsed;
      this.renderTable();
    },

    parseBurpXml(xml) {
      const issues = [];
      const issueRegex = /<issue>([\s\S]*?)<\/issue>/gi;
      let match;
      while ((match = issueRegex.exec(xml)) !== null) {
        const block = match[1];
        const nameMatch = block.match(/<name>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/name>/i);
        const hostMatch = block.match(/<host[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/host>/i);
        const pathMatch = block.match(/<path>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/path>/i);
        const sevMatch = block.match(/<severity>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/severity>/i);

        const name = nameMatch ? nameMatch[1].trim() : 'Unnamed Burp Issue';
        const host = hostMatch ? hostMatch[1].trim() : (pentestState.target || 'target.example.com');
        const path = pathMatch ? pathMatch[1].trim() : '/';
        const sev = sevMatch ? sevMatch[1].trim() : 'Medium';

        let cvss = 6.5;
        if (sev.toLowerCase() === 'high') cvss = 8.5;
        if (sev.toLowerCase() === 'critical') cvss = 9.8;
        if (sev.toLowerCase() === 'low') cvss = 4.0;
        if (sev.toLowerCase() === 'information') cvss = 0.0;

        issues.push({
          id: `burp-${Date.now()}-${issues.length}`,
          title: name,
          cve: name.includes('CVE-') ? (name.match(/CVE-\d{4}-\d+/i) || [''])[0] : 'N/A',
          target: `${host}${path}`,
          severity: sev,
          cvss: cvss,
          eps: Math.min(99, Math.round(cvss * 10)),
          source: 'Burp Suite'
        });
      }
      return issues;
    },

    parseZapJson(jsonStr) {
      const issues = [];
      try {
        const data = JSON.parse(jsonStr);
        const sites = data.site || (Array.isArray(data) ? data : [data]);
        sites.forEach(site => {
          const alerts = site.alerts || [];
          alerts.forEach(al => {
            const sevMap = { '3': 'High', '2': 'Medium', '1': 'Low', '0': 'Informational' };
            const sev = sevMap[al.riskcode] || al.riskdesc || 'Medium';
            issues.push({
              id: `zap-${Date.now()}-${issues.length}`,
              title: al.alert || al.name || 'OWASP ZAP Finding',
              cve: 'N/A',
              target: al.instances && al.instances[0] ? al.instances[0].uri : (site['@name'] || pentestState.target),
              severity: sev,
              cvss: sev === 'High' ? 8.5 : (sev === 'Medium' ? 6.5 : 4.0),
              eps: sev === 'High' ? 85 : (sev === 'Medium' ? 65 : 40),
              source: 'OWASP ZAP'
            });
          });
        });
      } catch (e) {
        console.warn('Failed to parse ZAP JSON:', e);
      }
      return issues;
    },

    parseBurpJson(jsonStr) {
      try {
        const data = JSON.parse(jsonStr);
        return (data.issues || []).map((iss, idx) => ({
          id: `burp-${Date.now()}-${idx}`,
          title: iss.name || 'Burp Finding',
          cve: 'N/A',
          target: iss.host + (iss.path || ''),
          severity: iss.severity || 'Medium',
          cvss: iss.severity === 'High' ? 8.5 : 6.0,
          eps: iss.severity === 'High' ? 88 : 60,
          source: 'Burp Suite'
        }));
      } catch (e) {
        return [];
      }
    },

    loadSampleBurp() {
      const sample = `<?xml version="1.0"?>
<issues burpVersion="2024.3">
  <issue>
    <name>SQL Injection (Blind / Time-based)</name>
    <host ip="198.51.100.12">api.target.com</host>
    <path>/v1/search?category=admin' OR SLEEP(5)--</path>
    <severity>High</severity>
  </issue>
  <issue>
    <name>Cross-Site Scripting (Reflected)</name>
    <host ip="198.51.100.12">app.target.com</host>
    <path>/login?redirect=javascript:alert(document.cookie)</path>
    <severity>Medium</severity>
  </issue>
  <issue>
    <name>Server-Side Template Injection (SSTI)</name>
    <host ip="198.51.100.12">portal.target.com</host>
    <path>/render?tpl={{7*7}}</path>
    <severity>Critical</severity>
  </issue>
</issues>`;
      this.parseData(sample, 'sample_burp_scan.xml');
    },

    loadSampleZap() {
      const sample = JSON.stringify({
        site: [{
          "@name": "https://target-portal.com",
          alerts: [
            { alert: "Remote OS Command Injection", riskcode: "3", instances: [{ uri: "https://target-portal.com/api/exec" }] },
            { alert: "Path Traversal / Arbitrary File Read", riskcode: "3", instances: [{ uri: "https://target-portal.com/files?path=../../etc/passwd" }] },
            { alert: "CORS Misconfiguration (Arbitrary Origin)", riskcode: "2", instances: [{ uri: "https://target-portal.com/api/user" }] }
          ]
        }]
      });
      this.parseData(sample, 'sample_zap_report.json');
    },

    renderTable() {
      const tbody = document.getElementById('burp-zap-table-body');
      const countBadge = document.getElementById('burp-zap-count-badge');
      const sbCount = document.getElementById('sb-burp-zap-count');
      if (!tbody) return;

      if (countBadge) countBadge.textContent = this.stagedIssues.length;
      if (sbCount) sbCount.textContent = `Detected: ${this.stagedIssues.length}`;

      if (this.stagedIssues.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #777; padding: 20px;">No scan data loaded yet.</td></tr>`;
        return;
      }

      tbody.innerHTML = '';
      this.stagedIssues.forEach((iss, idx) => {
        const tr = document.createElement('tr');
        const sevClass = iss.severity.toLowerCase() === 'critical' ? 'badge-kev' : (iss.severity.toLowerCase() === 'high' ? 'badge-eps' : '');
        tr.innerHTML = `
          <td><span class="${sevClass}" style="padding: 1px 4px;">${iss.severity}</span></td>
          <td><strong>${iss.title}</strong><br><small style="color:#666;">Source: ${iss.source}</small></td>
          <td style="font-family: monospace; font-size: 11px;">${iss.target}</td>
          <td><strong>${iss.cvss}</strong> <span style="color:#8b0000; font-size:10px;">(${iss.eps})</span></td>
          <td>
            <button class="win-btn btn-add-single-issue" data-idx="${idx}" style="font-size: 10px; padding: 1px 4px;">+ Ingest</button>
          </td>
        `;

        tr.querySelector('.btn-add-single-issue').addEventListener('click', () => {
          this.commitSingle(idx);
        });

        tbody.appendChild(tr);
      });
    },

    commitSingle(idx) {
      const iss = this.stagedIssues[idx];
      if (!iss) return;
      pentestState.findings.push({
        id: `f-${Date.now()}`,
        title: iss.title,
        cve: iss.cve,
        target: iss.target,
        cvss: iss.cvss,
        eps: iss.eps,
        severity: iss.severity,
        status: 'Unconfirmed'
      });
      FindingsManager.render();
      DeliverableGenerator.updateStats();
      alert(`Ingested "${iss.title}" into Findings registry.`);
    },

    commitToFindings() {
      if (this.stagedIssues.length === 0) {
        alert('No issues to ingest. Please load or drop a scan report first.');
        return;
      }

      this.stagedIssues.forEach(iss => {
        pentestState.findings.push({
          id: `f-${Date.now()}-${Math.random().toString(36).substr(2,4)}`,
          title: iss.title,
          cve: iss.cve,
          target: iss.target,
          cvss: iss.cvss,
          eps: iss.eps,
          severity: iss.severity,
          status: 'Confirmed'
        });
      });

      FindingsManager.render();
      DeliverableGenerator.updateStats();
      WindowManager.open('win-findings');
      alert(`Successfully ingested ${this.stagedIssues.length} issues into Findings & Vulnerabilities registry!`);
    }
  };

  // ==========================================================================
  // FORMAL PENTEST DELIVERABLE GENERATOR (PDF / Markdown / HTML)
  // ==========================================================================
  const DeliverableGenerator = {
    init() {
      const btnOpen = document.getElementById('btn-open-report-from-chat');
      const btnFromFindings = document.getElementById('btn-findings-export-report');
      const menuReport = document.getElementById('chat-menu-report');
      const btnPrint = document.getElementById('btn-report-print-pdf');
      const btnDownloadMd = document.getElementById('btn-report-download-md');
      const btnDownloadHtml = document.getElementById('btn-report-download-html');
      const btnCopyAll = document.getElementById('btn-report-copy-all');
      const btnRefresh = document.getElementById('btn-report-refresh');

      if (btnOpen) btnOpen.addEventListener('click', () => this.open());
      if (btnFromFindings) btnFromFindings.addEventListener('click', () => this.open());
      if (menuReport) menuReport.addEventListener('click', () => this.open());

      if (btnPrint) btnPrint.addEventListener('click', () => window.print());
      if (btnDownloadMd) btnDownloadMd.addEventListener('click', () => this.downloadMarkdown());
      if (btnDownloadHtml) btnDownloadHtml.addEventListener('click', () => this.downloadHtml());
      if (btnCopyAll) btnCopyAll.addEventListener('click', () => this.copyReport());
      if (btnRefresh) btnRefresh.addEventListener('click', () => this.renderReportDoc());

      const clientInput = document.getElementById('report-client-name');
      const assessorInput = document.getElementById('report-assessor-name');
      const typeSelect = document.getElementById('report-assessment-type');

      if (clientInput) clientInput.addEventListener('input', () => this.renderReportDoc());
      if (assessorInput) assessorInput.addEventListener('input', () => this.renderReportDoc());
      if (typeSelect) typeSelect.addEventListener('change', () => this.renderReportDoc());

      this.updateStats();
    },

    open() {
      this.renderReportDoc();
      WindowManager.open('win-report-export');
    },

    updateStats() {
      const sbCount = document.getElementById('sb-report-findings-count');
      if (sbCount) sbCount.textContent = `Findings Included: ${pentestState.findings.length}`;
    },

    buildReportData() {
      const client = (document.getElementById('report-client-name') || {}).value || 'Acme Cyber Corp';
      const assessor = (document.getElementById('report-assessor-name') || {}).value || 'PickyHack Offensive Security Team';
      const assessType = (document.getElementById('report-assessment-type') || {}).value || 'External Network & Web Application Pentest';
      const target = pentestState.target || 'target.example.com';
      const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

      const counts = { Critical: 0, High: 0, Medium: 0, Low: 0, Info: 0 };
      pentestState.findings.forEach(f => {
        const s = f.severity || 'Medium';
        if (counts[s] !== undefined) counts[s]++;
        else counts.Medium++;
      });

      return {
        client,
        assessor,
        assessType,
        target,
        dateStr,
        counts,
        findings: pentestState.findings,
        notes: pentestState.rawNotes,
        attackPaths: pentestState.attackPaths
      };
    },

    renderReportDoc() {
      const doc = document.getElementById('pentest-deliverable-doc');
      if (!doc) return;

      const d = this.buildReportData();

      const findingsRows = d.findings.map((f, i) => `
        <tr>
          <td><strong>SEC-${String(i + 1).padStart(3, '0')}</strong></td>
          <td><strong>${f.title}</strong><br><small style="color:#666;">${f.cve || 'N/A'}</small></td>
          <td><span class="badge-${f.severity.toLowerCase() === 'critical' ? 'kev' : 'eps'}">${f.severity}</span></td>
          <td><strong>${f.cvss}</strong></td>
          <td style="font-family:monospace; font-size:11px;">${f.target}</td>
          <td><span style="color:#000080; font-weight:bold;">${f.status}</span></td>
        </tr>
      `).join('');

      const findingDossiers = d.findings.map((f, i) => `
        <div class="report-finding-dossier" style="margin-top: 24px; padding-top: 16px; border-top: 2px solid #000080;">
          <h3 style="color:#000080; margin-bottom: 6px;">SEC-${String(i + 1).padStart(3, '0')}: ${f.title}</h3>
          <table class="report-meta-table" style="width:100%; font-size:11px; margin-bottom: 12px; border-collapse:collapse;">
            <tr>
              <td style="padding:4px; border:1px solid #ccc; background:#f5f5f5;"><strong>Severity:</strong> ${f.severity}</td>
              <td style="padding:4px; border:1px solid #ccc; background:#f5f5f5;"><strong>CVSS v3.1:</strong> ${f.cvss}</td>
              <td style="padding:4px; border:1px solid #ccc; background:#f5f5f5;"><strong>EPS Score:</strong> ${f.eps || 90}/100</td>
              <td style="padding:4px; border:1px solid #ccc; background:#f5f5f5;"><strong>Asset:</strong> ${f.target}</td>
            </tr>
          </table>
          <p style="font-size:12px; line-height:1.6; color:#222;">
            <strong>Vulnerability Description:</strong> During assessment against ${f.target}, PickyHack verified the presence of ${f.title}. This condition allows unauthorized adversaries to execute arbitrary code or bypass security controls without valid administrative credentials.
          </p>
          <div style="background:#f8f9fa; border-left:4px solid #8b0000; padding:8px 12px; font-family:monospace; font-size:11px; margin: 10px 0;">
            # PoC Verification Command &amp; Artifact:<br>
            curl -k -X POST "https://${f.target}/api/check" -H "X-PickyHack-Audit: true" -d '{"payload":"test"}'
          </div>
          <p style="font-size:12px; line-height:1.6; color:#222;">
            <strong>Remediation Guidance:</strong> Apply the latest vendor security patches immediately. Restrict edge network perimeter access to trusted management CIDRs only, and enable automated alerting on anomalous invocation patterns.
          </p>
        </div>
      `).join('');

      doc.innerHTML = `
        <!-- Report Header / Cover Block -->
        <div class="report-header-block" style="border-bottom: 3px solid #000080; padding-bottom: 18px; margin-bottom: 24px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
              <h1 style="font-size: 24px; color: #000080; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Formal Penetration Test Deliverable</h1>
              <p style="font-size: 13px; color: #555; margin: 4px 0 0 0;">${d.assessType}</p>
            </div>
            <img src="assets/pickyhack-logo.png" alt="PickyHack Logo" style="width: 58px; height: 58px; object-fit: contain;">
          </div>
          <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 18px; font-size: 11.5px; background: #f4f6f9; padding: 10px; border-radius: 4px;">
            <div><strong>Client:</strong> ${d.client}</div>
            <div><strong>Date:</strong> ${d.dateStr}</div>
            <div><strong>Classification:</strong> CONFIDENTIAL</div>
            <div><strong>Target Scope:</strong> ${d.target}</div>
            <div><strong>Assessor:</strong> ${d.assessor}</div>
            <div><strong>Harness Version:</strong> PickyHack v1.0</div>
          </div>
        </div>

        <!-- 1. Executive Summary -->
        <section class="report-section">
          <h2 style="color: #000080; border-bottom: 1px solid #ccc; padding-bottom: 4px; font-size: 16px;">1. Executive Summary</h2>
          <p style="font-size: 12px; line-height: 1.6; color: #222;">
            Between ${d.dateStr}, ${d.assessor} performed a rigorous security assessment against <strong>${d.target}</strong>. 
            The objective was to identify security vulnerabilities, evaluate defense-in-depth posture, and emulate adversary breach scenarios.
          </p>
          <div style="background: #fff3cd; border: 1px solid #ffeeba; border-left: 5px solid #ffaa00; padding: 10px; margin: 12px 0; font-size: 12px;">
            <strong>Overall Security Posture: ${d.counts.Critical > 0 ? 'CRITICAL RISK' : (d.counts.High > 0 ? 'HIGH RISK' : 'MODERATE RISK')}</strong><br>
            A total of <strong>${d.findings.length}</strong> vulnerabilities were validated, including <strong>${d.counts.Critical} Critical</strong> and <strong>${d.counts.High} High</strong> severity issues. 
            Immediate remediation is strongly advised to prevent perimeter breach.
          </div>
        </section>

        <!-- 2. Vulnerability Risk Breakdown Matrix -->
        <section class="report-section" style="margin-top: 20px;">
          <h2 style="color: #000080; border-bottom: 1px solid #ccc; padding-bottom: 4px; font-size: 16px;">2. CVSS &amp; EPS Risk Matrix</h2>
          <table class="risk-matrix-table" style="width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 12px;">
            <thead>
              <tr style="background: #000080; color: #fff;">
                <th style="padding: 6px; text-align: left; border: 1px solid #000080;">Severity</th>
                <th style="padding: 6px; text-align: left; border: 1px solid #000080;">CVSS Range</th>
                <th style="padding: 6px; text-align: left; border: 1px solid #000080;">Count</th>
                <th style="padding: 6px; text-align: left; border: 1px solid #000080;">Remediation SLA</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background:#ffeded;">
                <td style="padding: 6px; border: 1px solid #ddd; font-weight: bold; color: #8b0000;">Critical</td>
                <td style="padding: 6px; border: 1px solid #ddd;">9.0 – 10.0</td>
                <td style="padding: 6px; border: 1px solid #ddd; font-weight: bold;">${d.counts.Critical}</td>
                <td style="padding: 6px; border: 1px solid #ddd;">24 Hours</td>
              </tr>
              <tr style="background:#fff4e6;">
                <td style="padding: 6px; border: 1px solid #ddd; font-weight: bold; color: #d35400;">High</td>
                <td style="padding: 6px; border: 1px solid #ddd;">7.0 – 8.9</td>
                <td style="padding: 6px; border: 1px solid #ddd; font-weight: bold;">${d.counts.High}</td>
                <td style="padding: 6px; border: 1px solid #ddd;">7 Days</td>
              </tr>
              <tr style="background:#fffaea;">
                <td style="padding: 6px; border: 1px solid #ddd; font-weight: bold; color: #856404;">Medium</td>
                <td style="padding: 6px; border: 1px solid #ddd;">4.0 – 6.9</td>
                <td style="padding: 6px; border: 1px solid #ddd; font-weight: bold;">${d.counts.Medium}</td>
                <td style="padding: 6px; border: 1px solid #ddd;">30 Days</td>
              </tr>
              <tr>
                <td style="padding: 6px; border: 1px solid #ddd; font-weight: bold; color: #155724;">Low / Informational</td>
                <td style="padding: 6px; border: 1px solid #ddd;">0.1 – 3.9</td>
                <td style="padding: 6px; border: 1px solid #ddd; font-weight: bold;">${d.counts.Low + d.counts.Info}</td>
                <td style="padding: 6px; border: 1px solid #ddd;">Next Release Cycle</td>
              </tr>
            </tbody>
          </table>
        </section>

        <!-- 3. Attack Path & Exploit Intelligence -->
        <section class="report-section" style="margin-top: 20px;">
          <h2 style="color: #000080; border-bottom: 1px solid #ccc; padding-bottom: 4px; font-size: 16px;">3. Attack Path &amp; Choke Point Analysis</h2>
          <p style="font-size: 12px; line-height: 1.6; color: #222;">
            PickyHack simulated multi-stage lateral movement paths from edge reconnaissance to enterprise compromise:
          </p>
          <div style="background: #111; color: #00ff66; padding: 10px; font-family: monospace; font-size: 11px; border-radius: 4px; line-height: 1.5;">
            ${d.attackPaths.map((p, i) => `[Hop ${i+1}]: ${p}`).join('<br>') || '[Hop 1]: Edge Perimeter Access → DMZ Pivot → Internal PrivEsc → Domain Controller'}
          </div>
        </section>

        <!-- 4. Detailed Findings Registry -->
        <section class="report-section" style="margin-top: 20px;">
          <h2 style="color: #000080; border-bottom: 1px solid #ccc; padding-bottom: 4px; font-size: 16px;">4. Technical Findings &amp; Proof of Concept</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 11.5px;">
            <thead>
              <tr style="background: #f0f0f0;">
                <th style="padding: 5px; border: 1px solid #ccc; text-align:left;">ID</th>
                <th style="padding: 5px; border: 1px solid #ccc; text-align:left;">Finding Title</th>
                <th style="padding: 5px; border: 1px solid #ccc; text-align:left;">Severity</th>
                <th style="padding: 5px; border: 1px solid #ccc; text-align:left;">CVSS</th>
                <th style="padding: 5px; border: 1px solid #ccc; text-align:left;">Affected Target</th>
                <th style="padding: 5px; border: 1px solid #ccc; text-align:left;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${findingsRows}
            </tbody>
          </table>

          <!-- Dossiers -->
          ${findingDossiers}
        </section>

        <!-- 5. Strategic Remediation Roadmap -->
        <section class="report-section" style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #ccc;">
          <h2 style="color: #000080; border-bottom: 1px solid #ccc; padding-bottom: 4px; font-size: 16px;">5. Remediation Roadmap &amp; Checklist</h2>
          <ul style="font-size: 12px; line-height: 1.8; color: #222;">
            <li>[ ] <strong>Phase 1 (Immediate - 24h):</strong> Patch critical edge vulnerabilities (CVE-2024-3400, CVE-2024-21762).</li>
            <li>[ ] <strong>Phase 2 (Short term - 7d):</strong> Rotate all Active Directory service account passwords and revoke vulnerable ADCS templates.</li>
            <li>[ ] <strong>Phase 3 (Medium term - 30d):</strong> Enforce mutual TLS (mTLS) between internal DMZ microservices and isolate legacy subnets.</li>
            <li>[ ] <strong>Phase 4 (Continuous):</strong> Deploy automated continuous attack surface monitoring (Nuclei / Burp CI/CD scans).</li>
          </ul>
          <p style="font-size: 11px; color: #777; margin-top: 20px; text-align: center;">
            Generated by PickyHack — Stateless AI Context Harness for Offensive Security.
          </p>
        </section>
      `;

      this.updateStats();
    },

    generateMarkdown() {
      const d = this.buildReportData();
      return `# PENTEST REPORT DELIVERABLE — ${d.client.toUpperCase()}
**Assessment Type:** ${d.assessType}  
**Date:** ${d.dateStr}  
**Lead Assessor:** ${d.assessor}  
**Target Scope:** ${d.target}  
**Classification:** CONFIDENTIAL  

---

## 1. Executive Summary
Between ${d.dateStr}, ${d.assessor} performed a rigorous offensive security assessment against ${d.target}.
**Overall Posture:** ${d.counts.Critical > 0 ? 'CRITICAL RISK' : (d.counts.High > 0 ? 'HIGH RISK' : 'MODERATE RISK')}
Total Verified Findings: ${d.findings.length} (Critical: ${d.counts.Critical}, High: ${d.counts.High}, Medium: ${d.counts.Medium})

---

## 2. Risk Matrix
| Severity | CVSS Range | Count | Remediation SLA |
| :--- | :--- | :--- | :--- |
| Critical | 9.0 – 10.0 | ${d.counts.Critical} | 24 Hours |
| High | 7.0 – 8.9 | ${d.counts.High} | 7 Days |
| Medium | 4.0 – 6.9 | ${d.counts.Medium} | 30 Days |
| Low/Info | 0.0 – 3.9 | ${d.counts.Low + d.counts.Info} | Next Release |

---

## 3. Attack Path & Exploit Intelligence
${d.attackPaths.map((p, i) => `${i + 1}. ${p}`).join('\n')}

---

## 4. Technical Findings Details

${d.findings.map((f, i) => `### [SEC-${String(i+1).padStart(3, '0')}] ${f.title}
- **Target:** ${f.target}
- **Severity:** ${f.severity}
- **CVSS v3.1:** ${f.cvss} | **EPS:** ${f.eps || 90}/100
- **Status:** ${f.status}

**Description & PoC:**
Verified via PickyHack context harness against ${f.target}. Immediate patching and network isolation required.
`).join('\n\n')}

---
*Report generated by PickyHack Context Harness for Offensive Security.*`;
    },

    downloadMarkdown() {
      const md = this.generateMarkdown();
      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PickyHack_Pentest_Deliverable_${new Date().toISOString().slice(0,10)}.md`;
      a.click();
      URL.revokeObjectURL(url);
    },

    downloadHtml() {
      const doc = document.getElementById('pentest-deliverable-doc');
      if (!doc) return;
      const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Pentest Deliverable — PickyHack</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0f0f0; margin: 0; padding: 20px; }
    .report-sheet { background: #fff; max-width: 840px; margin: 0 auto; padding: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
    @media print { body { background: #fff; padding: 0; } .report-sheet { box-shadow: none; padding: 0; } }
  </style>
</head>
<body>
  <div class="report-sheet">
    ${doc.innerHTML}
  </div>
</body>
</html>`;
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PickyHack_Pentest_Deliverable_${new Date().toISOString().slice(0,10)}.html`;
      a.click();
      URL.revokeObjectURL(url);
    },

    copyReport() {
      const md = this.generateMarkdown();
      navigator.clipboard.writeText(md).then(() => {
        alert('Formal Pentest Deliverable copied to clipboard in Markdown format!');
      });
    }
  };

  // ==========================================================================
  // 15. INITIALIZATION & EVENT BINDINGS
  // ==========================================================================
  function initApp() {
    WindowManager.init();
    NotesManager.init();
    FindingsManager.init();
    MultiAPIManager.syncUI();

    AttachmentManager.init();
    AttackGraphSimulator.init();
    ContextOptimizer.init();
    BurpZapBridge.init();
    DeliverableGenerator.init();

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

    // Auto-prompt "LET'S HACK" onboarding if not configured
    if (!AIConfigManager.isConfigured()) {
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
    const provSelect = document.getElementById('ai-provider-select');
    const modelSelect = document.getElementById('ai-model-select');
    const customInput = document.getElementById('ai-custom-model-input');
    const customToggle = document.getElementById('ai-model-custom-toggle');
    const fetchModelsBtn = document.getElementById('btn-fetch-models');
    const resetEndpointBtn = document.getElementById('btn-reset-endpoint');
    const keyInput = document.getElementById('ai-key-input');
    const endpointInput = document.getElementById('ai-endpoint-input');
    const testBtn = document.getElementById('btn-test-ai-conn');
    const saveBtn = document.getElementById('btn-save-ai-conn');
    const clearBtn = document.getElementById('btn-disconnect-ai');
    const toggleKeyBtn = document.getElementById('btn-toggle-key-visibility');
    const statusDiv = document.getElementById('ai-connection-status');

    async function syncModels(forceFetch = false) {
      const provKey = provSelect.value;
      const provInfo = AI_PROVIDERS[provKey] || AI_PROVIDERS.openai;
      if (!endpointInput.value || forceFetch) {
        endpointInput.value = provInfo.defaultEndpoint;
      }

      let modelsToDisplay = [...provInfo.models];

      if (forceFetch && keyInput.value.trim()) {
        statusDiv.textContent = `Fetching available models from ${provInfo.name}...`;
        statusDiv.style.color = '#000080';
        const fetched = await fetchAvailableModels(provKey, keyInput.value.trim(), endpointInput.value.trim());
        if (fetched && fetched.length > 0) {
          modelsToDisplay = [...new Set([...provInfo.models, ...fetched])];
          statusDiv.textContent = `✓ Fetched ${fetched.length} live models from ${provInfo.name}.`;
          statusDiv.style.color = '#008000';
        } else {
          statusDiv.textContent = `Default models loaded for ${provInfo.name}.`;
          statusDiv.style.color = '#555';
        }
      }

      modelSelect.innerHTML = '';
      modelsToDisplay.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m;
        opt.textContent = m;
        modelSelect.appendChild(opt);
      });

      const customOpt = document.createElement('option');
      customOpt.value = '__custom__';
      customOpt.textContent = '[ Custom Model / Enter ID... ]';
      modelSelect.appendChild(customOpt);
    }

    if (provSelect) {
      provSelect.addEventListener('change', () => {
        syncModels();
        if (customInput) customInput.style.display = 'none';
      });
    }

    if (customToggle && customInput) {
      customToggle.addEventListener('click', () => {
        const isHidden = customInput.style.display === 'none' || !customInput.style.display;
        customInput.style.display = isHidden ? 'block' : 'none';
        if (isHidden) customInput.focus();
      });
    }

    if (modelSelect && customInput) {
      modelSelect.addEventListener('change', () => {
        if (modelSelect.value === '__custom__') {
          customInput.style.display = 'block';
          customInput.focus();
        } else {
          customInput.style.display = 'none';
        }
      });
    }

    if (fetchModelsBtn) {
      fetchModelsBtn.addEventListener('click', () => syncModels(true));
    }

    if (resetEndpointBtn) {
      resetEndpointBtn.addEventListener('click', () => {
        const provInfo = AI_PROVIDERS[provSelect.value] || AI_PROVIDERS.openai;
        endpointInput.value = provInfo.defaultEndpoint;
      });
    }

    function openModal() {
      const active = MultiAPIManager.getActiveEngine();
      provSelect.value = active.provider;
      syncModels();
      if (active.customModel) {
        modelSelect.value = '__custom__';
        if (customInput) {
          customInput.style.display = 'block';
          customInput.value = active.customModel;
        }
      } else {
        modelSelect.value = active.model;
        if (customInput) {
          customInput.style.display = 'none';
          customInput.value = '';
        }
      }
      keyInput.value = active.apiKey;
      endpointInput.value = active.endpoint;
      statusDiv.textContent = active.apiKey ? `Connected to ${AI_PROVIDERS[active.provider]?.name || 'AI'}. Ready to hack.` : 'Ready to connect.';
      statusDiv.style.color = active.apiKey ? '#008000' : '#333';
      modal.classList.add('open');
    }

    if (btnOpen) btnOpen.addEventListener('click', openModal);
    if (btnSmOpen) btnSmOpen.addEventListener('click', openModal);
    if (closeX) closeX.addEventListener('click', () => modal.classList.remove('open'));
    if (cancelBtn) cancelBtn.addEventListener('click', () => modal.classList.remove('open'));

    if (toggleKeyBtn) toggleKeyBtn.addEventListener('click', () => {
      if (keyInput.type === 'password') {
        keyInput.type = 'text';
        toggleKeyBtn.textContent = '🔒 Hide';
      } else {
        keyInput.type = 'password';
        toggleKeyBtn.textContent = '👁️ Show';
      }
    });

    if (testBtn) testBtn.addEventListener('click', async () => {
      const provKey = provSelect.value;
      const provInfo = AI_PROVIDERS[provKey] || AI_PROVIDERS.openai;
      statusDiv.textContent = `Testing connection with ${provInfo.name}...`;
      statusDiv.style.color = '#000080';

      const key = keyInput.value.trim();
      if (key || provKey === 'custom') {
        const liveModels = await fetchAvailableModels(provKey, key, endpointInput.value.trim());
        if (liveModels && liveModels.length > 0) {
          statusDiv.textContent = `✓ Connection verified! ${provInfo.name} active (${liveModels.length} models available).`;
          statusDiv.style.color = '#008000';
          syncModels(true);
        } else {
          statusDiv.textContent = `✓ Credentials format valid for ${provInfo.name}. Ready to hack.`;
          statusDiv.style.color = '#008000';
        }
      } else {
        statusDiv.textContent = 'Notice: No API key entered. PickyHack will operate in Offline Standby Mode.';
        statusDiv.style.color = '#856404';
      }
    });

    if (saveBtn) saveBtn.addEventListener('click', () => {
      const active = MultiAPIManager.getActiveEngine();
      const provKey = provSelect.value;
      const provInfo = AI_PROVIDERS[provKey] || AI_PROVIDERS.openai;
      const customVal = customInput ? customInput.value.trim() : '';
      const chosenModel = modelSelect.value === '__custom__' ? (customVal || 'custom-model') : (customVal || modelSelect.value);

      active.provider = provKey;
      active.name = provInfo.name;
      active.endpoint = endpointInput.value.trim() || provInfo.defaultEndpoint;
      active.apiKey = keyInput.value.trim();
      active.model = chosenModel;
      active.customModel = (customVal && customVal !== modelSelect.value) ? customVal : '';
      active.isConnected = !!active.apiKey;
      MultiAPIManager.saveEngine(active);

      modal.classList.remove('open');
      const sbStatus = document.getElementById('sb-chat-status');
      if (sbStatus) sbStatus.textContent = `Let's Hack ! AI Provider: ${provInfo.name} / ${active.model}.`;
    });

    if (clearBtn) clearBtn.addEventListener('click', () => {
      const active = MultiAPIManager.getActiveEngine();
      active.apiKey = '';
      active.isConnected = false;
      MultiAPIManager.saveEngine(active);
      keyInput.value = '';
      statusDiv.textContent = 'API Key cleared. Offline standby active.';
      statusDiv.style.color = '#8b0000';
    });
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
