import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Target, FileText, Zap, ChevronRight, Github } from 'lucide-react';
import Button from '../components/Button';

const LandingPage = () => {
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
          <span>PHASE 1 NOW LIVE</span>
        </div>

        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tighter mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent leading-tight">
          Secure Your Web Assets <br /> With Precision.
        </h1>

        <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Advanced vulnerability scanning powered by OWASP ZAP. Get comprehensive reports and actionable insights to stay ahead of threats.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button to="/register" className="px-8 py-4 text-lg h-auto flex items-center gap-2">
            Start Free Scan <ChevronRight className="w-5 h-5" />
          </Button>
          <Button variant="outline" className="px-8 py-4 text-lg h-auto flex items-center gap-2">
            <Github className="w-5 h-5" /> View on GitHub
          </Button>
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
