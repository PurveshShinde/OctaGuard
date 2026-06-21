import React, { useState } from 'react';
import { T } from '../../utils/constants';
import { Globe, Target, Loader2 } from 'lucide-react';
import { useScanEngine } from '../../hooks/useScanEngine';

export default function ScanForm({ onScanComplete }) {
  const [url, setUrl] = useState('');
  const { runScan, isScanning, scanProgress, scanStatus } = useScanEngine();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;
    const result = await runScan(url);
    if (onScanComplete) onScanComplete(result);
  };

  return (
    <div style={{ background: T.surface, padding: "24px", borderRadius: 12, border: `1px solid ${T.border}` }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 8px 0" }}>Security Scanner</h2>
      <p style={{ color: T.muted, margin: "0 0 20px 0", fontSize: 13 }}>Analyze your web applications for vulnerabilities, misconfigurations, and OWASP Top 10 risks.</p>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 12, alignItems: "stretch", maxWidth: 800 }}>
        <div style={{ position: "relative", flex: 1 }}>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: 16, display: "flex", alignItems: "center" }}>
            <Globe size={18} color={T.muted} />
          </div>
          <input
            type="url"
            required
            placeholder="Enter target URL (e.g., https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isScanning}
            style={{
              width: "100%", height: 48, background: T.bg, border: `1px solid ${isScanning ? T.border : T.borderHi}`,
              borderRadius: 8, padding: "0 16px 0 44px", color: T.text, fontSize: 15,
              transition: "all .2s", outline: "none", fontFamily: T.sans
            }}
            onFocus={(e) => e.target.style.borderColor = T.blue}
            onBlur={(e) => e.target.style.borderColor = isScanning ? T.border : T.borderHi}
          />
        </div>
        <button
          type="submit"
          disabled={isScanning || !url}
          style={{
            background: isScanning || !url ? T.border : T.blue,
            color: isScanning || !url ? T.muted : "#fff",
            border: "none", borderRadius: 8, padding: "0 28px",
            fontWeight: 600, fontSize: 14, cursor: isScanning || !url ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", gap: 8, transition: "all .2s"
          }}
        >
          {isScanning ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <Target size={18} />}
          {isScanning ? "Scanning..." : "Run Analysis"}
        </button>
      </form>

      {/* Progress Bar Simulation */}
      {isScanning && (
        <div style={{ marginTop: 24, animation: "fadeIn 0.3s" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: T.blue, fontFamily: T.font }}>{scanStatus}</span>
            <span style={{ fontSize: 13, color: T.muted, fontFamily: T.font }}>{scanProgress}%</span>
          </div>
          <div style={{ height: 6, background: T.bg, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ 
              height: "100%", width: `${scanProgress}%`, background: T.blue, 
              transition: "width 0.3s ease-out, background 0.3s",
              boxShadow: `0 0 10px ${T.blue}`
            }} />
          </div>
        </div>
      )}
    </div>
  );
}
