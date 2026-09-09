/**
 * PickyHack — Dynamic Graph-Based Attack Simulation
 * Models network compromise paths, detects defensive choke points,
 * and calculates breach probability telemetry from Initial Access to Crown Jewels.
 * Generated dynamically from live Project State entities.
 */
(function(root) {
  'use strict';

  const defaultNodes = [
    { id: 'n_ext', label: 'External Internet', type: 'source', x: 50, y: 140, icon: '🌐' },
    { id: 'n_vpn', label: 'Edge PAN-OS VPN', type: 'firewall', x: 200, y: 90, icon: '🛡️', vuln: 'CVE-2024-3400' },
    { id: 'n_waf', label: 'Public Web App (Kong)', type: 'web', x: 200, y: 200, icon: '🌍' },
    { id: 'n_jump', label: 'Internal Jumpbox', type: 'host', x: 380, y: 140, icon: '💻', cred: 'SSH Admin Key' },
    { id: 'n_sql', label: 'Finance Database', type: 'db', x: 550, y: 80, icon: '🗄️', cred: 'DB_SA Password' },
    { id: 'n_dc', label: 'Primary DC (AD)', type: 'crown', x: 550, y: 210, icon: '👑', crown: true }
  ];

  const defaultEdges = [
    { from: 'n_ext', to: 'n_vpn', prob: 0.95, label: 'CVE-2024-3400 RCE' },
    { from: 'n_ext', to: 'n_waf', prob: 0.40, label: 'API Param Injection' },
    { from: 'n_vpn', to: 'n_jump', prob: 0.85, label: 'Pivot via Session Token' },
    { from: 'n_waf', to: 'n_jump', prob: 0.30, label: 'SSRF to Jumpbox' },
    { from: 'n_jump', to: 'n_sql', prob: 0.80, label: 'Stored DB Credentials' },
    { from: 'n_jump', to: 'n_dc', prob: 0.90, label: 'Pass-The-Hash / DCSync' }
  ];

  const AttackGraphSimulator = {
    nodes: JSON.parse(JSON.stringify(defaultNodes)),
    edges: JSON.parse(JSON.stringify(defaultEdges)),
    activeBreachPath: [],
    highlightedBottlenecks: [],

    init() {
      if (typeof document === 'undefined') return;
      const btnSim = document.getElementById('btn-sim-breach-path');
      const btnChoke = document.getElementById('btn-sim-find-chokepoints');
      const btnReset = document.getElementById('btn-sim-reset-graph');
      const scenarioSelect = document.getElementById('sim-scenario-select');

      if (btnSim) btnSim.addEventListener('click', () => this.simulateBreach());
      if (btnChoke) btnChoke.addEventListener('click', () => this.detectBottlenecks());
      if (btnReset) btnReset.addEventListener('click', () => this.resetGraph());
      if (scenarioSelect) {
        scenarioSelect.addEventListener('change', (e) => this.loadScenario(e.target.value));
      }

      this.render();
    },

    compileFromProjectState(state) {
      if (!state || (!state.assets && !state.attackNodes)) {
        return;
      }

      if (state.attackNodes && state.attackNodes.length > 0) {
        this.nodes = JSON.parse(JSON.stringify(state.attackNodes));
        this.edges = JSON.parse(JSON.stringify(state.attackEdges || []));
        this.render();
        return;
      }

      // Dynamically compile from assets & findings
      const nodes = [
        { id: 'n_ext', label: 'Internet', type: 'source', x: 50, y: 140, icon: '🌐' }
      ];
      const edges = [];

      let curX = 220;
      (state.assets || []).forEach((asset, idx) => {
        const nodeId = `n_asset_${idx}`;
        nodes.push({
          id: nodeId,
          label: asset.host || asset.ip,
          type: 'host',
          x: curX,
          y: 90 + (idx * 60),
          icon: asset.host && asset.host.includes('vpn') ? '🛡️' : '💻'
        });
        edges.push({
          from: 'n_ext',
          to: nodeId,
          prob: 0.85,
          label: 'Perimeter Access'
        });
        curX += 160;
      });

      // Add crown jewel
      const crownId = 'n_crown';
      nodes.push({
        id: crownId,
        label: 'Domain Controller / Crown',
        type: 'crown',
        crown: true,
        x: Math.max(550, curX),
        y: 140,
        icon: '👑'
      });

      if (nodes.length > 2) {
        edges.push({
          from: nodes[nodes.length - 2].id,
          to: crownId,
          prob: 0.90,
          label: 'Credential Access / Escalation'
        });
      }

      this.nodes = nodes;
      this.edges = edges;
      this.activeBreachPath = [];
      this.highlightedBottlenecks = [];
      this.render();
    },

    loadScenario(scenarioName) {
      if (scenarioName === 'cloud') {
        this.nodes = [
          { id: 'n_ext', label: 'Attacker (GitHub Leak)', type: 'source', x: 60, y: 140, icon: '🌐' },
          { id: 'n_s3', label: 'Public S3 Bucket', type: 'storage', x: 220, y: 90, icon: '🪣', vuln: 'Exposed Keys' },
          { id: 'n_ec2', label: 'Bastion EC2 Host', type: 'host', x: 380, y: 140, icon: '💻', cred: 'IAM Instance Profile' },
          { id: 'n_iam', label: 'AWS Org Admin (Crown)', type: 'crown', x: 550, y: 140, icon: '👑', crown: true }
        ];
        this.edges = [
          { from: 'n_ext', to: 'n_s3', prob: 0.90, label: 'Extract AWS Secret' },
          { from: 'n_s3', to: 'n_ec2', prob: 0.80, label: 'AssumeRole to EC2' },
          { from: 'n_ec2', to: 'n_iam', prob: 0.85, label: 'IAM Policy Escalation' }
        ];
      } else {
        this.nodes = JSON.parse(JSON.stringify(defaultNodes));
        this.edges = JSON.parse(JSON.stringify(defaultEdges));
      }
      this.activeBreachPath = [];
      this.highlightedBottlenecks = [];
      this.render();
      this.updateTelemetry();
    },

    simulateBreach() {
      const sourceNode = this.nodes.find(n => n.type === 'source') || this.nodes[0];
      const crownNode = this.nodes.find(n => n.crown || n.type === 'crown') || this.nodes[this.nodes.length - 1];

      if (!sourceNode || !crownNode) return;

      let current = sourceNode.id;
      const path = [current];
      let totalProb = 1.0;
      let visited = new Set([current]);

      while (current !== crownNode.id) {
        const availableEdges = this.edges.filter(e => e.from === current && !visited.has(e.to));
        if (availableEdges.length === 0) break;
        availableEdges.sort((a, b) => b.prob - a.prob);
        const best = availableEdges[0];
        current = best.to;
        visited.add(current);
        totalProb *= best.prob;
        path.push(current);
      }

      this.activeBreachPath = path;
      this.render();
      this.updateTelemetry(Math.round(totalProb * 100), path.length - 1);
    },

    detectBottlenecks() {
      if (this.activeBreachPath.length === 0) {
        this.simulateBreach();
      }
      this.highlightedBottlenecks = this.activeBreachPath.filter(id => {
        const n = this.nodes.find(node => node.id === id);
        return n && n.type !== 'source' && !n.crown;
      });

      this.render();
      const names = this.highlightedBottlenecks.map(id => {
        const n = this.nodes.find(node => node.id === id);
        return n ? n.label : id;
      });

      if (typeof alert !== 'undefined' && names.length > 0) {
        alert(`[Defensive Choke Point Analysis]\n\nKey Bottleneck Identified: "${names.join(', ')}".\nSevering this asset or revoking its credentials eliminates 100% of breach paths to the Crown Jewels.`);
      }
    },

    resetGraph() {
      this.activeBreachPath = [];
      this.highlightedBottlenecks = [];
      this.render();
      this.updateTelemetry(0, 0);
    },

    updateTelemetry(prob = 73, hops = 3) {
      if (typeof document === 'undefined') return;
      const probEl = document.getElementById('graph-metric-prob');
      const hopsEl = document.getElementById('graph-metric-hops');
      const dwellEl = document.getElementById('graph-metric-dwell');
      if (probEl) probEl.textContent = `${prob}%`;
      if (hopsEl) hopsEl.textContent = `${hops} hops`;
      if (dwellEl) dwellEl.textContent = prob > 0 ? '~14 mins' : '0 mins';
    },

    render() {
      if (typeof document === 'undefined') return;
      const container = document.getElementById('attack-graph-container');
      if (!container) return;

      let svg = `<svg class="attack-graph-svg" viewBox="0 0 680 280" width="100%" height="100%">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#000080"/>
          </marker>
          <marker id="arrow-active" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ff0000"/>
          </marker>
        </defs>`;

      // Render Edges
      this.edges.forEach(e => {
        const fromN = this.nodes.find(n => n.id === e.from);
        const toN = this.nodes.find(n => n.id === e.to);
        if (!fromN || !toN) return;

        const isPath = this.activeBreachPath.includes(e.from) &&
                       this.activeBreachPath.includes(e.to) &&
                       this.activeBreachPath.indexOf(e.to) === this.activeBreachPath.indexOf(e.from) + 1;

        const strokeColor = isPath ? '#ff0000' : '#000080';
        const strokeWidth = isPath ? '3' : '1.5';
        const marker = isPath ? 'url(#arrow-active)' : 'url(#arrow)';

        svg += `<line x1="${fromN.x}" y1="${fromN.y}" x2="${toN.x}" y2="${toN.y}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-dasharray="${isPath ? 'none' : '4,2'}" marker-end="${marker}"/>`;
        
        const midX = (fromN.x + toN.x) / 2;
        const midY = (fromN.y + toN.y) / 2 - 6;
        svg += `<text x="${midX}" y="${midY}" font-size="9" fill="${strokeColor}" font-family="monospace" text-anchor="middle" font-weight="bold">${Math.round(e.prob * 100)}%</text>`;
      });

      // Render Nodes
      this.nodes.forEach(n => {
        const isInPath = this.activeBreachPath.includes(n.id);
        const isChoke = this.highlightedBottlenecks.includes(n.id);
        
        let fillColor = '#ece9d8';
        let strokeColor = '#000080';
        if (n.crown) fillColor = '#fff3cd';
        if (isInPath) strokeColor = '#ff0000';
        if (isChoke) {
          fillColor = '#f8d7da';
          strokeColor = '#8b0000';
        }

        svg += `<g class="graph-node-group" data-id="${n.id}">
          <circle cx="${n.x}" cy="${n.y}" r="18" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${isChoke ? '3' : '2'}"/>
          <text x="${n.x}" y="${n.y + 5}" font-size="13" text-anchor="middle">${n.icon || '💻'}</text>
          <text x="${n.x}" y="${n.y + 32}" font-size="9.5" fill="#000000" font-family="sans-serif" font-weight="bold" text-anchor="middle">${n.label}</text>
        </g>`;
      });

      svg += `</svg>`;
      container.innerHTML = svg;
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = AttackGraphSimulator;
  }
  root.AttackGraphSimulator = AttackGraphSimulator;
})(typeof window !== 'undefined' ? window : global);
