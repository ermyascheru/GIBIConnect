import React, { useState } from 'react';
import Button from '../common/Button';
import Badge from '../common/Badge';

const Navbar = ({
  user = null,
  activeRoute = '/',
  onNavigate,
  onLogout,
  isDarkMode = false,
  onToggleTheme
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Institutions', path: '/institutions' },
    { label: 'Programs', path: '/programs' },
    { label: 'Scholarships', path: '/scholarships' },
    { label: 'Admissions', path: '/admissions' },
    { label: 'Compare', path: '/compare' },
    { label: 'Resources', path: '/resources' },
    { 
      label: 'AI Consultant', 
      path: '/ai', 
      badge: <Badge variant="primary" size="sm">AI</Badge> 
    }
  ];

  const handleLinkClick = (path) => {
    setIsMobileMenuOpen(false);
    onNavigate?.(path);
  };

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b shadow-xs transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-slate-950/95 border-slate-800 text-white' 
        : 'bg-white/95 border-slate-200 text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => handleLinkClick('/')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <img
                src="/logo.jpg"
                alt="GIBI-Connect Logo"
                className={`w-10 h-10 rounded-xl object-cover border shadow-xs group-hover:scale-105 transition-transform ${
                  isDarkMode ? 'border-slate-700' : 'border-slate-200'
                }`}
              />
              <div>
                <span className={`text-lg font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  GIBI-<span className="text-blue-500">Connect</span>
                </span>
                <span className="block text-[10px] text-slate-400 -mt-1 font-medium tracking-tight">
                  Higher Education Portal
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = activeRoute === link.path || (link.path !== '/' && activeRoute.startsWith(link.path));
                return (
                  <button
                    key={link.path}
                    onClick={() => handleLinkClick(link.path)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? isDarkMode ? 'text-blue-400 bg-blue-950/60 font-bold border border-blue-900/50' : 'text-blue-600 bg-blue-50 font-bold'
                        : isDarkMode ? 'text-slate-300 hover:text-white hover:bg-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {link.label}
                    {link.badge}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Action: White/Black Theme Switch & Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* White and Black Turning Model (Theme Switcher) */}
            <button
              type="button"
              onClick={onToggleTheme}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-700 text-amber-300 hover:bg-slate-800'
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
              }`}
              title={isDarkMode ? 'Switch to White (Light) Mode' : 'Switch to Black (Dark) Mode'}
            >
              {isDarkMode ? (
                <>
                  <svg className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[11px] font-bold text-slate-200">White Mode</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 text-slate-700 fill-slate-700" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                  <span className="text-[11px] font-bold text-slate-800">Black Mode</span>
                </>
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-800/20 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center border border-blue-200">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{user.name || 'Account'}</span>
                </button>

                {isUserMenuOpen && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg border py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 ${
                    isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}>
                    <div className={`px-4 py-2 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                      <p className="text-xs font-semibold truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => { setIsUserMenuOpen(false); onLogout?.(); }}
                      className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-500/10 font-semibold cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLinkClick('/login')}
                  className={isDarkMode ? 'text-slate-200 hover:text-white hover:bg-slate-800' : ''}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleLinkClick('/register')}
                >
                  Register
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button & Mobile Theme Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={onToggleTheme}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center transition-all cursor-pointer ${
                isDarkMode ? 'bg-slate-900 border-slate-700 text-amber-300' : 'bg-slate-100 border-slate-300 text-slate-700'
              }`}
              title="Toggle Theme"
            >
              {isDarkMode ? (
                <svg className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-slate-700 fill-slate-700" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg cursor-pointer ${
                isDarkMode ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className={`lg:hidden border-t px-4 pt-2 pb-4 space-y-1 ${
          isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleLinkClick(link.path)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
                isDarkMode ? 'text-slate-300 hover:bg-slate-900 hover:text-white' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{link.label}</span>
              {link.badge}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-700/40 flex gap-2">
            <Button variant="outline" size="sm" className="w-full" onClick={() => handleLinkClick('/login')}>
              Sign In
            </Button>
            <Button variant="primary" size="sm" className="w-full" onClick={() => handleLinkClick('/register')}>
              Register
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
