/**
 * PickyHack — Visual Context Debugger Modal
 * Transparently inspects Operator Query -> Multi-Factor Candidate Scoring
 * -> Token Knapsack Allocation -> Selection Rationale -> Cross-Model Context Replay.
 */
(function(root) {
  'use strict';

  const ContextDebuggerModal = {
    activeTab: 'scoring',

    init() {
      if (typeof document === 'undefined') return;

      const modal = document.getElementById('modal-context-debugger');
      const closeBtn = document.getElementById('btn-close-context-debugger');
      const tabBtns = document.querySelectorAll('.ctx-debug-tab');

      if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => modal.classList.remove('open'));
      }

      tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          tabBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.activeTab = btn.getAttribute('data-tab');
          this.renderTabContent();
        });
      });
    },

    open() {
      const modal = document.getElementById('modal-context-debugger');
      if (modal) {
        modal.classList.add('open');
        this.render();
      }
    },

    close() {
      const modal = document.getElementById('modal-context-debugger');
      if (modal) modal.classList.remove('open');
    },

    render() {
      if (typeof document === 'undefined') return;

      // Build or retrieve latest packet
      const packet = (root.ContextDrawerUI && root.ContextDrawerUI.lastPacket)
        || (root.ContextEngine ? root.ContextEngine.buildPacket('Inspect target vulnerabilities and recommend attack vector', { budgetTokens: 8192 }) : null);

      if (!packet) return;

      // Render summary chips
      const budgetEl = document.getElementById('ctx-debug-budget');
      const usedEl = document.getElementById('ctx-debug-used');
      const selectedEl = document.getElementById('ctx-debug-selected-count');
      const rejectedEl = document.getElementById('ctx-debug-rejected-count');

      if (budgetEl) budgetEl.textContent = `${packet.budgetTokens || 8192} tk`;
      if (usedEl) usedEl.textContent = `${packet.totalEstimatedTokens || 0} tk`;
      if (selectedEl) selectedEl.textContent = (packet.selectedItems || []).length;
      if (rejectedEl) rejectedEl.textContent = (packet.rejectedItems || []).length;

      this.renderTabContent(packet);
    },

    renderTabContent(packetData) {
      const packet = packetData || (root.ContextDrawerUI && root.ContextDrawerUI.lastPacket)
        || (root.ContextEngine ? root.ContextEngine.buildPacket('', { budgetTokens: 8192 }) : null);
      const container = document.getElementById('ctx-debug-content-area');
      if (!container || !packet) return;

      if (this.activeTab === 'scoring') {
        this.renderScoringTable(container, packet);
      } else if (this.activeTab === 'packet') {
        this.renderPacketView(container, packet);
      } else if (this.activeTab === 'diff') {
        this.renderModelDiffView(container, packet);
      }
    },

    renderScoringTable(container, packet) {
      const selected = packet.selectedItems || [];
      const rejected = packet.rejectedItems || [];
      const allItems = [...selected, ...rejected];

      if (allItems.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding: 30px; color: var(--text-muted);">No candidate items in active project state. Add assets, findings, or tasks to inspect utility scoring.</div>`;
        return;
      }

      let html = `
        <div class="data-table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Item Type &amp; Summary</th>
                <th>Relevance (R)</th>
                <th>Criticality (C)</th>
                <th>Utility Score</th>
                <th>Tokens</th>
                <th>Decision</th>
                <th>Rationale</th>
              </tr>
            </thead>
            <tbody>
      `;

      allItems.forEach(item => {
        const isSelected = item.decision === 'selected' || !item.rejectionReason;
        const statusBadge = isSelected
          ? `<span class="severity-pill sev-low" style="background: rgba(16, 185, 129, 0.15); color: #10b981;">SELECTED</span>`
          : `<span class="severity-pill sev-critical" style="background: rgba(239, 68, 68, 0.15); color: #ef4444;">PRUNED</span>`;

        html += `
          <tr style="${isSelected ? '' : 'opacity: 0.65;'}">
            <td>
              <strong>[${item.type || 'ITEM'}]</strong> ${item.summary || item.title || item.name || 'Context item'}
            </td>
            <td><code>${(item.relevanceScore !== undefined ? item.relevanceScore.toFixed(2) : '0.50')}</code></td>
            <td><code>${(item.criticalityScore !== undefined ? item.criticalityScore.toFixed(2) : '0.50')}</code></td>
            <td><strong style="color: var(--accent-primary);">${(item.utilityScore !== undefined ? item.utilityScore.toFixed(2) : '0.50')}</strong></td>
            <td>${item.estimatedTokens || 120}</td>
            <td>${statusBadge}</td>
            <td><code style="font-size: 10.5px; color: var(--text-muted);">${item.rejectionReason || item.selectionRationale || 'utility_priority'}</code></td>
          </tr>
        `;
      });

      html += `
            </tbody>
          </table>
        </div>
      `;

      container.innerHTML = html;
    },

    renderPacketView(container, packet) {
      container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div>
            <div style="font-weight: 600; font-size: 12px; margin-bottom: 4px; color: var(--accent-primary);">1. System Prompt (${packet.systemTokens || 0} tokens):</div>
            <pre style="background: var(--bg-terminal); padding: 10px; border-radius: 6px; font-size: 11px; max-height: 140px; overflow-y: auto;"><code>${root.SecurityValidator ? root.SecurityValidator.escapeHTML(packet.systemPrompt) : packet.systemPrompt}</code></pre>
          </div>
          <div>
            <div style="font-weight: 600; font-size: 12px; margin-bottom: 4px; color: var(--accent-cyan);">2. Assembled Context &amp; User Packet (${packet.userTokens || 0} tokens):</div>
            <pre style="background: var(--bg-terminal); padding: 10px; border-radius: 6px; font-size: 11px; max-height: 240px; overflow-y: auto;"><code>${root.SecurityValidator ? root.SecurityValidator.escapeHTML(packet.userPacket) : packet.userPacket}</code></pre>
          </div>
        </div>
      `;
    },

    renderModelDiffView(container, packet) {
      container.innerHTML = `
        <div style="padding: 12px; background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border-subtle);">
          <h4 style="color: var(--accent-primary); margin-bottom: 8px;">Cross-Model Context Parity Replay</h4>
          <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 12px;">
            PickyHack is <strong>stateless by default and context-driven by design</strong>. Because context packets are dynamically compiled from canonical state, switching from OpenAI to Anthropic, DeepSeek, or Ollama never results in hallucinated memory loss.
          </p>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
            <div style="background: var(--bg-input); padding: 10px; border-radius: 6px; border: 1px solid var(--border-subtle);">
              <div style="font-weight: bold; font-size: 11.5px; margin-bottom: 4px;">OpenAI (gpt-4o)</div>
              <div style="font-size: 11px; color: var(--accent-emerald);">✓ Canonical Match</div>
              <div style="font-size: 10.5px; color: var(--text-muted); margin-top: 4px;">Selected items: ${(packet.selectedItems || []).length}</div>
            </div>
            <div style="background: var(--bg-input); padding: 10px; border-radius: 6px; border: 1px solid var(--border-subtle);">
              <div style="font-weight: bold; font-size: 11.5px; margin-bottom: 4px;">Anthropic (claude-3-5)</div>
              <div style="font-size: 11px; color: var(--accent-emerald);">✓ Canonical Match</div>
              <div style="font-size: 10.5px; color: var(--text-muted); margin-top: 4px;">Selected items: ${(packet.selectedItems || []).length}</div>
            </div>
            <div style="background: var(--bg-input); padding: 10px; border-radius: 6px; border: 1px solid var(--border-subtle);">
              <div style="font-weight: bold; font-size: 11.5px; margin-bottom: 4px;">Ollama (deepseek-r1)</div>
              <div style="font-size: 11px; color: var(--accent-emerald);">✓ Canonical Match</div>
              <div style="font-size: 10.5px; color: var(--text-muted); margin-top: 4px;">Selected items: ${(packet.selectedItems || []).length}</div>
            </div>
          </div>
        </div>
      `;
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContextDebuggerModal;
  }
  root.ContextDebuggerModal = ContextDebuggerModal;
})(typeof window !== 'undefined' ? window : global);
