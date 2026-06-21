import React from 'react';
import { useAppContext } from '../context/AppContext';
import { T } from '../utils/constants';
import { Shield, Activity, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const { state, updateSettings, clearData } = useAppContext();
  const { settings } = state;

  const handleToggle = () => {
    updateSettings({ monitoringEnabled: !settings.monitoringEnabled });
    toast.success(`Continuous monitoring ${!settings.monitoringEnabled ? 'enabled' : 'disabled'}`);
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to delete all local scan data? This cannot be undone.")) {
      clearData();
      toast.success("All data cleared successfully.");
    }
  };

  return (
    <div style={{ padding: "32px", color: T.text, fontFamily: T.sans, maxWidth: 800, margin: "0 auto" }}>
      <h2 style={{ fontSize: 28, fontWeight: 600, margin: "0 0 32px 0" }}>Settings</h2>

      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "24px", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <Activity size={24} color={T.blue} />
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Monitoring Simulation</h3>
        </div>
        <p style={{ color: T.muted, lineHeight: 1.5, marginBottom: 24 }}>
          Enable continuous monitoring to simulate background scanning. Note: In this frontend-only showcase, this simply updates the status indicator and does not run real background tasks.
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", background: T.surface, borderRadius: 8, border: `1px solid ${T.borderHi}` }}>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Continuous Monitoring</div>
            <div style={{ fontSize: 13, color: T.muted }}>Automated daily security checks</div>
          </div>
          
          <button onClick={handleToggle} style={{
            background: settings.monitoringEnabled ? T.green : T.surface,
            border: `1px solid ${settings.monitoringEnabled ? T.green : T.borderHi}`,
            width: 48, height: 26, borderRadius: 13, position: "relative", cursor: "pointer", transition: "all 0.2s"
          }}>
            <div style={{
              position: "absolute", top: 2, left: settings.monitoringEnabled ? 24 : 2,
              width: 20, height: 20, background: "#fff", borderRadius: "50%", transition: "all 0.2s"
            }} />
          </button>
        </div>
      </div>

      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <Shield size={24} color={T.red} />
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Data Management</h3>
        </div>
        <p style={{ color: T.muted, lineHeight: 1.5, marginBottom: 24 }}>
          All scan data is stored locally in your browser using localStorage. You can clear this data to reset the application to its default state.
        </p>

        <button onClick={handleClear} style={{
          background: T.redDim, color: T.red, border: `1px solid ${T.red}44`,
          padding: "10px 20px", borderRadius: 8, fontWeight: 600, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s"
        }} onMouseEnter={e => e.currentTarget.style.background = T.red + '33'} onMouseLeave={e => e.currentTarget.style.background = T.redDim}>
          <Trash2 size={16} />
          Clear All Local Data
        </button>
      </div>
    </div>
  );
}
