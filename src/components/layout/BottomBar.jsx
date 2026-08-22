import React, { useState, useEffect } from 'react';

export default function BottomBar({
  onNavigate,
  isDarkMode = true,
  onToggleTheme
}) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5">
      {/* Floating Bottom Quick AI Action Button */}
      <button
        onClick={() => onNavigate('/ai')}
        className={`px-4 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer border ${
          isDarkMode
            ? 'bg-blue-600 hover:bg-blue-500 text-white border-blue-400/30'
            : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-700'
        }`}
        title="Consult GIBI-Connect AI Advisor"
      >
        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
        <span>Ask AI Advisor</span>
      </button>

      {/* Floating Bottom Theme Switch Button */}
      <button
        onClick={onToggleTheme}
        className={`p-2.5 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer border ${
          isDarkMode
            ? 'bg-slate-900/90 hover:bg-slate-800 text-amber-300 border-slate-700'
            : 'bg-white/95 hover:bg-slate-100 text-slate-800 border-slate-300'
        }`}
        title={isDarkMode ? 'Switch to White Mode' : 'Switch to Black Mode'}
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

      {/* Floating Scroll To Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className={`p-2.5 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer border ${
            isDarkMode
              ? 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700'
              : 'bg-white/95 hover:bg-slate-100 text-slate-700 border-slate-300'
          }`}
          title="Scroll to Top"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
}
