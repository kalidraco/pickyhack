# PickyHack

**PickyHack** is an offensive security workbench and penetration testing copilot designed to bridge real-time vulnerability research with structured operational workflows. Built inside an authentic Windows 98 desktop environment, PickyHack combines live threat intelligence, exploit correlation, attack path mapping, and continuous context persistence.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ PickyHack v1.0 — [Target Redaction Workspace]                          _ □ ✕│
├─────────────────────────────────────────────────────────────────────────────┤
│ File  Edit  Templates  Snapshot  Intelligence  Attack Chains  Nuclei  Help  │
├─────────────────────────────────────────────────────────────────────────────┤
│ [New Target] [Sample Scope] [💾 Save Snapshot] [📥 Import Context]          │
├──────────────────────────────────────┬──────────────────────────────────────┤
│ PRIMARY PENTEST WORKSPACE            │ EXPLOIT INTELLIGENCE & ATTACK PATHS  │
│                                      │                                      │
│ What we hack ?                       │ [INITIAL ACCESS] Edge VPN RCE        │
│                                      │        ▼                             │
│ Target: megacorp-finance.com         │ [FOOTHOLD] Reverse Shell (UID 1000)  │
│ Scope: *.megacorp-finance.com        │        ▼                             │
│ Objective: External assessment       │ [PRIV ESC] Linux Kernel nf_tables    │
│                                      │        ▼                             │
│                                      │ [CREDENTIALS] Extract STS / SAM      │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

---

## Key Features

- **Pentest Workspace & Editorial Environment**: Focused distraction-free writing surface centered on the pentester's target definition, featuring the minimalist **“What we hack ?”** editorial empty state that automatically disappears upon focus or typing.
- **Target & Scope Management**: Pre-configured templates for external reconnaissance, web application / API assessments, Active Directory privilege escalation, and cloud/container environments.
- **Vulnerability & Exploit Intelligence**: Direct correlation against real-world CVEs and the **CISA Known Exploited Vulnerabilities (KEV)** catalog (1,642+ active entries), tracking public GitHub PoCs and weaponized Metasploit modules.
- **Exploitability Priority Score (EPS / 100)**: Multi-factor scoring prioritizing real-world exploitability over raw CVSS (accounting for KEV presence, in-the-wild exploitation, pre-auth vectors, and public PoCs).
- **Attack Path Synthesis**: Generates multi-step attack chains (`Initial Access → Foothold → Privilege Escalation → Credential Access → Domain/Cloud Control`).
- **AI-Assisted Copilot & Console**: Embedded 14-point offensive security methodology providing technical analysis (`TL;DR`, `Risk`, `Exploitability`, `Detection`, `Validation`, `Controlled Exploitation`, `Remediation`).
- **Nuclei Automation Studio**: Generates customizable Nuclei YAML detection templates ready for automation.
- **Continuous Local Persistence**: Auto-saves active project states to browser storage on every keystroke and before page unload.
- **Context Snapshot Engine**: Full export, copy, and restoration mechanism guaranteeing zero loss of pentest continuity across temporary chat sessions or different LLM models.
- **🚧 In-the-Wild Threat Stream Live Scraping** *(WIP)*: Real-time automated scraping of newly announced zero-days and vendor security advisories.
- **🚧 Multi-LLM Provider Gateway** *(WIP)*: Direct API integration with local Ollama, OpenAI, Anthropic, and Google Gemini backends.

---

## Context Snapshot Engine

### The Continuity Problem in AI Pentesting

Standard LLM chat sessions are **ephemeral**: browser tabs close, contexts reset, and session histories are truncated. Traditional summaries often compress 100 interaction messages into a brief 500-word paragraph, losing **90% of the critical technical context** (ports, exact versions, failed test results, and confirmed hypotheses).

### How Context Snapshot Solves It

PickyHack decouples the temporary chat layer from the persistent **Pentest State**:

```text
TEMPORARY CHAT SESSION
         ↓
  [💾 SAVE SNAPSHOT]
         ↓
CONTEXT SNAPSHOT ENGINE
         ↓
Portable, Self-Contained Markdown Prompt
         ↓
NEW SESSION / DIFFERENT LLM
         ↓
 [📥 IMPORT CONTEXT]
         ↓
Full State & Attack Path Reconstructed
         ↓
CONTINUE PENTEST WITHOUT RE-EXPLAINING
```

### Information Retained in Snapshots

The generated snapshot prompt is completely autonomous and retains:

| Category | Retained Elements |
| :--- | :--- |
| **Mission Core** | Target, Scope, Objectives, Project Status |
| **Attack Surface** | Discovered Assets, Open Ports, Active Services, Fingerprinted Technologies |
| **Intelligence** | Identified CVEs, CVSS, CISA KEV listing, PoC availability, Exploitability Priority Score (EPS) |
| **Operational Findings** | Confirmed facts, vulnerability evidence, executed commands & results |
| **Exploitation Paths** | Correlated attack chain stages (`Initial Access → Domain Control`) |
| **Negative Results** | Failed test results (e.g. patched endpoints, prevented re-testing) and false positives |
| **Reasoning & Hypotheses** | Key architectural decisions, active hypotheses, open security questions |
| **Next Steps** | Immediate priorities, recommended next actions, and last conversation turn |

---

## Architecture

```text
                           PickyHack Workstation
                                     │
         ┌───────────────────────────┴───────────────────────────┐
         ▼                                                       ▼
   Desktop Shell (Win98)                                  Project State
 ├── Window Manager                                     ├── Target & Scope
 ├── Menu Bar & Toolbar                                 ├── Discovered Assets
 ├── Editorial Workspace ("What we hack ?")             ├── Mapped Vulnerabilities
 └── Tabbed Intelligence Panels                         └── Attack Chains
         │                                                       │
         └───────────────────────────┬───────────────────────────┘
                                     ▼
                           Context Engine
                    ├── Intelligent Compression
                    ├── Portable Prompt Generator
                    ├── One-Click Copy & .md Export
                    └── State Parser & Restorer
                                     │
                                     ▼
                            Local Persistence
                    (Browser Storage / .md Snapshots)
```

---

## Tech Stack

- **Frontend Core**: Vanilla HTML5 & Modern Vanilla JavaScript (ES6+), zero external runtime dependencies.
- **Styling**: Vanilla CSS3 implementing the retro Windows 98 Design System (authentic 3D bevels, typography, responsive pane layout).
- **Typography**: Crisp pixel/bitmap typography (`VT323`, `Silkscreen`) with native system fallbacks.
- **Intelligence Data Layer**: Structured JSON vulnerability catalog (CISA KEV, CVEs, PoC availability).
- **State Persistence**: Browser `localStorage` auto-sync and portable Markdown `.md` export/import.
- **Server**: Lightweight static file server (Python `http.server` or Node.js `serve`).

---

## Installation & Setup

### Prerequisites

- Git
- Web browser (Chrome, Safari, Firefox, Edge)
- Python 3 *or* Node.js (v18+)

### 1. Clone the Repository

```bash
git clone https://github.com/kalidraco/pickyhack.git
cd pickyhack
```

### 2. Configure Environment (Optional)

Copy the configuration template:

```bash
cp .env.example .env
```

### 3. Launch the Application

#### Option A: Direct Browser Launch (Zero Dependencies)
Simply open `index.html` in your web browser:

```bash
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows
```

#### Option B: Local HTTP Server (Python)

```bash
python3 -m http.server 8088
```
Then navigate to: `http://localhost:8088`

#### Option C: Node.js Dev Server

```bash
npm run dev
```

---

## Project Structure

```text
pickyhack/
├── index.html            # Main desktop application & workspace markup
├── style.css             # Windows 98 design system, bevel rules & layout
├── app.js                # Context Snapshot engine, placeholder logic, CVE feed
├── pickyhack_prompt.md   # Complete 14-point Offensive Security AI prompt spec
├── assets/
│   └── pickyhack-logo.svg # Pixel-art emblem (pickaxe, brick wall, Win98 button)
├── .env.example          # Environment variables template
├── .gitignore            # Git exclusion rules
├── package.json          # Node.js configuration & scripts
└── README.md             # Project documentation
```

---

## Security & Ethics

> [!IMPORTANT]
> **Authorized Testing Only**: PickyHack is engineered strictly for professional penetration testers, vulnerability researchers, and security teams working within **explicitly authorized scopes** under written agreement.
> 
> - **Zero Secrets in Git**: Never commit `.env` files, API keys, credentials, or client test data to Git.
> - **Protect Context Snapshots**: Context Snapshots contain sensitive target intelligence (IPs, exposed endpoints, vulnerabilities). Store downloaded `.md` snapshots securely in encrypted storage.
> - **Responsible Exploitation**: Follow minimal impact proof-of-concept guidelines without disrupting production systems.

---

## Roadmap

- [x] Authentic Windows 98 desktop environment & bevel design system
- [x] Focused pentest workspace with minimal editorial empty state (**“What we hack ?”**)
- [x] Real-time CVE & CISA KEV exploit correlation
- [x] Multi-factor Exploitability Priority Score (EPS / 100) engine
- [x] Multi-stage attack chain synthesis
- [x] Nuclei YAML template generation
- [x] Full Context Snapshot engine (export, copy, download `.md`)
- [x] Context Snapshot importer with complete state restoration
- [x] Continuous local state persistence (auto-save)
- [ ] 🚧 Direct LLM provider connector (Ollama, Gemini, OpenAI, Claude)
- [ ] 🚧 Live CISA KEV JSON feed background synchronization
- [ ] 🚧 Multi-target mission tabs

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository (`git checkout -b feature/amazing-feature`).
2. Commit your changes with clear, semantic commit messages (`feat: add CVE filter`).
3. Ensure no credentials or sensitive test data are included.
4. Open a Pull Request.

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
