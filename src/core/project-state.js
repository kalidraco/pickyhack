/**
 * PickyHack — Reactive Project State Registry
 * Tracks targets, scope, verified findings, attack paths, and notes.
 * Completely decoupled from ephemeral chat sessions.
 */
(function(root) {
  'use strict';

  const STORAGE_KEY = 'pickyhack_project_state';

  const defaultState = {
    target: '',
    scope: '',
    objectives: '',
    constraints: '',
    assets: [],
    findings: [],
    attackChains: [],
    failedTests: [],
    notes: ''
  };

  const sampleDemoState = {
    target: 'vpn.megacorp.internal',
    scope: '198.51.100.0/24, *.megacorp.internal (Excl: hr-portal.megacorp.internal)',
    objectives: 'Perimeter penetration, internal network pivot, Active Directory domain compromise.',
    constraints: 'No DoS, testing allowed Mon-Fri 08:00-18:00 UTC, maintain stealth.',
    assets: [
      { ip: '198.51.100.10', host: 'vpn.megacorp.internal', ports: '443/tcp (Palo Alto GlobalProtect PAN-OS 10.2.7)' },
      { ip: '198.51.100.15', host: 'api.megacorp.internal', ports: '80/tcp, 443/tcp (Kong API Gateway 3.4.0)' }
    ],
    findings: [
      {
        id: 'f-1',
        title: 'CVE-2024-3400 (PAN-OS GlobalProtect Command Injection)',
        cve: 'CVE-2024-3400',
        target: 'vpn.megacorp.internal:443',
        severity: 'Critical',
        cvss: 10.0,
        eps: 99,
        status: 'Validated',
        poc: 'curl -k -H "Cookie: SESSID=../../../../opt/panlogs/tmp/device_telemetry/minute/`whoami`" https://vpn.megacorp.internal/ssl-vpn/hipreport.esp'
      }
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
    notes: '2026-09-08 14:20 — Initial Nmap scan completed. Edge PAN-OS confirmed.\n2026-09-08 15:05 — Exploit CVE-2024-3400 verified via out-of-band DNS callback.'
  };

  const memoryStore = {};
  const safeStorage = {
    getItem(key) {
      if (typeof localStorage !== 'undefined') {
        try { return localStorage.getItem(key); } catch(e) { return null; }
      }
      return memoryStore[key] !== undefined ? memoryStore[key] : null;
    },
    setItem(key, val) {
      if (typeof localStorage !== 'undefined') {
        try { localStorage.setItem(key, val); return; } catch(e) {}
      }
      memoryStore[key] = String(val);
    },
    removeItem(key) {
      if (typeof localStorage !== 'undefined') {
        try { localStorage.removeItem(key); return; } catch(e) {}
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
        const raw = safeStorage.getItem(STORAGE_KEY);
        if (raw) {
          this.state = JSON.parse(raw);
          return this.state;
        }
      } catch (e) {
        console.warn('Could not load project state, falling back to defaults:', e);
      }
      this.state = JSON.parse(JSON.stringify(defaultState));
      return this.state;
    },

    save() {
      try {
        safeStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
        this.notify();
      } catch (e) {
        console.warn('Could not save project state to localStorage:', e);
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
    },

    addFinding(finding) {
      if (!this.state) this.load();
      if (!this.state.findings) this.state.findings = [];
      const newFinding = {
        id: finding.id || `f-${Date.now()}`,
        title: finding.title || 'Untitled Finding',
        cve: finding.cve || 'N/A',
        target: finding.target || this.state.target || 'Target',
        severity: finding.severity || 'Medium',
        cvss: finding.cvss || 6.5,
        eps: finding.eps || 70,
        status: finding.status || 'Discovered',
        poc: finding.poc || ''
      };
      this.state.findings.push(newFinding);
      this.save();
      return newFinding;
    },

    removeFinding(id) {
      if (!this.state || !this.state.findings) return;
      this.state.findings = this.state.findings.filter(f => f.id !== id);
      this.save();
    },

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
        try { fn(this.state); } catch (e) { console.error('Listener error:', e); }
      });
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectState;
  }
  root.ProjectState = ProjectState;
  root.pentestState = ProjectState.get(); // Backward compatibility alias
})(typeof window !== 'undefined' ? window : global);
