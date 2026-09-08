# Security Policy

## Responsible Disclosure

The PickyHack project is dedicated to building a secure, resilient, and privacy-preserving context harness for offensive security engineers and researchers. If you discover a vulnerability or security flaw within PickyHack, we appreciate your help in disclosing it to us responsibly.

### Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please submit reports using GitHub's private reporting channel:
1. Navigate to the **[Security Advisories](https://github.com/kalidraco/pickyhack/security/advisories/new)** tab of the repository.
2. Click **Report a vulnerability** to open a confidential advisory draft visible only to repository maintainers.

#### Information to Include

To help us triage and resolve the issue swiftly, please include:
- A clear description of the vulnerability and its potential impact.
- Step-by-step instructions to reproduce the issue.
- Proof-of-concept (PoC) code or requests, if applicable.
- The specific affected components (e.g., `src/security/`, `src/backend/`, `src/core/`).
- Any suggested mitigations or patches.

#### Response Commitments & Timelines

- **Initial Acknowledgment:** Within **48 hours** of submission.
- **Triage & Assessment:** Within **5 business days**, confirming severity and scope.
- **Fix & Coordinated Release:** We will collaborate with you to validate the fix and coordinate a public advisory date before any disclosure.

---

## Security Architecture & Defenses

PickyHack incorporates defense-in-depth architectural principles:

### 1. Automated Secret Redaction (`src/security/sanitizer.js`)
All telemetry, context snapshot exports, system prompt packets, and deliverable reports automatically pass through regular expression token sanitizers. Known cloud API keys (OpenAI, Anthropic, Gemini, OpenRouter), AWS access credentials, private keys, and plaintext password fields are redacted to `[REDACTED_SECRET: <TYPE>]` prior to persistence or export.

### 2. File Upload & Input Validation (`src/security/validator.js`)
Incoming context documents, multimodal attachments, and scan outputs (Burp XML, OWASP ZAP JSON) are validated against strict whitelists:
- Executable scripts and binaries (`.exe`, `.sh`, `.bat`, `.py`, `.elf`) are strictly rejected.
- Directory traversal sequences (`../`, `..\`) and null bytes (`%00`) are stripped.
- Cloud metadata IP targets (`169.254.169.254`, `metadata.google.internal`) are barred from SSRF or ingestion channels.

### 3. Air-Gapped & Local Privacy Runtimes
When connected to local inference servers (e.g. Ollama, LM Studio, vLLM), zero network telemetry leaves your workstation. Local engines are automatically flagged with `[🔒 Network: Local]`.

---

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |
