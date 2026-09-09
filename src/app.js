/**
 * PickyHack — Frontend Application Bootstrap (v2.0)
 * Modern Chat-First Agent Workstation & Context Harness.
 * Initializes reactive state, UI controllers, execution backend connectivity,
 * and synchronizes telemetry.
 */
(function(root) {
  'use strict';

  function initApp() {
    console.log('[PickyHack v2.0] Initializing Chat-First Agent Architecture...');

    // 1. Core State & Snapshot Management
    if (root.ProjectState) root.ProjectState.init();

    // 2. Feature Modules
    if (root.NotesTaker) root.NotesTaker.init();
    if (root.AttachmentManager) root.AttachmentManager.init();
    if (root.DeliverableGenerator) root.DeliverableGenerator.init();

    // 3. UI Controllers
    if (root.SidebarUI) root.SidebarUI.init();
    if (root.ChatAgentUI) root.ChatAgentUI.init();
    if (root.ContextDrawerUI) root.ContextDrawerUI.init();
    if (root.ContextDebuggerModal) root.ContextDebuggerModal.init();
    if (root.OnboardingUI) root.OnboardingUI.init();

    // 4. Modal Handlers (Scope & Settings)
    initScopeModalHandler();
    initSettingsModalHandler();

    // 5. Mandatory First Launch API Onboarding Check
    // If no valid verified AI configuration exists, lock chat and display blocking modal "Let's Hack !"
    const hasValidAI = root.ProviderRegistry && root.ProviderRegistry.hasValidConfig();
    if (!hasValidAI) {
      console.log('[PickyHack] No valid AI engine configured. Displaying mandatory "Let\'s Hack !" modal.');
      if (root.ChatAgentUI && typeof root.ChatAgentUI.setLocked === 'function') {
        root.ChatAgentUI.setLocked(true);
      }
      if (root.OnboardingUI && typeof root.OnboardingUI.show === 'function') {
        root.OnboardingUI.show();
      }
    } else {
      if (root.ChatAgentUI && typeof root.ChatAgentUI.setLocked === 'function') {
        root.ChatAgentUI.setLocked(false);
      }
    }

    // 6. Reactive State Listener
    if (root.ProjectState) {
      root.ProjectState.onChange((state) => {
        if (root.SidebarUI) root.SidebarUI.syncAllViews();
        if (root.ContextDrawerUI) root.ContextDrawerUI.render();
      });
    }

    // 7. Execution Backend Health Check
    checkBackendHealth();

    console.log('[PickyHack v2.0] Workstation ready. Stateless by default. Context-driven by design.');
  }

  function initScopeModalHandler() {
    const btnSaveScope = document.getElementById('btn-save-scope');
    const targetInput = document.getElementById('scope-target-input');
    const cidrsInput = document.getElementById('scope-cidrs-input');
    const exclusionsInput = document.getElementById('scope-exclusions-input');

    // Pre-populate if state exists
    if (root.ProjectState) {
      const state = root.ProjectState.get();
      if (targetInput && state.target) targetInput.value = state.target;
      if (cidrsInput && state.scope) cidrsInput.value = state.scope;
      if (exclusionsInput && state.outOfScope) exclusionsInput.value = Array.isArray(state.outOfScope) ? state.outOfScope.join('\n') : state.outOfScope;
    }

    if (btnSaveScope && targetInput && cidrsInput) {
      btnSaveScope.addEventListener('click', () => {
        const target = targetInput.value.trim();
        const scope = cidrsInput.value.trim();
        const exclusions = exclusionsInput ? exclusionsInput.value.split('\n').map(s => s.trim()).filter(Boolean) : [];

        if (root.ProjectState) {
          root.ProjectState.setTarget(target);
          root.ProjectState.setScope(scope);
          const state = root.ProjectState.get();
          state.outOfScope = exclusions;
          root.ProjectState.save();
        }

        const modal = document.getElementById('modal-scope');
        if (modal) modal.classList.remove('open');

        if (root.SidebarUI) root.SidebarUI.syncAllViews();
      });
    }
  }

  function initSettingsModalHandler() {
    const btnSave = document.getElementById('btn-save-settings');
    const provSelect = document.getElementById('settings-provider-select');
    const keyInput = document.getElementById('settings-api-key-input');
    const endpointInput = document.getElementById('settings-endpoint-input');
    const modelInput = document.getElementById('settings-model-input');
    const backendSelect = document.getElementById('settings-backend-select');
    const btnToggleKey = document.getElementById('btn-settings-toggle-key');
    const btnTest = document.getElementById('btn-settings-test-connection');
    const testResult = document.getElementById('settings-test-result');

    // Appearance theme radio elements
    const radio98 = document.getElementById('theme-radio-picky98');
    const radioTahoe = document.getElementById('theme-radio-pickytahoe');

    // Pre-populate from active provider
    if (root.ProviderRegistry && provSelect) {
      const active = root.ProviderRegistry.getActiveEngine();
      if (active) {
        provSelect.value = active.provider || 'openai';
        if (keyInput) keyInput.value = active.apiKey || '';
        if (endpointInput) endpointInput.value = active.endpoint || 'https://api.openai.com/v1';
        if (modelInput) modelInput.value = active.customModel || active.model || '';
      }

      provSelect.addEventListener('change', (e) => {
        const catalog = root.ProviderRegistry.getCatalog ? root.ProviderRegistry.getCatalog() : {};
        const info = catalog[e.target.value] || {};
        if (endpointInput) endpointInput.value = info.defaultEndpoint || 'https://api.openai.com/v1';
        if (modelInput && info.models && info.models[0]) modelInput.value = info.models[0];
      });
    }

    // Toggle key visibility in settings
    if (btnToggleKey && keyInput) {
      btnToggleKey.addEventListener('click', () => {
        const isPass = keyInput.type === 'password';
        keyInput.type = isPass ? 'text' : 'password';
        btnToggleKey.textContent = isPass ? '[Hide]' : '[Show]';
      });
    }

    // Appearance Theme Radio Switchers
    if (radio98) {
      radio98.addEventListener('change', () => {
        if (radio98.checked && root.SidebarUI) root.SidebarUI.setTheme('picky98');
      });
    }
    if (radioTahoe) {
      radioTahoe.addEventListener('change', () => {
        if (radioTahoe.checked && root.SidebarUI) root.SidebarUI.setTheme('tahoe-dark');
      });
    }

    // Test Connection Button in Settings
    if (btnTest) {
      btnTest.addEventListener('click', async () => {
        const provider = provSelect ? provSelect.value : 'openai';
        const apiKey = keyInput ? keyInput.value.trim() : '';
        const endpoint = endpointInput ? endpointInput.value.trim() : 'https://api.openai.com/v1';
        const model = modelInput ? modelInput.value.trim() : 'gpt-4o';

        if (testResult) {
          testResult.style.color = 'var(--text-muted)';
          testResult.textContent = '⏳ Testing connection...';
        }

        const engineConfig = {
          id: `engine-${provider}`,
          name: provider.toUpperCase(),
          provider,
          endpoint,
          apiKey,
          model,
          customModel: model,
          isLocal: provider === 'ollama' || provider === 'local' || endpoint.includes('localhost')
        };

        if (root.ProviderRegistry && typeof root.ProviderRegistry.testConnection === 'function') {
          const res = await root.ProviderRegistry.testConnection(engineConfig);
          if (testResult) {
            if (res.success) {
              testResult.style.color = '#10b981';
              testResult.textContent = `✓ Connection successful (${res.latencyMs || 100}ms)`;
            } else {
              testResult.style.color = '#ef4444';
              testResult.textContent = `✕ Connection failed: ${res.error}`;
            }
          }
        }
      });
    }

    if (btnSave) {
      btnSave.addEventListener('click', () => {
        const provider = provSelect ? provSelect.value : 'openai';
        const apiKey = keyInput ? keyInput.value.trim() : '';
        const endpoint = endpointInput ? endpointInput.value.trim() : 'https://api.openai.com/v1';
        const model = modelInput ? modelInput.value.trim() : '';
        const backend = backendSelect ? backendSelect.value : 'local';

        if (root.ProviderRegistry) {
          const active = root.ProviderRegistry.getActiveEngine();
          root.ProviderRegistry.saveEngine({
            ...active,
            provider,
            endpoint,
            apiKey,
            model: model || active.model || 'gpt-4o',
            customModel: model || undefined,
            isLocal: provider === 'ollama' || provider === 'local' || endpoint.includes('localhost')
          });
        }

        // Update pill in header: strictly provider name only, NEVER model name
        const pill = document.getElementById('dock-model-pill');
        if (pill) {
          pill.innerHTML = `<span>⚡ AI Engine: ${provider.toUpperCase()}</span>`;
        }

        // Save execution backend setting
        try {
          localStorage.setItem('pickyhack_backend', backend);
        } catch (_) {}

        const modal = document.getElementById('modal-settings');
        if (modal) modal.classList.remove('open');
      });
    }
  }

  async function checkBackendHealth() {
    const statusLabel = document.getElementById('backend-status-label');
    const statusDot = document.getElementById('backend-status-dot');
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        let toolsCount = 0;
        try {
          const toolsRes = await fetch('/api/tools/detect');
          if (toolsRes.ok) {
            const toolsData = await toolsRes.json();
            toolsCount = (toolsData.tools || []).filter(t => t.detected).length;
          }
        } catch (_) {}
        if (statusLabel) statusLabel.textContent = `Local Daemon (${toolsCount} tools ready)`;
        if (statusDot) {
          statusDot.className = 'status-dot connected pulse';
        }
      } else {
        if (statusLabel) statusLabel.textContent = `Backend Error (HTTP ${res.status})`;
        if (statusDot) {
          statusDot.className = 'status-dot error';
        }
      }
    } catch (_) {
      if (statusLabel) statusLabel.textContent = 'Backend Offline';
      if (statusDot) {
        statusDot.className = 'status-dot disconnected';
      }
    }
  }

  // DOM ready hook
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initApp);
    } else {
      initApp();
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initApp };
  }
  root.App = { init: initApp };
})(typeof window !== 'undefined' ? window : global);
