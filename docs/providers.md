# Universal AI Provider System

PickyHack embraces the **Bring Your Own Model (BYOM)** paradigm:
> *Your model. Your provider. Your context.*

No vendor lock-in. PickyHack does not hardcode a closed list of AI models. Instead, it treats model providers as configurable compute endpoints categorized into three distinct operational tiers.

---

## Provider Architecture Tiers

### 1. Cloud Providers
High-capacity frontier models for complex multi-step reasoning, external threat intelligence synthesis, and deep code analysis.
- **OpenAI:** GPT-4o, GPT-4o-mini, o1, o3-mini, GPT-4 Turbo.
- **Anthropic:** Claude 3.7 Sonnet (Hybrid Reasoning), Claude 3.5 Sonnet, Claude 3.5 Haiku.
- **Google Gemini:** Gemini 2.5 Pro (1M context), Gemini 2.5 Flash, Gemini 1.5 Pro.
- **Mistral AI:** Mistral Large 2, Codestral, Pixtral Large.
- **OpenRouter:** Universal router to 200+ hosted models with unified API keys.

### 2. Local & Air-Gapped Runtimes
For sensitive assessments, proprietary customer source code, or engagements under strict NDAs where external data transfer is prohibited.
- **Ollama:** Default endpoint `http://localhost:11434/v1`.
- **LM Studio:** Default endpoint `http://localhost:1234/v1`.
- **llama.cpp / server:** Default endpoint `http://localhost:8080/v1`.
- **vLLM / TGI:** High-throughput server endpoints.
- **LiteLLM / Ollama Proxy:** Unified local multiplexers.

All local engines receive the `[🔒 Network: Local]` privacy badge in the UI, certifying that prompt data remains strictly on the operator's machine.

### 3. Custom / OpenAI-Compatible
Any endpoint implementing the standard `/v1/chat/completions` and `/v1/models` specification. Operators can specify custom base URLs, custom authentication headers, and arbitrary model IDs.

---

## Dynamic Model Discovery

PickyHack includes dynamic model auto-discovery (`GET /v1/models` and provider-specific discovery APIs):
- Click **"Fetch Models"** in the **Multi-API Manager** dialog.
- PickyHack queries the endpoint in real time and populates the model dropdown with active deployment tags.
- Model capabilities (Context window length, Vision support, Tool calling, Reasoning tokens) are detected automatically.
