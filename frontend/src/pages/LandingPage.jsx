import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Target, FileText, Zap, ChevronRight, Github, Globe, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import { scansService } from '../services/api';
import { toast } from 'sonner';

const LandingPage = () => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const navigate = useNavigate();

  const handleQuickScan = async (e) => {
    e.preventDefault();
    if (!url) return;

    setIsScanning(true);
    setScanResult(null);
    toast.info('Initiating quick security check...');

    try {
      const result = await scansService.submitScan(url);
      toast.success('Scan completed!');
      setScanResult(result);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Scan failed. Please try a valid public URL.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white selection:bg-accent/30">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">OctaGuard</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Login</Link>
          <Button to="/register" size="sm">Get Started</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-24 pb-32 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/20 blur-[120px] -z-10 rounded-full opacity-50"></div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold mb-8 animate-fade-in">
          <Zap className="w-3 h-3" />
          <span>PHASE 2 LIVE - TRY NOW</span>
        </div>

        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tighter mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent leading-tight">
          Secure Your Web Assets <br /> With Precision.
        </h1>

        <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Instantly check your website for common security header and SSL misconfigurations. 
          Get actionable insights to stay ahead of threats.
        </p>

        {/* Quick Scan UI */}
        <div className="max-w-xl mx-auto mb-12">
          <form onSubmit={handleQuickScan} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Globe className="h-5 w-5 text-zinc-500 group-focus-within:text-accent transition-colors" />
            </div>
            <input
              type="text"
              placeholder="https://example.com"
              className="block w-full bg-zinc-900/50 border border-white/10 rounded-2xl py-5 pl-12 pr-36 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all shadow-2xl"
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
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">Scan Free <ChevronRight className="w-4 h-4" /></span>
                )}
              </Button>
            </div>
          </form>

          {/* Quick Result Summary */}
          {scanResult && (
            <div className="mt-8 p-6 rounded-2xl bg-zinc-900/80 border border-accent/20 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center justify-between mb-6">
                <div className="text-left">
                  <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-1">Scan Result for</p>
                  <p className="text-sm font-medium text-white truncate max-w-[250px]">{scanResult.targetUrl}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-1">Risk Score</p>
                  <p className={`text-2xl font-black ${scanResult.riskScore > 70 ? 'text-red-500' : scanResult.riskScore > 30 ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {scanResult.riskScore}/100
                  </p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                {scanResult.vulnerabilities?.slice(0, 2).map((vuln, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-left">
                    <div className={`p-1.5 rounded-lg ${vuln.risk === 'high' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-medium text-zinc-300">{vuln.name}</p>
                  </div>
                ))}
                {scanResult.vulnerabilities?.length > 2 && (
                  <p className="text-[10px] text-zinc-500 font-medium">+ {scanResult.vulnerabilities.length - 2} more issues found</p>
                )}
                {scanResult.vulnerabilities?.length === 0 && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-left">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <p className="text-xs font-medium text-emerald-500">No major header issues detected!</p>
                  </div>
                )}
              </div>

              <Button to="/register" className="w-full py-3 text-sm flex items-center justify-center gap-2">
                Get Full Detailed Report <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {!scanResult && (
            <p className="text-[10px] text-zinc-600 mt-3 uppercase tracking-widest font-bold">
              No credit card or sign-in required for your first scan
            </p>
          )}
        </div>

        <div className="flex items-center justify-center gap-8 pt-4 grayscale opacity-40">
          <Github className="w-6 h-6" />
          <span className="font-bold tracking-tighter text-xl italic">OPEN SOURCE</span>
          <Shield className="w-6 h-6" />
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: Target,
            title: "Automated Scanning",
            desc: "Full OWASP ZAP integration for deep security analysis of your web applications."
          },
          {
            icon: Shield,
            title: "Real-time Protection",
            desc: "Monitor your assets continuously and get alerted when new vulnerabilities are found."
          },
          {
            icon: FileText,
            title: "Detailed Reports",
            desc: "Comprehensive vulnerability reports with remediation steps and risk scores."
          }
        ].map((feature, i) => (
          <div key={i} className="p-8 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-accent/30 transition-all group">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-white/5 text-center text-zinc-500 text-sm">
        <p>&copy; 2026 OctaGuard Security. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
