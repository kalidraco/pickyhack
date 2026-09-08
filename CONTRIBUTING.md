# Contributing to PickyHack

First off, thank you for considering contributing to PickyHack! We welcome community contributions that reinforce our core mission: providing a transparent, stateless AI context harness for professional penetration testers and offensive security operators.

---

## Code of Ethics

PickyHack is engineered strictly for authorized security research, educational simulation, and professional penetration testing with explicit written authorization. We strictly prohibit the use of PickyHack for unauthorized attacks, exploitation of unauthorized networks, or malicious activity.

---

## 2-Minute Architecture Guide for Contributors

Before writing code, familiarize yourself with our clean repository separation:

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

## Development Workflow

### 1. Prerequisites
- **Node.js** >= 18.0.0
- **Python** >= 3.10 (for local preview server)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### 2. Setup
```bash
# Clone the repository
git clone https://github.com/pickyhack/pickyhack.git
cd pickyhack

# Launch local development server
npm run dev
# Open http://localhost:8000 in your browser
```

### 3. Running Tests
We enforce zero-dependency automated unit and integration tests:
```bash
# Run full test suite
npm test

# Run syntax checks
npm run check
```

Every PR must pass `npm test` and `npm run check` with 0 failures before review.

---

## Contribution Guidelines

1. **Keep it Modular**: New pentest tools belong in `src/modules/`, new LLM providers in `src/config/providers-catalog.js`.
2. **Defend the Context**: Never inject unpruned or unsanitized credentials into Context Snapshots or exports.
3. **Respect the Windows 98 Aesthetics**: Window controls, pixelated typography, beveled borders, and taskbar integration must remain consistent with the authentic 1998 user experience.
4. **Write Tests**: Any new module or provider capability must include a corresponding test in `tests/unit/` or `tests/integration/`.

---

## Pull Request Process

1. Create a feature branch (`git checkout -b feat/my-awesome-feature`).
2. Commit your changes with clear, descriptive commit messages (`feat(module): add nuclei output parser`).
3. Ensure all tests pass (`npm test`).
4. Push to your branch and open a Pull Request against `main`.
