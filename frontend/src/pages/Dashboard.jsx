import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { T } from '../utils/constants';

// Components
import ScanForm from '../components/scanning/ScanForm';
import SecurityScoreCard from '../components/dashboard/SecurityScoreCard';
import ExecutiveSummary from '../components/dashboard/ExecutiveSummary';
import RiskMatrix from '../components/dashboard/RiskMatrix';
import OwaspMapping from '../components/scanning/OwaspMapping';
import VulnerabilityList from '../components/scanning/VulnerabilityList';
import PdfReportGenerator from '../components/reporting/PdfReportGenerator';

import { Activity, LayoutDashboard, Database, Info } from 'lucide-react';

export default function Dashboard() {
  const { state } = useAppContext();
  const location = useLocation();
  const [activeScan, setActiveScan] = useState(null);

  // If we navigated here with a specific scan ID (e.g. from history), load it.
  // Otherwise, default to the most recent scan.
  useEffect(() => {
    if (state.scans.length > 0) {
      if (location.state?.loadScan) {
        const found = state.scans.find(s => s.id === location.state.loadScan);
        if (found) setActiveScan(found);
      } else if (!activeScan || !state.scans.find(s => s.id === activeScan.id)) {
        setActiveScan(state.scans[0]);
      }
    }
  }, [state.scans, location.state]);

  const handleScanComplete = (scan) => {
    setActiveScan(scan);
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: T.sans, padding: "24px", paddingBottom: "80px" }}>
      
      {/* Top Section: Scan Control */}
      <div style={{ marginBottom: 32 }}>
        <ScanForm onScanComplete={handleScanComplete} />
      </div>

      {activeScan ? (
        <div id="report-content" style={{ animation: "fadeIn 0.4s ease-out" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 600, margin: "0 0 8px" }}>Scan Results</h2>
              <div style={{ display: "flex", alignItems: "center", gap: 12, color: T.muted, fontSize: 14 }}>
                <span style={{ color: T.blue }}>{activeScan.targetUrl}</span>
                <span>•</span>
                <span>{new Date(activeScan.timestamp).toLocaleString()}</span>
              </div>
            </div>
            
            <PdfReportGenerator targetId="report-content" filename={`OctaGuard_Report_${activeScan.targetUrl.replace(/[^a-z0-9]/gi, '_')}.pdf`} />
          </div>

          {/* First Row: Score & Summary */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24, marginBottom: 24 }}>
            <SecurityScoreCard score={activeScan.score} />
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <ExecutiveSummary text={activeScan.aiSummary} />
              
              {/* Component breakdown mock */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                {Object.entries(activeScan.score.components).map(([key, val]) => (
                  <div key={key} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "16px" }}>
                    <div style={{ fontSize: 12, color: T.muted, textTransform: "uppercase", marginBottom: 8, fontFamily: T.font }}>{key}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 4, background: T.borderHi, borderRadius: 2 }}>
                        <div style={{ height: "100%", width: `${val}%`, background: val >= 80 ? T.green : val >= 50 ? T.amber : T.red, borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 600, fontFamily: T.font }}>{val}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Second Row: Risk Matrix & OWASP */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
            <RiskMatrix findingsCount={activeScan.findingsCount} />
            <OwaspMapping findings={activeScan.findings} />
          </div>

          {/* Third Row: Vulnerabilities List */}
          <VulnerabilityList findings={activeScan.findings} />
        </div>
      ) : (
        <div style={{ 
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "80px 24px", background: T.surface, border: `1px dashed ${T.borderHi}`, borderRadius: 12,
          textAlign: "center"
        }}>
          <div style={{ position: "relative", marginBottom: 24 }}>
            <ShieldAlert size={64} color={T.muted} style={{ opacity: 0.3 }} />
            <Activity size={32} color={T.blue} style={{ position: "absolute", bottom: -10, right: -10 }} />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 12px" }}>No Scan Data Available</h3>
          <p style={{ color: T.muted, maxWidth: 400, lineHeight: 1.5 }}>
            Enter a target URL in the scanner above to initiate a comprehensive security analysis. Results will be saved locally.
          </p>
        </div>
      )}
    </div>
  );
}

// Need to import ShieldAlert that was used in the empty state
import { ShieldAlert } from 'lucide-react';
