const VULN_DATABASE = [
  {
    name: "SQL Injection (SQLi)",
    risk: "Critical",
    category: "Injection",
    owasp: "A03:2021",
    description: "Unvalidated user input allows arbitrary SQL commands to be executed on the backend database. This can lead to data exfiltration, modification, or complete database takeover.",
    recommendation: "Implement prepared statements (parameterized queries) or use a secure ORM for all database access. Never concatenate user input directly into SQL strings.",
    priority: "P1"
  },
  {
    name: "Broken Access Control",
    risk: "Critical",
    category: "Broken Access Control",
    owasp: "A01:2021",
    description: "Horizontal privilege escalation detected. Users can access records or functions belonging to other users by modifying ID parameters in the URL or API payload.",
    recommendation: "Enforce strict ownership checks on every protected resource at the server level. Do not rely on UI hiding for security.",
    priority: "P1"
  },
  {
    name: "Stored Cross-Site Scripting (XSS)",
    risk: "High",
    category: "Injection",
    owasp: "A03:2021",
    description: "User input is stored and rendered without proper sanitization, allowing malicious scripts to execute in the browsers of other users who view the payload.",
    recommendation: "Context-aware output encoding must be applied before rendering user data. Implement a strict Content-Security-Policy (CSP) to restrict script execution sources.",
    priority: "P2"
  },
  {
    name: "Missing Content-Security-Policy",
    risk: "Medium",
    category: "Security Misconfiguration",
    owasp: "A05:2021",
    description: "The application does not enforce a Content-Security-Policy, leaving it more vulnerable to XSS and data exfiltration attacks.",
    recommendation: "Configure a robust CSP header (e.g., default-src 'self') and gradually lock down external script and style sources.",
    priority: "P3"
  },
  {
    name: "Outdated TLS Version",
    risk: "Medium",
    category: "Cryptographic Failures",
    owasp: "A02:2021",
    description: "The server accepts connections using deprecated TLS 1.0/1.1 protocols, which contain known cryptographic flaws.",
    recommendation: "Disable TLS 1.0 and 1.1 at the load balancer or web server level. Enforce TLS 1.2 or 1.3 exclusively with strong cipher suites.",
    priority: "P3"
  },
  {
    name: "Server Information Disclosure",
    risk: "Low",
    category: "Security Misconfiguration",
    owasp: "A05:2021",
    description: "The server exposes its version information (e.g., 'Server: nginx/1.14.0' or 'X-Powered-By: Express') in HTTP response headers.",
    recommendation: "Remove unnecessary server signature headers to avoid giving attackers reconnaissance data about your technology stack.",
    priority: "P4"
  }
];

export const generateMockFindings = (url) => {
  // Deterministic random-like behavior based on URL length to make it seem consistent per URL
  const count = (url.length % 4) + 2; // Returns 2 to 5 vulnerabilities
  const shuffled = [...VULN_DATABASE].sort(() => 0.5 - Math.random());
  
  return shuffled.slice(0, count).map((vuln, i) => ({
    ...vuln,
    id: `vuln-${Date.now()}-${i}`,
    affectedUrl: `${url}${['/api/users', '/login', '/dashboard/profile', '/config'][i % 4]}`
  }));
};
