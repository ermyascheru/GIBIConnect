import { themeState } from '../state/theme.js';

export function renderThemeToggle() {
  const isDark = themeState.current === 'dark';
  return `
    <button onclick="window.gibiApp.toggleTheme()" title="Toggle Theme (Dark / Light)" class="p-2 rounded-xl border transition ${isDark ? 'bg-[#2D323E] border-slate-700/80 text-amber-300 hover:text-amber-200 hover:border-amber-400/50' : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'}">
      <i data-lucide="${isDark ? 'sun' : 'moon'}" class="w-4 h-4"></i>
    </button>
  `;
}
