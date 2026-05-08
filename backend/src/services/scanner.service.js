const axios = require('axios');

class ScannerService {
  /**
   * Validate URL for basic format and SSRF protection
   */
  validateUrl(url) {
    try {
      const parsed = new URL(url);
      
      // Only allow http and https
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return { valid: false, error: 'Only http and https protocols are allowed' };
      }

      const hostname = parsed.hostname.toLowerCase();

      // Block common internal/private address patterns
      const internalPatterns = [
        /^localhost$/,
        /^127\./,
        /^192\.168\./,
        /^10\./,
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
        /^0\.0\.0\.0$/,
        /^169\.254\./, // Link-local
        /\.local$/,
      ];

      if (internalPatterns.some(pattern => pattern.test(hostname))) {
        return { valid: false, error: 'Internal or private addresses are not allowed' };
      }

      return { valid: true, url: parsed.toString() };
    } catch (e) {
      return { valid: false, error: 'Invalid URL format' };
    }
  }

  /**
   * Perform a lightweight security scan
   */
  async performScan(url) {
    const findings = [];
    let riskScore = 0;
    const startTime = Date.now();

    try {
      const response = await axios.get(url, {
        timeout: 5000,
        headers: {
          'User-Agent': 'OctaGuard Security Scanner/1.0',
        },
        validateStatus: false, // Don't throw on 4xx/5xx
        maxRedirects: 5,
      });

      // Normalize all headers to lowercase for reliable access
      const normalizedHeaders = Object.fromEntries(
        Object.entries(response.headers).map(([key, value]) => [
          key.toLowerCase(),
          value,
        ])
      );

      // Debug logging (temporary)
      console.log(`--- [DEBUG] Normalized Headers for ${url} ---`);
      console.log(normalizedHeaders);
      console.log('--- [DEBUG] End ---');

      // 1. SSL/HTTPS Check
      if (!url.startsWith('https://')) {
        findings.push({
          name: 'No HTTPS Encryption',
          risk: 'high',
          description: 'The site does not use HTTPS, meaning data is transmitted in clear text.',
          url: 'https://developer.mozilla.org/en-US/docs/Glossary/HTTPS',
          solution: 'Enable HTTPS using an SSL/TLS certificate (e.g., Let\'s Encrypt).'
        });
        riskScore += 40;
      }

      // 2. Security Headers
      const securityHeaders = [
        {
          name: 'Content-Security-Policy',
          keys: ['content-security-policy', 'content-security-policy-report-only'],
          risk: 'medium',
          desc: 'CSP helps prevent XSS and data injection attacks.',
          sol: 'Add a Content-Security-Policy header to your web server configuration.'
        },
        {
          name: 'Strict-Transport-Security',
          keys: ['strict-transport-security'],
          risk: 'medium',
          desc: 'HSTS ensures the browser only communicates over HTTPS.',
          sol: 'Add the Strict-Transport-Security header with a sufficient max-age.'
        },
        {
          name: 'X-Frame-Options',
          keys: ['x-frame-options'],
          risk: 'low',
          desc: 'Prevents the site from being embedded in frames (Clickjacking protection).',
          sol: 'Add X-Frame-Options: DENY or SAMEORIGIN.'
        },
        {
          name: 'X-Content-Type-Options',
          keys: ['x-content-type-options'],
          risk: 'low',
          desc: 'Prevents MIME type sniffing.',
          sol: 'Add X-Content-Type-Options: nosniff.'
        }
      ];

      securityHeaders.forEach(sh => {
        const hasHeader = sh.keys.some(key => normalizedHeaders[key]);
        
        if (!hasHeader) {
          findings.push({
            name: `Missing ${sh.name}`,
            risk: sh.risk,
            description: sh.desc,
            url: `https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/${sh.keys[0]}`,
            solution: sh.sol
          });
          riskScore += sh.risk === 'high' ? 30 : sh.risk === 'medium' ? 15 : 5;
        }
      });

      // 3. Tech Detection
      const tech = [];
      const serverHeader = normalizedHeaders['server'];
      const poweredBy = normalizedHeaders['x-powered-by'];

      if (serverHeader) tech.push(`Server: ${serverHeader}`);
      if (poweredBy) tech.push(`Engine: ${poweredBy}`);
      if (typeof body === 'string') {
        if (body.includes('wp-content')) tech.push('CMS: WordPress');
        if (body.includes('id="root"') || body.includes('id="app"')) tech.push('Frontend: React/Vue/SPA');
      }

      // Cap risk score at 100
      riskScore = Math.min(riskScore, 100);

      return {
        success: true,
        riskScore,
        findings,
        tech,
        responseTime: Date.now() - startTime
      };

    } catch (error) {
      return {
        success: false,
        error: error.message || 'Scan failed',
        findings: [],
        riskScore: 0
      };
    }
  }
}

module.exports = new ScannerService();
