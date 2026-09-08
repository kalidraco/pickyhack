/**
 * PickyHack — Centralized Application Configuration
 * Version: 2.0.0 (Universal Context Harness)
 */
(function(root) {
  'use strict';

  const AppConfig = {
    APP_NAME: 'PickyHack',
    VERSION: '2.0.0',
    TAGLINE: 'Stateless by default. Context-driven by design.',
    PHILOSOPHY: 'Your model. Your provider. Your context.',

    STORAGE_KEYS: {
      MULTI_API_ENGINES: 'pickyhack_multi_api_engines',
      ACTIVE_ENGINE_ID: 'pickyhack_active_engine_id',
      PROJECT_STATE: 'pickyhack_project_state',
      WIN_STATES: 'pickyhack_win_states',
      NOTES_TEXT: 'pickyhack_notes_content',
      CHAT_DRAFT: 'pickyhack_chat_draft'
    },

    SECURITY: {
      MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024,      // 5 MB per file
      MAX_TOTAL_UPLOAD_BYTES: 15 * 1024 * 1024,   // 15 MB total
      MAX_ATTACHMENT_COUNT: 5,
      ALLOWED_FILE_EXTENSIONS: [
        '.txt', '.log', '.xml', '.json', '.nmap', '.gnmap',
        '.yaml', '.yml', '.csv', '.md', '.png', '.jpg', '.jpeg', '.webp'
      ],
      FORBIDDEN_EXTENSIONS: [
        '.exe', '.bat', '.cmd', '.sh', '.ps1', '.vbs', '.php',
        '.py', '.jar', '.html', '.svg', '.dll', '.so', '.bin'
      ],
      BLOCKED_SSRF_HOSTS: [
        '169.254.169.254',           // AWS/GCP/Azure link-local metadata
        'metadata.google.internal',  // GCP metadata
        'instance-data'              // OpenStack metadata
      ]
    },

    DEFAULTS: {
      DEFAULT_PORT: 8088,
      DEFAULT_ROLE: 'Primary Analyst',
      DEFAULT_EPS_THRESHOLD: 70
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppConfig;
  } else {
    root.AppConfig = AppConfig;
  }
})(typeof window !== 'undefined' ? window : global);
