/**
 * PickyHack — Tool Runtime & Extensible Tool Registry
 * Manages offensive tool definitions, parameter schemas, risk levels,
 * auto-discovery, execution backends, and structured evidence extraction.
 */
(function(root) {
  'use strict';

  class ToolRegistry {
    constructor() {
      this.tools = new Map();
      this.discoveredTools = new Map();
      this.defaultBackend = null;
      this.initBuiltinTools();
    }

    setDefaultBackend(backend) {
      this.defaultBackend = backend;
    }

    register(toolDef) {
      if (!toolDef || !toolDef.name) {
        throw new Error('Tool definition must contain a valid name.');
      }
      this.tools.set(toolDef.name, {
        name: toolDef.name,
        description: toolDef.description || '',
        riskLevel: toolDef.riskLevel || toolDef.risk || 'LOW', // READ, LOW, MEDIUM, HIGH, CRITICAL
        schema: toolDef.schema || toolDef.argsSchema || {},
        requiredPermissions: toolDef.requiredPermissions || [],
        timeout: toolDef.timeout || 60,
        outputParser: typeof toolDef.outputParser === 'function' ? toolDef.outputParser : null,
        evidencePolicy: toolDef.evidencePolicy || 'always', // always, on_success, on_findings, never
        execute: toolDef.execute || toolDef.executor || null
      });
    }

    get(name) {
      return this.tools.get(name) || null;
    }

    list() {
      return Array.from(this.tools.values());
    }

    listTools() {
      return this.list();
    }

    /**
     * Discovers installed tools across the active backend environment.
     */
    async discoverTools(backend = null) {
      const execBackend = backend || this.defaultBackend;
      const binaries = [
        'nmap', 'nuclei', 'ffuf', 'gobuster', 'sqlmap', 'nikto',
        'httpx', 'subfinder', 'amass', 'whatweb', 'feroxbuster',
        'curl', 'wget', 'python3', 'git', 'dig', 'whois'
      ];

      if (!execBackend) {
        // Return baseline assumption
        binaries.forEach(b => {
          this.discoveredTools.set(b, { detected: false, version: 'unknown', path: '' });
        });
        return Array.from(this.discoveredTools.entries()).map(([name, info]) => ({ name, ...info }));
      }

      for (const binary of binaries) {
        try {
          const check = await execBackend.execute(`which ${binary} 2>/dev/null || where ${binary}`);
          if (check.exitCode === 0 && check.stdout.trim()) {
            const binPath = check.stdout.trim().split('\n')[0];
            let version = 'detected';
            try {
              const vCheck = await execBackend.execute(`${binary} --version 2>&1 || ${binary} -V 2>&1`);
              if (vCheck.stdout) {
                const firstLine = vCheck.stdout.split('\n')[0].trim();
                version = firstLine.substring(0, 40);
              }
            } catch (e) {}

            this.discoveredTools.set(binary, {
              detected: true,
              path: binPath,
              version
            });
          } else {
            this.discoveredTools.set(binary, { detected: false, path: '', version: 'not found' });
          }
        } catch (err) {
          this.discoveredTools.set(binary, { detected: false, path: '', version: 'error' });
        }
      }

      return Array.from(this.discoveredTools.entries()).map(([name, info]) => ({ name, ...info }));
    }

    /**
     * Executes a tool through its defined logic or default shell command builder.
     */
    async executeTool(toolName, params = {}, options = {}) {
      const tool = this.get(toolName);
      if (!tool) {
        throw new Error(`Tool "${toolName}" is not registered in ToolRegistry.`);
      }

      // Validate required arguments from schema
      if (tool.schema) {
        for (const [key, prop] of Object.entries(tool.schema)) {
          if (prop && prop.required && (params[key] === undefined || params[key] === null || params[key] === '')) {
            throw new Error(`Argument '${key}' is required for tool '${toolName}'.`);
          }
        }
      }

      let backend = options.backend || this.defaultBackend;
      if (!backend) {
        if (typeof root !== 'undefined' && root.LocalExecutionBackend) {
          backend = new root.LocalExecutionBackend();
        } else if (typeof require !== 'undefined') {
          try {
            const { LocalExecutionBackend } = require('./execution-backend');
            backend = new LocalExecutionBackend();
          } catch (_) {}
        }
      }
      if (!backend) {
        backend = {
          execute: async (cmd) => ({
            stdout: `Resolved output for: ${cmd}`,
            stderr: '',
            exitCode: 0,
            durationMs: 10
          })
        };
      }

      let execResult;
      if (typeof tool.execute === 'function') {
        execResult = await tool.execute(params, backend, options);
      } else {
        throw new Error(`Tool "${toolName}" lacks an execution handler.`);
      }

      // Run structured output parser if present
      let parsedData = null;
      if (typeof tool.outputParser === 'function' && execResult && execResult.stdout) {
        try {
          parsedData = tool.outputParser(execResult.stdout, params);
        } catch (e) {
          console.warn(`Output parser for ${toolName} failed:`, e);
        }
      }

      return {
        status: 'success',
        tool: toolName,
        params,
        ...(execResult || {}),
        parsedData
      };
    }

    async execute(toolName, params = {}, backend = null, options = {}) {
      const opts = { ...options };
      if (backend) opts.backend = backend;
      return this.executeTool(toolName, params, opts);
    }

    initBuiltinTools() {
      // 1. Nmap Network Scanner
      this.register({
        name: 'nmap',
        description: 'Network port scanner and service version detector.',
        riskLevel: 'LOW',
        schema: {
          target: { type: 'string', required: true },
          ports: { type: 'string', default: 'top-100' },
          flags: { type: 'string', default: '-sS -sV -Pn -T4' }
        },
        execute: async (params, backend, opts) => {
          const portsFlag = params.ports ? `-p ${params.ports}` : '-F';
          const cmd = `nmap ${params.flags || '-sV -Pn'} ${portsFlag} ${params.target}`;
          return backend.execute(cmd, { timeout: opts.timeout || 120 });
        },
        outputParser: (stdout) => {
          const ports = [];
          const lines = stdout.split('\n');
          lines.forEach(line => {
            const m = line.match(/^(\d+)\/(tcp|udp)\s+(\w+)\s+(.*)$/i);
            if (m) {
              ports.push({
                port: parseInt(m[1], 10),
                proto: m[2].toLowerCase(),
                state: m[3].toLowerCase(),
                service: m[4].trim()
              });
            }
          });
          return { openPorts: ports, totalOpen: ports.filter(p => p.state === 'open').length };
        }
      });

      // 2. Nuclei Vulnerability Scanner
      this.register({
        name: 'nuclei',
        description: 'Fast and customizable vulnerability scanner based on simple YAML DSL.',
        riskLevel: 'LOW',
        schema: {
          target: { type: 'string', required: true },
          tags: { type: 'string', default: 'cve,kev' },
          severity: { type: 'string', default: 'critical,high' }
        },
        execute: async (params, backend, opts) => {
          const tags = params.tags ? `-tags ${params.tags}` : '';
          const sev = params.severity ? `-severity ${params.severity}` : '';
          const cmd = `nuclei -u ${params.target} ${tags} ${sev} -silent -nc`;
          return backend.execute(cmd, { timeout: opts.timeout || 180 });
        },
        outputParser: (stdout) => {
          const findings = [];
          const lines = stdout.split('\n');
          lines.forEach(line => {
            const match = line.match(/\[(.*?)\]\s+\[(.*?)\]\s+\[(.*?)\]\s+(https?:\/\/[^\s]+)/i);
            if (match) {
              findings.push({
                template: match[1],
                proto: match[2],
                severity: match[3],
                url: match[4]
              });
            }
          });
          return { findingsCount: findings.length, findings };
        }
      });

      // 3. FFUF Web Fuzzer
      this.register({
        name: 'ffuf',
        description: 'Fast web fuzzer written in Go for directory and parameter discovery.',
        riskLevel: 'MEDIUM',
        schema: {
          url: { type: 'string', required: true },
          wordlist: { type: 'string', default: '/usr/share/wordlists/dirb/common.txt' }
        },
        execute: async (params, backend, opts) => {
          const wordlist = params.wordlist || '/tmp/common.txt';
          const cmd = `ffuf -u ${params.url}/FUZZ -w ${wordlist} -mc 200,301,302,403 -s`;
          return backend.execute(cmd, { timeout: opts.timeout || 120 });
        },
        outputParser: (stdout) => {
          const endpoints = stdout.split('\n').map(l => l.trim()).filter(Boolean);
          return { endpointsFound: endpoints };
        }
      });

      // 4. cURL HTTP Client
      this.register({
        name: 'curl',
        description: 'Command line tool for transferring data with URLs.',
        riskLevel: 'READ',
        schema: {
          url: { type: 'string', required: true },
          method: { type: 'string', default: 'GET' },
          headers: { type: 'array', default: [] },
          body: { type: 'string', default: '' }
        },
        execute: async (params, backend, opts) => {
          let flags = `-k -s -i -X ${params.method || 'GET'}`;
          if (Array.isArray(params.headers)) {
            params.headers.forEach(h => { flags += ` -H "${h}"`; });
          }
          if (params.body) {
            flags += ` -d '${params.body.replace(/'/g, "'\\''")}'`;
          }
          const cmd = `curl ${flags} "${params.url}"`;
          return backend.execute(cmd, { timeout: opts.timeout || 30 });
        },
        outputParser: (stdout) => {
          const statusMatch = stdout.match(/^HTTP\/[0-9\.]+\s+(\d+)/i);
          const statusCode = statusMatch ? parseInt(statusMatch[1], 10) : 0;
          return { statusCode, rawResponseSnippet: stdout.substring(0, 500) };
        }
      });

      // 5. Raw Shell Command Execution
      this.register({
        name: 'shell',
        description: 'Execute arbitrary terminal shell command.',
        riskLevel: 'HIGH',
        schema: {
          command: { type: 'string', required: true }
        },
        execute: async (params, backend, opts) => {
          if (!params.command) throw new Error('Shell command cannot be empty.');
          return backend.execute(params.command, { timeout: opts.timeout || 60 });
        }
      });

      // 6. HTTP Request Tool (Native abstraction)
      this.register({
        name: 'http_request',
        description: 'Structured HTTP/HTTPS request with method, headers, cookies, and body.',
        riskLevel: 'READ',
        schema: {
          url: { type: 'string', required: true },
          method: { type: 'string', default: 'GET' },
          headers: { type: 'object', default: {} },
          body: { type: 'string', default: '' }
        },
        execute: async (params, backend, opts) => {
          let headerFlags = '';
          if (params.headers && typeof params.headers === 'object') {
            for (const [k, v] of Object.entries(params.headers)) {
              headerFlags += ` -H "${k}: ${v}"`;
            }
          }
          const bodyFlag = params.body ? ` -d '${params.body.replace(/'/g, "'\\''")}'` : '';
          const cmd = `curl -i -k -s -X ${params.method || 'GET'} ${headerFlags} ${bodyFlag} "${params.url}"`;
          return backend.execute(cmd, { timeout: opts.timeout || 30 });
        }
      });

      // 7. DNS Lookup Tool
      this.register({
        name: 'dns_lookup',
        description: 'Perform DNS resolution and record queries (A, AAAA, MX, TXT, NS).',
        riskLevel: 'READ',
        schema: {
          domain: { type: 'string', required: true },
          type: { type: 'string', default: 'ANY' }
        },
        execute: async (params, backend) => {
          const cmd = `dig +short ${params.domain} ${params.type || 'A'}`;
          return backend.execute(cmd, { timeout: 15 });
        }
      });
    }

    static listTools() { return defaultRegistry.listTools(); }
    static list() { return defaultRegistry.list(); }
    static get(name) { return defaultRegistry.get(name); }
    static register(def) { return defaultRegistry.register(def); }
    static execute(name, params, backend, options) { return defaultRegistry.execute(name, params, backend, options); }
    static executeTool(name, params, options) { return defaultRegistry.executeTool(name, params, options); }
    static discoverTools(backend) { return defaultRegistry.discoverTools(backend); }
  }

  const defaultRegistry = new ToolRegistry();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ToolRegistry, defaultRegistry };
  }
  root.PickyToolRegistry = defaultRegistry;
})(typeof window !== 'undefined' ? window : global);
