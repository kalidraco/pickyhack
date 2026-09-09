# PickyHack Tool Runtime & Execution Backends

PickyHack decouples agent reasoning from command execution through two core layers:
1. **Tool Registry:** Standardized schema, argument validation, risk classification, and output parsers.
2. **Execution Backends:** Pluggable execution environments (Local daemon, Remote Kali/Parrot via SSH, or Docker container).

---

## 1. Execution Backends

All backends implement the common `ExecutionBackend` contract:
- `execute(command, options)` $\rightarrow$ `{ stdout, stderr, exitCode, durationMs }`
- `checkTool(toolName)` $\rightarrow$ `{ installed: boolean, version: string, path: string }`

### Supported Backends

| Backend | Class | Transport | Use Case |
| :--- | :--- | :--- | :--- |
| **Local** | `LocalExecutionBackend` | Local Python Daemon (`http://localhost:8088/api/execute`) | Development and native workstation testing |
| **Remote SSH** | `SSHExecutionBackend` | SSH via Paramiko (`/api/ssh/connect` & `/api/execute`) | Remote Kali Linux VM, VPS, or dedicated pentest hardware |
| **Docker** | `DockerExecutionBackend` | Local Docker socket / container exec | Isolated containerized execution |

---

## 2. Built-in Tools

| Tool Name | Risk Level | Description | Arguments Schema |
| :--- | :--- | :--- | :--- |
| `nmap` | `MEDIUM` | Port scanning & service banner detection | `{ target: string, ports?: string, flags?: string }` |
| `nuclei` | `HIGH` | Vulnerability template & CVE verification | `{ target: string, templates?: string, severity?: string }` |
| `ffuf` | `MEDIUM` | Fast web directory & parameter fuzzing | `{ url: string, wordlist?: string, flags?: string }` |
| `curl` | `READ` | Raw HTTP/S banner & response inspection | `{ url: string, method?: string, headers?: object, data?: string }` |
| `browser_action` | `LOW` | Headless browser automation (screenshot, click, DOM) | `{ action: string, url?: string, selector?: string, value?: string }` |
| `dns_lookup` | `READ` | DNS record queries (A, AAAA, MX, TXT, NS) | `{ domain: string, type?: string }` |
| `shell` | `HIGH` / `CRITICAL` | Direct terminal execution (strictly gated) | `{ command: string }` |

---

## 3. Registering Custom Tools

Tools can be added at runtime through `ToolRegistry.register()`:

```javascript
const { ToolRegistry } = require('./src/runtime/tool-registry');

ToolRegistry.register({
  name: 'subfinder',
  description: 'Fast passive subdomain enumeration tool',
  category: 'recon',
  riskLevel: 'LOW',
  schema: {
    domain: { type: 'string', required: true, description: 'Target root domain' }
  },
  execute: async (params, backend) => {
    const cmd = `subfinder -d ${params.domain} -silent`;
    return await backend.execute(cmd, { timeout: 30 });
  },
  outputParser: (stdout) => {
    const subdomains = stdout.split('\n').map(s => s.trim()).filter(Boolean);
    return { subdomains, count: subdomains.length };
  }
});
```

---

## 4. Safety Consent Engine (`RiskEngine`)

Execution is checked against the operational safety policy:
- **`READ` & `LOW` Risk:** Auto-approved under standard policy.
- **`MEDIUM` Risk:** Auto-approved or prompted depending on project settings.
- **`HIGH` & `CRITICAL` Risk:** Strictly paused until operator clicks `[Authorize Execution]` in the chat stream.
- **Out-of-Scope Enforcement:** Any command targeting an IP or domain in the project's out-of-scope list is unconditionally blocked.
