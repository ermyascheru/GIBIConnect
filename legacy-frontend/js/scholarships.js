import { getScholarships } from './api.js';

async function initScholarships() {
  const grid = document.getElementById('scholarships-grid');
  const res = await getScholarships({ limit: 20 });
  if (res.success && res.data && grid) {
    grid.innerHTML = res.data.map(s => `
      <div class="p-5 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest hover:border-amber-500/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-0.5 text-[9px] font-bold uppercase rounded bg-amber-500/20 text-amber-300">Grant</span>
            <span class="text-xs font-bold text-amber-400">Deadline: ${s.deadline || 'Rolling'}</span>
          </div>
          <h3 class="font-bold text-base text-primary">${s.name}</h3>
          <p class="text-xs text-[#10B981] font-bold font-serif italic">${s.funding || 'Tuition Coverage'}</p>
          <p class="text-xs text-on-surface-variant leading-relaxed">${s.description}</p>
        </div>
        <div class="mt-4 pt-3 border-t border-outline-variant/10 flex items-center justify-between text-xs">
          <span class="text-on-surface-variant text-[11px]">Eligibility: ${s.eligibility || 'Open to All'}</span>
          <span class="text-[#10B981] font-bold flex items-center gap-0.5">Verified Aid <span class="material-symbols-outlined text-[14px]">check_circle</span></span>
        </div>
      </div>
    `).join('');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScholarships);
} else {
  initScholarships();
}
