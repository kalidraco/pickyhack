/**
 * PickyHack — Canonical Domain Models & Schemas
 * Strictly typed schema factories, validation, and epistemic classifications
 * for offensive security operations and the Context Harness.
 */
(function(root) {
  'use strict';

  // Epistemic Classification (Hallucination Control)
  const EpistemicStatus = {
    FACT: 'FACT',                   // Directly observed, validated truth (e.g., port 443 open)
    OBSERVATION: 'OBSERVATION',     // Raw tool output or telemetry signal
    INFERENCE: 'INFERENCE',         // Logical deduction from facts
    HYPOTHESIS: 'HYPOTHESIS',       // Testable security assumption requiring reproduction
    UNKNOWN: 'UNKNOWN'              // Unverified, speculative, or lacking evidence
  };

  // Pentest Lifecycle Phases
  const PentestPhase = {
    RECON: 'RECON',
    ENUMERATION: 'ENUMERATION',
    ANALYSIS: 'ANALYSIS',
    HYPOTHESIS: 'HYPOTHESIS',
    VALIDATION: 'VALIDATION',
    EXPLOITATION: 'EXPLOITATION',
    POST_EXPLOITATION: 'POST_EXPLOITATION',
    IMPACT: 'IMPACT',
    REPORTING: 'REPORTING'
  };

  // Task Execution Statuses
  const TaskStatus = {
    TODO: 'TODO',
    IN_PROGRESS: 'IN_PROGRESS',
    BLOCKED: 'BLOCKED',
    DONE: 'DONE',
    FAILED: 'FAILED',
    SKIPPED: 'SKIPPED'
  };

  // Finding Lifecycle Statuses
  const FindingStatus = {
    SUSPECTED: 'SUSPECTED',
    VALIDATING: 'VALIDATING',
    CONFIRMED: 'CONFIRMED',
    FALSE_POSITIVE: 'FALSE_POSITIVE',
    ACCEPTED: 'ACCEPTED',
    REMEDIATED: 'REMEDIATED'
  };

  // Risk Classification for Tool Actions
  const RiskLevel = {
    READ: 'READ',
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
    CRITICAL: 'CRITICAL'
  };

  // Note Categories
  const NoteCategory = {
    GENERAL: 'GENERAL',
    RECON: 'RECON',
    FINDING: 'FINDING',
    HYPOTHESIS: 'HYPOTHESIS',
    TODO: 'TODO',
    EVIDENCE: 'EVIDENCE',
    COMMAND: 'COMMAND'
  };

  /**
   * Helper to generate unique identifiers
   */
  function generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }

  const Models = {
    EpistemicStatus,
    PentestPhase,
    TaskStatus,
    FindingStatus,
    RiskLevel,
    NoteCategory,

    createProject(data = {}) {
      return {
        id: data.id || generateId('proj'),
        name: data.name || 'Untitled Engagement',
        target: data.target || '',
        scope: data.scope || '',
        objectives: data.objectives || '',
        constraints: data.constraints || '',
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    },

    createAsset(data = {}) {
      return {
        id: data.id || generateId('asset'),
        ip: data.ip || '',
        host: data.host || '',
        os: data.os || '',
        status: data.status || 'discovered',
        tags: Array.isArray(data.tags) ? data.tags : [],
        services: Array.isArray(data.services) ? data.services : []
      };
    },

    createService(data = {}) {
      return {
        id: data.id || generateId('svc'),
        assetId: data.assetId || '',
        port: parseInt(data.port, 10) || 0,
        protocol: (data.protocol || 'tcp').toLowerCase(),
        service: data.service || 'unknown',
        version: data.version || '',
        banner: data.banner || '',
        state: data.state || 'open', // open, closed, filtered
        tls: data.tls || false
      };
    },

    createEvidence(data = {}) {
      return {
        id: data.id || generateId('evi'),
        type: data.type || 'command_output', // command_output, http_response, screenshot, file, scan_dump
        title: data.title || 'Raw Evidence',
        sourceTool: data.sourceTool || 'manual',
        target: data.target || '',
        command: data.command || '',
        stdout: data.stdout || '',
        stderr: data.stderr || '',
        exitCode: data.exitCode !== undefined ? data.exitCode : 0,
        rawPayload: data.rawPayload || '',
        metadata: data.metadata || {},
        timestamp: data.timestamp || new Date().toISOString(),
        hash: data.hash || (data.stdout ? String(data.stdout.length) : '')
      };
    },

    createFinding(data = {}) {
      return {
        id: data.id || generateId('f'),
        title: data.title || 'Untitled Finding',
        severity: data.severity || 'Medium', // Low, Medium, High, Critical, Info
        confidence: data.confidence || 'Medium', // Low, Medium, High, Confirmed
        cve: data.cve || 'N/A',
        cwe: data.cwe || 'N/A',
        cvss: typeof data.cvss === 'number' ? data.cvss : (parseFloat(data.cvss) || 5.0),
        eps: typeof data.eps === 'number' ? data.eps : (parseInt(data.eps, 10) || 50),
        status: data.status || FindingStatus.SUSPECTED,
        affectedAsset: data.affectedAsset || '',
        affectedEndpoint: data.affectedEndpoint || '',
        evidenceRefs: Array.isArray(data.evidenceRefs) ? data.evidenceRefs : [],
        poc: data.poc || '',
        reproduction: data.reproduction || '',
        impact: data.impact || '',
        remediation: data.remediation || '',
        references: Array.isArray(data.references) ? data.references : [],
        discoveredBy: data.discoveredBy || 'PickyHack Agent',
        validatedBy: data.validatedBy || null,
        epistemic: data.epistemic || EpistemicStatus.INFERENCE,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    },

    createTask(data = {}) {
      return {
        id: data.id || generateId('task'),
        title: data.title || 'Untitled Task',
        description: data.description || '',
        phase: data.phase || PentestPhase.RECON,
        status: data.status || TaskStatus.TODO,
        priority: data.priority || 'MEDIUM', // LOW, MEDIUM, HIGH, CRITICAL
        parentId: data.parentId || null,
        dependencies: Array.isArray(data.dependencies) ? data.dependencies : [],
        evidenceRefs: Array.isArray(data.evidenceRefs) ? data.evidenceRefs : [],
        findingRefs: Array.isArray(data.findingRefs) ? data.findingRefs : [],
        hypotheses: Array.isArray(data.hypotheses) ? data.hypotheses : [],
        commands: Array.isArray(data.commands) ? data.commands : [],
        lastExecution: data.lastExecution || null,
        nextAction: data.nextAction || ''
      };
    },

    createAttackNode(data = {}) {
      return {
        id: data.id || generateId('node'),
        label: data.label || 'Network Node',
        type: data.type || 'host', // source, host, service, cred, vuln, crown
        target: data.target || '',
        vuln: data.vuln || null,
        cred: data.cred || null,
        crown: Boolean(data.crown),
        x: data.x || 100,
        y: data.y || 100
      };
    },

    createAttackEdge(data = {}) {
      return {
        id: data.id || generateId('edge'),
        from: data.from || '',
        to: data.to || '',
        action: data.action || 'DISCOVERS', // DISCOVERS, EXPLOITS, AUTHENTICATES, LEADS_TO, ESCALATES_TO, LATERAL_MOVES_TO, ACCESSES
        label: data.label || '',
        prob: typeof data.prob === 'number' ? data.prob : 0.75,
        evidenceRef: data.evidenceRef || null,
        confidence: data.confidence || 'Medium'
      };
    },

    createNote(data = {}) {
      return {
        id: data.id || generateId('note'),
        title: data.title || 'Untitled Note',
        content: data.content || '',
        category: data.category || NoteCategory.GENERAL,
        assetRef: data.assetRef || null,
        findingRef: data.findingRef || null,
        taskRef: data.taskRef || null,
        evidenceRefs: Array.isArray(data.evidenceRefs) ? data.evidenceRefs : [],
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    },

    createSecurityIntel(data = {}) {
      return {
        id: data.id || generateId('intel'),
        source: data.source || 'CISA KEV', // CISA KEV, NVD, ExploitDB, GitHub, Vendor
        identifier: data.identifier || '', // e.g. CVE-2024-3400
        affectedProducts: Array.isArray(data.affectedProducts) ? data.affectedProducts : [],
        affectedVersions: data.affectedVersions || '',
        severity: data.severity || 'High',
        exploitAvailable: Boolean(data.exploitAvailable),
        inTheWild: Boolean(data.inTheWild),
        description: data.description || '',
        references: Array.isArray(data.references) ? data.references : [],
        provenance: data.provenance || 'EXTERNAL_SOURCE', // KNOWN_FACT, EXTERNAL_SOURCE, LLM_INFERENCE
        dateAdded: data.dateAdded || new Date().toISOString()
      };
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Models;
  }
  root.PickyModels = Models;
})(typeof window !== 'undefined' ? window : global);
