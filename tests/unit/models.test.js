const assert = require('assert');
const Models = require('../../src/core/models');

console.log('--- Running tests/unit/models.test.js ---');

// 1. Epistemic Classifications
assert.strictEqual(Models.EpistemicStatus.FACT, 'FACT');
assert.strictEqual(Models.EpistemicStatus.HYPOTHESIS, 'HYPOTHESIS');
assert.strictEqual(Models.EpistemicStatus.CONFIRMED, undefined); // In FindingStatus or EpistemicStatus
assert.strictEqual(Models.RiskLevel.CRITICAL, 'CRITICAL');
console.log('[PASS] Epistemic and Risk classifications verified.');

// 2. Asset & Service Factory
const asset = Models.createAsset({ ip: '10.10.10.5', host: 'web.local' });
assert.ok(asset.id.startsWith('asset_'));
assert.strictEqual(asset.ip, '10.10.10.5');
assert.strictEqual(asset.host, 'web.local');

const svc = Models.createService({ port: 443, service: 'https', version: 'Apache 2.4.49' });
assert.ok(svc.id.startsWith('svc_'));
assert.strictEqual(svc.port, 443);
assert.strictEqual(svc.service, 'https');
console.log('[PASS] Asset and Service creation verified.');

// 3. Evidence Model
const evidence = Models.createEvidence({
  type: 'command_output',
  sourceTool: 'nmap',
  command: 'nmap -sV -p 80 target.local',
  stdout: '80/tcp open http Apache 2.4.49'
});
assert.ok(evidence.id.startsWith('evi_'));
assert.strictEqual(evidence.sourceTool, 'nmap');
assert.ok(evidence.stdout.includes('Apache 2.4.49'));
console.log('[PASS] Evidence model creation verified.');

// 4. Finding Model
const finding = Models.createFinding({
  title: 'Apache 2.4.49 Path Traversal',
  cve: 'CVE-2021-41773',
  severity: 'Critical',
  cvss: 9.8,
  eps: 98,
  evidenceRefs: [evidence.id]
});
assert.ok(finding.id.startsWith('f_'));
assert.strictEqual(finding.cve, 'CVE-2021-41773');
assert.strictEqual(finding.severity, 'Critical');
assert.strictEqual(finding.cvss, 9.8);
assert.strictEqual(finding.eps, 98);
assert.deepStrictEqual(finding.evidenceRefs, [evidence.id]);
console.log('[PASS] Finding model with evidence references verified.');

// 5. Task Model
const task = Models.createTask({
  title: 'Validate CVE-2021-41773 on port 80',
  phase: Models.PentestPhase.VALIDATION,
  priority: 'CRITICAL',
  evidenceRefs: [evidence.id],
  findingRefs: [finding.id]
});
assert.ok(task.id.startsWith('task_'));
assert.strictEqual(task.phase, 'VALIDATION');
assert.strictEqual(task.status, 'TODO');
assert.strictEqual(task.priority, 'CRITICAL');
console.log('[PASS] Task model verified.');

console.log('✓ All Models unit tests passed.\n');
