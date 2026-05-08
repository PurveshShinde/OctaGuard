import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Shield, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Globe, 
  ChevronRight,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { scansService } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import { toast } from 'sonner';

const ScanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scan, setScan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await scansService.getScanDetails(id);
        setScan(data);
      } catch (error) {
        toast.error('Failed to load scan details');
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
        <p className="text-zinc-400">Analyzing scan results...</p>
      </div>
    );
  }

  if (!scan) return null;

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" className="p-2 h-auto">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Scan Results
              <span className={`text-xs px-2 py-0.5 rounded-full uppercase
                ${scan.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}
              `}>
                {scan.status}
              </span>
            </h2>
            <p className="text-zinc-500 flex items-center gap-2 text-sm mt-1">
              <Globe className="w-3 h-3" /> {scan.targetUrl}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm text-zinc-500">
          <Clock className="w-4 h-4" />
          {scan?.createdAt ? new Date(scan.createdAt).toLocaleString() : 'N/A'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Risk Score Summary */}
        <Card className="lg:col-span-1">
          <div className="text-center py-6">
            <div className="relative inline-flex mb-6">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-zinc-800"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={364.4}
                  strokeDashoffset={364.4 - (364.4 * (scan?.riskScore || 0)) / 100}
                  className={`${(scan?.riskScore || 0) > 70 ? 'text-red-500' : (scan?.riskScore || 0) > 30 ? 'text-amber-500' : 'text-emerald-500'} transition-all duration-1000`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{scan.riskScore}</span>
                <span className="text-[10px] uppercase text-zinc-500">Risk Score</span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              {scan.riskScore > 70 ? 'High Risk' : scan.riskScore > 30 ? 'Medium Risk' : 'Low Risk'}
            </h3>
            <p className="text-sm text-zinc-500 px-4">
              We found {scan?.vulnerabilities?.length || 0} security issues that need your attention.
            </p>
          </div>
        </Card>

        {/* Vulnerabilities List */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-white mb-4">Findings & Recommendations</h3>
          
          {!scan?.vulnerabilities || scan.vulnerabilities.length === 0 ? (
            <Card className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle className="w-12 h-12 text-emerald-500 mb-4" />
              <p className="text-white font-medium">No vulnerabilities found!</p>
              <p className="text-sm text-zinc-500 mt-1">Your site follows basic security best practices.</p>
            </Card>
          ) : (
            scan.vulnerabilities.map((vuln, i) => (
              <Card key={vuln.id} className="border-l-4 border-l-transparent hover:border-l-accent transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg 
                      ${vuln.risk === 'high' ? 'bg-red-500/10 text-red-500' : 
                        vuln.risk === 'medium' ? 'bg-amber-500/10 text-amber-500' : 
                        'bg-blue-500/10 text-blue-500'}
                    `}>
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white group-hover:text-accent transition-colors">{vuln.name}</h4>
                      <span className={`text-[10px] font-bold uppercase tracking-widest
                        ${vuln.risk === 'high' ? 'text-red-500' : 
                          vuln.risk === 'medium' ? 'text-amber-500' : 
                          'text-blue-500'}
                      `}>
                        {vuln.risk} Severity
                      </span>
                    </div>
                  </div>
                  <a href={vuln.url} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-white transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                
                <p className="text-sm text-zinc-400 mb-4 leading-relaxed">
                  {vuln.description}
                </p>

                <div className="bg-zinc-900/50 rounded-xl p-4 border border-white/5">
                  <p className="text-xs font-bold text-zinc-300 uppercase mb-2 flex items-center gap-2">
                    <ChevronRight className="w-3 h-3 text-accent" /> Recommendation
                  </p>
                  <p className="text-sm text-zinc-400">{vuln.solution}</p>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ScanDetails;
