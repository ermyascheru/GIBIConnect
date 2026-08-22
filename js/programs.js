import { getPrograms } from './api.js';

let activeLevel = 'all';
let searchQuery = '';

async function loadPrograms() {
  const grid = document.getElementById('programs-grid');
  if (grid) grid.innerHTML = '<div class="col-span-full text-center py-16 text-xs text-on-surface-variant">Loading programs...</div>';

  const params = { limit: 50 };
  if (activeLevel !== 'all') params.degree_level = activeLevel;
  if (searchQuery) params.q = searchQuery;

  const res = await getPrograms(params);
  if (res.success && res.data && grid) {
    if (res.data.length === 0) {
      grid.innerHTML = '<div class="col-span-full p-16 text-center text-xs text-on-surface-variant">No programs match the search criteria.</div>';
      return;
    }
    grid.innerHTML = res.data.map(p => `
      <div onclick="window.location.href='program.html?id=${p.id}'" class="rounded-2xl p-4 border border-outline-variant/15 bg-surface-container-lowest hover:border-purple-500/50 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between group">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="px-2 py-0.5 text-[9px] font-bold rounded uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">${p.degree_level}</span>
            <span class="text-xs text-on-surface-variant">⏱ ${p.duration || '4 Years'}</span>
          </div>
          <h3 class="font-bold text-base text-primary group-hover:text-[#10B981] transition leading-snug line-clamp-1">${p.name}</h3>
          <p class="text-xs text-[#10B981] font-bold mt-0.5 font-serif italic">${p.institution_name || 'Accredited University'}</p>
          <p class="text-xs text-on-surface-variant mt-2 line-clamp-2 leading-relaxed">${p.description || 'Program framework.'}</p>
        </div>
        <div class="mt-4 pt-3 border-t border-outline-variant/10 flex items-center justify-between text-xs">
          <span class="text-on-surface-variant text-[11px]">Mode: ${p.study_mode || 'Full-time'}</span>
          <span class="text-purple-400 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
            View Curriculum <span class="material-symbols-outlined text-[15px]">chevron_right</span>
          </span>
        </div>
      </div>
    `).join('');
  }
}

window.selectDegreeLevel = function(lvl) {
  activeLevel = lvl;
  ['all', 'bachelor', 'master', 'phd'].forEach(l => {
    const btn = document.getElementById(`lvl-${l}`);
    if (btn) {
      if (l === lvl) {
        btn.className = 'px-3 py-1.5 rounded-xl font-bold bg-[#10B981] text-slate-950';
      } else {
        btn.className = 'px-3 py-1.5 rounded-xl font-bold bg-surface-container-low text-on-surface-variant hover:text-primary';
      }
    }
  });
  loadPrograms();
};

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('prog-search-input');
  if (searchInput) {
    let deb = null;
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      clearTimeout(deb);
      deb = setTimeout(loadPrograms, 200);
    });
  }
  loadPrograms();
});
