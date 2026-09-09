const assert = require('assert');
const { ToolRegistry } = require('../../src/runtime/tool-registry');
const { RiskEngine } = require('../../src/security/risk-engine');

console.log('--- Testing ToolRegistry ---');

// 1. Check built-in tool registrations
const tools = ToolRegistry.listTools();
assert(tools.length >= 7, `Expected at least 7 built-in tools, got ${tools.length}`);

const toolNames = tools.map(t => t.name);
assert(toolNames.includes('nmap'), 'Should include nmap');
assert(toolNames.includes('nuclei'), 'Should include nuclei');
assert(toolNames.includes('ffuf'), 'Should include ffuf');
assert(toolNames.includes('curl'), 'Should include curl');
assert(toolNames.includes('shell'), 'Should include shell');
assert(toolNames.includes('http_request'), 'Should include http_request');
assert(toolNames.includes('dns_lookup'), 'Should include dns_lookup');
console.log('✓ All built-in tools registered correctly');

// 2. Argument validation: missing required field
assert.rejects(async () => {
  await ToolRegistry.execute('nmap', {});
}, /Argument 'target' is required/, 'Should reject missing required argument');
console.log('✓ Rejects missing required arguments according to schema');

// 3. Risk Engine integration
const nmapRisk = RiskEngine.classifyAction('nmap', { target: '10.0.0.1' });
assert(nmapRisk.riskLevel === 'MEDIUM', `Expected MEDIUM risk for nmap, got ${nmapRisk.riskLevel}`);

const shellRisk = RiskEngine.classifyAction('shell', { command: 'rm -rf /' });
assert(shellRisk.riskLevel === 'CRITICAL', `Expected CRITICAL risk for shell, got ${shellRisk.riskLevel}`);
console.log('✓ RiskEngine classifies tools accurately');

// 4. Custom tool registration
ToolRegistry.register({
  name: 'custom_ping',
  description: 'Custom ping scanner',
  category: 'recon',
  risk: 'LOW',
  argsSchema: {
    host: { type: 'string', required: true }
  },
  executor: async (args) => {
    return { status: 'success', host: args.host, pong: true };
  }
});

assert(ToolRegistry.get('custom_ping'), 'Should find newly registered tool');
ToolRegistry.execute('custom_ping', { host: '127.0.0.1' }).then(res => {
  assert.strictEqual(res.status, 'success');
  assert.strictEqual(res.pong, true);
  console.log('✓ Custom tool registration & execution succeeds');
  console.log('All ToolRegistry unit tests passed!\n');
});
