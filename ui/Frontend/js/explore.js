import { getInstitutions, getPrograms } from './api.js';

async function initExplore() {
  const [instRes, progRes] = await Promise.all([
    getInstitutions({ limit: 6 }),
    getPrograms({ limit: 6 })
  ]);

  const instGrid = document.getElementById('featured-institutions-grid');
  const progGrid = document.getElementById('featured-programs-grid');

  if (instGrid && instRes.data) {
    instGrid.innerHTML = instRes.data.map(inst => `
      <div onclick="window.location.href='institution.html?id=${inst.id}'" class="group rounded-2xl p-4 border border-outline-variant/15 bg-surface-container-lowest hover:border-[#10B981]/50 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between">
        <div>
          <div class="relative h-32 -mx-4 -mt-4 mb-3 rounded-t-2xl overflow-hidden bg-slate-800">
            <img src="${inst.cover_image_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600'}" alt="${inst.name}" onerror="this.src='https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600'" class="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-85">
            <div class="absolute inset-0 bg-gradient-to-t from-[#0B0E14]/80 via-transparent to-transparent"></div>
            <div class="absolute bottom-2.5 left-3 flex items-center gap-2">
              <img src="${inst.logo_url || 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=100'}" alt="Logo" class="w-8 h-8 rounded-lg bg-white p-0.5 object-cover shadow-sm">
              <span class="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-slate-900/90 text-amber-300 border border-slate-700">
                ${inst.ownership || 'Public'} ${inst.type || 'University'}
              </span>
            </div>
          </div>
          <h3 class="font-headline-md font-bold text-sm text-primary group-hover:text-[#10B981] transition line-clamp-1">${inst.name}</h3>
          <p class="text-xs text-on-surface-variant flex items-center gap-1 mt-1 font-serif italic">
            <span class="material-symbols-outlined text-[13px] text-[#10B981]">location_on</span> ${inst.city}, ${inst.region}
          </p>
          <p class="text-xs text-on-surface-variant mt-2 line-clamp-2 leading-relaxed">
            ${inst.description || 'Accredited comprehensive higher education institution.'}
          </p>
        </div>
        <div class="mt-3 pt-2.5 border-t border-outline-variant/10 flex items-center justify-between text-xs">
          <span class="text-[10px] font-bold text-[#10B981] uppercase">${inst.accreditation || 'Accredited'}</span>
          <span class="text-xs font-bold text-[#10B981] flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
            Campus Hub <span class="material-symbols-outlined text-[14px]">chevron_right</span>
          </span>
        </div>
      </div>
    `).join('');
  }

  if (progGrid && progRes.data) {
    progGrid.innerHTML = progRes.data.map(p => `
      <div onclick="window.location.href='program.html?id=${p.id}'" class="p-4 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest hover:border-purple-500/50 hover:shadow-md transition cursor-pointer flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <span class="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
              ${p.degree_level || 'Bachelor'}
            </span>
            <span class="text-xs text-on-surface-variant">⏱ ${p.duration || '4 Years'}</span>
          </div>
          <h3 class="font-bold text-sm text-primary hover:text-[#10B981] transition">${p.name}</h3>
          <p class="text-xs text-[#10B981] font-bold mt-0.5">${p.institution_name || 'Accredited University'}</p>
          <p class="text-xs text-on-surface-variant mt-1.5 line-clamp-2">${p.description || 'Curriculum framework.'}</p>
        </div>
        <div class="mt-3 pt-2 border-t border-outline-variant/10 flex items-center justify-between text-xs">
          <span class="text-on-surface-variant text-[11px]">Mode: ${p.study_mode || 'Full-time'}</span>
          <span class="text-purple-400 font-bold flex items-center gap-0.5">
            Curriculum <span class="material-symbols-outlined text-[14px]">chevron_right</span>
          </span>
        </div>
      </div>
    `).join('');
  }
}

document.addEventListener('DOMContentLoaded', initExplore);
