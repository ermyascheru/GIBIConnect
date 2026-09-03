import { store } from '../state/store.js';
import { renderNavbar } from '../components/Navbar.js';
import { renderFooter } from '../components/Footer.js';
import { apiCall } from '../api/client.js';

let programSearchDebounce = null;

export async function loadProgramsData(forced = false) {
  if (store.programs.length === 0 || forced) {
    store.isLoading = true;
    window.gibiApp.render();
    const queryParams = new URLSearchParams({ page: 1, limit: 50 });
    if (store.filters.degreeLevel !== 'all') queryParams.set('degree_level', store.filters.degreeLevel);
    if (store.filters.programSearch.trim()) queryParams.set('q', store.filters.programSearch.trim());

    const res = await apiCall('/programs?' + queryParams.toString());
    store.isLoading = false;
    if (res.success && res.data) {
      store.programs = res.data;
    }
    window.gibiApp.render();
  }
}

export async function loadSingleProgram(id) {
  if (store.selectedProgram && store.selectedProgram.id === id) return;
  store.isLoading = true;
  window.gibiApp.render();
  const res = await apiCall(`/programs/${id}`);
  store.isLoading = false;
  if (res.success && res.data) {
    store.selectedProgram = res.data;
  }
  window.gibiApp.render();
}

export function renderProgramsPage(programId = null) {
  if (programId) {
    loadSingleProgram(programId);
    if (store.selectedProgram && store.selectedProgram.id === programId) {
      return renderProgramDetailView(store.selectedProgram);
    }
  } else {
    loadProgramsData();
  }

  return `
    ${renderNavbar()}
    <main class="flex-grow w-full max-w-7xl mx-auto px-4 md:px-6 pt-20 pb-8 flex flex-col gap-5">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-3 pb-3 border-b border-outline-variant/10">
        <div>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-400 border border-purple-200/60 dark:border-purple-800/50 text-[11px] font-bold mb-1.5 shadow-2xs">
            <span class="material-symbols-outlined text-[15px]">school</span> Degree Curricula Catalog
          </div>
          <h1 class="font-headline-lg text-xl sm:text-2xl font-extrabold text-primary tracking-tight">
            Accredited Degree Programs
          </h1>
          <p class="font-body-md text-xs text-on-surface-variant max-w-2xl mt-0.5 leading-relaxed">
            Explore 114 approved bachelor's, master's, and doctoral programs across Ethiopia.
          </p>
        </div>
      </div>

      <!-- Search & Level Filters -->
      <div class="bg-surface-container-lowest rounded-xl p-3 shadow-2xs border border-outline-variant/15 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div class="relative w-full md:w-[60%] flex-grow group">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-[#10B981] transition-colors text-[18px]">search</span>
          <input 
            type="text" 
            placeholder="Search programs or university..." 
            value="${store.filters.programSearch}" 
            oninput="
              store.filters.programSearch = this.value;
              clearTimeout(programSearchDebounce);
              programSearchDebounce = setTimeout(() => { loadProgramsData(true); }, 250);
            "
            class="w-full bg-surface-container-low focus:bg-surface-container-lowest rounded-lg border-none pl-9 pr-8 py-2 text-xs text-on-surface focus:ring-2 focus:ring-[#10B981] transition-all outline-none"
          >
        </div>

        <!-- Degree Level Buttons -->
        <div class="flex flex-wrap gap-1.5 text-xs">
          <button onclick="store.filters.degreeLevel='all'; loadProgramsData(true);" class="px-3 py-1.5 rounded-xl font-bold transition ${store.filters.degreeLevel === 'all' ? 'bg-[#10B981] text-slate-950 shadow-xs' : 'bg-surface-container-low text-on-surface-variant hover:text-primary'}">
            All Levels
          </button>
          <button onclick="store.filters.degreeLevel='bachelor'; loadProgramsData(true);" class="px-3 py-1.5 rounded-xl font-bold transition ${store.filters.degreeLevel === 'bachelor' ? 'bg-[#10B981] text-slate-950 shadow-xs' : 'bg-surface-container-low text-on-surface-variant hover:text-primary'}">
            Bachelor
          </button>
          <button onclick="store.filters.degreeLevel='master'; loadProgramsData(true);" class="px-3 py-1.5 rounded-xl font-bold transition ${store.filters.degreeLevel === 'master' ? 'bg-[#10B981] text-slate-950 shadow-xs' : 'bg-surface-container-low text-on-surface-variant hover:text-primary'}">
            Master
          </button>
          <button onclick="store.filters.degreeLevel='phd'; loadProgramsData(true);" class="px-3 py-1.5 rounded-xl font-bold transition ${store.filters.degreeLevel === 'phd' ? 'bg-[#10B981] text-slate-950 shadow-xs' : 'bg-surface-container-low text-on-surface-variant hover:text-primary'}">
            PhD
          </button>
        </div>
      </div>

      <!-- Programs Grid -->
      ${store.isLoading ? `
        <div class="p-16 text-center text-xs text-on-surface-variant flex items-center justify-center gap-2">
          <span class="material-symbols-outlined animate-spin text-[#10B981]">sync</span> Loading degree curricula...
        </div>
      ` : `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          ${store.programs.map(p => `
            <div onclick="window.gibiApp.navigate('/programs/' + '${p.id}');" class="rounded-2xl p-4 border border-outline-variant/15 bg-surface-container-lowest hover:border-purple-500/50 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between group">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="px-2 py-0.5 text-[9px] font-bold rounded uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    ${p.degree_level}
                  </span>
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
          `).join('')}
        </div>
      `}
    </main>
    ${renderFooter()}
  `;
}

function renderProgramDetailView(p) {
  return `
    ${renderNavbar()}
    <main class="flex-grow w-full max-w-4xl mx-auto px-4 md:px-6 pt-20 pb-8 flex flex-col gap-6">
      <div class="flex items-center gap-2 text-xs text-on-surface-variant">
        <a href="#/programs" class="hover:text-[#10B981] transition flex items-center gap-1">
          <span class="material-symbols-outlined text-[14px]">arrow_back</span> Programs Directory
        </a>
        <span>/</span>
        <span class="text-purple-400 font-bold truncate">${p.name}</span>
      </div>

      <div class="rounded-2xl p-6 sm:p-8 border border-outline-variant/15 bg-surface-container-lowest shadow-lg space-y-6">
        <div class="flex items-center justify-between">
          <span class="px-3 py-1 rounded-lg text-xs font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
            ${p.degree_level} Degree
          </span>
          <span class="text-xs font-bold text-amber-400">Duration: ${p.duration || '4 Academic Years'}</span>
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
            <a href="#/institutions/${p.institution_id || ''}" class="text-xs font-bold text-[#10B981] hover:underline flex items-center gap-1">
              Visit University Campus Hub <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
            </a>
          </div>
        </div>
      </div>
    </main>
    ${renderFooter()}
  `;
}
