/**
 * PickyHack — Legacy Entrypoint Shim
 * 
 * The PickyHack codebase has been refactored into a clean, developer-friendly
 * modular architecture under the src/ directory:
 *   - src/config/     : Application configuration & universal provider catalog
 *   - src/core/       : Reactive project state, stateless context engine, snapshots
 *   - src/security/   : Secret sanitizer, input validator, SSRF & traversal guards
 *   - src/providers/  : Universal AI provider registry, model discovery, adapters
 *   - src/modules/    : Pentest modules (Graph simulation, Token pruner, Burp bridge, Deliverables, Notes)
 *   - src/ui/         : Retro Windows 98 desktop, windows manager, popovers, chat UI
 *   - src/backend/    : Local development and mock vulnerability intelligence server
 * 
 * @see src/app.js
 */
(function() {
  'use strict';
  if (typeof console !== 'undefined' && console.info) {
    console.info('[PickyHack] Core architecture loaded from modular src/ pipeline.');
  }
})();
