/**
 * PickyHack — Universal AI Provider System & Registry
 * Abstract, extensible provider-agnostic dispatch engine.
 * Bring Your Own Model — Your model. Your provider. Your context.
 */
(function(root) {
  'use strict';

  const STORAGE_KEY = 'pickyhack_multi_api_engines';
  const ACTIVE_KEY = 'pickyhack_active_engine_id';

  const defaultEngines = [
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
      isLocal: false,
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
      isLocal: false,
      isConnected: false
    },
    {
      id: 'engine-gemini',
      name: 'Google Gemini',
      provider: 'gemini',
      endpoint: 'https://generativelanguage.googleapis.com/v1beta',
      apiKey: '',
      model: 'gemini-2.5-pro',
      customModel: '',
      role: 'Fast Research',
      capabilities: { contextWindow: 1000000, vision: true, tools: true, reasoning: true, streaming: true },
      isLocal: false,
      isConnected: false
    },
    {
      id: 'engine-ollama',
      name: 'Ollama (Local / Air-Gapped)',
      provider: 'ollama',
      endpoint: 'http://localhost:11434/v1',
      apiKey: '',
      model: 'llama3.3:70b',
      customModel: '',
      role: 'Sensitive / Private Pentest',
      capabilities: { contextWindow: 32768, vision: false, tools: true, reasoning: false, streaming: true },
      isLocal: true,
      isConnected: false
    }
  ];

  const memoryStore = {};
  const safeStorage = {
    getItem(key) {
      if (typeof localStorage !== 'undefined') {
        try { return localStorage.getItem(key); } catch(e) { return null; }
      }
      return memoryStore[key] !== undefined ? memoryStore[key] : null;
    },
    setItem(key, val) {
      if (typeof localStorage !== 'undefined') {
        try { localStorage.setItem(key, val); return; } catch(e) {}
      }
      memoryStore[key] = String(val);
    },
    removeItem(key) {
      if (typeof localStorage !== 'undefined') {
        try { localStorage.removeItem(key); return; } catch(e) {}
      }
      delete memoryStore[key];
    }
  };

  const ProviderRegistry = {
    /**
     * Retrieves the master catalog of all supported cloud and local providers.
     */
    getCatalog() {
      const catalogModule = root.ProvidersCatalog || (typeof module !== 'undefined' ? require('../config/providers-catalog') : null);
      return catalogModule ? catalogModule.PROVIDER_CATALOG : {};
    },

    /**
     * Retrieves the Open Models directory (open-weight models including OLMoE).
     */
    getOpenModels() {
      const catalogModule = root.ProvidersCatalog || (typeof module !== 'undefined' ? require('../config/providers-catalog') : null);
      return catalogModule ? catalogModule.OPEN_MODELS_DIRECTORY : [];
    },

    /**
     * Retrieves user-configured engine profiles from localStorage.
     */
    getEngines() {
      try {
        const raw = safeStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn('Could not load engines from localStorage:', e);
      }
      return JSON.parse(JSON.stringify(defaultEngines));
    },

    saveEngines(engines) {
      try {
        safeStorage.setItem(STORAGE_KEY, JSON.stringify(engines));
      } catch (e) {
        console.warn('Could not save engines to localStorage:', e);
      }
    },

    getActiveEngineId() {
      const stored = safeStorage.getItem(ACTIVE_KEY);
      if (stored) return stored;
      const engines = this.getEngines();
      return engines[0] ? engines[0].id : 'engine-openai';
    },

    setActiveEngineId(id) {
      safeStorage.setItem(ACTIVE_KEY, id);
      if (root.MultiAPIManager && typeof root.MultiAPIManager.syncUI === 'function') {
        root.MultiAPIManager.syncUI();
      }
    },

    getActiveEngine() {
      const engines = this.getEngines();
      const activeId = this.getActiveEngineId();
      return engines.find(e => e.id === activeId) || engines[0] || defaultEngines[0];
    },

    /**
     * Checks whether an AI provider has been successfully configured and verified.
     * Returns false on first launch or when credentials have not been configured/tested.
     * Requires hasCompletedAIOnboarding === true AND valid verified credentials.
     */
    hasValidConfig() {
      const onboarded = safeStorage.getItem('hasCompletedAIOnboarding') === 'true' ||
                        safeStorage.getItem('pickyhack_onboarded') === 'true';
      if (!onboarded) return false;
      const active = this.getActiveEngine();
      if (!active) return false;
      const isLocal = active.isLocal || active.provider === 'ollama' || active.provider === 'local' ||
                      (active.endpoint && (active.endpoint.includes('localhost') || active.endpoint.includes('127.0.0.1')));
      if (isLocal) {
        return !!(active.endpoint && active.endpoint.trim().length > 0 && active.isConnected);
      }
      return !!(active.apiKey && active.apiKey.trim().length > 0 && active.isConnected);
    },

    /**
     * Clear onboarding status check: returns true ONLY if onboarding was completed
     * AND configuration is currently valid and verified.
     */
    hasCompletedAIOnboarding() {
      return this.hasValidConfig();
    },

    /**
     * Tests live connection against the specified AI engine configuration.
     * Verifies provider, API key, endpoint, model, and auth with actionable error details.
     */
    async testConnection(engineConfig) {
      const cfg = engineConfig || this.getActiveEngine();
      const provider = cfg.provider || 'openai';
      const apiKey = (cfg.apiKey || '').trim();
      const endpoint = (cfg.endpoint || 'https://api.openai.com/v1').replace(/\/+$/, '');
      const model = (cfg.customModel || cfg.model || '').trim();
      const isLocal = cfg.isLocal || provider === 'ollama' || provider === 'local' ||
                      endpoint.includes('localhost') || endpoint.includes('127.0.0.1');

      if (!isLocal && !apiKey) {
        return {
          success: false,
          error: 'API key required.'
        };
      }

      const startTime = Date.now();

      try {
        if (provider === 'anthropic') {
          const testModel = model || 'claude-3-5-sonnet-20241022';
          const res = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': apiKey,
              'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
              model: testModel,
              messages: [{ role: 'user', content: 'ping' }],
              max_tokens: 1
            })
          });
          const latencyMs = Date.now() - startTime;
          if (res.status === 401) {
            return { success: false, error: 'Invalid API key: Authentication failed (401 Unauthorized).' };
          }
          if (res.status === 404) {
            return { success: false, error: `Model not found: Model '${testModel}' does not exist or account lacks access.` };
          }
          if (res.status === 429) {
            return { success: false, error: 'Rate limit exceeded: Provider rate limit hit (429).' };
          }
          if (!res.ok) {
            const text = await res.text().catch(() => '');
            return { success: false, error: `Unauthorized or invalid configuration: HTTP ${res.status} (${text.slice(0, 100)})` };
          }
          cfg.isConnected = true;
          this.saveEngine(cfg);
          safeStorage.setItem('hasCompletedAIOnboarding', 'true');
          safeStorage.setItem('pickyhack_onboarded', 'true');
          return { success: true, message: 'Connection successful', model: testModel, latencyMs };

        } else if (provider === 'gemini') {
          const testModel = model || 'gemini-2.0-flash';
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${testModel}:generateContent?key=${apiKey}`;
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: 'ping' }] }],
              generationConfig: { maxOutputTokens: 1 }
            })
          });
          const latencyMs = Date.now() - startTime;
          if (res.status === 400 || res.status === 403) {
            const errJson = await res.json().catch(() => ({}));
            const msg = errJson.error ? errJson.error.message : 'Invalid API key';
            return { success: false, error: `Invalid API key: ${msg}` };
          }
          if (res.status === 404) {
            return { success: false, error: `Model not found: Gemini model '${testModel}' not found.` };
          }
          if (res.status === 429) {
            return { success: false, error: 'Rate limit exceeded: Gemini quota reached (429).' };
          }
          if (!res.ok) {
            return { success: false, error: `Connection failed: HTTP ${res.status}` };
          }
          cfg.isConnected = true;
          this.saveEngine(cfg);
          safeStorage.setItem('hasCompletedAIOnboarding', 'true');
          safeStorage.setItem('pickyhack_onboarded', 'true');
          return { success: true, message: 'Connection successful', model: testModel, latencyMs };

        } else if (isLocal) {
          let testUrl = `${endpoint}/models`;
          if (provider === 'ollama') {
            testUrl = endpoint.includes('/v1') ? endpoint.replace(/\/v1$/, '/api/tags') : `${endpoint}/api/tags`;
          }
          try {
            const res = await fetch(testUrl, { method: 'GET' });
            const latencyMs = Date.now() - startTime;
            if (!res.ok && res.status !== 404) {
              return { success: false, error: `Endpoint error: Server returned HTTP ${res.status}.` };
            }
            cfg.isConnected = true;
            this.saveEngine(cfg);
            safeStorage.setItem('hasCompletedAIOnboarding', 'true');
            safeStorage.setItem('pickyhack_onboarded', 'true');
            return { success: true, message: 'Connection successful', model: model || 'local', latencyMs };
          } catch (netErr) {
            return { success: false, error: `Endpoint unreachable: Could not connect to local server at ${endpoint}. Ensure Ollama or local LLM server is running.` };
          }

        } else {
          // Standard OpenAI-Compatible endpoints
          const checkUrl = `${endpoint}/models`;
          const headers = { 'Content-Type': 'application/json' };
          if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;
          if (provider === 'openrouter') {
            headers['HTTP-Referer'] = 'https://pickyhack.app';
            headers['X-Title'] = 'PickyHack Pentest Copilot';
          }

          const res = await fetch(checkUrl, { method: 'GET', headers });
          const latencyMs = Date.now() - startTime;
          if (res.status === 401) {
            return { success: false, error: 'Invalid API key: Authentication failed (401 Unauthorized).' };
          }
          if (res.status === 403) {
            return { success: false, error: 'Unauthorized: Access forbidden (403 Forbidden).' };
          }
          if (res.status === 404) {
            // Fallback for custom endpoints without /models
            const testModel = model || 'gpt-4o';
            const compRes = await fetch(`${endpoint}/chat/completions`, {
              method: 'POST',
              headers,
              body: JSON.stringify({
                model: testModel,
                messages: [{ role: 'user', content: 'ping' }],
                max_tokens: 1
              })
            });
            if (compRes.status === 401) return { success: false, error: 'Invalid API key: Authentication failed (401 Unauthorized).' };
            if (compRes.status === 404) return { success: false, error: `Model not found: Model '${testModel}' was not found at ${endpoint}.` };
            if (compRes.status === 429) return { success: false, error: 'Rate limit exceeded: Provider quota reached (429).' };
            if (!compRes.ok) return { success: false, error: `Invalid configuration: Endpoint returned HTTP ${compRes.status}.` };
            cfg.isConnected = true;
            this.saveEngine(cfg);
            safeStorage.setItem('hasCompletedAIOnboarding', 'true');
            safeStorage.setItem('pickyhack_onboarded', 'true');
            return { success: true, message: 'Connection successful', model: testModel, latencyMs };
          }
          if (res.status === 429) {
            return { success: false, error: 'Rate limit exceeded: Provider quota reached (429).' };
          }
          if (!res.ok) {
            const text = await res.text().catch(() => '');
            return { success: false, error: `Connection failed: HTTP ${res.status} (${text.slice(0, 100)})` };
          }

          cfg.isConnected = true;
          this.saveEngine(cfg);
          safeStorage.setItem('hasCompletedAIOnboarding', 'true');
          safeStorage.setItem('pickyhack_onboarded', 'true');
          return { success: true, message: 'Connection successful', model: model || 'gpt-4o', latencyMs };
        }
      } catch (err) {
        const msg = err.message || '';
        if (msg.includes('Failed to fetch') || msg.includes('ECONNREFUSED') || msg.includes('ENOTFOUND') || msg.includes('fetch failed')) {
          return { success: false, error: `Endpoint unreachable: Could not establish network connection to ${endpoint}.` };
        }
        return { success: false, error: `Connection failed: ${msg}` };
      }
    },

    saveEngine(engineData) {
      const engines = this.getEngines();
      const catalog = this.getCatalog();
      const prov = catalog[engineData.provider] || catalog.custom || {};
      
      const isLocal = engineData.endpoint ? (
        engineData.endpoint.includes('localhost') ||
        engineData.endpoint.includes('127.0.0.1') ||
        prov.isLocal === true
      ) : prov.isLocal;

      const prepared = {
        ...engineData,
        isLocal,
        capabilities: this.detectCapabilities(engineData.provider, engineData.customModel || engineData.model)
      };

      const existingIdx = engines.findIndex(e => e.id === engineData.id);
      if (existingIdx >= 0) {
        engines[existingIdx] = { ...engines[existingIdx], ...prepared };
      } else {
        engines.push({
          id: engineData.id || `engine-${Date.now()}`,
          ...prepared
        });
      }

      this.saveEngines(engines);
      if (!engineData.id || engineData.id === this.getActiveEngineId()) {
        this.setActiveEngineId(engineData.id || engines[engines.length - 1].id);
      }
      return prepared;
    },

    deleteEngine(id) {
      let engines = this.getEngines();
      if (engines.length <= 1) {
        if (typeof alert !== 'undefined') alert('You must keep at least one configured AI engine profile.');
        return;
      }
      engines = engines.filter(e => e.id !== id);
      this.saveEngines(engines);
      if (this.getActiveEngineId() === id) {
        this.setActiveEngineId(engines[0].id);
      }
    },

    /**
     * Dynamically discovers available models from the provider's API.
     * Supports standard GET /v1/models, Anthropic Models API, Ollama /api/tags, and Gemini.
     */
    async discoverModels(providerKey, apiKey, endpointUrl) {
      const catalog = this.getCatalog();
      const provInfo = catalog[providerKey] || catalog.custom || {};
      const endpoint = (endpointUrl || provInfo.defaultEndpoint || 'https://api.openai.com/v1').replace(/\/+$/, '');

      try {
        // 1. Anthropic Models API
        if (providerKey === 'anthropic') {
          if (!apiKey) return provInfo.models || [];
          const res = await fetch('https://api.anthropic.com/v1/models', {
            method: 'GET',
            headers: {
              'x-api-key': apiKey,
              'anthropic-version': '2023-06-01'
            }
          });
          if (res.ok) {
            const data = await res.json();
            if (data && Array.isArray(data.data)) {
              return data.data.map(m => m.id);
            }
          }
        }

        // 2. Google Gemini Models API
        if (providerKey === 'gemini') {
          if (!apiKey) return provInfo.models || [];
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
          if (res.ok) {
            const data = await res.json();
            if (data && Array.isArray(data.models)) {
              return data.models
                .map(m => m.name.replace(/^models\//, ''))
                .filter(id => id.includes('gemini'));
            }
          }
        }

        // 3. Ollama Native API (first tries /api/tags, then /v1/models)
        if (providerKey === 'ollama') {
          try {
            const tagRes = await fetch('http://localhost:11434/api/tags');
            if (tagRes.ok) {
              const data = await tagRes.json();
              if (data && Array.isArray(data.models)) {
                return data.models.map(m => m.name);
              }
            }
          } catch (e) {}
        }

        // 4. Standard OpenAI-Compatible Models API (OpenAI, Mistral, Groq, Together, LM Studio, vLLM, OpenRouter, Custom)
        const modelsUrl = `${endpoint}/models`;
        const headers = {};
        if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;
        if (providerKey === 'openrouter') {
          headers['HTTP-Referer'] = 'https://pickyhack.app';
          headers['X-Title'] = 'PickyHack Pentest Copilot';
        }

        const res = await fetch(modelsUrl, { method: 'GET', headers });
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.data)) {
            return data.data.map(m => m.id);
          }
        }
      } catch (err) {
        console.warn(`Dynamic model discovery failed for ${provInfo.name}:`, err.message);
      }

      // Safe fallback to known catalog models
      return provInfo.models || ['default-model'];
    },

    /**
     * Detects model capabilities (Text, Vision, Tools, Reasoning, Context Window).
     */
    detectCapabilities(providerKey, modelId) {
      const lower = (modelId || '').toLowerCase();
      
      const vision = (
        lower.includes('vision') ||
        lower.includes('gpt-4o') ||
        lower.includes('gpt-4.5') ||
        lower.includes('claude-3') ||
        lower.includes('gemini') ||
        lower.includes('pixtral') ||
        lower.includes('qwen-vl')
      );

      const reasoning = (
        lower.includes('o1') ||
        lower.includes('o3') ||
        lower.includes('r1') ||
        lower.includes('reasoner') ||
        lower.includes('claude-3-7') ||
        lower.includes('qwq')
      );

      let contextWindow = 32768;
      if (lower.includes('gemini-2') || lower.includes('gemini-1.5')) contextWindow = 1000000;
      else if (lower.includes('claude-3') || lower.includes('codestral-2501')) contextWindow = 200000;
      else if (lower.includes('gpt-4o') || lower.includes('llama-3.3') || lower.includes('qwen2.5') || lower.includes('mistral-large')) contextWindow = 128000;
      else if (lower.includes('deepseek')) contextWindow = 64000;

      return {
        text: true,
        vision,
        tools: true,
        reasoning,
        streaming: true,
        contextWindow
      };
    },

    /**
     * Dispatches an LLM inference request across any provider.
     * Supports optional streaming via options.onChunk and cancellation via options.signal.
     */
    async send(systemPrompt, userPrompt, specificEngine = null, images = [], options = {}) {
      const cfg = specificEngine || this.getActiveEngine();
      const model = cfg.customModel || cfg.model;

      // If no API key and not a local server, PickyHack does NOT fake AI responses
      if (!cfg.apiKey && !cfg.isLocal && cfg.provider !== 'custom') {
        return {
          text: `⚠️ **No AI engine configured.**\n\nPlease connect your AI provider in **Settings** or run the initial setup wizard to start chatting.\n\n*PickyHack operates with real AI models only — stateless by default, context-driven by design.*`,
          code: null,
          requiresConfig: true,
          error: 'NO_AI_ENGINE_CONFIGURED',
          modelName: model,
          provider: cfg.provider,
          engineName: cfg.name,
          isLocal: cfg.isLocal
        };
      }

      try {
        let result;
        if (cfg.provider === 'anthropic') {
          result = await this.callAnthropic(cfg, model, systemPrompt, userPrompt, images, options);
        } else if (cfg.provider === 'gemini') {
          result = await this.callGemini(cfg, model, systemPrompt, userPrompt, images, options);
        } else {
          // OpenAI, Mistral, Ollama, LM Studio, vLLM, OpenRouter, Custom
          result = await this.callOpenAICompatible(cfg, model, systemPrompt, userPrompt, images, options);
        }

        return {
          ...result,
          modelName: model,
          provider: cfg.provider,
          engineName: cfg.name,
          isLocal: cfg.isLocal
        };
      } catch (err) {
        if (err.name === 'AbortError') {
          return {
            text: `⏹️ *Generation halted by operator.*`,
            code: null,
            isAborted: true,
            modelName: model,
            provider: cfg.provider,
            engineName: cfg.name,
            isLocal: cfg.isLocal
          };
        }
        console.error(`Inference failed for ${cfg.name}:`, err);
        return {
          text: `⚠️ **[${cfg.name} API Error: ${err.message}]**\n\nAI Engine configuration requires attention. Please verify your API key, endpoint, or model in **Settings → Multi-API & Backend**.`,
          code: null,
          isError: true,
          modelName: model,
          provider: cfg.provider,
          engineName: cfg.name,
          isLocal: cfg.isLocal
        };
      }
    },

    async callOpenAICompatible(cfg, model, systemPrompt, userPrompt, images = [], options = {}) {
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

      const shouldStream = typeof options.onChunk === 'function';
      const bodyPayload = {
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMsgContent }
        ],
        temperature: 0.3
      };
      if (shouldStream) {
        bodyPayload.stream = true;
      }

      const fetchOpts = {
        method: 'POST',
        headers,
        body: JSON.stringify(bodyPayload)
      };
      if (options.signal) {
        fetchOpts.signal = options.signal;
      }

      const res = await fetch(endpoint, fetchOpts);

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errText.substring(0, 150)}`);
      }

      // Handle real SSE stream if reader available
      if (shouldStream && res.body && typeof res.body.getReader === 'function') {
        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let fullText = '';
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop(); // keep remainder

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith(':')) continue;
            if (trimmed === 'data: [DONE]') break;
            if (trimmed.startsWith('data: ')) {
              try {
                const parsed = JSON.parse(trimmed.slice(6));
                const delta = parsed.choices && parsed.choices[0] && parsed.choices[0].delta
                  ? (parsed.choices[0].delta.content || '')
                  : '';
                if (delta) {
                  fullText += delta;
                  options.onChunk(delta);
                }
              } catch (_) {}
            }
          }
        }
        return { text: fullText, code: null };
      }

      const data = await res.json();
      const content = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : '';
      return { text: content, code: null };
    },

    async callAnthropic(cfg, model, systemPrompt, userPrompt, images = []) {
      const endpoint = (cfg.endpoint || 'https://api.anthropic.com/v1').replace(/\/+$/, '') + '/messages';
      let userContent = userPrompt;

      if (images && images.length > 0) {
        userContent = [
          ...images.map(img => ({
            type: 'image',
            source: {
              type: 'base64',
              media_type: img.mimeType || 'image/png',
              data: img.base64 || (img.dataUrl ? img.dataUrl.split(',')[1] : '')
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
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: model,
          system: systemPrompt,
          messages: [{ role: 'user', content: userContent }],
          max_tokens: 4096,
          temperature: 0.3
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errText.substring(0, 150)}`);
      }

      const data = await res.json();
      const content = data.content && data.content[0] ? data.content[0].text : '';
      return { text: content, code: null };
    },

    async callGemini(cfg, model, systemPrompt, userPrompt, images = []) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cfg.apiKey}`;
      const parts = [{ text: `${systemPrompt}\n\n${userPrompt}` }];

      if (images && images.length > 0) {
        images.forEach(img => {
          parts.push({
            inline_data: {
              mime_type: img.mimeType || 'image/png',
              data: img.base64 || (img.dataUrl ? img.dataUrl.split(',')[1] : '')
            }
          });
        });
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 4096 }
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errText.substring(0, 150)}`);
      }

      const data = await res.json();
      const content = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts
        ? data.candidates[0].content.parts[0].text
        : '';
      return { text: content, code: null };
    },

    localSynthesisFallback(userPrompt, cfg) {
      const state = (typeof root.ProjectState !== 'undefined') ? root.ProjectState.get() : (root.pentestState || {});
      const lower = (userPrompt || '').toLowerCase().trim();
      const target = state.target || 'target.internal';
      
      let text = '';
      let code = null;
      let details = null;

      // 1. Simple factual questions: Direct single-sentence answer
      if (lower.includes('cve') && (lower.includes('quel') || lower.includes('quoi') || lower.includes('what') || lower.includes('which') || lower.includes('globalprotect') || lower.includes('associé') || lower.includes('pan-os'))) {
        const primaryFinding = (state.findings && state.findings[0]) ? state.findings[0] : null;
        const cve = primaryFinding ? (primaryFinding.cve || primaryFinding.title) : 'CVE-2024-3400';
        text = `${cve}.`;
        details = primaryFinding 
          ? `${primaryFinding.title} (CVSS ${primaryFinding.cvss || '10.0'}, EPS ${primaryFinding.eps || '99'}/100). Target: ${primaryFinding.target || target}.` 
          : `Critical pre-auth command injection vulnerability.`;
      } else if (lower.includes('critique') || lower.includes('critical') || lower.includes('sévérité') || lower.includes('severity')) {
        const primaryFinding = (state.findings && state.findings[0]) ? state.findings[0] : null;
        const sev = primaryFinding ? primaryFinding.severity : 'Critical';
        const cvss = primaryFinding ? primaryFinding.cvss : '10.0';
        text = `Oui — CVSS ${cvss} (${sev}).`;
        details = `Exploitability Priority Score: 99/100 (Exploitation active confirmée, CISA KEV).`;
      } else if (lower.includes('port http') || lower.includes('http port') || lower === '80' || lower.includes('port 80')) {
        text = `80.`;
      } else if (lower.includes('port https') || lower.includes('https port') || lower.includes('port 443')) {
        text = `443.`;
      } else if (lower.includes('nuclei')) {
        // 2. Command requests: Output strictly the command, no preamble
        text = '';
        code = `nuclei -u https://${target} -tags cve,kev -severity critical,high`;
      } else if (lower.includes('nmap')) {
        text = '';
        code = `nmap -sS -sV -Pn -T4 -p 80,443,8080,8443 ${target}`;
      } else if (lower.includes('curl')) {
        text = '';
        code = `curl -k -I https://${target}`;
      } else if (lower.includes('analyse') || lower.includes('analyze') || lower.includes('dossier') || lower.includes('explain') || lower.includes('explique')) {
        // 3. Explicit detailed analysis
        text = `### DOSSIER TECHNIQUE — ${target}\n\n` +
               `**Vulnérabilité:** PAN-OS GlobalProtect Command Injection (CVE-2024-3400)\n` +
               `- **Vecteur:** Injection de commande pré-authentification via le paramètre \`SESSID\` conduisant à l'exécution de code arbitraire avec privilèges \`root\`.\n` +
               `- **Exploitabilité (EPS):** 99/100 (CISA KEV, exploitation active in-the-wild).\n` +
               `- **Remédiation:** Mise à jour PAN-OS 10.2.9-h1 ou désactivation de la télémétrie.`;
        code = `curl -k -H "Cookie: SESSID=../../../../opt/panlogs/tmp/device_telemetry/minute/\`id\`" https://${target}/ssl-vpn/hipreport.esp`;
      } else if (lower.includes('rapport') || lower.includes('report') || lower.includes('deliverable')) {
        text = `Synthèse d'évaluation pour **${target}** :\n` +
               `- Scope : \`${state.scope || 'Non défini'}\`\n` +
               `- Vulnérabilités enregistrées : ${state.findings ? state.findings.length : 0}\n` +
               `- Ouvrez la fenêtre **Export Deliverable** pour générer le rapport formel complet (PDF/Markdown/HTML).`;
      } else {
        // Direct, concise operational reply
        text = state.target 
          ? `Opérationnel sur **${state.target}** (${state.findings ? state.findings.length : 0} vulnérabilités).`
          : `PickyHack prêt. Définissez une cible ou posez votre question technique.`;
      }

      return { text, code, details, isFallback: true };
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProviderRegistry;
  }
  root.ProviderRegistry = ProviderRegistry;
  root.MultiAPIManager = ProviderRegistry; // Backward compatibility alias
  root.LLMAdapter = ProviderRegistry;      // Backward compatibility alias
})(typeof window !== 'undefined' ? window : global);
