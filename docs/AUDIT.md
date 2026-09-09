# PickyHack Comprehensive Technical & Architectural Audit

**Date:** 2026-09-09  
**Target Repository:** https://github.com/kalidraco/pickyhack  
**Audit Scope:** Full codebase inspection (Core, Modules, UI, Security, Backend, Tests, Documentation)  
**Status:** Pre-refactor Baseline Assessment  

---

## 1. Executive Summary & Current State

PickyHack is positioned as an offensive security workbench and "Stateless AI Context Harness" for penetration testing, operating under the tagline:
> *"Stateless by default. Context-driven by design."*

The current repository contains an engaging retro Windows 98 desktop interface built in vanilla HTML/CSS/JavaScript, accompanied by client-side security redaction utilities, provider catalog definitions, and basic local storage persistence. However, an unvarnished technical audit reveals a significant disparity between the product vision (an autonomous, context-driven AI pentesting agent) and the current reality (a client-side presentation shell with mock attack paths, hardcoded CVEs, non-agentic LLM dispatch, and a primitive context engine that merely concatenates state into a text string).

### Current Codebase Metrics
- **Runtime:** Client-side Vanilla JavaScript (IIFE/UMD pattern loaded via `<script>` tags in `index.html`)
- **Backend:** `server.py` (`SimpleHTTPRequestHandler` serving static files on port 8088, zero active API endpoints)
- **State Storage:** Browser `localStorage` with in-memory fallbacks (`pickyhack_project_state`, `pickyhack_notes_content`, `pickyhack_multi_api_engines`)
- **Testing:** 7 test suites via `tests/run_all.js` (Unit & simulated integration tests passing, but with Node.js `localStorage` warnings)
- **Dual UI Status:** Only Windows 98 exists (`src/styles/index.css`). PickyTahoe (modern macOS Tahoe-inspired UI) does not exist yet.

---

## 2. Feature-by-Feature Status Matrix

| Category | Component / Feature | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Security** | Secret Sanitizer (`sanitizer.js`) | **Implemented** | 8 regex patterns redacting OpenAI, Anthropic, Gemini, AWS, Bearer, RSA keys. |
| **Security** | Input Validator (`validator.js`) | **Implemented** | Extension blocklist/allowlist, size limits, filename sanitization, SSRF metadata check. |
| **Providers** | Multi-API Manager & BYOM | **Implemented** | Connects to OpenAI, Anthropic, Gemini, OpenAI-compatible APIs; dynamic model discovery (`/v1/models`). |
| **State** | Reactive Project State (`project-state.js`)| **Partial** | Flat object in `localStorage`; lacks structured Evidence, Task Tree, and Phase workflows. |
| **Context** | Context Engine (`context-engine.js`) | **Partial / Primitive**| String concatenation of all state elements. No relevance scoring, no token budgeting, no reasoning explanations. |
| **Snapshots**| Snapshot Manager (`snapshot-manager.js`)| **Partial / Broken** | Exports Markdown; parser only restores 4 fields (target, scope, objectives, constraints), discarding findings & assets. |
| **Notes** | Notes Taker (`notes-taker.js`) | **Partial** | Single text document in `localStorage`; no note categorization, no asset/finding linking. |
| **Modules** | Burp/ZAP Bridge (`burp-zap-bridge.js`) | **Partial** | Parses static XML/JSON exports; no live proxy interception, history, or replay. |
| **Modules** | Deliverable Generator (`deliverable-generator.js`) | **Partial** | Client-side HTML/MD/Print-PDF export of findings; basic formatting. |
| **Modules** | Token Optimizer (`token-optimizer.js`) | **Partial** | Basic character-ratio estimation (~3.8 char/tok) and regex banner stripping. |
| **Modules** | Threat Intelligence (`intelligence.js`)| **Fake / Mock** | Advertised as "Live CISA KEV & CVE Correlation", but contains a static 5-item array (`CISA_KEV_SAMPLE`). |
| **Modules** | Attack Graph (`attack-graph.js`) | **Fake / Mock** | Hardcoded demo topology (`n_ext`, `n_vpn`, `n_waf`, `n_jump`, `n_sql`, `n_dc`) with fixed probabilities. |
| **Inference** | Local Synthesis Fallback (`provider-registry.js`)| **Fake / Mock** | Hardcoded regex checks (`lower.includes('cve')`) returning canned strings ("CVE-2024-3400."). |
| **Runtime** | Tool Runtime & Registry | **Missing** | Zero tool execution abstraction. Tools are not executed; only CLI syntax is printed. |
| **Runtime** | Kali / Remote Execution Backend | **Missing** | No Local, SSH, or Docker execution backends. Cannot execute `nmap`, `nuclei`, `curl`, etc. |
| **Runtime** | Tool Discovery | **Missing** | Cannot probe environment for installed pentest binaries (`nmap`, `nuclei`, `ffuf`, etc.). |
| **Agent** | Autonomous Agent Loop | **Missing** | No observe-plan-execute-evaluate loop. Operates strictly as a single-turn conversational chat. |
| **Agent** | Pentest Workflow Phases | **Missing** | No phases (Recon -> Enum -> Analysis -> Hypothesis -> Validation -> Exploitation -> Report). |
| **Agent** | Pentest Task Tree | **Missing** | No persistent task hierarchy with dependencies, status tracking, and model independence. |
| **Safety** | Risk Engine & Consent Policy | **Missing** | No READ/LOW/MEDIUM/HIGH/CRITICAL policy gate with ask/allow/deny session controls. |
| **Web** | Browser Agent Runtime | **Missing** | No browser automation abstraction (Playwright, Puppeteer, CDP). |
| **Web** | HTTP / Web Security Testing Layer | **Missing** | No raw HTTP engine with TLS, cookie, and evidence capture. |
| **Pipelines**| Composable Recon Pipelines | **Missing** | No pipeline engine (e.g. Subfinder -> Httpx -> Nmap -> Whatweb -> Nuclei). |
| **Subagents**| Parallel Sub-Agents | **Missing** | No sub-agent delegation with isolated context and structured result folding. |
| **Findings** | Finding Validation Engine | **Missing** | No distinction between Raw Signal, Hypothesis, Evidence, and Confirmed Finding. |
| **Context** | Context Replay & Debugger | **Missing** | Cannot rebuild context for a fresh conversation/model or inspect context selection rationale. |
| **Benchmark**| Context Engine Benchmark Suite | **Missing** | No objective benchmarks comparing PickyHack vs Direct LLM baseline. |
| **UI** | PickyTahoe (Modern macOS Tahoe UI) | **Missing** | Codebase is 100% Windows 98. No modern UI layer exists. |

---

## 3. Code Quality, Dead Code & Duplications

1. **Exact Duplicate Stylesheets:**
   - `src/styles/base.css` (35,880 bytes, 1,772 lines) and `src/styles/index.css` (35,880 bytes, 1,772 lines) are **byte-for-byte identical duplicates**.
   - `style.css` at repository root is a 6-line legacy shim doing `@import url('./src/styles/index.css');`.
2. **Legacy Shim Files:**
   - `app.js` at root is an obsolete 22-line console shim that does nothing.
   - `server.py` at root is a 22-line wrapper that imports from `src/backend/server.py`.
3. **Monolithic DOM Coupling:**
   - `index.html` is 1,755 lines of HTML containing all 10 Windows 98 window structures inline. There is zero separation between the UI presentation layer and application logic.
4. **Node.js Environment Warnings in Tests:**
   - Tests execute in Node.js via `tests/run_all.js`, but modules expect browser globals (`localStorage`, `window`, `document`). Node outputs `ExperimentalWarning: localStorage is not available`.

---

## 4. Security Risks & Vulnerabilities

1. **Unencrypted Secret Storage in Browser `localStorage`:**
   - API keys (OpenAI, Anthropic, Gemini, OpenRouter) and custom endpoints are saved in plaintext under the `pickyhack_multi_api_engines` key in `localStorage`. Any third-party script, browser extension, or XSS can exfiltrate active credentials.
2. **Untrusted LLM Output Execution Risk:**
   - As tool execution capabilities are introduced, executing LLM-generated shell commands without strict sandboxing, path whitelisting, and explicit user consent poses an immediate Remote Code Execution (RCE) danger on the operator's machine or remote Kali instance.
3. **Backend Static File Traversal & Unauthenticated Surface:**
   - `src/backend/server.py` binds to `0.0.0.0` with no authentication tokens. While `translate_path` checks `startswith(root_dir)`, adding execution APIs to this server without token-based authentication will expose the host to local network attacks.
4. **Missing Tool Output Sanitization:**
   - Raw tool outputs (Nmap, Nuclei, HTTP responses) must be sanitized before rendering into the DOM or feeding into subsequent LLM turns to prevent prompt injection and stored XSS.

---

## 5. Architectural Risks

1. **Global Namespace Pollution:**
   - Every module registers itself on `root` (`window` or `global`), creating hidden execution-order dependencies in `index.html`.
2. **Absence of Canonical Data Schemas:**
   - Findings, Assets, and Tasks are represented as loose ad-hoc JSON objects rather than strongly typed schemas with validation.
3. **No Execution / Storage Decoupling:**
   - UI code directly manipulates `localStorage` rather than querying a structured storage/state layer.
4. **Tight UI Coupling:**
   - Features like Findings, Notes, and Scope cannot be presented in a different UI (such as PickyTahoe) without duplicating HTML markup or decoupling component rendering from business logic.

---

## 6. Context Engine Gaps (The Core Problem)

The central claim of PickyHack is:
> *"Stateless by default. Context-driven by design."*

Currently, the Context Engine (`src/core/context-engine.js`) fails this promise:
- **No Relevance Scoring:** Every asset, finding, attack path, note, and attachment in `ProjectState` is concatenated indiscriminately into `userPacket`.
- **No Token Budgeting:** If an assessment has 50 findings and 200 services, the context packet immediately overflows model token limits. The engine has no concept of 1k, 4k, 8k, or 16k token ceilings.
- **No Signal/Token Optimization:** It cannot prioritize the specific port or CVE relevant to the operator's current query while suppressing unrelated noise.
- **No Explanatory Rationale:** It cannot answer: *"Why was this specific finding included and this note excluded?"*
- **No Context Replay:** It cannot take an existing `ProjectState` and cleanly re-hydrate a new conversation thread or another model without chat history.
- **No Context Diff:** It cannot display what changes when switching from an 8k context model to a 128k context model.

---

## 7. Competitive Gaps (vs. State of the Art AI Pentest Agents)

| Capability | Competitors (e.g. Pentest Copilot) | Current PickyHack | PickyHack vNext Target |
| :--- | :--- | :--- | :--- |
| **Execution** | SSH / Docker / Kali remote execution | None (Copy-paste only) | Plug-and-play Execution Backends (Local, SSH, Docker) |
| **Tool Registry** | 50+ built-in pentest tools | 0 (Manual syntax generation) | Tool Registry with discovery, schemas, & evidence capture |
| **Agent Autonomy** | Multi-step autonomous pentest loop | Single-turn static chat | Supervised Autonomous Agent Loop with consent gate |
| **Task Management**| Persistent Task Tree | None | Hierarchical, model-independent Task Tree |
| **Validation** | Automated finding validation | Manual user confirmation | Multi-stage Validation Pipeline (Signal -> Evidence -> Confirmed) |
| **Attack Graph** | Dynamic exploit paths | Static hardcoded SVG mockup | Graph generated dynamically from real Project State |
| **Context Harness**| Conversational window dumping | String concatenation | **Best-in-Class Context Engine**: Scoring, pruning, replay, diff |
| **Model Portability**| Locked or fragile chat history | Basic multi-provider | **Total Model Agnosticism**: Hot-swap models with zero state loss |
| **User Experience** | Single modern web UI | Windows 98 only | **Dual UI**: Picky98 + PickyTahoe (shared core) |

---

## 8. Recommended Roadmap & Priorities

### Phase P0: Core Context Engine, State & Foundations (The Heart of PickyHack)
1. **Canonical Project State & Schemas:**
   - Define strict models for: `Asset`, `Service`, `Credential`, `Evidence`, `Finding`, `Task`, `Hypothesis`, `AttackPath`.
   - Complete `.pickycontext.json` portable context snapshot (export, import, validate, diff, zero secrets).
2. **Context Engine V2 (Scoring & Budgeting):**
   - Implement relevance scoring: `Score = f(Intent, Recency, Confidence, Dependency, TaskProximity)`.
   - Token budget optimizer: Strict allocation (1k, 4k, 8k, 16k, custom) maximizing signal-to-noise ratio.
   - Context Debugger & Rationale: Output selected items, rejected items, and selection reasons.
   - Context Replay & Model Switching: Format context dynamically according to destination model capabilities.
3. **Evidence-First AI & Hallucination Guard:**
   - Strict classification: `FACT`, `OBSERVATION`, `INFERENCE`, `HYPOTHESIS`, `UNKNOWN`.
   - All findings link directly to evidence references (command stdout, HTTP capture, file, screenshot).
4. **Reproducible Context Benchmark Suite:**
   - Create `benchmarks/context-engine/` comparing Baseline Direct LLM vs PickyHack Context Engine on large pentest datasets (tokens sent, reduction %, precision, recall, latency, cost, state recovery).

### Phase P1: Execution Backends, Tools & Agent Runtime (Competitive Parity)
1. **Execution Backend Abstraction:**
   - Interface: `ExecutionBackend` (`execute`, `upload`, `download`, `shell`, `healthcheck`, `capabilities`).
   - Implement `LocalExecutionBackend` and `SSHExecutionBackend` (remote Kali/Parrot connection).
2. **Tool Runtime & Registry:**
   - Unified `Tool` interface with schemas, permissions, execution backends, output parsers, and risk levels.
   - Auto-discovery for installed pentest tools (`nmap`, `nuclei`, `ffuf`, `gobuster`, `sqlmap`, `httpx`, `curl`, etc.).
3. **Risk & Safety Engine:**
   - Risk levels: `READ`, `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`.
   - Policy gate: `ask`, `allow`, `deny`, `allow once`, `allow for session` with comprehensive audit log.
4. **Agent Autonomous Loop & Task Tree:**
   - Observe -> Update State -> Plan -> Select Tool -> Execute -> Parse -> Store Evidence -> Re-evaluate.
   - Persistent hierarchical Task Tree with status states (`TODO`, `IN_PROGRESS`, `BLOCKED`, `DONE`, `FAILED`, `SKIPPED`).
5. **Real Attack Graph & Security Intelligence:**
   - Graph built from Project State nodes and edges.
   - Live CISA KEV dataset loading and NVD lookup.
6. **Finding Engine & Multi-Stage Validation:**
   - Signal -> Correlation -> Evidence Check -> Reproduction -> Confidence -> Confirmed Finding.

### Phase P2: Dual UI (Picky98 + PickyTahoe) & Advanced Integrations
1. **UIRegistry & Dual Presentation Layer:**
   - Decouple Core from UI completely.
   - **Picky98**: Windows 98 desktop, taskbar, start menu, retro windows.
   - **PickyTahoe**: Modern macOS Tahoe-inspired UI with sidebar, floating surfaces, modern typography, contextual drawers.
   - Instant UI switcher in Settings (`Settings -> Appearance -> Interface`) with zero state loss.
2. **Browser Agent Runtime:**
   - Provider abstraction for browser interactions (navigation, form filling, screenshots, DOM inspection).
3. **HTTP & Live Proxy Bridge:**
   - Raw HTTP testing layer and live proxy request history/replay.
4. **Deliverable & Report Engine:**
   - Client-ready formal pentest deliverables generated from canonical Project State.
