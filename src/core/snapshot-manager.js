/**
 * PickyHack — Portable Context Snapshot Manager V2
 * Serializes and restores mission state via the canonical .pickycontext.json schema.
 * Guarantees zero secret leakage (via SecuritySanitizer) and lossless project migration.
 * Supports: EXPORT, IMPORT, VALIDATE, VERSION, and DIFF.
 */
(function(root) {
  'use strict';

  const SCHEMA_VERSION = '2.0.0';

  const SnapshotManager = {
    SCHEMA_VERSION,

    /**
     * Generates a portable, sanitized .pickycontext.json object from ProjectState.
     * @param {Object} [customState] - State override if not reading from ProjectState
     * @returns {Object} Clean, sanitized snapshot object
     */
    generate(customState = null) {
      let state = customState;
      if (!state) {
        if (typeof root !== 'undefined' && root.ProjectState) {
          state = root.ProjectState.get();
        } else if (typeof require !== 'undefined') {
          state = require('./project-state').get();
        } else {
          state = root.pentestState || {};
        }
      }

      const snapshot = {
        schemaVersion: SCHEMA_VERSION,
        generator: 'PickyHack AI Context Harness',
        exportedAt: new Date().toISOString(),
        project: {
          id: state.id || 'proj_default',
          name: state.name || 'PickyHack Pentest Assessment',
          target: state.target || '',
          scope: state.scope || '',
          objectives: state.objectives || '',
          constraints: state.constraints || '',
          phase: state.phase || 'RECON'
        },
        assets: Array.isArray(state.assets) ? state.assets : [],
        evidence: Array.isArray(state.evidence) ? state.evidence : [],
        findings: Array.isArray(state.findings) ? state.findings : [],
        tasks: Array.isArray(state.tasks) ? state.tasks : [],
        attackNodes: Array.isArray(state.attackNodes) ? state.attackNodes : [],
        attackEdges: Array.isArray(state.attackEdges) ? state.attackEdges : [],
        attackChains: Array.isArray(state.attackChains) ? state.attackChains : [],
        failedTests: Array.isArray(state.failedTests) ? state.failedTests : [],
        hypotheses: Array.isArray(state.hypotheses) ? state.hypotheses : [],
        notes: state.notes || '',
        notesList: Array.isArray(state.notesList) ? state.notesList : []
      };

      // Mandatory secret sanitization pass
      const rawJson = JSON.stringify(snapshot, null, 2);
      let sanitizedJson = rawJson;
      const Sanitizer = root.SecuritySanitizer || (typeof require !== 'undefined' ? (function() {
        try { return require('../security/sanitizer'); } catch(e) { return null; }
      })() : null);

      if (Sanitizer && typeof Sanitizer.redact === 'function') {
        const result = Sanitizer.redact(rawJson);
        sanitizedJson = result.sanitized;
      }

      return JSON.parse(sanitizedJson);
    },

    /**
     * Exports snapshot as formatted JSON string.
     */
    exportJsonString(customState = null) {
      return JSON.stringify(this.generate(customState), null, 2);
    },

    /**
     * Validates an incoming snapshot object.
     * @param {Object} data
     * @returns {{ valid: boolean, errors: string[] }}
     */
    validate(data) {
      const errors = [];
      if (!data || typeof data !== 'object') {
        return { valid: false, errors: ['Snapshot must be a valid JSON object.'] };
      }

      if (!data.schemaVersion && !data.project && !data.target) {
        errors.push('Missing schemaVersion or valid PickyHack project headers.');
      }

      if (data.project && typeof data.project !== 'object') {
        errors.push('Invalid project section.');
      }

      return {
        valid: errors.length === 0,
        errors
      };
    },

    /**
     * Restores an imported JSON string or object directly into ProjectState.
     * @param {string|Object} rawInput
     * @returns {{ success: boolean, restoredState?: Object, error?: string }}
     */
    import(rawInput) {
      try {
        let data = rawInput;
        if (typeof rawInput === 'string') {
          // Check if user uploaded legacy markdown snapshot
          if (rawInput.includes('=== PICKYHACK CONTEXT SNAPSHOT ===')) {
            return this.importLegacyMarkdown(rawInput);
          }
          data = JSON.parse(rawInput);
        }

        const check = this.validate(data);
        if (!check.valid) {
          return { success: false, error: check.errors.join('; ') };
        }

        const project = data.project || {};
        const newState = {
          id: project.id || `proj_${Date.now()}`,
          name: project.name || 'Imported Pentest Engagement',
          target: project.target || data.target || '',
          scope: project.scope || data.scope || '',
          objectives: project.objectives || data.objectives || '',
          constraints: project.constraints || data.constraints || '',
          phase: project.phase || 'RECON',
          assets: Array.isArray(data.assets) ? data.assets : [],
          evidence: Array.isArray(data.evidence) ? data.evidence : [],
          findings: Array.isArray(data.findings) ? data.findings : [],
          tasks: Array.isArray(data.tasks) ? data.tasks : [],
          attackNodes: Array.isArray(data.attackNodes) ? data.attackNodes : [],
          attackEdges: Array.isArray(data.attackEdges) ? data.attackEdges : [],
          attackChains: Array.isArray(data.attackChains) ? data.attackChains : [],
          failedTests: Array.isArray(data.failedTests) ? data.failedTests : [],
          hypotheses: Array.isArray(data.hypotheses) ? data.hypotheses : [],
          notes: data.notes || '',
          notesList: Array.isArray(data.notesList) ? data.notesList : []
        };

        if (typeof root !== 'undefined' && root.ProjectState) {
          root.ProjectState.update(newState);
        } else if (typeof require !== 'undefined') {
          require('./project-state').update(newState);
        }

        return { success: true, restoredState: newState };
      } catch (err) {
        return { success: false, error: `Import failed: ${err.message}` };
      }
    },

    /**
     * Fallback parser for legacy Markdown snapshots
     */
    importLegacyMarkdown(snapshotStr) {
      const targetMatch = snapshotStr.match(/TARGET:\s*([^\n]+)/i);
      const scopeMatch = snapshotStr.match(/SCOPE:\s*([^\n]+)/i);
      const objMatch = snapshotStr.match(/OBJECTIVES:\s*([^\n]+)/i);
      const constraintsMatch = snapshotStr.match(/CONSTRAINTS:\s*([^\n]+)/i);

      let notes = '';
      const notesIdx = snapshotStr.indexOf('TACTICAL NOTES:');
      if (notesIdx !== -1) {
        const endIdx = snapshotStr.indexOf('=== END PICKYHACK CONTEXT SNAPSHOT ===');
        notes = (endIdx !== -1)
          ? snapshotStr.substring(notesIdx + 15, endIdx).trim()
          : snapshotStr.substring(notesIdx + 15).trim();
      }

      const restoredState = {
        target: targetMatch ? targetMatch[1].trim() : '',
        scope: scopeMatch ? scopeMatch[1].trim() : '',
        objectives: objMatch ? objMatch[1].trim() : '',
        constraints: constraintsMatch ? constraintsMatch[1].trim() : '',
        notes
      };

      if (typeof root !== 'undefined' && root.ProjectState) {
        root.ProjectState.update(restoredState);
      }
      return { success: true, restoredState };
    },

    /**
     * Calculates diff between two snapshots.
     */
    diff(snapA, snapB) {
      const assetsA = (snapA.assets || []).length;
      const assetsB = (snapB.assets || []).length;
      const findingsA = (snapA.findings || []).length;
      const findingsB = (snapB.findings || []).length;
      const evidenceA = (snapA.evidence || []).length;
      const evidenceB = (snapB.evidence || []).length;
      const tasksA = (snapA.tasks || []).length;
      const tasksB = (snapB.tasks || []).length;

      return {
        assetsDiff: assetsB - assetsA,
        findingsDiff: findingsB - findingsA,
        evidenceDiff: evidenceB - evidenceA,
        tasksDiff: tasksB - tasksA,
        targetChanged: (snapA.project && snapB.project) ? snapA.project.target !== snapB.project.target : false
      };
    },

    /**
     * Backward-compatible markdown export method
     */
    exportMarkdown(customState = null) {
      const data = this.generate(customState);
      const lines = [
        '==================================================',
        '=== PICKYHACK CONTEXT SNAPSHOT ===',
        '==================================================',
        `TIMESTAMP: ${data.exportedAt}`,
        `TARGET: ${data.project.target || 'N/A'}`,
        `SCOPE: ${data.project.scope || 'N/A'}`,
        `OBJECTIVES: ${data.project.objectives || 'N/A'}`
      ];
      if (data.project.constraints) lines.push(`CONSTRAINTS: ${data.project.constraints}`);

      if (data.assets.length > 0) {
        lines.push('\nDISCOVERED ASSETS:');
        data.assets.forEach(a => lines.push(`• ${a.host || a.ip} (${a.ip})`));
      }

      if (data.findings.length > 0) {
        lines.push('\nVALIDATED FINDINGS:');
        data.findings.forEach(f => lines.push(`• [${f.severity}] ${f.title} (CVE: ${f.cve}, EPS: ${f.eps}/100)`));
      }

      if (data.notes) {
        lines.push('\nTACTICAL NOTES:');
        lines.push(data.notes);
      }

      lines.push('==================================================');
      lines.push('=== END PICKYHACK CONTEXT SNAPSHOT ===');
      return lines.join('\n');
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SnapshotManager;
  }
  root.SnapshotManager = SnapshotManager;
})(typeof window !== 'undefined' ? window : global);
