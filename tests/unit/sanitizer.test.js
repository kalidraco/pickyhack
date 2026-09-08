/**
 * Unit Test: Security Sanitizer & Secret Redaction Engine
 */
const assert = require('assert');
const SecuritySanitizer = require('../../src/security/sanitizer');

console.log('--- Running tests/unit/sanitizer.test.js ---');

// 1. Test OpenAI key redaction
const sampleOpenAI = 'curl -H "Authorization: Bearer sk-proj-1234567890abcdef1234567890abcdef" https://api.openai.com';
const res1 = SecuritySanitizer.redact(sampleOpenAI);
assert(res1.sanitized.includes('[REDACTED_SECRET: OPENAI_API_KEY]'), 'Should redact OpenAI API key');
assert(!res1.sanitized.includes('sk-proj-1234567890'), 'Plaintext key must be eliminated');
console.log('[PASS] OpenAI API key redacted correctly.');

// 2. Test Anthropic key redaction
const sampleAnthropic = 'x-api-key: sk-ant-api03-abcdef1234567890abcdef1234567890';
const res2 = SecuritySanitizer.redact(sampleAnthropic);
assert(res2.sanitized.includes('[REDACTED_SECRET: ANTHROPIC_API_KEY]'), 'Should redact Anthropic key');
console.log('[PASS] Anthropic key redacted correctly.');

// 3. Test Google Gemini key redaction
const sampleGemini = 'https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyA12345678901234567890123456789012';
const res3 = SecuritySanitizer.redact(sampleGemini);
assert(res3.sanitized.includes('[REDACTED_SECRET: GOOGLE_API_KEY]'), 'Should redact Gemini key');
console.log('[PASS] Gemini key redacted correctly.');

// 4. Test RSA Private Key redaction
const sampleKey = '-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA0...\n-----END RSA PRIVATE KEY-----';
const res4 = SecuritySanitizer.redact(sampleKey);
assert(res4.sanitized.includes('[REDACTED_SECRET: PRIVATE_KEY]'), 'Should redact Private Key block');
console.log('[PASS] RSA Private Key redacted correctly.');

// 5. Test Password field redaction
const samplePassword = 'db_config = { password: "SuperSecretPassword123!" }';
const res5 = SecuritySanitizer.redact(samplePassword);
assert(res5.sanitized.includes('[REDACTED_SECRET: PASSWORD_FIELD]'), 'Should redact password field');
console.log('[PASS] Password field redacted correctly.');

// 6. Test maskKey for UI display
const masked = SecuritySanitizer.maskKey('sk-proj-998877665544332211');
assert(masked.startsWith('sk-proj') && masked.includes('••••••••') && masked.endsWith('211'), 'Should mask key properly for UI');
console.log('[PASS] Key masking format verified.');

// 7. Test isClean
assert(SecuritySanitizer.isClean('Regular pentest command: nmap -sS -p 443 target.local'), 'Clean text should pass');
assert(!SecuritySanitizer.isClean('curl -H "Authorization: Bearer sk-ant-123456789012345678901234567890"'), 'Dirty text should be caught');
console.log('[PASS] isClean check verified.');

console.log('✓ All Sanitizer unit tests passed.\n');
