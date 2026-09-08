/**
 * PickyHack — Universal Model Selector & Quick Popovers
 * Grouped into Cloud Engines, Local Engines (Air-Gapped), and Custom Endpoints.
 */
(function(root) {
  'use strict';

  const PopoversUI = {
    init() {
      const dockPill = document.getElementById('dock-model-pill');
      const popover = document.getElementById('quick-model-popover');
      const btnManage = document.getElementById('popover-manage-multi-api');

      if (dockPill && popover) {
        dockPill.addEventListener('click', (e) => {
          e.stopPropagation();
          const isVisible = popover.style.display === 'block';
          popover.style.display = isVisible ? 'none' : 'block';
          if (!isVisible) this.renderQuickModelList();
        });

        document.addEventListener('click', (e) => {
          if (!popover.contains(e.target) && !dockPill.contains(e.target)) {
            popover.style.display = 'none';
          }
        });
      }

      if (btnManage) {
        btnManage.addEventListener('click', () => {
          if (root.WindowManager) root.WindowManager.open('win-multi-api');
          if (popover) popover.style.display = 'none';
        });
      }
    },

    renderQuickModelList() {
      const container = document.getElementById('quick-model-popover-items');
      if (!container || !root.ProviderRegistry) return;

      container.innerHTML = '';
      const engines = root.ProviderRegistry.getEngines();
      const activeId = root.ProviderRegistry.getActiveEngineId();

      const cloudEngines = engines.filter(e => !e.isLocal && e.provider !== 'custom');
      const localEngines = engines.filter(e => e.isLocal);
      const customEngines = engines.filter(e => e.provider === 'custom');

      const renderGroup = (title, list, badgeType) => {
        if (list.length === 0) return;
        const header = document.createElement('div');
        header.className = 'popover-group-header';
        header.style.padding = '4px 8px';
        header.style.fontSize = '10px';
        header.style.fontWeight = 'bold';
        header.style.background = '#e0e0e0';
        header.style.color = '#333';
        header.textContent = title;
        container.appendChild(header);

        list.forEach(engine => {
          const isActive = engine.id === activeId;
          const item = document.createElement('div');
          item.className = `popover-item ${isActive ? 'active' : ''}`;
          item.style.padding = '4px 8px';
          item.style.cursor = 'pointer';
          item.style.display = 'flex';
          item.style.justifyContent = 'space-between';
          item.style.alignItems = 'center';
          item.style.fontSize = '11px';

          const badgeHtml = engine.isLocal
            ? `<span style="background:#d4edda;color:#155724;font-size:9px;padding:1px 4px;border:1px solid #c3e6cb;">🔒 Local</span>`
            : `<span style="background:#e8f4f8;color:#004085;font-size:9px;padding:1px 4px;border:1px solid #b8daff;">🌐 Cloud</span>`;

          const modelName = engine.customModel || engine.model;
          item.innerHTML = `
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="width:12px;">${isActive ? '✓' : ''}</span>
              <strong>${engine.name}</strong> / <span>${modelName}</span>
            </div>
            <div>${badgeHtml}</div>
          `;

          item.addEventListener('click', () => {
            root.ProviderRegistry.setActiveEngineId(engine.id);
            const popover = document.getElementById('quick-model-popover');
            if (popover) popover.style.display = 'none';
          });

          container.appendChild(item);
        });
      };

      renderGroup('CLOUD ENGINES', cloudEngines);
      renderGroup('LOCAL / AIR-GAPPED ENGINES', localEngines);
      renderGroup('CUSTOM ENDPOINTS', customEngines);
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PopoversUI;
  } else {
    root.PopoversUI = PopoversUI;
  }
})(typeof window !== 'undefined' ? window : global);
