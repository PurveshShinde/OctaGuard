import { useState, useEffect, useMemo, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Shield, AlertTriangle, CheckCircle2, Globe, Activity,
  RotateCcw, Layers, Info, ChevronRight, Eye, Wifi,
} from "lucide-react";
 
/* ── THEME ── */
const T = {
  bg:       "#07090f",
  surface:  "#0e1117",
  card:     "#131820",
  border:   "#1e2636",
  borderHi: "#2e3d55",
  text:     "#e8edf5",
  muted:    "#6b7a9a",
  faint:    "#1a2233",
  red:      "#f0595a", redDim:   "#3d1a1a",
  amber:    "#e9a23b", amberDim: "#3a2610",
  blue:     "#4a8cf7", blueDim:  "#0e1f3e",
  green:    "#3ecf8e", greenDim: "#0a2e1e",
  teal:     "#2dd4bf",
  font: "'IBM Plex Mono', 'Fira Code', monospace",
  sans: "'IBM Plex Sans', system-ui, sans-serif",
};
const RISK_COLOR = { Critical: T.red,   High: T.amber,   Medium: T.blue,   Low: T.green };
const RISK_DIM   = { Critical: T.redDim, High: T.amberDim, Medium: T.blueDim, Low: T.greenDim };
const STATUS_COLOR = { completed: T.green, scanning: T.amber, pending: T.muted, failed: T.red };
 
/* ── MOCK DATA ── */
const MOCK_SCANS = [
  { id:"s1", targetUrl:"api.acme.com",       status:"completed", riskScore:87, createdAt:"2024-05-24T10:30:00Z", vulnCount:12 },
  { id:"s2", targetUrl:"dashboard.acme.com", status:"completed", riskScore:44, createdAt:"2024-05-24T09:15:00Z", vulnCount:4  },
  { id:"s3", targetUrl:"auth.acme.com",      status:"scanning",  riskScore:0,  createdAt:"2024-05-24T08:45:00Z", vulnCount:0  },
  { id:"s4", targetUrl:"admin.acme.com",     status:"completed", riskScore:73, createdAt:"2024-05-24T07:20:00Z", vulnCount:8  },
  { id:"s5", targetUrl:"cdn.acme.com",       status:"completed", riskScore:29, createdAt:"2024-05-24T06:00:00Z", vulnCount:2  },
  { id:"s6", targetUrl:"api2.acme.com",      status:"pending",   riskScore:0,  createdAt:"2024-05-24T05:30:00Z", vulnCount:0  },
  { id:"s7", targetUrl:"store.acme.com",     status:"completed", riskScore:61, createdAt:"2024-05-23T22:10:00Z", vulnCount:6  },
  { id:"s8", targetUrl:"mail.acme.com",      status:"failed",    riskScore:0,  createdAt:"2024-05-23T20:00:00Z", vulnCount:0  },
];
 
const MOCK_VULNS = [
  { id:"v1",  scanId:"s1", name:"SQL Injection",          risk:"Critical", description:"Unvalidated user input allows arbitrary SQL execution in /api/users.",      url:"/api/users?id=",       solution:"Use parameterized queries or an ORM." },
  { id:"v2",  scanId:"s1", name:"Stored XSS",             risk:"High",     description:"Unsafe innerHTML manipulation exposes all users to script injection.",       url:"/dashboard/profile",   solution:"Sanitize output; enforce Content-Security-Policy." },
  { id:"v3",  scanId:"s1", name:"Outdated TLS",           risk:"High",     description:"Server accepts TLS 1.0/1.1, both deprecated and cryptographically weak.",    url:"https://api.acme.com", solution:"Enforce TLS 1.3, disable older versions." },
  { id:"v4",  scanId:"s1", name:"Broken Access Control",  risk:"Critical", description:"Horizontal privilege escalation: any user can read other users' records.",   url:"/api/users/:id",       solution:"Enforce ownership checks on every protected resource." },
  { id:"v5",  scanId:"s2", name:"Misconfigured CORS",     risk:"Medium",   description:"Wildcard CORS origin allows cross-site data exfiltration.",                  url:"/api/data",            solution:"Restrict Access-Control-Allow-Origin to trusted domains." },
  { id:"v6",  scanId:"s4", name:"Exposed API Key",        risk:"Critical", description:"AWS API key committed to public repo and still active.",                     url:"/admin/config.js",     solution:"Rotate key immediately; use environment variables." },
  { id:"v7",  scanId:"s4", name:"Path Traversal",         risk:"High",     description:"../.. sequences in file-download endpoint expose server filesystem.",        url:"/files/download",      solution:"Canonicalize and validate all file paths before use." },
  { id:"v8",  scanId:"s4", name:"No Rate Limiting",       risk:"High",     description:"Login endpoint has no rate limiting; brute-force attacks are trivial.",      url:"/admin/login",         solution:"Add exponential back-off and account lockout." },
  { id:"v9",  scanId:"s5", name:"Missing HSTS",           risk:"Low",      description:"Strict-Transport-Security header absent, allowing protocol downgrade.",      url:"https://cdn.acme.com", solution:"Add max-age=31536000; includeSubDomains to HSTS header." },
  { id:"v10", scanId:"s7", name:"Clickjacking",           risk:"Medium",   description:"X-Frame-Options not set; page can be embedded in a malicious iframe.",      url:"/store",               solution:"Set X-Frame-Options: DENY or use CSP frame-ancestors." },
];
 
const TREND = Array.from({ length: 24 }, (_, i) => ({
  label: i % 6 === 0 ? `${24 - i}h` : "",
  risk: [55,60,52,70,66,80,75,83,88,79,72,68,65,70,74,80,85,77,72,68,75,80,84,87][i],
}));
 
/* ── HELPERS ── */
const fmt = n => Number.isFinite(n) ? Math.round(n) : 0;
function timeAgo(iso) {
  const d = (Date.now() - new Date(iso)) / 1000;
  if (d < 60) return "just now";
  if (d < 3600) return `${Math.round(d/60)}m ago`;
  if (d < 86400) return `${Math.round(d/3600)}h ago`;
  return `${Math.round(d/86400)}d ago`;
}
 
function RiskBadge({ risk, small }) {
  return (
    <span style={{
      display:"inline-block", padding: small ? "2px 7px" : "3px 10px",
      borderRadius:4, background: RISK_DIM[risk]||"#1a1f2b",
      color: RISK_COLOR[risk]||T.muted,
      fontFamily:T.font, fontSize: small?11:12, fontWeight:600, letterSpacing:"0.04em",
    }}>{risk}</span>
  );
}
 
function StatusDot({ status }) {
  const c = STATUS_COLOR[status] || T.muted;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:6, fontFamily:T.font, fontSize:12, color:c }}>
      <span style={{
        width:7, height:7, borderRadius:"50%", background:c,
        animation: status==="scanning" ? "pulse 1.4s ease-in-out infinite" : "none",
      }}/>
      {status.charAt(0).toUpperCase()+status.slice(1)}
    </span>
  );
}
 
function ChartTip({ active, payload, label, suffix="" }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:T.card, border:`1px solid ${T.borderHi}`, borderRadius:8, padding:"10px 14px", fontFamily:T.font, fontSize:12 }}>
      {label && <p style={{ color:T.muted, margin:"0 0 6px" }}>{label}</p>}
      {payload.map((p,i)=>(
        <p key={i} style={{ margin:"2px 0", color:p.color||T.text }}>
          {p.name}: <strong style={{ color:T.text }}>{fmt(p.value)}{suffix}</strong>
        </p>
      ))}
    </div>
  );
}
 
/* ── DASHBOARD ── */
export default function Dashboard() {
  const [scans]  = useState(MOCK_SCANS);
  const [vulns]  = useState(MOCK_VULNS);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [riskFilter,   setRiskFilter]   = useState(["Critical","High","Medium","Low"]);
  const [statusFilter, setStatusFilter] = useState(["completed","scanning","pending","failed"]);
  const [hoveredVuln, setHoveredVuln]   = useState(null);
  const [hoveredScan, setHoveredScan]   = useState(null);
  const [tab, setTab] = useState("overview");
 
  const refresh = useCallback(async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setLastRefresh(new Date());
    setLoading(false);
  }, []);
 
  useEffect(() => { refresh(); }, []);
 
  const filteredVulns = useMemo(() => vulns.filter(v => riskFilter.includes(v.risk)), [vulns, riskFilter]);
  const filteredScans = useMemo(() => scans.filter(s => statusFilter.includes(s.status)), [scans, statusFilter]);
 
  const metrics = useMemo(() => {
    const completed = filteredScans.filter(s => s.status==="completed");
    const scored    = completed.filter(s => s.riskScore > 0);
    return {
      totalVulns: filteredVulns.length,
      critCount:  filteredVulns.filter(v => v.risk==="Critical").length,
      avgRisk:    scored.length ? fmt(scored.reduce((a,s)=>a+s.riskScore,0)/scored.length) : 0,
      completedScans: completed.length,
      totalScans: filteredScans.length,
    };
  }, [filteredVulns, filteredScans]);
 
  const riskDist = useMemo(() => {
    const d = { Critical:0, High:0, Medium:0, Low:0 };
    filteredVulns.forEach(v => { d[v.risk]=(d[v.risk]||0)+1; });
    return Object.entries(d).filter(([,v])=>v>0).map(([name,value])=>({ name, value }));
  }, [filteredVulns]);
 
  const toggleRisk   = r => setRiskFilter(p   => p.includes(r) ? p.filter(x=>x!==r) : [...p,r]);
  const toggleStatus = s => setStatusFilter(p => p.includes(s) ? p.filter(x=>x!==s) : [...p,s]);
 
  const hoveredVulnData = hoveredVuln ? vulns.find(v=>v.id===hoveredVuln) : null;
  const TABS = [
    { key:"overview", label:"Overview", icon:<Layers size={14}/> },
    { key:"scans",    label:"Scans",    icon:<Globe size={14}/> },
    { key:"vulns",    label:"Vulnerabilities", icon:<AlertTriangle size={14}/> },
  ];
 
  return (
    <div style={{ minHeight:"100vh", background:T.bg, color:T.text, fontFamily:T.sans, fontSize:14 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:.25} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:none} }
        .og-row:hover { background: ${T.faint} !important; }
        .og-chip { cursor:pointer; user-select:none; transition:all .14s; }
        .og-chip:hover { opacity:.8; }
        .og-tab { cursor:pointer; transition:color .15s, border-color .15s; background:none; border:none; }
      `}</style>
 
      {/* NAV */}
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 24px", height:54,
        background:T.surface, borderBottom:`1px solid ${T.border}`,
        position:"sticky", top:0, zIndex:50,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <Shield size={19} color={T.blue}/>
          <span style={{ fontFamily:T.font, fontSize:14, fontWeight:600, letterSpacing:"0.08em" }}>OCTAGUARD</span>
          <span style={{
            background:T.blueDim, color:T.blue, fontFamily:T.font,
            fontSize:10, fontWeight:600, padding:"2px 7px", borderRadius:3, letterSpacing:"0.1em",
          }}>SECURITY</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:18 }}>
          <span style={{ display:"flex", alignItems:"center", gap:6, fontFamily:T.font, fontSize:11, color:T.muted }}>
            <Wifi size={13} color={T.green}/>
            LIVE · {lastRefresh.toLocaleTimeString()}
          </span>
          <button onClick={refresh} disabled={loading} style={{
            display:"flex", alignItems:"center", gap:6,
            background:"none", border:`1px solid ${T.border}`, borderRadius:6,
            padding:"5px 12px", color:T.muted, cursor:"pointer",
            fontFamily:T.font, fontSize:12, opacity:loading?.5:1,
          }}>
            <RotateCcw size={12} style={{ animation:loading?"pulse 1s linear infinite":"none" }}/>
            Refresh
          </button>
        </div>
      </div>
 
      <div style={{ padding:"24px 24px 60px" }}>
 
        {/* TABS */}
        <div style={{ display:"flex", borderBottom:`1px solid ${T.border}`, marginBottom:24 }}>
          {TABS.map(({ key, label, icon }) => {
            const active = tab===key;
            return (
              <button key={key} className="og-tab" onClick={()=>setTab(key)} style={{
                display:"flex", alignItems:"center", gap:7, padding:"10px 20px",
                borderBottom: active ? `2px solid ${T.blue}` : "2px solid transparent",
                color: active ? T.blue : T.muted,
                fontFamily:T.sans, fontSize:13, fontWeight: active?600:400, marginBottom:-1,
              }}>
                {icon}{label}
              </button>
            );
          })}
        </div>
 
        {/* SLICERS */}
        <div style={{
          background:T.surface, border:`1px solid ${T.border}`, borderRadius:10,
          padding:"14px 18px", marginBottom:22,
          display:"flex", flexWrap:"wrap", gap:18, alignItems:"center",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
            <span style={{ fontFamily:T.font, fontSize:11, color:T.muted, letterSpacing:"0.06em" }}>RISK</span>
            {["Critical","High","Medium","Low"].map(r => {
              const on = riskFilter.includes(r);
              return (
                <span key={r} className="og-chip" onClick={()=>toggleRisk(r)} style={{
                  padding:"3px 11px", borderRadius:4,
                  border:`1px solid ${on ? RISK_COLOR[r] : T.border}`,
                  background: on ? RISK_DIM[r] : "transparent",
                  color: on ? RISK_COLOR[r] : T.muted,
                  fontFamily:T.font, fontSize:12, fontWeight:600,
                }}>{r}</span>
              );
            })}
          </div>
          <div style={{ width:1, background:T.border, alignSelf:"stretch" }}/>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
            <span style={{ fontFamily:T.font, fontSize:11, color:T.muted, letterSpacing:"0.06em" }}>STATUS</span>
            {["completed","scanning","pending","failed"].map(s => {
              const on = statusFilter.includes(s);
              const c  = STATUS_COLOR[s];
              return (
                <span key={s} className="og-chip" onClick={()=>toggleStatus(s)} style={{
                  padding:"3px 11px", borderRadius:4,
                  border:`1px solid ${on ? c : T.border}`,
                  background: on ? `${c}22` : "transparent",
                  color: on ? c : T.muted,
                  fontFamily:T.font, fontSize:12, fontWeight:600,
                }}>{s.charAt(0).toUpperCase()+s.slice(1)}</span>
              );
            })}
          </div>
        </div>
 
        {/* ─── OVERVIEW ─── */}
        {tab==="overview" && (
          <div style={{ animation:"fadeIn .3s ease" }}>
            {/* KPI Cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12, marginBottom:22 }}>
              {[
                { label:"Total vulnerabilities", value:metrics.totalVulns,      icon:<AlertTriangle size={17}/>, color:T.amber },
                { label:"Critical issues",        value:metrics.critCount,       icon:<AlertTriangle size={17}/>, color:T.red,   alert:metrics.critCount>0 },
                { label:"Avg risk score",         value:`${metrics.avgRisk}/100`,icon:<Activity size={17}/>,      color:T.blue  },
                { label:"Scans completed",        value:metrics.completedScans,  icon:<CheckCircle2 size={17}/>,  color:T.green },
                { label:"Total scans",            value:metrics.totalScans,      icon:<Globe size={17}/>,         color:T.teal  },
              ].map(({ label, value, icon, color, alert }) => (
                <div key={label} style={{
                  background:T.card, borderRadius:10,
                  border:`1px solid ${alert ? color+"55" : T.border}`,
                  padding:"15px 17px",
                  boxShadow: alert ? `0 0 18px ${color}22` : "none",
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:11 }}>
                    <span style={{ color }}>{icon}</span>
                    <span style={{ fontSize:12, color:T.muted }}>{label}</span>
                  </div>
                  <p style={{ fontFamily:T.font, fontSize:24, fontWeight:600, color: alert?color:T.text, margin:0, lineHeight:1 }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
 
            {/* Charts */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:14, marginBottom:22 }}>
              {/* Area trend */}
              <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:10, padding:"16px 16px 8px" }}>
                <p style={{ fontFamily:T.font, fontSize:11, color:T.muted, letterSpacing:"0.07em", margin:"0 0 14px" }}>24-HOUR RISK TREND</p>
                <ResponsiveContainer width="100%" height={190}>
                  <AreaChart data={TREND}>
                    <defs>
                      <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={T.blue} stopOpacity={0.35}/>
                        <stop offset="95%" stopColor={T.blue} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={T.faint}/>
                    <XAxis dataKey="label" tick={{ fontFamily:T.font, fontSize:10, fill:T.muted }}/>
                    <YAxis tick={{ fontFamily:T.font, fontSize:10, fill:T.muted }} domain={[0,100]}/>
                    <Tooltip content={<ChartTip suffix="/100"/>}/>
                    <Area type="monotone" dataKey="risk" name="Risk score" stroke={T.blue} fill="url(#rg)" strokeWidth={2} dot={false} isAnimationActive={false}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
 
              {/* Donut */}
              <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:10, padding:"16px 16px 8px" }}>
                <p style={{ fontFamily:T.font, fontSize:11, color:T.muted, letterSpacing:"0.07em", margin:"0 0 14px" }}>VULNERABILITY DISTRIBUTION</p>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <ResponsiveContainer width="55%" height={180}>
                    <PieChart>
                      <Pie data={riskDist} dataKey="value" innerRadius={48} outerRadius={70} paddingAngle={3} isAnimationActive={false}>
                        {riskDist.map(e => <Cell key={e.name} fill={RISK_COLOR[e.name]}/>)}
                      </Pie>
                      <Tooltip content={<ChartTip/>}/>
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ flex:1, display:"flex", flexDirection:"column", gap:9 }}>
                    {riskDist.map(({ name, value }) => (
                      <div key={name} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                          <span style={{ width:9, height:9, borderRadius:2, background:RISK_COLOR[name], display:"inline-block" }}/>
                          <span style={{ fontSize:12, color:T.muted }}>{name}</span>
                        </div>
                        <span style={{ fontFamily:T.font, fontSize:13, fontWeight:600, color:RISK_COLOR[name] }}>{value}</span>
                      </div>
                    ))}
                    {riskDist.length===0 && <span style={{ fontSize:12, color:T.muted }}>No data</span>}
                  </div>
                </div>
              </div>
 
              {/* Bar */}
              <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:10, padding:"16px 16px 8px" }}>
                <p style={{ fontFamily:T.font, fontSize:11, color:T.muted, letterSpacing:"0.07em", margin:"0 0 14px" }}>SCAN RISK SCORES</p>
                <ResponsiveContainer width="100%" height={190}>
                  <BarChart layout="vertical" data={filteredScans.filter(s=>s.riskScore>0).map(s=>({
                    url: s.targetUrl.slice(0,18),
                    score: s.riskScore,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke={T.faint} horizontal={false}/>
                    <XAxis type="number" domain={[0,100]} tick={{ fontFamily:T.font, fontSize:10, fill:T.muted }}/>
                    <YAxis dataKey="url" type="category" width={108} tick={{ fontFamily:T.font, fontSize:10, fill:T.muted }}/>
                    <Tooltip content={<ChartTip suffix="/100"/>}/>
                    <Bar dataKey="score" name="Risk score" radius={3} isAnimationActive={false}>
                      {filteredScans.filter(s=>s.riskScore>0).map(s=>(
                        <Cell key={s.id} fill={s.riskScore>=70?T.red:s.riskScore>=40?T.amber:T.green}/>
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
 
            {/* Recent scans mini-list */}
            <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:10, padding:"16px 18px" }}>
              <p style={{ fontFamily:T.font, fontSize:11, color:T.muted, letterSpacing:"0.07em", margin:"0 0 14px" }}>RECENT SCANS</p>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {filteredScans.slice(0,5).map(scan => (
                  <div key={scan.id}
                    onMouseEnter={()=>setHoveredScan(scan.id)}
                    onMouseLeave={()=>setHoveredScan(null)}
                    style={{
                      display:"flex", alignItems:"center", justifyContent:"space-between",
                      padding:"10px 14px", borderRadius:8,
                      border:`1px solid ${hoveredScan===scan.id ? T.borderHi : T.border}`,
                      background: hoveredScan===scan.id ? T.faint : T.surface,
                      transition:"background .14s, border-color .14s",
                    }}
                  >
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <Globe size={14} color={T.muted}/>
                      <div>
                        <p style={{ margin:0, fontFamily:T.font, fontSize:13 }}>{scan.targetUrl}</p>
                        <p style={{ margin:0, fontSize:11, color:T.muted, marginTop:2 }}>{timeAgo(scan.createdAt)}</p>
                      </div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:18 }}>
                      {scan.riskScore>0 && (
                        <span style={{
                          fontFamily:T.font, fontSize:13, fontWeight:600,
                          color: scan.riskScore>=70?T.red:scan.riskScore>=40?T.amber:T.green,
                        }}>{scan.riskScore}/100</span>
                      )}
                      <StatusDot status={scan.status}/>
                    </div>
                  </div>
                ))}
                {filteredScans.length===0 && <p style={{ color:T.muted, fontSize:13, margin:0 }}>No scans match the current filter.</p>}
              </div>
            </div>
          </div>
        )}
 
        {/* ─── SCANS TAB ─── */}
        {tab==="scans" && (
          <div style={{ animation:"fadeIn .3s ease", overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${T.border}` }}>
                  {["Target URL","Status","Risk score","Vulnerabilities","Started"].map(h=>(
                    <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontFamily:T.font, fontSize:11, color:T.muted, letterSpacing:"0.06em", fontWeight:600 }}>
                      {h.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredScans.map(scan=>(
                  <tr key={scan.id} className="og-row"
                    onMouseEnter={()=>setHoveredScan(scan.id)}
                    onMouseLeave={()=>setHoveredScan(null)}
                    style={{ borderBottom:`1px solid ${T.faint}`, background: hoveredScan===scan.id?T.faint:"transparent", transition:"background .12s" }}
                  >
                    <td style={{ padding:"13px 16px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <Globe size={13} color={T.muted}/>
                        <span style={{ fontFamily:T.font, fontSize:13 }}>{scan.targetUrl}</span>
                      </div>
                    </td>
                    <td style={{ padding:"13px 16px" }}><StatusDot status={scan.status}/></td>
                    <td style={{ padding:"13px 16px" }}>
                      {scan.riskScore>0 ? (
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div style={{ width:76, height:5, background:T.faint, borderRadius:3, overflow:"hidden" }}>
                            <div style={{ height:"100%", width:`${scan.riskScore}%`, background: scan.riskScore>=70?T.red:scan.riskScore>=40?T.amber:T.green, borderRadius:3 }}/>
                          </div>
                          <span style={{ fontFamily:T.font, fontSize:12, fontWeight:600, color: scan.riskScore>=70?T.red:scan.riskScore>=40?T.amber:T.green }}>{scan.riskScore}</span>
                        </div>
                      ) : <span style={{ color:T.muted }}>—</span>}
                    </td>
                    <td style={{ padding:"13px 16px", fontFamily:T.font, color:T.muted }}>{scan.vulnCount>0?scan.vulnCount:"—"}</td>
                    <td style={{ padding:"13px 16px", color:T.muted, fontSize:12 }}>{timeAgo(scan.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredScans.length===0 && <p style={{ padding:"24px 16px", color:T.muted, fontSize:13 }}>No scans match the current filter.</p>}
          </div>
        )}
 
        {/* ─── VULNS TAB ─── */}
        {tab==="vulns" && (
          <div style={{ animation:"fadeIn .3s ease" }}>
            {/* Hover detail card */}
            {hoveredVulnData ? (
              <div style={{
                background:T.card, borderRadius:10, padding:"14px 18px", marginBottom:14,
                border:`1px solid ${RISK_COLOR[hoveredVulnData.risk]}55`,
                borderLeft:`3px solid ${RISK_COLOR[hoveredVulnData.risk]}`,
                animation:"fadeIn .18s ease",
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:7 }}>
                  <Info size={14} color={RISK_COLOR[hoveredVulnData.risk]}/>
                  <span style={{ fontWeight:600, fontSize:14 }}>{hoveredVulnData.name}</span>
                  <RiskBadge risk={hoveredVulnData.risk} small/>
                </div>
                <p style={{ margin:"0 0 6px", color:T.muted, fontSize:13 }}>{hoveredVulnData.description}</p>
                <p style={{ margin:0, fontSize:12 }}>
                  <span style={{ color:T.muted }}>Affected: </span>
                  <code style={{ fontFamily:T.font, fontSize:12, color:T.blue, background:T.blueDim, padding:"2px 6px", borderRadius:3 }}>{hoveredVulnData.url}</code>
                  <span style={{ color:T.muted, marginLeft:14 }}>Fix: </span>
                  <span style={{ color:T.green }}>{hoveredVulnData.solution}</span>
                </p>
              </div>
            ) : (
              <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:8, padding:"9px 14px", marginBottom:14, display:"flex", alignItems:"center", gap:7 }}>
                <Eye size={13} color={T.muted}/>
                <span style={{ fontSize:12, color:T.muted }}>Hover over any row to see full vulnerability details.</span>
              </div>
            )}
 
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                <thead>
                  <tr style={{ borderBottom:`1px solid ${T.border}` }}>
                    {["Vulnerability","Risk","Affected URL","Solution"].map(h=>(
                      <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontFamily:T.font, fontSize:11, color:T.muted, letterSpacing:"0.06em", fontWeight:600 }}>
                        {h.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredVulns.map(v=>(
                    <tr key={v.id} className="og-row"
                      onMouseEnter={()=>setHoveredVuln(v.id)}
                      onMouseLeave={()=>setHoveredVuln(null)}
                      style={{ borderBottom:`1px solid ${T.faint}`, background: hoveredVuln===v.id?T.faint:"transparent", transition:"background .12s" }}
                    >
                      <td style={{ padding:"13px 16px", fontWeight:500 }}>{v.name}</td>
                      <td style={{ padding:"13px 16px" }}><RiskBadge risk={v.risk}/></td>
                      <td style={{ padding:"13px 16px" }}>
                        <code style={{ fontFamily:T.font, fontSize:12, color:T.blue, background:T.blueDim, padding:"2px 6px", borderRadius:3 }}>{v.url}</code>
                      </td>
                      <td style={{ padding:"13px 16px", color:T.muted }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <ChevronRight size={13} color={T.green}/>
                          {v.solution}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredVulns.length===0 && <p style={{ padding:"24px 16px", color:T.muted, fontSize:13 }}>No vulnerabilities match the current risk filter.</p>}
            </div>
          </div>
        )}
 
      </div>
    </div>
  );
}
 
