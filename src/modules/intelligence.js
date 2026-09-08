/**
 * PickyHack — Threat Intelligence & EPS Calculator
 * Correlates targets against CISA KEV (Known Exploited Vulnerabilities)
 * and computes multi-factor Exploitability Priority Scores (0-100).
 */
(function(root) {
  'use strict';

  const CISA_KEV_SAMPLE = [
    { cve: 'CVE-2024-3400', vendor: 'Palo Alto Networks', product: 'PAN-OS', dateAdded: '2024-04-12', shortDescription: 'Command injection vulnerability in GlobalProtect feature of PAN-OS.' },
    { cve: 'CVE-2023-3519', vendor: 'Citrix', product: 'NetScaler ADC and Gateway', dateAdded: '2023-07-19', shortDescription: 'Unauthenticated remote code execution vulnerability.' },
    { cve: 'CVE-2023-38606', vendor: 'Apple', product: 'iOS, iPadOS, macOS', dateAdded: '2023-07-24', shortDescription: 'Operation Triangulation kernel vulnerability.' },
    { cve: 'CVE-2023-22515', vendor: 'Atlassian', product: 'Confluence Data Center & Server', dateAdded: '2023-10-04', shortDescription: 'Privilege escalation vulnerability in setup wizard.' },
    { cve: 'CVE-2023-46604', vendor: 'Apache', product: 'ActiveMQ', dateAdded: '2023-11-02', shortDescription: 'OpenWire protocol unauthenticated RCE.' }
  ];

  const SecurityIntelligence = {
    kevData: CISA_KEV_SAMPLE,

    /**
     * Calculates the Exploitability Priority Score (EPS / 100)
     * @param {{ cvss?: number, cve?: string, wildExploit?: boolean, pocAvailable?: boolean, isPreAuth?: boolean, isRemote?: boolean }} vuln
     * @returns {number} Score between 0 and 100
     */
    calculateEPS(vuln) {
      if (!vuln) return 50;
      let score = (vuln.cvss || 5.0) * 5; // Base 0-50

      const isKev = this.isCisaKev(vuln.cve);
      if (isKev) score += 25;
      if (vuln.wildExploit) score += 20;
      if (vuln.pocAvailable) score += 10;
      if (vuln.isPreAuth) score += 15;
      if (vuln.isRemote) score += 10;

      return Math.min(100, Math.max(0, Math.round(score)));
    },

    isCisaKev(cveId) {
      if (!cveId || cveId === 'N/A') return false;
      const clean = cveId.trim().toUpperCase();
      return this.kevData.some(k => k.cve.toUpperCase() === clean);
    },

    searchKev(query) {
      if (!query) return this.kevData;
      const q = query.toLowerCase();
      return this.kevData.filter(item =>
        item.cve.toLowerCase().includes(q) ||
        item.product.toLowerCase().includes(q) ||
        item.vendor.toLowerCase().includes(q) ||
        item.shortDescription.toLowerCase().includes(q)
      );
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityIntelligence;
  } else {
    root.SecurityIntelligence = SecurityIntelligence;
  }
})(typeof window !== 'undefined' ? window : global);
