/**
 * PickyHack — Input Validation & File Security Engine
 * Enforces strict allowlists, path traversal protection, upload quotas,
 * SSRF endpoint checks, and XSS sanitization.
 */
(function(root) {
  'use strict';

  const ALLOWED_EXTENSIONS = [
    '.txt', '.log', '.xml', '.json', '.nmap', '.gnmap',
    '.yaml', '.yml', '.csv', '.md', '.png', '.jpg', '.jpeg', '.webp'
  ];

  const FORBIDDEN_EXTENSIONS = [
    '.exe', '.bat', '.cmd', '.sh', '.ps1', '.vbs', '.php',
    '.py', '.jar', '.html', '.htm', '.svg', '.dll', '.so', '.bin', '.scr', '.pif'
  ];

  const BLOCKED_SSRF_HOSTS = [
    '169.254.169.254',           // AWS / GCP / Azure metadata
    'metadata.google.internal',  // GCP metadata
    '100.100.100.200',           // Alibaba Cloud metadata
    'instance-data'
  ];

  const MAX_FILE_SIZE = 5 * 1024 * 1024;       // 5 MB
  const MAX_TOTAL_SIZE = 15 * 1024 * 1024;     // 15 MB
  const MAX_FILE_COUNT = 5;

  const SecurityValidator = {
    /**
     * Sanitizes a filename against path traversal and null byte injection.
     * @param {string} filename
     * @returns {string} Safe base filename
     */
    sanitizeFilename(filename) {
      if (!filename || typeof filename !== 'string') return 'unnamed_artifact.txt';
      let safe = filename
        .replace(/\0/g, '')               // Null byte injection
        .replace(/[\x00-\x1F\x7F]/g, '')  // Control characters
        .replace(/\.\.[\/\\]/g, '')       // Directory traversal ../
        .replace(/[\/\\]/g, '_')          // Directory separators
        .trim();
      return safe || 'unnamed_artifact.txt';
    },

    /**
     * Validates a file before staging or processing.
     * @param {{ name: string, size: number, type?: string }} file
     * @returns {{ valid: boolean, error?: string }}
     */
    validateFile(file) {
      if (!file) return { valid: false, error: 'File is missing or null.' };

      const safeName = this.sanitizeFilename(file.name);
      const extMatch = safeName.match(/\.[a-zA-Z0-9]+$/);
      const ext = extMatch ? extMatch[0].toLowerCase() : '';

      // Check forbidden executable or script extensions
      if (FORBIDDEN_EXTENSIONS.includes(ext)) {
        return {
          valid: false,
          error: `Executable or script extension (${ext}) is blocked for safety. Only security logs, scans, and images are permitted.`
        };
      }

      // Check allowed extension list
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return {
          valid: false,
          error: `Extension "${ext}" is not permitted. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`
        };
      }

      // Check file size quota
      if (file.size > MAX_FILE_SIZE) {
        return {
          valid: false,
          error: `File "${safeName}" exceeds the 5MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`
        };
      }

      return { valid: true };
    },

    /**
     * Validates a batch of files for staging.
     * @param {Array<{ name: string, size: number }>} files
     * @param {number} currentStagedCount
     * @returns {{ valid: boolean, error?: string }}
     */
    validateBatch(files, currentStagedCount = 0) {
      if (!Array.isArray(files) || files.length === 0) {
        return { valid: false, error: 'No files provided.' };
      }

      if (currentStagedCount + files.length > MAX_FILE_COUNT) {
        return {
          valid: false,
          error: `Maximum ${MAX_FILE_COUNT} files allowed per message (currently staged: ${currentStagedCount}).`
        };
      }

      let totalBytes = 0;
      for (const f of files) {
        const check = this.validateFile(f);
        if (!check.valid) return check;
        totalBytes += f.size;
      }

      if (totalBytes > MAX_TOTAL_SIZE) {
        return {
          valid: false,
          error: `Total attachment batch size exceeds 15MB limit (${(totalBytes / (1024 * 1024)).toFixed(1)}MB).`
        };
      }

      return { valid: true };
    },

    /**
     * Validates a custom endpoint URL to prevent SSRF against cloud metadata.
     * @param {string} urlStr
     * @returns {{ valid: boolean, error?: string, isLocal: boolean }}
     */
    validateEndpointUrl(urlStr) {
      if (!urlStr || typeof urlStr !== 'string') {
        return { valid: false, error: 'Endpoint URL is required.' };
      }

      const trimmed = urlStr.trim();
      let parsed;
      try {
        parsed = new URL(trimmed);
      } catch (e) {
        return { valid: false, error: 'Invalid URL format. Must start with http:// or https://' };
      }

      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return { valid: false, error: 'Only http:// and https:// protocols are supported.' };
      }

      const hostname = parsed.hostname.toLowerCase();

      // Check SSRF blocklist
      for (const blocked of BLOCKED_SSRF_HOSTS) {
        if (hostname === blocked || hostname.endsWith('.' + blocked)) {
          return { valid: false, error: `Access to metadata endpoint (${hostname}) is forbidden by security policy.` };
        }
      }

      const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
      return { valid: true, isLocal };
    },

    /**
     * Escapes HTML entities to prevent Cross-Site Scripting (XSS).
     * @param {string} str
     * @returns {string}
     */
    escapeHTML(str) {
      if (!str || typeof str !== 'string') return '';
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityValidator;
  } else {
    root.SecurityValidator = SecurityValidator;
  }
})(typeof window !== 'undefined' ? window : global);
