/**
 * PickyHack — Universal Provider Catalog & Open Models Directory
 * Category structure: Cloud, Local / Self-Hosted, and Custom OpenAI-Compatible
 * Includes Open Models Directory (OLMoE, Llama, Qwen, DeepSeek, Mistral, Gemma, GLM, gpt-oss, Phi, Nemotron)
 */
(function(root) {
  'use strict';

  // ============================================================================
  // 1. UNIVERSAL PROVIDER DIRECTORY
  // ============================================================================
  const PROVIDER_CATALOG = {
    // --- Cloud Providers ---
    openai: {
      id: 'openai',
      name: 'OpenAI',
      category: 'cloud',
      isLocal: false,
      defaultEndpoint: 'https://api.openai.com/v1',
      authType: 'bearer',
      discoveryPath: '/models',
      models: ['gpt-4o', 'gpt-4o-mini', 'o3-mini', 'o1', 'gpt-4.5-preview', 'gpt-4-turbo'],
      capabilities: { text: true, vision: true, tools: true, reasoning: true, streaming: true, contextWindow: 128000 }
    },
    anthropic: {
      id: 'anthropic',
      name: 'Anthropic',
      category: 'cloud',
      isLocal: false,
      defaultEndpoint: 'https://api.anthropic.com/v1',
      authType: 'custom-header',
      authHeader: 'x-api-key',
      discoveryPath: '/models',
      models: ['claude-3-7-sonnet-20250219', 'claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022'],
      capabilities: { text: true, vision: true, tools: true, reasoning: true, streaming: true, contextWindow: 200000 }
    },
    gemini: {
      id: 'gemini',
      name: 'Google Gemini',
      category: 'cloud',
      isLocal: false,
      defaultEndpoint: 'https://generativelanguage.googleapis.com/v1beta',
      authType: 'query-or-header',
      discoveryPath: '/models',
      models: ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'],
      capabilities: { text: true, vision: true, tools: true, reasoning: true, streaming: true, contextWindow: 1000000 }
    },
    mistral: {
      id: 'mistral',
      name: 'Mistral AI',
      category: 'cloud',
      isLocal: false,
      defaultEndpoint: 'https://api.mistral.ai/v1',
      authType: 'bearer',
      discoveryPath: '/models',
      models: ['mistral-large-latest', 'codestral-latest', 'ministral-8b-latest', 'pixtral-large-latest'],
      capabilities: { text: true, vision: true, tools: true, reasoning: true, streaming: true, contextWindow: 128000 }
    },
    xai: {
      id: 'xai',
      name: 'xAI Grok',
      category: 'cloud',
      isLocal: false,
      defaultEndpoint: 'https://api.x.ai/v1',
      authType: 'bearer',
      discoveryPath: '/models',
      models: ['grok-2-latest', 'grok-2-vision-1212', 'grok-beta'],
      capabilities: { text: true, vision: true, tools: true, reasoning: false, streaming: true, contextWindow: 131072 }
    },
    cohere: {
      id: 'cohere',
      name: 'Cohere',
      category: 'cloud',
      isLocal: false,
      defaultEndpoint: 'https://api.cohere.com/v2',
      authType: 'bearer',
      discoveryPath: '/models',
      models: ['command-r-plus', 'command-r', 'command-light'],
      capabilities: { text: true, vision: false, tools: true, reasoning: false, streaming: true, contextWindow: 128000 }
    },
    deepseek: {
      id: 'deepseek',
      name: 'DeepSeek',
      category: 'cloud',
      isLocal: false,
      defaultEndpoint: 'https://api.deepseek.com/v1',
      authType: 'bearer',
      discoveryPath: '/models',
      models: ['deepseek-chat', 'deepseek-reasoner'],
      capabilities: { text: true, vision: false, tools: true, reasoning: true, streaming: true, contextWindow: 64000 }
    },
    openrouter: {
      id: 'openrouter',
      name: 'OpenRouter',
      category: 'cloud',
      isLocal: false,
      defaultEndpoint: 'https://openrouter.ai/api/v1',
      authType: 'bearer',
      discoveryPath: '/models',
      models: ['deepseek/deepseek-r1', 'anthropic/claude-3.7-sonnet', 'openai/gpt-4o', 'meta-llama/llama-3.3-70b-instruct'],
      capabilities: { text: true, vision: true, tools: true, reasoning: true, streaming: true, contextWindow: 128000 }
    },
    groq: {
      id: 'groq',
      name: 'Groq',
      category: 'cloud',
      isLocal: false,
      defaultEndpoint: 'https://api.groq.com/openai/v1',
      authType: 'bearer',
      discoveryPath: '/models',
      models: ['llama-3.3-70b-versatile', 'deepseek-r1-distill-llama-70b', 'mixtral-8x7b-32768'],
      capabilities: { text: true, vision: false, tools: true, reasoning: true, streaming: true, contextWindow: 128000 }
    },
    together: {
      id: 'together',
      name: 'Together AI',
      category: 'cloud',
      isLocal: false,
      defaultEndpoint: 'https://api.together.xyz/v1',
      authType: 'bearer',
      discoveryPath: '/models',
      models: ['meta-llama/Llama-3.3-70B-Instruct-Turbo', 'Qwen/Qwen2.5-72B-Instruct-Turbo', 'deepseek-ai/DeepSeek-R1'],
      capabilities: { text: true, vision: false, tools: true, reasoning: true, streaming: true, contextWindow: 131072 }
    },
    fireworks: {
      id: 'fireworks',
      name: 'Fireworks AI',
      category: 'cloud',
      isLocal: false,
      defaultEndpoint: 'https://api.fireworks.ai/inference/v1',
      authType: 'bearer',
      discoveryPath: '/models',
      models: ['accounts/fireworks/models/llama-v3p3-70b-instruct', 'accounts/fireworks/models/deepseek-r1'],
      capabilities: { text: true, vision: false, tools: true, reasoning: true, streaming: true, contextWindow: 128000 }
    },
    alibaba: {
      id: 'alibaba',
      name: 'Alibaba Cloud (DashScope)',
      category: 'cloud',
      isLocal: false,
      defaultEndpoint: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1',
      authType: 'bearer',
      discoveryPath: '/models',
      models: ['qwen-plus', 'qwen-max', 'qwen-turbo', 'qwen2.5-coder-32b-instruct'],
      capabilities: { text: true, vision: true, tools: true, reasoning: false, streaming: true, contextWindow: 131072 }
    },

    // --- Local / Self-Hosted Providers ---
    ollama: {
      id: 'ollama',
      name: 'Ollama',
      category: 'local',
      isLocal: true,
      defaultEndpoint: 'http://localhost:11434/v1',
      authType: 'none',
      discoveryPath: '/models',
      tagsPath: 'http://localhost:11434/api/tags',
      models: ['llama3.3:70b', 'qwen2.5-coder:32b', 'deepseek-r1:70b', 'olmoe:latest', 'mistral:latest', 'gemma2:27b', 'gpt-oss-20b'],
      capabilities: { text: true, vision: false, tools: true, reasoning: false, streaming: true, contextWindow: 32768 }
    },
    lmstudio: {
      id: 'lmstudio',
      name: 'LM Studio',
      category: 'local',
      isLocal: true,
      defaultEndpoint: 'http://localhost:1234/v1',
      authType: 'none',
      discoveryPath: '/models',
      models: ['qwen2.5-coder-32b-instruct', 'deepseek-r1-distill-qwen-32b', 'llama-3.3-70b-instruct', 'olmoe-1b-7b'],
      capabilities: { text: true, vision: false, tools: true, reasoning: false, streaming: true, contextWindow: 32768 }
    },
    llamacpp: {
      id: 'llamacpp',
      name: 'llama.cpp Server',
      category: 'local',
      isLocal: true,
      defaultEndpoint: 'http://localhost:8080/v1',
      authType: 'none',
      discoveryPath: '/models',
      models: ['default', 'qwen2.5-coder', 'llama-3.3', 'olmoe'],
      capabilities: { text: true, vision: false, tools: true, reasoning: false, streaming: true, contextWindow: 32768 }
    },
    vllm: {
      id: 'vllm',
      name: 'vLLM',
      category: 'local',
      isLocal: true,
      defaultEndpoint: 'http://localhost:8000/v1',
      authType: 'bearer',
      discoveryPath: '/models',
      models: ['meta-llama/Llama-3.3-70B-Instruct', 'Qwen/Qwen2.5-72B-Instruct', 'allenai/OLMoE-1B-7B-0924'],
      capabilities: { text: true, vision: false, tools: true, reasoning: false, streaming: true, contextWindow: 65536 }
    },
    localai: {
      id: 'localai',
      name: 'LocalAI',
      category: 'local',
      isLocal: true,
      defaultEndpoint: 'http://localhost:8080/v1',
      authType: 'none',
      discoveryPath: '/models',
      models: ['gpt-4', 'llama-3.3', 'mistral'],
      capabilities: { text: true, vision: false, tools: true, reasoning: false, streaming: true, contextWindow: 32768 }
    },

    // --- Custom Provider ---
    custom: {
      id: 'custom',
      name: 'Custom OpenAI-compatible',
      category: 'custom',
      isLocal: false,
      defaultEndpoint: 'http://localhost:11434/v1',
      authType: 'bearer',
      discoveryPath: '/models',
      models: ['custom-model'],
      capabilities: { text: true, vision: false, tools: true, reasoning: false, streaming: true, contextWindow: 32768 }
    }
  };

  // ============================================================================
  // 2. OPEN MODELS DIRECTORY (Open-Weight Models)
  // Explicitly distinguished from purely closed commercial APIs
  // ============================================================================
  const OPEN_MODELS_DIRECTORY = [
    {
      lab: 'Allen Institute for AI',
      family: 'OLMoE',
      license: 'Apache 2.0 (Open-Weight MoE)',
      models: [
        { id: 'allenai/OLMoE-1B-7B-0924', name: 'OLMoE-1B-7B', context: '4K', role: 'Fast MoE Reasoning / Edge Pentest', description: 'Fully open-weights 1B active / 7B total Mixture-of-Experts' }
      ]
    },
    {
      lab: 'Meta',
      family: 'Llama',
      license: 'Llama 3.3 Community License',
      models: [
        { id: 'meta-llama/Llama-3.3-70B-Instruct', name: 'Llama 3.3 (70B)', context: '128K', role: 'Primary Offensive Analyst', description: 'Top-tier open-weight reasoning and vulnerability analysis' },
        { id: 'meta-llama/Llama-3.1-405B-Instruct', name: 'Llama 3.1 (405B)', context: '128K', role: 'Deep Architecture Analysis', description: 'Ultra-scale open model for complex multi-stage attack chains' },
        { id: 'meta-llama/Llama-3.1-8B-Instruct', name: 'Llama 3.1 (8B)', context: '128K', role: 'Lightweight / Local Scout', description: 'Extremely fast reconnaissance and Nmap summary parser' }
      ]
    },
    {
      lab: 'Alibaba',
      family: 'Qwen',
      license: 'Apache 2.0 / Qwen License',
      models: [
        { id: 'Qwen/Qwen2.5-Coder-32B-Instruct', name: 'Qwen 2.5 Coder (32B)', context: '128K', role: 'Exploit Writing & Reverse Engineering', description: 'State-of-the-art code audit and PoC synthesis model' },
        { id: 'Qwen/Qwen2.5-72B-Instruct', name: 'Qwen 2.5 (72B)', context: '128K', role: 'General Security Reasoner', description: 'High capability open-weight reasoning across protocols' }
      ]
    },
    {
      lab: 'DeepSeek',
      family: 'DeepSeek',
      license: 'MIT License (Open-Weight)',
      models: [
        { id: 'deepseek-ai/DeepSeek-R1', name: 'DeepSeek-R1', context: '64K', role: 'Deep Lateral Movement Reasoner', description: 'Open-weights reasoning model using chain-of-thought verification' },
        { id: 'deepseek-ai/DeepSeek-V3', name: 'DeepSeek-V3', context: '64K', role: 'Rapid Exploit Evaluator', description: 'Efficient MoE architecture with top-tier technical proficiency' }
      ]
    },
    {
      lab: 'Mistral AI',
      family: 'Mistral Open-Weights',
      license: 'Apache 2.0 (Open-Weight Range)',
      models: [
        { id: 'mistralai/Mistral-Large-Instruct-2411', name: 'Mistral Large 3', context: '128K', role: 'Strategic Threat Intel', description: 'Flagship multilingual reasoning and protocol analysis' },
        { id: 'mistralai/Ministral-8B-Instruct-2410', name: 'Ministral 8B', context: '128K', role: 'Edge Reconnaissance', description: 'Ultra-fast edge model for local scanning pipelines' },
        { id: 'mistralai/Codestral-2501', name: 'Codestral', context: '256K', role: 'Vulnerability Code Review', description: 'Specialized for finding buffer overflows and logic flaws' },
        { id: 'mistralai/Devstral-24B', name: 'Devstral (24B)', context: '128K', role: 'Tool Execution & Scripting', description: 'Optimized for offensive security script synthesis' }
      ]
    },
    {
      lab: 'OpenAI (Open-Weight)',
      family: 'GPT-OSS',
      license: 'Apache 2.0',
      models: [
        { id: 'openai/gpt-oss-120b', name: 'gpt-oss-120b', context: '128K', role: 'Heavyweight Autonomous Agent', description: 'OpenAI official Apache 2.0 open-weight model' },
        { id: 'openai/gpt-oss-20b', name: 'gpt-oss-20b', context: '64K', role: 'Local Workstation Copilot', description: 'Efficient open-weight model runnable on consumer GPUs' }
      ]
    },
    {
      lab: 'Google',
      family: 'Gemma',
      license: 'Gemma Terms of Use',
      models: [
        { id: 'google/gemma-2-27b-it', name: 'Gemma 2 (27B)', context: '8K', role: 'Precision Protocol Decoder', description: 'Google open-weight model with rigorous architectural safety' },
        { id: 'google/gemma-2-9b-it', name: 'Gemma 2 (9B)', context: '8K', role: 'Fast Log Parser', description: 'Compact model ideal for Burp Suite HTTP parsing' }
      ]
    },
    {
      lab: 'Z.ai',
      family: 'GLM',
      license: 'Open-Weight (Z.ai License)',
      models: [
        { id: 'THUDM/glm-4-9b-chat', name: 'GLM-4 (9B)', context: '128K', role: 'Bilingual Reconnaissance & Audit', description: 'Extensive context window and fast inference speed' }
      ]
    },
    {
      lab: 'Microsoft',
      family: 'Phi',
      license: 'MIT License',
      models: [
        { id: 'microsoft/phi-4', name: 'Phi-4 (14B)', context: '16K', role: 'Compact Math & Logic Auditing', description: 'Advanced synthetic dataset reasoning in a small footprint' }
      ]
    },
    {
      lab: 'NVIDIA',
      family: 'Nemotron',
      license: 'NVIDIA Open Model License',
      models: [
        { id: 'nvidia/Llama-3.1-Nemotron-70B-Instruct', name: 'Nemotron 70B', context: '128K', role: 'Enterprise Alignment & Threat Intel', description: 'Reinforcement-learning tuned for high accuracy outputs' }
      ]
    }
  ];

  const ExportObject = {
    PROVIDER_CATALOG,
    OPEN_MODELS_DIRECTORY
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExportObject;
  } else {
    root.ProvidersCatalog = ExportObject;
    root.AI_PROVIDERS = PROVIDER_CATALOG; // Backward compatibility alias
  }
})(typeof window !== 'undefined' ? window : global);
