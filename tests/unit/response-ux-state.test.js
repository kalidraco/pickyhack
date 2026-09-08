/**
 * Unit Test: Less is More Response UX & Empty Initial State
 */
const assert = require('assert');
const ProjectState = require('../../src/core/project-state');
const NotesTaker = require('../../src/modules/notes-taker');
const ProviderRegistry = require('../../src/providers/provider-registry');

console.log('--- Running tests/unit/response-ux-state.test.js ---');

// 1. Verify default initial state is completely empty
const freshState = ProjectState.clearAllData();
assert.strictEqual(freshState.target, '', 'Default target must be empty');
assert.strictEqual(freshState.scope, '', 'Default scope must be empty');
assert.strictEqual(freshState.notes, '', 'Default notes must be empty');
assert.deepStrictEqual(freshState.findings, [], 'Default findings must be empty array');
assert.deepStrictEqual(freshState.attackChains, [], 'Default attackChains must be empty array');
assert.deepStrictEqual(freshState.assets, [], 'Default assets must be empty array');
console.log('[PASS] Default ProjectState is 100% empty on first open.');

// 2. Verify NotesTaker clean state
assert.strictEqual(NotesTaker.load(), '', 'Default NotesTaker content must be empty string');
assert.strictEqual(NotesTaker.loadTitle(), '', 'Default NotesTaker title must be empty string');
console.log('[PASS] NotesTaker is 100% empty on first open.');

// 3. Test Sample Data Loading & Clearing
const sample = ProjectState.loadSampleData();
assert.strictEqual(sample.target, 'vpn.megacorp.internal', 'Sample target loaded');
assert(sample.findings.length > 0, 'Sample findings loaded');
assert(sample.attackChains.length > 0, 'Sample attack chains loaded');

const cleared = ProjectState.clearAllData();
assert.strictEqual(cleared.target, '', 'Target cleared');
assert.strictEqual(cleared.findings.length, 0, 'Findings cleared');
console.log('[PASS] Sample data load and reset transitions verified.');

// 4. Test Response UX: Simple Factual Question (Less is More)
const simpleResult = ProviderRegistry.localSynthesisFallback('C\'est quoi la CVE pour GlobalProtect ?');
assert(simpleResult.text.includes('CVE-2024-3400'), 'Direct answer must contain the CVE');
assert(!simpleResult.text.includes('### 1. TL;DR'), 'Simple question must NOT output full 12-section report');
assert(!simpleResult.text.includes('### 10. POST-EXPLOITATION'), 'Simple question must not include post-exploitation essay');
assert(simpleResult.details !== null, 'Progressive disclosure details drawer must be available on demand');
console.log('[PASS] Simple factual question returns direct 1-sentence answer without verbose report.');

// 5. Test Response UX: Command Question
const cmdResult = ProviderRegistry.localSynthesisFallback('Donne moi la commande nmap pour scanner les ports 80 et 443');
assert(cmdResult.code && cmdResult.code.includes('nmap'), 'Command result must provide clean CLI block');
assert(cmdResult.text.length < 150, 'Command response text preamble must be concise');
console.log('[PASS] Command query returns direct CLI syntax without essay.');

// 6. Test Response UX: Explicit Deep Analysis
const deepResult = ProviderRegistry.localSynthesisFallback('Analyse approfondie complète du périmètre et rapport de pentest');
assert(deepResult.text.includes('DOSSIER TECHNIQUE'), 'Deep analysis explicitly requested produces detailed dossier');
console.log('[PASS] Explicit in-depth request produces complete structured dossier.');

console.log('✓ All Response UX & State unit tests passed.\n');
