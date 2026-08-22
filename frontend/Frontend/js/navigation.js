import { getUser, getInstitutions, getPrograms } from './api.js';
import { logout } from './auth.js';

export function setupNavigation() {
  const user = getUser();
  
  // Render user badge or sign-in link
  const userSlot = document.getElementById('navbar-user-slot');
  if (userSlot) {
    if (user) {
      userSlot.innerHTML = `
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
        <a href="login.html" class="px-3 py-1.5 text-xs font-bold rounded-xl bg-[#10B981] hover:bg-[#0da271] text-slate-950 transition shadow-xs">
          Sign In
        </a>
      `;
    }
  }

  // Search drawer Enter key handler
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
}

// Search Command Drawer
export function toggleSearchDrawer() {
  const drawer = document.getElementById('search-drawer');
  if (!drawer) return;
  const isClosed = drawer.classList.contains('-translate-y-full');
  if (isClosed) {
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
    instList.innerHTML = insts.length > 0 ? insts.map(i => `
      <a href="institution.html?id=${i.id}" class="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high flex items-center justify-between transition">
        <span class="font-bold text-primary truncate max-w-[180px]">${i.name}</span>
        <span class="text-[10px] text-on-surface-variant">${i.city}</span>
      </a>
    `).join('') : '<p class="text-[11px] text-on-surface-variant p-2">No institutions found.</p>';
  }

  if (progList) {
    progList.innerHTML = progs.length > 0 ? progs.map(p => `
      <a href="program.html?id=${p.id}" class="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high flex items-center justify-between transition">
        <span class="font-bold text-primary truncate max-w-[180px]">${p.name}</span>
        <span class="text-[9px] font-bold uppercase text-[#10B981]">${p.degree_level}</span>
      </a>
    `).join('') : '<p class="text-[11px] text-on-surface-variant p-2">No degree programs found.</p>';
  }
}

export function quickSearch(query) {
  toggleSearchDrawer();
  window.location.href = `institutions.html?q=${encodeURIComponent(query)}`;
}

window.toggleSearchDrawer = toggleSearchDrawer;
window.handleCategorizedSearch = handleCategorizedSearch;
window.applyPopularSearch = quickSearch;
window.quickSearch = quickSearch;

document.addEventListener('DOMContentLoaded', setupNavigation);
