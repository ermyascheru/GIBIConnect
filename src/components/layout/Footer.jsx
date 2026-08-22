import React, { useState } from 'react';

const Footer = ({ onNavigate }) => {
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  const handleLinkClick = (path) => {
    onNavigate?.(path);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setFeedbackSent(true);
      setTimeout(() => setFeedbackSent(false), 4000);
      setEmailInput('');
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 text-sm mt-auto relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        
        {/* Main Grid: 5 Columns for Brand, Pages, Academic Tools, Contact Info, and Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.jpg"
                alt="GIBI-Connect Logo"
                className="w-10 h-10 rounded-xl object-cover border border-slate-700 shadow-xs"
              />
              <div>
                <span className="text-lg font-bold text-white tracking-tight">
                  GIBI-<span className="text-blue-500">Connect</span>
                </span>
                <span className="block text-[10px] text-slate-400 -mt-1 font-medium">Higher Education Portal</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering Ethiopian students with verified higher education intelligence, university curricula, admission cutoffs, scholarships, and AI consultation.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span>Verified Higher Education</span>
            </div>
          </div>

          {/* Col 2: All Website Pages */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-2">
              Website Pages
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleLinkClick('/')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('/institutions')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">
                  Institutions Directory
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('/programs')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">
                  Academic Degree Programs
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('/scholarships')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">
                  Scholarships & Grants
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('/admissions')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">
                  Admissions & Cutoffs
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('/compare')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">
                  Comparison Matrix
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('/resources')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">
                  Educational Resources
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('/ai')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">
                  AI Educational Advisor
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Student Account & Portals */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-2">
              Portals & Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleLinkClick('/login')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">
                  Student Sign In
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('/register')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">
                  Register New Account
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('/institutions')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">
                  Public Universities
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('/institutions')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">
                  Private Accredited Colleges
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('/resources')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">
                  Curriculum Handbooks
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('/admissions')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">
                  National Exam Cutoffs
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Contact & Support */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-2">
              Contact & Support
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">Location:</span>
                <span className="text-slate-300">Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">Email:</span>
                <a href="mailto:support@gibiconnect.edu.et" className="text-slate-300 hover:text-blue-400 transition-colors">
                  support@gibiconnect.edu.et
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">Phone:</span>
                <span className="text-slate-300">+251 11 123 4567</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">Hours:</span>
                <span className="text-slate-300">Mon - Sat: 8:30 AM - 6:00 PM</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">Telegram:</span>
                <a href="https://t.me" target="_blank" rel="noreferrer" className="text-slate-300 hover:text-blue-400 transition-colors">
                  @GIBIConnectET
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Direct Alerts & Updates */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-2">
              Stay Informed
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Receive updates on newly released university cutoff thresholds and opening scholarship grants.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                required
                placeholder="Enter student email..."
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="w-full text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Subscribe for Cutoffs
              </button>
              {feedbackSent && (
                <p className="text-[11px] font-semibold text-emerald-400 pt-1">
                  Thank you! You are subscribed to admission alerts.
                </p>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Verification & Policies */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-4">
            <p>&copy; {new Date().getFullYear()} GIBI-Connect Higher Education Platform. All rights reserved.</p>
            <span>•</span>
            <span>HERQA Accredited Standards</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => handleLinkClick('/resources')} className="hover:text-slate-300 transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <button onClick={() => handleLinkClick('/resources')} className="hover:text-slate-300 transition-colors cursor-pointer">
              Terms of Service
            </button>
            <button onClick={() => handleLinkClick('/admissions')} className="hover:text-slate-300 transition-colors cursor-pointer">
              Admission Guidelines
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
