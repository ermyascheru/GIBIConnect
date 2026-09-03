import { getProgram, saveProgram } from './api.js';

let currentProg = null;

async function initProgramPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || '30000000-0000-4000-8000-000000000001';

  const res = await getProgram(id);
  const card = document.getElementById('program-detail-card');
  const breadcrumb = document.getElementById('breadcrumb-prog-name');

  if (res.success && res.data && card) {
    const p = res.data;
    currentProg = p;
    if (breadcrumb) breadcrumb.textContent = p.name;

    card.innerHTML = `
      <div class="flex items-center justify-between">
        <span class="px-3 py-1 rounded-lg text-xs font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
          ${p.degree_level} Degree
        </span>
        <button id="btn-save-prog" onclick="window.handleBookmarkProgram()" class="px-3 py-1.5 rounded-xl border border-outline-variant/30 text-primary hover:text-[#10B981] font-bold text-xs flex items-center gap-1.5 transition cursor-pointer">
          <span class="material-symbols-outlined text-[16px] text-[#10B981]">bookmark_add</span> Save Program
        </button>
      </div>

      <div>
        <h1 class="font-headline-lg text-2xl sm:text-3xl font-extrabold text-primary mb-1">${p.name}</h1>
        <p class="text-sm font-bold text-[#10B981] font-serif italic">${p.institution_name || 'Accredited Institution'}</p>
      </div>

      <div class="space-y-4">
        <div>
          <h3 class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Curriculum Framework</h3>
          <p class="text-xs sm:text-sm leading-relaxed text-on-surface-variant">${p.description || 'Comprehensive curriculum designed to meet national higher education standards.'}</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-4 rounded-xl border border-outline-variant/15 bg-surface-container-low">
            <span class="text-xs text-on-surface-variant">Department Division</span>
            <div class="text-sm font-bold text-primary mt-1">${p.department_name || 'Academic Department'}</div>
          </div>
          <div class="p-4 rounded-xl border border-outline-variant/15 bg-surface-container-low">
            <span class="text-xs text-on-surface-variant">Study Mode</span>
            <div class="text-sm font-bold text-primary mt-1 capitalize">${p.study_mode || 'Full-time'}</div>
          </div>
        </div>

        <div class="p-4 rounded-xl border border-outline-variant/15 bg-surface-container-low">
          <span class="text-xs text-on-surface-variant">Admission Requirements</span>
          <p class="text-xs text-on-surface-variant mt-1">${p.admission_requirements || 'National entrance examination passing score.'}</p>
        </div>

        <div class="pt-4 border-t border-outline-variant/10 flex items-center justify-between">
          <a href="institution.html?id=${p.institution_id || ''}" class="text-xs font-bold text-[#10B981] hover:underline flex items-center gap-1">
            Visit University Campus Hub <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
          </a>
        </div>
      </div>
    `;
  }
}

window.handleBookmarkProgram = async function() {
  if (!currentProg) return;
  await saveProgram(currentProg.id);
  const btn = document.getElementById('btn-save-prog');
  if (btn) {
    btn.innerHTML = '<span class="material-symbols-outlined text-[16px] text-[#10B981]">bookmark_added</span> Saved to Workspace';
    btn.classList.add('border-[#10B981]');
  }
};

document.addEventListener('DOMContentLoaded', initProgramPage);

