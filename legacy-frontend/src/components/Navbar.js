import { store } from '../state/store.js';
import { themeState } from '../state/theme.js';

export function renderNavbar() {
  const user = store.user;
  const current = store.activeRoute || '/';
  const isDark = themeState.current === 'dark';

  return `
    <header class="bg-surface-container-lowest/95 backdrop-blur-md text-primary fixed top-0 w-full z-50 border-b border-outline-variant/15 shadow-2xs transition-all duration-200">
      <div class="flex justify-between items-center h-[56px] px-3 sm:px-4 md:px-8 w-full max-w-7xl mx-auto gap-2 sm:gap-4">
        <!-- Logo -->
        <a href="#/explore" class="flex items-center gap-2 sm:gap-2.5 flex-shrink-0 group py-1">
          <img 
            src="/gibi_logo-removebg-preview.png" 
            alt="GIBIConnect Logo" 
            class="h-9 w-9 sm:h-10 sm:w-10 max-h-[40px] max-w-[40px] object-contain drop-shadow-xs group-hover:scale-105 transition-transform"
          >
          <span class="font-headline-md text-base sm:text-lg font-extrabold tracking-tight">
            <span class="text-[#10B981]">GIBI</span><span class="text-[#0F172A] dark:text-slate-100">Connect</span>
          </span>
        </a>

        <!-- Navigation Links -->
        <nav class="hidden lg:flex items-center font-label-md text-xs font-medium h-full gap-5">
          <a class="${current === '/explore' ? 'text-[#10B981] font-bold border-b-2 border-[#10B981]' : 'text-on-surface-variant hover:text-[#10B981] border-b-2 border-transparent'} h-full flex items-center px-1 transition-colors" href="#/explore">Explore</a>
          <a class="${current.startsWith('/institutions') ? 'text-[#10B981] font-bold border-b-2 border-[#10B981]' : 'text-on-surface-variant hover:text-[#10B981] border-b-2 border-transparent'} h-full flex items-center px-1 transition-colors" href="#/institutions">Institutions</a>
          <a class="${current.startsWith('/programs') ? 'text-[#10B981] font-bold border-b-2 border-[#10B981]' : 'text-on-surface-variant hover:text-[#10B981] border-b-2 border-transparent'} h-full flex items-center px-1 transition-colors" href="#/programs">Programs</a>
          <a class="${current.startsWith('/resources') ? 'text-[#10B981] font-bold border-b-2 border-[#10B981]' : 'text-on-surface-variant hover:text-[#10B981] border-b-2 border-transparent'} h-full flex items-center px-1 transition-colors" href="#/resources">Resources</a>
          <a class="${current.startsWith('/admissions') ? 'text-[#10B981] font-bold border-b-2 border-[#10B981]' : 'text-on-surface-variant hover:text-[#10B981] border-b-2 border-transparent'} h-full flex items-center px-1 transition-colors" href="#/admissions">Admissions</a>
          <a class="${current.startsWith('/scholarships') ? 'text-[#10B981] font-bold border-b-2 border-[#10B981]' : 'text-on-surface-variant hover:text-[#10B981] border-b-2 border-transparent'} h-full flex items-center px-1 transition-colors" href="#/scholarships">Scholarships</a>
          ${user && (user.role === 'admin' || user.role === 'moderator') ? `
            <a class="${current === '/admin' ? 'text-amber-400 font-bold border-b-2 border-amber-400' : 'text-amber-500/80 hover:text-amber-400 border-b-2 border-transparent'} h-full flex items-center px-1 transition-colors" href="#/admin">Admin</a>
          ` : ''}
        </nav>

        <!-- Right Hand Actions -->
        <div class="flex items-center gap-1.5 sm:gap-2.5">
          <!-- Expandable Inline Search -->
          <div class="relative group hidden sm:flex items-center">
            <div onclick="window.gibiApp.toggleSearchDrawer()" class="flex items-center bg-surface-container-low hover:bg-surface-container rounded-full p-1.5 transition-all duration-300 w-8 group-hover:w-44 overflow-hidden cursor-pointer border border-outline-variant/15">
              <span class="material-symbols-outlined text-[18px] text-on-surface-variant shrink-0 ml-0.5">search</span>
              <span class="text-[11px] text-on-surface-variant whitespace-nowrap ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">Search GIBI...</span>
            </div>
          </div>

          <button class="sm:hidden text-on-surface-variant hover:text-[#10B981] transition-colors p-1 cursor-pointer" onclick="window.gibiApp.toggleSearchDrawer()">
            <span class="material-symbols-outlined text-[18px]">search</span>
          </button>

          <!-- Dark Mode Switcher -->
          <button id="theme-toggle-btn" onclick="window.gibiApp.toggleTheme()" class="p-1 rounded-sm sm:p-1.5 rounded-lg text-on-surface-variant hover:text-[#10B981] hover:bg-surface-container transition-all flex items-center justify-center cursor-pointer" title="Toggle Theme">
            <span class="material-symbols-outlined text-[18px] sm:text-[20px]">${isDark ? 'light_mode' : 'dark_mode'}</span>
          </button>

          <!-- AI Advisor Header Link -->
          <a href="#/ai-consultation" class="group hidden md:flex items-center gap-1.5 bg-gradient-to-r from-emerald-50 to-slate-100 dark:from-slate-800/90 dark:to-emerald-950/40 hover:from-emerald-100 hover:to-emerald-50 dark:hover:from-slate-800 dark:hover:to-emerald-900/60 text-slate-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/50 hover:border-emerald-500/80 px-3 py-1.5 rounded-xl font-label-md transition-all duration-300 font-bold text-xs shadow-2xs hover:shadow-md hover:shadow-emerald-500/15 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer">
            <span class="material-symbols-outlined text-[16px] text-[#10B981] group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300">auto_awesome</span>
            <span class="tracking-tight">AI Advisor</span>
            <span class="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse ml-0.5"></span>
          </a>

          <!-- User Menu -->
          ${user ? `
            <div class="relative group">
              <div class="flex items-center gap-0.5 p-0.5 rounded-full hover:bg-surface-container transition-all duration-200 cursor-pointer">
                <div class="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30 text-[#10B981] font-bold text-[11px] sm:text-xs">
                  ${(user.full_name ? user.full_name.slice(0, 2) : 'SU').toUpperCase()}
                </div>
                <span class="material-symbols-outlined text-on-surface-variant text-[14px] sm:text-[16px]">expand_more</span>
              </div>

              <div class="absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/15 py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[60]">
                <div class="px-3.5 py-2 border-b border-outline-variant/10 flex items-center gap-2.5">
                  <div class="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900 text-[#10B981] flex items-center justify-center font-bold text-xs">
                    ${(user.full_name ? user.full_name.slice(0, 2) : 'SU').toUpperCase()}
                  </div>
                  <div class="overflow-hidden">
                    <p class="font-label-md font-bold text-primary text-xs truncate">${user.full_name || 'Scholar'}</p>
                    <div class="flex items-center gap-0.5 text-[10px] text-[#10B981] font-bold mt-0.5">
                      <span class="material-symbols-outlined text-[12px]" style="font-variation-settings: 'FILL' 1;">verified</span> ${user.role || 'Scholar'}
                    </div>
                  </div>
                </div>
                <a class="flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#10B981] dark:hover:text-[#10B981] transition-colors" href="#/profile">
                  <span class="material-symbols-outlined text-[18px]">account_circle</span> My Profile
                </a>
                <button onclick="window.gibiApp.logout()" class="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-rose-500 font-bold hover:bg-rose-500/10 transition-colors text-left cursor-pointer">
                  <span class="material-symbols-outlined text-[18px]">logout</span> Log Out
                </button>
              </div>
            </div>
          ` : `
            <button onclick="window.gibiApp.navigate('/')" class="px-3 py-1.5 text-xs font-bold rounded-xl bg-[#10B981] hover:bg-[#0da271] text-slate-950 transition shadow-xs">
              Sign In
            </button>
          `}
        </div>
      </div>
    </header>

    <!-- Shared Search Drawer Modal -->
    <div id="search-drawer" class="fixed top-0 left-0 w-full h-[380px] bg-white dark:bg-[#151c28] z-[100] transform transition-transform duration-300 shadow-2xl border-b border-slate-200 dark:border-slate-800 -translate-y-full flex flex-col">
      <div class="max-w-3xl w-full mx-auto px-4 pt-6 pb-2 relative flex flex-col flex-grow overflow-hidden">
        <div class="flex items-center justify-between gap-3 mb-3">
          <div class="relative w-full group">
            <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-on-surface-variant group-focus-within:text-[#10B981] transition-colors">search</span>
            <input id="drawer-search-input" oninput="window.gibiApp.handleDrawerSearch(this.value)" class="w-full bg-surface-container rounded-xl border border-transparent pl-11 pr-10 py-2.5 text-xs text-on-surface focus:ring-2 focus:ring-[#10B981] focus:bg-surface-container-lowest transition-all outline-none" placeholder="Search across institutions, degree programs, scholarships..." type="text">
          </div>
          <button class="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-surface-container cursor-pointer" onclick="window.gibiApp.toggleSearchDrawer()">
            <span class="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>
        <div id="drawer-search-results" class="flex-grow overflow-y-auto pr-1 space-y-3 text-xs">
          <p class="text-xs text-on-surface-variant">Popular quick searches:</p>
          <div class="flex flex-wrap gap-2 items-center">
            <button onclick="window.gibiApp.quickSearch('Computer Science')" class="bg-surface-container hover:bg-emerald-50 hover:text-[#10B981] dark:hover:bg-emerald-950/60 px-3 py-1.5 rounded-lg text-xs text-on-surface transition-colors border border-outline-variant/10 flex items-center gap-1 cursor-pointer">
              <span class="material-symbols-outlined text-[14px]">search</span> Computer Science
            </button>
            <button onclick="window.gibiApp.quickSearch('Addis Ababa')" class="bg-surface-container hover:bg-emerald-50 hover:text-[#10B981] dark:hover:bg-emerald-950/60 px-3 py-1.5 rounded-lg text-xs text-on-surface transition-colors border border-outline-variant/10 flex items-center gap-1 cursor-pointer">
              <span class="material-symbols-outlined text-[14px]">location_on</span> Addis Ababa
            </button>
            <button onclick="window.gibiApp.quickSearch('Medicine')" class="bg-surface-container hover:bg-emerald-50 hover:text-[#10B981] dark:hover:bg-emerald-950/60 px-3 py-1.5 rounded-lg text-xs text-on-surface transition-colors border border-outline-variant/10 flex items-center gap-1 cursor-pointer">
              <span class="material-symbols-outlined text-[14px]">medical_services</span> Medicine & Health
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}
