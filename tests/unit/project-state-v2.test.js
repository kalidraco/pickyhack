const assert = require('assert');
const ProjectState = require('../../src/core/project-state');

console.log('--- Running tests/unit/project-state-v2.test.js ---');

// 1. Clean slate verification
ProjectState.clearAllData();
let state = ProjectState.get();
assert.strictEqual(state.target, '');
assert.strictEqual(state.scope, '');
assert.strictEqual(state.assets.length, 0);
assert.strictEqual(state.evidence.length, 0);
assert.strictEqual(state.findings.length, 0);
assert.strictEqual(state.tasks.length, 0);
console.log('[PASS] Clean default state on initial load.');

// 2. Add asset and service
const asset = ProjectState.addAsset({ ip: '10.0.0.1', host: 'edge.corp' });
assert.strictEqual(asset.ip, '10.0.0.1');
const svc = ProjectState.addService(asset.id, { port: 22, service: 'ssh', version: 'OpenSSH 8.9p1' });
assert.strictEqual(svc.port, 22);

state = ProjectState.get();
assert.strictEqual(state.assets.length, 1);
assert.strictEqual(state.assets[0].services.length, 1);
assert.strictEqual(state.assets[0].services[0].port, 22);
console.log('[PASS] Asset and service reactive registration verified.');

// 3. Add evidence
const evi = ProjectState.addEvidence({
  sourceTool: 'nmap',
  command: 'nmap -p 22 10.0.0.1',
  stdout: '22/tcp open ssh OpenSSH 8.9p1'
});
assert.ok(evi.id.startsWith('evi_'));
assert.strictEqual(ProjectState.get().evidence.length, 1);
console.log('[PASS] Evidence addition verified.');

// 4. Add task
const task = ProjectState.addTask({
  title: 'Audit SSH configuration',
  phase: 'ENUMERATION',
  priority: 'MEDIUM',
  evidenceRefs: [evi.id]
});
assert.ok(task.id.startsWith('task_'));
assert.strictEqual(ProjectState.get().tasks.length, 1);

// Update task status
ProjectState.updateTask(task.id, { status: 'DONE' });
assert.strictEqual(ProjectState.get().tasks[0].status, 'DONE');
console.log('[PASS] Task lifecycle and status transitions verified.');

// 5. Add finding
const finding = ProjectState.addFinding({
  title: 'Weak SSH Ciphers Enabled',
  severity: 'Low',
  status: 'CONFIRMED'
});
assert.strictEqual(ProjectState.get().findings.length, 1);
ProjectState.removeFinding(finding.id);
assert.strictEqual(ProjectState.get().findings.length, 0);
console.log('[PASS] Finding add and remove operations verified.');

// 6. Explicit sample data load
ProjectState.loadSampleData();
state = ProjectState.get();
assert.strictEqual(state.target, 'vpn.megacorp.internal');
assert.ok(state.findings.length > 0);
assert.ok(state.evidence.length > 0);
console.log('[PASS] Sample data load verified.');

// Reset
ProjectState.clearAllData();
console.log('✓ All ProjectState V2 unit tests passed.\n');
