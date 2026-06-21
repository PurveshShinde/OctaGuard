export const generateAiSummary = (score, findingsCount, targetUrl) => {
  const criticalCount = findingsCount.Critical || 0;
  const highCount = findingsCount.High || 0;
  const mediumCount = findingsCount.Medium || 0;
  
  let summary = `Our automated analysis of ${targetUrl} indicates a ${score.label.toLowerCase()} security posture with an overall score of ${score.total}/100. `;
  
  if (score.total >= 85) {
    summary += "Core security controls appear well-configured, though minor hardening is recommended. ";
    if (mediumCount > 0) {
      summary += `Addressing the ${mediumCount} medium-severity issues will further improve your resilience against common attack vectors.`;
    }
  } else if (criticalCount > 0) {
    summary += `Immediate attention is required! We detected ${criticalCount} critical vulnerabilities that could lead to system compromise, data breaches, or severe service disruption. `;
    if (highCount > 0) {
      summary += `Coupled with ${highCount} high-risk findings, the attack surface is significantly exposed.`;
    }
  } else if (highCount > 0) {
    summary += `Several significant security misconfigurations were identified. The ${highCount} high-risk findings increase the attack surface and should be prioritized in your remediation cycle.`;
  } else {
    summary += `The application has an average security baseline. Resolving the identified medium and low findings will prevent them from chaining into more impactful exploits.`;
  }
  
  return summary;
};
