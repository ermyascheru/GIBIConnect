import { store } from '../state/store.js';
import { renderNavbar } from '../components/Navbar.js';
import { renderFooter } from '../components/Footer.js';
import { apiCall } from '../api/client.js';

export async function loadAdmissionsData() {
  if (store.admissions.length === 0) {
    store.isLoading = true;
    window.gibiApp.render();
    const res = await apiCall('/admissions?page=1&limit=50');
    store.isLoading = false;
    if (res.success && res.data) {
      store.admissions = res.data;
      window.gibiApp.render();
    }
  }
}

export function renderAdmissionsPage() {
  loadAdmissionsData();

  return `
    ${renderNavbar()}
    <main class="flex-grow w-full max-w-7xl mx-auto px-4 md:px-6 pt-20 pb-8 flex flex-col gap-6">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-3 pb-3 border-b border-outline-variant/10">
        <div>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#10B981] border border-emerald-200/60 dark:border-emerald-800/50 text-[11px] font-bold mb-1.5 shadow-2xs">
            <span class="material-symbols-outlined text-[15px]">calendar_clock</span> Admissions Gateway
          </div>
          <h1 class="font-headline-lg text-xl sm:text-2xl font-extrabold text-primary tracking-tight">
            University Admissions & Intake Deadlines
          </h1>
          <p class="font-body-md text-xs text-on-surface-variant max-w-2xl mt-0.5 leading-relaxed">
            Review entry criteria, required document checklists, and application windows for upcoming semesters.
          </p>
        </div>
      </div>

      <!-- Admissions Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        ${store.admissions.map(adm => `
          <div class="p-5 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest hover:border-[#10B981]/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
            <div class="space-y-2.5">
              <div class="flex items-center justify-between">
                <span class="px-2.5 py-0.5 text-[9px] font-bold uppercase rounded bg-purple-500/20 text-purple-300">
                  ${adm.degree_level || 'Undergraduate'} Intake
                </span>
                <span class="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <span class="material-symbols-outlined text-[14px]">event</span> Deadline: ${adm.application_end || '2026-08-31'}
                </span>
              </div>
              <h3 class="font-bold text-sm text-primary">${adm.institution_name || 'Accredited University'}</h3>
              <p class="text-xs text-on-surface-variant">${adm.requirements || 'National examination threshold scores required.'}</p>
              ${adm.documents ? `
                <div class="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/10 text-xs text-on-surface-variant">
                  <span class="font-bold text-primary">Required Docs:</span> ${adm.documents}
                </div>
              ` : ''}
            </div>
            <div class="mt-4 pt-3 border-t border-outline-variant/10 flex items-center justify-between text-xs">
              <span class="text-on-surface-variant text-[11px]">Intake: ${adm.intake_season || 'Regular'}</span>
              <a href="#/institutions/${adm.institution_id}" class="text-[#10B981] font-bold hover:underline flex items-center gap-0.5">
                Campus Hub <span class="material-symbols-outlined text-[14px]">chevron_right</span>
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    </main>
    ${renderFooter()}
  `;
}
