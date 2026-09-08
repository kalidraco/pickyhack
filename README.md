<p align="center">
  <img src="assets/pickyhack-logo.png" alt="PickyHack Logo" width="220" />
</p>

# PickyHack — Stateless AI Context Harness for Pentesting

> **Stateless by default. Context-driven by design.**

**PickyHack** is a pentest-focused **AI Context Harness** that orchestrates LLMs, project intelligence, web research, and structured security context into a unified offensive-security workspace.

```text
ANY LLM (OpenAI • Claude • Gemini • Mistral • Ollama • Custom)
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
6. **No Clean Portability**: Impossible to hand off a structured mission state to another teammate or another AI agent cleanly.

PickyHack solves this by enforcing an absolute architectural boundary:

$$\text{Conversation} \neq \text{Pentest State} \neq \text{LLM}$$

---

## Stateless & Logless by Design

PickyHack is engineered from the ground up **not to depend on a persistent server-side conversation history**.

The chat interface is treated as a **temporary working session**:

```text
Chat Session
│
├── User messages & multimodal attachments
├── AI responses & comparative cards
└── Temporary conversation context
```

When you reload the page, close your browser, or end an assessment, the chat history may reset. **This behavior is intentional and by design.**

The continuity of your offensive operation does **not** rely on ephemeral chat logs. It relies strictly on two persistent pillars:
1. **The Structured Project State** (Live scope, assets, findings, attack paths, notes, attack graphs).
2. **The Context Snapshot** (Portable, self-contained mission packets).

---

## Important Architectural Distinction

| Concept | Nature | Purpose |
| :--- | :--- | :--- |
| **Stateless Chat** | Ephemeral / Temporary | Rapid interactive dialogue, command ideation, multimodal artifact inspection, and reasoning. Never treated as a permanent database. |
| **Project State** | Structured / Persistent | Dedicated operational registry tracking targets, scope, open ports, fingerprinted services, validated findings, attack graph models, Burp/ZAP imports, and notes. |
| **Context Snapshot** | Portable / Autonomous | Self-contained markdown prompt encapsulating the entire engagement state for instant resume anywhere. |

```text
Temporary Conversation & Attachments
                 │
                 ▼
          Context Engine (Token Pruned)
                 │
                 ▼
      Structured Project State
                 │
                 ▼
          Context Snapshot
                 │
                 ▼
Portable AI Context (Ready for Any Model / Any Session)
```

---

## Context Snapshot: Zero Loss Mission Continuity

The **`[ Save Snapshot ]`** mechanism extracts the entire operational state of the mission and formats it into an immutable, portable context prompt.

```text
==================================================
=== PICKYHACK CONTEXT SNAPSHOT ===
==================================================
TARGET: vpn.megacorp.internal
SCOPE: 198.51.100.0/24, *.megacorp.internal
OBJECTIVES: Perimeter breach, credential harvesting, AD foothold
DISCOVERED ASSETS: 198.51.100.10, vpn.megacorp.internal
SERVICES: HTTPS (443), GlobalProtect PAN-OS 10.2.7
FINDINGS: CVE-2024-3400 (Critical, CVSS 10.0, EPS 99/100, KEV Listed)
EVIDENCE: Command injection verified via curl /ssl-vpn/...
ATTACK PATHS: Initial Access (CVE-2024-3400) -> Root Shell -> Dumping Hashes
FAILED TESTS: Port 8443 not vulnerable to CVE-2023-3519
DECISIONS & NEXT STEPS: Pivot to internal Active Directory subnet
==================================================
=== END PICKYHACK CONTEXT SNAPSHOT ===
```

### What a Snapshot Contains:
- **Core Mission**: Target, scope, constraints, assessment rules, priorities.
- **Attack Surface**: Discovered hosts, domain controllers, open ports, services, exact software versions.
- **Vulnerabilities & Intelligence**: Correlated CVEs, CVSS scores, CISA KEV flags, public PoC references, EPS scores.
- **Evidence & Findings**: Validated vulnerabilities, severity ratings, proof-of-concept outputs, remediation steps.
- **Attack Graph & Breach Paths**: Multi-stage vectors (`Initial Access → Foothold → Lateral Movement → Crown Jewels`) with bottleneck choke-points.
- **Negative Intelligence**: Tested exploits that failed, patched endpoints, eliminating duplicate effort.
- **Operational Notes**: Raw command lines, hypotheses, captured flags, and tactical decisions.
- **Security Guarantee**: **API keys, secrets, and private credentials are NEVER included in Snapshots.**

---

## Model-Agnostic & Multi-API

PickyHack is **not a wrapper around a single provider**. You bring your own API keys or point to your own local infrastructure.

```text
               PickyHack Context Harness
                          │
                          ▼
                     LLM Adapter
                          │
       ┌──────────┬───────┴───────┬──────────┐
       ▼          ▼               ▼          ▼
    OpenAI    Anthropic        Google      Local / Ollama
   (GPT-4o)  (Claude 3.7)   (Gemini 2.5)   (llama3.3:70b)
```

### Multi-API & Multi-Model Manager (`#win-multi-api`)
Configure and maintain multiple engine profiles simultaneously:
- **OpenAI**: `gpt-4o`, `o3-mini`, `o1`
- **Anthropic**: `claude-3-7-sonnet`, `claude-3-5-sonnet`
- **Google Gemini**: `gemini-2.5-pro`, `gemini-2.5-flash`
- **Mistral AI**: `mistral-large`, `codestral`
- **OpenRouter**: Multi-model routing gateway
- **Custom / Local**: Self-hosted Ollama, LM Studio, vLLM (`http://localhost:11434/v1`)

### Switching Models on the Fly Without Context Loss
Switching from **GPT-4o** to **Claude 3.7** or **Gemini 2.5 Pro** takes a single click via the dock model pill (`#dock-model-pill`). 

Because the mission context is maintained inside the **Context Harness** and not trapped inside the vendor's chat thread:
1. `GPT-4o` analyzes initial port scans and Burp Suite XML imports.
2. Discovery updates the **Project State**.
3. You switch active model to `Claude 3.7 (Deep Reasoning)`.
4. Your next prompt automatically receives the full project context, scope, and findings.
5. **No history re-upload needed, zero context lost.**

### "Ask Multiple Models" (Parallel Comparison)
Click **`[ ⚖️ Compare ]`** in the chat dock to broadcast a complex exploit question to 2 or more configured models simultaneously. PickyHack renders side-by-side comparative cards and provides a **`[ ⚖️ Synthesize Comparison ]`** action for unified consensus.

---

## Advanced Graph-Based Attack Simulation

PickyHack includes a visual, interactive **Attack Graph Simulator** (`#win-chains`) that models complex multi-stage network penetration paths:

```text
[External Attacker]
        │ (CVE-2024-3400 / PAN-OS RCE)
        ▼
[Edge Firewall / VPN]  ──(Stolen Admin SSH Key)──► [Internal Jumpbox]
                                                           │
                                             (Mimikatz Pass-The-Hash)
                                                           ▼
                                                 [Domain Controller] 
                                                  ★ CROWN JEWELS ★
```

### Key Capabilities:
- **Interactive SVG Topology**: Drag and inspect hosts, workstations, services, credentials, and crown jewels.
- **Breach Path Simulation**: Step-by-step traversal from Initial Access to Critical Assets.
- **Choke-Point / Bottleneck Detection**: Automatically detects critical nodes where applying a single mitigation severes 100% of attack paths to crown jewels.
- **Probability & Telemetry Telemetry**: Computes path success probabilities, hop count, and estimated attacker dwell time.
- **Custom Scenarios**: Load pre-built scenarios (Active Directory Forest Breach, Cloud IAM Escalation, Web-to-Internal Pivot) or construct custom targets.

---

## In-Memory Context Window Optimizer (Token Pruning)

Large security audits produce massive scan dumps (Nmap, Nikto, ffuf, Gobuster) that rapidly exhaust LLM context limits and drive up API bills. PickyHack introduces an in-memory **Token Pruning Optimizer**:

```text
Raw Ingestion (14,200 tokens)
            │
            ▼
┌─────────────────────────────────────────┐
│       Token Window Optimizer            │
│  - Strip repetitive ASCII banners       │
│  - Filter closed/filtered port chatter  │
│  - Deduplicate redundant web endpoints  │
│  - Prioritize High/Critical findings    │
└─────────────────────────────────────────┘
            │
            ▼
Optimized Context Packet (1,850 tokens — 87% reduction)
```

- **Live Token Counter**: Real-time token estimator (~4 chars/token) visible in the chat dock (`#token-optimizer-pill`).
- **Semantic Pruning**: Automatic removal of noise while preserving 100% of exploitable indicators, credentials, and open vectors.
- **Interactive Budget Manager**: View token breakdown across Target Scope, Findings, Intelligence, Notes, and Attachments.

---

## Automated Burp Suite / OWASP ZAP Ingestion Bridge

Bridge the gap between proxy tooling and AI orchestration with the **Burp/ZAP Bridge** (`#win-burp-zap-import`):

- **Direct File Ingestion**: Upload or paste Burp Suite XML/JSON issue exports or OWASP ZAP XML/JSON reports.
- **Built-in Sample Loaders**: Instant testing with pre-loaded Burp and ZAP vulnerability payloads.
- **Interactive Issue Grid**: View vulnerability names, paths, severity levels, confidence, and EPS exploitability ratings.
- **1-Click Batch Import**: Seamlessly inject parsed findings directly into the active **Findings Registry** (`#win-findings`) with automated CVE linking and remediation templates.

---

## Export to Formal Pentest Deliverable (PDF / Markdown / HTML)

Turn raw operational state into client-ready deliverables in seconds (`#win-report-export`):

```text
Project State + Findings + PoCs + Remediation
                     │
                     ▼
       ┌───────────────────────────┐
       │   Deliverable Generator   │
       └───────────────────────────┘
         │           │           │
         ▼           ▼           ▼
     Print PDF    Markdown     HTML5
   (Formal Exec   (Git/Wiki    (Stand-alone
     Summary)      Format)      Deliverable)
```

- **Executive Summary & Scope Boundaries**: High-level posture analysis, tested domains, and risk profile.
- **CVSS v3.1 & EPS Risk Matrix**: Tabular breakdown of Critical, High, Medium, and Low severity issues with exploitability scores.
- **Detailed Finding Dossiers**: Affected URLs, CVSS vectors, step-by-step PoC reproduction commands, and technical evidence.
- **Prioritized Remediation Checklist**: Actionable patch matrix categorized by urgency.
- **Browser Print-to-PDF**: Standardized `@media print` layout engineered for paper and PDF output with zero external dependencies.

---

## Window Management & Multimodal File Attachments

### True 8-Direction Windows 98 Resizing
Every window inside PickyHack can be freely manipulated:
- **8-Direction Resizing**: Resize from any border (`n, s, e, w`) or corner (`nw, ne, sw, se`).
- **Memory & Geometry Persistence**: Minimizing, maximizing, and restoring windows preserves custom dimensions in browser `localStorage`.
- **Z-Index Elevation & Boundary Clamping**: Clean desktop organization with zero out-of-bounds overflow.

### Multimodal File Attachments & Drag-and-Drop
- **Instant Drag & Drop**: Drop files anywhere over the chat canvas or click `[ 📎 + ]`.
- **Staging Shelf**: Multi-file preview chips with instant removal (`×`).
- **Vision Model Dispatch**: Automatically dispatches image payloads to multimodal LLMs (OpenAI `gpt-4o`, Claude `claude-3-7-sonnet`, Gemini `gemini-2.5-pro`) and text summaries to text-only engines.
- **1-Click Quick Actions**: Convert attachments to notes (`[ 📝 Send to Notes ]`) or findings (`[ 🎯 Create Finding ]`) directly from chat bubbles.

---

## Features & Implementation Status

| Feature Area | Status | Description |
| :--- | :---: | :--- |
| **AI Context Harness Core** | `[x]` | Stateless orchestration layer between operator and LLM engines |
| **Stateless / Logless Architecture** | `[x]` | Zero server-side conversation logging; client-side temporary sessions |
| **Multi-API Provider Manager** | `[x]` | Configure OpenAI, Claude, Gemini, Mistral, OpenRouter, and Local Ollama |
| **On-the-Fly Model Switching** | `[x]` | Instant model hot-swapping with zero loss of pentest context |
| **"Ask Multiple Models"** | `[x]` | Parallel multi-model evaluation with comparative cards & synthesis |
| **Model Attribution Tags** | `[x]` | Every AI response tagged with originating model (e.g. `[PICKYHACK AI • gpt-4o]`) |
| **Windows 98 Desktop Environment** | `[x]` | Fully functional retro OS: draggable windows, dynamic taskbar, start menu |
| **8-Direction Window Resizing** | `[x]` | Free resize from all 8 borders/corners with persistent geometry memory |
| **Multimodal File Attachments** | `[x]` | Drag & drop, staging shelf, vision dispatch, and log chunking |
| **Target & Scope Management** | `[x]` | Pre-configured scoping templates for external, web, AD, and cloud audits |
| **CVE & CISA KEV Intelligence** | `[x]` | Offline & real-time correlation against 1,600+ actively exploited CVEs |
| **EPS Risk Scoring (0–100)** | `[x]` | Multi-factor Exploitability Priority Score prioritizing weaponized vulns |
| **Attack Path Graph** | `[x]` | Multi-stage visual attack chains (`Initial Access → Root Shell`) |
| **Advanced Graph-Based Attack Simulation** | `[x]` | Interactive SVG breach simulator, choke-point detection & telemetry |
| **In-Memory Token Window Optimizer** | `[x]` | Real-time token estimator, semantic noise pruning & budget manager |
| **Automated Burp / OWASP ZAP Bridge** | `[x]` | Direct ingestion of proxy scans with EPS calculation and batch import |
| **Formal Deliverable Export (PDF/MD/HTML)**| `[x]` | Client-ready pentest reports with Executive Summary & Risk Matrix |
| **Nuclei Studio** | `[x]` | Generates ready-to-run Nuclei YAML vulnerability detection templates |
| **Notes.txt (Pentest Note Taker)** | `[x]` | Native scratchpad with 1-click finding conversion & autosave |
| **Context Snapshot (Export/Import)** | `[x]` | Self-contained, portable markdown snapshots for session continuity |
| **One-Click Code & Response Copy** | `[x]` | Dedicated copy buttons on all code blocks and markdown answers |

---

## User Interface & Retro Experience

PickyHack wraps high-powered offensive AI workflows inside a lightweight, nostalgic **Windows 98 Multi-Window Workstation**:

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

- **Draggable & 8-Direction Resizable Windows**: Multi-tasking workspace with proper z-index elevation and active/inactive window states.
- **Dynamic Taskbar**: Real-time window buttons that minimize, restore, and toggle focus.
- **Start Menu & Desktop Icons**: Instant access to all pentest tools, settings, Burp/ZAP ingestion, attack simulator, and report generator.
- **Native Notes.txt**: Real-time note-taking with instant finding extraction and template insertion.

---

## Installation & Setup

PickyHack is lightweight, fast, and requires zero complicated build chains.

### Prerequisites
- **Git**
- **Modern Web Browser** (Chrome, Firefox, Safari, Edge, Brave)
- **Node.js (v18+)** *or* **Python 3**

### 1. Clone the Repository
```bash
git clone https://github.com/kalidraco/pickyhack.git
cd pickyhack
```

### 2. Configure Environment (Optional)
```bash
cp .env.example .env
```
*(Note: You can also configure all API keys directly in the browser UI via `[ Multi-API ]` without touching files).*

### 3. Launch the Application

#### Option A: Node.js (Recommended)
```bash
npm install
npm run dev
```
Navigate to: **`http://localhost:8088`**

#### Option B: Python 3
```bash
python3 -m http.server 8088
```
Navigate to: **`http://localhost:8088`**

#### Option C: Direct Browser Launch (Offline Standby)
Simply double-click `index.html` or run:
```bash
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows
```

---

## Configuration

PickyHack supports both external cloud models and local air-gapped instances.

### Supported Providers

| Provider | Supported Models | Base URL | Multimodal Vision |
| :--- | :--- | :--- | :---: |
| **OpenAI** | `gpt-4o`, `o3-mini`, `o1`, `gpt-4-turbo` | `https://api.openai.com/v1` | `[x]` |
| **Anthropic** | `claude-3-7-sonnet-20250219`, `claude-3-5-sonnet` | `https://api.anthropic.com/v1` | `[x]` |
| **Google Gemini** | `gemini-2.5-pro`, `gemini-2.5-flash` | `https://generativelanguage.googleapis.com/v1beta` | `[x]` |
| **Mistral AI** | `mistral-large-latest`, `codestral-latest` | `https://api.mistral.ai/v1` | `[ ]` (Text) |
| **OpenRouter** | `deepseek/deepseek-r1`, `meta-llama/llama-3.3-70b` | `https://openrouter.ai/api/v1` | Model-dependent |
| **Custom / Local** | `llama3.3:70b`, `qwen2.5-coder:32b`, `mistral` | `http://localhost:11434/v1` | Engine-dependent |

### Environment Variables Template (`.env.example`)
```env
PORT=8088
AI_PROVIDER=openai
# OPENAI_API_KEY=sk-...
# ANTHROPIC_API_KEY=sk-ant-...
# GEMINI_API_KEY=AIzaSy...
# MISTRAL_API_KEY=...
# OPENROUTER_API_KEY=sk-or-...
# LOCAL_LLM_ENDPOINT=http://localhost:11434/v1
```

---

## Security & Privacy Guidelines

> [!IMPORTANT]
> **PickyHack is engineered strictly for authorized security professionals.**  
> Only test systems for which you have explicit, written authorization.

- **Zero Secrets in Git**: Never commit `.env` files, API keys, credentials, or client test data.
- **Client-Side Storage**: API keys entered into the Multi-API Manager are stored in your browser's private `localStorage`. They are never dispatched to any third-party logging server.
- **Snapshot Hygiene**: Context Snapshots contain sensitive target intelligence (IP addresses, exposed services, vulnerability details). Treat exported `.md` snapshots with the same care as pentest reports.
- **No Conversation Logging**: By default, PickyHack does not log queries or responses to remote databases.

---

## Roadmap

- [x] AI Context Harness Core
- [x] Stateless / Logless Architecture
- [x] Multi-API & Provider Configuration
- [x] On-the-Fly Model Switching (Zero Context Loss)
- [x] "Ask Multiple Models" Parallel Evaluation
- [x] Windows 98 Multi-Window Workstation & Dynamic Taskbar
- [x] 8-Direction Resizable Windows with Persistent Memory
- [x] Multimodal File Attachments & Drag-and-Drop
- [x] Target & Scope Management Templates
- [x] CISA KEV Intelligence & EPS Risk Scoring
- [x] Exploit Attack Path Synthesis
- [x] Advanced Graph-Based Attack Simulation
- [x] In-Memory Context Window Optimizer (Token Pruning)
- [x] Automated Burp Suite / OWASP ZAP Ingestion Bridge
- [x] Export to Formal Pentest Deliverable (PDF / Markdown / HTML)
- [x] Nuclei Studio (YAML Automation)
- [x] Native Pentest Note Taker (`Notes.txt`)
- [x] Context Snapshot (Export / Import / Copy)

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
