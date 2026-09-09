/**
 * PickyHack — Native Pentest Note Taker & Knowledge Scratchpad
 * Supports structured notes by category (GENERAL, RECON, FINDING, HYPOTHESIS,
 * TODO, EVIDENCE, COMMAND), links to assets/tasks/findings, and autosaves.
 */
(function(root) {
  'use strict';

  const STORAGE_KEY = 'pickyhack_notes_content';
  const TITLE_KEY = 'pickyhack_notes_title';
  const STRUCTURED_KEY = 'pickyhack_notes_structured';

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

  const CATEGORIES = ['GENERAL', 'RECON', 'FINDING', 'HYPOTHESIS', 'TODO', 'EVIDENCE', 'COMMAND'];

  const NotesTaker = {
    CATEGORIES,

    init() {
      if (typeof document === 'undefined') return;

      const textarea = this.getTextarea();
      const titleInput = document.getElementById('note-title-input');
      const btnSave = document.getElementById('btn-note-save') || document.getElementById('btn-save-notes');
      const btnClear = document.getElementById('btn-note-clear') || document.getElementById('btn-clear-notes');
      const btnExport = document.getElementById('btn-note-export') || document.getElementById('btn-export-notes');
      const btnFinding = document.getElementById('btn-note-to-finding') || document.getElementById('btn-convert-note-finding');
      const btnAskAI = document.getElementById('btn-note-ask-ai');

      if (titleInput) {
        titleInput.value = this.loadTitle();
        titleInput.addEventListener('input', () => this.saveTitle(titleInput.value));
      }

      if (textarea) {
        textarea.value = this.load();
        this.updateStats();
        textarea.addEventListener('input', () => {
          this.save(textarea.value);
          this.updateStats();
        });
      }

      if (btnSave) {
        btnSave.addEventListener('click', () => {
          const content = textarea ? textarea.value : '';
          const title = titleInput ? titleInput.value : '';
          this.save(content);
          this.saveTitle(title);
          if (typeof alert !== 'undefined') alert('Notes saved to local workspace.');
        });
      }

      if (btnClear) {
        btnClear.addEventListener('click', () => {
          const confirmed = typeof confirm !== 'undefined' ? confirm('Clear current note?') : true;
          if (confirmed) {
            if (textarea) textarea.value = '';
            if (titleInput) titleInput.value = '';
            this.save('');
            this.saveTitle('');
            this.updateStats();
          }
        });
      }

      if (btnExport) {
        btnExport.addEventListener('click', () => this.exportFile());
      }

      if (btnFinding) {
        btnFinding.addEventListener('click', () => {
          if (!textarea) return;
          const selected = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd).trim() || textarea.value.trim();
          if (!selected) {
            if (typeof alert !== 'undefined') alert('Please write or highlight a note to convert into a finding.');
            return;
          }
          if (root.ProjectState) {
            const firstLine = selected.split('\n')[0].replace(/^#+\s*/, '').substring(0, 60);
            root.ProjectState.addFinding({
              title: firstLine || 'Finding from Notes',
              severity: 'Medium',
              status: 'Discovered',
              description: selected
            });
            if (typeof alert !== 'undefined') alert(`Finding created: "${firstLine}"`);
          }
        });
      }

      if (btnAskAI) {
        btnAskAI.addEventListener('click', () => {
          if (!textarea) return;
          const selected = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd).trim() || textarea.value.trim();
          if (!selected) {
            if (typeof alert !== 'undefined') alert('Select text in Notes first, then Ask PickyHack.');
            return;
          }
          if (root.ChatUI) {
            const prompt = `Based on these pentest notes, what is the best next attack vector or verification step?\n\n"""\n${selected}\n"""`;
            root.ChatUI.handleUserSubmit(prompt);
          }
        });
      }
    },

    getTextarea() {
      if (typeof document === 'undefined') return null;
      return document.getElementById('notes-content-area') || document.getElementById('notepad-textarea');
    },

    load() {
      const saved = safeStorage.getItem(STORAGE_KEY);
      return saved !== null ? saved : '';
    },

    save(text) {
      safeStorage.setItem(STORAGE_KEY, text || '');
    },

    loadTitle() {
      const saved = safeStorage.getItem(TITLE_KEY);
      return saved !== null ? saved : '';
    },

    saveTitle(title) {
      safeStorage.setItem(TITLE_KEY, title || '');
    },

    /**
     * Appends text to the active notes workspace.
     * @param {string} text - Content to append
     * @param {string} [category] - Optional category tag (GENERAL, RECON, FINDING, etc.)
     */
    appendNote(text, category = 'GENERAL') {
      if (!text) return;
      const current = this.load();
      const timestamp = new Date().toLocaleTimeString();
      const header = current ? `\n\n--- [${category} • ${timestamp}] ---\n` : `--- [${category} • ${timestamp}] ---\n`;
      const updated = (current || '') + header + text.trim();
      this.save(updated);

      const textarea = this.getTextarea();
      if (textarea) {
        textarea.value = updated;
        textarea.scrollTop = textarea.scrollHeight;
        this.updateStats();
      }

      // Add to structured notes list
      this.addStructuredNote({
        category,
        content: text.trim(),
        timestamp: new Date().toISOString()
      });
    },

    getStructuredNotes() {
      try {
        const raw = safeStorage.getItem(STRUCTURED_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (_) {
        return [];
      }
    },

    addStructuredNote(note) {
      const list = this.getStructuredNotes();
      const item = {
        id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        category: note.category || 'GENERAL',
        content: note.content || '',
        target: note.target || null,
        taskId: note.taskId || null,
        findingId: note.findingId || null,
        timestamp: note.timestamp || new Date().toISOString()
      };
      list.push(item);
      safeStorage.setItem(STRUCTURED_KEY, JSON.stringify(list));
      return item;
    },

    updateStats() {
      if (typeof document === 'undefined') return;
      const textarea = this.getTextarea();
      const countEl = document.getElementById('note-word-count') || document.getElementById('notepad-wordcount');
      if (!countEl || !textarea) return;

      const text = textarea.value.trim();
      const words = text ? text.split(/\s+/).length : 0;
      const lines = text ? text.split('\n').length : 0;
      countEl.textContent = `${lines} lines, ${words} words`;
    },

    exportFile() {
      if (typeof document === 'undefined') return;
      const textarea = this.getTextarea();
      const text = textarea ? textarea.value : this.load();
      const title = this.loadTitle() || 'pickyhack-notes';
      const cleanFilename = `${title.toLowerCase().replace(/[^a-z0-9_-]/g, '_')}.txt`;

      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = cleanFilename;
      link.click();
      URL.revokeObjectURL(link.href);
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotesTaker;
  }
  root.NotesTaker = NotesTaker;
})(typeof window !== 'undefined' ? window : global);
