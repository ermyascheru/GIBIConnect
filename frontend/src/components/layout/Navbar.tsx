import React from 'react';

export type PublicNavView = 'home' | 'about' | 'services' | 'contact' | 'auth';

interface NavbarProps {
  currentView: PublicNavView | 'platform';
  onNavigate: (view: PublicNavView) => void;
  onGetStarted: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onGetStarted }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2 group text-left">
          <span className="w-8 h-8 rounded-lg bg-[#0C373D] text-white font-bold flex items-center justify-center text-sm tracking-tight group-hover:bg-[#4E9F9F] transition-colors">
            G
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            GIBI<span className="text-[#4E9F9F]">Connect</span>
          </span>
        </button>

        {/* Clean Public Nav Links: HOME, ABOUT, SERVICES, CONTACT */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-600">
          <button
            onClick={() => onNavigate('home')}
            className={`transition-colors ${currentView === 'home' ? 'text-slate-950 font-bold border-b-2 border-slate-950 pb-0.5' : 'hover:text-slate-950'}`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('about')}
            className={`transition-colors ${currentView === 'about' ? 'text-slate-950 font-bold border-b-2 border-slate-950 pb-0.5' : 'hover:text-slate-950'}`}
          >
            About
          </button>
          <button
            onClick={() => onNavigate('services')}
            className={`transition-colors ${currentView === 'services' ? 'text-slate-950 font-bold border-b-2 border-slate-950 pb-0.5' : 'hover:text-slate-950'}`}
          >
            Services
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className={`transition-colors ${currentView === 'contact' ? 'text-slate-950 font-bold border-b-2 border-slate-950 pb-0.5' : 'hover:text-slate-950'}`}
          >
            Contact
          </button>
        </nav>

        {/* Right Actions: Sign In & Get Started */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('auth')}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3.5 py-1.5 rounded-lg hover:bg-slate-100 transition-all"
          >
            Sign In
          </button>
          <button 
            onClick={onGetStarted}
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-[#5AA7A7] hover:bg-[#479393] text-white font-bold transition-all shadow-sm cursor-pointer"
          >
            Get Started
          </button>
        </div>

      </div>
    </header>
  );
};