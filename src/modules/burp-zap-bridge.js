/**
 * PickyHack — Automated Burp Suite / OWASP ZAP Ingestion Bridge
 * Ingests proxy XML/JSON exports, calculates EPS exploitability scores,
 * and merges vulnerabilities into the active Findings Registry.
 */
(function(root) {
  'use strict';

  const BurpZapBridge = {
    stagedIssues: [],

    init() {
      const btnOpen = document.getElementById('btn-open-burp-zap-import');
      const btnFromChat = document.getElementById('btn-open-burp-from-chat');
      const menuBurp = document.getElementById('chat-menu-burp');
      const fileInput = document.getElementById('burp-zap-file-input');
      const dropzone = document.getElementById('burp-zap-dropzone');
      const btnSampleBurp = document.getElementById('btn-load-sample-burp');
      const btnSampleZap = document.getElementById('btn-load-sample-zap');
      const btnCommit = document.getElementById('btn-commit-burp-zap');

      if (btnOpen) btnOpen.addEventListener('click', () => root.WindowManager.open('win-burp-zap-import'));
      if (btnFromChat) btnFromChat.addEventListener('click', () => root.WindowManager.open('win-burp-zap-import'));
      if (menuBurp) menuBurp.addEventListener('click', () => root.WindowManager.open('win-burp-zap-import'));

      if (dropzone && fileInput) {
        dropzone.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => {
          if (e.target.files && e.target.files[0]) {
            this.handleFile(e.target.files[0]);
          }
        });
      }

      if (btnSampleBurp) btnSampleBurp.addEventListener('click', () => this.loadSampleBurp());
      if (btnSampleZap) btnSampleZap.addEventListener('click', () => this.loadSampleZap());
      if (btnCommit) btnCommit.addEventListener('click', () => this.commitToFindings());
    },

    handleFile(file) {
      if (root.SecurityValidator) {
        const check = root.SecurityValidator.validateFile(file);
        if (!check.valid) {
          alert(`[Security Alert] ${check.error}`);
          return;
        }
      }

      const reader = new FileReader();
      reader.onload = (e) => this.parseReport(e.target.result);
      reader.readAsText(file);
    },

    parseReport(raw) {
      const trimmed = (raw || '').trim();
      let parsed = [];

      if (trimmed.startsWith('<') && (trimmed.includes('<issue') || trimmed.includes('<issues'))) {
        parsed = this.parseBurpXml(trimmed);
      } else if (trimmed.startsWith('{') && trimmed.includes('site')) {
        parsed = this.parseZapJson(trimmed);
      } else if (trimmed.startsWith('{') && trimmed.includes('issues')) {
        parsed = this.parseBurpJson(trimmed);
      } else {
        parsed = this.parseBurpXml(trimmed);
      }

      if (parsed.length === 0) {
        alert('Could not parse any vulnerability issues from this file. Expected Burp XML/JSON or OWASP ZAP JSON.');
        return;
      }

      this.stagedIssues = parsed;
      this.renderTable();
    },

    parseBurpXml(xml) {
      const issues = [];
      const issueRegex = /<issue>([\s\S]*?)<\/issue>/gi;
      let match;

      while ((match = issueRegex.exec(xml)) !== null) {
        const block = match[1];
        const nameMatch = block.match(/<name>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/name>/i);
        const hostMatch = block.match(/<host[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/host>/i);
        const pathMatch = block.match(/<path>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/path>/i);
        const sevMatch = block.match(/<severity>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/severity>/i);

        const name = nameMatch ? nameMatch[1].trim() : 'Burp Discovered Vulnerability';
        const host = hostMatch ? hostMatch[1].trim() : 'Target';
        const path = pathMatch ? pathMatch[1].trim() : '/';
        const sev = sevMatch ? sevMatch[1].trim() : 'Medium';

        let cvss = 6.5;
        if (sev.toLowerCase() === 'high') cvss = 8.5;
        if (sev.toLowerCase() === 'critical') cvss = 9.8;
        if (sev.toLowerCase() === 'low') cvss = 4.0;

        issues.push({
          id: `burp-${Date.now()}-${issues.length}`,
          title: name,
          cve: name.includes('CVE-') ? (name.match(/CVE-\d{4}-\d+/i) || [''])[0] : 'N/A',
          target: `${host}${path}`,
          severity: sev,
          cvss,
          eps: Math.min(99, Math.round(cvss * 10)),
          source: 'Burp Suite'
        });
      }

      return issues;
    },

    parseZapJson(jsonStr) {
      const issues = [];
      try {
        const data = JSON.parse(jsonStr);
        const sites = data.site || (Array.isArray(data) ? data : [data]);
        sites.forEach(site => {
          const alerts = site.alerts || [];
          alerts.forEach(al => {
            const risk = al.riskdesc ? al.riskdesc.split(' ')[0] : (al.risk || 'Medium');
            let cvss = 6.5;
            if (risk.toLowerCase() === 'high') cvss = 8.5;
            if (risk.toLowerCase() === 'critical') cvss = 9.8;
            if (risk.toLowerCase() === 'low') cvss = 4.0;

            issues.push({
              id: `zap-${Date.now()}-${issues.length}`,
              title: al.alert || al.name || 'OWASP ZAP Finding',
              cve: al.cve || 'N/A',
              target: al.instances && al.instances[0] ? al.instances[0].uri : site['@name'] || 'Target',
              severity: risk,
              cvss,
              eps: Math.min(99, Math.round(cvss * 10)),
              source: 'OWASP ZAP'
            });
          });
        });
      } catch (e) {
        console.warn('ZAP parse error:', e);
      }
      return issues;
    },

    loadSampleBurp() {
      const sample = `<?xml version="1.0" encoding="UTF-8"?>
<issues burpVersion="2024.1">
  <issue>
    <name>OS Command Injection (CVE-2024-3400)</name>
    <host ip="198.51.100.10">https://vpn.megacorp.internal</host>
    <path>/ssl-vpn/hipreport.esp</path>
    <severity>High</severity>
  </issue>
  <issue>
    <name>Cross-Site Scripting (Reflected)</name>
    <host ip="198.51.100.15">https://api.megacorp.internal</host>
    <path>/search</path>
    <severity>Medium</severity>
  </issue>
</issues>`;
      this.parseReport(sample);
    },

    loadSampleZap() {
      const sample = JSON.stringify({
        site: [{
          "@name": "https://api.megacorp.internal",
          alerts: [
            {
              alert: "SQL Injection - SQLite/PostgreSQL",
              riskdesc: "High (Certain)",
              cve: "CVE-2023-38606",
              instances: [{ uri: "https://api.megacorp.internal/v1/auth/token" }]
            }
          ]
        }]
      });
      this.parseReport(sample);
    },

    renderTable() {
      const tbody = document.getElementById('burp-zap-table-body');
      const countEl = document.getElementById('burp-zap-parsed-count');
      if (!tbody) return;

      tbody.innerHTML = '';
      if (countEl) countEl.textContent = `${this.stagedIssues.length} issues staged`;

      this.stagedIssues.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><input type="checkbox" checked class="burp-issue-check" data-id="${item.id}"></td>
          <td><strong>${item.title}</strong></td>
          <td><span class="severity-pill sev-${item.severity.toLowerCase()}">${item.severity}</span></td>
          <td><code>${item.eps}/100</code></td>
          <td style="font-family:monospace;font-size:11px;">${item.target}</td>
          <td>${item.source}</td>
        `;
        tbody.appendChild(tr);
      });
    },

    commitToFindings() {
      if (this.stagedIssues.length === 0) {
        alert('No staged issues to import.');
        return;
      }

      const checks = document.querySelectorAll('.burp-issue-check:checked');
      const selectedIds = Array.from(checks).map(c => c.dataset.id);
      const selected = this.stagedIssues.filter(i => selectedIds.includes(i.id));

      if (selected.length === 0) {
        alert('Please select at least one issue to import.');
        return;
      }

      selected.forEach(issue => {
        if (root.ProjectState) {
          root.ProjectState.addFinding({
            title: issue.title,
            cve: issue.cve,
            target: issue.target,
            severity: issue.severity,
            cvss: issue.cvss,
            eps: issue.eps,
            status: 'Validated',
            poc: `Discovered via ${issue.source} automated crawl: ${issue.target}`
          });
        }
      });

      alert(`[Success] Imported ${selected.length} vulnerabilities into the Findings Registry.`);
      root.WindowManager.open('win-findings');
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = BurpZapBridge;
  } else {
    root.BurpZapBridge = BurpZapBridge;
  }
})(typeof window !== 'undefined' ? window : global);
