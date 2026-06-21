import React, { useState, useEffect } from 'react';
import { T } from '../../utils/constants';
import { Shield } from 'lucide-react';

export default function ExecutiveSummary({ text }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (!text) {
      setDisplayedText('');
      return;
    }
    
    let i = 0;
    setDisplayedText('');
    const timer = setInterval(() => {
      setDisplayedText(prev => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, 15); // Fast typing speed

    return () => clearInterval(timer);
  }, [text]);

  if (!text) return null;

  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "24px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -20, right: -20, opacity: 0.05 }}>
        <Shield size={180} />
      </div>
      
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <Shield size={20} color={T.blue} />
        <h3 style={{ margin: 0, fontSize: 14, color: T.muted, letterSpacing: "0.05em", fontFamily: T.font }}>EXECUTIVE AI SUMMARY</h3>
      </div>
      
      <p style={{ 
        margin: 0, fontSize: 15, lineHeight: 1.6, color: T.text, maxWidth: "90%",
        fontFamily: T.sans 
      }}>
        {displayedText}
        {displayedText.length < text.length && <span style={{ borderRight: `2px solid ${T.blue}`, animation: "blink 1s step-end infinite" }}>&nbsp;</span>}
      </p>
      <style>{`@keyframes blink { 50% { border-color: transparent } }`}</style>
    </div>
  );
}
