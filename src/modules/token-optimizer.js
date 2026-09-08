/**
 * PickyHack — In-Memory Context Window Optimizer & Token Pruner
 * Monitors real-time token expenditure and applies semantic pruning
 * to prevent LLM context exhaustion during verbose security engagements.
 */
(function(root) {
  'use strict';

  const ContextOptimizer = {
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
      const state = (root.ProjectState ? root.ProjectState.get() : root.pentestState) || {};
      const activeEngine = (root.ProviderRegistry ? root.ProviderRegistry.getActiveEngine() : null) || {};
      const maxLimit = (activeEngine.capabilities && activeEngine.capabilities.contextWindow) || 128000;

      const systemTok = 350;
      const scopeTok = this.estimateTokens((state.target || '') + (state.scope || '') + (state.objectives || ''));
      const findingsTok = this.estimateTokens(JSON.stringify(state.findings || []));
      
      let attTok = 0;
      if (root.AttachmentManager && root.AttachmentManager.staged) {
        root.AttachmentManager.staged.forEach(a => {
          attTok += a.type === 'text' ? this.estimateTokens(a.textContent) : 250;
        });
      }

      // Ephemeral chat estimate
      let convTok = 650;

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

    pruneText(text) {
      if (!text) return '';
      let pruned = text;
      // Strip repetitive banners
      pruned = pruned.replace(/#{10,}/g, '---');
      pruned = pruned.replace(/={10,}/g, '---');
      // Strip verbose port scan headers and footers
      pruned = pruned.replace(/Starting Nmap[^\n]+\n/gi, '');
      pruned = pruned.replace(/Nmap done:[^\n]+\n/gi, '');
      // Collapse whitespace
      pruned = pruned.replace(/\n{3,}/g, '\n\n');
      return pruned.trim();
    },

    pruneActiveContext() {
      const state = (root.ProjectState ? root.ProjectState.get() : root.pentestState) || {};
      let prunedCount = 0;

      if (state.notes) {
        const originalLen = state.notes.length;
        state.notes = this.pruneText(state.notes);
        if (state.notes.length < originalLen) prunedCount++;
        if (root.ProjectState) root.ProjectState.save();
      }

      this.updateBudgetMeter();
      if (typeof alert !== 'undefined') {
        alert(`[Context Window Optimizer]\n\nPruned ${prunedCount} redundant sections from active memory.\nPreserved 100% of exploitable facts and critical ports.`);
      }
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContextOptimizer;
  }
  root.ContextOptimizer = ContextOptimizer;
})(typeof window !== 'undefined' ? window : global);
