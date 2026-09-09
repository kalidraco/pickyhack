/**
 * PickyHack — Risk & Safety Consent Engine
 * Evaluates operational risk levels (READ, LOW, MEDIUM, HIGH, CRITICAL)
 * and enforces operator approval policies (ask, allow, deny, session).
 */
(function(root) {
  'use strict';

  const RiskLevels = {
    READ: 'READ',
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
    CRITICAL: 'CRITICAL'
  };

  const Policies = {
    ASK: 'ask',                     // Always require operator confirmation
    ALLOW: 'allow',                 // Pre-approved
    DENY: 'deny',                   // Strictly blocked
    ALLOW_ONCE: 'allow_once',       // Approved for this single turn
    ALLOW_SESSION: 'allow_session'  // Approved for current session
  };

  // High-risk patterns in shell commands
  const DANGEROUS_PATTERNS = [
    { regex: /\b(rm\s+-rf|dd\s+if=|mkfs|wipefs)\b/i, risk: 'CRITICAL', reason: 'Destructive filesystem operation' },
    { regex: /\b(nc\s+-e|bash\s+-i|sh\s+-i|\/bin\/sh|\/bin\/bash|reverse[-_]shell)\b/i, risk: 'CRITICAL', reason: 'Interactive or reverse shell payload' },
    { regex: /\b(sqlmap|sqli)\b/i, risk: 'MEDIUM', reason: 'Active database extraction attempt' },
    { regex: /\b(hydra|medusa|crowbar|patator)\b/i, risk: 'HIGH', reason: 'Automated credential brute forcing' },
    { regex: /\b(exploit|metasploit|msfconsole|poc)\b/i, risk: 'HIGH', reason: 'Live exploit verification' }
  ];

  class RiskEngine {
    constructor(options = {}) {
      const defaultPol = options.defaultPolicy === 'ask' ? Policies.ASK : Policies.ALLOW;
      this.defaultPolicies = {
        [RiskLevels.READ]: Policies.ALLOW,
        [RiskLevels.LOW]: defaultPol,
        [RiskLevels.MEDIUM]: options.defaultPolicy === 'ask' ? Policies.ASK : Policies.ALLOW,
        [RiskLevels.HIGH]: Policies.ASK,
        [RiskLevels.CRITICAL]: Policies.ASK
      };
      this.sessionApprovals = new Set();
      this.auditLog = [];
    }

    classifyAction(toolName, params = {}) {
      const res = this.evaluateRisk(toolName, params);
      return {
        riskLevel: res.risk,
        risk: res.risk,
        reason: res.reason
      };
    }

    static classifyAction(toolName, params = {}) {
      return defaultRiskEngine.classifyAction(toolName, params);
    }

    /**
     * Assesses the risk level of an intended tool action and command.
     */
    evaluateRisk(toolName, params = {}) {
      let risk = RiskLevels.LOW;
      let reason = 'Standard reconnaissance action';

      const cmd = params.command || params.cmd || (params.flags ? `${toolName} ${params.flags}` : toolName);

      // Check tool-level defaults
      if (toolName === 'curl' || toolName === 'dns_lookup' || toolName === 'file_read') {
        risk = RiskLevels.READ;
        reason = 'Read-only network or system query';
      } else if (toolName === 'whatweb' || toolName === 'subfinder' || toolName === 'httpx') {
        risk = RiskLevels.LOW;
        reason = 'Standard network/service discovery';
      } else if (toolName === 'nmap' || toolName === 'ffuf' || toolName === 'gobuster') {
        risk = RiskLevels.MEDIUM;
        reason = 'Active port scan or directory fuzzing';
      } else if (toolName === 'nuclei') {
        risk = RiskLevels.HIGH;
        reason = 'Active vulnerability template scanning and exploit verification';
      } else if (toolName === 'shell') {
        risk = RiskLevels.HIGH;
        reason = 'Arbitrary terminal command execution';
      }

      // Check pattern overrides
      if (typeof cmd === 'string') {
        for (const pattern of DANGEROUS_PATTERNS) {
          if (pattern.regex.test(cmd)) {
            risk = pattern.risk;
            reason = pattern.reason;
            break;
          }
        }
      }

      return { risk, reason };
    }

    /**
     * Checks if operator approval is required before execution.
     * @returns {{ allowed: boolean, requiresApproval: boolean, policy: string, risk: string, reason: string }}
     */
    checkConsent(toolName, params = {}) {
      const { risk, reason } = this.evaluateRisk(toolName, params);
      const actionKey = `${toolName}:${JSON.stringify(params)}`;

      // Check if approved for session
      if (this.sessionApprovals.has(actionKey) || this.sessionApprovals.has(toolName)) {
        this.logDecision(toolName, params, risk, 'ALLOW_SESSION_GRANTED', true);
        return { allowed: true, requiresApproval: false, policy: Policies.ALLOW_SESSION, risk, reason };
      }

      const policy = this.defaultPolicies[risk] || Policies.ASK;

      if (policy === Policies.ALLOW) {
        this.logDecision(toolName, params, risk, 'AUTO_ALLOWED', true);
        return { allowed: true, requiresApproval: false, policy, risk, reason };
      }

      if (policy === Policies.DENY) {
        this.logDecision(toolName, params, risk, 'DENIED_BY_POLICY', false);
        return { allowed: false, requiresApproval: false, policy, risk, reason };
      }

      // Requires explicit operator approval
      this.logDecision(toolName, params, risk, 'PENDING_OPERATOR_CONSENT', false);
      return {
        allowed: false,
        requiresApproval: true,
        policy: Policies.ASK,
        risk,
        reason
      };
    }

    evaluate(toolName, params = {}) {
      return this.checkConsent(toolName, params);
    }

    grantSessionApproval(toolNameOrPattern) {
      this.sessionApprovals.add(toolNameOrPattern);
    }

    approveAction(toolName, params = {}, scope = 'once') {
      const actionKey = `${toolName}:${JSON.stringify(params)}`;
      if (scope === 'session') {
        this.sessionApprovals.add(actionKey);
      }
      this.logDecision(toolName, params, 'OPERATOR_APPROVED', `APPROVED_${scope.toUpperCase()}`, true);
    }

    logDecision(tool, params, risk, action, allowed) {
      this.auditLog.push({
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        timestamp: new Date().toISOString(),
        tool,
        action: tool,
        params,
        risk,
        decision: action,
        allowed
      });
    }

    getAuditLog() {
      return [...this.auditLog];
    }

    getAuditTrail() {
      return this.getAuditLog();
    }
  }

  const defaultRiskEngine = new RiskEngine();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RiskEngine, defaultRiskEngine, RiskLevels, Policies };
  }
  root.PickyRiskEngine = defaultRiskEngine;
})(typeof window !== 'undefined' ? window : global);
