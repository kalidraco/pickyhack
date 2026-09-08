/**
 * PickyHack — Attachment & Multimodal Artifact Manager
 * Handles drag-and-drop, file staging shelf, security validation,
 * intelligent parsing of scan dumps, and vision payload dispatch.
 */
(function(root) {
  'use strict';

  const AttachmentManager = {
    staged: [],

    init() {
      const dropOverlay = document.getElementById('chat-drop-overlay');
      const chatWin = document.getElementById('win-chat');
      const fileInput = document.getElementById('chat-file-input');
      const attachBtn = document.getElementById('btn-attach-trigger');

      if (attachBtn && fileInput) {
        attachBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
          if (e.target.files && e.target.files.length > 0) {
            this.handleFiles(Array.from(e.target.files));
            fileInput.value = '';
          }
        });
      }

      if (chatWin && dropOverlay) {
        ['dragenter', 'dragover'].forEach(eventName => {
          chatWin.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropOverlay.classList.add('active');
          });
        });

        ['dragleave', 'drop'].forEach(eventName => {
          chatWin.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.type === 'drop') {
              dropOverlay.classList.remove('active');
              if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                this.handleFiles(Array.from(e.dataTransfer.files));
              }
            } else if (e.relatedTarget === null || !chatWin.contains(e.relatedTarget)) {
              dropOverlay.classList.remove('active');
            }
          });
        });
      }

      this.renderShelf();
    },

    async handleFiles(files) {
      const validator = root.SecurityValidator;

      for (const file of files) {
        // Enforce security validation
        if (validator) {
          const check = validator.validateFile(file);
          if (!check.valid) {
            alert(`[Security Alert] ${check.error}`);
            continue;
          }
        }

        if (this.staged.length >= 5) {
          alert('Maximum 5 files can be staged per message.');
          break;
        }

        const isImg = file.type.startsWith('image/') || /\.(png|jpg|jpeg|webp)$/i.test(file.name);
        
        if (isImg) {
          const dataUrl = await this.readFileAsDataURL(file);
          this.staged.push({
            id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            name: validator ? validator.sanitizeFilename(file.name) : file.name,
            size: file.size,
            type: 'image',
            mimeType: file.type || 'image/png',
            dataUrl,
            base64: dataUrl.split(',')[1] || ''
          });
        } else {
          const text = await this.readFileAsText(file);
          const parsed = this.parseSecurityDump(file.name, text);
          this.staged.push({
            id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            name: validator ? validator.sanitizeFilename(file.name) : file.name,
            size: file.size,
            type: 'text',
            textContent: parsed
          });
        }
      }

      this.renderShelf();
      if (root.ContextOptimizer && typeof root.ContextOptimizer.updateBudgetMeter === 'function') {
        root.ContextOptimizer.updateBudgetMeter();
      }
    },

    readFileAsDataURL(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    },

    readFileAsText(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsText(file);
      });
    },

    parseSecurityDump(filename, rawText) {
      if (!rawText) return '';
      // Limit raw content to ~80KB to prevent context exhaustion
      const maxLen = 80000;
      let text = rawText;
      if (text.length > maxLen) {
        text = text.substring(0, 40000) +
               `\n\n[... PickyHack Truncated ${(text.length - maxLen).toLocaleString()} characters of verbose scan output ...]\n\n` +
               text.substring(text.length - 40000);
      }
      return text;
    },

    removeStaged(id) {
      this.staged = this.staged.filter(a => a.id !== id);
      this.renderShelf();
      if (root.ContextOptimizer && typeof root.ContextOptimizer.updateBudgetMeter === 'function') {
        root.ContextOptimizer.updateBudgetMeter();
      }
    },

    clearStaged() {
      this.staged = [];
      this.renderShelf();
    },

    renderShelf() {
      const shelf = document.getElementById('chat-attachment-shelf');
      if (!shelf) return;

      if (this.staged.length === 0) {
        shelf.classList.remove('has-items');
        shelf.innerHTML = '';
        return;
      }

      shelf.classList.add('has-items');
      shelf.innerHTML = '';

      this.staged.forEach(item => {
        const chip = document.createElement('div');
        chip.className = 'attachment-chip';

        let thumbHtml = '';
        if (item.type === 'image') {
          thumbHtml = `<img src="${item.dataUrl}" class="chip-thumb" alt="${item.name}">`;
        } else {
          thumbHtml = `<span class="chip-icon">📄</span>`;
        }

        const sizeKb = (item.size / 1024).toFixed(1);
        chip.innerHTML = `
          ${thumbHtml}
          <span class="chip-name" title="${item.name}">${item.name} (${sizeKb}KB)</span>
          <span class="chip-remove" data-id="${item.id}" title="Remove file">×</span>
        `;

        chip.querySelector('.chip-remove').addEventListener('click', (e) => {
          e.stopPropagation();
          this.removeStaged(item.id);
        });

        shelf.appendChild(chip);
      });
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = AttachmentManager;
  } else {
    root.AttachmentManager = AttachmentManager;
  }
})(typeof window !== 'undefined' ? window : global);
