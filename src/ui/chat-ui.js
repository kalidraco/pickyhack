/**
 * PickyHack — Chat Conversation UI & Multi-Model Comparison
 * Progressive Disclosure UX: Clean empty state on first open,
 * minimal direct answers by default, and expandable details on demand.
 */
(function(root) {
  'use strict';

  const ChatUI = {
    conversations: [
      {
        id: 'conv-default',
        title: 'Live Session',
        messages: [] // Empty state on launch: shows "What we hack ?" hero
      }
    ],
    activeConvId: 'conv-default',

    init() {
      if (typeof document === 'undefined') return;

      const form = document.getElementById('chat-input-form');
      const input = document.getElementById('chat-input');
      const btnSend = document.getElementById('btn-chat-send');
      const btnComp = document.getElementById('btn-chat-compare');
      const lightbox = document.getElementById('image-lightbox-modal');
      const lightboxClose = document.getElementById('image-lightbox-close');

      if (form && input) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleUserSubmit(input.value);
          input.value = '';
        });
      }

      if (btnComp && input) {
        btnComp.addEventListener('click', () => {
          if (!input.value.trim()) {
            if (typeof alert !== 'undefined') alert('Please enter a question or command to compare across models.');
            return;
          }
          this.handleCompareSubmit(input.value);
          input.value = '';
        });
      }

      if (lightbox && lightboxClose) {
        lightboxClose.addEventListener('click', () => lightbox.classList.remove('open'));
        lightbox.addEventListener('click', (e) => {
          if (e.target === lightbox) lightbox.classList.remove('open');
        });
      }

      // Starter chips hookup
      const chips = document.querySelectorAll('.starter-chip');
      chips.forEach(chip => {
        chip.addEventListener('click', () => {
          const prompt = chip.getAttribute('data-prompt');
          const action = chip.getAttribute('data-action');
          if (action === 'open-notes' && root.WindowManager) {
            root.WindowManager.open('win-notes');
            return;
          }
          if (prompt) {
            this.handleUserSubmit(prompt);
          }
        });
      });

      this.render();
    },

    getActiveConversation() {
      return this.conversations.find(c => c.id === this.activeConvId) || this.conversations[0];
    },

    async handleUserSubmit(text) {
      if (!text || !text.trim()) return;
      const conv = this.getActiveConversation();
      const userText = text.trim();

      // Retrieve staged attachments
      const attachments = (root.AttachmentManager) ? root.AttachmentManager.getStaged() : [];

      conv.messages.push({
        id: `m-${Date.now()}`,
        sender: 'user',
        text: userText,
        attachments: attachments.map(a => ({
          name: a.name,
          type: a.type,
          dataUrl: a.dataUrl
        }))
      });

      // Clear attachment shelf
      if (root.AttachmentManager) root.AttachmentManager.clearStaged();

      this.render();

      // Show typing indicator
      const activeEngine = root.ProviderRegistry ? root.ProviderRegistry.getActiveEngine() : { name: 'PickyHack AI', model: 'gpt-4o' };
      const streamMsgId = `m-stream-${Date.now()}`;
      conv.messages.push({
        id: streamMsgId,
        sender: 'ai',
        provider: activeEngine.provider,
        model: activeEngine.customModel || activeEngine.model,
        isStreaming: true,
        text: 'Consulting model...'
      });
      this.render();

      // Build stateless context packet
      const packet = root.ContextEngine ? root.ContextEngine.buildPacket(userText, { attachments }) : { systemPrompt: '', userPacket: userText };

      // Dispatch request
      const images = attachments.filter(a => a.type === 'image');
      const response = await root.ProviderRegistry.send(packet.systemPrompt, packet.userPacket, null, images);

      // Update streaming placeholder
      const aiMsg = conv.messages.find(m => m.id === streamMsgId);
      if (aiMsg) {
        aiMsg.isStreaming = false;
        aiMsg.text = response.text;
        aiMsg.code = response.code;
        aiMsg.details = response.details || null;
        aiMsg.model = response.modelName;
        aiMsg.provider = response.provider;
        aiMsg.isFallback = response.isFallback;
      }

      this.render();
      if (root.ContextOptimizer) root.ContextOptimizer.updateBudgetMeter();
    },

    async handleCompareSubmit(text) {
      const conv = this.getActiveConversation();
      const userText = text.trim();

      conv.messages.push({
        id: `m-${Date.now()}`,
        sender: 'user',
        text: `[Multi-Model Evaluation]: ${userText}`
      });
      this.render();

      const engines = root.ProviderRegistry ? root.ProviderRegistry.getEngines() : [];
      if (engines.length < 2) {
        if (typeof alert !== 'undefined') alert('Please configure at least 2 AI engines in Multi-API Manager to compare responses.');
        return;
      }

      const packet = root.ContextEngine ? root.ContextEngine.buildPacket(userText) : { systemPrompt: '', userPacket: userText };

      const compareId = `m-comp-${Date.now()}`;
      conv.messages.push({
        id: compareId,
        sender: 'ai',
        isComparison: true,
        text: `Broadcasting query across ${engines.length} configured engines...`,
        cards: []
      });
      this.render();

      const promises = engines.map(eng => root.ProviderRegistry.send(packet.systemPrompt, packet.userPacket, eng));
      const results = await Promise.all(promises);

      const compMsg = conv.messages.find(m => m.id === compareId);
      if (compMsg) {
        compMsg.text = `### Multi-Model Comparison (${results.length} engines):\n`;
        compMsg.cards = results.map(r => ({
          engineName: r.engineName,
          model: r.modelName,
          text: r.text,
          code: r.code
        }));
      }

      this.render();
    },

    render() {
      if (typeof document === 'undefined') return;

      const container = document.getElementById('chat-messages-feed') || document.getElementById('chat-messages-container');
      const emptyState = document.getElementById('chat-empty-state');
      const conv = this.getActiveConversation();

      // If no messages, present the clean "What we hack ?" empty state
      if (!conv || !conv.messages || conv.messages.length === 0) {
        if (emptyState) emptyState.style.display = 'flex';
        if (container) {
          container.style.display = 'none';
          container.innerHTML = '';
        }
        return;
      }

      if (emptyState) emptyState.style.display = 'none';
      if (container) {
        container.style.display = 'block';
        container.innerHTML = '';
      }

      conv.messages.forEach(msg => {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble-row ${msg.sender === 'user' ? 'bubble-user' : 'bubble-ai'}`;

        let attributionHtml = '';
        if (msg.sender === 'ai') {
          const modelName = msg.model || 'gpt-4o';
          attributionHtml = `
            <div class="bubble-attribution">
              <span class="ai-badge">🤖 [PICKYHACK AI • ${modelName}]</span>
              ${msg.isStreaming ? '<span class="streaming-pulse">Thinking...</span>' : ''}
            </div>
          `;
        } else {
          attributionHtml = `<div class="bubble-attribution"><span class="user-badge">👤 OPERATOR</span></div>`;
        }

        let bodyHtml = '';
        if (msg.text) {
          bodyHtml += `<div class="bubble-text">${this.formatMarkdown(msg.text)}</div>`;
        }

        // Render attachments if any
        if (msg.attachments && msg.attachments.length > 0) {
          bodyHtml += `<div class="msg-attachments-container">`;
          msg.attachments.forEach(att => {
            if (att.type === 'image') {
              bodyHtml += `<img src="${att.dataUrl}" class="msg-image-thumb" alt="${att.name}" onclick="root.ChatUI.openLightbox('${att.dataUrl}')">`;
            } else {
              bodyHtml += `<span class="msg-attachment-pill">📄 ${att.name}</span>`;
            }
          });
          bodyHtml += `</div>`;
        }

        // Render code block if present
        if (msg.code) {
          bodyHtml += `
            <div class="chat-code-block win-inset">
              <div class="code-block-header">
                <span>COMMAND / SYNTAX</span>
                <button class="win-btn btn-copy-code" onclick="navigator.clipboard.writeText(\`${msg.code.replace(/`/g, '\\`')}\`); if (typeof alert !== 'undefined') alert('Copied to clipboard!');">📋 Copy</button>
              </div>
              <pre><code>${root.SecurityValidator ? root.SecurityValidator.escapeHTML(msg.code) : msg.code}</code></pre>
            </div>
          `;
        }

        // Render Progressive Disclosure Drawer if details are attached
        if (msg.details) {
          bodyHtml += `
            <div style="margin-top: 6px;">
              <button class="win-btn btn-toggle-details" style="font-size: 10px; padding: 2px 6px;" onclick="root.ChatUI.toggleDetails('${msg.id}')">
                <span>🔍</span> View Details ▼
              </button>
              <div id="details-${msg.id}" class="progressive-details-drawer win-inset-shallow" style="display: none; margin-top: 4px; padding: 6px 8px; font-size: 11px; background: #fdfdfd; border: 1px dashed #808080;">
                ${this.formatMarkdown(msg.details)}
              </div>
            </div>
          `;
        }

        // Render comparison cards
        if (msg.isComparison && msg.cards && msg.cards.length > 0) {
          bodyHtml += `<div class="multi-model-comparison-grid">`;
          msg.cards.forEach(card => {
            bodyHtml += `
              <div class="comparison-card win-outset">
                <div class="comparison-card-title"><strong>${card.engineName}</strong> (${card.model})</div>
                <div class="comparison-card-body">
                  ${this.formatMarkdown(card.text)}
                  ${card.code ? `<pre class="comparison-code-block"><code>${root.SecurityValidator ? root.SecurityValidator.escapeHTML(card.code) : card.code}</code></pre>` : ''}
                </div>
              </div>
            `;
          });
          bodyHtml += `</div>`;
        }

        // Quick action buttons on AI responses: Discrete, unobtrusive
        if (msg.sender === 'ai' && !msg.isStreaming) {
          const contentToCopy = (msg.code ? msg.code : msg.text || '').replace(/[`\\]/g, '');
          bodyHtml += `
            <div class="bubble-actions-row">
              <button class="win-btn btn-send-notes" onclick="root.NotesTaker.appendNote(\`${contentToCopy}\`); if (typeof alert !== 'undefined') alert('Added to Notes.txt');">📝 Send to Notes</button>
              <button class="win-btn btn-copy-response" onclick="navigator.clipboard.writeText(\`${contentToCopy}\`); if (typeof alert !== 'undefined') alert('Copied to clipboard!');">📋 Copy</button>
            </div>
          `;
        }

        bubble.innerHTML = `
          <div class="chat-bubble-card win-outset">
            ${attributionHtml}
            ${bodyHtml}
          </div>
        `;

        if (container) container.appendChild(bubble);
      });

      if (container) container.scrollTop = container.scrollHeight;
    },

    toggleDetails(msgId) {
      if (typeof document === 'undefined') return;
      const el = document.getElementById(`details-${msgId}`);
      if (!el) return;
      el.style.display = el.style.display === 'none' ? 'block' : 'none';
    },

    openLightbox(dataUrl) {
      if (typeof document === 'undefined') return;
      const modal = document.getElementById('image-lightbox-modal');
      const img = document.getElementById('image-lightbox-img');
      if (modal && img) {
        img.src = dataUrl;
        modal.classList.add('open');
      }
    },

    formatMarkdown(text) {
      if (!text || typeof text !== 'string') return '';
      let escaped = root.SecurityValidator ? root.SecurityValidator.escapeHTML(text) : text;

      // Headers
      escaped = escaped.replace(/^### (.*$)/gim, '<h4 style="color:#000080; margin: 4px 0 2px 0;">$1</h4>');
      escaped = escaped.replace(/^## (.*$)/gim, '<h3 style="color:#000080; margin: 6px 0 2px 0;">$1</h3>');
      escaped = escaped.replace(/^# (.*$)/gim, '<h2 style="color:#000080; margin: 8px 0 4px 0;">$1</h2>');

      // Bold & Italic
      escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      escaped = escaped.replace(/\*(.*?)\*/g, '<em>$1</em>');

      // Inline code
      escaped = escaped.replace(/`([^`]+)`/g, '<code style="background:#e0e0e0; padding:1px 4px; border:1px solid #ccc; font-size:11px;">$1</code>');

      // Line breaks
      escaped = escaped.replace(/\n/g, '<br>');

      return escaped;
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatUI;
  }
  root.ChatUI = ChatUI;
})(typeof window !== 'undefined' ? window : global);
