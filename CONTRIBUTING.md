# Contributing to PickyHack

First off, thank you for considering contributing to PickyHack! We welcome community contributions that reinforce our core mission: providing a transparent, stateless AI context harness for professional penetration testers and offensive security operators.

---

## Code of Ethics

PickyHack is engineered strictly for authorized security research, educational simulation, and professional penetration testing with explicit written authorization. We strictly prohibit the use of PickyHack for unauthorized attacks, exploitation of unauthorized networks, or malicious activity.

---

## Repository Structure

```text
pickyhack/
├── src/
│   ├── config/       # Master configuration & Universal Provider catalog
│   ├── core/         # Reactive ProjectState, ContextEngine, SnapshotManager
│   ├── security/     # Secret sanitizer, input validator, SSRF defenses
│   ├── providers/    # Universal Provider Registry & model discovery
│   ├── modules/      # Offensive security tools (Burp bridge, Attack graph, Token pruner)
│   ├── ui/           # Retro Windows 98 desktop, windows manager, chat UI
│   └── backend/      # Lightweight Python telemetry & mock API server
├── tests/
│   ├── unit/         # Unit test suites (Sanitizer, Validator, Providers, Context)
│   ├── integration/  # Integration test suites (Deliverable generator, Simulation)
│   └── run_all.js    # Zero-dependency test runner
├── docs/             # Technical deep dives and architecture guides
└── assets/           # High-resolution branding and vector icons
```

---

## Development Environment & Setup

### 1. Prerequisites
- **Node.js** >= 18.0.0 (LTS recommended)
- **Python** >= 3.10 (standard library only, no pip dependencies needed)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### 2. Local Installation
```bash
# Clone the repository
git clone https://github.com/kalidraco/pickyhack.git
cd pickyhack

# Install dependencies
npm install

# Launch local development server (defaults to http://localhost:8088)
npm run dev
```

### 3. Local Verification Commands
Before opening any Pull Request, ensure that all automated checks pass locally:
```bash
# 1. Lint & syntax check
npm run lint

# 2. Complete unit & integration test suites
npm test

# 3. Build & bundle verification
npm run build

# 4. Dependency security audit
npm run audit
```

---

## Branching Model & Development Workflow

The `main` branch is protected. Direct pushes and force pushes to `main` are strictly blocked. All modifications must arrive through Pull Requests:

```text
feature/* or fix/*
       ↓
  Pull Request
       ↓
  GitHub Actions CI Gate
   ├── 1. Dependencies Installation
   ├── 2. Lint & Code Style Check
   ├── 3. Syntax Verification (JS + Python)
   ├── 4. Automated Tests (7 suites)
   ├── 5. Build Verification
   └── 6. Dependency Security Audit
       ↓
  Security Scanning (CodeQL & Dependency Review)
       ↓
  Review & Conversation Resolution
       ↓
  Linear Merge (Squash / Rebase)
       ↓
      main
```

### Step-by-Step Contribution Guide

1. **Create a Branch:**
   Branch off `main` with a descriptive name:
   ```bash
   git checkout -b feature/my-new-feature
   # or
   git checkout -b fix/issue-description
   ```

2. **Make Changes:**
   Keep changes focused, clean, and modular.
   - Follow existing architecture in `src/`.
   - Never commit `.env` or sensitive API tokens.
   - Any new feature should include tests under `tests/unit/` or `tests/integration/`.

3. **Commit Conventions:**
   We follow standard Conventional Commits:
   - `feat(...)`: New capability or provider feature
   - `fix(...)`: Bug fix or edge-case correction
   - `docs(...)`: Documentation improvements
   - `test(...)`: Adding or updating test suites
   - `refactor(...)`: Code refactoring without behavioral change
   - `security(...)`: Security improvements and sanitization

4. **Verify Locally:**
   ```bash
   npm run lint && npm test && npm run build && npm run audit
   ```

5. **Open a Pull Request:**
   - Push your branch to GitHub.
   - Open a PR targeting `main`.
   - Fill in all sections of `.github/PULL_REQUEST_TEMPLATE.md` (What changed, Why, Testing, Security impact, Breaking changes, Documentation updated).

6. **CI Validation & Review:**
   - The GitHub Actions CI Gate must pass 100% green.
   - All review comments and conversations must be resolved before merging.

---

## Security & Secrets Policy

- **Never commit credentials:** `.env` and sensitive tokens are strictly git-ignored.
- **Push Protection Active:** GitHub secret scanning push protection is active on this repository. Any commit containing known secret tokens will be rejected at push time.
- **Vulnerability Reporting:** If you detect a security vulnerability in PickyHack, do not report it in public issues. Refer to [SECURITY.md](SECURITY.md) to open a private GitHub Security Advisory.
