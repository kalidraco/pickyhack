const assert = require('assert');
const ContextEngine = require('../../src/core/context-engine');
const ProjectState = require('../../src/core/project-state');

console.log('--- Running tests/unit/context-engine-v2.test.js ---');

// Setup rich state
ProjectState.loadSampleData();
const state = ProjectState.get();

// 1. Entity Extraction
const query = 'Can we exploit CVE-2024-3400 on port 443 of 198.51.100.10 using nuclei?';
const entities = ContextEngine.extractEntities(query);
assert.deepStrictEqual(entities.cves, ['CVE-2024-3400']);
assert.deepStrictEqual(entities.ips, ['198.51.100.10']);
assert.deepStrictEqual(entities.ports, ['443']);
assert.ok(entities.tools.includes('nuclei'));
console.log('[PASS] Entity extraction (CVEs, IPs, Ports, Tools) verified.');

// 2. Focused Context Selection vs Irrelevant Noise Pruning
const packet = ContextEngine.buildPacket('Can we exploit CVE-2024-3400?', { state, budgetTokens: 2000 });
assert.ok(packet.tokenEstimate <= 2000, `Token estimate ${packet.tokenEstimate} should be <= 2000`);

// Check that the relevant finding (CVE-2024-3400) was selected
const selectedFinding = packet.selectedItems.find(i => i.type === 'finding' && i.content.includes('CVE-2024-3400'));
assert.ok(selectedFinding, 'Finding matching CVE-2024-3400 must be prioritized and selected');
assert.ok(selectedFinding.score >= 60, 'Finding matching CVE should receive high utility score');
console.log(`[PASS] Utility scoring prioritized relevant finding with score: ${selectedFinding.score}.`);

// 3. Selection Rationale Reporting
assert.ok(Array.isArray(selectedFinding.reasons));
assert.ok(selectedFinding.reasons.some(r => r.includes('Direct CVE match')));
console.log('[PASS] Explainable selection reasons verified.');

// 4. Budget Constraint Enforcement
const tightBudgetPacket = ContextEngine.buildPacket('General overview', { state, budgetTokens: 180 });
assert.ok(tightBudgetPacket.tokenEstimate <= 260, `Tight budget must constrain packet size (actual: ${tightBudgetPacket.tokenEstimate})`);
assert.ok(tightBudgetPacket.rejectedItems.length > 0, 'Candidates overflowing tight budget must be rejected with reasons');
console.log(`[PASS] Tight budget enforced: ${tightBudgetPacket.selectedItems.length} selected, ${tightBudgetPacket.rejectedItems.length} pruned.`);

// 5. Context Replay (Re-hydration for new conversation/model without chat history)
const replayPacket = ContextEngine.buildReplayContext(state, { contextWindow: 32768 });
assert.ok(replayPacket.userPacket.includes('=== PICKYHACK MISSION CONTEXT ==='));
assert.ok(replayPacket.userPacket.includes('vpn.megacorp.internal'));
assert.ok(replayPacket.tokenEstimate > 100);
console.log('[PASS] Context Replay successfully re-hydrates state without legacy chat history.');

// 6. Context Diff (Model A vs Model B)
const packetSmall = ContextEngine.buildPacket('Enumerate port 443', { state, budgetTokens: 1000 });
const packetLarge = ContextEngine.buildPacket('Enumerate port 443', { state, budgetTokens: 8000 });
const diff = ContextEngine.diffContexts(packetSmall, packetLarge);
assert.ok(diff.tokenDiff >= 0);
assert.ok(diff.retained.length > 0);
console.log(`[PASS] Context Diff verified: +${diff.added.length} items added in larger budget, +${diff.tokenDiff} tokens.`);

// Clean up
ProjectState.clearAllData();
console.log('✓ All Context Engine V2 unit tests passed.\n');
