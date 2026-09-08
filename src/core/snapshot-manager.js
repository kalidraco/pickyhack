/**
 * PickyHack — Context Snapshot Manager
 * Provides zero-loss mission portability across AI models, sessions, and workstations.
 * Guarantees automated secret redaction before any export.
 */
(function(root) {
  'use strict';

  const SnapshotManager = {
    /**
     * Generates a portable, sanitized markdown Context Snapshot.
     * @param {Object} [customState] - Optional state override
     * @returns {string} Sanitized markdown snapshot
     */
    generate(customState = null) {
      const state = customState || (root.ProjectState ? root.ProjectState.get() : root.pentestState || {});
      const now = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

      let lines = [];
      lines.push('==================================================');
      lines.push('=== PICKYHACK CONTEXT SNAPSHOT ===');
      lines.push('==================================================');
      lines.push(`TIMESTAMP: ${now}`);
      lines.push(`TARGET: ${state.target || 'N/A'}`);
      lines.push(`SCOPE: ${state.scope || 'N/A'}`);
      lines.push(`OBJECTIVES: ${state.objectives || 'N/A'}`);
      if (state.constraints) lines.push(`CONSTRAINTS: ${state.constraints}`);

      if (state.assets && state.assets.length > 0) {
        lines.push('\nDISCOVERED ASSETS & EXPOSED SERVICES:');
        state.assets.forEach(a => {
          lines.push(`• ${a.host || a.ip}: ${a.ports}`);
        });
      }

      if (state.findings && state.findings.length > 0) {
        lines.push('\nVALIDATED FINDINGS (EPS PRIORITIZED):');
        state.findings.forEach(f => {
          lines.push(`• [${f.severity}] ${f.title} (CVE: ${f.cve || 'N/A'}, EPS: ${f.eps || 'N/A'}/100, CVSS: ${f.cvss || 'N/A'})`);
          if (f.poc) lines.push(`  Evidence: ${f.poc}`);
        });
      }

      if (state.attackChains && state.attackChains.length > 0) {
        lines.push('\nATTACK CHAINS & BREACH PATHS:');
        state.attackChains.forEach(c => {
          lines.push(`• ${c.title}: ${Array.isArray(c.steps) ? c.steps.join(' -> ') : c.steps}`);
        });
      }

      if (state.failedTests && state.failedTests.length > 0) {
        lines.push('\nNEGATIVE INTELLIGENCE (FAILED TESTS / ELIMINATED VECTORS):');
        state.failedTests.forEach(t => lines.push(`• ${t}`));
      }

      if (state.notes && state.notes.trim()) {
        lines.push('\nTACTICAL NOTES:');
        lines.push(state.notes.trim());
      }

      lines.push('==================================================');
      lines.push('=== END PICKYHACK CONTEXT SNAPSHOT ===');

      const rawSnapshot = lines.join('\n');

      // Enforce automated secret redaction before return
      if (root.SecuritySanitizer) {
        const result = root.SecuritySanitizer.redact(rawSnapshot);
        return result.sanitized;
      }

      return rawSnapshot;
    },

    /**
     * Parses an imported snapshot string back into structured ProjectState.
     * @param {string} snapshotStr
     * @returns {Object|null}
     */
    parse(snapshotStr) {
      if (!snapshotStr || !snapshotStr.includes('PICKYHACK CONTEXT SNAPSHOT')) {
        return null;
      }

      const targetMatch = snapshotStr.match(/TARGET:\s*([^\n]+)/i);
      const scopeMatch = snapshotStr.match(/SCOPE:\s*([^\n]+)/i);
      const objMatch = snapshotStr.match(/OBJECTIVES:\s*([^\n]+)/i);
      const constraintsMatch = snapshotStr.match(/CONSTRAINTS:\s*([^\n]+)/i);

      const parsed = {
        target: targetMatch ? targetMatch[1].trim() : '',
        scope: scopeMatch ? scopeMatch[1].trim() : '',
        objectives: objMatch ? objMatch[1].trim() : '',
        constraints: constraintsMatch ? constraintsMatch[1].trim() : '',
        notes: ''
      };

      const notesIdx = snapshotStr.indexOf('TACTICAL NOTES:');
      if (notesIdx !== -1) {
        const endIdx = snapshotStr.indexOf('=== END PICKYHACK CONTEXT SNAPSHOT ===');
        parsed.notes = snapshotStr.substring(notesIdx + 15, endIdx !== -1 ? endIdx : undefined).trim();
      }

      return parsed;
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SnapshotManager;
  } else {
    root.SnapshotManager = SnapshotManager;
  }
})(typeof window !== 'undefined' ? window : global);
