/**
 * PickyHack — Native Pentest Note Taker (Notes.txt)
 * Clean blank slate on first open with autosave, title tracking,
 * finding extraction, text export, and Ask PickyHack integration.
 */
(function(root) {
  'use strict';

  const STORAGE_KEY = 'pickyhack_notes_content';
  const TITLE_KEY = 'pickyhack_notes_title';

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

  const NotesTaker = {
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
              poc: selected
            });
            if (typeof alert !== 'undefined') alert('Created new Finding from note content.');
            if (root.WindowManager) root.WindowManager.open('win-findings');
          }
        });
      }

      if (btnAskAI) {
        btnAskAI.addEventListener('click', () => {
          if (!textarea) return;
          const selected = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd).trim() || textarea.value.trim();
          if (!selected) {
            if (typeof alert !== 'undefined') alert('Please highlight text or write a note to ask PickyHack.');
            return;
          }
          if (root.ChatUI && typeof root.ChatUI.handleUserSubmit === 'function') {
            if (root.WindowManager) root.WindowManager.open('win-chat');
            root.ChatUI.handleUserSubmit(`Analyze this note / observation from my pentest:\n\n${selected}`);
          }
        });
      }
    },

    getTextarea() {
      if (typeof document === 'undefined') return null;
      return document.getElementById('notes-textarea') || document.getElementById('notes-content');
    },

    load() {
      // Empty on first launch: no hardcoded mock notes
      return safeStorage.getItem(STORAGE_KEY) || '';
    },

    loadTitle() {
      return safeStorage.getItem(TITLE_KEY) || '';
    },

    save(text) {
      safeStorage.setItem(STORAGE_KEY, text);
      if (root.ProjectState) {
        root.ProjectState.update({ notes: text });
      }
    },

    saveTitle(title) {
      safeStorage.setItem(TITLE_KEY, title);
    },

    updateStats() {
      if (typeof document === 'undefined') return;
      const textarea = this.getTextarea();
      const statsEl = document.getElementById('sb-note-length');
      if (textarea && statsEl) {
        const text = textarea.value;
        const lines = text ? text.split('\n').length : 0;
        statsEl.textContent = `${text.length} chars, ${lines} lines`;
      }
    },

    exportFile() {
      if (typeof document === 'undefined') return;
      const textarea = this.getTextarea();
      const titleInput = document.getElementById('note-title-input');
      const text = textarea ? textarea.value : '';
      const title = (titleInput && titleInput.value.trim()) ? titleInput.value.trim() : 'PickyHack_Notes';
      
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/[^a-zA-Z0-9_\-]/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    },

    appendNote(snippet) {
      const textarea = this.getTextarea();
      const current = textarea ? textarea.value : this.load();
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
      const prefix = current ? `${current}\n` : '';
      const updated = `${prefix}[${timestamp}] ${snippet}\n`;

      if (textarea) {
        textarea.value = updated;
        this.updateStats();
      }
      this.save(updated);
    },

    setNotes(text) {
      const textarea = this.getTextarea();
      if (textarea) textarea.value = text || '';
      this.save(text || '');
      this.updateStats();
    },

    setTitle(title) {
      const titleInput = document.getElementById('note-title-input');
      if (titleInput) titleInput.value = title || '';
      this.saveTitle(title || '');
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotesTaker;
  }
  root.NotesTaker = NotesTaker;
})(typeof window !== 'undefined' ? window : global);
