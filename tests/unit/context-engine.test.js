/**
 * Unit Test: Stateless Context Engine
 */
const assert = require('assert');
const ProjectState = require('../../src/core/project-state');
const ContextEngine = require('../../src/core/context-engine');
const ContextOptimizer = require('../../src/modules/token-optimizer');

console.log('--- Running tests/unit/context-engine.test.js ---');

// 1. Setup mock ProjectState
ProjectState.state = {
  target: 'vpn.megacorp.internal',
  scope: '198.51.100.0/24',
  objectives: 'Perimeter penetration and pivot',
  constraints: 'No DoS',
  assets: [{ host: 'vpn.megacorp.internal', ip: '198.51.100.10', ports: '443/tcp' }],
  findings: [
    { title: 'Command Injection', severity: 'Critical', eps: 99, cve: 'CVE-2024-3400', poc: 'curl -k ...' },
    { title: 'XSS Reflected', severity: 'Medium', eps: 65, cve: 'CVE-2023-1234' }
  ],
  attackChains: [
    { title: 'Edge to DC', steps: ['VPN RCE', 'SSH Pivot', 'Domain Admin'] }
  ],
  notes: 'Key discovery: GlobalProtect endpoint exposed.'
};

// 2. Build packet with mock attachment
const mockAttachments = [
  { name: 'nmap_out.txt', size: 1024, type: 'text', textContent: 'PORT 443/tcp OPEN ssl/http PAN-OS 10.2.7' }
];

const packet = ContextEngine.buildPacket('Synthesize initial access command for CVE-2024-3400', { attachments: mockAttachments });

assert(packet.userPacket.includes('=== PICKYHACK MISSION CONTEXT ==='), 'Packet must include header');
assert(packet.userPacket.includes('TARGET: vpn.megacorp.internal'), 'Target must be present');
assert(packet.userPacket.includes('CVE-2024-3400'), 'Critical CVE must be included');
assert(packet.userPacket.includes('EPS: 99/100'), 'EPS score must be included');
assert(packet.userPacket.includes('Edge to DC'), 'Attack chain must be present');
assert(packet.userPacket.includes('PORT 443/tcp OPEN ssl/http PAN-OS 10.2.7'), 'Attachment content must be injected');
assert(packet.userPacket.includes('OPERATOR INSTRUCTION / TASK:'), 'User query must be demarcated');
assert(packet.tokenEstimate > 50, 'Token estimation must be positive');
console.log(`[PASS] Context packet compiled successfully (~${packet.tokenEstimate} tokens).`);

// 3. Test Token Optimizer Pruner
const bloatedText = `
######################################################################
Starting Nmap 7.94 at 2026-09-08 14:00 UTC
Host is up (0.012s latency).
443/tcp open  ssl/http Palo Alto GlobalProtect PAN-OS 10.2.7
Nmap done: 1 IP address scanned in 2.31 seconds
======================================================================
`;

const pruned = ContextOptimizer.pruneText(bloatedText);
assert(!pruned.includes('Starting Nmap'), 'Nmap header must be stripped');
assert(!pruned.includes('Nmap done:'), 'Nmap footer must be stripped');
assert(!pruned.includes('####################'), 'Repetitive banners must be pruned');
assert(pruned.includes('Palo Alto GlobalProtect PAN-OS 10.2.7'), 'Core finding preserved');
console.log('[PASS] Context Optimizer semantic pruning verified.');

console.log('✓ All Context Engine unit tests passed.\n');
