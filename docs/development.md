# Developer & Contributor Guide

This guide covers everything you need to know to develop, test, and contribute to PickyHack.

---

## Environment Setup

### System Requirements
- **Node.js**: v18.0.0 or higher
- **Python**: v3.10 or higher
- **Operating System**: macOS, Linux, or Windows (WSL recommended)

### Quick Start
```bash
# 1. Clone the repository
git clone https://github.com/pickyhack/pickyhack.git
cd pickyhack

# 2. Start the local server
npm run dev
# Server listening on http://localhost:8000
```

---

## Test Execution

PickyHack includes a zero-dependency automated test runner (`tests/run_all.js`):

```bash
# Run all unit and integration test suites
npm test

# Run JavaScript syntax check across all source files
npm run check
```

### Test Suite Structure
- `tests/unit/sanitizer.test.js`: Validates credential redaction, key masking, and regex isolation.
- `tests/unit/validator.test.js`: Validates file extensions, size quotas, path traversal sanitization, and SSRF defenses.
- `tests/unit/providers.test.js`: Validates catalog taxonomy, open-weight families (OLMoE, Llama, Qwen, etc.), and local network flagging.
- `tests/unit/context-engine.test.js`: Validates token optimization, context packet serialization, and reactive state injection.
- `tests/integration/deliverable.test.js`: Validates Burp XML and OWASP ZAP ingestion, EPS risk assignment, and automated secret redaction in deliverable exports.
- `tests/integration/simulation.test.js`: Validates Dijkstra breach path simulation and graph choke point bottleneck identification.

---

## Coding Conventions
- **Zero-Build Vanilla Architecture:** All frontend logic runs natively in modern browsers via standard ES Modules / UMD wrappers without mandatory bundling steps.
- **Node & Browser Dual Compatibility:** Modules export via `if (typeof module !== 'undefined' && module.exports) module.exports = ...;` and attach to `root` (`window` or `global`).
- **Defensive Global Guards:** Always guard browser globals (`document`, `window`, `localStorage`, `alert`) with `typeof` checks before invocation to ensure testability under headless Node.js environments.
