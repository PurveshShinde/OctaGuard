import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Search, 
  Settings, 
  History, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Search, label: 'New Scan', path: '/new-scan' },
    { icon: ShieldAlert, label: 'Vulnerabilities', path: '/vulnerabilities' },
    { icon: History, label: 'Scan History', path: '/history' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="w-64 border-r border-white/5 bg-zinc-950 flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">OctaGuard</h1>
            <p className="text-[10px] uppercase tracking-widest text-accent font-semibold">Cyber Security</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group
                ${isActive 
                  ? 'bg-accent/10 text-accent' 
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'}
              `}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-white/5">
        <div className="bg-gradient-to-br from-accent/20 to-violet-600/10 p-4 rounded-xl border border-accent/20">
          <p className="text-sm font-semibold text-white mb-1">Pro Plan</p>
          <p className="text-xs text-zinc-400 mb-3">Unlimited scans and premium support.</p>
          <button className="w-full bg-accent text-white text-xs font-bold py-2 rounded-lg hover:bg-accent/90 transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
