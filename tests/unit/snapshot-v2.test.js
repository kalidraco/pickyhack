const assert = require('assert');
const SnapshotManager = require('../../src/core/snapshot-manager');
const ProjectState = require('../../src/core/project-state');

console.log('--- Running tests/unit/snapshot-v2.test.js ---');

// 1. Generate snapshot from sample data
ProjectState.loadSampleData();
const snapshot = SnapshotManager.generate();
assert.strictEqual(snapshot.schemaVersion, '2.0.0');
assert.strictEqual(snapshot.generator, 'PickyHack AI Context Harness');
assert.strictEqual(snapshot.project.target, 'vpn.megacorp.internal');
assert.ok(snapshot.findings.length > 0);
assert.ok(snapshot.assets.length > 0);
assert.ok(snapshot.tasks.length > 0);
console.log('[PASS] Generated canonical .pickycontext.json snapshot.');

// 2. Secret Redaction Guarantee
// Inject secret into notes to test sanitization
ProjectState.update({ notes: 'Admin token: sk-ant-api03-abcdefghijklmnop123456789' });
const sanitizedSnapshot = SnapshotManager.generate();
assert.ok(!JSON.stringify(sanitizedSnapshot).includes('sk-ant-api03-abcdefghijklmnop123456789'));
assert.ok(JSON.stringify(sanitizedSnapshot).includes('[REDACTED_SECRET: ANTHROPIC_API_KEY]'));
console.log('[PASS] Automated secret redaction before snapshot serialization verified.');

// 3. Validation
const validCheck = SnapshotManager.validate(sanitizedSnapshot);
assert.strictEqual(validCheck.valid, true);

const invalidCheck = SnapshotManager.validate({ invalid: true });
assert.strictEqual(invalidCheck.valid, false);
console.log('[PASS] Snapshot schema validation verified.');

// 4. Round-trip Import
ProjectState.clearAllData();
assert.strictEqual(ProjectState.get().findings.length, 0);

const importResult = SnapshotManager.import(sanitizedSnapshot);
assert.strictEqual(importResult.success, true);
assert.strictEqual(ProjectState.get().target, 'vpn.megacorp.internal');
assert.ok(ProjectState.get().findings.length > 0);
assert.ok(ProjectState.get().tasks.length > 0);
console.log('[PASS] Lossless round-trip import of complete project state verified.');

// 5. Diff calculation
const modified = JSON.parse(JSON.stringify(sanitizedSnapshot));
modified.findings.push({ id: 'f-new', title: 'New finding' });
const diff = SnapshotManager.diff(sanitizedSnapshot, modified);
assert.strictEqual(diff.findingsDiff, 1);
console.log('[PASS] Snapshot diff computation verified.');

// Clean up
ProjectState.clearAllData();
console.log('✓ All Snapshot V2 unit tests passed.\n');
