# PickyHack Architecture Deep Dive

> **Stateless by default. Context-driven by design.**

## Overview

Traditional AI conversational interfaces accumulate thousands of lines of conversational debris across turns. In an offensive security assessment, this leads to token exhaustion, catastrophic hallucinations, context poisoning, and accidental disclosure of sensitive credentials.

**PickyHack introduces the Stateless AI Context Harness.**

Rather than depending on long, lossy chat sessions, PickyHack decouples the **Operational State** from the **Inference Pipeline**. At every turn, PickyHack compiles a structured, token-optimized context packet tailored to the specific operator query, verified findings, target scope, and active attack paths.

```text
  ┌────────────────────────────────────────────────────────┐
  │                 REACTIVE PROJECT STATE                 │
  │  Target Scope • Discovered Assets • Verified Findings  │
  │     Active Attack Chains • In-Memory Operator Notes    │
  └──────────────────────────┬─────────────────────────────┘
                             │ (Real-time synchronization)
                             ▼
  ┌────────────────────────────────────────────────────────┐
  │                STATELESS CONTEXT ENGINE                │
  │                                                        │
  │  1. Injects Security Persona & Operating Rules        │
  │  2. Prunes Raw Scan Banners (Token Optimizer)         │
  │  3. Ranks Findings by Exploitability Priority (EPS)   │
  │  4. Enforces Zero-Secret Redaction (Sanitizer)        │
  └──────────────────────────┬─────────────────────────────┘
                             │ (Clean Context Packet)
                             ▼
  ┌────────────────────────────────────────────────────────┐
  │             UNIVERSAL AI PROVIDER REGISTRY             │
  │                                                        │
  │   Cloud Providers        Local Runtimes      Custom    │
  │   [OpenAI / Anthropic]  [Ollama / LM Studio] [vLLM]    │
  └────────────────────────────────────────────────────────┘
```

---

## Directory Responsibilities (The 2-Minute Rule)

Every file in PickyHack has a single, unambiguous responsibility:

| Path | Purpose |
| :--- | :--- |
| `src/config/` | Application globals, provider definitions, and open-model catalogs. |
| `src/core/` | Reactive mission state (`ProjectState`), context assembly (`ContextEngine`), and snapshot serialization (`SnapshotManager`). |
| `src/security/` | Secret redaction regex engine (`SecuritySanitizer`), input validator (`InputValidator`), and SSRF guards. |
| `src/providers/` | Multi-API provider dispatch, dynamic model discovery, and streaming adapters. |
| `src/modules/` | Specialized pentest tools: `BurpZapBridge`, `AttackGraphSimulator`, `ContextOptimizer`, `DeliverableGenerator`, `NotesTaker`. |
| `src/ui/` | Retro Windows 98 desktop environment, window lifecycle manager, chat UI, and interactive popovers. |
| `src/styles/` | Authentic Windows 98 CSS theme, pixel fonts, and responsive layout. |
| `src/backend/` | Python lightweight telemetry server with CISA KEV and CVE lookup fallbacks. |
| `tests/` | Zero-dependency automated test runner and unit/integration test suites. |
| `docs/` | Comprehensive operational and architecture guides. |
