/**
 * PickyHack — Modern Context Drawer Controller
 * Displays real-time context token headroom, candidate scoring summary,
 * scope boundaries, and portable snapshot export/import controls.
 */
(function(root) {
  'use strict';

  const ContextDrawerUI = {
    isOpen: true,
    lastPacket: null,

    init() {
      if (typeof document === 'undefined') return;

      const btnToggle = document.getElementById('btn-toggle-context-drawer');
      const btnClose = document.getElementById('btn-close-context-drawer');
      const btnLaunchDebugger = document.getElementById('btn-launch-context-debugger');
      const btnExport = document.getElementById('btn-drawer-export-snapshot');
      const btnImport = document.getElementById('btn-drawer-import-snapshot');
      const fileInput = document.getElementById('drawer-snapshot-file-input');

      if (btnToggle) {
        btnToggle.addEventListener('click', () => this.toggle());
      }
      if (btnClose) {
        btnClose.addEventListener('click', () => this.close());
      }

      if (btnLaunchDebugger) {
        btnLaunchDebugger.addEventListener('click', () => {
          if (root.ContextDebuggerModal) root.ContextDebuggerModal.open();
        });
      }

      if (btnExport) {
        btnExport.addEventListener('click', () => this.exportSnapshot());
      }

      if (btnImport && fileInput) {
        btnImport.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.handleSnapshotFile(e.target.files[0]));
      }

      // Live updates on state change
      if (root.ProjectState) {
        root.ProjectState.onChange(() => {
          this.render();
        });
      }

      this.render();
    },

    toggle() {
      this.isOpen = !this.isOpen;
      const drawer = document.getElementById('context-drawer');
      if (drawer) drawer.classList.toggle('closed', !this.isOpen);
    },

    open() {
      this.isOpen = true;
      const drawer = document.getElementById('context-drawer');
      if (drawer) drawer.classList.remove('closed');
    },

    close() {
      this.isOpen = false;
      const drawer = document.getElementById('context-drawer');
      if (drawer) drawer.classList.add('closed');
    },

    /**
     * Called by ChatAgentUI whenever a packet is built to update live headroom.
     */
    update(packet) {
      this.lastPacket = packet;
      this.render();
    },

    render() {
      if (typeof document === 'undefined') return;

      const state = root.ProjectState ? root.ProjectState.get() : {};
      const packet = this.lastPacket || (root.ContextEngine ? root.ContextEngine.buildPacket('', { budgetTokens: 8192 }) : null);

      // 1. Token Headroom Meter
      const fillEl = document.getElementById('drawer-token-progress-fill');
      const usedEl = document.getElementById('drawer-token-used-label');
      const limitEl = document.getElementById('drawer-token-limit-label');
      const headerPill = document.getElementById('header-context-pill');

      const used = packet ? packet.totalEstimatedTokens || 0 : 0;
      const limit = packet ? packet.budgetTokens || 8192 : 8192;
      const pct = Math.min(Math.round((used / limit) * 100), 100);

      const formatted = used > 1000 ? `${(used / 1000).toFixed(1)}k` : `${used} tk`;
      const headerContext = document.getElementById('header-context-label');
      const stripContext = document.getElementById('strip-context-tokens');
      if (headerContext) headerContext.textContent = `Context: ${formatted}`;
      else if (headerPill) headerPill.textContent = `🧠 Context: ${formatted}`;
      if (stripContext) stripContext.textContent = formatted;

      // 2. Scope & Target Summary
      const targetEl = document.getElementById('drawer-target-summary');
      const scopeEl = document.getElementById('drawer-scope-summary');
      if (targetEl) targetEl.textContent = (state.target && state.target.trim()) ? state.target.trim() : 'None configured';
      if (scopeEl) scopeEl.textContent = (state.scope && state.scope.trim()) ? state.scope.trim() : 'Unrestricted';

      // 3. Active Task & Next Recommended Action
      const taskEl = document.getElementById('drawer-active-task');
      const nraEl = document.getElementById('drawer-nra-summary');
      const tasks = state.tasks || [];
      const activeTask = tasks.find(t => t.status === 'in_progress') || tasks[0];

      if (taskEl) taskEl.textContent = activeTask ? activeTask.title : 'Idle (Awaiting instructions)';

      let nra = 'Formulate recon strategy';
      if (root.TaskTree) {
        const tree = new root.TaskTree();
        tree.loadState(state);
        const rec = tree.recommendNextAction();
        if (rec) nra = `${rec.action}: ${rec.target || ''}`;
      }
      if (nraEl) nraEl.textContent = nra;

      // 4. Selected vs Pruned Context Items (with clean empty state)
      const selectedCountEl = document.getElementById('drawer-selected-items-count');
      const rejectedCountEl = document.getElementById('drawer-rejected-items-count');

      if (!this.lastPacket) {
        if (selectedCountEl && selectedCountEl.parentElement) {
          selectedCountEl.parentElement.innerHTML = `<span style="font-size: 11.5px; color: var(--text-muted); font-style: italic;">No context selection yet.</span>`;
        }
        if (rejectedCountEl && rejectedCountEl.parentElement) {
          rejectedCountEl.parentElement.style.display = 'none';
        }
      } else {
        const selected = (this.lastPacket.selectedItems || []).length;
        const rejected = (this.lastPacket.rejectedItems || []).length;
        if (selectedCountEl) selectedCountEl.textContent = selected;
        if (rejectedCountEl) rejectedCountEl.textContent = rejected;
      }
    },

    exportSnapshot() {
      if (!root.SnapshotManager) return;
      const snapshot = root.SnapshotManager.exportSnapshot();
      const json = JSON.stringify(snapshot, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(snapshot.meta.project || 'pickyhack').toLowerCase()}_${new Date().toISOString().split('T')[0]}.pickycontext.json`;
      a.click();
      URL.revokeObjectURL(url);
    },

    async handleSnapshotFile(file) {
      if (!file || !root.SnapshotManager) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        const res = root.SnapshotManager.importSnapshot(data);
        if (res.success) {
          alert(`Successfully imported context snapshot! Loaded project "${data.meta.project || 'Imported'}".`);
          if (root.SidebarUI) root.SidebarUI.syncAllViews();
        } else {
          alert(`Import failed: ${res.errors.join(', ')}`);
        }
      } catch (err) {
        alert(`Failed to parse snapshot JSON: ${err.message || err}`);
      }
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContextDrawerUI;
  }
  root.ContextDrawerUI = ContextDrawerUI;
})(typeof window !== 'undefined' ? window : global);
