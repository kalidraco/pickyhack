/**
 * PickyHack — Native Pentest Note Taker (Notes.txt)
 * Real-time scratchpad with autosave and 1-click finding extraction.
 */
(function(root) {
  'use strict';

  const STORAGE_KEY = 'pickyhack_notes_content';

  const NotesTaker = {
    init() {
      const textarea = document.getElementById('notes-content');
      const btnSave = document.getElementById('btn-save-notes');
      const btnClear = document.getElementById('btn-clear-notes');
      const btnFinding = document.getElementById('btn-convert-note-finding');

      if (textarea) {
        textarea.value = this.load();
        textarea.addEventListener('input', () => this.save(textarea.value));
      }

      if (btnSave && textarea) {
        btnSave.addEventListener('click', () => {
          this.save(textarea.value);
          alert('Notes saved to local workspace.');
        });
      }

      if (btnClear && textarea) {
        btnClear.addEventListener('click', () => {
          if (confirm('Clear all notes?')) {
            textarea.value = '';
            this.save('');
          }
        });
      }

      if (btnFinding && textarea) {
        btnFinding.addEventListener('click', () => {
          const selected = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd).trim() || textarea.value.trim();
          if (!selected) {
            alert('Please highlight or write a note to convert into a finding.');
            return;
          }
          if (root.ProjectState) {
            root.ProjectState.addFinding({
              title: selected.split('\n')[0].substring(0, 60),
              severity: 'Medium',
              status: 'Discovered',
              poc: selected
            });
            alert('Created new Finding from note content.');
            if (root.WindowManager) root.WindowManager.open('win-findings');
          }
        });
      }
    },

    load() {
      try {
        return localStorage.getItem(STORAGE_KEY) || '=== PICKYHACK PENTEST NOTES ===\n• Initial target discovery completed.\n• Vulnerability scans in progress.\n';
      } catch (e) {
        return '';
      }
    },

    save(text) {
      try {
        localStorage.setItem(STORAGE_KEY, text);
        if (root.ProjectState) {
          root.ProjectState.update({ notes: text });
        }
      } catch (e) {}
    },

    appendNote(snippet) {
      const textarea = document.getElementById('notes-content');
      const current = textarea ? textarea.value : this.load();
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
      const updated = `${current}\n[${timestamp}] ${snippet}\n`;

      if (textarea) textarea.value = updated;
      this.save(updated);
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotesTaker;
  } else {
    root.NotesTaker = NotesTaker;
  }
})(typeof window !== 'undefined' ? window : global);
