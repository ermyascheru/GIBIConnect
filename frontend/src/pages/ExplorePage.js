import { store } from '../state/store.js';
import { renderNavbar } from '../components/Navbar.js';
import { renderFooter } from '../components/Footer.js';
import { apiCall } from '../api/client.js';

export async function loadExploreData() {
  if (store.institutions.length === 0 || store.programs.length === 0) {
    const [instRes, progRes, resRes] = await Promise.all([
      apiCall('/institutions?page=1&limit=6'),
      apiCall('/programs?page=1&limit=6'),
      apiCall('/resources?page=1&limit=4')
    ]);
    if (instRes.success && instRes.data) store.institutions = instRes.data;
    if (progRes.success && progRes.data) store.programs = progRes.data;
    if (resRes.success && resRes.data) store.resources = resRes.data;
    window.gibiApp.render();
  }
}

export function renderExplorePage() {
  loadExploreData();

  return `
    ${renderNavbar()}
    <main class="flex-grow w-full max-w-7xl mx-auto px-4 md:px-6 pt-20 pb-8 flex flex-col gap-8">
      <!-- Hero Banner -->
      <div class="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white p-8 sm:p-12 border border-slate-800 shadow-xl">
        <div class="absolute -right-12 -bottom-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="max-w-2xl z-10 relative space-y-3">
          <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-[#10B981] border border-emerald-500/30 inline-flex items-center gap-1">
            <span class="material-symbols-outlined text-[13px]">school</span> Official Academic Directory
          </span>
          <h1 class="font-headline-lg text-2xl sm:text-4xl font-extrabold tracking-tight">
            Discover Your Higher Education Path in Ethiopia
          </h1>
          <p class="text-xs sm:text-sm text-slate-300 leading-relaxed font-body-md">
            Explore 18 verified public and private universities, 114 accredited degree programs, transparent tuition fees, and factual AI guidance.
          </p>
          <div class="flex flex-wrap items-center gap-3 pt-2">
            <a href="#/institutions" class="px-4 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#0da271] text-slate-950 font-bold text-xs transition shadow-md flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px]">assured_workload</span> Browse Universities
            </a>
            <a href="#/ai-consultation" class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition border border-slate-700 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px] text-[#10B981]">auto_awesome</span> Consult AI Advisor
            </a>
          </div>
        </div>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="p-4 rounded-2xl border bg-surface-container-lowest border-outline-variant/15 shadow-2xs">
          <span class="text-[11px] font-bold text-on-surface-variant uppercase flex items-center gap-1">
            <span class="material-symbols-outlined text-[15px] text-[#10B981]">assured_workload</span> Institutions
          </span>
          <div class="text-2xl font-extrabold text-primary mt-1">18</div>
          <span class="text-[10px] text-[#10B981] font-bold">100% Accredited</span>
        </div>
        <div class="p-4 rounded-2xl border bg-surface-container-lowest border-outline-variant/15 shadow-2xs">
          <span class="text-[11px] font-bold text-on-surface-variant uppercase flex items-center gap-1">
            <span class="material-symbols-outlined text-[15px] text-purple-400">menu_book</span> Degree Programs
          </span>
          <div class="text-2xl font-extrabold text-primary mt-1">114</div>
          <span class="text-[10px] text-on-surface-variant">Undergraduate & Postgrad</span>
        </div>
        <div class="p-4 rounded-2xl border bg-surface-container-lowest border-outline-variant/15 shadow-2xs">
          <span class="text-[11px] font-bold text-on-surface-variant uppercase flex items-center gap-1">
            <span class="material-symbols-outlined text-[15px] text-amber-400">folder</span> Academic Resources
          </span>
          <div class="text-2xl font-extrabold text-primary mt-1">39</div>
          <span class="text-[10px] text-[#10B981] font-bold">Multi-Format Files</span>
        </div>
        <div class="p-4 rounded-2xl border bg-surface-container-lowest border-outline-variant/15 shadow-2xs">
          <span class="text-[11px] font-bold text-on-surface-variant uppercase flex items-center gap-1">
            <span class="material-symbols-outlined text-[15px] text-indigo-400">workspace_premium</span> Scholarships
          </span>
          <div class="text-2xl font-extrabold text-primary mt-1">10+</div>
          <span class="text-[10px] text-on-surface-variant">Active Grant Packages</span>
        </div>
      </div>

      <!-- Featured Universities -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="font-headline-md text-lg font-bold text-primary">Featured Higher Education Institutions</h2>
            <p class="text-xs text-on-surface-variant">Top-ranked public universities and specialized institutes</p>
          </div>
          <a href="#/institutions" class="text-xs text-[#10B981] font-bold hover:underline flex items-center gap-1">
            View all 18 <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
          </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          ${store.institutions.slice(0, 6).map(inst => `
            <div onclick="window.gibiApp.navigate('/institutions/' + '${inst.id}')" class="group rounded-2xl p-4 border border-outline-variant/15 bg-surface-container-lowest hover:border-[#10B981]/50 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between">
              <div>
                <div class="relative h-32 -mx-4 -mt-4 mb-3 rounded-t-2xl overflow-hidden bg-slate-800">
                  <img src="${inst.cover_image_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600'}" alt="${inst.name}" onerror="this.src='https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600'" class="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-85">
                  <div class="absolute inset-0 bg-gradient-to-t from-[#0B0E14]/80 via-transparent to-transparent"></div>
                  <div class="absolute bottom-2.5 left-3 flex items-center gap-2">
                    <img src="${inst.logo_url || 'assets/logos/university_default_logo.svg'}" alt="Logo" class="w-8 h-8 rounded-lg bg-white p-0.5 object-cover shadow-sm">
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
                  ${inst.description || 'Comprehensive higher education institution.'}
                </p>
              </div>
              <div class="mt-3 pt-2.5 border-t border-outline-variant/10 flex items-center justify-between text-xs">
                <span class="text-[10px] font-bold text-[#10B981] uppercase">${inst.accreditation || 'Accredited'}</span>
                <span class="text-xs font-bold text-[#10B981] flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
                  Campus Hub <span class="material-symbols-outlined text-[14px]">chevron_right</span>
                </span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Top Degree Programs -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="font-headline-md text-lg font-bold text-primary">In-Demand Degree Curricula</h2>
            <p class="text-xs text-on-surface-variant">Accredited undergraduate and postgraduate programs</p>
          </div>
          <a href="#/programs" class="text-xs text-[#10B981] font-bold hover:underline flex items-center gap-1">
            Browse all programs <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
          </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          ${store.programs.slice(0, 6).map(p => `
            <div onclick="window.gibiApp.navigate('/programs/' + '${p.id}')" class="p-4 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest hover:border-purple-500/50 hover:shadow-md transition cursor-pointer flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <span class="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    ${p.degree_level || 'Bachelor'}
                  </span>
                  <span class="text-xs text-on-surface-variant">⏱ ${p.duration || '4 Years'}</span>
                </div>
                <h3 class="font-bold text-sm text-primary hover:text-[#10B981] transition">${p.name}</h3>
                <p class="text-xs text-[#10B981] font-bold mt-0.5">${p.institution_name || 'Accredited University'}</p>
                <p class="text-xs text-on-surface-variant mt-1.5 line-clamp-2">${p.description || 'Program framework.'}</p>
              </div>
              <div class="mt-3 pt-2 border-t border-outline-variant/10 flex items-center justify-between text-xs">
                <span class="text-on-surface-variant text-[11px]">Mode: ${p.study_mode || 'Full-time'}</span>
                <span class="text-purple-400 font-bold flex items-center gap-0.5">
                  Curriculum <span class="material-symbols-outlined text-[14px]">chevron_right</span>
                </span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </main>
    ${renderFooter()}
  `;
}
