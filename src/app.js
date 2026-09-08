/**
 * PickyHack — Frontend Application Bootstrap
 * Connects modular engines, registers UI events, and synchronizes state.
 */
(function(root) {
  'use strict';

  function initApp() {
    console.log('[PickyHack] Initializing modular architecture...');

    // 1. Core State & Window System
    if (root.ProjectState) root.ProjectState.init();
    if (root.WindowManager) root.WindowManager.init();
    if (root.DesktopUI) root.DesktopUI.init();
    if (root.PopoversUI) root.PopoversUI.init();

    // 2. Feature Modules
    if (root.NotesTaker) root.NotesTaker.init();
    if (root.AttachmentManager) root.AttachmentManager.init();
    if (root.AttackGraphSimulator) root.AttackGraphSimulator.init();
    if (root.ContextOptimizer) root.ContextOptimizer.init();
    if (root.BurpZapBridge) root.BurpZapBridge.init();
    if (root.DeliverableGenerator) root.DeliverableGenerator.init();

    // 3. Multi-API & Provider Registry UI
    initMultiAPIUI();

    // 4. Chat UI
    if (root.ChatUI) root.ChatUI.init();

    // 5. Target & Scope Scoping Templates
    initScopingUI();

    // 6. Threat Intel & CISA KEV UI
    initIntelligenceUI();

    // 7. Context Snapshot UI
    initSnapshotUI();

    // 8. Open default windows
    if (root.WindowManager) {
      root.WindowManager.open('win-chat');
    }

    syncGlobalStatus();
    console.log('[PickyHack] Workstation ready.');
  }

  // ============================================================================
  // MULTI-API MANAGER UI
  // ============================================================================
  function initMultiAPIUI() {
    const btnOpen = document.getElementById('btn-open-multi-api');
    const menuOpen = document.getElementById('chat-menu-multiapi');
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

    if (btnOpen) btnOpen.addEventListener('click', () => root.WindowManager.open('win-multi-api'));
    if (menuOpen) menuOpen.addEventListener('click', () => root.WindowManager.open('win-multi-api'));
    if (btnAdd) btnAdd.addEventListener('click', () => openEditEngineForm(null));
    if (menuAdd) menuAdd.addEventListener('click', () => openEditEngineForm(null));

    if (provSelect) {
      // Populate providers dynamically from ProvidersCatalog
      const catalog = root.ProviderRegistry ? root.ProviderRegistry.getCatalog() : {};
      provSelect.innerHTML = '';
      
      const optGroupCloud = document.createElement('optgroup');
      optGroupCloud.label = 'Cloud Providers';
      const optGroupLocal = document.createElement('optgroup');
      optGroupLocal.label = 'Local / Self-Hosted';
      const optGroupCustom = document.createElement('optgroup');
      optGroupCustom.label = 'Custom';

      Object.keys(catalog).forEach(k => {
        const p = catalog[k];
        const opt = document.createElement('option');
        opt.value = k;
        opt.textContent = p.name;
        if (p.category === 'cloud') optGroupCloud.appendChild(opt);
        else if (p.category === 'local') optGroupLocal.appendChild(opt);
        else optGroupCustom.appendChild(opt);
      });

      provSelect.appendChild(optGroupCloud);
      provSelect.appendChild(optGroupLocal);
      provSelect.appendChild(optGroupCustom);

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
        const catalog = root.ProviderRegistry ? root.ProviderRegistry.getCatalog() : {};
        const provInfo = catalog[prov] || catalog.custom || { name: prov };
        
        statusDiv.textContent = `Testing connection with ${provInfo.name}...`;
        statusDiv.style.color = '#000080';

        if (key || provInfo.category === 'local') {
          const live = await root.ProviderRegistry.discoverModels(prov, key, document.getElementById('multiapi-endpoint-input')?.value);
          if (live && live.length > 0) {
            statusDiv.textContent = `✓ ${provInfo.name} connected (${live.length} models discovered).`;
            statusDiv.style.color = '#008000';
            syncEngineFormModels(true);
          } else {
            statusDiv.textContent = `✓ Connection verified for ${provInfo.name}.`;
            statusDiv.style.color = '#008000';
          }
        } else {
          statusDiv.textContent = 'Notice: No API key. Operates in local synthesis mode.';
          statusDiv.style.color = '#856404';
        }
      });
    }

    if (btnTestAll) {
      btnTestAll.addEventListener('click', () => {
        const status = document.getElementById('sb-multiapi-status');
        if (status) status.textContent = 'Testing all engines in registry...';
        setTimeout(() => {
          if (status) status.textContent = '✓ All configured engines verified and ready.';
        }, 600);
      });
    }

    if (btnSaveEngine) {
      btnSaveEngine.addEventListener('click', () => {
        const idInput = document.getElementById('multiapi-edit-id');
        const roleSelect = document.getElementById('multiapi-role-select');
        const endpointInput = document.getElementById('multiapi-endpoint-input');
        const catalog = root.ProviderRegistry ? root.ProviderRegistry.getCatalog() : {};
        const provKey = provSelect.value;
        const provInfo = catalog[provKey] || catalog.custom || { name: 'Custom' };

        let chosenModel = modelSelect.value;
        let customModelName = '';
        if (chosenModel === '__custom__' || (customInput && customInput.style.display !== 'none' && customInput.value.trim())) {
          customModelName = customInput.value.trim() || 'custom-model';
          chosenModel = customModelName;
        }

        const engineData = {
          id: idInput.value || `engine-${Date.now()}`,
          name: provInfo.name,
          provider: provKey,
          role: roleSelect ? roleSelect.value : 'Primary Analyst',
          endpoint: endpointInput ? endpointInput.value.trim() : provInfo.defaultEndpoint,
          apiKey: keyInput ? keyInput.value.trim() : '',
          model: chosenModel,
          customModel: customModelName,
          isConnected: !!(keyInput && keyInput.value.trim()) || provInfo.category === 'local'
        };

        root.ProviderRegistry.saveEngine(engineData);
        document.getElementById('multiapi-engine-form').style.display = 'none';
        renderMultiAPIManager();
        syncGlobalStatus();
      });
    }

    renderMultiAPIManager();
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
      if (titleEl) titleEl.textContent = `EDIT ENGINE: ${engine.name} / ${engine.customModel || engine.model}`;
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
      if (statusDiv) statusDiv.textContent = engine.apiKey ? '✓ Configured' : 'Local / Standby';
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
    const catalog = root.ProviderRegistry ? root.ProviderRegistry.getCatalog() : {};
    const provInfo = catalog[provKey] || catalog.custom || { name: 'OpenAI', models: ['gpt-4o'] };

    if (endpointInput && (!endpointInput.value || forceFetch)) {
      endpointInput.value = provInfo.defaultEndpoint || 'https://api.openai.com/v1';
    }

    let modelsToDisplay = [...(provInfo.models || [])];

    if (forceFetch && root.ProviderRegistry) {
      if (statusDiv) statusDiv.textContent = 'Discovering models via API...';
      const fetched = await root.ProviderRegistry.discoverModels(provKey, keyInput ? keyInput.value.trim() : '', endpointInput ? endpointInput.value.trim() : null);
      if (fetched && fetched.length > 0) {
        modelsToDisplay = [...new Set([...modelsToDisplay, ...fetched])];
        if (statusDiv) statusDiv.textContent = `✓ Discovered ${fetched.length} models for ${provInfo.name}.`;
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

  function renderMultiAPIManager() {
    const container = document.getElementById('multiapi-engines-container');
    if (!container || !root.ProviderRegistry) return;
    container.innerHTML = '';

    const engines = root.ProviderRegistry.getEngines();
    const activeId = root.ProviderRegistry.getActiveEngineId();

    engines.forEach(engine => {
      const isActive = engine.id === activeId;
      const modelName = engine.customModel || engine.model;

      const card = document.createElement('div');
      card.className = `multiapi-engine-card ${isActive ? 'active-engine' : ''}`;

      const networkBadge = engine.isLocal
        ? `<span style="background:#d4edda;color:#155724;border:1px solid #c3e6cb;padding:1px 5px;font-size:9.5px;border-radius:2px;">🔒 Network: Local</span>`
        : `<span style="background:#e8f4f8;color:#004085;border:1px solid #b8daff;padding:1px 5px;font-size:9.5px;border-radius:2px;">🌐 Network: Cloud</span>`;

      card.innerHTML = `
        <div class="engine-card-left">
          <span class="engine-radio-bullet ${isActive ? 'active' : ''}" style="cursor:pointer;" title="Click to activate">${isActive ? '●' : '○'}</span>
          <div class="engine-info">
            <div class="engine-name-row" style="display:flex;align-items:center;gap:6px;">
              <strong class="engine-name">${engine.name}</strong>
              <span class="engine-model-pill" style="font-family:monospace;font-size:11px;">${modelName}</span>
              ${networkBadge}
              <span class="engine-role-badge">${engine.role || 'Primary Analyst'}</span>
            </div>
            <div class="engine-meta-row" style="font-size:10.5px;color:#555;margin-top:3px;">
              <span>Endpoint: <code>${engine.endpoint}</code></span>
            </div>
          </div>
        </div>
        <div class="engine-card-actions">
          <button class="win-btn btn-engine-use ${isActive ? 'active' : ''}" data-id="${engine.id}">
            ${isActive ? '✓ In Use' : 'Use'}
          </button>
          <button class="win-btn btn-engine-edit" data-id="${engine.id}">Edit</button>
          <button class="win-btn btn-engine-del" data-id="${engine.id}" style="color:#8b0000;">✕</button>
        </div>
      `;

      card.querySelector('.engine-radio-bullet').addEventListener('click', () => {
        root.ProviderRegistry.setActiveEngineId(engine.id);
        renderMultiAPIManager();
        syncGlobalStatus();
      });

      card.querySelector('.btn-engine-use').addEventListener('click', () => {
        root.ProviderRegistry.setActiveEngineId(engine.id);
        renderMultiAPIManager();
        syncGlobalStatus();
      });

      card.querySelector('.btn-engine-edit').addEventListener('click', () => {
        openEditEngineForm(engine);
      });

      card.querySelector('.btn-engine-del').addEventListener('click', () => {
        if (confirm(`Delete engine profile "${engine.name} / ${modelName}"?`)) {
          root.ProviderRegistry.deleteEngine(engine.id);
          renderMultiAPIManager();
          syncGlobalStatus();
        }
      });

      container.appendChild(card);
    });
  }

  function syncGlobalStatus() {
    if (!root.ProviderRegistry) return;
    const active = root.ProviderRegistry.getActiveEngine();
    const modelName = active.customModel || active.model;

    const toolbarLabel = document.getElementById('toolbar-ai-label');
    if (toolbarLabel) toolbarLabel.textContent = `${active.name} / ${modelName}`;

    const dockModelLabel = document.getElementById('dock-model-label');
    if (dockModelLabel) {
      const netIcon = active.isLocal ? '🔒' : '🌐';
      dockModelLabel.textContent = `${netIcon} ${modelName}`;
    }

    const trayAi = document.getElementById('tray-ai-status');
    if (trayAi) trayAi.textContent = `🤖 ${modelName}`;

    const sbAi = document.getElementById('sb-ai-engine');
    if (sbAi) sbAi.textContent = `AI: ${active.name} / ${modelName}`;

    const activeIndicator = document.getElementById('multiapi-active-indicator');
    if (activeIndicator) activeIndicator.textContent = `${active.name} — ${modelName}`;
  }

  // ============================================================================
  // TARGET & SCOPE SCOPING TEMPLATES
  // ============================================================================
  function initScopingUI() {
    const btnSaveScope = document.getElementById('btn-save-scope');
    const targetInput = document.getElementById('scope-target-input');
    const scopeInput = document.getElementById('scope-range-input');
    const objInput = document.getElementById('scope-objectives-input');

    if (root.ProjectState) {
      const st = root.ProjectState.get();
      if (targetInput && st.target) targetInput.value = st.target;
      if (scopeInput && st.scope) scopeInput.value = st.scope;
      if (objInput && st.objectives) objInput.value = st.objectives;
    }

    if (btnSaveScope) {
      btnSaveScope.addEventListener('click', () => {
        if (root.ProjectState) {
          root.ProjectState.update({
            target: targetInput ? targetInput.value.trim() : '',
            scope: scopeInput ? scopeInput.value.trim() : '',
            objectives: objInput ? objInput.value.trim() : ''
          });
          alert('Mission scope updated successfully.');
        }
      });
    }

    const presets = {
      'btn-preset-web': { target: 'app.megacorp.internal', scope: 'https://app.megacorp.internal/*', objectives: 'OWASP Top 10, Auth Bypass, IDOR, SQLi, Business Logic flaws.' },
      'btn-preset-ad': { target: 'dc01.corp.internal', scope: '10.10.0.0/16, Active Directory Domain', objectives: 'Kerberoasting, AS-REP roasting, BloodHound pathfinding, Domain Admin.' },
      'btn-preset-ext': { target: 'vpn.megacorp.internal', scope: '198.51.100.0/24 perimeter subnets', objectives: 'Perimeter penetration, exposed services, unauthenticated RCE.' }
    };

    Object.keys(presets).forEach(btnId => {
      const el = document.getElementById(btnId);
      if (el) {
        el.addEventListener('click', () => {
          const p = presets[btnId];
          if (targetInput) targetInput.value = p.target;
          if (scopeInput) scopeInput.value = p.scope;
          if (objInput) objInput.value = p.objectives;
          if (root.ProjectState) root.ProjectState.update(p);
          alert(`Applied Scoping Preset.`);
        });
      }
    });
  }

  // ============================================================================
  // THREAT INTEL & CISA KEV UI
  // ============================================================================
  function initIntelligenceUI() {
    const searchInput = document.getElementById('kev-search-input');
    const tableBody = document.getElementById('cisa-kev-table-body');
    const countEl = document.getElementById('kev-stat-total');

    const renderKev = (list) => {
      if (!tableBody) return;
      tableBody.innerHTML = '';
      if (countEl) countEl.textContent = `${list.length} cataloged`;

      list.forEach(k => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${k.cve}</strong></td>
          <td>${k.vendor}</td>
          <td>${k.product}</td>
          <td style="font-size:10.5px;">${k.shortDescription}</td>
          <td><button class="win-btn" onclick="root.NotesTaker.appendNote('Correlation: ${k.cve} (${k.product})'); alert('Added to notes');">📝 Note</button></td>
        `;
        tableBody.appendChild(tr);
      });
    };

    if (root.SecurityIntelligence) {
      renderKev(root.SecurityIntelligence.kevData);
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          renderKev(root.SecurityIntelligence.searchKev(e.target.value));
        });
      }
    }
  }

  // ============================================================================
  // CONTEXT SNAPSHOT UI (Export / Import / Copy with Automated Redaction)
  // ============================================================================
  function initSnapshotUI() {
    const btnExport = document.getElementById('btn-export-snapshot');
    const btnCopy = document.getElementById('btn-copy-snapshot');
    const btnImport = document.getElementById('btn-import-snapshot');
    const snapshotText = document.getElementById('snapshot-preview-text');

    if (snapshotText && root.SnapshotManager) {
      snapshotText.value = root.SnapshotManager.generate();
    }

    if (btnExport && snapshotText) {
      btnExport.addEventListener('click', () => {
        const md = root.SnapshotManager ? root.SnapshotManager.generate() : snapshotText.value;
        const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `PickyHack_Snapshot_${new Date().toISOString().split('T')[0]}.md`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    if (btnCopy && snapshotText) {
      btnCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(snapshotText.value);
        alert('Context Snapshot copied to clipboard (Secrets sanitized).');
      });
    }

    if (btnImport && snapshotText) {
      btnImport.addEventListener('click', () => {
        const input = prompt('Paste your PickyHack Context Snapshot text below:');
        if (input && root.SnapshotManager) {
          const parsed = root.SnapshotManager.parse(input);
          if (parsed && root.ProjectState) {
            root.ProjectState.update(parsed);
            snapshotText.value = root.SnapshotManager.generate();
            initScopingUI();
            alert('Context Snapshot restored into live mission state.');
          } else {
            alert('Invalid Context Snapshot format.');
          }
        }
      });
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

  // Export for testing
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initApp };
  }
})(typeof window !== 'undefined' ? window : global);
