# Security by Design

PickyHack operates under rigorous defensive engineering standards to protect operators, target assets, and sensitive client credentials throughout the assessment lifecycle.

---

## 1. Secret Detection & Redaction Engine (`src/security/sanitizer.js`)

In offensive security operations, commands and tool outputs frequently contain authorization headers, session tokens, passwords, and API credentials. If these tokens are copied into an un-sanitized context window or exported into an engagement report, critical operational security (OpSec) is compromised.

PickyHack automatically redacts:
- **Cloud Provider Keys:** OpenAI (`sk-...`), Anthropic (`sk-ant-...`), Google Gemini (`AIzaSy...`), OpenRouter (`sk-or-...`).
- **Cloud Infrastructure:** AWS Access Keys (`AKIA...`).
- **Private Keys:** RSA, EC, and OpenSSH private key PEM blocks.
- **HTTP Headers:** Generic Bearer authorization tokens (`Bearer eyJ...`).
- **Plaintext Configurations:** Password and database secret strings.

### Redaction Example
```text
Raw Input:
curl -H "Authorization: Bearer sk-ant-api03-secret12345678901234567890" https://target.internal/api

Sanitized Context / Deliverable:
curl -H "Authorization: [REDACTED_SECRET: ANTHROPIC_API_KEY]" https://target.internal/api
```

---

## 2. Strict Input & Upload Validation (`src/security/validator.js`)

Operators can stage scans and logs through drag-and-drop or file pickers. PickyHack applies strict defenses:
- **Disallowed Executables:** Blocks scripts, binaries, and executables (`.exe`, `.dll`, `.sh`, `.bat`, `.cmd`, `.py`, `.ps1`, `.vbs`).
- **Quota Enforcements:** Maximum 5 MB per individual file, maximum 15 MB total staged per query.
- **Path Traversal Defense:** Sanitizes filenames to eliminate directory traversal sequences (`../`, `..\`) and null bytes (`%00`).
- **SSRF Defense:** Prevents redirection or fetching of cloud metadata endpoints (`169.254.169.254`, `metadata.google.internal`) and local loopback abuse.

---

## 3. Exploitability Priority Score (EPS)

Rather than treating all CVEs equally based solely on abstract CVSS base scores, PickyHack calculates an **Exploitability Priority Score (EPS / 100)**:
- **Known Exploited Vulnerabilities (CISA KEV):** Verified in-the-wild weaponization triggers EPS > 90.
- **Public Weaponized PoCs:** Availability of functional GitHub/Metasploit exploit modules elevates priority.
- **Perimeter Reachability:** Unauthenticated internet-facing attack surfaces are prioritized over internal authenticated endpoints.
