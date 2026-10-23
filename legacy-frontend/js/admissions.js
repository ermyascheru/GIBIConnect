import { getAdmissions } from './api.js';

async function initAdmissions() {
  const grid = document.getElementById('admissions-grid');
  const res = await getAdmissions({ limit: 50 });
  if (res.success && res.data && grid) {
    grid.innerHTML = res.data.map(adm => `
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
          <a href="institution.html?id=${adm.institution_id}&tab=admissions" class="text-[#10B981] font-bold hover:underline flex items-center gap-0.5">
            Campus Hub <span class="material-symbols-outlined text-[14px]">chevron_right</span>
          </a>
        </div>
      </div>
    `).join('');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdmissions);
} else {
  initAdmissions();
}
