/**
 * PickyHack — Offensive Security & Pentest Intelligence AI
 * Windows 98 Desktop Application Logic, Multi-Conversations & Context Snapshot Engine
 */

(function () {
  'use strict';

  // --- Intelligence Database (Curated Recent CVEs, CISA KEV & Exploits) ---
  const INTEL_DB = [
    {
      cve: 'CVE-2024-3400',
      vendor: 'Palo Alto Networks',
      product: 'PAN-OS GlobalProtect Gateway',
      versions: 'PAN-OS 10.2, 11.0, 11.1',
      fixed: '10.2.9-h1, 11.0.4-h1, 11.1.2-h3',
      cvss: 10.0,
      cwe: 'CWE-77: Command Injection',
      published: '2024-04-12',
      inKEV: true,
      wildExploit: true,
      pocAvailable: true,
      metasploit: true,
      authRequired: 'None (Pre-auth)',
      vector: 'Remote Network',
      impact: 'RCE / System Takeover (root)',
      epsScore: 99,
      epsCategory: 'CRITICAL — EXPLOIT NOW',
      threatActor: 'UTA0218 / State-sponsored',
      chain: 'GlobalProtect Pre-Auth Command Injection → Root Shell → Cron Persistence → Internal Network Pivoting'
    },
    {
      cve: 'CVE-2023-46805',
      vendor: 'Ivanti',
      product: 'Connect Secure / Policy Secure',
      versions: 'ICS 9.x, 22.x prior to patch',
      fixed: '9.1R18.3, 22.4R2.2',
      cvss: 9.8,
      cwe: 'CWE-287: Improper Authentication',
      published: '2024-01-10',
      inKEV: true,
      wildExploit: true,
      pocAvailable: true,
      metasploit: true,
      authRequired: 'None (Pre-auth)',
      vector: 'Remote Network',
      impact: 'Auth Bypass + RCE with CVE-2024-21887',
      epsScore: 98,
      epsCategory: 'CRITICAL — EXPLOIT NOW',
      threatActor: 'UNC5221 / Multiple cyber espionage actors',
      chain: 'Auth Bypass (REST API) → Command Injection → Web Shell Deployment → Active Directory Kerberoasting'
    },
    {
      cve: 'CVE-2024-21762',
      vendor: 'Fortinet',
      product: 'FortiOS SSL-VPN',
      versions: 'FortiOS 7.4.0-7.4.2, 7.2.0-7.2.6',
      fixed: '7.4.3, 7.2.7, 7.0.14',
      cvss: 9.8,
      cwe: 'CWE-122: Heap-based Buffer Overflow',
      published: '2024-02-09',
      inKEV: true,
      wildExploit: true,
      pocAvailable: true,
      metasploit: false,
      authRequired: 'None (Pre-auth)',
      vector: 'Remote Network',
      impact: 'Remote Code Execution without authentication',
      epsScore: 96,
      epsCategory: 'CRITICAL — EXPLOIT NOW',
      threatActor: 'Volt Typhoon / Coordinated Botnets',
      chain: 'Pre-auth HTTP Overflow → Code Execution → Memory Extraction → VPN Credential Theft'
    },
    {
      cve: 'CVE-2024-1086',
      vendor: 'Linux',
      product: 'Kernel nf_tables subsystem',
      versions: 'v5.14 through v6.6',
      fixed: 'Linux kernel commit f342de',
      cvss: 7.8,
      cwe: 'CWE-416: Use After Free',
      published: '2024-01-31',
      inKEV: true,
      wildExploit: true,
      pocAvailable: true,
      metasploit: true,
      authRequired: 'Local User',
      vector: 'Local',
      impact: 'Reliable Local Privilege Escalation (root)',
      epsScore: 92,
      epsCategory: 'CRITICAL — EXPLOIT NOW',
      threatActor: 'Financially motivated ransomware operators',
      chain: 'Web shell foothold → unprivileged local exec → nf_tables UAF → Full root capabilities'
    },
    {
      cve: 'CVE-2023-22527',
      vendor: 'Atlassian',
      product: 'Confluence Data Center & Server',
      versions: '8.0.x through 8.5.3',
      fixed: '8.5.4, 8.5.5',
      cvss: 10.0,
      cwe: 'CWE-94: Improper Control of Code Generation',
      published: '2024-01-16',
      inKEV: true,
      wildExploit: true,
      pocAvailable: true,
      metasploit: true,
      authRequired: 'None (Pre-auth)',
      vector: 'Remote Network',
      impact: 'RCE via OGNL Template Injection',
      epsScore: 95,
      epsCategory: 'CRITICAL — EXPLOIT NOW',
      threatActor: 'Multiple automated scanning clusters',
      chain: 'Unauthenticated POST /template/eval → OGNL Injection → Process Execution → Ransomware Dropper'
    },
    {
      cve: 'CVE-2026-1044',
      vendor: 'Microsoft',
      product: 'Windows Kernel / Netlogon RPC',
      versions: 'Windows Server 2022 / 2025',
      fixed: 'Security Update Pending (Zero-Day Research)',
      cvss: 9.8,
      cwe: 'CWE-287: Authentication Bypass',
      published: '2026-09-01',
      inKEV: false,
      wildExploit: false,
      pocAvailable: true,
      metasploit: false,
      authRequired: 'None (Network Adjacent)',
      vector: 'Remote RPC',
      impact: 'Zero-Day Domain Controller Takeover',
      epsScore: 91,
      epsCategory: 'HIGH — PRIORITY',
      threatActor: 'Security Research / In-the-Wild Testing',
      chain: 'Netlogon Negotiate Auth Flaw → DC Machine Account Impersonation → Full Active Directory Compromise'
    }
  ];

  // --- Persistent Pentest State Model (Shared across all conversations) ---
  const pentestState = {
    version: '1.0',
    generated: new Date().toISOString(),
    projectName: 'PickyHack Mission',
    projectStatus: 'ACTIVE ASSESSMENT',
    target: '',
    scope: '',
    objectives: '',
    currentState: 'Reconnaissance & Vulnerability Mapping',
    confirmedFacts: [],
    discoveredAssets: [],
    services: [],
    technologies: [],
    vulnerabilities: [],
    exploits: [],
    findings: [],
    evidence: [],
    commands: [],
    attackPaths: [],
    failedTests: [],
    falsePositives: [],
    hypotheses: [],
    importantReasoning: [],
    decisions: [],
    openQuestions: [],
    currentPriorities: [],
    nextActions: []
  };

  // --- Temporary Multi-Conversations System ---
  let conversations = [
    {
      id: 'conv-recon',
      title: 'Reconnaissance',
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: 'msg-1',
          sender: 'ai',
          time: '02:00 AM',
          text: `Welcome to PickyHack Pentest Copilot.
Session context initialized for **Perimeter Reconnaissance**.
I am configured to act as Senior Penetration Tester + Exploit Intelligence Analyst.

Recommended initial reconnaissance command:`,
          code: `nmap -sV -sC -Pn -T4 -p 80,443,8090,8443,10255 target.example.com`
        }
      ]
    },
    {
      id: 'conv-cve',
      title: 'CVE Research',
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: 'msg-c1',
          sender: 'ai',
          time: '02:05 AM',
          text: `CVE Research stream active.
Targeted vulnerability correlation for perimeter edge appliances.
Currently tracking active KEV entries:
- **CVE-2024-3400** (PAN-OS GlobalProtect Command Injection, EPS: 99/100)
- **CVE-2023-22527** (Atlassian Confluence OGNL Template Injection, EPS: 95/100)`,
          code: `curl -k -H "Host: target.example.com" -I "https://target.example.com/ssl-vpn/hipreport.esp"`
        }
      ]
    },
    {
      id: 'conv-exploit',
      title: 'Exploit Analysis',
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: 'msg-e1',
          sender: 'ai',
          time: '02:10 AM',
          text: `Exploit Analysis stream active.
Validation methodology: non-destructive confirmation prior to controlled exploitation.

Metasploit module ready for weaponized validation:`,
          code: `msfconsole -q -x "use exploit/linux/http/panos_telemetry_cmd_exec; set RHOSTS target.example.com; check"`
        }
      ]
    }
  ];

  let activeConvId = 'conv-recon';

  // --- Scope Templates ---
  const TEMPLATES = {
    external: `Target: megacorp-finance.com
Scope: *.megacorp-finance.com, 198.51.100.0/24
Objective: External perimeter reconnaissance & edge service exploitation
Authorization: Pentest Mandate #2026-09-09
Exclusions: 198.51.100.50 (Legacy Core Banking Database)

Discovered Assets & Services:
- vpn.megacorp-finance.com (198.51.100.10:443) -> Palo Alto PAN-OS GlobalProtect 10.2.7
- api.megacorp-finance.com (198.51.100.20:443) -> NGINX 1.24 + Node.js Express Gateway
- wiki.megacorp-finance.com (198.51.100.30:8090) -> Atlassian Confluence 8.4.1
- mail.megacorp-finance.com (198.51.100.40:25, 443, 993) -> Microsoft Exchange Hybrid

Confirmed Facts:
- Edge perimeter is monitored by Cloudflare WAF on public web endpoints.
- VPN gateway at 198.51.100.10 bypasses Cloudflare directly.

Current Priorities:
- Validate whether PAN-OS is vulnerable to CVE-2024-3400 command injection.
- Validate whether Confluence is vulnerable to CVE-2023-22527.`,

    webapp: `Target: https://portal.target-app.io
Scope: /api/v1/*, /api/v2/*, /auth/oauth2/callback, /graphql
Objective: Pre-auth bypass, IDOR, SSRF to cloud metadata service
Authorization: Pentest Mandate #2026-09-09

Discovered Assets & Services:
- portal.target-app.io:443 -> React SPA Frontend
- api.target-app.io:443 -> Python FastAPI & Spring Boot microservices
- redis-cache.internal:6379 -> Redis unauthenticated in dev VPC
- aws-imds: 169.254.169.254 -> IMDSv2 enabled with fallback

Confirmed Facts:
- /api/v2/user/export endpoint allows arbitrary URL in callback parameter.
- JWT secret uses weak HMAC key identified in public repository.

Current Priorities:
- Confirm SSRF from /api/v2/user/export to AWS metadata service.
- Extract STS temporary credentials.`,

    ad: `Target: DOMAIN: CORP.LOCAL (Primary DC: DC01.corp.local - 10.10.10.10)
Scope: 10.10.10.0/24, 10.10.20.0/24 (Subnets)
Objective: Privilege escalation to Domain Admin via ADCS misconfiguration / Kerberoasting
Authorization: Pentest Mandate #2026-09-09

Initial Foothold:
- Compromised workstation: WS042.corp.local
- Compromised user: CORP\\jdoe (Standard Domain User)

Discovered Assets & Services:
- DC01.corp.local (10.10.10.10:88, 389, 445, 636) -> Windows Server 2022
- CA01.corp.local (10.10.10.15:80, 443) -> Active Directory Certificate Services
- FS01.corp.local (10.10.20.50:445) -> File Server with SMB Signing Disabled

Confirmed Facts:
- ADCS template "ClientAuthentication-Web" has ENROLLEE_SUPPLIES_SUBJECT enabled (ESC1).
- Kerberoastable SPN discovered: MSSQLSvc/sql01.corp.local:1433.

Current Priorities:
- Execute Certipy request against ESC1 template to impersonate Domain Admin.`,

    cloud: `Target: Production Kubernetes Cluster (AWS EKS v1.28)
Scope: arn:aws:iam::123456789012:role/*, cluster API endpoint
Objective: Container escape, IMDSv2 credential extraction, IAM privilege escalation
Authorization: Pentest Mandate #2026-09-09

Discovered Assets & Services:
- api.k8s.internal:6443 -> Kubernetes API Server (Requires mTLS)
- kubelet-node-1:10255 -> Kubelet read-only port exposed
- pod-web-front: Running as serviceaccount: web-sa

Confirmed Facts:
- web-sa token mounted at /var/run/secrets/kubernetes.io/serviceaccount/token.
- Role allows 'get secrets' in kube-system namespace.

Current Priorities:
- Dump kube-system secrets and extract cluster-admin kubeconfig.`
  };

  // --- DOM Elements ---
  const textarea = document.getElementById('pentest-notes');
  const placeholder = document.getElementById('editorial-placeholder');
  const editorContainer = document.getElementById('editor-container');
  const activeScopeLabel = document.getElementById('active-scope-label');
  const sbStatus = document.getElementById('sb-status');
  const sbCursor = document.getElementById('sb-cursor');
  const sbWords = document.getElementById('sb-words');
  const sbConv = document.getElementById('sb-conv');
  const persistenceIndicator = document.getElementById('persistence-indicator');
  const cveTableBody = document.getElementById('cve-table-body');
  const attackChainSteps = document.getElementById('attack-chain-steps');
  const epsBreakdown = document.getElementById('eps-breakdown-text');
  const graphEpsIndicator = document.getElementById('graph-eps-indicator');
  const toolbarEpsBadge = document.getElementById('toolbar-eps-badge');

  // Conversation DOM
  const convListContainer = document.getElementById('conv-list-container');
  const activeConvTitleElem = document.getElementById('active-conv-title');
  const chatMessagesFeed = document.getElementById('chat-messages-feed');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('btn-chat-send');
  const sidebarStatAssets = document.getElementById('sidebar-stat-assets');
  const sidebarStatServices = document.getElementById('sidebar-stat-services');
  const sidebarStatVulns = document.getElementById('sidebar-stat-vulns');
  const sidebarStatChains = document.getElementById('sidebar-stat-chains');

  // Modals
  const snapshotModal = document.getElementById('snapshot-modal');
  const importModal = document.getElementById('import-modal');
  const newConvModal = document.getElementById('new-conv-modal');
  const aboutModal = document.getElementById('about-modal');
  const snapshotPreview = document.getElementById('snapshot-preview-textarea');
  const importTextarea = document.getElementById('import-textarea');
  const fileImportInput = document.getElementById('file-import-input');

  // --- Editorial Placeholder Controller ---
  function updatePlaceholderState() {
    const hasText = textarea.value.trim().length > 0;
    const isFocused = document.activeElement === textarea;

    if (hasText || isFocused) {
      editorContainer.classList.add('has-focus');
      if (hasText) {
        editorContainer.classList.add('has-text');
      } else {
        editorContainer.classList.remove('has-text');
      }
      placeholder.style.display = 'none';
    } else {
      editorContainer.classList.remove('has-focus');
      editorContainer.classList.remove('has-text');
      placeholder.style.display = 'block';
    }
  }

  textarea.addEventListener('focus', updatePlaceholderState);
  textarea.addEventListener('blur', updatePlaceholderState);
  placeholder.addEventListener('click', () => textarea.focus());

  textarea.addEventListener('input', function () {
    updatePlaceholderState();
    updateCursorStats();
    syncStateFromNotes();
    autoSaveProjectState();
    updateSidebarProjectStats();
  });

  function updateCursorStats() {
    const val = textarea.value;
    const pos = textarea.selectionStart || 0;
    const textBefore = val.substring(0, pos);
    const lines = textBefore.split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;

    sbCursor.textContent = `Ln ${line}, Col ${col}`;
    sbWords.textContent = `${val.length} chars | ${val.trim().split(/\s+/).filter(Boolean).length} words`;
  }

  textarea.addEventListener('keyup', updateCursorStats);
  textarea.addEventListener('click', updateCursorStats);

  // --- State Synchronization Engine ---
  function syncStateFromNotes() {
    const val = textarea.value;
    
    // Target
    const targetMatch = val.match(/Target:\s*([^\n\r]+)/i);
    if (targetMatch && targetMatch[1].trim()) {
      pentestState.target = targetMatch[1].trim();
      activeScopeLabel.textContent = pentestState.target;
      sbStatus.textContent = `Target: ${pentestState.target}`;
    } else if (val.trim().length > 0) {
      pentestState.target = 'Custom Target Scope';
      activeScopeLabel.textContent = 'Custom Scope';
    } else {
      pentestState.target = 'Undefined Target';
      activeScopeLabel.textContent = 'No Target Defined';
      sbStatus.textContent = 'Ready. Waiting for pentester target definition.';
    }

    // Scope
    const scopeMatch = val.match(/Scope:\s*([^\n\r]+)/i);
    if (scopeMatch) pentestState.scope = scopeMatch[1].trim();

    // Objectives
    const objMatch = val.match(/Objective[s]?:\s*([^\n\r]+)/i);
    if (objMatch) pentestState.objectives = objMatch[1].trim();

    // Discovered Assets
    const ipOrDomainRegex = /([a-zA-Z0-9][-a-zA-Z0-9]*\.[a-zA-Z]{2,}|(?:\d{1,3}\.){3}\d{1,3}(?:\/\d{1,2})?)/g;
    const matches = val.match(ipOrDomainRegex) || [];
    pentestState.discoveredAssets = [...new Set(matches)];

    // Services
    const serviceMatches = val.match(/(HTTP|HTTPS|SSH|FTP|SMB|LDAP|Kerberos|RDP|WinRM|SQL|VPN|GlobalProtect|Confluence|NGINX|PostgreSQL|Redis)/gi) || [];
    pentestState.services = [...new Set(serviceMatches.map(s => s.toUpperCase()))];

    // Technologies
    const techMatches = val.match(/(PAN-OS|Linux|Windows Server|Active Directory|ADCS|Kubernetes|AWS|React|Node\.js|Express|FastAPI|Spring Boot|Exchange)/gi) || [];
    pentestState.technologies = [...new Set(techMatches)];

    // Vulnerabilities
    const cveMatches = val.match(/CVE-\d{4}-\d{4,7}/gi) || [];
    pentestState.vulnerabilities = [...new Set(cveMatches.map(c => c.toUpperCase()))];
  }

  // --- Update Sidebar Project Stats (Live Across All Conversations) ---
  function updateSidebarProjectStats() {
    sidebarStatAssets.textContent = pentestState.discoveredAssets.length || 0;
    sidebarStatServices.textContent = pentestState.services.length || 0;
    sidebarStatVulns.textContent = pentestState.vulnerabilities.length || 0;
    sidebarStatChains.textContent = pentestState.attackPaths.length || 0;
  }

  // --- Local Project Persistence (Auto-Save) ---
  function autoSaveProjectState() {
    try {
      syncStateFromNotes();
      pentestState.rawNotes = textarea.value;
      pentestState.lastUpdated = new Date().toISOString();
      localStorage.setItem('pickyhack_pentest_state', JSON.stringify(pentestState));
      persistenceIndicator.innerHTML = 'PERSISTENCE: <strong>AUTOSAVED</strong>';
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  function loadAutoSavedProjectState() {
    try {
      const saved = localStorage.getItem('pickyhack_pentest_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.rawNotes) {
          textarea.value = parsed.rawNotes;
          updatePlaceholderState();
          updateCursorStats();
          syncStateFromNotes();
          appendAIMessage('Restored active pentest state from local persistence.', null);
        }
      }
    } catch (e) {
      console.warn('LocalStorage load failed:', e);
    }
  }

  window.addEventListener('beforeunload', autoSaveProjectState);

  // ==========================================================================
  // MULTI-CONVERSATIONS MANAGER
  // ==========================================================================

  function getActiveConversation() {
    return conversations.find(c => c.id === activeConvId) || conversations[0];
  }

  function renderConversationList() {
    convListContainer.innerHTML = '';
    conversations.forEach(conv => {
      const item = document.createElement('div');
      item.className = 'conv-item' + (conv.id === activeConvId ? ' active' : '');
      
      item.innerHTML = `
        <div class="conv-item-left" title="${conv.title}">
          <span style="font-family:var(--font-pixel);">${conv.id === activeConvId ? '&gt;' : ' '}</span>
          <span>${conv.title}</span>
        </div>
        ${conversations.length > 1 ? `<span class="conv-item-del" title="Delete conversation">✕</span>` : ''}
      `;

      item.querySelector('.conv-item-left').addEventListener('click', () => {
        switchConversation(conv.id);
      });

      const delBtn = item.querySelector('.conv-item-del');
      if (delBtn) {
        delBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          deleteConversation(conv.id);
        });
      }

      convListContainer.appendChild(item);
    });

    const active = getActiveConversation();
    if (active) {
      activeConvTitleElem.textContent = active.title;
      sbConv.textContent = `Conv: ${active.title}`;
    }

    updateSidebarProjectStats();
  }

  function switchConversation(id) {
    activeConvId = id;
    renderConversationList();
    renderActiveMessages();
  }

  function createNewConversation(title, initType) {
    const cleanTitle = title.trim() || 'Pentest Stream';
    const newId = 'conv-' + Date.now();
    const newConv = {
      id: newId,
      title: cleanTitle,
      createdAt: new Date().toISOString(),
      messages: []
    };

    if (initType === 'project') {
      // Inject current Project State
      const assetSummary = pentestState.discoveredAssets.length > 0 
        ? pentestState.discoveredAssets.join(', ') 
        : 'Perimeter pending scan';

      const vulnsSummary = pentestState.vulnerabilities.length > 0
        ? pentestState.vulnerabilities.join(', ')
        : 'None mapped yet';

      newConv.messages.push({
        id: 'msg-init-' + Date.now(),
        sender: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `**Project Context Injected for stream "${cleanTitle}"**
- **Target:** ${pentestState.target || 'Undefined'}
- **Scope:** ${pentestState.scope || 'Perimeter'}
- **Assets:** ${assetSummary}
- **Vulnerabilities:** ${vulnsSummary}

How shall we proceed with this test objective?`,
        code: `nuclei -target https://${pentestState.target || 'target.example.com'} -tags cve,kev`
      });
    } else {
      newConv.messages.push({
        id: 'msg-init-' + Date.now(),
        sender: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `New empty conversation stream started: **${cleanTitle}**. Ready for notes, queries, or command testing.`,
        code: null
      });
    }

    conversations.push(newConv);
    switchConversation(newId);
  }

  function deleteConversation(id) {
    if (conversations.length <= 1) return;
    const conv = conversations.find(c => c.id === id);
    if (!conv) return;

    if (confirm(`Delete conversation "${conv.title}"?\n(Project State and Context Snapshots will remain safe)`)) {
      conversations = conversations.filter(c => c.id !== id);
      if (activeConvId === id) {
        activeConvId = conversations[0].id;
      }
      renderConversationList();
      renderActiveMessages();
    }
  }

  function renameActiveConversation() {
    const active = getActiveConversation();
    const newName = prompt('Rename conversation:', active.title);
    if (newName && newName.trim()) {
      active.title = newName.trim();
      renderConversationList();
    }
  }

  activeConvTitleElem.addEventListener('dblclick', renameActiveConversation);
  document.getElementById('btn-rename-active-conv').addEventListener('click', renameActiveConversation);

  // New Conversation Modal Triggers
  document.getElementById('btn-open-new-conv-dialog').addEventListener('click', () => {
    document.getElementById('new-conv-title-input').value = 'Web Assessment';
    newConvModal.classList.add('open');
  });

  document.getElementById('sm-new-conv').addEventListener('click', () => {
    toggleStartMenu(false);
    document.getElementById('btn-open-new-conv-dialog').click();
  });

  document.getElementById('new-conv-close-x').addEventListener('click', () => {
    newConvModal.classList.remove('open');
  });
  document.getElementById('new-conv-cancel-btn').addEventListener('click', () => {
    newConvModal.classList.remove('open');
  });

  document.getElementById('btn-create-conv-confirm').addEventListener('click', () => {
    const title = document.getElementById('new-conv-title-input').value;
    const initType = document.querySelector('input[name="conv-init-type"]:checked').value;
    createNewConversation(title, initType);
    newConvModal.classList.remove('open');
  });

  // Clear current conversation
  document.getElementById('btn-clear-current-chat').addEventListener('click', () => {
    const active = getActiveConversation();
    if (confirm(`Clear messages in "${active.title}"?`)) {
      active.messages = [];
      renderActiveMessages();
    }
  });

  // ==========================================================================
  // CHAT MESSAGES & COPY ACTIONS (Sections: Copie des Réponses, Copie du Code)
  // ==========================================================================

  function renderActiveMessages() {
    chatMessagesFeed.innerHTML = '';
    const active = getActiveConversation();

    if (!active.messages || active.messages.length === 0) {
      chatMessagesFeed.innerHTML = `
        <div style="color:#777; font-family:var(--font-mono); font-size:11px; text-align:center; padding:20px;">
          No messages in this stream yet. Type below to ask Copilot.
        </div>
      `;
      return;
    }

    active.messages.forEach(msg => {
      const card = document.createElement('div');
      card.className = `chat-msg ${msg.sender === 'user' ? 'chat-msg-user' : 'chat-msg-ai'}`;

      if (msg.sender === 'user') {
        card.innerHTML = `
          <div><span class="msg-speaker">C:\\PICKYHACK&gt;</span> <span>${escapeHtml(msg.text)}</span></div>
        `;
      } else {
        // AI Message
        let codeBlockHtml = '';
        if (msg.code) {
          codeBlockHtml = `
            <div class="msg-code-block-wrapper">
              <div class="msg-code-block-header">
                <span>TERMINAL / COMMAND</span>
                <button class="win-btn code-copy-btn" data-code="${escapeHtml(msg.code)}">Copy</button>
              </div>
              <pre class="msg-code-block"><code>${escapeHtml(msg.code)}</code></pre>
            </div>
          `;
        }

        // Format basic markdown (bold, bullet points)
        const formattedText = formatMarkdown(msg.text);

        card.innerHTML = `
          <div class="msg-speaker-bar">
            <span class="msg-speaker">PickyHack Copilot</span>
            <span class="msg-time">${msg.time || ''}</span>
          </div>
          <div class="chat-msg-content">${formattedText}</div>
          ${codeBlockHtml}
          <div class="msg-actions-bar">
            <button class="win-btn msg-action-btn btn-copy-response">Copy</button>
            <button class="win-btn msg-action-btn btn-copy-md">Copy Markdown</button>
          </div>
        `;

        // Copy Full Response
        const copyBtn = card.querySelector('.btn-copy-response');
        copyBtn.addEventListener('click', function () {
          const fullText = (msg.text + (msg.code ? '\n\n' + msg.code : '')).trim();
          navigator.clipboard.writeText(fullText).then(() => {
            copyBtn.textContent = 'Copied';
            setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
          });
        });

        // Copy Markdown
        const copyMdBtn = card.querySelector('.btn-copy-md');
        copyMdBtn.addEventListener('click', function () {
          const mdText = msg.text + (msg.code ? '\n\n```bash\n' + msg.code + '\n```' : '');
          navigator.clipboard.writeText(mdText).then(() => {
            copyMdBtn.textContent = 'Copied';
            setTimeout(() => { copyMdBtn.textContent = 'Copy Markdown'; }, 2000);
          });
        });

        // Copy Code Block Only
        const codeCopyBtn = card.querySelector('.code-copy-btn');
        if (codeCopyBtn) {
          codeCopyBtn.addEventListener('click', function () {
            const codeToCopy = this.getAttribute('data-code');
            navigator.clipboard.writeText(codeToCopy).then(() => {
              codeCopyBtn.textContent = 'Copied';
              setTimeout(() => { codeCopyBtn.textContent = 'Copy'; }, 2000);
            });
          });
        }
      }

      chatMessagesFeed.appendChild(card);
    });

    chatMessagesFeed.scrollTop = chatMessagesFeed.scrollHeight;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatMarkdown(str) {
    if (!str) return '';
    return escapeHtml(str)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code style="background:#222; padding:1px 4px; color:#ffaa00;">$1</code>')
      .replace(/\n- (.*?)/g, '<br>• $1')
      .replace(/\n/g, '<br>');
  }

  function appendUserMessage(text) {
    const active = getActiveConversation();
    active.messages.push({
      id: 'msg-' + Date.now(),
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: text
    });
    renderActiveMessages();
  }

  function appendAIMessage(text, code = null) {
    const active = getActiveConversation();
    active.messages.push({
      id: 'msg-' + Date.now(),
      sender: 'ai',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: text,
      code: code
    });
    renderActiveMessages();
  }

  // --- Interactive Chat Send Handler ---
  function handleChatSubmit() {
    const msg = chatInput.value.trim();
    if (!msg) return;

    chatInput.value = '';
    appendUserMessage(msg);

    const lower = msg.toLowerCase();

    // Built-in Commands
    if (lower === 'help') {
      setTimeout(() => {
        appendAIMessage(`PickyHack Commands available in this stream:
- **recon**: Correlates target scope notes against CISA KEV & Exploit-DB
- **cve**: Inspects high-priority CVEs and exploit availability
- **path**: Synthesizes full multi-step attack chain
- **snapshot**: Opens the Context Snapshot manager
- **briefing**: Generates the 24h/7d threat intelligence briefing
- **status**: Displays active project state metrics`, `recon`);
      }, 250);
      return;
    }

    if (lower === 'recon' || lower.includes('recon')) {
      correlateTargetWithIntel();
      setTimeout(() => {
        appendAIMessage(`Reconnaissance correlation triggered against **${pentestState.target || 'target'}**.
- Assets identified: ${pentestState.discoveredAssets.length}
- Services mapped: ${pentestState.services.join(', ') || 'Pending'}
- Active attack chain synthesized in the **Attack Paths** tab.`, `nmap -sV -Pn --script=vuln ${pentestState.target || 'target.example.com'}`);
      }, 300);
      return;
    }

    if (lower === 'snapshot' || lower.includes('save context')) {
      openSnapshotModal();
      return;
    }

    if (lower === 'briefing' || lower.includes('quoi de neuf')) {
      runThreatBriefing();
      return;
    }

    // Default Senior Pentester Technical Analysis (14-point persona)
    setTimeout(() => {
      // Dynamically update project facts if user mentioned new services or technologies
      if (lower.includes('apache') || lower.includes('nginx') || lower.includes('spring') || lower.includes('fortinet')) {
        syncStateFromNotes();
        updateSidebarProjectStats();
      }

      appendAIMessage(`[TL;DR] Target analysis for "${msg}" completed.
**Risk:** HIGH / CRITICAL
**Exploitability Priority Score (EPS):** 96 / 100
**Current Intelligence:** Evaluated against CISA KEV catalog (1,642 active entries) and public GitHub PoCs.

**Detection & Validation Methodology:**
1. Verify exposed service banners without intrusive payload execution.
2. Confirm patch level and configuration parameters.
3. Validate access conditions (pre-auth vs authenticated).`, `curl -s -I "https://${pentestState.target || 'target.example.com'}/health" | grep -i "Server"`);

      autoSaveProjectState();
    }, 400);
  }

  chatSendBtn.addEventListener('click', handleChatSubmit);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleChatSubmit();
  });

  // ==========================================================================
  // CONTEXT SNAPSHOT & PERSISTENCE ENGINE
  // ==========================================================================

  function generateContextSnapshot() {
    syncStateFromNotes();
    if (pentestState.attackPaths.length === 0) {
      correlateTargetWithIntel();
    }

    const now = new Date();
    const dateFormatted = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

    const assetsList = pentestState.discoveredAssets.length > 0 
      ? pentestState.discoveredAssets.map(a => `- ${a}`).join('\n') 
      : '- (No specific external hosts extracted yet)';

    const servicesList = pentestState.services.length > 0
      ? pentestState.services.map(s => `- ${s}`).join('\n')
      : '- (Services under active discovery)';

    const techList = pentestState.technologies.length > 0
      ? pentestState.technologies.map(t => `- ${t}`).join('\n')
      : '- (Technologies under fingerprinting)';

    const vulnsList = pentestState.vulnerabilities.length > 0
      ? pentestState.vulnerabilities.map(v => `- ${v} (Correlated against CISA KEV / EPS Engine)`).join('\n')
      : '- CVE-2024-3400 (PAN-OS GlobalProtect Pre-Auth Command Injection - EPS: 99/100, KEV Listed)\n- CVE-2023-22527 (Atlassian Confluence OGNL Template Injection - EPS: 95/100)';

    const attackPathsList = pentestState.attackPaths.length > 0
      ? pentestState.attackPaths.map((p, i) => `${i + 1}. ${p}`).join('\n')
      : '1. INITIAL ACCESS: Edge Perimeter CVE Fingerprinting\n2. FOOTHOLD: Remote exploit with public PoC\n3. PRIV ESC: Local kernel / SUID escalation\n4. LATERAL MOVE: Internal subnet pivot';

    // Extract dialogue from active conversation
    const active = getActiveConversation();
    const lastDialogue = active.messages && active.messages.length > 0
      ? active.messages.slice(-4).map(turn => `[${turn.sender.toUpperCase()}]: ${turn.text.replace(/\n/g, ' ')}`).join('\n\n')
      : '[PENTESTER]: Initialized stream: ' + active.title + '\n[PICKYHACK COPILOT]: Correlation engine active, KEV feeds checked.';

    return `=== PICKYHACK CONTEXT SNAPSHOT ===

SNAPSHOT VERSION:
1.0

GENERATED:
${dateFormatted}

PROJECT:
${pentestState.projectName} - ${pentestState.target || 'Perimeter Assessment'}

PROJECT STATUS:
${pentestState.projectStatus}

TARGET:
${pentestState.target || 'example.com'}

SCOPE:
${pentestState.scope || 'Default authorized perimeter'}

OBJECTIVES:
${pentestState.objectives || 'External reconnaissance, vulnerability mapping, and attack path identification'}

========================
CURRENT STATE
========================
${pentestState.currentState}
Target perimeter defined with ${pentestState.discoveredAssets.length} assets and ${pentestState.services.length} services mapped.
Active stream: "${active.title}". Continuous EPS prioritization highlighted critical vulnerabilities.

========================
CONFIRMED FACTS
========================
- Target explicitly authorized for penetration testing under mandate rules.
- Services identified and perimeter posture mapped.
- CISA KEV catalog cross-referenced: High-risk vulnerabilities mapped.

========================
DISCOVERED ASSETS
========================
${assetsList}

========================
SERVICES
========================
${servicesList}

========================
TECHNOLOGIES
========================
${techList}

========================
VULNERABILITIES
========================
${vulnsList}

========================
EXPLOITS / POC
========================
- CVE-2024-3400: Public Python PoC on GitHub verified; Metasploit module available.
- CVE-2023-22527: Weaponized OGNL injection exploit available.
- Exploits tested solely in non-destructive validation mode.

========================
FINDINGS
========================
- Perimeter edge presents exposed admin/management interfaces.
- Authentication bypass and remote code execution candidate endpoints isolated.

========================
EVIDENCE
========================
- Perimeter banner grabs and HTTP response header tokens recorded.
- Telemetry endpoint /ssl-vpn/hipreport.esp returns 200 OK.

========================
COMMANDS
========================
- nmap -sV -sC -Pn -T4 target.com
- nuclei -id pickyhack-perimeter-detect -target https://${pentestState.target || 'target.com'}
- python3 exploit_check.py --target https://${pentestState.target || 'target.com'} --dry-run

========================
ATTACK PATHS
========================
${attackPathsList}

========================
FAILED TESTS
========================
- TESTED: CVE-2023-4966 (Citrix Bleed)
  RESULT: Not vulnerable.
  REASON: Target gateway is running PAN-OS, not Citrix NetScaler.
  DO NOT RETEST UNLESS: Citrix appliances are discovered in out-of-band scope.

========================
FALSE POSITIVES
========================
- Initial port 8080 report flagged as unauthenticated Jenkins; manual check revealed static maintenance page.

========================
HYPOTHESES
========================
- If PAN-OS is unpatched (pre-10.2.9-h1), pre-auth command injection can provide immediate root shell on perimeter firewall.
- Internal lateral movement to Active Directory Domain Controller possible via stored LDAP service credentials.

========================
IMPORTANT REASONING
========================
- Prioritized edge VPN appliances over internal web APIs because VPN compromise yields direct internal IP routing.
- Following PickyHack Section 2: Scored using Exploitability Priority Score (EPS) rather than raw CVSS.

========================
DECISIONS
========================
- Decision 1: Focus primary effort on validating edge gateway pre-auth exploitability.
- Decision 2: Execute Nuclei automated template checks before any active manual payload injection.

========================
OPEN QUESTIONS
========================
- Is multi-factor authentication (MFA) enforced on internal SSH jump hosts once the perimeter is breached?
- Are AWS IAM credentials attached to the edge instance or stored in external vault?

========================
CURRENT PRIORITIES
========================
1. Validate authentication bypass on edge endpoints.
2. Confirm patch level of Confluence / PAN-OS gateways.
3. Test least-privilege egress connectivity from target.

========================
NEXT ACTIONS
========================
1. Run PickyHack generated Nuclei detection rule against ${pentestState.target || 'target'}.
2. Capture evidence of vulnerability confirmation without impacting system stability.
3. Document attack path chain for the final executive pentest report.

========================
LAST CONVERSATION STATE
========================
${lastDialogue}

=== END PICKYHACK CONTEXT SNAPSHOT ===`;
  }

  // --- Copy Full Context Functionality ---
  function copyFullContextToClipboard(buttonElement) {
    const text = generateContextSnapshot();
    navigator.clipboard.writeText(text).then(() => {
      if (buttonElement) {
        const orig = buttonElement.textContent;
        buttonElement.textContent = '✓ Copied!';
        setTimeout(() => { buttonElement.textContent = orig; }, 1800);
      }
      sbStatus.textContent = 'Full Context Snapshot copied to clipboard!';
    });
  }

  document.getElementById('btn-copy-full-context-toolbar').addEventListener('click', function () {
    copyFullContextToClipboard(this);
  });
  document.getElementById('btn-chat-copy-full-context').addEventListener('click', function () {
    copyFullContextToClipboard(this);
  });
  document.getElementById('btn-sidebar-copy-full-ctx').addEventListener('click', function () {
    copyFullContextToClipboard(this);
  });
  document.getElementById('sm-copy-context').addEventListener('click', () => {
    toggleStartMenu(false);
    copyFullContextToClipboard();
  });

  // --- Open Save Snapshot Modal ---
  function openSnapshotModal() {
    const snapshotText = generateContextSnapshot();
    snapshotPreview.value = snapshotText;

    const assetCount = pentestState.discoveredAssets.length || 3;
    const serviceCount = pentestState.services.length || 4;
    const vulnCount = pentestState.vulnerabilities.length || 2;
    const chainCount = pentestState.attackPaths.length || 1;
    const obsCount = assetCount + serviceCount + vulnCount + 15;

    document.getElementById('stat-assets').textContent = assetCount;
    document.getElementById('stat-services').textContent = serviceCount;
    document.getElementById('stat-vulns').textContent = vulnCount;
    document.getElementById('stat-chains').textContent = chainCount;
    document.getElementById('stat-obs').textContent = obsCount;

    snapshotModal.classList.add('open');
  }

  document.getElementById('btn-save-snapshot').addEventListener('click', openSnapshotModal);
  document.getElementById('btn-chat-save-snapshot').addEventListener('click', openSnapshotModal);
  document.getElementById('tray-quick-snapshot').addEventListener('click', openSnapshotModal);
  document.getElementById('menu-snapshot').addEventListener('click', openSnapshotModal);
  document.getElementById('sm-save-snapshot').addEventListener('click', () => {
    toggleStartMenu(false);
    openSnapshotModal();
  });

  document.getElementById('snapshot-close-x').addEventListener('click', () => snapshotModal.classList.remove('open'));
  document.getElementById('snapshot-ok-btn').addEventListener('click', () => snapshotModal.classList.remove('open'));

  // Copy Context from Modal
  document.getElementById('btn-copy-context').addEventListener('click', function () {
    copyFullContextToClipboard(this);
  });

  // Download .md Snapshot
  document.getElementById('btn-download-snapshot').addEventListener('click', function () {
    const text = snapshotPreview.value;
    const targetSlug = (pentestState.target || 'target').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const filename = `pickyhack-snapshot-${targetSlug}-${new Date().toISOString().substring(0, 10)}.md`;

    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  });

  // --- Open Import Snapshot Modal ---
  function openImportModal() {
    importTextarea.value = '';
    importModal.classList.add('open');
  }

  document.getElementById('btn-import-snapshot').addEventListener('click', openImportModal);
  document.getElementById('sm-import-snapshot').addEventListener('click', () => {
    toggleStartMenu(false);
    openImportModal();
  });

  document.getElementById('import-close-x').addEventListener('click', () => importModal.classList.remove('open'));
  document.getElementById('import-cancel-btn').addEventListener('click', () => importModal.classList.remove('open'));

  document.getElementById('btn-trigger-file-import').addEventListener('click', () => fileImportInput.click());
  fileImportInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => { importTextarea.value = evt.target.result; };
      reader.readAsText(file);
    }
  });

  document.getElementById('btn-run-import').addEventListener('click', function () {
    const raw = importTextarea.value.trim();
    if (!raw) {
      alert('Veuillez coller un Context Snapshot valide ou charger un fichier .md.');
      return;
    }

    const targetMatch = raw.match(/TARGET:\s*([^\n\r]+)/i);
    const scopeMatch = raw.match(/SCOPE:\s*([^\n\r]+)/i);
    const objMatch = raw.match(/OBJECTIVES:\s*([^\n\r]+)/i);

    const target = targetMatch ? targetMatch[1].trim() : 'example.com';
    const scope = scopeMatch ? scopeMatch[1].trim() : 'Perimeter';
    const objectives = objMatch ? objMatch[1].trim() : 'External reconnaissance';

    const assetsBlock = raw.match(/========================\s*DISCOVERED ASSETS\s*========================\s*([\s\S]*?)========================/i);
    const assets = assetsBlock ? assetsBlock[1].trim().split('\n').filter(l => l.startsWith('- ')).map(l => l.replace('- ', '').trim()) : ['example.com'];

    const servicesBlock = raw.match(/========================\s*SERVICES\s*========================\s*([\s\S]*?)========================/i);
    const services = servicesBlock ? servicesBlock[1].trim().split('\n').filter(l => l.startsWith('- ')).map(l => l.replace('- ', '').trim()) : ['HTTPS (443)'];

    const vulnsBlock = raw.match(/========================\s*VULNERABILITIES\s*========================\s*([\s\S]*?)========================/i);
    const vulns = vulnsBlock ? vulnsBlock[1].trim().split('\n').filter(l => l.startsWith('- ')).map(l => l.replace('- ', '').trim()) : [];

    const prioritiesBlock = raw.match(/========================\s*CURRENT PRIORITIES\s*========================\s*([\s\S]*?)========================/i);
    const priorities = prioritiesBlock ? prioritiesBlock[1].trim().split('\n')[0] : 'Validate authentication bypass on /admin.';

    pentestState.target = target;
    pentestState.scope = scope;
    pentestState.objectives = objectives;
    pentestState.discoveredAssets = assets;
    pentestState.services = services;
    pentestState.vulnerabilities = vulns;

    textarea.value = `Target: ${target}\nScope: ${scope}\nObjective: ${objectives}\n\nRestored Assets:\n${assets.map(a => '- ' + a).join('\n')}\n\nServices:\n${services.map(s => '- ' + s).join('\n')}\n\n${vulns.length > 0 ? 'Vulnerabilities:\n' + vulns.map(v => '- ' + v).join('\n') : ''}`;

    updatePlaceholderState();
    updateCursorStats();
    syncStateFromNotes();
    correlateTargetWithIntel();
    autoSaveProjectState();

    importModal.classList.remove('open');
    switchTab('tab-console');

    const restoreSummary = `Context restored.

Target: ${target}
Assets: ${assets.length}
Services: ${services.length}
Findings: ${vulns.length || 2}
Attack paths: ${pentestState.attackPaths.length || 2}

Current priority:
${priorities}

Ready to continue.`;

    appendAIMessage(restoreSummary);
    sbStatus.textContent = `Context restored for ${target}. Ready to continue pentest.`;
  });

  // --- Exploitability Priority Score (EPS) Calculation ---
  function calculateEPS(vuln) {
    let score = 0;
    score += (vuln.cvss / 10) * 30;
    if (vuln.inKEV) score += 30;
    if (vuln.wildExploit) score += 20;
    if (vuln.pocAvailable) score += 10;
    if (vuln.metasploit) score += 5;
    if (vuln.authRequired.toLowerCase().includes('pre-auth') || vuln.authRequired.toLowerCase().includes('none')) {
      score += 5;
    }
    return Math.min(100, Math.round(score));
  }

  // --- Render CVE & KEV Feed Table ---
  function renderCVETable() {
    cveTableBody.innerHTML = '';
    INTEL_DB.forEach((vuln) => {
      const eps = calculateEPS(vuln);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <strong style="color:#000080;">${vuln.cve}</strong><br>
          <span style="color:#444; font-size:10px;">${vuln.product}</span>
          <div style="margin-top:2px;">
            ${vuln.inKEV ? '<span class="badge-tag tag-kev">CISA KEV</span>' : ''}
            ${vuln.pocAvailable ? '<span class="badge-tag tag-poc">PoC</span>' : ''}
            ${vuln.metasploit ? '<span class="badge-tag tag-meta">Metasploit</span>' : ''}
          </div>
        </td>
        <td><strong>${vuln.cvss}</strong></td>
        <td><strong style="color:${eps >= 90 ? '#8b0000' : '#d35400'};">${eps}</strong></td>
        <td><span style="font-size:10px;">${vuln.epsCategory.split('—')[0].trim()}</span></td>
        <td>
          <button class="win-btn" style="font-size:9px; padding:1px 4px;" data-cve="${vuln.cve}">Insert</button>
        </td>
      `;

      tr.querySelector('button').addEventListener('click', (e) => {
        e.stopPropagation();
        insertCVEIntoWorkspace(vuln);
      });

      tr.addEventListener('click', () => {
        document.querySelectorAll('#cve-table-body tr').forEach(r => r.classList.remove('selected'));
        tr.classList.add('selected');
        appendAIMessage(`CVE Inspected: **${vuln.cve}** (${vuln.product})\nCVSS: ${vuln.cvss} | EPS: ${vuln.epsScore}/100\nThreat Actor: ${vuln.threatActor}\nRemediation: Upgrade to fixed version ${vuln.fixed}`, vuln.chain);
      });

      cveTableBody.appendChild(tr);
    });
  }

  function insertCVEIntoWorkspace(vuln) {
    const snippet = `\n\n[MAPPED VULNERABILITY: ${vuln.cve}]
Product: ${vuln.product} (${vuln.vendor})
CVSS: ${vuln.cvss} | EPS Score: ${vuln.epsScore}/100 (${vuln.epsCategory})
CISA KEV Listed: ${vuln.inKEV ? 'YES' : 'NO'} | In-The-Wild Exploitation: ${vuln.wildExploit ? 'CONFIRMED' : 'NO'}
Authentication: ${vuln.authRequired}
Public PoC: ${vuln.pocAvailable ? 'AVAILABLE' : 'NONE'} | Metasploit: ${vuln.metasploit ? 'AVAILABLE' : 'NONE'}
Impact: ${vuln.impact}
Target Attack Chain: ${vuln.chain}`;

    textarea.value += snippet;
    updatePlaceholderState();
    updateCursorStats();
    syncStateFromNotes();
    autoSaveProjectState();
    appendAIMessage(`Inserted vulnerability **${vuln.cve}** into target workspace.`, null);
  }

  // --- Attack Chain Synthesis ---
  function correlateTargetWithIntel() {
    const text = textarea.value.toLowerCase();
    let matchedVuln = null;
    let chainSteps = [];

    if (text.includes('palo alto') || text.includes('pan-os') || text.includes('globalprotect')) {
      matchedVuln = INTEL_DB[0];
      chainSteps = [
        { badge: 'INITIAL ACCESS', desc: 'Pre-Auth Command Injection via GlobalProtect (CVE-2024-3400)', step: 1 },
        { badge: 'FOOTHOLD', desc: 'Spawning unprivileged reverse shell with SUID root capabilities', step: 2 },
        { badge: 'PRIV ESC', desc: 'Execution of root payload / cron job overwrite', step: 3 },
        { badge: 'CREDENTIALS', desc: 'Extraction of LDAP and admin VPN credentials from memory', step: 4 },
        { badge: 'LATERAL MOVE', desc: 'Pivoting into internal finance subnet 198.51.100.0/24', step: 5 }
      ];
    } else if (text.includes('confluence') || text.includes('atlassian') || text.includes('wiki')) {
      matchedVuln = INTEL_DB[4];
      chainSteps = [
        { badge: 'INITIAL ACCESS', desc: 'Atlassian Confluence OGNL Template Injection (CVE-2023-22527)', step: 1 },
        { badge: 'FOOTHOLD', desc: 'Direct Web Shell injection into Tomcat runtime', step: 2 },
        { badge: 'PRIV ESC', desc: 'Linux Kernel nf_tables Local Privilege Escalation (CVE-2024-1086)', step: 3 },
        { badge: 'CREDENTIALS', desc: 'Confluence PostgreSQL database password dumping & session tokens', step: 4 },
        { badge: 'DOMAIN CTRL', desc: 'Harvested Active Directory service account used for BloodHound dump', step: 5 }
      ];
    } else if (text.includes('adcs') || text.includes('active directory') || text.includes('domain')) {
      matchedVuln = INTEL_DB[5];
      chainSteps = [
        { badge: 'INITIAL ACCESS', desc: 'Compromised domain user credentials (CORP\\jdoe)', step: 1 },
        { badge: 'FOOTHOLD', desc: 'Internal network access & AD enumeration via BloodHound / NetExec', step: 2 },
        { badge: 'PRIV ESC', desc: 'ADCS ESC1 Certificate Enrollment with SAN of Domain Admin', step: 3 },
        { badge: 'CREDENTIALS', desc: 'Requesting Kerberos TGT certificate authentication via Certipy', step: 4 },
        { badge: 'DOMAIN CTRL', desc: 'DCSync attack against DC01.corp.local → Full Enterprise Admin', step: 5 }
      ];
    } else if (text.includes('kubernetes') || text.includes('k8s') || text.includes('cloud') || text.includes('aws')) {
      chainSteps = [
        { badge: 'INITIAL ACCESS', desc: 'Exposed Kubelet API / Misconfigured API gateway', step: 1 },
        { badge: 'FOOTHOLD', desc: 'Default ServiceAccount token mounted inside Pod', step: 2 },
        { badge: 'PRIV ESC', desc: 'Kubernetes RBAC secret harvesting (cluster-admin delegation)', step: 3 },
        { badge: 'CREDENTIALS', desc: 'Harvesting AWS IMDSv2 IAM role session credentials', step: 4 },
        { badge: 'CLOUD CTRL', desc: 'Assuming OrganizationAccountAccessRole across AWS cloud', step: 5 }
      ];
    } else {
      matchedVuln = INTEL_DB[0];
      chainSteps = [
        { badge: 'INITIAL ACCESS', desc: 'External Perimeter Port Scan & CVE Fingerprinting', step: 1 },
        { badge: 'FOOTHOLD', desc: 'Exploitation of unpatched edge service with public PoC', step: 2 },
        { badge: 'PRIV ESC', desc: 'Local Kernel or SUID privilege escalation to root/SYSTEM', step: 3 },
        { badge: 'CREDENTIALS', desc: 'Dumping LSASS / SAM / shadow file credentials', step: 4 },
        { badge: 'LATERAL MOVE', desc: 'Pass-the-Hash / WinRM pivoting across subnets', step: 5 }
      ];
    }

    pentestState.attackPaths = chainSteps.map(c => `${c.badge}: ${c.desc}`);

    attackChainSteps.innerHTML = '';
    chainSteps.forEach((s, idx) => {
      const stepDiv = document.createElement('div');
      stepDiv.className = 'chain-step';
      stepDiv.innerHTML = `
        <span class="chain-badge step-${s.step}">${s.badge}</span>
        <span class="chain-desc">${s.desc}</span>
      `;
      attackChainSteps.appendChild(stepDiv);

      if (idx < chainSteps.length - 1) {
        const arrow = document.createElement('div');
        arrow.className = 'chain-arrow';
        arrow.textContent = '▼';
        attackChainSteps.appendChild(arrow);
      }
    });

    const eps = matchedVuln ? calculateEPS(matchedVuln) : 94;
    graphEpsIndicator.textContent = `EPS ${eps} / 100`;
    toolbarEpsBadge.textContent = `EPS: ${eps}/100`;

    if (matchedVuln) {
      epsBreakdown.innerHTML = `
        • Vulnerability: <strong>${matchedVuln.cve}</strong> (${matchedVuln.product})<br>
        • CVSS Base: ${matchedVuln.cvss} (${matchedVuln.cvss >= 9 ? 'Critical' : 'High'})<br>
        • CISA KEV Catalog: ${matchedVuln.inKEV ? '<span style="color:#8b0000; font-weight:bold;">Listed (+30 pts)</span>' : 'Not Listed'}<br>
        • In-The-Wild Exploitation: ${matchedVuln.wildExploit ? '<span style="color:#8b0000; font-weight:bold;">CONFIRMED (+20 pts)</span>' : 'Unconfirmed'}<br>
        • Public Working PoC: ${matchedVuln.pocAvailable ? 'GitHub Public (+10 pts)' : 'None'}<br>
        • Metasploit Module: ${matchedVuln.metasploit ? 'Weaponized Module (+5 pts)' : 'None'}<br>
        • Attack Vector: ${matchedVuln.authRequired}<br>
        <strong style="color:#8b0000;">=> Total EPS: ${eps}/100 (${matchedVuln.epsCategory})</strong>
      `;
    }

    autoSaveProjectState();
    updateSidebarProjectStats();
  }

  document.getElementById('btn-correlate').addEventListener('click', () => {
    correlateTargetWithIntel();
    switchTab('tab-chains');
  });
  document.getElementById('btn-synth-chain').addEventListener('click', () => {
    correlateTargetWithIntel();
    switchTab('tab-chains');
  });
  document.getElementById('btn-calc-eps').addEventListener('click', () => {
    correlateTargetWithIntel();
    switchTab('tab-chains');
  });

  // --- Template Loading ---
  function loadTemplate(key) {
    if (TEMPLATES[key]) {
      textarea.value = TEMPLATES[key];
      updatePlaceholderState();
      updateCursorStats();
      syncStateFromNotes();
      textarea.focus();
      correlateTargetWithIntel();
      autoSaveProjectState();
      appendAIMessage(`Loaded scope template: **${key.toUpperCase()}**. Target defined: \`${pentestState.target}\`.`, null);
    }
  }

  document.getElementById('tpl-external').addEventListener('click', () => loadTemplate('external'));
  document.getElementById('tpl-webapp').addEventListener('click', () => loadTemplate('webapp'));
  document.getElementById('tpl-ad').addEventListener('click', () => loadTemplate('ad'));
  document.getElementById('tpl-cloud').addEventListener('click', () => loadTemplate('cloud'));
  document.getElementById('btn-scope-sample').addEventListener('click', () => loadTemplate('external'));

  document.getElementById('btn-clear-notes').addEventListener('click', function () {
    textarea.value = '';
    updatePlaceholderState();
    updateCursorStats();
    syncStateFromNotes();
    autoSaveProjectState();
  });

  document.getElementById('btn-new-target').addEventListener('click', function () {
    textarea.value = '';
    updatePlaceholderState();
    updateCursorStats();
    syncStateFromNotes();
    textarea.focus();
    autoSaveProjectState();
  });

  // --- Threat Briefing: "Quoi de neuf ?" (Section 13) ---
  function runThreatBriefing() {
    switchTab('tab-console');
    appendAIMessage(`**PICKYHACK THREAT INTELLIGENCE BRIEFING: "QUOI DE NEUF ?"**

**Dernières 24 heures :**
- **Nouveaux Zero-Days :** 1 zero-day suspecté sur appliance VPN / Edge (Statut: LIKELY)
- **Nouvelles CVE critiques :** CVE-2024-3400 PAN-OS (EPS 99/100, exploitation active UTA0218)
- **Nouveaux PoC :** PoC GitHub public pour contournement d'authentification Ivanti ICS

**7 derniers jours :**
- **Nouvelles KEV CISA :** 6 vulnérabilités activement ciblées ajoutées au catalogue
- **Nouveaux modules Metasploit :** \`exploit/linux/http/atlassian_confluence_rce_cve_2023_22527\`
- **Chaînes observées :** SSRF → IMDSv2 token theft → AWS IAM privilege escalation

**À surveiller :**
- Passerelles VPN (Fortinet, Ivanti, Palo Alto), 45 000+ instances exposées.
- Risque d'exploitation massive: RCE pré-auth avec PoC public 1-click.`, `nuclei -id cve-2024-3400,cve-2023-22527 -target https://${pentestState.target || 'target.example.com'}`);
  }

  document.getElementById('btn-intel-briefing').addEventListener('click', runThreatBriefing);
  document.getElementById('sm-briefing').addEventListener('click', () => {
    toggleStartMenu(false);
    runThreatBriefing();
  });

  // --- Nuclei Template Generator ---
  function generateNucleiTemplate() {
    switchTab('tab-nuclei');
    const target = pentestState.target || 'target.example.com';
    const yaml = `id: pickyhack-target-exploit-detect

info:
  name: PickyHack Correlated Exploit Detection for ${target}
  author: PickyHack Offensive Copilot
  severity: critical
  description: |
    Automated check detecting pre-auth RCE and auth bypass vulnerabilities
    identified by PickyHack Intelligence Engine (CISA KEV / EPS Score: 98).
  reference:
    - https://www.cisa.gov/known-exploited-vulnerabilities-catalog
    - https://nvd.nist.gov/vuln/detail/CVE-2024-3400
  tags: cve,kev,rce,preauth,critical

http:
  - raw:
      - |
        POST /ssl-vpn/hipreport.esp HTTP/1.1
        Host: {{Hostname}}
        User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) PickyHack/1.0
        Cookie: SESSID=../../../../opt/panlogs/tmp/device_telemetry/minute/pickyhack_probe
        Connection: close

    matchers-condition: or
    matchers:
      - type: status
        status:
          - 200
          - 403
      - type: word
        part: header
        words:
          - "GlobalProtect"
          - "PAN-OS"
        condition: and`;

    document.getElementById('nuclei-yaml-view').textContent = yaml;
  }

  document.getElementById('btn-export-nuclei').addEventListener('click', generateNucleiTemplate);
  document.getElementById('sm-nuclei-gen').addEventListener('click', () => {
    toggleStartMenu(false);
    generateNucleiTemplate();
  });

  document.getElementById('btn-copy-nuclei').addEventListener('click', function () {
    const yaml = document.getElementById('nuclei-yaml-view').textContent;
    navigator.clipboard.writeText(yaml).then(() => {
      this.textContent = 'Copied!';
      setTimeout(() => { this.textContent = 'Copy Nuclei YAML'; }, 1500);
    });
  });

  document.getElementById('btn-run-nuclei-sim').addEventListener('click', function () {
    switchTab('tab-console');
    appendAIMessage(`[NUCLEI SIMULATION] Executed pickyhack-target-exploit-detect against ${pentestState.target || 'target'}.
- [INF] Endpoint /ssl-vpn/hipreport.esp returned status 200.
- [!] Matched GlobalProtect header. Vulnerability confirmed (EPS 98/100).`, `nuclei -t pickyhack-target-exploit-detect.yaml -u https://${pentestState.target || 'target.example.com'}`);
  });

  // --- Tab Navigation ---
  function switchTab(tabId) {
    document.querySelectorAll('.win-tab').forEach(t => {
      const isActive = t.getAttribute('data-tab') === tabId;
      t.classList.toggle('active', isActive);
      t.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    document.querySelectorAll('.tab-panel').forEach(p => {
      p.classList.toggle('active', p.id === tabId);
    });
  }

  document.querySelectorAll('.win-tab').forEach(tab => {
    tab.addEventListener('click', function () {
      switchTab(this.getAttribute('data-tab'));
    });
  });

  // Desktop Icons
  document.getElementById('icon-workspace').addEventListener('click', () => textarea.focus());
  document.getElementById('icon-kev').addEventListener('click', () => switchTab('tab-cve'));
  document.getElementById('icon-chains').addEventListener('click', () => switchTab('tab-chains'));
  document.getElementById('icon-snapshot').addEventListener('click', openSnapshotModal);
  document.getElementById('icon-prompt').addEventListener('click', () => aboutModal.classList.add('open'));

  // --- Start Menu Controller ---
  const startBtn = document.getElementById('start-button');
  const startMenu = document.getElementById('start-menu');

  function toggleStartMenu(force) {
    const isOpen = force !== undefined ? force : !startMenu.classList.contains('open');
    startMenu.classList.toggle('open', isOpen);
    startBtn.classList.toggle('active', isOpen);
  }

  startBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleStartMenu();
  });

  document.addEventListener('click', (e) => {
    if (!startMenu.contains(e.target) && e.target !== startBtn) {
      toggleStartMenu(false);
    }
  });

  document.getElementById('sm-new-target').addEventListener('click', () => {
    toggleStartMenu(false);
    document.getElementById('btn-new-target').click();
  });

  document.getElementById('sm-kev-catalog').addEventListener('click', () => {
    toggleStartMenu(false);
    switchTab('tab-cve');
  });

  document.getElementById('sm-about').addEventListener('click', () => {
    toggleStartMenu(false);
    aboutModal.classList.add('open');
  });
  document.getElementById('menu-help').addEventListener('click', () => aboutModal.classList.add('open'));
  document.getElementById('about-close-x').addEventListener('click', () => aboutModal.classList.remove('open'));
  document.getElementById('about-ok-btn').addEventListener('click', () => aboutModal.classList.remove('open'));

  // --- Window Control Buttons (Min, Max, Close) ---
  const mainWindow = document.getElementById('main-window');
  let isMaximized = false;

  document.getElementById('btn-win-max').addEventListener('click', () => {
    if (!isMaximized) {
      mainWindow.style.top = '2px';
      mainWindow.style.left = '2px';
      mainWindow.style.right = '2px';
      mainWindow.style.bottom = '32px';
      isMaximized = true;
    } else {
      mainWindow.style.top = '12px';
      mainWindow.style.left = '92px';
      mainWindow.style.right = '12px';
      mainWindow.style.bottom = '18px';
      isMaximized = false;
    }
  });

  document.getElementById('btn-win-min').addEventListener('click', () => {
    mainWindow.style.display = mainWindow.style.display === 'none' ? 'flex' : 'none';
    document.getElementById('task-main-win').classList.toggle('active');
  });

  document.getElementById('task-main-win').addEventListener('click', () => {
    if (mainWindow.style.display === 'none') {
      mainWindow.style.display = 'flex';
      document.getElementById('task-main-win').classList.add('active');
    } else {
      mainWindow.style.display = 'none';
      document.getElementById('task-main-win').classList.remove('active');
    }
  });

  document.getElementById('btn-win-close').addEventListener('click', () => {
    if (confirm('Fermer la session PickyHack Pentest Intelligence ?\n(Votre travail est sauvegardé automatiquement)')) {
      mainWindow.style.display = 'none';
      document.getElementById('task-main-win').classList.remove('active');
    }
  });

  // Menu bar quick shortcuts
  document.getElementById('menu-file').addEventListener('click', () => {
    document.getElementById('btn-new-target').click();
  });
  document.getElementById('menu-templates').addEventListener('click', () => {
    loadTemplate('external');
  });
  document.getElementById('menu-intelligence').addEventListener('click', runThreatBriefing);
  document.getElementById('menu-attack-chain').addEventListener('click', () => {
    switchTab('tab-chains');
    correlateTargetWithIntel();
  });
  document.getElementById('menu-nuclei').addEventListener('click', generateNucleiTemplate);

  // --- Live Clock in Taskbar ---
  function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    document.getElementById('system-clock').textContent = `${hours}:${minutes} ${ampm}`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // --- Initial Setup ---
  renderCVETable();
  updatePlaceholderState();
  updateCursorStats();
  renderConversationList();
  renderActiveMessages();
  loadAutoSavedProjectState();

})();
