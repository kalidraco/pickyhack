/**
 * PickyHack — Chat Conversation UI & Multi-Model Comparison
 * Renders dialogue threads, markdown formatting, comparative evaluation cards,
 * image lightbox viewer, and quick action chips.
 */
(function(root) {
  'use strict';

  const ChatUI = {
    conversations: [
      {
        id: 'conv-default',
        title: 'Initial Assessment',
        messages: [
          {
            id: 'm-0',
            sender: 'ai',
            provider: 'openai',
            model: 'gpt-4o',
            text: `PickyHack Stateless Context Harness online.\nTarget: \`vpn.megacorp.internal\`.\n\nReady to analyze attack surface, simulate breach paths, or evaluate vulnerability findings.`,
            code: null
          }
        ]
      }
    ],
    activeConvId: 'conv-default',

    init() {
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
            alert('Please enter a question or command to compare across models.');
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

      this.render();
    },

    getActiveConversation() {
      return this.conversations.find(c => c.id === this.activeConvId) || this.conversations[0];
    },

    async handleUserSubmit(text) {
      if (!text || !text.trim()) return;
      const conv = this.getActiveConversation();
      const userText = text.trim();

      // Collect staged attachments
      const attachments = (root.AttachmentManager && root.AttachmentManager.staged)
        ? [...root.AttachmentManager.staged]
        : [];

      // Add user message to conversation
      conv.messages.push({
        id: `m-${Date.now()}`,
        sender: 'user',
        text: userText,
        attachments: attachments.map(a => ({
          name: a.name,
          size: a.size,
          type: a.type,
          dataUrl: a.dataUrl,
          textContent: a.textContent
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
        text: 'Synthesizing context packet and consulting engine...'
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
        alert('Please configure at least 2 AI engines in Multi-API Manager to compare responses.');
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
        compMsg.text = `### Multi-Model Consensus (${results.length} engines evaluated):\n`;
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
      const container = document.getElementById('chat-messages-container');
      if (!container) return;

      container.innerHTML = '';
      const conv = this.getActiveConversation();

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

        let bodyHtml = `<div class="bubble-text">${this.formatMarkdown(msg.text)}</div>`;

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
                <span>TERMINAL COMMAND / SYNTAX</span>
                <button class="win-btn btn-copy-code" onclick="navigator.clipboard.writeText(\`${msg.code.replace(/`/g, '\\`')}\`); alert('Copied to clipboard!');">📋 Copy</button>
              </div>
              <pre><code>${root.SecurityValidator ? root.SecurityValidator.escapeHTML(msg.code) : msg.code}</code></pre>
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
                <div class="comparison-card-body">${this.formatMarkdown(card.text)}</div>
              </div>
            `;
          });
          bodyHtml += `</div>`;
        }

        // Quick action buttons on AI responses
        if (msg.sender === 'ai' && !msg.isStreaming) {
          bodyHtml += `
            <div class="bubble-actions-row">
              <button class="win-btn btn-send-notes" onclick="root.NotesTaker.appendNote(\`${(msg.text || '').replace(/[`\\]/g, '')}\`); alert('Added to Notes.txt');">📝 Send to Notes</button>
              <button class="win-btn btn-copy-response" onclick="navigator.clipboard.writeText(\`${(msg.text || '').replace(/[`\\]/g, '')}\`); alert('Response copied!');">📋 Copy</button>
            </div>
          `;
        }

        bubble.innerHTML = `
          <div class="chat-bubble-card win-outset">
            ${attributionHtml}
            ${bodyHtml}
          </div>
        `;

        container.appendChild(bubble);
      });

      container.scrollTop = container.scrollHeight;
    },

    openLightbox(dataUrl) {
      const modal = document.getElementById('image-lightbox-modal');
      const img = document.getElementById('image-lightbox-img');
      if (modal && img) {
        img.src = dataUrl;
        modal.classList.add('open');
      }
    },

    formatMarkdown(raw) {
      if (!raw) return '';
      const v = root.SecurityValidator;
      let text = v ? v.escapeHTML(raw) : raw;

      // Bold **text**
      text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Inline code `code`
      text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
      // Headers ###
      text = text.replace(/^### (.*$)/gim, '<h4 style="margin:6px 0 2px;color:#000080;">$1</h4>');
      text = text.replace(/^## (.*$)/gim, '<h3 style="margin:8px 0 4px;color:#000080;">$1</h3>');
      // Bullet lists
      text = text.replace(/^- (.*$)/gim, '• $1<br>');
      // Line breaks
      text = text.replace(/\n/g, '<br>');

      return text;
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatUI;
  } else {
    root.ChatUI = ChatUI;
  }
})(typeof window !== 'undefined' ? window : global);
