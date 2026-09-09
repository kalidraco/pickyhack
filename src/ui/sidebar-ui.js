/**
 * PickyHack — Modern Sidebar Navigation & Modal Controller
 * Manages projects, conversation threads, navigation links, modals,
 * and theme switching (PickyTahoe vs Picky98).
 */
(function(root) {
  'use strict';

  const SidebarUI = {
    currentTheme: 'picky98',

    init() {
      if (typeof document === 'undefined') return;

      // 1. New Chat & Conversation handlers
      const btnNewChat = document.getElementById('btn-new-chat');
      if (btnNewChat) {
        btnNewChat.addEventListener('click', () => this.createNewConversation());
      }

      // 2. Project Switcher & Creator
      const projectSelect = document.getElementById('sidebar-project-select');
      const btnNewProject = document.getElementById('btn-new-project');

      if (projectSelect) {
        projectSelect.addEventListener('change', (e) => {
          if (root.ProjectState) {
            root.ProjectState.switchProject(e.target.value);
            this.syncAllViews();
          }
        });
      }

      if (btnNewProject) {
        btnNewProject.addEventListener('click', () => {
          const name = prompt('Enter new project name:');
          if (name && name.trim() && root.ProjectState) {
            const project = root.ProjectState.createProject({ name: name.trim() });
            this.renderProjectsList();
            if (projectSelect) projectSelect.value = project.id;
            this.syncAllViews();
          }
        });
      }

      // 3. Navigation items -> Modal Openers
      this.bindNavModal('nav-scope', 'modal-scope');
      this.bindNavModal('nav-findings', 'modal-findings');
      this.bindNavModal('nav-tasks', 'modal-tasks');
      this.bindNavModal('nav-notes', 'modal-notes');
      this.bindNavModal('nav-intel', 'modal-intel');
      this.bindNavModal('nav-attack-graph', 'modal-attack-graph');
      this.bindNavModal('nav-deliverables', 'modal-deliverables');
      this.bindNavModal('nav-settings', 'modal-settings');
      this.bindNavModal('nav-ai-engine', 'onboarding-overlay');

      const navContextDebugger = document.getElementById('nav-context-debugger');
      if (navContextDebugger) {
        navContextDebugger.addEventListener('click', () => {
          if (root.ContextDebuggerModal) root.ContextDebuggerModal.open();
          else this.openModal('modal-context-debugger');
        });
      }

      const navSnapshots = document.getElementById('nav-snapshots');
      if (navSnapshots) {
        navSnapshots.addEventListener('click', () => {
          if (root.ContextDrawerUI) root.ContextDrawerUI.open();
        });
      }

      // Interactive Pentest Phase Steps in situational strip
      const phaseSteps = document.querySelectorAll('.phase-step');
      phaseSteps.forEach(step => {
        step.addEventListener('click', (e) => {
          e.stopPropagation();
          const newPhase = step.getAttribute('data-phase');
          if (newPhase && root.ProjectState) {
            root.ProjectState.get().phase = newPhase;
            this.updateCounters();
          }
        });
      });

      // 4. Modal Close buttons
      const closeButtons = document.querySelectorAll('.btn-modal-close');
      closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const modal = btn.closest('.modal-backdrop');
          if (modal) modal.classList.remove('open');
        });
      });

      // Close modal on backdrop click
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach(backdrop => {
        backdrop.addEventListener('click', (e) => {
          if (e.target === backdrop) backdrop.classList.remove('open');
        });
      });

      // 5. Theme Switcher
      const themeToggle = document.getElementById('theme-toggle-btn');
      if (themeToggle) {
        themeToggle.addEventListener('click', () => this.toggleTheme());
      }

      // 6. Listen to ProjectState changes
      if (root.ProjectState) {
        root.ProjectState.onChange(() => {
          this.updateCounters();
        });
      }

      this.renderProjectsList();
      this.renderConversationsList();
      this.updateCounters();
      this.initSavedTheme();
    },

    bindNavModal(navId, modalId) {
      const nav = document.getElementById(navId);
      if (nav) {
        nav.addEventListener('click', () => this.openModal(modalId));
      }
    },

    openModal(modalId) {
      if (modalId === 'onboarding-overlay' || modalId === 'modal-api') {
        if (root.OnboardingUI && typeof root.OnboardingUI.show === 'function') {
          root.OnboardingUI.show();
          return;
        }
      }
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('open');
        this.onModalOpened(modalId);
      }
    },

    closeModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.remove('open');
    },

    onModalOpened(modalId) {
      switch (modalId) {
        case 'modal-findings':
          this.renderFindingsTable();
          break;
        case 'modal-tasks':
          this.renderTasksTable();
          break;
        case 'modal-notes':
          if (root.NotesTaker) root.NotesTaker.init();
          break;
        case 'modal-intel':
          if (root.SecurityIntelligence) this.renderIntelList();
          break;
        case 'modal-deliverables':
          if (root.DeliverableGenerator) root.DeliverableGenerator.renderReportPreview();
          break;
        case 'modal-attack-graph':
          this.renderAttackGraphView();
          break;
      }
    },

    createNewConversation() {
      if (!root.ChatAgentUI) return;
      const id = `conv-${Date.now()}`;
      const newConv = {
        id,
        title: `Session #${root.ChatAgentUI.conversations.length + 1}`,
        messages: []
      };
      root.ChatAgentUI.conversations.unshift(newConv);
      root.ChatAgentUI.activeConvId = id;
      if (typeof root.ChatAgentUI.saveConversations === 'function') {
        root.ChatAgentUI.saveConversations();
      }
      this.renderConversationsList();
      root.ChatAgentUI.render();
    },

    switchConversation(convId) {
      if (!root.ChatAgentUI) return;
      root.ChatAgentUI.activeConvId = convId;
      if (typeof root.ChatAgentUI.saveConversations === 'function') {
        root.ChatAgentUI.saveConversations();
      }
      this.renderConversationsList();
      root.ChatAgentUI.render();
    },

    renameConversation(convId) {
      if (!root.ChatAgentUI) return;
      const conv = root.ChatAgentUI.conversations.find(c => c.id === convId);
      if (!conv) return;
      const newTitle = prompt('Rename session:', conv.title);
      if (newTitle && newTitle.trim()) {
        conv.title = newTitle.trim();
        if (typeof root.ChatAgentUI.saveConversations === 'function') {
          root.ChatAgentUI.saveConversations();
        }
        this.renderConversationsList();
      }
    },

    deleteConversation(convId) {
      if (!root.ChatAgentUI) return;
      if (root.ChatAgentUI.conversations.length <= 1) {
        alert('You must keep at least one active conversation.');
        return;
      }
      const confirmed = confirm('Delete this conversation session and message history?');
      if (!confirmed) return;

      root.ChatAgentUI.conversations = root.ChatAgentUI.conversations.filter(c => c.id !== convId);
      if (root.ChatAgentUI.activeConvId === convId) {
        root.ChatAgentUI.activeConvId = root.ChatAgentUI.conversations[0].id;
      }
      if (typeof root.ChatAgentUI.saveConversations === 'function') {
        root.ChatAgentUI.saveConversations();
      }
      this.renderConversationsList();
      root.ChatAgentUI.render();
    },

    renderConversationsList() {
      const container = document.getElementById('sidebar-conversations-list');
      if (!container || !root.ChatAgentUI) return;

      container.innerHTML = '';
      root.ChatAgentUI.conversations.forEach(conv => {
        const item = document.createElement('div');
        item.className = `conversation-item ${conv.id === root.ChatAgentUI.activeConvId ? 'active' : ''}`;
        item.innerHTML = `
          <div class="conv-title" title="${conv.title}" style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">💬 ${conv.title}</div>
          <div class="conv-item-tools" style="display: flex; align-items: center; gap: 4px; margin-left: auto;">
            <span style="font-size: 10.5px; opacity: 0.6;">${conv.messages.length}</span>
            <button class="btn-conv-action btn-rename" title="Rename" style="background: none; border: none; cursor: pointer; padding: 1px 3px; font-size: 10px; opacity: 0.6;">✏️</button>
            <button class="btn-conv-action btn-delete" title="Delete" style="background: none; border: none; cursor: pointer; padding: 1px 3px; font-size: 10px; opacity: 0.6;">✕</button>
          </div>
        `;

        // Switch on item click
        item.addEventListener('click', (e) => {
          if (e.target.closest('.btn-conv-action')) return;
          this.switchConversation(conv.id);
        });

        // Rename action
        const btnRename = item.querySelector('.btn-rename');
        if (btnRename) {
          btnRename.addEventListener('click', (e) => {
            e.stopPropagation();
            this.renameConversation(conv.id);
          });
        }

        // Delete action
        const btnDelete = item.querySelector('.btn-delete');
        if (btnDelete) {
          btnDelete.addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteConversation(conv.id);
          });
        }

        container.appendChild(item);
      });
    },

    renderProjectsList() {
      const select = document.getElementById('sidebar-project-select');
      if (!select || !root.ProjectState) return;

      const projects = root.ProjectState.getProjects ? root.ProjectState.getProjects() : [];
      const activeId = root.ProjectState.activeProjectId;
      select.innerHTML = '';

      if (projects.length === 0) {
        select.innerHTML = `<option value="default">Default Engagement</option>`;
        return;
      }

      projects.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = p.name;
        if (p.id === activeId) opt.selected = true;
        select.appendChild(opt);
      });
    },

    updateCounters() {
      if (!root.ProjectState) return;
      const state = root.ProjectState.get();

      // 1. Findings badge & strip
      const findingsBadge = document.getElementById('counter-findings');
      const stripFindings = document.getElementById('strip-findings-count');
      const countFindings = (state.findings || []).length;
      if (findingsBadge) {
        findingsBadge.textContent = countFindings;
        findingsBadge.classList.toggle('alert', countFindings > 0);
      }
      if (stripFindings) stripFindings.textContent = countFindings;

      // 2. Tasks badge & strip
      const tasksBadge = document.getElementById('counter-tasks');
      const stripTasks = document.getElementById('strip-tasks-count');
      const activeTasks = (state.tasks || []).filter(t => t.status === 'in_progress' || t.status === 'pending');
      if (tasksBadge) tasksBadge.textContent = activeTasks.length;
      if (stripTasks) stripTasks.textContent = activeTasks.length;

      // 3. Evidence badge & strip
      const evidenceBadge = document.getElementById('counter-evidence');
      const stripEvidence = document.getElementById('strip-evidence-count');
      const evidenceCount = (state.evidence || []).length;
      if (evidenceBadge) evidenceBadge.textContent = evidenceCount;
      if (stripEvidence) stripEvidence.textContent = evidenceCount;

      // 4. Target labels - canonical source of truth without fake fallbacks
      const targetVal = state.target ? state.target.trim() : '';
      const targetDisplay = targetVal || 'Not set';
      const targetBadge = document.getElementById('header-target-label');
      const stripTarget = document.getElementById('strip-target-val');
      const composerTarget = document.getElementById('composer-target-label');
      if (targetBadge) targetBadge.textContent = `Target: ${targetDisplay}`;
      if (stripTarget) stripTarget.textContent = targetDisplay;
      if (composerTarget) composerTarget.textContent = `Target: ${targetDisplay}`;

      // 5. Scope label
      const scopeVal = state.scope ? state.scope.trim() : '';
      const scopeDisplay = scopeVal || 'Unrestricted';
      const stripScope = document.getElementById('strip-scope-val');
      if (stripScope) stripScope.textContent = scopeDisplay;

      // 6. Pentest phase steps highlight
      const activePhase = (state.phase || 'RECON').toUpperCase();
      const phaseSteps = document.querySelectorAll('.phase-step');
      phaseSteps.forEach(step => {
        const p = step.getAttribute('data-phase');
        step.classList.toggle('active', p === activePhase);
      });

      // 7. Header AI Engine label: STRICTLY provider name only, NEVER model name!
      const headerEngine = document.getElementById('header-engine-label');
      if (headerEngine) {
        const activeEngine = root.ProviderRegistry ? root.ProviderRegistry.getActiveEngine() : null;
        const providerName = activeEngine ? (activeEngine.provider || 'OpenAI').toUpperCase() : 'OPENAI';
        headerEngine.textContent = `⚡ AI Engine: ${providerName}`;
      }

      // 8. Context token counter
      const stripContext = document.getElementById('strip-context-tokens');
      const headerContext = document.getElementById('header-context-label');
      const packet = (root.ContextDrawerUI && root.ContextDrawerUI.lastPacket)
        ? root.ContextDrawerUI.lastPacket
        : (root.ContextEngine ? root.ContextEngine.buildPacket('', { budgetTokens: 8192 }) : null);
      const usedTokens = packet ? (packet.totalEstimatedTokens || 0) : 0;
      const formattedTokens = usedTokens > 1000 ? `${(usedTokens / 1000).toFixed(1)}k` : `${usedTokens} tk`;
      if (stripContext) stripContext.textContent = formattedTokens;
      if (headerContext) headerContext.textContent = `Context: ${formattedTokens}`;
    },

    renderFindingsTable() {
      const tbody = document.getElementById('findings-table-body');
      if (!tbody || !root.ProjectState) return;
      const state = root.ProjectState.get();
      const findings = state.findings || [];

      tbody.innerHTML = '';
      if (findings.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 24px;">No findings discovered yet.</td></tr>`;
        return;
      }

      findings.forEach((f, idx) => {
        const tr = document.createElement('tr');
        const sev = (f.severity || 'medium').toLowerCase();
        tr.innerHTML = `
          <td><strong>${f.title}</strong></td>
          <td><span class="severity-pill sev-${sev}">${f.severity}</span></td>
          <td><code>${f.target || 'N/A'}</code></td>
          <td>${f.cvss || 'N/A'} (EPS: ${f.eps || 'N/A'})</td>
          <td>
            <button class="btn-secondary" style="padding: 2px 8px; font-size: 11px;" onclick="root.SidebarUI.viewFindingPoC(${idx})">PoC</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    },

    viewFindingPoC(idx) {
      if (!root.ProjectState) return;
      const findings = root.ProjectState.get().findings || [];
      const f = findings[idx];
      if (f && f.poc) {
        alert(`Proof of Concept for "${f.title}":\n\n${f.poc}`);
      } else {
        alert('No PoC attached to this finding.');
      }
    },

    renderTasksTable() {
      const tbody = document.getElementById('tasks-table-body');
      if (!tbody || !root.ProjectState) return;
      const tasks = root.ProjectState.get().tasks || [];

      tbody.innerHTML = '';
      if (tasks.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 24px;">No tasks currently scheduled.</td></tr>`;
        return;
      }

      tasks.forEach(t => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${t.title}</strong></td>
          <td><code>${t.type || 'TASK'}</code></td>
          <td><span class="severity-pill sev-info">${t.status}</span></td>
          <td>${t.tool || 'Autonomous'}</td>
        `;
        tbody.appendChild(tr);
      });
    },

    renderIntelList() {
      const container = document.getElementById('intel-results-list');
      if (!container || !root.SecurityIntelligence) return;
      const cves = root.SecurityIntelligence.getKnownKEVs ? root.SecurityIntelligence.getKnownKEVs() : [];
      container.innerHTML = '';

      cves.slice(0, 15).forEach(cve => {
        const div = document.createElement('div');
        div.style.padding = '10px';
        div.style.borderBottom = '1px solid var(--border-subtle)';
        div.innerHTML = `
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <strong style="color: var(--accent-primary);">${cve.cveId}</strong>
            <span class="severity-pill sev-critical">CISA KEV</span>
          </div>
          <div style="font-size: 12px; margin-bottom: 4px;">${cve.title || cve.vulnerabilityName}</div>
          <div style="font-size: 11px; color: var(--text-muted);">Vendor: ${cve.vendor || cve.vendorProject} • Added: ${cve.dateAdded || 'N/A'}</div>
        `;
        container.appendChild(div);
      });
    },

    renderAttackGraphView() {
      const container = document.getElementById('attack-graph-canvas');
      if (!container) return;
      let graphData = null;
      if (root.AttackGraphCompiler) {
        graphData = root.AttackGraphCompiler.compile(root.ProjectState ? root.ProjectState.get() : {});
      }

      if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
        container.innerHTML = `
          <div style="padding: 48px 24px; text-align: center; color: var(--text-muted); font-family: var(--font-mono); font-size: 13px;">
            <div style="font-size: 28px; margin-bottom: 8px;">🕸️</div>
            <div style="font-weight: bold; color: var(--text-secondary); margin-bottom: 6px;">No attack path identified yet.</div>
            <div style="font-size: 11px; opacity: 0.7;">Attack paths are dynamically compiled as assets, exposed services, and findings are confirmed.</div>
          </div>
        `;
        return;
      }

      container.innerHTML = `
        <div style="padding: 20px; font-family: var(--font-mono); font-size: 12px; line-height: 1.6;">
          <div style="color: var(--accent-emerald); font-weight: bold; margin-bottom: 8px;">// ATTACK GRAPH TOPOLOGY</div>
          <div>Nodes compiled: ${graphData.nodes.length}</div>
          <div>Edges / Chaining vectors: ${graphData.edges.length}</div>
          <div style="margin-top: 12px; border-top: 1px dashed var(--border-subtle); padding-top: 8px;">
            ${graphData.nodes.map(n => `<div>[${n.type.toUpperCase()}] ${n.label}</div>`).join('')}
          </div>
        </div>
      `;
    },

    syncAllViews() {
      this.updateCounters();
      this.renderFindingsTable();
      this.renderTasksTable();
      if (root.ContextDrawerUI) root.ContextDrawerUI.render();
      if (root.ChatAgentUI) root.ChatAgentUI.render();
    },

    /**
     * Toggles between Picky98 (Default Retro Skin) and PickyTahoe (Modern).
     */
    toggleTheme() {
      const html = document.documentElement;
      const is98 = html.getAttribute('data-theme') === 'picky98';
      const newTheme = is98 ? 'tahoe-dark' : 'picky98';
      this.setTheme(newTheme);
    },

    setTheme(themeName) {
      const html = document.documentElement;
      const theme = themeName === 'tahoe-dark' || themeName === 'pickytahoe' ? 'tahoe-dark' : 'picky98';
      html.setAttribute('data-theme', theme);
      try { localStorage.setItem('pickyhack_theme', theme); } catch (_) {}
      this.currentTheme = theme;

      const label = document.getElementById('theme-toggle-label');
      if (label) label.textContent = theme === 'picky98' ? 'Picky98 (Default)' : 'PickyTahoe';

      // Synchronize radio buttons in Settings -> Appearance -> Interface
      const radio98 = document.getElementById('theme-radio-picky98');
      const radioTahoe = document.getElementById('theme-radio-pickytahoe');
      if (radio98) radio98.checked = (theme === 'picky98');
      if (radioTahoe) radioTahoe.checked = (theme === 'tahoe-dark');
    },

    initSavedTheme() {
      let saved = 'picky98';
      try { saved = localStorage.getItem('pickyhack_theme') || 'picky98'; } catch (_) {}
      this.setTheme(saved);
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SidebarUI;
  }
  root.SidebarUI = SidebarUI;
})(typeof window !== 'undefined' ? window : global);
