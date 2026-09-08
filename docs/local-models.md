# Open Models Directory & Local Inference Guide

PickyHack features a built-in **Open Models Directory** dedicated to open-weight architectures, featuring full Apache 2.0 and open-source models suitable for completely air-gapped, zero-telemetry penetration testing.

---

## Featured Architecture: OLMoE (Ai2)

**OLMoE (Open Language Model of Experts)** by the Allen Institute for AI is an open-weight Mixture-of-Experts model:
- **Model Tag:** `allenai/OLMoE-1B-7B-0924`
- **Active Parameters:** 1B active per token out of 7B total parameters.
- **License:** **Apache 2.0** (Completely open code, weights, data, and training recipe).
- **Security Use Case:** Ultra-fast local execution on standard consumer hardware, edge laptops, and lightweight pentest jumpboxes without cloud latency or subscription fees.

---

## Master Catalog of Open-Weight Model Families

PickyHack includes native capability profiles for the 10 leading open-weight model families:

| Family | Key Variants | Primary Security Strengths |
| :--- | :--- | :--- |
| **OLMoE** | `OLMoE-1B-7B-0924` | Ultra-fast Apache 2.0 MoE, zero cloud dependency, low VRAM footprint. |
| **Llama (Meta)** | `llama3.3:70b`, `llama3.1:8b` | Strong general reasoning, robust CLI script generation, wide tooling support. |
| **Qwen (Alibaba)** | `qwen2.5-coder:32b`, `qwen2.5:72b` | Elite code audit capability, protocol fuzzing syntax, deep regex construction. |
| **DeepSeek** | `deepseek-r1:70b`, `deepseek-v3` | Advanced chain-of-thought vulnerability root-cause analysis and bypass planning. |
| **Mistral Open-Weights**| `mistral-nemo:12b`, `mixtral-8x7b` | High throughput, strict context adherence, concise technical synthesis. |
| **GPT-OSS (OpenAI)** | `gpt-oss-20b`, `gpt-oss-120b` | Apache 2.0 open-weight research model family released by OpenAI. |
| **Gemma (Google)** | `gemma-2-27b`, `gemma-2-9b` | Concise mathematical and logic validation, lightweight footprint. |
| **GLM (Zhipu)** | `glm-4-9b-chat` | Multi-language security documentation and code analysis. |
| **Phi (Microsoft)** | `phi-4:14b`, `phi-3.5-mini` | High efficiency for edge and low-resource audit workstations. |
| **Nemotron (NVIDIA)** | `nemotron-4-340b-reward` | Data curation, rule-of-engagement alignment, and synthetic reporting. |

---

## Quickstart: Running Local Models with Ollama

1. Install and start Ollama:
   ```bash
   ollama run llama3.3:70b
   # Or run OLMoE / Qwen Coder
   ollama run qwen2.5-coder:32b
   ```
2. Open PickyHack and click **"Multi-API"** in the top bar.
3. Select or add **"Ollama (Local / Air-Gapped)"**.
4. Set Base URL to `http://localhost:11434/v1` and select your active model.
5. Notice the **`[🔒 Network: Local]`** indicator in the chat bar. All queries execute completely offline.
