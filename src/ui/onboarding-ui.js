/**
 * PickyHack — Mandatory First-Launch API Onboarding Controller
 * Direct blocking modal ("Let's Hack !") displayed on first launch or unconfigured state.
 * Flow: Fresh Install / Unconfigured -> Immediate Modal "Let's Hack !" -> Provider
 *       -> API Key -> Model Discovery -> Test Connection -> Connection Successful
 *       -> [ Let's Hack ! ] -> Close Modal -> Real AI Chat.
 *
 * Stateless by default. Context-driven by design.
 */
(function(root) {
  'use strict';

  const OnboardingUI = {
    selectedProvider: 'openai',
    apiKey: '',
    endpoint: 'https://api.openai.com/v1',
    model: 'gpt-4o',
    isConnected: false,

    init() {
      if (typeof document === 'undefined') return;
      this.bindEvents();
    },

    bindEvents() {
      // Provider Selection
      const provSelect = document.getElementById('onboarding-provider-select');
      if (provSelect) {
        provSelect.addEventListener('change', (e) => this.onProviderChange(e.target.value));
      }

      // API Key Input
      const keyInput = document.getElementById('onboarding-key-input');
      if (keyInput) {
        keyInput.addEventListener('input', (e) => {
          this.apiKey = e.target.value.trim();
          this.resetConnectionState();
        });
      }

      // Toggle Key Visibility [Show / Hide]
      const btnToggleKey = document.getElementById('btn-toggle-key-visibility');
      if (btnToggleKey && keyInput) {
        btnToggleKey.addEventListener('click', () => {
          const isPass = keyInput.type === 'password';
          keyInput.type = isPass ? 'text' : 'password';
          btnToggleKey.textContent = isPass ? 'Hide' : 'Show / Hide';
        });
      }

      // Endpoint Input
      const endpointInput = document.getElementById('onboarding-endpoint-input');
      if (endpointInput) {
        endpointInput.addEventListener('input', (e) => {
          this.endpoint = e.target.value.trim();
          this.resetConnectionState();
        });
      }

      // Model Select & Custom Model Input
      const modelSelect = document.getElementById('onboarding-model-select');
      const customModelInput = document.getElementById('onboarding-custom-model-input');
      const btnDiscover = document.getElementById('btn-onboarding-discover');

      if (modelSelect && customModelInput) {
        modelSelect.addEventListener('change', (e) => {
          if (e.target.value !== 'custom') {
            customModelInput.value = e.target.value;
            this.model = e.target.value;
          }
          this.resetConnectionState();
        });

        customModelInput.addEventListener('input', (e) => {
          this.model = e.target.value.trim();
          this.resetConnectionState();
        });
      }

      if (btnDiscover) {
        btnDiscover.addEventListener('click', () => this.discoverModels());
      }

      // Test Connection Button
      const btnTest = document.getElementById('btn-onboarding-test');
      if (btnTest) {
        btnTest.addEventListener('click', () => this.runConnectionTest());
      }

      // Primary Action Button: [ Let's Hack ! ]
      const btnLetsHack = document.getElementById('btn-onboarding-lets-hack');
      if (btnLetsHack) {
        btnLetsHack.addEventListener('click', () => this.completeOnboarding());
      }

      // Close Modal Button (X)
      const btnClose = document.getElementById('btn-onboarding-close');
      if (btnClose) {
        btnClose.addEventListener('click', () => this.hide());
      }

      // Cancel Button
      const btnCancel = document.getElementById('btn-onboarding-cancel');
      if (btnCancel) {
        btnCancel.addEventListener('click', () => this.hide());
      }
    },

    /**
     * Resets verification state when form credentials change.
     */
    resetConnectionState() {
      this.isConnected = false;
      const badge = document.getElementById('onboarding-connection-badge');
      if (badge) badge.style.display = 'none';

      const btnLetsHack = document.getElementById('btn-onboarding-lets-hack');
      if (btnLetsHack) btnLetsHack.disabled = true;

      const statusBox = document.getElementById('onboarding-test-status');
      if (statusBox) {
        statusBox.style.display = 'none';
        statusBox.className = 'onboarding-test-box';
        statusBox.innerHTML = '';
      }
    },

    /**
     * Shows the blocking "Let's Hack !" modal popup.
     * Prevents chat interaction until configuration is successfully tested.
     */
    show() {
      const overlay = document.getElementById('onboarding-overlay');
      if (!overlay) return;
      overlay.style.display = 'flex';
      overlay.classList.add('open');

      // Sync from active engine in ProviderRegistry if present
      if (root.ProviderRegistry && typeof root.ProviderRegistry.getActiveEngine === 'function') {
        const activeEngine = root.ProviderRegistry.getActiveEngine();
        if (activeEngine) {
          if (activeEngine.provider) this.selectedProvider = activeEngine.provider;
          if (activeEngine.apiKey) this.apiKey = activeEngine.apiKey;
          if (activeEngine.endpoint) this.endpoint = activeEngine.endpoint;
          if (activeEngine.model) this.model = activeEngine.model;
        }
      }

      const hasValid = root.ProviderRegistry && typeof root.ProviderRegistry.hasValidConfig === 'function'
        ? root.ProviderRegistry.hasValidConfig()
        : false;

      // Lock chat only if never configured yet
      if (!hasValid && root.ChatAgentUI && typeof root.ChatAgentUI.setLocked === 'function') {
        root.ChatAgentUI.setLocked(true);
      }

      // Sync form values
      const provSelect = document.getElementById('onboarding-provider-select');
      if (provSelect) {
        provSelect.value = this.selectedProvider;
      }
      this.onProviderChange(this.selectedProvider);

      const keyInput = document.getElementById('onboarding-key-input');
      if (keyInput && this.apiKey) {
        keyInput.value = this.apiKey;
      }

      const endpointInput = document.getElementById('onboarding-endpoint-input');
      if (endpointInput && this.endpoint) {
        endpointInput.value = this.endpoint;
      }

      const customModelInput = document.getElementById('onboarding-custom-model-input');
      if (customModelInput && this.model) {
        customModelInput.value = this.model;
      }

      const modelSelect = document.getElementById('onboarding-model-select');
      if (modelSelect && this.model) {
        let matched = false;
        if (modelSelect.options && typeof modelSelect.options.length === 'number') {
          for (let i = 0; i < modelSelect.options.length; i++) {
            if (modelSelect.options[i] && modelSelect.options[i].value === this.model) {
              modelSelect.selectedIndex = i;
              matched = true;
              break;
            }
          }
        }
        if (!matched) {
          modelSelect.value = 'custom';
        }
      }

      // If already connected and valid, enable [ Let's Hack ! ]
      if (hasValid) {
        this.isConnected = true;
        const badge = document.getElementById('onboarding-connection-badge');
        if (badge) badge.style.display = 'inline-block';
        const btnLetsHack = document.getElementById('btn-onboarding-lets-hack');
        if (btnLetsHack) btnLetsHack.disabled = false;
      }
    },

    /**
     * Closes the onboarding modal.
     */
    hide() {
      const overlay = document.getElementById('onboarding-overlay');
      if (!overlay) return;
      overlay.style.display = 'none';
      overlay.classList.remove('open');

      const hasValid = root.ProviderRegistry && typeof root.ProviderRegistry.hasValidConfig === 'function'
        ? root.ProviderRegistry.hasValidConfig()
        : false;
      const isAlreadyOnboarded = localStorage.getItem('hasCompletedAIOnboarding') === 'true' || hasValid;
      if (isAlreadyOnboarded && root.ChatAgentUI && typeof root.ChatAgentUI.setLocked === 'function') {
        root.ChatAgentUI.setLocked(false);
      }
    },

    /**
     * Handles provider selection changes.
     */
    onProviderChange(providerKey) {
      this.selectedProvider = providerKey;
      const catalog = (root.ProviderRegistry && typeof root.ProviderRegistry.getCatalog === 'function')
        ? root.ProviderRegistry.getCatalog()
        : {};
      const provInfo = catalog[providerKey] || {};

      const endpointInput = document.getElementById('onboarding-endpoint-input');
      if (endpointInput) {
        const defaultEp = provInfo.defaultEndpoint || 'https://api.openai.com/v1';
        endpointInput.value = defaultEp;
        this.endpoint = defaultEp;
      }

      const keyLabel = document.getElementById('onboarding-key-label');
      const keyInput = document.getElementById('onboarding-key-input');
      const isLocal = provInfo.isLocal === true || providerKey === 'ollama' || providerKey === 'local';

      if (isLocal) {
        if (keyLabel) keyLabel.textContent = 'API Key (Optional for Local LLMs)';
        if (keyInput) keyInput.placeholder = 'Optional (leave blank if not required)';
      } else {
        if (keyLabel) keyLabel.textContent = 'API Key *';
        if (keyInput) keyInput.placeholder = 'Enter your API key (e.g. sk-...)';
      }

      // Update model list for provider
      const modelSelect = document.getElementById('onboarding-model-select');
      const customModelInput = document.getElementById('onboarding-custom-model-input');
      const models = provInfo.models || ['gpt-4o', 'gpt-4o-mini', 'o3-mini'];

      if (modelSelect) {
        modelSelect.innerHTML = '';
        models.forEach(m => {
          const opt = document.createElement('option');
          opt.value = m;
          opt.textContent = m;
          modelSelect.appendChild(opt);
        });
        const customOpt = document.createElement('option');
        customOpt.value = 'custom';
        customOpt.textContent = 'Custom Model ID...';
        modelSelect.appendChild(customOpt);
      }

      const initialModel = models[0] || 'gpt-4o';
      this.model = initialModel;
      if (customModelInput) {
        customModelInput.value = initialModel;
      }

      this.resetConnectionState();
    },

    /**
     * Discovers available models from the provider endpoint.
     */
    async discoverModels() {
      const modelSelect = document.getElementById('onboarding-model-select');
      const customModelInput = document.getElementById('onboarding-custom-model-input');
      const statusEl = document.getElementById('onboarding-discovery-status');

      if (statusEl) statusEl.textContent = 'Discovering models from API...';

      let models = [];
      if (root.ProviderRegistry && typeof root.ProviderRegistry.discoverModels === 'function') {
        models = await root.ProviderRegistry.discoverModels(this.selectedProvider, this.apiKey, this.endpoint);
      }

      if (modelSelect) {
        modelSelect.innerHTML = '';
        if (models && models.length > 0) {
          models.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m;
            opt.textContent = m;
            modelSelect.appendChild(opt);
          });
          const customOpt = document.createElement('option');
          customOpt.value = 'custom';
          customOpt.textContent = 'Enter Custom Model ID...';
          modelSelect.appendChild(customOpt);

          if (customModelInput) {
            customModelInput.value = models[0];
            this.model = models[0];
          }
        } else {
          const opt = document.createElement('option');
          opt.value = this.model || 'default-model';
          opt.textContent = this.model || 'default-model';
          modelSelect.appendChild(opt);
        }
      }

      if (statusEl) {
        statusEl.textContent = models && models.length > 0
          ? `✓ Found ${models.length} available models`
          : 'Using catalog models (or enter custom ID)';
      }
    },

    /**
     * Performs a real connection test to verify credentials, endpoint, and model.
     * GATE: If API key is required and missing, immediately halts with "API key required."
     * without dispatching any network requests.
     */
    async runConnectionTest() {
      const statusBox = document.getElementById('onboarding-test-status');
      const btnTest = document.getElementById('btn-onboarding-test');
      const badge = document.getElementById('onboarding-connection-badge');
      const btnLetsHack = document.getElementById('btn-onboarding-lets-hack');

      const isLocal = this.selectedProvider === 'ollama' || this.selectedProvider === 'local' ||
                      (this.endpoint && (this.endpoint.includes('localhost') || this.endpoint.includes('127.0.0.1')));
      const key = (this.apiKey || '').trim();

      // STRICT GATE: API key required check before sending request
      if (!isLocal && !key) {
        this.isConnected = false;
        if (badge) badge.style.display = 'none';
        if (btnLetsHack) btnLetsHack.disabled = true;
        if (statusBox) {
          statusBox.style.display = 'block';
          statusBox.className = 'onboarding-test-box error';
          statusBox.innerHTML = `<strong>✕ Connection failed</strong><br><span style="font-size: 12px; font-weight: bold; color: #b91c1c;">API key required.</span>`;
        }
        return;
      }

      // Determine model from custom input or select
      const customModelInput = document.getElementById('onboarding-custom-model-input');
      const modelSelect = document.getElementById('onboarding-model-select');
      const chosenModel = (customModelInput && customModelInput.value.trim()) ||
                          (modelSelect && modelSelect.value && modelSelect.value !== 'custom' ? modelSelect.value : '') ||
                          this.model || 'gpt-4o';
      this.model = chosenModel;

      if (statusBox) {
        statusBox.style.display = 'block';
        statusBox.className = 'onboarding-test-box testing';
        statusBox.innerHTML = `<span class="test-spinner">⏳</span> [Testing...] Verifying authentication &amp; endpoint...`;
      }
      if (btnTest) {
        btnTest.disabled = true;
        btnTest.textContent = 'Testing...';
      }

      const engineConfig = {
        id: `engine-${this.selectedProvider}`,
        name: this.selectedProvider.toUpperCase(),
        provider: this.selectedProvider,
        endpoint: this.endpoint,
        apiKey: this.apiKey,
        model: this.model,
        customModel: this.model,
        isLocal
      };

      try {
        let result = { success: false, error: 'ProviderRegistry not available' };
        if (root.ProviderRegistry && typeof root.ProviderRegistry.testConnection === 'function') {
          result = await root.ProviderRegistry.testConnection(engineConfig);
        }

        if (result.success) {
          this.isConnected = true;
          if (statusBox) {
            statusBox.className = 'onboarding-test-box success';
            statusBox.innerHTML = `<strong>✓ Connection successful</strong><br><span style="font-size: 11px; opacity: 0.9;">Model: ${result.model || this.model} • Latency: ${result.latencyMs || 100}ms</span>`;
          }
          if (badge) {
            badge.style.display = 'inline-block';
          }
          if (btnLetsHack) {
            btnLetsHack.disabled = false;
          }
        } else {
          this.isConnected = false;
          if (statusBox) {
            statusBox.className = 'onboarding-test-box error';
            statusBox.innerHTML = `<strong>✕ Connection failed</strong><br><span style="font-size: 12px; font-weight: bold; color: #b91c1c;">${escapeHtml(result.error || 'Connection failed')}</span>`;
          }
          if (badge) badge.style.display = 'none';
          if (btnLetsHack) btnLetsHack.disabled = true;
        }
      } catch (err) {
        this.isConnected = false;
        if (statusBox) {
          statusBox.className = 'onboarding-test-box error';
          statusBox.innerHTML = `<strong>✕ Connection failed</strong><br><span style="font-size: 12px; font-weight: bold; color: #b91c1c;">${escapeHtml(err.message || 'Network error')}</span>`;
        }
        if (badge) badge.style.display = 'none';
        if (btnLetsHack) btnLetsHack.disabled = true;
      } finally {
        if (btnTest) {
          btnTest.disabled = false;
          btnTest.textContent = 'Test Connection';
        }
      }
    },

    /**
     * Completes onboarding upon successful verification.
     * Persists config, closes modal, unlocks real chat, and focuses composer.
     */
    completeOnboarding() {
      if (!this.isConnected) return;

      const isLocal = this.selectedProvider === 'ollama' || this.selectedProvider === 'local' ||
                      (this.endpoint && (this.endpoint.includes('localhost') || this.endpoint.includes('127.0.0.1')));

      // 1. Save and activate engine in ProviderRegistry
      if (root.ProviderRegistry) {
        const engineConfig = {
          id: `engine-${this.selectedProvider}`,
          name: this.selectedProvider.toUpperCase(),
          provider: this.selectedProvider,
          endpoint: this.endpoint,
          apiKey: this.apiKey,
          model: this.model,
          customModel: this.model,
          isConnected: true,
          isLocal
        };
        root.ProviderRegistry.saveEngine(engineConfig);
        root.ProviderRegistry.setActiveEngineId(engineConfig.id);
      }

      // 2. Mark onboarding as complete and verified in persistent storage
      try {
        localStorage.setItem('hasCompletedAIOnboarding', 'true');
        localStorage.setItem('pickyhack_onboarded', 'true');
      } catch (_) {}

      // 3. Update active provider badge in header strictly displaying provider
      const headerEngineLabel = document.getElementById('header-engine-label');
      if (headerEngineLabel) {
        headerEngineLabel.textContent = `⚡ AI Engine: ${this.selectedProvider.toUpperCase()}`;
      } else {
        const headerPill = document.getElementById('dock-model-pill');
        if (headerPill) {
          headerPill.innerHTML = `<span id="header-engine-label">⚡ AI Engine: ${this.selectedProvider.toUpperCase()}</span>`;
        }
      }

      // 4. Hide onboarding modal
      this.hide();

      // 5. Unlock chat composer, render conversation, and focus input
      if (root.ChatAgentUI) {
        if (typeof root.ChatAgentUI.setLocked === 'function') {
          root.ChatAgentUI.setLocked(false);
        }
        if (typeof root.ChatAgentUI.render === 'function') {
          root.ChatAgentUI.render();
        }
      }

      const chatInput = document.getElementById('chat-input');
      if (chatInput) {
        chatInput.focus();
      }

      console.log(`[PickyHack Onboarding] Complete. Connected to ${this.selectedProvider} (${this.model}). Let's Hack !`);
    }
  };

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = OnboardingUI;
  }
  root.OnboardingUI = OnboardingUI;
})(typeof window !== 'undefined' ? window : global);
