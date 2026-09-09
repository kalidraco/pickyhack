const assert = require('assert');
const { ToolRegistry } = require('../../src/runtime/tool-registry');
const { BrowserRuntime } = require('../../src/runtime/browser-runtime');
const ProjectState = require('../../src/core/project-state');

console.log('--- Testing Tools & Browser Runtime Integration ---');

(async function run() {
  ProjectState.init();
  ProjectState.setTarget('127.0.0.1');

  // 1. Tool execution: dns_lookup
  const dnsRes = await ToolRegistry.execute('dns_lookup', { domain: 'localhost' });
  assert.strictEqual(dnsRes.status, 'success');
  console.log('✓ dns_lookup tool executed successfully');

  // 2. Browser runtime: navigate
  const browser = new BrowserRuntime();
  const navRes = await browser.execute({ action: 'navigate', url: 'https://example.com' });
  assert.strictEqual(navRes.status, 'success');
  assert.strictEqual(navRes.url, 'https://example.com');
  console.log('✓ BrowserRuntime: navigate succeeded');

  // 3. Browser runtime: screenshot & evidence recording
  const snapRes = await browser.execute({ action: 'screenshot', label: 'Example Landing Page' });
  assert.strictEqual(snapRes.status, 'success');
  assert(snapRes.dataUrl, 'Screenshot dataUrl generated');
  console.log('✓ BrowserRuntime: screenshot captured');

  // Verify evidence saved into ProjectState
  const evidenceList = ProjectState.get().evidence || [];
  assert(evidenceList.length >= 1, 'Evidence should be recorded in ProjectState');
  console.log(`✓ Browser screenshot saved as Evidence #${evidenceList[evidenceList.length - 1].id}`);

  // 4. Browser runtime: click and type
  const clickRes = await browser.execute({ action: 'click', selector: 'button.login' });
  assert.strictEqual(clickRes.status, 'success');

  const typeRes = await browser.execute({ action: 'type', selector: 'input[name="user"]', value: 'admin' });
  assert.strictEqual(typeRes.status, 'success');
  console.log('✓ BrowserRuntime: interaction actions succeeded');

  console.log('All Tools & BrowserRuntime integration tests passed!\n');
})();
