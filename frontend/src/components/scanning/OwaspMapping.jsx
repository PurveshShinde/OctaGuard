import React from 'react';
import { T, RISK_COLOR } from '../../utils/constants';
import { Layers } from 'lucide-react';

export default function OwaspMapping({ findings }) {
  if (!findings || findings.length === 0) return null;

  const owaspCategories = findings.reduce((acc, f) => {
    if (!acc[f.owasp]) {
      acc[f.owasp] = { name: f.category, count: 0, critical: 0, high: 0, medium: 0, low: 0 };
    }
    acc[f.owasp].count += 1;
    acc[f.owasp][f.risk.toLowerCase()] = (acc[f.owasp][f.risk.toLowerCase()] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <Layers size={18} color={T.muted} />
        <h3 style={{ margin: 0, fontSize: 14, color: T.muted, letterSpacing: "0.05em", fontFamily: T.font }}>OWASP TOP 10 MAPPING</h3>
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {Object.entries(owaspCategories).map(([code, data]) => (
          <div key={code} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: T.font, fontSize: 12, fontWeight: 600, color: T.blue, background: T.blueDim, padding: "2px 6px", borderRadius: 4 }}>{code}</span>
                <span style={{ fontWeight: 600, fontSize: 14, color: T.text }}>{data.name}</span>
              </div>
              <span style={{ fontSize: 13, color: T.muted }}>{data.count} issue{data.count > 1 ? 's' : ''}</span>
            </div>
            
            {/* Mini risk bar */}
            <div style={{ display: "flex", height: 6, borderRadius: 3, overflow: "hidden", gap: 2 }}>
              {data.critical > 0 && <div style={{ flex: data.critical, background: RISK_COLOR.Critical }} title={`Critical: ${data.critical}`} />}
              {data.high > 0 && <div style={{ flex: data.high, background: RISK_COLOR.High }} title={`High: ${data.high}`} />}
              {data.medium > 0 && <div style={{ flex: data.medium, background: RISK_COLOR.Medium }} title={`Medium: ${data.medium}`} />}
              {data.low > 0 && <div style={{ flex: data.low, background: RISK_COLOR.Low }} title={`Low: ${data.low}`} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
