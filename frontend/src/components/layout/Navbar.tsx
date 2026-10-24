import React from 'react';
import { UserProfileDropdown } from './UserProfileDropdown';

export type PublicNavView = 'home' | 'about' | 'services' | 'contact' | 'auth';

interface NavbarProps {
  currentView: PublicNavView | 'platform';
  onNavigate: (view: PublicNavView) => void;
  onGetStarted: () => void;
  currentUser?: { email?: string; full_name?: string } | null;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onGetStarted,
  currentUser,
  onSignOut,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#EBF4F7]/90 backdrop-blur-md border-b border-[#D8E8EC]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5 group text-left cursor-pointer">
          <img
            src="/images/brand/gibiconnect-icon.png"
            alt="GIBIConnect"
            className="w-8 h-8 object-contain rounded-lg shadow-xs group-hover:scale-105 transition-transform"
          />
          <span className="text-lg font-bold tracking-tight text-[#0F172A]">
            GIBI<span className="text-[#0D9488]">Connect</span>
          </span>
        </button>

        {/* Clean Public Nav Links: HOME, ABOUT, SERVICES, CONTACT */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
          <button
            onClick={() => onNavigate('home')}
            className={`transition-colors cursor-pointer ${currentView === 'home' ? 'text-[#0C373D] font-bold border-b-2 border-[#0C373D] pb-0.5' : 'hover:text-[#0F172A]'}`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('about')}
            className={`transition-colors cursor-pointer ${currentView === 'about' ? 'text-[#0C373D] font-bold border-b-2 border-[#0C373D] pb-0.5' : 'hover:text-[#0F172A]'}`}
          >
            About
          </button>
          <button
            onClick={() => onNavigate('services')}
            className={`transition-colors cursor-pointer ${currentView === 'services' ? 'text-[#0C373D] font-bold border-b-2 border-[#0C373D] pb-0.5' : 'hover:text-[#0F172A]'}`}
          >
            Features
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className={`transition-colors cursor-pointer ${currentView === 'contact' ? 'text-[#0C373D] font-bold border-b-2 border-[#0C373D] pb-0.5' : 'hover:text-[#0F172A]'}`}
          >
            Contact
          </button>
        </nav>

        {/* Right Actions: Sign In / User & Get Started */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <UserProfileDropdown
              user={currentUser}
              onSignOut={onSignOut || (() => {})}
              onNavigateToView={onNavigate}
              onNavigateToTab={(tab) => {
                if (tab) onGetStarted();
              }}
            />
          ) : (
            <button 
              onClick={() => onNavigate('auth')}
              className="text-xs font-semibold text-[#0F172A] hover:text-[#0C373D] px-3.5 py-1.5 rounded-lg hover:bg-white/60 transition-all cursor-pointer"
            >
              Sign In
            </button>
          )}
          <button 
            onClick={onGetStarted}
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-[#5AA7A7] hover:bg-[#4E9F9F] text-white font-bold transition-all shadow-sm cursor-pointer"
          >
            Get Started
          </button>
        </div>

      </div>
    </header>
  );
};