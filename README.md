<p align="center">
  <img src="assets/branding/pickyhack-logo.png" alt="PickyHack Logo" width="220" />
</p>

# PickyHack — Stateless AI Context Harness for Pentesting

> **Stateless by default. Context-driven by design.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Tests: Passing](https://img.shields.io/badge/Tests-6%2F6%20Passing-brightgreen.svg)](tests/)
[![Architecture: Stateless](https://img.shields.io/badge/Architecture-Stateless%20Context%20Harness-blueviolet.svg)](docs/architecture.md)
[![UI: Windows 98](https://img.shields.io/badge/UI-Windows%2098%20Desktop-008080.svg)](#user-interface--retro-experience)
[![Open Models: OLMoE Ready](https://img.shields.io/badge/Open%20Models-OLMoE%20%E2%80%A2%20Llama%20%E2%80%A2%20Qwen-orange.svg)](docs/local-models.md)

**PickyHack** is a pentest-focused **AI Context Harness** that orchestrates LLMs, project intelligence, web research, and structured security context into a unified offensive-security workspace.

```text
ANY LLM (OpenAI • Anthropic • Gemini • Mistral • Ollama • OLMoE • Custom)
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

## The Problem PickyHack Solves

Standard, long-running LLM chat conversations suffer from critical limitations during security assessments:

1. **Context Window Saturation**: Extended terminal dumps and scan logs blow up token limits and increase inference costs.
2. **Loss of Critical Technical Facts**: Subnet ranges, credentials, exact patch levels, and failed exploit attempts vanish under message recency bias.
3. **Provider Lock-in & Painful Switching**: Migrating an active 50-turn chat from GPT-4o to Claude 3.7 or Gemini 2.5 Pro usually requires re-explaining the entire engagement from scratch.
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

### 3. Open Models Directory (Featuring OLMoE)
PickyHack includes native capability profiles and local privacy flags for leading open-weight architectures:
- **OLMoE (Allen Institute for AI)**: 1B-active / 7B-total Mixture-of-Experts released under **Apache 2.0**. Extremely fast on laptops and local jumpboxes.
- **Llama 3.3 (Meta)**: Heavyweight reasoning and tool orchestration.
- **Qwen 2.5 Coder (Alibaba)**: Elite script synthesis and protocol fuzzing.
- **DeepSeek R1 / V3**: Advanced chain-of-thought vulnerability root-cause analysis.
- **Mistral Open-Weights (Nemo & Mixtral)**: High throughput and concise technical summaries.
- **GPT-OSS (OpenAI)**: Apache 2.0 open-weight research models (`gpt-oss-20b`, `gpt-oss-120b`).
- **Gemma, GLM, Phi, Nemotron**: Native capability detection and prompt tuning.

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
│ │ 🤖 [PICKYHACK AI • gpt-4o]                                              │ │
│ │ Target vpn.megacorp.internal is running PAN-OS 10.2.7.                  │ │
│ │ Critical vuln detected: CVE-2024-3400 (CVSS 10.0, EPS 99/100, KEV: YES) │ │
│ │                                                                         │ │
│ │ [ 🔍 View CVE-2024-3400 ] [ ⛓️ Attack Path ] [ 📝 Send to Notes ]        │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ [📎 +] [Ask PickyHack a question or run a command...]         [Send] [⚖️Comp]│
├─────────────────────────────────────────────────────────────────────────────┤
│ ⊞ Start │ 🤖 PickyHack AI │ 📝 Notes.txt │ 📡 CISA KEV │  🤖 gpt-4o  14:40  │
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
│   ├── workflows/ci.yml           # Automated GitHub Actions test workflow
│   ├── ISSUE_TEMPLATE/            # Bug report & feature request templates
│   └── PULL_REQUEST_TEMPLATE.md   # Standardized PR review checklist
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

### 3. Syntax Verification
```bash
npm run check
```

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
