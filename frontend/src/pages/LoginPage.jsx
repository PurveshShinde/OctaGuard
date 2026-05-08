import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, ChevronRight } from 'lucide-react';
import Button from '../components/Button';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // In Phase 1, we just redirect to the dashboard placeholder
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">OctaGuard</span>
          </Link>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
          <p className="text-zinc-400">Secure access to your security dashboard</p>
        </div>

        <div className="glass rounded-2xl p-8 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-zinc-400">Password</label>
                <Link to="#" className="text-xs text-accent hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                />
              </div>
            </div>

            <Button className="w-full py-3 text-lg flex items-center justify-center gap-2">
              Sign In <ChevronRight className="w-5 h-5" />
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-zinc-500 text-sm">
              Don't have an account? {' '}
              <Link to="/register" className="text-accent font-semibold hover:underline">Sign up for free</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
