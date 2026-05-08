import React from 'react';
import { Bell, Search, User } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="h-16 border-b border-white/5 bg-background/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search assets, scans, vulnerabilities..." 
            className="w-full bg-zinc-900/50 border border-white/5 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 text-zinc-400 hover:text-white transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border-2 border-background"></span>
        </button>
        <div className="h-8 w-px bg-white/5 mx-2"></div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-zinc-500">Security Engineer</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent">
            <User className="w-6 h-6" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
