<p align="center">
  <img src="assets/branding/pickyhack-logo.png" alt="PickyHack Logo" width="220" />
</p>

# PickyHack — Stateless AI Context Harness for Pentesting

> **Stateless by default. Context-driven by design.**  
> *Your model. Your provider. Your context.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Tests: Passing](https://img.shields.io/badge/Tests-7%2F7%20Passing-brightgreen.svg)](tests/)
[![Architecture: Stateless](https://img.shields.io/badge/Architecture-Stateless%20Context%20Harness-blueviolet.svg)](docs/architecture.md)
[![UI: Windows 98](https://img.shields.io/badge/UI-Windows%2098%20Desktop-008080.svg)](#user-interface--retro-experience)
[![Model-Agnostic: BYOM](https://img.shields.io/badge/Models-Model--Agnostic%20%E2%80%A2%20BYOM-orange.svg)](docs/providers.md)

**PickyHack** is a pentest-focused **AI Context Harness** that orchestrates LLMs, project intelligence, web research, and structured security context into a unified offensive-security workspace.

```text
Any Model / Provider (Cloud APIs • Local Runtimes • Custom Endpoints)
                               │
                               ▼
            ┌─────────────────────────────────────┐
            │              PICKYHACK              │
            │                                     │
            │       Stateless Context Harness     │
            │  ─────────────────────────────────  │
            │   Project State    Context Engine   │
            │   Security Intel   Web Research     │
            │   Attack Graph     Burp/ZAP Bridge  │
            │   Token Optimizer  Deliverable PDF  │
            │   Pentest Notes    Context Snapshot │
            └─────────────────────────────────────┘
                               │
                               ▼
                           PENTESTER
```

---

## Website: Coming Soon

The official web portal and documentation showcase for **PickyHack** is currently under development. Stay tuned for live interactive demos, community modules, and enterprise orchestration guides at **[https://pickyhack.io](https://pickyhack.io)**.

---

## What is an AI Context Harness?

**PickyHack is not an LLM.**  
PickyHack is the orchestration layer situated between the penetration tester and the AI model.

A traditional conversational LLM interaction functions as a direct, unmanaged loop:

```text
User ─────────► LLM ─────────► Response
```

In this traditional model, the LLM is expected to remember previous conversation turns, filter signal from noise, retain critical ports and flags, and remain consistent across hundreds of messages. In real-world security engagements, this rapidly breaks down.

PickyHack inserts a dedicated **Context Harness** into the loop:

```text
                       PickyHack Context Harness
                                   │
      ┌────────────────┬───────────┼───────────┬────────────────┐
      │                │           │           │                │
      ▼                ▼           ▼           ▼                ▼
Project State    Attack Graph  Burp/ZAP   Security Intel   Web Research
(Scope/Targets/  (Chains &     (Ingested  (CISA KEV /      (Live Exploits
Findings/Notes)   Bottlenecks)  Traffic)   NVD / EPS)       & PoCs)
      │                │           │           │                │
      └────────────────┴───────────┼───────────┴────────────────┘
                                   ▼
                             Context Engine
                        (Token Pruned & Enriched)
                                   ▼
                                LLM API
                                   ▼
                                Response
```

The **Context Harness** determines *what precise context* must be assembled and delivered to the model so that it answers the current offensive task with high fidelity, zero hallucination, and deep situational awareness.

---

## Core Architecture: Model-Agnostic, Provider-Agnostic, Context-Centric

PickyHack is engineered around three foundational architectural principles:

- **MODEL-AGNOSTIC**: PickyHack does not depend on a closed list of models. Any model exposed through a supported API interface can be used.
- **PROVIDER-AGNOSTIC**: PickyHack connects to any inference service—cloud platforms, local runtimes, or custom proxies.
- **CONTEXT-CENTRIC**: The technical context (scope, boundaries, verified findings, attack chains, credentials, notes) belongs to the mission project, completely decoupled from the model.

### Execution Flow

```text
User
 ↓
PickyHack
 ↓
Context Engine
 ↓
Provider API
 ↓
Selected Model
```

The model can be replaced or hot-swapped at any time without modifying the core of PickyHack.

---

## Provider vs. Model Separation

In PickyHack, **Provider** and **Model** are cleanly separated:

- **Provider**: The API service or local runtime exposing the inference interface.
- **Model**: The exact identifier of the model requested from that API.

### Configuration Example

```text
Provider: Custom / OpenAI-compatible
Base URL: https://api.your-endpoint.internal/v1
Model ID: your-model-id
```

The **Model ID** is freely configurable. PickyHack never imposes a whitelist or locks operators into pre-defined model IDs.

---

## Model Discovery vs. Manual Specification

PickyHack supports both dynamic discovery and manual specification:

- **Dynamic Model Discovery**: If an API endpoint exposes a discovery route (e.g. `GET /v1/models` or local tag listing), PickyHack queries and populates available models automatically.
- **Manual Model Specification**: If the endpoint does not support discovery, or for custom checkpoints and fine-tunes, the operator can manually enter any Model ID via **`[Custom Model / Enter ID...]`**.

> [!TIP]
> A model list facilitates ease of use, but **never** blocks a model not present in the list. Real compatibility is determined by the API interface and provider adapter, not by the model name.

---

## Multi-API: Orchestrating Multiple Engines

The native **Multi-API Manager** allows operators to maintain multiple concurrent engine profiles:

```text
Provider A → Model A        (Primary Analyst)
Provider B → Model B        (Secondary Opinion)
Provider C → Custom Model   (Specialized Fuzzing)
Provider D → Local Model    (Air-Gapped Stealth)
```

- **Switch Engines on the Fly**: Instantly switch the active engine at any moment during an assessment.
- **Zero Context Loss**: Switching providers or models **never** clears the Project State or Context.
- **Principle**: *The context belongs to the project, not to the model.*

---

## The Problem PickyHack Solves

Standard, long-running LLM chat conversations suffer from critical limitations during security assessments:

1. **Context Window Saturation**: Extended terminal dumps and scan logs blow up token limits and increase inference costs.
2. **Loss of Critical Technical Facts**: Subnet ranges, credentials, exact patch levels, and failed exploit attempts vanish under message recency bias.
3. **Provider Lock-in & Painful Switching**: Migrating an active 50-turn chat from one model or provider to another usually requires re-explaining the entire engagement from scratch.
4. **Unreliable Chat Memory**: Chat logs are not databases; they hallucinate or omit structured findings.
5. **Scattered Pentest Data**: Critical proof-of-concepts, remediation guidance, and attack paths remain buried across unrelated dialogue threads.
6. **Accidental Credential Exposure**: API keys, bearer tokens, and hashes pasted during testing risk leaking into exported reports or logs.

PickyHack solves this by enforcing an absolute architectural boundary:

$$\text{Conversation} \neq \text{Pentest State} \neq \text{LLM}$$

---

## Key Pillars & Capabilities

### 1. Modern AI Conversation First
- **Centered Conversational Workspace**: Clean, distraction-free chat canvas with instant command suggestions, Markdown rendering, and code syntax highlighting.
- **Dedicated Copy Actions**: Instant one-click copy for command syntax, code snippets, or full synthesized analysis.
- **Multimodal Artifact Staging**: Drag & drop Nmap outputs, HTTP request logs, PCAPs, and screenshot evidence directly into the chat prompt.

### 2. Universal AI Provider Architecture
- **Bring Your Own Model (BYOM)**: Seamlessly connect Cloud Providers (OpenAI, Anthropic, Google Gemini, Mistral, OpenRouter) or Local Runtimes (Ollama, LM Studio, llama.cpp, vLLM, LiteLLM).
- **Dynamic Model Discovery**: Real-time querying of `/v1/models` to automatically detect capabilities (Vision, Reasoning, Context window, Tool calling).
- **Hot-Swapping with Zero Context Loss**: Switch engines mid-mission without resetting target scope or losing verified findings.
- **"Ask Multiple Models"**: Evaluate a payload or command against multiple frontier models simultaneously with side-by-side comparative cards.

### 3. Open Models

PickyHack can work with a wide range of open and open-weight model families when they are exposed through a supported API interface (e.g. via Ollama, LM Studio, vLLM, LiteLLM, or custom inference servers).

Examples of model families that can be used with PickyHack include:

- **OLMoE** (Allen Institute for AI)
- **Llama**
- **Qwen**
- **DeepSeek**
- **Mistral / Mixtral**
- **Gemma**
- **GLM**
- **Phi**
- **Nemotron**
- **GPT-OSS**
- *and many others.*

> [!IMPORTANT]
> **This list is illustrative, not exhaustive.**  
> The model catalog is not a whitelist. PickyHack does not depend on a closed list of models. Any compatible model can be configured manually through Custom Model / Custom Provider. Real compatibility is determined by the API interface and the provider adapter, not by the model name.

Local engines automatically display the **`[🔒 Network: Local]`** indicator, certifying zero cloud egress.

### 4. Advanced Graph-Based Attack Simulation
- **Interactive Breach Topology**: Visualizes network pathways from unauthenticated Initial Access to internal Crown Jewels.
- **Bottleneck & Choke Point Detection**: Automatically computes defensive choke points whose remediation severs 100% of breach paths.
- **Real-Time Telemetry**: Calculates breach probability percentages, hop distances, and estimated adversary dwell time.

### 5. In-Memory Context Window Optimizer
- **Semantic Noise Pruning**: Automatically strips repetitive ASCII banners, redundant Nmap host statistics, and verbose HTTP headers.
- **Turn Compression**: Compresses older conversational turns while preserving verified findings, credentials, and open ports.
- **Live Token Budget Meter**: Real-time visual tracking of token consumption and headroom.

### 6. Automated Burp Suite & OWASP ZAP Ingestion Bridge
- **Universal Scanner Ingestion**: Upload Burp Suite XML/JSON or OWASP ZAP JSON export files via drag-and-drop.
- **Automated EPS Scoring**: Calculates Exploitability Priority Scores (0–100) based on severity, exploitability, and CISA KEV correlation.
- **Batch Registration**: Selectively promote scanner issues into live mission findings with a single click.

### 7. Export to Formal Pentest Deliverables
- **Multi-Format Export**: Generates client-ready reports in **Print-to-PDF**, **Markdown (`.md`)**, and **Self-Contained HTML**.
- **Comprehensive Structure**: Executive Summary, CVSS/EPS Risk Matrix, Technical Vulnerability Dossiers with PoCs, and 24h/7d/30d Remediation Roadmaps.
- **Automated Credential Redaction**: Enforces automated scanning via `SecuritySanitizer` prior to file export.

### 8. Defensive Security-by-Design
- **Automated Secret Sanitizer (`src/security/sanitizer.js`)**: Real-time regex scanner that redacts OpenAI, Anthropic, Gemini, OpenRouter, and AWS keys, private key blocks, bearer tokens, and password fields.
- **Strict Input Validator (`src/security/validator.js`)**: Blocks dangerous executables (`.exe`, `.sh`, `.py`, `.bat`), enforces file quotas (5 MB per file, 15 MB total), and neutralizes path traversal (`../`) and null bytes (`%00`).
- **SSRF Hardening**: Bars cloud metadata endpoints (`169.254.169.254`, `metadata.google.internal`) from network dispatch.

---

## User Interface & Retro Experience

PickyHack wraps high-powered offensive AI workflows inside an authentic, fully functional **Windows 98 Multi-Window Workstation**:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ PickyHack 98 Workstation — [Target: vpn.megacorp.internal]             _ □ ✕│
├─────────────────────────────────────────────────────────────────────────────┤
│ File  Edit  View  Targets  Findings  Intelligence  Notes  Multi-API  Help   │
├─────────────────────────────────────────────────────────────────────────────┤
│ [🎯 Scope] [📋 Findings] [📡 CVE KEV] [⛓️ Chains] [📝 Notes] [Multi-API]   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                        ╔═══════════════════════════╗                        │
│                        ║      What we hack ?       ║                        │
│                        ║ Define your target below  ║                        │
│                        ╚═══════════════════════════╝                        │
│                                                                             │
│   [🎯 Target & Scope]  [⚡ Web Pentest]  [⛓️ Attack Path]  [📝 Notes.txt]   │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ 🤖 [PICKYHACK AI • selected-model]                                      │ │
│ │ Target vpn.megacorp.internal is running PAN-OS 10.2.7.                  │ │
│ │ Critical vuln detected: CVE-2024-3400 (CVSS 10.0, EPS 99/100, KEV: YES) │ │
│ │                                                                         │ │
│ │ [ 🔍 View CVE-2024-3400 ] [ ⛓️ Attack Path ] [ 📝 Send to Notes ]        │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ [📎 +] [Ask PickyHack a question or run a command...]         [Send] [⚖️Comp]│
├─────────────────────────────────────────────────────────────────────────────┤
│ ⊞ Start │ 🤖 PickyHack AI │ 📝 Notes.txt │ 📡 CISA KEV │  🤖 active-model  │
└─────────────────────────────────────────────────────────────────────────────┘
```

- **Draggable & 8-Direction Resizable Windows**: Authentic window chrome, minimize/maximize/restore, and persistent geometry memory.
- **Dynamic Taskbar & Start Menu**: Active window buttons with focus management and instant application launching.
- **Integrated Pentest Notes (`Notes.txt`)**: Live scratchpad with one-click conversion of text into verified findings.

---

## Project Structure (The 2-Minute Rule)

PickyHack follows a clean, developer-friendly architecture where responsibilities are cleanly separated:

```text
pickyhack/
├── src/
│   ├── config/
│   │   ├── app-config.js          # Global app configurations and defaults
│   │   └── providers-catalog.js   # Universal provider taxonomy & Open Models directory
│   ├── core/
│   │   ├── project-state.js       # Reactive project state (targets, findings, notes)
│   │   ├── context-engine.js      # Stateless context packet builder & token estimator
│   │   └── snapshot-manager.js    # Markdown snapshot exporter/restorer
│   ├── security/
│   │   ├── sanitizer.js           # Secret detection & credential redaction engine
│   │   └── validator.js           # File upload validator, path traversal & SSRF guards
│   ├── providers/
│   │   └── provider-registry.js   # Universal Provider Registry, BYOM adapters & discovery
│   ├── modules/
│   │   ├── attack-graph.js        # Graph attack simulator & choke point detector
│   │   ├── token-optimizer.js     # Semantic banner pruner & memory budget manager
│   │   ├── burp-zap-bridge.js     # Burp XML/JSON & OWASP ZAP report parser
│   │   ├── deliverable-generator.js # Formal pentest report generator (PDF/MD/HTML)
│   │   ├── intelligence.js        # Offline CISA KEV & CVE search engine
│   │   └── notes-taker.js         # Pentest scratchpad & finding converter
│   ├── ui/
│   │   ├── window-manager.js      # Windows 98 drag, 8-direction resize & z-index
│   │   ├── desktop-ui.js          # Desktop icons, taskbar buttons, and Start Menu
│   │   ├── popovers.js            # Retro tooltips and hover intelligence popups
│   │   └── chat-ui.js             # Conversational interface, model selector & compare
│   ├── styles/
│   │   ├── index.css              # Master Windows 98 stylesheet
│   │   └── base.css               # Core layout and pixel font declarations
│   ├── backend/
│   │   └── server.py              # Lightweight development server & mock API
│   └── app.js                     # Modular application entrypoint
├── tests/
│   ├── unit/                      # Unit test suites (Sanitizer, Validator, Providers, Context)
│   ├── integration/               # Integration test suites (Deliverables, Simulation)
│   └── run_all.js                 # Zero-dependency automated test runner
├── docs/                          # Technical deep dives and architecture guides
│   ├── architecture.md            # Stateless context harness design
│   ├── providers.md               # Universal Provider System documentation
│   ├── local-models.md            # Open Models Directory & OLMoE local inference
│   ├── security.md                # Security-by-design, sanitization, and SSRF defenses
│   └── development.md             # Developer workflow and contribution manual
├── assets/
│   └── branding/                  # Official user logo and vector assets
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                 # Hardened multi-stage CI & verification gate
│   │   ├── codeql.yml             # CodeQL automated security analysis (JS/Python)
│   │   └── dependency-review.yml  # PR dependency vulnerability review
│   ├── ISSUE_TEMPLATE/            # Bug report, feature request & security templates
│   ├── PULL_REQUEST_TEMPLATE.md   # Standardized PR review checklist
│   ├── CODEOWNERS                 # Repository and security component ownership
│   └── dependabot.yml             # Automated weekly dependency updates
├── index.html                     # Application HTML entrypoint
├── server.py                      # Root convenience server launcher
├── package.json                   # Project scripts and metadata
├── LICENSE                        # MIT License
├── SECURITY.md                    # Responsible disclosure & security policy
└── CONTRIBUTING.md                # Code of ethics and contribution guidelines
```

---

## Installation & Quickstart

PickyHack is lightweight, fast, and requires zero complicated build chains.

### 1. Clone & Test
```bash
git clone https://github.com/pickyhack/pickyhack.git
cd pickyhack

# Run the automated security & test suite
npm test
```

### 2. Launch Local Server
```bash
npm run dev
```

Open your browser and navigate to **`http://localhost:8000`** (or `http://localhost:8088`).

### 3. Syntax Verification & Quality Checks
```bash
# Run syntax checks, tests, build verification, and dependency audit
npm run lint
npm test
npm run build
npm run audit
```

---

## Development Workflow

The `main` branch of PickyHack is protected. Direct pushes and forced updates are blocked. Every contribution follows a rigorous, verified pull request pipeline:

1. **Create a branch:** Create a dedicated topic branch from `main` (`git checkout -b feature/my-feature` or `git checkout -b fix/issue-num`).
2. **Make changes:** Keep modifications modular, well-tested, and within the respective `src/` modules.
3. **Run tests:** Verify locally that all checks pass cleanly (`npm run lint && npm test && npm run build && npm run audit`).
4. **Open a Pull Request:** Push your branch and open a PR against `main` using our standardized checklist.
5. **CI runs automatically:** The GitHub Actions CI Gate executes dependency installation, linting, syntax verification across Node and Python, the full 7-suite test matrix, build verification, and dependency security audits.
6. **Review & Discussion:** Team review and resolution of all discussion threads are required.
7. **Merge into main:** Changes are merged with a clean linear history into `main`.

See [CONTRIBUTING.md](CONTRIBUTING.md) for full developer guidelines.

---

## Security

PickyHack is built for offensive security professionals and operates under strict security hygiene:
- **Zero Secrets Policy:** Automated token sanitizer blocks credentials and API keys from leaking into context packets or exports.
- **Push Protection:** Active GitHub secret scanning and push protection prevent accidental commits of keys or credentials.
- **Vulnerability Reporting:** Never report vulnerabilities in public issues. For responsible disclosure instructions and response timelines, please see [SECURITY.md](SECURITY.md) or file a private [GitHub Security Advisory](https://github.com/kalidraco/pickyhack/security/advisories/new).

---

## Documentation Index

- [Architecture & Design Principles](docs/architecture.md)
- [Universal Provider System & BYOM](docs/providers.md)
- [Open Models Directory & OLMoE Guide](docs/local-models.md)
- [Security by Design & Redaction Engine](docs/security.md)
- [Developer & Testing Guide](docs/development.md)
- [Security Policy & Responsible Disclosure](SECURITY.md)
- [Contributing Guidelines](CONTRIBUTING.md)

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
