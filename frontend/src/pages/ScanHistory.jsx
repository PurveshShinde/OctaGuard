import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { T, RISK_COLOR, RISK_DIM } from '../utils/constants';
import { Globe, Calendar, ArrowRight, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ScanHistory() {
  const { state } = useAppContext();
  const { scans } = state;
  const [filter, setFilter] = useState('all'); // 'all', 'high', 'critical'

  const filteredScans = scans.filter(scan => {
    if (filter === 'critical') return scan.findingsCount.Critical > 0;
    if (filter === 'high') return scan.findingsCount.High > 0;
    return true;
  });

  return (
    <div style={{ padding: "32px", color: T.text, fontFamily: T.sans, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 600, margin: "0 0 8px 0" }}>Scan History</h2>
          <p style={{ color: T.muted, margin: 0, fontSize: 15 }}>A comprehensive log of all security assessments performed locally.</p>
        </div>
        
        <div style={{ display: "flex", gap: 8 }}>
          {['all', 'high', 'critical'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter === f ? T.blueDim : "transparent",
              color: filter === f ? T.blue : T.muted,
              border: `1px solid ${filter === f ? T.blue : T.borderHi}`,
              padding: "6px 12px", borderRadius: 6, fontSize: 13, cursor: "pointer",
              textTransform: "capitalize", fontWeight: 500, transition: "all 0.2s"
            }}>
              {f === 'all' ? 'All Scans' : `${f} Risk Only`}
            </button>
          ))}
        </div>
      </div>

      {scans.length === 0 ? (
        <div style={{ background: T.card, border: `1px dashed ${T.borderHi}`, borderRadius: 12, padding: "64px", textAlign: "center" }}>
          <ShieldAlert size={48} color={T.muted} style={{ margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: 18, margin: "0 0 8px" }}>No Scans Yet</h3>
          <p style={{ color: T.muted, margin: "0 0 24px" }}>Run your first security scan from the dashboard to see history here.</p>
          <Link to="/dashboard" style={{ background: T.blue, color: "#fff", padding: "10px 20px", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}>
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: T.surface, borderBottom: `1px solid ${T.border}` }}>
                <th style={{ padding: "16px 24px", textAlign: "left", color: T.muted, fontWeight: 600, fontSize: 12, letterSpacing: "0.05em", fontFamily: T.font }}>TARGET URL</th>
                <th style={{ padding: "16px 24px", textAlign: "left", color: T.muted, fontWeight: 600, fontSize: 12, letterSpacing: "0.05em", fontFamily: T.font }}>DATE</th>
                <th style={{ padding: "16px 24px", textAlign: "left", color: T.muted, fontWeight: 600, fontSize: 12, letterSpacing: "0.05em", fontFamily: T.font }}>SCORE</th>
                <th style={{ padding: "16px 24px", textAlign: "left", color: T.muted, fontWeight: 600, fontSize: 12, letterSpacing: "0.05em", fontFamily: T.font }}>ISSUES</th>
                <th style={{ padding: "16px 24px", textAlign: "right" }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredScans.map((scan) => {
                const totalIssues = Object.values(scan.findingsCount).reduce((a, b) => a + b, 0);
                const color = scan.score.total >= 80 ? T.green : scan.score.total >= 60 ? T.amber : T.red;
                
                return (
                  <tr key={scan.id} style={{ borderBottom: `1px solid ${T.borderHi}`, transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = T.surface} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: "16px 24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Globe size={16} color={T.muted} />
                        <span style={{ fontWeight: 500, fontFamily: T.font }}>{scan.targetUrl}</span>
                      </div>
                    </td>
                    <td style={{ padding: "16px 24px", color: T.muted }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Calendar size={14} />
                        {new Date(scan.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <span style={{ color: color, fontWeight: 700, fontSize: 16 }}>{scan.score.total}</span>
                      <span style={{ color: T.muted, fontSize: 12 }}>/100</span>
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <div style={{ display: "flex", gap: 4 }}>
                        {scan.findingsCount.Critical > 0 && <span style={{ background: RISK_DIM.Critical, color: RISK_COLOR.Critical, padding: "2px 6px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>{scan.findingsCount.Critical} C</span>}
                        {scan.findingsCount.High > 0 && <span style={{ background: RISK_DIM.High, color: RISK_COLOR.High, padding: "2px 6px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>{scan.findingsCount.High} H</span>}
                        {totalIssues === 0 && <span style={{ color: T.green }}>0 Issues</span>}
                      </div>
                    </td>
                    <td style={{ padding: "16px 24px", textAlign: "right" }}>
                      <Link to={`/dashboard`} state={{ loadScan: scan.id }} style={{ 
                        color: T.blue, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500 
                      }}>
                        View Report <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredScans.length === 0 && (
            <div style={{ padding: "32px", textAlign: "center", color: T.muted }}>No scans match the current filter.</div>
          )}
        </div>
      )}
    </div>
  );
}
