import React, { useEffect, useState } from 'react';
import { T } from '../../utils/constants';

export default function SecurityScoreCard({ score }) {
  const [displayScore, setDisplayScore] = useState(0);

  // Animate score from 0 to target
  useEffect(() => {
    if (!score) return;
    let start = 0;
    const end = score.total;
    const duration = 1500;
    const stepTime = Math.abs(Math.floor(duration / end));
    
    const timer = setInterval(() => {
      start += 1;
      setDisplayScore(start);
      if (start === end) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [score]);

  if (!score) return null;

  const color = score.total >= 80 ? T.green : score.total >= 60 ? T.amber : T.red;

  return (
    <div style={{
      background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "24px",
      display: "flex", flexDirection: "column", alignItems: "center", position: "relative", overflow: "hidden"
    }}>
      {/* Background glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: 150, height: 150, background: color, filter: "blur(80px)", opacity: 0.15, borderRadius: "50%"
      }} />

      <h3 style={{ margin: "0 0 20px", fontSize: 14, color: T.muted, letterSpacing: "0.05em", fontFamily: T.font }}>SECURITY SCORE</h3>
      
      {/* Ring */}
      <div style={{ position: "relative", width: 160, height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="160" height="160" style={{ position: "absolute", transform: "rotate(-90deg)" }}>
          <circle cx="80" cy="80" r="70" fill="none" stroke={T.faint} strokeWidth="12" />
          <circle cx="80" cy="80" r="70" fill="none" stroke={color} strokeWidth="12" 
            strokeDasharray={440} 
            strokeDashoffset={440 - (440 * displayScore) / 100} 
            style={{ transition: "stroke-dashoffset 0.1s linear", strokeLinecap: "round" }} 
          />
        </svg>
        <div style={{ textAlign: "center", zIndex: 1 }}>
          <span style={{ fontSize: 48, fontWeight: 700, color: T.text, lineHeight: 1 }}>{displayScore}</span>
          <span style={{ fontSize: 24, color: T.muted }}>/100</span>
          <div style={{ fontSize: 20, fontWeight: 600, color, marginTop: 4 }}>{score.grade}</div>
        </div>
      </div>
      
      <div style={{ marginTop: 24, fontSize: 16, fontWeight: 500, color: T.text }}>{score.label}</div>
    </div>
  );
}
