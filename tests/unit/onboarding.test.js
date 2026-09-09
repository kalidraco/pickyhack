/**
 * PickyHack — Onboarding & Theme System Unit Tests
 * Verifies mandatory first-launch API onboarding, blocking "Let's Hack !" modal,
 * live connection testing, error categorization, zero mock AI simulation,
 * chat composer locking, strict persistence verification, and Picky98 default theme integrity.
 */
const assert = require('assert');

// Mock localStorage for Node.js test environment
const mockStorage = {};
global.localStorage = {
  getItem: (k) => mockStorage[k] !== undefined ? mockStorage[k] : null,
  setItem: (k, v) => { mockStorage[k] = String(v); },
  removeItem: (k) => { delete mockStorage[k]; },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
};

// Mock DOM elements
const domElements = {};
function createMockElement(id, tag = 'div') {
  return {
    id,
    tagName: tag.toUpperCase(),
    value: '',
    type: '',
    style: {},
    classList: {
      classes: new Set(),
      add(c) { this.classes.add(c); },
      remove(c) { this.classes.delete(c); },
      contains(c) { return this.classes.has(c); },
      toggle(c, force) {
        if (force !== undefined) {
          if (force) this.classes.add(c); else this.classes.delete(c);
        } else {
          if (this.classes.has(c)) this.classes.delete(c); else this.classes.add(c);
        }
      }
    },
    disabled: false,
    textContent: '',
    innerHTML: '',
    placeholder: '',
    children: [],
    appendChild(child) { this.children.push(child); },
    addEventListener() {},
    remove() {},
    focus() { this.isFocused = true; }
  };
}

global.document = {
  documentElement: {
    getAttribute: (attr) => mockStorage[`attr_${attr}`] || 'picky98',
    setAttribute: (attr, val) => { mockStorage[`attr_${attr}`] = val; }
  },
  createElement: (tag) => createMockElement(`elem-${Math.random()}`, tag),
  getElementById: (id) => {
    if (!domElements[id]) {
      domElements[id] = createMockElement(id);
    }
    return domElements[id];
  },
  querySelectorAll: () => []
};

// Load modules
const providersCatalog = require('../../src/config/providers-catalog.js');
global.ProvidersCatalog = providersCatalog;

const ProviderRegistry = require('../../src/providers/provider-registry.js');
const SidebarUI = require('../../src/ui/sidebar-ui.js');
const OnboardingUI = require('../../src/ui/onboarding-ui.js');
const ChatAgentUI = require('../../src/ui/chat-agent-ui.js');

console.log('--- Testing First-Launch Onboarding & Theme System ---');

// Test 1: First Launch State
localStorage.clear();
delete mockStorage['hasCompletedAIOnboarding'];
delete mockStorage['pickyhack_onboarded'];
delete mockStorage['pickyhack_multi_api_engines'];
delete mockStorage['pickyhack_active_engine_id'];

assert.strictEqual(
  ProviderRegistry.hasValidConfig(),
  false,
  'First launch must report hasValidConfig() === false'
);
assert.strictEqual(
  ProviderRegistry.hasCompletedAIOnboarding(),
  false,
  'First launch must report hasCompletedAIOnboarding() === false'
);
console.log('[PASS] First launch correctly detects unconfigured state (hasValidConfig = false).');

// Test 2: Zero Mock AI on unconfigured engine
(async () => {
  const res = await ProviderRegistry.send('System prompt', 'What is the target?');
  assert.strictEqual(
    res.error,
    'NO_AI_ENGINE_CONFIGURED',
    'ProviderRegistry.send must return NO_AI_ENGINE_CONFIGURED when not configured'
  );
  assert.strictEqual(
    res.requiresConfig,
    true,
    'Response must flag requiresConfig = true'
  );
  assert.ok(
    res.text.includes('No AI engine configured'),
    'Response text must clearly state No AI engine configured'
  );
  console.log('[PASS] Zero Mock AI verified: Unconfigured engine refuses to simulate fake chat.');

  // Test 3: Test Connection — Missing API Key validation
  const missingKeyRes = await ProviderRegistry.testConnection({
    provider: 'openai',
    endpoint: 'https://api.openai.com/v1',
    apiKey: '',
    model: 'gpt-4o'
  });
  assert.strictEqual(missingKeyRes.success, false);
  assert.strictEqual(
    missingKeyRes.error,
    'API key required.',
    'Missing key must return exact "API key required." error'
  );
  console.log('[PASS] Connection test rejects missing API key with "API key required."');

  // Test 4: Test Connection — Simulated 401 Unauthorized
  const origFetch = global.fetch;
  global.fetch = async () => ({
    ok: false,
    status: 401,
    text: async () => '{"error": {"message": "Incorrect API key provided"}}',
    json: async () => ({ error: { message: 'Incorrect API key provided' } })
  });

  const authFailRes = await ProviderRegistry.testConnection({
    provider: 'openai',
    endpoint: 'https://api.openai.com/v1',
    apiKey: 'sk-invalid-key-test',
    model: 'gpt-4o'
  });
  assert.strictEqual(authFailRes.success, false);
  assert.ok(
    authFailRes.error.includes('Invalid API key') || authFailRes.error.includes('401'),
    'HTTP 401 must report Invalid API key'
  );
  console.log('[PASS] Connection test diagnoses 401 Unauthorized as Invalid API key.');

  // Test 5: Test Connection — Simulated 404 Model Not Found
  global.fetch = async () => ({
    ok: false,
    status: 404,
    text: async () => '{"error": {"message": "Model not found"}}',
    json: async () => ({ error: { message: 'Model not found' } })
  });

  const notFoundRes = await ProviderRegistry.testConnection({
    provider: 'openai',
    endpoint: 'https://api.openai.com/v1',
    apiKey: 'sk-valid-format-key',
    model: 'non-existent-model-xyz'
  });
  assert.strictEqual(notFoundRes.success, false);
  assert.ok(
    notFoundRes.error.includes('Model not found'),
    'HTTP 404 must report Model not found'
  );
  console.log('[PASS] Connection test diagnoses 404 as Model not found.');

  // Test 6: Test Connection — Simulated Network Failure (Endpoint Unreachable)
  global.fetch = async () => {
    throw new Error('fetch failed: ECONNREFUSED 127.0.0.1:11434');
  };

  const netFailRes = await ProviderRegistry.testConnection({
    provider: 'ollama',
    endpoint: 'http://127.0.0.1:11434/v1',
    apiKey: '',
    model: 'llama3.3:70b'
  });
  assert.strictEqual(netFailRes.success, false);
  assert.ok(
    netFailRes.error.includes('Endpoint unreachable'),
    'Network failure must report Endpoint unreachable'
  );
  console.log('[PASS] Connection test diagnoses network failure as Endpoint unreachable.');

  // Test 7: Strict Persistence Verification
  // If someone sets hasCompletedAIOnboarding: 'true' in storage without valid credentials,
  // hasCompletedAIOnboarding() MUST still return false!
  localStorage.setItem('hasCompletedAIOnboarding', 'true');
  delete mockStorage['pickyhack_multi_api_engines'];
  assert.strictEqual(
    ProviderRegistry.hasCompletedAIOnboarding(),
    false,
    'hasCompletedAIOnboarding must verify actual active credentials, not just the boolean flag'
  );
  console.log('[PASS] Strict persistence verified: Fake or orphaned onboarding flag is rejected.');

  // Test 8: Test Connection — Simulated 200 Success
  global.fetch = async () => ({
    ok: true,
    status: 200,
    json: async () => ({ data: [{ id: 'gpt-4o' }] })
  });

  const successRes = await ProviderRegistry.testConnection({
    id: 'engine-openai',
    provider: 'openai',
    endpoint: 'https://api.openai.com/v1',
    apiKey: 'sk-test-valid-active-key',
    model: 'gpt-4o'
  });
  assert.strictEqual(successRes.success, true);
  assert.strictEqual(successRes.message, 'Connection successful');
  assert.strictEqual(
    localStorage.getItem('hasCompletedAIOnboarding'),
    'true',
    'Successful connection must mark hasCompletedAIOnboarding = true'
  );
  assert.strictEqual(
    ProviderRegistry.hasValidConfig(),
    true,
    'After successful test, hasValidConfig() must return true'
  );
  assert.strictEqual(
    ProviderRegistry.hasCompletedAIOnboarding(),
    true,
    'After successful test, hasCompletedAIOnboarding() must return true'
  );
  console.log('[PASS] Connection test succeeds and transitions state to verified onboarded.');

  // Test 9: Chat Locking Mechanism
  const chatInputEl = document.getElementById('chat-input');
  const btnSendEl = document.getElementById('btn-chat-send');

  ChatAgentUI.setLocked(true);
  assert.strictEqual(ChatAgentUI.isLocked, true, 'ChatAgentUI is locked');
  assert.strictEqual(chatInputEl.disabled, true, 'Chat input is disabled when locked');
  assert.strictEqual(btnSendEl.disabled, true, 'Send button is disabled when locked');
  assert.ok(chatInputEl.placeholder.includes('🔒 AI engine required'), 'Placeholder reflects lock state');

  // Attempting to submit while unconfigured or locked must be rejected
  const initialMsgCount = ChatAgentUI.getActiveConversation().messages.length;
  await ChatAgentUI.handleUserSubmit('Exploit target');
  assert.strictEqual(
    ChatAgentUI.getActiveConversation().messages.length,
    initialMsgCount,
    'Submission while locked must be blocked and not added to conversation'
  );
  console.log('[PASS] Chat composer lock mechanism verified: interaction blocked while unconfigured.');

  ChatAgentUI.setLocked(false);
  assert.strictEqual(ChatAgentUI.isLocked, false);
  assert.strictEqual(chatInputEl.disabled, false);
  assert.strictEqual(btnSendEl.disabled, false);
  console.log('[PASS] Chat composer unlock mechanism verified.');

  // Test 10: OnboardingUI Controller Unit Tests
  OnboardingUI.apiKey = '';
  OnboardingUI.selectedProvider = 'openai';
  let fetchCalled = false;
  global.fetch = async () => {
    fetchCalled = true;
    return { ok: true, status: 200, json: async () => ({}) };
  };

  // Clicking test connection without API key must not call fetch and immediately display error
  await OnboardingUI.runConnectionTest();
  assert.strictEqual(fetchCalled, false, 'No network request must be sent if API key is missing');
  const statusBox = document.getElementById('onboarding-test-status');
  assert.ok(statusBox.innerHTML.includes('API key required.'), 'Status box must display "API key required."');
  const btnLetsHack = document.getElementById('btn-onboarding-lets-hack');
  assert.strictEqual(btnLetsHack.disabled, true, 'Let\'s Hack ! button must remain disabled');
  console.log('[PASS] OnboardingUI testConnection gate: "API key required." without network call.');

  // When connection succeeds: Let's Hack ! button is enabled
  OnboardingUI.apiKey = 'sk-valid-key-testing';
  await OnboardingUI.runConnectionTest();
  assert.strictEqual(fetchCalled, true, 'Network test executed with valid key format');
  assert.strictEqual(OnboardingUI.isConnected, true, 'Connection verified');
  assert.strictEqual(btnLetsHack.disabled, false, 'Let\'s Hack ! button is enabled after successful test');
  console.log('[PASS] OnboardingUI successful test enables [ Let\'s Hack ! ] button.');

  // Clicking completeOnboarding saves config, closes modal, and unlocks chat
  ChatAgentUI.setLocked(true);
  OnboardingUI.completeOnboarding();
  assert.strictEqual(localStorage.getItem('hasCompletedAIOnboarding'), 'true');
  assert.strictEqual(ChatAgentUI.isLocked, false, 'Chat unlocked after completing onboarding');
  assert.strictEqual(chatInputEl.isFocused, true, 'Chat input focused after completing onboarding');
  console.log('[PASS] OnboardingUI completeOnboarding unlocks chat and focuses input.');

  // Test 11: Theme System — Picky98 Default
  assert.strictEqual(
    SidebarUI.currentTheme,
    'picky98',
    'Default theme must be Picky98'
  );
  SidebarUI.initSavedTheme();
  assert.strictEqual(
    document.documentElement.getAttribute('data-theme'),
    'picky98',
    'data-theme attribute must default to picky98'
  );
  console.log('[PASS] Picky98 verified as default theme out of the box.');

  // Test 12: Theme Switch to PickyTahoe
  SidebarUI.setTheme('tahoe-dark');
  assert.strictEqual(
    SidebarUI.currentTheme,
    'tahoe-dark',
    'Theme switches cleanly to tahoe-dark'
  );
  assert.strictEqual(
    document.documentElement.getAttribute('data-theme'),
    'tahoe-dark'
  );
  assert.strictEqual(
    localStorage.getItem('pickyhack_theme'),
    'tahoe-dark'
  );

  // Switch back to Picky98
  SidebarUI.setTheme('picky98');
  assert.strictEqual(
    SidebarUI.currentTheme,
    'picky98'
  );
  assert.strictEqual(
    document.documentElement.getAttribute('data-theme'),
    'picky98'
  );
  console.log('[PASS] Theme switcher toggles between Picky98 and PickyTahoe seamlessly.');

  // Test 13: Send Button & API Popup Modal Wiring
  const fs = require('fs');
  const path = require('path');
  const indexHtml = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf8');

  // Verify Send button markup has Send text and arrow span
  assert.ok(indexHtml.includes('id="btn-chat-send"'), 'Send button must exist');
  assert.ok(indexHtml.includes('<span>Send</span>'), 'Send button must contain Send text span');
  assert.ok(indexHtml.includes('class="send-arrow">↑</span>'), 'Send button must contain send arrow span');
  console.log('[PASS] Send button structure verified with clean label and directional arrow.');

  // Verify API popup modal structure and wiring
  assert.ok(indexHtml.includes('id="onboarding-overlay"'), 'API popup modal must exist');
  assert.ok(indexHtml.includes('class="modal-backdrop onboarding-backdrop"'), 'API popup must be a modal-backdrop');
  assert.ok(indexHtml.includes('id="btn-onboarding-close"'), 'API popup modal header must contain close button');
  assert.ok(indexHtml.includes('id="btn-onboarding-cancel"'), 'API popup modal footer must contain cancel button');
  assert.ok(indexHtml.includes("SidebarUI.openModal('onboarding-overlay')"), 'Header AI engine pill must open API popup modal');
  console.log('[PASS] API Key popup modal and modal controls verified in markup.');

  // Verify OnboardingUI show() and hide() transitions
  OnboardingUI.show();
  const overlayEl = document.getElementById('onboarding-overlay');
  assert.strictEqual(overlayEl.style.display, 'flex', 'OnboardingUI.show() sets display to flex');
  assert.ok(overlayEl.classList.contains('open'), 'OnboardingUI.show() adds open class');

  OnboardingUI.hide();
  assert.strictEqual(overlayEl.style.display, 'none', 'OnboardingUI.hide() sets display to none');
  assert.ok(!overlayEl.classList.contains('open'), 'OnboardingUI.hide() removes open class');
  console.log('[PASS] OnboardingUI modal show() and hide() transitions verified.');

  // Restore fetch
  global.fetch = origFetch;

  console.log('✓ All Onboarding & Theme System unit tests passed cleanly!\n');
})();
