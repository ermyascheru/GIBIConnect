import { store } from '../state/store.js';
import { renderNavbar } from '../components/Navbar.js';
import { renderFooter } from '../components/Footer.js';

export function renderProfilePage() {
  const user = store.user;

  if (!user) {
    return `
      ${renderNavbar()}
      <main class="flex-grow w-full max-w-md mx-auto px-4 py-28 text-center">
        <div class="p-8 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest shadow-sm">
          <span class="material-symbols-outlined text-[48px] text-[#10B981] mx-auto mb-2">account_circle</span>
          <h2 class="text-lg font-bold text-primary">Scholar Workspace Access</h2>
          <p class="text-xs text-on-surface-variant mt-1">Please sign in to view your profile and saved bookmarks.</p>
          <a href="#/" class="inline-block mt-4 px-4 py-2 rounded-xl bg-[#10B981] text-slate-950 font-bold text-xs">
            Sign In / Register
          </a>
        </div>
      </main>
      ${renderFooter()}
    `;
  }

  return `
    ${renderNavbar()}
    <main class="flex-grow w-full max-w-4xl mx-auto px-4 md:px-6 pt-20 pb-8 flex flex-col gap-6">
      <!-- Profile Header Card -->
      <div class="p-6 sm:p-8 rounded-3xl border border-outline-variant/15 bg-surface-container-lowest shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div class="w-20 h-20 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-[#10B981] border border-emerald-500/30 flex items-center justify-center font-bold text-2xl shadow-md flex-shrink-0">
          ${(user.full_name ? user.full_name.slice(0, 2) : 'SU').toUpperCase()}
        </div>
        <div class="flex-grow text-center sm:text-left space-y-1">
          <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 class="font-headline-lg text-xl sm:text-2xl font-extrabold text-primary">${user.full_name || 'Scholar Account'}</h1>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-[#10B981] border border-emerald-500/30">
              Verified ${user.role || 'Scholar'}
            </span>
          </div>
          <p class="text-xs text-on-surface-variant font-mono">${user.email}</p>
          <p class="text-xs text-on-surface-variant pt-1 font-serif italic">Member of Ethiopian Higher Education Digital Network</p>
        </div>
        <button onclick="window.gibiApp.logout()" class="px-3.5 py-2 rounded-xl border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 transition text-xs font-bold flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[16px]">logout</span> Log Out
        </button>
      </div>

      <!-- Account Overview Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="p-4 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest">
          <span class="text-[11px] text-on-surface-variant font-bold uppercase">Account Status</span>
          <div class="text-lg font-extrabold text-[#10B981] mt-1 capitalize">${user.status || 'Active'}</div>
        </div>
        <div class="p-4 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest">
          <span class="text-[11px] text-on-surface-variant font-bold uppercase">Role Privilege</span>
          <div class="text-lg font-extrabold text-primary mt-1 uppercase text-sm">${user.role || 'User'}</div>
        </div>
        <div class="p-4 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest">
          <span class="text-[11px] text-on-surface-variant font-bold uppercase">Campus Affiliation</span>
          <div class="text-lg font-extrabold text-primary mt-1 text-sm">Addis Ababa University</div>
        </div>
      </div>
    </main>
    ${renderFooter()}
  `;
}
