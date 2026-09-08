/**
 * PickyHack — Security Sanitizer & Secret Redaction Engine
 * Guarantees zero sensitive credentials, API keys, or private tokens leak
 * into Context Snapshots, Markdown exports, logs, or reports.
 */
(function(root) {
  'use strict';

  const SECRET_PATTERNS = [
    {
      name: 'Anthropic API Key',
      type: 'ANTHROPIC_API_KEY',
      regex: /\bsk-ant-[a-zA-Z0-9_\-]{15,}\b/gi
    },
    {
      name: 'OpenRouter API Key',
      type: 'OPENROUTER_API_KEY',
      regex: /\bsk-or-[a-zA-Z0-9_\-]{15,}\b/gi
    },
    {
      name: 'OpenAI API Key',
      type: 'OPENAI_API_KEY',
      regex: /\bsk-(?:proj-|svcacct-|(?!ant-|or-))[a-zA-Z0-9_\-]{20,}\b/g
    },
    {
      name: 'Google Gemini API Key',
      type: 'GOOGLE_API_KEY',
      regex: /\bAIzaSy[a-zA-Z0-9_\-]{33}\b/g
    },
    {
      name: 'AWS Access Key',
      type: 'AWS_ACCESS_KEY',
      regex: /\bAKIA[0-9A-Z]{16}\b/g
    },
    {
      name: 'Generic Bearer Token',
      type: 'BEARER_TOKEN',
      regex: /Bearer\s+([a-zA-Z0-9_\-\.]{24,})/gi
    },
    {
      name: 'RSA/Private Key',
      type: 'PRIVATE_KEY',
      regex: /-----BEGIN [A-Z\s]+ PRIVATE KEY-----[\s\S]*?-----END [A-Z\s]+ PRIVATE KEY-----/g
    },
    {
      name: 'Plaintext Password Field',
      type: 'PASSWORD_FIELD',
      regex: /(password|passwd|pwd|api_key|secret_key)\s*[:=]\s*["']?([^\s"';,]{6,})["']?/gi
    }
  ];

  const SecuritySanitizer = {
    /**
     * Redacts all known secret patterns from the provided text.
     * @param {string} text - Raw input string
     * @returns {{ sanitized: string, redactedCount: number, detectedTypes: string[] }}
     */
    redact(text) {
      if (!text || typeof text !== 'string') {
        return { sanitized: text || '', redactedCount: 0, detectedTypes: [] };
      }

      let sanitized = text;
      let redactedCount = 0;
      const detectedTypes = new Set();

      SECRET_PATTERNS.forEach(pattern => {
        const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
        sanitized = sanitized.replace(regex, (match) => {
          redactedCount++;
          detectedTypes.add(pattern.type);
          return `[REDACTED_SECRET: ${pattern.type}]`;
        });
      });

      return {
        sanitized,
        redactedCount,
        detectedTypes: Array.from(detectedTypes)
      };
    },

    /**
     * Detects secrets in a string without modifying it.
     * @param {string} text
     * @returns {Array<{ name: string, type: string, count: number }>}
     */
    detect(text) {
      if (!text || typeof text !== 'string') return [];
      const findings = [];

      SECRET_PATTERNS.forEach(pattern => {
        const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
        const matches = text.match(regex);
        if (matches && matches.length > 0) {
          findings.push({
            name: pattern.name,
            type: pattern.type,
            count: matches.length
          });
        }
      });

      return findings;
    },

    /**
     * Checks if a string is completely free of known credentials.
     * @param {string} text
     * @returns {boolean}
     */
    isClean(text) {
      return this.detect(text).length === 0;
    },

    /**
     * Masks an API key for safe UI display (e.g. sk-proj-...••••••••).
     * @param {string} key
     * @returns {string}
     */
    maskKey(key) {
      if (!key || typeof key !== 'string') return '';
      const trimmed = key.trim();
      if (trimmed.length <= 8) return '••••••••';
      const prefix = trimmed.substring(0, 7);
      return `${prefix}••••••••${trimmed.substring(trimmed.length - 3)}`;
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecuritySanitizer;
  }
  root.SecuritySanitizer = SecuritySanitizer;
})(typeof window !== 'undefined' ? window : global);
