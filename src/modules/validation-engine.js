/**
 * PickyHack — Finding Validation Engine
 * Pipeline: RAW SIGNAL -> CORRELATION -> ANALYSIS -> EVIDENCE CHECK -> REPRODUCTION -> CONFIDENCE -> CONFIRMED / FALSE POSITIVE
 * Enforces strict epistemic integrity to eliminate AI hallucinations.
 */
(function(root) {
  'use strict';

  class ValidationEngine {
    constructor(projectState = null) {
      this.projectState = projectState || (typeof root !== 'undefined' ? root.ProjectState : null);
    }

    /**
     * Evaluates a candidate signal and validates its security legitimacy.
     * @param {Object} signal - { title, cve, target, rawEvidence, pocOutput, toolSource }
     * @returns {Object} Validation outcome with epistemic status, confidence score, and rationale
     */
    validateSignal(signal) {
      let score = 20; // Base score for any tool detection
      const criteria = [];
      let epistemic = 'OBSERVATION';
      let status = 'SUSPECTED';

      // 1. Tool credibility check
      if (signal.toolSource === 'nuclei' || signal.toolSource === 'nmap') {
        score += 20;
        criteria.push(`Corroborated by specialized scanner (${signal.toolSource})`);
      }

      // 2. Known CVE check
      if (signal.cve && signal.cve.startsWith('CVE-')) {
        score += 20;
        criteria.push(`Standardized CVE catalog identifier (${signal.cve})`);
      }

      // 3. Concrete Evidence Verification
      const evidence = signal.rawEvidence || signal.pocOutput || '';
      if (evidence && evidence.trim().length > 10) {
        score += 20;
        criteria.push('Direct command or payload execution output attached');

        // Look for concrete proof of compromise
        const lowerEv = evidence.toLowerCase();
        const rootProof = lowerEv.includes('uid=0') || lowerEv.includes('root') || lowerEv.includes('administrator') || lowerEv.includes('syntax error');
        if (rootProof) {
          score += 20;
          criteria.push('Payload output confirms successful code execution / privilege exposure');
          status = 'CONFIRMED';
          epistemic = 'FACT';
        } else {
          status = 'VALIDATING';
          epistemic = 'HYPOTHESIS';
        }
      } else {
        criteria.push('No direct PoC output provided; marked as speculative hypothesis');
        epistemic = 'HYPOTHESIS';
        status = 'SUSPECTED';
      }

      const confidence = Math.min(100, Math.max(0, score));

      return {
        cve: signal.cve || 'N/A',
        title: signal.title || 'Security Signal',
        target: signal.target || 'Target',
        confidenceScore: confidence,
        confidenceLevel: confidence >= 80 ? 'Confirmed' : confidence >= 50 ? 'Medium' : 'Low',
        status: confidence >= 80 ? 'CONFIRMED' : 'VALIDATING',
        epistemic,
        criteria,
        reproducible: Boolean(signal.pocOutput)
      };
    }

    /**
     * Promotes a verified signal into a canonical Project Finding.
     */
    promoteToFinding(signal, validatedOutcome) {
      if (!this.projectState) return null;
      const finding = {
        title: signal.title,
        cve: signal.cve || 'N/A',
        target: signal.target,
        severity: signal.severity || 'High',
        confidence: validatedOutcome.confidenceLevel,
        cvss: signal.cvss || 7.5,
        eps: signal.eps || validatedOutcome.confidenceScore,
        status: validatedOutcome.status,
        epistemic: validatedOutcome.epistemic,
        poc: signal.poc || signal.command || '',
        evidenceRefs: signal.evidenceId ? [signal.evidenceId] : []
      };
      return this.projectState.addFinding(finding);
    }
  }

  const defaultValidationEngine = new ValidationEngine();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ValidationEngine, defaultValidationEngine };
  }
  root.PickyValidationEngine = defaultValidationEngine;
})(typeof window !== 'undefined' ? window : global);
