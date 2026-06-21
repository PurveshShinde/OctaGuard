export const calculateSecurityScore = (findings) => {
  let baseScore = 100;
  
  // Deductions based on risk
  const deductions = {
    Critical: 25,
    High: 15,
    Medium: 5,
    Low: 1,
    Informational: 0
  };

  findings.forEach(finding => {
    baseScore -= deductions[finding.risk] || 0;
  });

  const finalScore = Math.max(0, baseScore);
  
  let grade = 'F';
  if (finalScore >= 95) grade = 'A+';
  else if (finalScore >= 85) grade = 'A';
  else if (finalScore >= 75) grade = 'B';
  else if (finalScore >= 60) grade = 'C';
  else if (finalScore >= 40) grade = 'D';

  const getRiskLabel = (g) => {
    if (g === 'A+' || g === 'A') return "Excellent";
    if (g === 'B') return "Good";
    if (g === 'C') return "Moderate Risk";
    if (g === 'D') return "High Risk";
    return "Critical Risk";
  };

  // component breakdown (mock data for visualization)
  const components = {
    ssl: finalScore >= 90 ? 100 : finalScore >= 70 ? 80 : 40,
    headers: finalScore >= 80 ? 90 : finalScore >= 60 ? 60 : 30,
    openPorts: finalScore >= 85 ? 95 : 60,
  };

  return { total: finalScore, grade, label: getRiskLabel(grade), components };
};
