# Security Policy

## Responsible Disclosure

The PickyHack team takes the security of our stateless AI context harness, offensive security modules, and user data with paramount seriousness. If you discover a vulnerability or security flaw within PickyHack, please notify our team promptly.

### Reporting a Vulnerability

- **Contact:** Please email your findings directly to `security@pickyhack.local` (or open a private GitHub Security Advisory).
- **Include:**
  - Detailed steps to reproduce the vulnerability.
  - Proof-of-concept (PoC) code or requests.
  - Affected components (`src/security/`, `src/core/`, etc.).
  - Potential impact assessment.
- **Do not:** Disclose the vulnerability publicly until a coordinated fix and release has been issued.

We commit to acknowledging your advisory within 48 hours and providing regular updates on remediation progress.

---

## Security Architecture Guarantees

### 1. Zero Secret Leakage by Design
PickyHack integrates a built-in automated secret redaction engine (`src/security/sanitizer.js`). All:
- Context Snapshots,
- System Prompt Context Packets,
- Formal Deliverable exports (Markdown, HTML, PDF),
- Browser Console Telemetry,
are scanned for cloud API keys (OpenAI, Anthropic, Google Gemini, OpenRouter), AWS credentials, private keys, and plaintext password fields. Any matching token is automatically replaced with `[REDACTED_SECRET: <TYPE>]` before storage or egress.

### 2. Local Air-Gapped Privacy
When operating against sensitive internal networks or air-gapped systems:
- Operators can configure local OpenAI-compatible inference runtimes (e.g. Ollama, LM Studio, vLLM, llama.cpp).
- PickyHack automatically tags local engines with `[🔒 Network: Local]` and prevents any egress telemetry to cloud endpoints.

### 3. File Attachment & SSRF Hardening
- File uploads are strictly validated through `src/security/validator.js`.
- Disallowed executable extensions (`.exe`, `.sh`, `.bat`, `.py`, etc.) are blocked.
- Path traversal sequences (`../`, `..\`) and null bytes (`%00`) are neutralized.
- Cloud metadata IP ranges (`169.254.169.254`, `metadata.google.internal`) are strictly barred from request routing.

---

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |
