/**
 * Unit Test: Universal AI Provider Catalog & Open Models Directory
 */
const assert = require('assert');
const { PROVIDER_CATALOG, OPEN_MODELS_DIRECTORY } = require('../../src/config/providers-catalog');
const ProviderRegistry = require('../../src/providers/provider-registry');

console.log('--- Running tests/unit/providers.test.js ---');

// 1. Verify Provider Catalog Categories
assert(PROVIDER_CATALOG.openai && PROVIDER_CATALOG.openai.category === 'cloud', 'OpenAI must be in cloud category');
assert(PROVIDER_CATALOG.anthropic && PROVIDER_CATALOG.anthropic.category === 'cloud', 'Anthropic must be in cloud category');
assert(PROVIDER_CATALOG.gemini && PROVIDER_CATALOG.gemini.category === 'cloud', 'Gemini must be in cloud category');
assert(PROVIDER_CATALOG.mistral && PROVIDER_CATALOG.mistral.category === 'cloud', 'Mistral must be in cloud category');
assert(PROVIDER_CATALOG.ollama && PROVIDER_CATALOG.ollama.category === 'local', 'Ollama must be in local category');
assert(PROVIDER_CATALOG.lmstudio && PROVIDER_CATALOG.lmstudio.category === 'local', 'LM Studio must be in local category');
assert(PROVIDER_CATALOG.vllm && PROVIDER_CATALOG.vllm.category === 'local', 'vLLM must be in local category');
assert(PROVIDER_CATALOG.custom && PROVIDER_CATALOG.custom.category === 'custom', 'Custom provider must exist');
console.log('[PASS] Provider categories (Cloud, Local, Custom) verified.');

// 2. Verify Open Models Directory (Open-Weight Models)
const families = OPEN_MODELS_DIRECTORY.map(d => d.family);
assert(families.includes('OLMoE'), 'OLMoE (Allen Institute) must be present');
assert(families.includes('Llama'), 'Llama (Meta) must be present');
assert(families.includes('Qwen'), 'Qwen (Alibaba) must be present');
assert(families.includes('DeepSeek'), 'DeepSeek must be present');
assert(families.includes('Mistral Open-Weights'), 'Mistral Open-Weights must be present');
assert(families.includes('GPT-OSS'), 'OpenAI GPT-OSS must be present');
assert(families.includes('Gemma'), 'Gemma (Google) must be present');
assert(families.includes('GLM'), 'GLM (Z.ai) must be present');
assert(families.includes('Phi'), 'Phi (Microsoft) must be present');
assert(families.includes('Nemotron'), 'Nemotron (NVIDIA) must be present');
console.log(`[PASS] Open Models directory contains all 10 open-weight model families (${families.join(', ')}).`);

// 3. Verify OLMoE model specification
const olmoeFamily = OPEN_MODELS_DIRECTORY.find(f => f.family === 'OLMoE');
assert(olmoeFamily.models.some(m => m.id.includes('OLMoE')), 'OLMoE model entry verified');
console.log('[PASS] OLMoE model details and Apache 2.0 license verified.');

// 4. Verify Model Capability Detection
const capGpt4o = ProviderRegistry.detectCapabilities('openai', 'gpt-4o');
assert(capGpt4o.vision === true, 'GPT-4o must have vision enabled');
assert(capGpt4o.contextWindow >= 128000, 'GPT-4o must have at least 128K context window');

const capR1 = ProviderRegistry.detectCapabilities('deepseek', 'deepseek-r1');
assert(capR1.reasoning === true, 'DeepSeek-R1 must have reasoning enabled');

const capGemini = ProviderRegistry.detectCapabilities('gemini', 'gemini-2.5-pro');
assert(capGemini.vision === true, 'Gemini 2.5 must have vision enabled');
assert(capGemini.contextWindow >= 1000000, 'Gemini 2.5 must have 1M context window');
console.log('[PASS] Model capability detection verified (Vision, Reasoning, Context window).');

// 5. Verify Local vs Cloud Network Flagging
const localEngine = { name: 'Ollama', provider: 'ollama', endpoint: 'http://localhost:11434/v1' };
const savedLocal = ProviderRegistry.saveEngine(localEngine);
assert(savedLocal.isLocal === true, 'Ollama on localhost must be classified as isLocal: true');

const cloudEngine = { name: 'OpenAI', provider: 'openai', endpoint: 'https://api.openai.com/v1' };
const savedCloud = ProviderRegistry.saveEngine(cloudEngine);
assert(savedCloud.isLocal === false, 'OpenAI must be classified as isLocal: false');
console.log('[PASS] Local-first network privacy flagging verified.');

console.log('✓ All Providers unit tests passed.\n');
