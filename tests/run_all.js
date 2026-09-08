#!/usr/bin/env node
/**
 * PickyHack — Zero-Dependency Automated Test Runner
 * Executes all unit and integration test suites.
 */
const { execSync } = require('child_process');
const path = require('path');

const testFiles = [
  'tests/unit/sanitizer.test.js',
  'tests/unit/validator.test.js',
  'tests/unit/providers.test.js',
  'tests/unit/context-engine.test.js',
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
