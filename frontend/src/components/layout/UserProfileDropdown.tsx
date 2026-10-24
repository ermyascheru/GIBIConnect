import React, { useState, useRef, useEffect } from 'react';
import {
  Bookmark,
  GraduationCap,
  Bot,
  FileText,
  LogOut,
  ChevronDown,
  UserCheck,
} from 'lucide-react';
import type { PlatformTab } from '../../App';
import type { PublicNavView } from './Navbar';

interface UserProfileDropdownProps {
  user: { email?: string; full_name?: string } | null;
  onSignOut: () => void;
  onNavigateToTab?: (tab: PlatformTab) => void;
  onNavigateToView?: (view: PublicNavView) => void;
  theme?: 'light' | 'dark';
}

export const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  user,
  onSignOut,
  onNavigateToTab,
  onNavigateToView,
  theme = 'light',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [savedCount] = useState<number>(() => {
    try {
      const raw = localStorage.getItem('gibiconnect_saved_institutions');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.length;
      }
    } catch {}
    return 3; // Default realistic bookmark count
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!user) return null;

  const displayName = user.full_name || 'Ermiyas Cheru';
  const displayEmail = user.email || 'ermyascheru@gmail.com';
  const initial = (displayName.charAt(0) || displayEmail.charAt(0) || 'U').toUpperCase();

  const handleAction = (tab?: PlatformTab, view?: PublicNavView) => {
    setIsOpen(false);
    if (tab && onNavigateToTab) {
      onNavigateToTab(tab);
    } else if (view && onNavigateToView) {
      onNavigateToView(view);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Avatar Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer group focus:outline-none"
        title={`${displayName} (${displayEmail})`}
        aria-expanded={isOpen}
      >
        <div className="w-8 h-8 rounded-full bg-[#0C373D] text-[#5AA7A7] font-bold flex items-center justify-center text-xs border border-[#5AA7A7]/40 shadow-xs group-hover:scale-105 group-hover:border-[#5AA7A7] transition-all">
          {initial}
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#5AA7A7]' : isDark ? 'text-zinc-400' : 'text-slate-500'
          }`}
        />
      </button>

      {/* Floating Popover / Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute right-0 top-full mt-2 w-72 rounded-2xl shadow-2xl border transition-all duration-150 z-50 animate-fadeIn overflow-hidden ${
            isDark
              ? 'bg-zinc-900 border-zinc-700 text-slate-100'
              : 'bg-white border-[#E2E8F0] text-slate-900'
          }`}
        >
          {/* 1. User Identity Header */}
          <div
            className={`p-4 border-b ${
              isDark ? 'border-zinc-800 bg-zinc-950/60' : 'border-[#F1F5F9] bg-[#EBF4F7]/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0C373D] text-[#5AA7A7] font-bold flex items-center justify-center text-sm border border-[#5AA7A7]/50 shadow-xs shrink-0">
                {initial}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs truncate leading-snug">{displayName}</div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                  {displayEmail}
                </div>
                <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                  <UserCheck className="w-3 h-3" />
                  <span>Verified Student</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Features & Shortcuts List */}
          <div className="p-2 space-y-0.5 text-xs font-medium">
            {/* Saved Universities */}
            <button
              type="button"
              onClick={() => handleAction('institutions')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
                isDark
                  ? 'hover:bg-zinc-800 text-zinc-200'
                  : 'hover:bg-[#EBF6F6] text-[#0F172A]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bookmark className="w-4 h-4 text-[#5AA7A7]" />
                <span>Saved Universities</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0C373D] text-[#5AA7A7]">
                {savedCount}
              </span>
            </button>

            {/* Academic Programs */}
            <button
              type="button"
              onClick={() => handleAction('programs')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
                isDark
                  ? 'hover:bg-zinc-800 text-zinc-200'
                  : 'hover:bg-[#EBF6F6] text-[#0F172A]'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-[#5AA7A7]" />
              <span>Degree Catalog & Programs</span>
            </button>

            {/* EUEE Admissions & Cutoffs */}
            <button
              type="button"
              onClick={() => handleAction('admissions')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
                isDark
                  ? 'hover:bg-zinc-800 text-zinc-200'
                  : 'hover:bg-[#EBF6F6] text-[#0F172A]'
              }`}
            >
              <FileText className="w-4 h-4 text-[#5AA7A7]" />
              <span>Admissions & Cutoffs</span>
            </button>

            {/* AI Advisor Chat History */}
            <button
              type="button"
              onClick={() => handleAction('ai-advisor')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
                isDark
                  ? 'hover:bg-zinc-800 text-zinc-200'
                  : 'hover:bg-[#EBF6F6] text-[#0F172A]'
              }`}
            >
              <Bot className="w-4 h-4 text-[#5AA7A7]" />
              <span>AI Advisor Sessions</span>
            </button>
          </div>

          {/* 3. Divider & Sign Out */}
          <div className={`p-2 border-t ${isDark ? 'border-zinc-800' : 'border-[#F1F5F9]'}`}>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onSignOut();
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-rose-600 dark:text-rose-400 font-semibold text-xs transition-colors cursor-pointer ${
                isDark ? 'hover:bg-rose-950/40' : 'hover:bg-rose-50'
              }`}
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
