import { useState, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { generateMockFindings } from '../services/riskRecommendations';
import { calculateSecurityScore } from '../services/scoringEngine';
import { generateAiSummary } from '../services/mockAi';
import { toast } from 'sonner';

export function useScanEngine() {
  const { addScan } = useAppContext();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState('');

  const runScan = useCallback(async (targetUrl) => {
    setIsScanning(true);
    setScanProgress(0);
    
    // Simulate scan phases
    const phases = [
      { msg: 'Resolving DNS...', progress: 15, delay: 800 },
      { msg: 'Checking SSL/TLS configuration...', progress: 35, delay: 1200 },
      { msg: 'Analyzing HTTP security headers...', progress: 55, delay: 1000 },
      { msg: 'Scanning for open ports...', progress: 70, delay: 1500 },
      { msg: 'Detecting common vulnerabilities...', progress: 90, delay: 2000 },
      { msg: 'Generating AI risk summary...', progress: 100, delay: 1000 }
    ];

    for (const phase of phases) {
      setScanStatus(phase.msg);
      setScanProgress(phase.progress);
      await new Promise(r => setTimeout(r, phase.delay));
    }

    const findings = generateMockFindings(targetUrl);
    const score = calculateSecurityScore(findings);
    
    const findingsCount = { Critical: 0, High: 0, Medium: 0, Low: 0, Informational: 0 };
    findings.forEach(f => findingsCount[f.risk]++);

    const aiSummary = generateAiSummary(score, findingsCount, targetUrl);

    const newScan = {
      id: `scan-${Date.now()}`,
      targetUrl,
      timestamp: new Date().toISOString(),
      status: 'completed',
      score,
      aiSummary,
      findings,
      findingsCount
    };

    addScan(newScan);
    setIsScanning(false);
    toast.success('Security scan completed successfully!');
    
    return newScan;
  }, [addScan]);

  return { runScan, isScanning, scanProgress, scanStatus };
}
