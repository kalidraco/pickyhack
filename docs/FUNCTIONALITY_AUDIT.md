# PickyHack — Comprehensive Functionality Audit & Verification Matrix

**Date:** 2026-09-09  
**Repository:** [kalidraco/pickyhack](https://github.com/kalidraco/pickyhack)  
**Mandate:** FUNCTIONALITY FIRST / NO MORE FAKE UI  
**Phase:** Functional Audit & Remediation Baseline  

---

## 1. Executive Audit Summary

A rigorous code-level and runtime audit was conducted across all UI elements in the PickyHack interface. While the visual architecture and component hierarchy are solid, several critical functional gaps, mock data fallbacks, and state synchronization bugs were identified:

1. **State Inconsistency (Target & Scope):** The top situational awareness strip and `sidebar-ui.js` had a hardcoded fallback to `'10.10.20.14'` when `state.target` was unset, while the Context Inspector reported `Target: None configured`. Canonical target state must be strictly unified across all components.
2. **Context Token Telemetry Mismatch:** The header pill computed token usage with an empty query (`buildPacket('')`), displaying `0 tk`, while the right drawer displayed items from assembled packets.
3. **Dead / Crashing Controls:** The `⚖️ Compare` button (`#btn-chat-compare`) called `this.handleCompareSubmit(input.value)`, but `handleCompareSubmit` was never implemented in `ChatAgentUI`, resulting in a runtime `TypeError`. Per product rules, unimplemented buttons must be removed.
4. **Mocked Tool Outputs & Fake Findings:** Direct commands (`/scan`, `/recon`, `/exploit`, `/analyze`) in `ChatAgentUI.runCopilotTurn` returned hardcoded mock nmap/nuclei strings and fabricated an Apache CVE-2021-41773 finding. Tool calls must execute via `ToolRegistry` and `LocalExecutionBackend`, and findings must ONLY be registered when validated from real tool parsers.
5. **Lack of Conversation Persistence:** Conversations and chat history were maintained solely in an in-memory array (`ChatAgentUI.conversations`). Reloading the page wiped all messages.
6. **Fake Backend Status:** The sidebar backend indicator displayed a green pulsing dot regardless of actual connectivity to the Python daemon.

---

## 2. Complete UI Elements Audit Table

| UI Element | Expected Behavior | Current Behavior | Backend Exists | Status | Action Required |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **HEADER: Target Badge** (`#header-target-badge`, `#header-target-label`) | Displays active target from canonical `ProjectState`. If none, shows `Target: Not set`. Clicking opens Target & Scope modal. | Showed `Target: 10.10.20.14` due to fallback `state.target \|\| '10.10.20.14'` in `sidebar-ui.js`. | Yes (`ProjectState.get().target`) | **BROKEN (DESYNC)** | Remove fallback. Read canonical state strictly. |
| **HEADER: AI Engine Pill** (`#dock-model-pill`) | Displays `⚡ AI Engine: <PROVIDER>` (e.g. `⚡ AI Engine: OPENAI`). Clicking opens "Let's Hack !" modal. Strictly provider name only, never model. | Clicking opened modal, but saving settings wrote model name into pill (`⚡ OPENAI: gpt-4o`). | Yes (`ProviderRegistry`) | **PARTIAL REGRESSION** | Enforce strict provider-only display format across all events. |
| **HEADER: Context Headroom** (`#header-context-pill`, `#header-context-label`) | Displays estimated token size of canonical assembled context packet (e.g. `3.8k` or `520 tk`). Clicking opens Context Debugger. | Showed `Context: 0 tk` when input was empty, desynced from actual packet metrics in drawer. | Yes (`ContextEngine`, `TokenOptimizer`) | **INCONSISTENT** | Synchronize with canonical `ContextDrawerUI.lastPacket` or current state token cost. |
| **HEADER: Context Drawer Toggle** (`#btn-toggle-context-drawer`) | Expands/collapses the right-hand Context Inspector drawer. | Toggles drawer open/closed. | N/A (UI) | **WORKING** | Retain. |
| **HEADER: Situational Strip Target & Scope** (`#strip-target-val`, `#strip-scope-val`) | Reflects canonical target and scope CIDR from `ProjectState`. | HTML had hardcoded `10.10.20.14` and `External`. Fallback in code prevented showing empty state. | Yes (`ProjectState`) | **BROKEN (DESYNC)** | Replace hardcoded HTML and fallback with live canonical bindings. |
| **HEADER: Pentest Phase Steps** (`.phase-step`) | Highlights active engagement phase (`RECON` → `ENUMERATION` → `ANALYSIS` → `VALIDATION` → `EXPLOITATION` → `REPORT`). Clicking step updates phase. | Clicking updates `state.phase` and toggles active CSS class. | Yes (`ProjectState.get().phase`) | **WORKING** | Retain. |
| **HEADER: Telemetry Counters** (`#strip-tasks-count`, `#strip-findings-count`, `#strip-evidence-count`) | Computes count dynamically from `ProjectState` arrays (`tasks`, `findings`, `evidence`). | Computes count, but tasks filter was incomplete. | Yes (`ProjectState`) | **WORKING** | Retain; bind to reactive state listeners. |
| **SIDEBAR: Active Engagement Select** (`#sidebar-project-select`) | Lists saved projects; switching switches project in `ProjectState` and updates all UI views. | Switches active project in `ProjectState`, but did not reload conversation thread per project. | Yes (`ProjectState.switchProject`) | **PARTIAL** | Link conversations to active project ID. |
| **SIDEBAR: New Engagement Button** (`#btn-new-project`) | Prompts for project name, creates new project, clears active conversation, resets state views. | Creates project, but left current chat stream dirty. | Yes (`ProjectState.createProject`) | **PARTIAL** | Initialize fresh conversation on new project creation. |
| **SIDEBAR: New Chat Button** (`#btn-new-chat`) | Creates a fresh conversation with unique ID, clears chat view, preserves Project State. | Creates in-memory conversation, but not persisted to storage. | Partial (In-memory only) | **BROKEN (PERSISTENCE)** | Implement `localStorage` conversation persistence. |
| **SIDEBAR: Conversations List** (`#sidebar-conversations-list`) | Lists conversation history with message counts. Clicking switches conversation. Rename & delete controls available. | Rendered title & count; clicking switched conversation. No rename or delete options; lost on page reload. | Partial | **PARTIAL** | Add rename and delete actions; persist list and messages in `localStorage`. |
| **SIDEBAR: Targets & Scope Nav** (`#nav-scope`) | Opens `modal-scope`. Allows editing target, CIDR ranges, and out-of-scope exclusions with validation. | Modal opened and saved inputs, but lacked CIDR validation and strict boundaries check. | Yes (`ProjectState`, `SecurityValidator`) | **PARTIAL** | Add CIDR format validation and scope consistency check. |
| **SIDEBAR: Findings Nav & Counter** (`#nav-findings`, `#counter-findings`) | Badge reflects confirmed findings count. Clicking opens Findings Registry table with PoC inspection. | Counter computed from `state.findings`. Modal rendered table. PoC button opened browser `alert()`. | Yes (`ProjectState.findings`) | **WORKING** | Replace raw browser `alert()` with clean in-app PoC viewer sheet. |
| **SIDEBAR: Task Tree Nav & Counter** (`#nav-tasks`, `#counter-tasks`) | Badge reflects active tasks. Clicking opens Task Tree modal with status, dependencies, and tools. | Counter computed from active tasks. Modal rendered static table. Cannot add/modify tasks directly from table. | Yes (`TaskTree`, `ProjectState`) | **PARTIAL** | Make task status toggleable (Pending / Running / Done). |
| **SIDEBAR: Evidence & Notes Nav & Counter** (`#nav-notes`, `#counter-evidence`) | Counter reflects evidence items. Clicking opens scratchpad with word count, save, export `.txt`, convert to finding. | Counter accurate. Scratchpad works, saves notes, exports text, and converts note to finding. | Yes (`NotesTaker`, `ProjectState`) | **WORKING** | Retain. |
| **SIDEBAR: Attack Paths Nav** (`#nav-attack-graph`) | Opens Attack Graph modal. Renders real graph nodes/edges from discovered assets/findings. Empty state if none. | Renders text topology from `AttackGraphCompiler`. If empty, lacked clear "No attack path identified yet." | Yes (`AttackGraphCompiler`) | **WORKING (BASIC)** | Add clean empty state: "No attack path identified yet." |
| **SIDEBAR: CISA KEV Intel Nav** (`#nav-intel`) | Opens CISA KEV modal. Displays live exploited CVEs. Shows loading, success, error, and last update time. | Rendered static sample array (`CISA_KEV_SAMPLE`). No live fetch status indicator. | Partial (`intelligence.js`) | **PARTIAL (MOCK DATA)** | Wire real CISA feed fetch with status banner (loading/success/error). |
| **SIDEBAR: Deliverables Nav** (`#nav-deliverables`) | Opens Deliverables modal. Generates real Markdown, HTML, and printable PDF report from Project State. | Generates real preview and triggers Markdown, HTML download and print-PDF. | Yes (`DeliverableGenerator`) | **WORKING** | Retain. |
| **SIDEBAR: AI Engine Nav** (`#nav-ai-engine`) | Opens "Let's Hack !" modal to configure provider, key, model, and endpoint. | Opens `#onboarding-overlay` via `OnboardingUI.show()`. | Yes (`ProviderRegistry`, `OnboardingUI`) | **WORKING** | Retain. |
| **SIDEBAR: Context Debugger Nav** (`#nav-context-debugger`) | Opens Context Debugger modal showing utility scores, token knapsack allocation, and assembled packet. | Opens `modal-context-debugger` via `ContextDebuggerModal.open()`. | Yes (`ContextDebuggerModal`, `ContextEngine`) | **WORKING** | Retain. |
| **SIDEBAR: Snapshots Nav** (`#nav-snapshots`) | Opens right drawer for snapshot export and import. | Opens drawer. | Yes (`SnapshotManager`, `ContextDrawerUI`) | **WORKING** | Retain. |
| **SIDEBAR: Settings Nav** (`#nav-settings`) | Opens Settings modal: provider, masked key with Show/Hide, endpoint, model, test connection, backend selector, theme radio. | Fully functional. Test connection tests real endpoints. Saves settings. | Yes (`ProviderRegistry`, `app.js`) | **WORKING** | Retain. |
| **SIDEBAR: Local Backend Status** (`#backend-status-label`, dot) | Performs real healthcheck against `/api/health`. Displays: Connected (green), Disconnected (amber/gray), Error (red). | Showed green pulsing dot and "In-Browser Runtime" even when disconnected. | Yes (`server.py` `/api/health`) | **BROKEN (FAKE STATUS)** | Wire real status classes: `.status-dot.connected`, `.disconnected`, `.error`. |
| **SIDEBAR: Theme Toggle Button** (`#theme-toggle-btn`) | Toggles between Picky98 (default Windows 98) and PickyTahoe (dark) themes without altering application state. | Smoothly toggles `data-theme` and saves to `localStorage`. | N/A (CSS) | **WORKING** | Retain. |
| **MAIN CHAT: Starter Prompt Chips** (`.starter-chip`) | Injects prompt into composer and submits turn. Gated if AI engine unconfigured. | Injects prompt and calls `handleUserSubmit`. Blocks if unconfigured. | Yes (`ChatAgentUI`) | **WORKING** | Retain. |
| **MAIN CHAT: Composer Textarea** (`#chat-input`) | Auto-resizing textarea. Enter sends message; Shift+Enter creates newline. Disabled when locked. | Works as expected. Auto-resizes up to max height. Enter sends. Shift+Enter expands. | Yes (`ChatAgentUI`) | **WORKING** | Retain. |
| **MAIN CHAT: Attach Button** (`#btn-attach-file`, `#composer-file-input`) | Opens real file picker. Drag & drop over composer stages files. Shows attachment shelf with chips. | Opens file picker, stages files, renders chips, passes attachments to ContextEngine. | Yes (`AttachmentManager`) | **WORKING** | Retain. |
| **MAIN CHAT: Command Shortcuts** (`/scan`, `/recon`, `/exploit`, `/analyze`) | Must execute real tools (`nmap`, `nuclei`, `curl`), update Project State, and log real evidence. No fake outputs! | Injected command text. In `runCopilotTurn`, returned hardcoded mock nmap output and fake Apache CVE finding. | Yes (`ToolRegistry`, `server.py`) | **BROKEN (FAKE DATA)** | Wire commands to real `ToolRegistry.execute()`. Remove fake outputs and mock findings. |
| **MAIN CHAT: Compare Button** (`#btn-chat-compare`) | Rule 33: Compare two real models, or REMOVE the button. | Button existed in DOM, but called non-existent method `handleCompareSubmit`, throwing `TypeError`. | No | **DEAD CONTROL** | **REMOVE BUTTON** per Rule 33 and Golden Rule. |
| **MAIN CHAT: Interactive Copilot Toggle** (`#agent-mode-toggle`) | Toggles between Single-Turn Copilot and Multi-Step Autonomous Loop. | Toggles `isAutonomousMode` between Copilot and AgentLoop. | Yes (`AgentLoop`) | **WORKING** | Retain. |
| **MAIN CHAT: Composer Target Badge** (`#composer-target-pill`) | Displays active target. Clicking opens Target & Scope modal. | Showed `Target: 10.10.20.14` due to fallback. | Yes (`ProjectState`) | **BROKEN (DESYNC)** | Unify with canonical `ProjectState.get().target`. |
| **MAIN CHAT: Send Button** (`#btn-chat-send`) | Sends user prompt to configured AI engine. Dispatches streaming or fallback completion. Updates tokens. | Dispatches real inference via `ProviderRegistry.send()`, but lacked live token streaming and abort control. | Yes (`ProviderRegistry`) | **PARTIAL** | Implement real SSE streaming reader and AbortController integration. |
| **MAIN CHAT: Stop Button** (`#btn-chat-stop`) | Aborts ongoing LLM inference or tool execution. Resets execution state. | Stopped `AgentLoop`, but did not cancel active `fetch` HTTP request. | Partial | **PARTIAL** | Connect AbortController to cancel active provider fetch. |
| **MAIN CHAT: Agent Status Bar** (`#agent-status-bar`, `#agent-status-text`) | Displays operational agent status (Idle, Planning, Executing, Analyzing, Waiting for approval, Completed, Error). | Renders status bar dynamically during tool and loop execution. | Yes (`ChatAgentUI.setAgentStatus`) | **WORKING** | Retain. |
| **RIGHT PANEL: Token Budget Headroom** (`#drawer-token-progress-fill`, labels) | Reflects real token consumption of assembled context packet relative to model context budget. | Displayed token progress and labels, but was 0 when no query was active. | Yes (`ContextEngine`, `TokenOptimizer`) | **WORKING** | Retain; compute base project state tokens when idle. |
| **RIGHT PANEL: Target & Scope Summary** (`#drawer-target-summary`, `#drawer-scope-summary`) | Displays canonical target and scope from `ProjectState`. | Showed `Target: None configured` while header had `10.10.20.14` (root cause of user bug report). | Yes (`ProjectState`) | **BROKEN (DESYNC)** | Unify canonical state across entire application. |
| **RIGHT PANEL: Active Task & NRA** (`#drawer-active-task`, `#drawer-nra-summary`) | Displays active task title and Next Recommended Action from TaskTree based on pentest phase. | Reads `ProjectState.tasks` and `TaskTree.recommendNextAction()`. | Yes (`TaskTree`) | **WORKING** | Retain. |
| **RIGHT PANEL: Knapsack Allocation Summary** (`#drawer-selected-items-count`, `#drawer-rejected-items-count`) | Shows selected vs pruned context items. If no context generated yet, displays "No context selection yet." | Displayed raw counts `0` or `2` without empty state message. | Yes (`ContextEngine`) | **PARTIAL** | Add empty state message: "No context selection yet." |
| **RIGHT PANEL: Launch Context Debugger** (`#btn-launch-context-debugger`) | Opens Context Debugger modal. | Opens modal. | Yes (`ContextDebuggerModal`) | **WORKING** | Retain. |
| **RIGHT PANEL: Export Snapshot** (`#btn-drawer-export-snapshot`) | Exports canonical Project State as `.pickycontext.json` without secrets or API keys. | Generates and downloads sanitized JSON snapshot. | Yes (`SnapshotManager`) | **WORKING** | Retain. |
| **RIGHT PANEL: Import Snapshot** (`#btn-drawer-import-snapshot`, file input) | Opens file picker, validates JSON schema and version, restores Project State, syncs all views. | Restores state, validates required fields, catches malformed files. | Yes (`SnapshotManager`) | **WORKING** | Retain. |
| **MODAL: "Let's Hack !" (API Popup)** (`#onboarding-overlay`) | Mandatory first-launch modal. Fields: Provider, Key (Show/Hide), Endpoint, Model. Buttons: Test Connection, Let's Hack !. | Blocks app on fresh install. Validates connection. Unlocks chat only on verified connection. | Yes (`ProviderRegistry`, `OnboardingUI`) | **WORKING** | Retain; verified. |
| **MODAL: Scope & Target** (`#modal-scope`) | Allows editing Target, Scope CIDRs, and Exclusions. Updates canonical state on Save. | Modal functions, but previously allowed unsaved fallbacks to override empty targets. | Yes (`ProjectState`) | **WORKING (AFTER FIX)** | Enforce single source of truth. |
| **MODAL: Context Debugger** (`#modal-context-debugger`) | Displays candidate scoring, utility weights, assembled context packet, and cross-model diff. | Fully renders live knapsack utility scoring and assembled packet. | Yes (`ContextDebuggerModal`) | **WORKING** | Retain. |
| **MODAL: Findings Registry** (`#modal-findings`) | Lists confirmed findings with severity pills, CVSS, target, and PoC viewer. Button to generate deliverables. | Lists findings from `ProjectState`. PoC viewer uses `alert()`. | Yes (`ProjectState.findings`) | **PARTIAL** | Replace `alert()` with in-app PoC sheet. |
| **MODAL: Task Tree** (`#modal-tasks`) | Displays tasks table with status and associated tools. | Renders tasks table from `ProjectState.tasks`. | Yes (`ProjectState.tasks`) | **WORKING** | Retain. |
| **MODAL: Pentest Notes** (`#modal-notes`) | Pentest notes editor, live word count, Save, Export `.txt`, Convert to Finding, Clear. | Fully functional via `NotesTaker`. | Yes (`NotesTaker`) | **WORKING** | Retain. |
| **MODAL: Attack Graph** (`#modal-attack-graph`) | Displays attack path graph topology. Shows "No attack path identified yet." if empty. | Compiles graph from `ProjectState`. Lacked empty state notice. | Yes (`AttackGraphCompiler`) | **PARTIAL** | Add empty state notice when nodes count is 0. |
| **MODAL: CISA KEV Intelligence** (`#modal-intel`) | Displays known exploited vulnerabilities from CISA KEV catalog. | Rendered static array. Lacked live refresh and status banner. | Partial (`intelligence.js`) | **PARTIAL** | Add live fetch and status banner. |
| **MODAL: Deliverables Generator** (`#modal-deliverables`) | Generates executive pentest report preview with Markdown, HTML download and Print PDF. | Fully functional via `DeliverableGenerator`. | Yes (`DeliverableGenerator`) | **WORKING** | Retain. |
| **MODAL: Settings** (`#modal-settings`) | Multi-API, Key, Endpoint, Model, Test Connection, Theme, and Execution Backend selector. | Fully functional. Test connection verifies real API access. | Yes (`ProviderRegistry`, `app.js`) | **WORKING** | Retain. |

---

## 3. Action Plan for Golden Rule Enforcement

Per Golden Rule: **"A UI control may only exist if it executes a real function, opens a real interface, changes real state, performs a real backend operation, or navigates to a real feature. Otherwise: REMOVE IT."**

### Items to REMOVE:
1. **`#btn-chat-compare` (Compare button in composer):** Dead control; calls non-existent method in `ChatAgentUI`. Removed from DOM and code.

### Items to FIX / IMPLEMENT:
1. **Unify Canonical Target State:**
   - Eliminate hardcoded `'10.10.20.14'` fallback from `sidebar-ui.js`, `chat-agent-ui.js`, and `index.html`.
   - When target is empty, display `Target: Not set` in header, strip, and composer, and `Target: None configured` in drawer.
   - When target is saved in `modal-scope`, update Header, Strip, Composer, Context Drawer, and Context Engine immediately.
2. **Conversation Persistence & Management:**
   - Save `ChatAgentUI.conversations` and `activeConvId` to `localStorage` under `pickyhack_conversations`.
   - On page reload, restore conversations, active conversation, and message stream.
   - Add Rename and Delete actions for conversations in the sidebar.
3. **Eliminate Mock Tool Outputs & Fabricated Findings:**
   - Remove hardcoded simulated strings in `ChatAgentUI.runCopilotTurn` (`Starting Nmap 7.94...`, `Apache HTTP Server 2.4.49...`).
   - Execute tools via `PickyToolRegistry.execute()` dispatching to `LocalExecutionBackend` (`http://localhost:8088/api/execute`).
   - If a tool is not installed on the system (e.g. `nmap: command not found`), display the actual error output (`stdout`/`stderr`/`exitCode`) in the terminal card. Never invent findings on failed or missing tools.
4. **Real Streaming & AbortController:**
   - Add SSE streaming reader in `ProviderRegistry.send()` using `fetch` with `ReadableStream` / `TextDecoder`.
   - Support `AbortController` in `ProviderRegistry` and wire it to `#btn-chat-stop`.
5. **Real Local Backend Health Status:**
   - Check `/api/health`.
   - Set `.status-dot.connected` (green), `.status-dot.disconnected` (amber), or `.status-dot.error` (red).
6. **Knapsack Empty State & Context Token Sync:**
   - If no packet generated, show "No context selection yet."
   - Compute base context token size (target, scope, findings, assets) so header context pill reflects real state tokens instead of `0 tk`.
7. **Attack Graph Empty State:**
   - If 0 nodes compiled, display "No attack path identified yet."
8. **Header AI Engine Pill Strictness:**
   - Enforce strictly `⚡ AI Engine: <PROVIDER>` in header, never model name.
