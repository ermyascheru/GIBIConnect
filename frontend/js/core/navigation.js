import { getUser, getInstitutions, getPrograms } from './api.js';
import { logout } from './auth.js';

export function setupNavigation() {
  const user = getUser();
  const currentPath = window.location.pathname.split('/').pop() || 'explore.html';
  
  // 1. Render user badge or sign-in link
  const userSlot = document.getElementById('navbar-user-slot');
  if (userSlot) {
    if (user) {
      userSlot.innerHTML = `
        <div class="relative group">
          <div class="flex items-center gap-0.5 p-1 rounded-full hover:bg-surface-container transition-all duration-200 cursor-pointer">
            <div class="h-7 w-7 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30 text-[#10B981] font-bold text-xs">
              ${(user.full_name ? user.full_name.slice(0, 2) : 'SU').toUpperCase()}
            </div>
            <span class="material-symbols-outlined text-on-surface-variant text-[14px]">expand_more</span>
          </div>

          <div class="absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/15 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[60]">
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
            <a class="flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#10B981] dark:hover:text-[#10B981] transition-colors" href="profile.html">
              <span class="material-symbols-outlined text-[18px]">account_circle</span> My Profile
            </a>
            ${user.role === 'admin' || user.role === 'moderator' ? `
              <a class="flex items-center gap-2.5 px-3.5 py-2 text-xs text-amber-500 hover:bg-amber-500/10 transition-colors" href="admin.html">
                <span class="material-symbols-outlined text-[18px]">shield_person</span> Admin Console
              </a>
            ` : ''}
            <div class="my-1 border-t border-outline-variant/10"></div>
            <button onclick="window.gibiLogout()" class="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-rose-500 font-bold hover:bg-rose-500/10 transition-colors text-left cursor-pointer">
              <span class="material-symbols-outlined text-[18px]">logout</span> Log Out
            </button>
          </div>
        </div>
      `;
    } else {
      userSlot.innerHTML = `
        <a href="login.html" class="px-3 py-1.5 text-xs font-bold rounded-xl bg-[#10B981] hover:bg-[#0da271] text-slate-950 transition shadow-xs whitespace-nowrap">
          Sign In
        </a>
      `;
    }
  }

  // 2. Ensure Mobile Hamburger Button in Header
  ensureMobileMenuButton();

  // 3. Inject Mobile Navigation Drawer into DOM
  injectMobileDrawer(user, currentPath);

  // 4. Search drawer Enter key handler
  const drawerInput = document.getElementById('drawer-search-input');
  if (drawerInput) {
    drawerInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = drawerInput.value.trim();
        if (val) {
          quickSearch(val);
        }
      }
    });
  }

  // Close mobile drawer on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
      toggleMobileMenu(true);
    }
  });

  // ESC key closes search & mobile menu
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      toggleMobileMenu(true);
      const searchDrawer = document.getElementById('search-drawer');
      if (searchDrawer && !searchDrawer.classList.contains('-translate-y-full')) {
        toggleSearchDrawer();
      }
    }
  });
}

function ensureMobileMenuButton() {
  if (document.getElementById('mobile-menu-toggle-btn')) return;
  const userSlot = document.getElementById('navbar-user-slot');
  const rightControls = userSlot?.parentElement;
  if (rightControls) {
    const btn = document.createElement('button');
    btn.id = 'mobile-menu-toggle-btn';
    btn.className = 'lg:hidden p-1.5 rounded-xl text-on-surface-variant hover:text-[#10B981] hover:bg-surface-container transition-all flex items-center justify-center cursor-pointer border border-outline-variant/20 ml-0.5 sm:ml-1.5';
    btn.setAttribute('aria-label', 'Toggle Navigation Menu');
    btn.setAttribute('title', 'Toggle Menu');
    btn.onclick = () => toggleMobileMenu();
    btn.innerHTML = `<span class="material-symbols-outlined text-[20px] sm:text-[22px]" id="mobile-hamburger-icon">menu</span>`;
    rightControls.appendChild(btn);
  }
}

function injectMobileDrawer(user, currentPath) {
  if (document.getElementById('mobile-nav-drawer')) return;

  const drawer = document.createElement('div');
  drawer.id = 'mobile-nav-drawer';
  drawer.className = 'fixed inset-0 z-[120] pointer-events-none transition-all duration-300';
  
  const navLinks = [
    { href: 'explore.html', label: 'Explore Hub', icon: 'explore' },
    { href: 'institutions.html', label: 'Universities & Colleges', icon: 'assured_workload' },
    { href: 'programs.html', label: 'Degree Programs', icon: 'school' },
    { href: 'resources.html', label: 'Academic Resources', icon: 'folder' },
    { href: 'admissions.html', label: 'Admissions Criteria', icon: 'calendar_clock' },
    { href: 'scholarships.html', label: 'Scholarships & Aid', icon: 'workspace_premium' }
  ];

  drawer.innerHTML = `
    <!-- Backdrop Overlay -->
    <div id="mobile-nav-backdrop" onclick="toggleMobileMenu(true)" class="absolute inset-0 bg-slate-950/70 backdrop-blur-xs opacity-0 transition-opacity duration-300 pointer-events-none cursor-pointer"></div>
    
    <!-- Slide-Out Menu Panel -->
    <div id="mobile-nav-panel" class="absolute top-0 right-0 w-[290px] sm:w-[330px] h-full bg-surface-container-lowest border-l border-outline-variant/20 shadow-2xl p-5 flex flex-col justify-between transform translate-x-full transition-transform duration-300 pointer-events-auto overflow-y-auto">
      
      <!-- Top Header -->
      <div class="space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-outline-variant/15">
          <a href="explore.html" onclick="toggleMobileMenu(true)" class="flex items-center gap-2">
            <img src="assets/gibi_logo-removebg-preview.png" alt="Logo" class="h-8 w-8 object-contain">
            <span class="font-headline-md text-base font-extrabold tracking-tight text-primary">
              <span class="text-[#10B981]">GIBI</span>Connect
            </span>
          </a>
          <button onclick="toggleMobileMenu(true)" class="p-1.5 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all cursor-pointer">
            <span class="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        <!-- User Summary Card / Sign In Action -->
        ${user ? `
          <div class="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/15 flex items-center justify-between">
            <div class="flex items-center gap-2.5 overflow-hidden">
              <div class="w-9 h-9 rounded-xl bg-emerald-500/15 text-[#10B981] font-bold text-xs flex items-center justify-center flex-shrink-0 border border-emerald-500/30">
                ${(user.full_name ? user.full_name.slice(0, 2) : 'SU').toUpperCase()}
              </div>
              <div class="overflow-hidden">
                <p class="text-xs font-bold text-primary truncate">${user.full_name || 'Scholar'}</p>
                <p class="text-[10px] text-on-surface-variant font-mono truncate">${user.email}</p>
              </div>
            </div>
            <a href="profile.html" onclick="toggleMobileMenu(true)" class="p-1.5 rounded-lg text-[#10B981] hover:bg-emerald-500/10 transition" title="My Profile">
              <span class="material-symbols-outlined text-[18px]">account_circle</span>
            </a>
          </div>
        ` : `
          <a href="login.html" onclick="toggleMobileMenu(true)" class="w-full py-2.5 rounded-xl bg-[#10B981] hover:bg-[#0da271] text-slate-950 font-bold text-xs transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer">
            <span class="material-symbols-outlined text-[16px]">login</span> Sign In / Register
          </a>
        `}

        <!-- AI Advisor Quick Banner -->
        <a href="ai-advisor.html" onclick="toggleMobileMenu(true)" class="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/30 text-primary hover:border-emerald-500/60 transition group">
          <div class="flex items-center gap-2.5">
            <span class="material-symbols-outlined text-[#10B981] text-[20px] group-hover:rotate-12 transition-transform">auto_awesome</span>
            <div>
              <div class="text-xs font-extrabold text-primary flex items-center gap-1">
                AI Advisor <span class="px-1.5 py-0.2 text-[9px] font-bold bg-[#10B981] text-slate-950 rounded-full">Active</span>
              </div>
              <p class="text-[10px] text-on-surface-variant">Grounded academic advisor</p>
            </div>
          </div>
          <span class="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
        </a>

        <!-- Navigation Links List -->
        <div class="space-y-1 pt-1">
          <div class="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant px-2 pb-1">Navigation</div>
          ${navLinks.map(link => {
            const isActive = currentPath === link.href || (currentPath === '' && link.href === 'explore.html');
            return `
              <a href="${link.href}" onclick="toggleMobileMenu(true)" class="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition ${isActive ? 'bg-[#10B981] text-slate-950 shadow-xs' : 'text-primary hover:bg-surface-container hover:text-[#10B981]'}">
                <div class="flex items-center gap-2.5">
                  <span class="material-symbols-outlined text-[18px] ${isActive ? 'text-slate-950' : 'text-[#10B981]'}">${link.icon}</span>
                  <span>${link.label}</span>
                </div>
                ${isActive ? '<span class="w-1.5 h-1.5 rounded-full bg-slate-950"></span>' : ''}
              </a>
            `;
          }).join('')}

          ${user && (user.role === 'admin' || user.role === 'moderator') ? `
            <div class="pt-2 border-t border-outline-variant/10 mt-2">
              <a href="admin.html" onclick="toggleMobileMenu(true)" class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-amber-500 hover:bg-amber-500/10 transition">
                <span class="material-symbols-outlined text-[18px]">shield_person</span> Admin Console
              </a>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Bottom Footer Action -->
      <div class="pt-4 border-t border-outline-variant/15 space-y-3">
        <div class="flex items-center justify-between text-xs">
          <span class="text-[11px] text-on-surface-variant font-medium">Appearance</span>
          <button onclick="toggleTheme()" class="px-2.5 py-1 rounded-lg bg-surface-container text-xs font-bold flex items-center gap-1.5 hover:text-[#10B981] transition cursor-pointer">
            <span class="material-symbols-outlined text-[15px]">dark_mode</span> Theme
          </button>
        </div>

        ${user ? `
          <button onclick="window.gibiLogout()" class="w-full py-2 rounded-xl border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer">
            <span class="material-symbols-outlined text-[16px]">logout</span> Log Out
          </button>
        ` : ''}

        <div class="text-[10px] text-on-surface-variant/80 text-center font-mono">
          © 2026 GIBIConnect Ethiopia
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(drawer);
}

export function toggleMobileMenu(forceClose = false) {
  const backdrop = document.getElementById('mobile-nav-backdrop');
  const panel = document.getElementById('mobile-nav-panel');
  const icon = document.getElementById('mobile-hamburger-icon');
  if (!backdrop || !panel) return;

  const isOpen = panel.classList.contains('translate-x-0');

  if (isOpen || forceClose) {
    panel.classList.remove('translate-x-0');
    panel.classList.add('translate-x-full');
    backdrop.classList.remove('opacity-100', 'pointer-events-auto');
    backdrop.classList.add('opacity-0', 'pointer-events-none');
    if (icon) icon.textContent = 'menu';
    document.body.classList.remove('overflow-hidden');
  } else {
    panel.classList.remove('translate-x-full');
    panel.classList.add('translate-x-0');
    backdrop.classList.remove('opacity-0', 'pointer-events-none');
    backdrop.classList.add('opacity-100', 'pointer-events-auto');
    if (icon) icon.textContent = 'close';
    document.body.classList.add('overflow-hidden');
  }
}

// Search Command Drawer
export function toggleSearchDrawer() {
  const drawer = document.getElementById('search-drawer');
  if (!drawer) return;
  const isClosed = drawer.classList.contains('-translate-y-full');
  if (isClosed) {
    toggleMobileMenu(true); // close mobile menu if open
    drawer.classList.remove('-translate-y-full');
    drawer.classList.add('translate-y-0');
    setTimeout(() => {
      document.getElementById('drawer-search-input')?.focus();
    }, 100);
  } else {
    drawer.classList.remove('translate-y-0');
    drawer.classList.add('-translate-y-full');
  }
}

export async function handleCategorizedSearch(val) {
  const q = val.toLowerCase().trim();
  const resultsView = document.getElementById('drawer-results-view');
  const defaultView = document.getElementById('drawer-default-view');
  if (!resultsView || !defaultView) return;

  if (!q) {
    resultsView.classList.add('hidden');
    defaultView.classList.remove('hidden');
    return;
  }

  resultsView.classList.remove('hidden');
  defaultView.classList.add('hidden');

  const [instRes, progRes] = await Promise.all([
    getInstitutions({ q, limit: 4 }),
    getPrograms({ q, limit: 4 })
  ]);

  const insts = instRes.data || [];
  const progs = progRes.data || [];

  const instList = document.getElementById('drawer-institutions-list');
  const progList = document.getElementById('drawer-programs-list');

  if (instList) {
    instList.innerHTML = insts.length > 0 ? insts.map(i => {
      const logoSrc = i.logo_url && !i.logo_url.includes('unsplash.com') ? i.logo_url : null;
      const initials = (i.name || 'UN').replace(/University|College|Science|and|Technology|of/gi, '').trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'UN';

      return `
      <a href="institution.html?id=${i.id}" class="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center gap-2.5 transition">
        <div class="w-7 h-7 rounded-lg bg-white dark:bg-slate-900 border border-slate-700/40 p-0.5 flex-shrink-0 flex items-center justify-center relative">
          ${logoSrc ? `
            <img src="${logoSrc}" alt="Logo" class="w-full h-full object-contain" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div style="display: none;" class="w-full h-full rounded bg-emerald-500/10 text-[#10B981] font-bold text-[9px] items-center justify-center">
              ${initials}
            </div>
          ` : `
            <div class="w-full h-full rounded bg-emerald-500/10 text-[#10B981] font-bold text-[9px] flex items-center justify-center">
              ${initials}
            </div>
          `}
        </div>
        <div class="overflow-hidden flex-grow">
          <span class="font-bold text-primary truncate block text-xs">${i.name}</span>
          <span class="text-[10px] text-on-surface-variant font-serif italic">${i.city}, ${i.region || 'Ethiopia'}</span>
        </div>
      </a>
    `;
    }).join('') : '<p class="text-[11px] text-on-surface-variant p-2">No institutions found.</p>';
  }

  if (progList) {
    progList.innerHTML = progs.length > 0 ? progs.map(p => `
      <a href="program.html?id=${p.id}" class="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center justify-between transition">
        <div class="overflow-hidden flex-grow pr-2">
          <span class="font-bold text-primary truncate block text-xs">${p.name}</span>
          <span class="text-[10px] text-on-surface-variant">${p.institution_name || 'Accredited'}</span>
        </div>
        <span class="text-[9px] font-bold uppercase text-[#10B981] flex-shrink-0">${p.degree_level}</span>
      </a>
    `).join('') : '<p class="text-[11px] text-on-surface-variant p-2">No degree programs found.</p>';
  }
}

export function quickSearch(query) {
  toggleSearchDrawer();
  window.location.href = `institutions.html?q=${encodeURIComponent(query)}`;
}

window.toggleMobileMenu = toggleMobileMenu;
window.toggleSearchDrawer = toggleSearchDrawer;
window.handleCategorizedSearch = handleCategorizedSearch;
window.applyPopularSearch = quickSearch;
window.quickSearch = quickSearch;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupNavigation);
} else {
  setupNavigation();
}
