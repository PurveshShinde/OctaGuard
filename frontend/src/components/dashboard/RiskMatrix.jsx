import React from 'react';
import { T, RISK_COLOR, RISK_DIM } from '../../utils/constants';

export default function RiskMatrix({ findingsCount }) {
  if (!findingsCount) return null;

  const total = Object.values(findingsCount).reduce((a, b) => a + b, 0);

  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "24px" }}>
      <h3 style={{ margin: "0 0 20px", fontSize: 14, color: T.muted, letterSpacing: "0.05em", fontFamily: T.font }}>RISK MATRIX</h3>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {["Critical", "High", "Medium", "Low", "Informational"].map(risk => {
          const count = findingsCount[risk] || 0;
          const color = RISK_COLOR[risk];
          const bg = RISK_DIM[risk];
          const pct = total === 0 ? 0 : Math.round((count / total) * 100);

          return (
            <div key={risk} style={{
              background: T.surface, border: `1px solid ${count > 0 ? color + '44' : T.border}`, borderRadius: 8, padding: "16px",
              display: "flex", flexDirection: "column", gap: 8,
              boxShadow: count > 0 && risk === 'Critical' ? `0 0 15px ${color}15` : 'none'
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: T.muted, fontWeight: 500 }}>{risk}</span>
                <span style={{ background: bg, color: color, padding: "2px 8px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
                  {pct}%
                </span>
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, color: count > 0 ? color : T.text, lineHeight: 1 }}>
                {count}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
