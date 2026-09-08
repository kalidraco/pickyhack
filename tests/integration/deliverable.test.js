/**
 * Integration Test: Ingestion Bridge to Formal Deliverable
 */
const assert = require('assert');
const BurpZapBridge = require('../../src/modules/burp-zap-bridge');
const DeliverableGenerator = require('../../src/modules/deliverable-generator');
const SecuritySanitizer = require('../../src/security/sanitizer');

console.log('--- Running tests/integration/deliverable.test.js ---');

// 1. Parse Burp XML
const sampleBurpXml = `<?xml version="1.0" encoding="UTF-8"?>
<issues burpVersion="2024.1">
  <issue>
    <name>OS Command Injection (CVE-2024-3400)</name>
    <host ip="198.51.100.10">https://vpn.megacorp.internal</host>
    <path>/ssl-vpn/hipreport.esp</path>
    <severity>High</severity>
  </issue>
</issues>`;

const burpIssues = BurpZapBridge.parseBurpXml(sampleBurpXml);
assert.strictEqual(burpIssues.length, 1, 'Should parse 1 Burp issue');
assert.strictEqual(burpIssues[0].cve, 'CVE-2024-3400');
assert.strictEqual(burpIssues[0].eps, 85);
console.log('[PASS] Burp XML parsed and assigned EPS 85/100.');

// 2. Parse OWASP ZAP JSON
const sampleZapJson = JSON.stringify({
  site: [{
    "@name": "https://api.megacorp.internal",
    alerts: [
      {
        alert: "SQL Injection",
        risk: "High",
        cve: "CVE-2023-38606",
        instances: [{ uri: "https://api.megacorp.internal/v1/auth" }]
      }
    ]
  }]
});

const zapIssues = BurpZapBridge.parseZapJson(sampleZapJson);
assert.strictEqual(zapIssues.length, 1, 'Should parse 1 ZAP issue');
assert.strictEqual(zapIssues[0].eps, 85);
console.log('[PASS] OWASP ZAP JSON parsed and assigned EPS 85/100.');

// 3. Generate Markdown Deliverable with Sensitive Secret Attempt
const testState = {
  target: 'vpn.megacorp.internal',
  scope: '198.51.100.0/24',
  findings: [
    ...burpIssues,
    {
      title: 'Accidental Token Leak in PoC',
      severity: 'Critical',
      cvss: 9.9,
      eps: 95,
      target: 'https://vpn.megacorp.internal',
      poc: 'curl -H "Authorization: Bearer sk-ant-secret123456789012345678901234567890" https://vpn.megacorp.internal/leak'
    }
  ]
};

const reportMd = DeliverableGenerator.generateMarkdown(testState);
assert(reportMd.includes('# Penetration Testing Formal Deliverable'), 'Header present');
assert(reportMd.includes('OS Command Injection (CVE-2024-3400)'), 'Finding title included');
assert(reportMd.includes('EPS Priority'), 'Risk matrix present');

// Verify that the secret inside the finding's PoC was automatically sanitized!
assert(!reportMd.includes('sk-ant-secret1234567890'), 'Secret in finding PoC MUST be redacted');
assert(reportMd.includes('[REDACTED_SECRET: ANTHROPIC_API_KEY]'), 'Redaction marker present');
console.log('[PASS] Deliverable generated with 100% automated secret redaction.');

console.log('✓ All Deliverable integration tests passed.\n');
