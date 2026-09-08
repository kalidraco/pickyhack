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
        │   Pentest Workspace Notes.txt       │
        │   Context Snapshots Multi-API       │
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
                ┌──────────────────┼──────────────────┐
                │                  │                  │
                ▼                  ▼                  ▼
          Project State      Security Intel     Web Research
          (Target/Scope/     (CISA KEV / NVD /  (Live Exploits /
          Findings/Notes)     PoC Database)      Write-ups)
                │                  │                  │
                └──────────────────┼──────────────────┘
                                   ▼
                             Context Engine
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
├── User messages
├── AI responses
└── Temporary conversation context
```

When you reload the page, close your browser, or end an assessment, the chat history may reset. **This behavior is intentional and by design.**

The continuity of your offensive operation does **not** rely on ephemeral chat logs. It relies strictly on two persistent pillars:
1. **The Structured Project State** (Live scope, assets, findings, attack paths, notes).
2. **The Context Snapshot** (Portable, self-contained mission packets).

---

## Important Architectural Distinction

| Concept | Nature | Purpose |
| :--- | :--- | :--- |
| **Stateless Chat** | Ephemeral / Temporary | Rapid interactive dialogue, command ideation, and reasoning. Never treated as a permanent database. |
| **Project State** | Structured / Persistent | Dedicated operational registry tracking targets, scope, open ports, fingerprinted services, validated findings, attack paths, and notes. |
| **Context Snapshot** | Portable / Autonomous | Self-contained markdown prompt encapsulating the entire engagement state for instant resume anywhere. |

```text
Temporary Conversation
         │
         ▼
   Context Engine
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
- **Attack Chains**: Multi-stage vectors (`Initial Access → Foothold → Lateral Movement → Privilege Escalation`).
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
1. `GPT-4o` analyzes initial port scans.
2. Discovery updates the **Project State**.
3. You switch active model to `Claude 3.7 (Deep Reasoning)`.
4. Your next prompt automatically receives the full project context, scope, and findings.
5. **No history re-upload needed, zero context lost.**

### "Ask Multiple Models" (Parallel Comparison)
Click **`[ ⚖️ Compare ]`** in the chat dock to broadcast a complex exploit question to 2 or more configured models simultaneously. PickyHack renders side-by-side comparative cards and provides a **`[ ⚖️ Synthesize Comparison ]`** action for unified consensus.

---

## Context Portability Workflow

PickyHack ensures the offensive operator is never captive to a single AI ecosystem:

```text
OpenAI (GPT-4o)
      │
      ▼
PickyHack Context Harness
      │
      ▼
Context Snapshot (.md)
      │
      ▼
Anthropic (Claude 3.7) or Offline Air-Gapped LLM
```

---

## The Context Engine: Operational Workflow

The **Context Engine** is the algorithmic heart of PickyHack:

```text
┌────────────────┐
│   Pentester    │
└───────┬────────┘
        │ Prompt / Action
        ▼
┌────────────────┐
│   PickyHack    │
│   AI Harness   │
└───────┬────────┘
        │
        ├─────────────────────────────┬─────────────────────────────┐
        ▼                             ▼                             ▼
  Project State                Security Intel                  Web Research
(Scope, Findings, Notes)     (CISA KEV, CVEs, EPS)           (PoCs, Write-ups)
        │                             │                             │
        └─────────────────────────────┼─────────────────────────────┘
                                      ▼
                                Context Engine
                                      │ (Retrieval & Assembly)
                                      ▼
                                   LLM API
                                      │ (Inference)
                                      ▼
                                AI Response
                                      │
                                      ▼
                         Structured State Update
```

1. **Request Ingestion**: Analyzes the pentester's query for target references, CVE identifiers, or specific tasks.
2. **Context Retrieval**: Selects relevant assets, active findings, scope constraints, and notes.
3. **Intel Enrichment**: Injects matched CISA KEV vulnerabilities, CVSS scores, and known public exploit vectors.
4. **Assembly**: Compiles a compact, token-efficient packet containing only the relevant intelligence.
5. **Execution**: Dispatches to the active LLM engine.
6. **State Assimilation**: Interactive context chips allow one-click extraction into `Notes.txt`, `Findings`, or `Attack Paths`.

---

## Features & Implementation Status

| Feature Area | Status | Description |
| :--- | :---: | :--- |
| **AI Context Harness** | `[x]` | Stateless orchestration layer between operator and LLM engines |
| **Stateless / Logless Architecture** | `[x]` | Zero server-side conversation logging; client-side temporary sessions |
| **Multi-API Provider Manager** | `[x]` | Configure OpenAI, Claude, Gemini, Mistral, OpenRouter, and Local Ollama |
| **On-the-Fly Model Switching** | `[x]` | Instant model hot-swapping with zero loss of pentest context |
| **"Ask Multiple Models"** | `[x]` | Parallel multi-model evaluation with comparative cards & synthesis |
| **Model Attribution Tags** | `[x]` | Every AI response tagged with originating model (e.g. `[PICKYHACK AI • gpt-4o]`) |
| **Windows 98 Desktop Environment** | `[x]` | Fully functional retro OS: draggable windows, dynamic taskbar, start menu |
| **Target & Scope Management** | `[x]` | Pre-configured scoping templates for external, web, AD, and cloud audits |
| **CVE & CISA KEV Intelligence** | `[x]` | Offline & real-time correlation against 1,600+ actively exploited CVEs |
| **EPS Risk Scoring (0–100)** | `[x]` | Multi-factor Exploitability Priority Score prioritizing weaponized vulns |
| **Attack Path Graph** | `[x]` | Multi-stage visual attack chains (`Initial Access → Root Shell`) |
| **Nuclei Studio** | `[x]` | Generates ready-to-run Nuclei YAML vulnerability detection templates |
| **Notes.txt (Pentest Note Taker)** | `[x]` | Native scratchpad with 1-click finding conversion & autosave |
| **Context Snapshot (Export/Import)** | `[x]` | Self-contained, portable markdown snapshots for session continuity |
| **One-Click Code & Response Copy** | `[x]` | Dedicated copy buttons on all code blocks and markdown answers |
| **Advanced Attack Graph Simulation** | `[ ]` | Graph-based probabilistic lateral movement pathfinder *(Roadmap)* |
| **Automated Token Compression** | `[ ]` | Dynamic semantic pruning for large scan outputs *(Roadmap)* |
| **Burp Suite / ZAP Extension** | `[ ]` | Direct traffic ingestion from security proxy tooling *(Roadmap)* |

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
│ [Ask PickyHack a question or run a command...]               [Send] [⚖️Comp]│
├─────────────────────────────────────────────────────────────────────────────┤
│ ⊞ Start │ 🤖 PickyHack AI │ 📝 Notes.txt │ 📡 CISA KEV │  🤖 gpt-4o  14:40  │
└─────────────────────────────────────────────────────────────────────────────┘
```

- **Draggable & Resizable Windows**: Multi-tasking workspace with proper z-index elevation and active/inactive window states.
- **Dynamic Taskbar**: Real-time window buttons that minimize, restore, and toggle focus.
- **Start Menu & Desktop Icons**: Instant access to all pentest tools, settings, and snapshots.
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

| Provider | Supported Models | Base URL |
| :--- | :--- | :--- |
| **OpenAI** | `gpt-4o`, `o3-mini`, `o1`, `gpt-4-turbo` | `https://api.openai.com/v1` |
| **Anthropic** | `claude-3-7-sonnet-20250219`, `claude-3-5-sonnet` | `https://api.anthropic.com/v1` |
| **Google Gemini** | `gemini-2.5-pro`, `gemini-2.5-flash` | `https://generativelanguage.googleapis.com/v1beta` |
| **Mistral AI** | `mistral-large-latest`, `codestral-latest` | `https://api.mistral.ai/v1` |
| **OpenRouter** | `deepseek/deepseek-r1`, `meta-llama/llama-3.3-70b` | `https://openrouter.ai/api/v1` |
| **Custom / Local** | `llama3.3:70b`, `qwen2.5-coder:32b`, `mistral` | `http://localhost:11434/v1` |

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
- [x] Target & Scope Management Templates
- [x] CISA KEV Intelligence & EPS Risk Scoring
- [x] Exploit Attack Path Synthesis
- [x] Nuclei Studio (YAML Automation)
- [x] Native Pentest Note Taker (`Notes.txt`)
- [x] Context Snapshot (Export / Import / Copy)
- [ ] Advanced Graph-Based Attack Simulation
- [ ] In-Memory Context Window Optimizer (Token Pruning)
- [ ] Automated Burp Suite / OWASP ZAP Ingestion Bridge
- [ ] Export to Formal Pentest Deliverable (PDF / Markdown / HTML)

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
