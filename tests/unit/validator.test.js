/**
 * Unit Test: Input Validation & File Security Engine
 */
const assert = require('assert');
const SecurityValidator = require('../../src/security/validator');

console.log('--- Running tests/unit/validator.test.js ---');

// 1. Test allowed file extensions
const validFile = { name: 'nmap_scan.xml', size: 1024 * 100 };
assert(SecurityValidator.validateFile(validFile).valid, 'XML scan should be allowed');

const validImage = { name: 'burp_poc.png', size: 1024 * 500 };
assert(SecurityValidator.validateFile(validImage).valid, 'PNG image should be allowed');
console.log('[PASS] Allowed file formats verified.');

// 2. Test blocked executable/script extensions
const evilExe = { name: 'malware.exe', size: 1024 };
const resExe = SecurityValidator.validateFile(evilExe);
assert(!resExe.valid, 'EXE files must be blocked');
assert(resExe.error.includes('blocked for safety'), 'Error must specify security block');

const evilSh = { name: 'reverse_shell.sh', size: 1024 };
assert(!SecurityValidator.validateFile(evilSh).valid, 'SH scripts must be blocked');

const evilSvg = { name: 'xss_payload.svg', size: 1024 };
assert(!SecurityValidator.validateFile(evilSvg).valid, 'SVG must be blocked to prevent XSS');
console.log('[PASS] Forbidden executable & script extensions blocked.');

// 3. Test file size limit (5MB)
const hugeFile = { name: 'massive_dump.log', size: 6 * 1024 * 1024 };
const resHuge = SecurityValidator.validateFile(hugeFile);
assert(!resHuge.valid, 'Files over 5MB must be rejected');
assert(resHuge.error.includes('exceeds the 5MB limit'), 'Error message must reflect 5MB limit');
console.log('[PASS] File size limit enforcement verified.');

// 4. Test path traversal sanitization in filenames
const traversal1 = '../../../../etc/passwd.txt';
const sanitized1 = SecurityValidator.sanitizeFilename(traversal1);
assert(!sanitized1.includes('..'), 'Path traversal ../ must be removed');
assert(sanitized1.includes('passwd.txt'), 'Base name preserved');

const nullByte = 'safe.txt\0.exe';
const sanitizedNull = SecurityValidator.sanitizeFilename(nullByte);
assert(!sanitizedNull.includes('\0'), 'Null bytes must be stripped');
console.log('[PASS] Path traversal and null byte sanitization verified.');

// 5. Test SSRF URL validation
const ssrfAws = 'http://169.254.169.254/latest/meta-data/';
const resSsrfAws = SecurityValidator.validateEndpointUrl(ssrfAws);
assert(!resSsrfAws.valid, 'Cloud metadata IP must be blocked');
assert(resSsrfAws.error.includes('forbidden by security policy'), 'SSRF policy error reported');

const ssrfGcp = 'http://metadata.google.internal/computeMetadata/v1/';
const resSsrfgcp = SecurityValidator.validateEndpointUrl(ssrfGcp);
assert(!resSsrfgcp.valid, 'GCP metadata hostname must be blocked');

const localOllama = 'http://localhost:11434/v1';
const resOllama = SecurityValidator.validateEndpointUrl(localOllama);
assert(resOllama.valid, 'Localhost endpoint should be valid');
assert(resOllama.isLocal === true, 'Localhost must be flagged as isLocal');
console.log('[PASS] SSRF protection against cloud metadata verified.');

// 6. Test HTML entity escaping
const xss = '<script>alert("XSS")</script>';
const escaped = SecurityValidator.escapeHTML(xss);
assert(!escaped.includes('<script>'), 'HTML tags must be escaped');
assert(escaped.includes('&lt;script&gt;'), 'Entities properly replaced');
console.log('[PASS] HTML entity escaping verified.');

console.log('✓ All Validator unit tests passed.\n');
