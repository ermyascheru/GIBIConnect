import { store } from '../state/store.js';
import { renderNavbar } from '../components/Navbar.js';
import { renderFooter } from '../components/Footer.js';
import { apiCall } from '../api/client.js';

export async function loadScholarshipsData() {
  if (store.scholarships.length === 0) {
    store.isLoading = true;
    window.gibiApp.render();
    const res = await apiCall('/scholarships?limit=20');
    store.isLoading = false;
    if (res.success && res.data) {
      store.scholarships = res.data;
      window.gibiApp.render();
    }
  }
}

export function renderScholarshipsPage() {
  loadScholarshipsData();

  return `
    ${renderNavbar()}
    <main class="flex-grow w-full max-w-7xl mx-auto px-4 md:px-6 pt-20 pb-8 flex flex-col gap-6">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-3 pb-3 border-b border-outline-variant/10">
        <div>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-400 border border-amber-200/60 dark:border-amber-800/50 text-[11px] font-bold mb-1.5 shadow-2xs">
            <span class="material-symbols-outlined text-[15px]">workspace_premium</span> Financial Aid Hub
          </div>
          <h1 class="font-headline-lg text-xl sm:text-2xl font-extrabold text-primary tracking-tight">
            Scholarships & Research Grants
          </h1>
          <p class="font-body-md text-xs text-on-surface-variant max-w-2xl mt-0.5 leading-relaxed">
            Explore verified government, institutional, and private scholarship programs supporting Ethiopian scholars.
          </p>
        </div>
      </div>

      <!-- Scholarships Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        ${store.scholarships.map(s => `
          <div class="p-5 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest hover:border-amber-500/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="px-2.5 py-0.5 text-[9px] font-bold uppercase rounded bg-amber-500/20 text-amber-300">
                  Grant
                </span>
                <span class="text-xs font-bold text-amber-400">Deadline: ${s.deadline || 'Rolling'}</span>
              </div>
              <h3 class="font-bold text-base text-primary">${s.name}</h3>
              <p class="text-xs text-[#10B981] font-bold font-serif italic">${s.funding || 'Tuition Coverage'}</p>
              <p class="text-xs text-on-surface-variant leading-relaxed">${s.description}</p>
            </div>
            <div class="mt-4 pt-3 border-t border-outline-variant/10 flex items-center justify-between text-xs">
              <span class="text-on-surface-variant text-[11px]">Eligibility: ${s.eligibility || 'Open to All'}</span>
              <span class="text-[#10B981] font-bold flex items-center gap-0.5">
                Verified Aid <span class="material-symbols-outlined text-[14px]">check_circle</span>
              </span>
            </div>
          </div>
        `).join('')}
      </div>
    </main>
    ${renderFooter()}
  `;
}
