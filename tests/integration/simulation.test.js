/**
 * Integration Test: Attack Graph Breach Path & Choke-Point Analysis
 */
const assert = require('assert');
const AttackGraphSimulator = require('../../src/modules/attack-graph');

console.log('--- Running tests/integration/simulation.test.js ---');

// 1. Reset and simulate breach
AttackGraphSimulator.resetGraph();
assert.strictEqual(AttackGraphSimulator.activeBreachPath.length, 0, 'Graph should be reset');

AttackGraphSimulator.simulateBreach();
assert(AttackGraphSimulator.activeBreachPath.length >= 3, 'Breach path must traverse multiple hops');
assert(AttackGraphSimulator.activeBreachPath.includes('n_ext'), 'Must start from external attacker');
assert(AttackGraphSimulator.activeBreachPath.includes('n_dc'), 'Must reach crown jewels (DC)');
console.log(`[PASS] Breach path computed: ${AttackGraphSimulator.activeBreachPath.join(' -> ')}`);

// 2. Detect choke points
AttackGraphSimulator.detectBottlenecks();
assert(AttackGraphSimulator.highlightedBottlenecks.length > 0, 'Choke points must be identified');
assert(AttackGraphSimulator.highlightedBottlenecks.includes('n_vpn') || AttackGraphSimulator.highlightedBottlenecks.includes('n_jump'), 'Intermediate pivot points flagged as choke points');
console.log(`[PASS] Choke points identified: ${AttackGraphSimulator.highlightedBottlenecks.join(', ')}`);

console.log('✓ All Attack Graph simulation tests passed.\n');
