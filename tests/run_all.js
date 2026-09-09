#!/usr/bin/env node
/**
 * PickyHack — Comprehensive Automated Test Runner
 * Executes all unit and integration test suites.
 */
const { execSync } = require('child_process');
const path = require('path');

const testFiles = [
  // Canonical Models, Reactive State & Context Harness
  'tests/unit/models.test.js',
  'tests/unit/project-state-v2.test.js',
  'tests/unit/context-engine-v2.test.js',
  'tests/unit/snapshot-v2.test.js',

  // Tool Runtime, Safety Engine & Task Tree
  'tests/unit/tool-registry.test.js',
  'tests/unit/risk-engine.test.js',
  'tests/unit/task-tree.test.js',

  // Agent Loop & Tools Integration
  'tests/integration/agent-loop.test.js',
  'tests/integration/tools.test.js',

  // Core Security & Sanitization
  'tests/unit/sanitizer.test.js',
  'tests/unit/validator.test.js',
  'tests/unit/providers.test.js',
  'tests/unit/context-engine.test.js',
  'tests/unit/response-ux-state.test.js',
  'tests/unit/onboarding.test.js',
  'tests/unit/chat-agent-ui.test.js',
  'tests/integration/deliverable.test.js',
  'tests/integration/simulation.test.js'
];

console.log('====================================================');
console.log('   PICKYHACK ENTERPRISE SECURITY & QUALITY SUITE    ');
console.log('====================================================\n');

let passedCount = 0;
let failedCount = 0;

testFiles.forEach(file => {
  const fullPath = path.resolve(__dirname, '..', file);
  try {
    execSync(`node "${fullPath}"`, { stdio: 'inherit' });
    passedCount++;
  } catch (err) {
    console.error(`\n[FAIL] Test failed: ${file}\n`);
    failedCount++;
  }
});

console.log('====================================================');
console.log(`Summary: ${passedCount} suites passed, ${failedCount} failed.`);
console.log('====================================================\n');

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL PICKYHACK TEST SUITES PASSED CLEANLY.\n');
  process.exit(0);
}
