import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Target, 
  AlertTriangle, 
  Activity, 
  ArrowUpRight, 
  ExternalLink,
  Plus,
  ChevronRight,
  Loader2,
  Globe,
  Search,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { scansService } from '../services/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  // ... (rest of state)
  const [isScanning, setIsScanning] = useState(false);
  const [scans, setScans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchScans = async () => {
    try {
      const data = await scansService.getScans();
      setScans(data);
    } catch (error) {
      toast.error('Failed to fetch scans');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchScans();
  }, []);

  const handleScanSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;

    setIsScanning(true);
    toast.info('Initiating lightweight security scan...');

    try {
      const result = await scansService.submitScan(url);
      toast.success('Scan completed successfully!');
      setUrl('');
      setScans([result, ...scans]);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Scan failed');
    } finally {
      setIsScanning(false);
    }
  };

  const calculateStats = () => {
    if (scans.length === 0) return { total: 0, vulnerabilities: 0, activeAlerts: 0, avgScore: 0 };
    
    const vulnerabilities = scans.reduce((acc, scan) => acc + (scan?._count?.vulnerabilities || 0), 0);
    const highRisks = scans.filter(s => s.riskScore > 70).length;
    const avgScore = Math.round(scans.reduce((acc, scan) => acc + scan.riskScore, 0) / scans.length);

    return {
      total: scans.length,
      vulnerabilities,
      activeAlerts: highRisks,
      avgScore
    };
  };

  const stats = calculateStats();

  const statCards = [
    { label: 'Total Scans', value: stats.total, icon: Target, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Vulnerabilities', value: stats.vulnerabilities, icon: Shield, color: 'text-red-500', bg: 'bg-red-500/10' },
    { label: 'High Risk Scans', value: stats.activeAlerts, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Security Score', value: `${stats.avgScore}%`, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & New Scan Form */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-white tracking-tight">Security Overview</h2>
          <p className="text-zinc-400 mb-6">Welcome back! Manage and monitor your web asset security.</p>
          
          <form onSubmit={handleScanSubmit} className="relative max-w-2xl group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Globe className="h-5 w-5 text-zinc-500 group-focus-within:text-accent transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Enter target URL (e.g., https://example.com)"
              className="block w-full bg-zinc-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-32 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-all"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isScanning}
            />
            <div className="absolute inset-y-2 right-2">
              <Button 
                type="submit" 
                disabled={isScanning || !url}
                className="h-full px-6 rounded-xl font-bold shadow-lg shadow-accent/20"
              >
                {isScanning ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Scanning...
                  </div>
                ) : (
                  'Start Scan'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <Card key={i} className="relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} blur-3xl -mr-8 -mt-8 rounded-full opacity-50 group-hover:opacity-80 transition-opacity`}></div>
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-zinc-500 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-white tracking-tight">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Scans Table */}
        <Card title="Recent Activity" className="lg:col-span-2" subtitle="Monitor your latest security audits">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
              <p className="text-zinc-500 text-sm">Loading security records...</p>
            </div>
          ) : scans.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center gap-4 border-2 border-dashed border-white/5 rounded-2xl mt-4">
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-600">
                <Search className="w-8 h-8" />
              </div>
              <div className="text-center">
                <p className="text-white font-medium">No scans yet</p>
                <p className="text-zinc-500 text-sm">Submit your first URL above to start scanning.</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-zinc-500 text-xs uppercase tracking-wider">
                    <th className="pb-3 font-medium">Target Asset</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Risk Score</th>
                    <th className="pb-3 font-medium text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {scans.map((scan) => (
                    <tr 
                      key={scan.id} 
                      className="group hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => navigate(`/scans/${scan.id}`)}
                    >
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center">
                            <Globe className="w-4 h-4 text-zinc-400" />
                          </div>
                          <span className="font-medium text-zinc-200 truncate max-w-[200px]">{scan.targetUrl}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight flex w-fit items-center gap-1
                          ${scan.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 
                            scan.status === 'failed' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}
                        `}>
                          {scan.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> : 
                           scan.status === 'failed' ? <XCircle className="w-3 h-3" /> : 
                           <Loader2 className="w-3 h-3 animate-spin" />}
                          {scan.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 w-16 bg-zinc-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${scan.riskScore > 70 ? 'bg-red-500' : scan.riskScore > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              style={{ width: `${scan.riskScore}%` }}
                            ></div>
                          </div>
                          <span className={`font-bold text-sm ${scan.riskScore > 70 ? 'text-red-500' : scan.riskScore > 30 ? 'text-amber-500' : 'text-emerald-500'}`}>
                            {scan.riskScore}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-right text-xs text-zinc-500">
                        {scan?.createdAt ? new Date(scan.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Info Card */}
        <Card title="Quick Tips" subtitle="How to improve your score">
          <div className="space-y-4 mt-6">
            {[
              { title: 'Enable HTTPS', desc: 'Secure your site with SSL/TLS.', icon: Shield },
              { title: 'Setup CSP', desc: 'Prevent XSS attacks.', icon: Activity },
              { title: 'HSTS Header', desc: 'Force secure connections.', icon: Target },
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-xl bg-zinc-900/30 border border-white/5">
                <div className="p-2 rounded-lg bg-accent/10 text-accent">
                  <tip.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-200">{tip.title}</p>
                  <p className="text-xs text-zinc-500">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-accent/20 to-violet-600/10 border border-accent/20">
            <p className="text-xs text-zinc-300 leading-relaxed">
              <strong>Phase 2 Note:</strong> This scanner performs lightweight header checks and technology detection. Integrated tools (ZAP) are coming in Phase 3.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
