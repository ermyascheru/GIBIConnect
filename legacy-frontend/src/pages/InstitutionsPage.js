import { store } from '../state/store.js';
import { renderNavbar } from '../components/Navbar.js';
import { renderFooter } from '../components/Footer.js';
import { apiCall } from '../api/client.js';

let searchDebounce = null;

export async function loadInstitutionsData(forced = false) {
  if (store.institutions.length === 0 || forced) {
    store.isLoading = true;
    window.gibiApp.render();
    const res = await apiCall('/institutions?page=1&limit=50');
    store.isLoading = false;
    if (res.success && res.data) {
      store.institutions = res.data;
    }
    window.gibiApp.render();
  }
}

export function renderInstitutionsPage() {
  loadInstitutionsData();

  const regions = ['All Regions', 'Oromia', 'Addis Ababa', 'South Ethiopia', 'Amhara', 'Dire Dawa', 'Sidama', 'Tigray'];
  const ownerships = ['All', 'public', 'private'];

  const filtered = store.institutions.filter(inst => {
    if (store.filters.region !== 'all') {
      const targetRegion = store.filters.region.toLowerCase().trim();
      const instRegion = (inst.region || '').toLowerCase().trim();
      if (!instRegion.includes(targetRegion) && !targetRegion.includes(instRegion)) return false;
    }
    if (store.filters.ownership && store.filters.ownership !== 'All') {
      if ((inst.ownership || '').toLowerCase() !== store.filters.ownership.toLowerCase()) return false;
    }
    if (store.filters.search) {
      const q = store.filters.search.toLowerCase().trim();
      const matchName = (inst.name || '').toLowerCase().includes(q);
      const matchCity = (inst.city || '').toLowerCase().includes(q);
      const matchRegion = (inst.region || '').toLowerCase().includes(q);
      return matchName || matchCity || matchRegion;
    }
    return true;
  });

  return `
    ${renderNavbar()}
    <main class="flex-grow w-full max-w-7xl mx-auto px-4 md:px-6 pt-20 pb-8 flex flex-col gap-5">
      
      <!-- Directory Title & Orientation Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-3 pb-3 border-b border-outline-variant/10">
        <div>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#10B981] border border-emerald-200/60 dark:border-emerald-800/50 text-[11px] font-bold mb-1.5 shadow-2xs">
            <span class="material-symbols-outlined text-[15px]">assured_workload</span>
            Higher Education Directory
          </div>
          <h1 class="font-headline-lg text-xl sm:text-2xl font-extrabold text-primary tracking-tight">
            Explore Ethiopian Institutions
          </h1>
          <p class="font-body-md text-xs text-on-surface-variant max-w-2xl mt-0.5 leading-relaxed">
            Browse 18 accredited public and private universities across Ethiopia. Filter by region or ownership to explore campus hubs.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[11px] text-on-surface-variant bg-surface-container-low px-2.5 py-1 rounded-lg border border-outline-variant/15 font-semibold flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[14px] text-[#10B981]">verified</span> 18 Verified Campuses
          </span>
        </div>
      </div>

      <!-- Search & Control Bar -->
      <div class="bg-surface-container-lowest rounded-xl p-3 shadow-2xs border border-outline-variant/15 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div class="relative w-full md:w-[60%] flex-grow group">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-[#10B981] transition-colors text-[18px]">search</span>
          <input 
            type="text" 
            placeholder="Search universities by name, city, or region..." 
            value="${store.filters.search}" 
            oninput="
              store.filters.search = this.value;
              clearTimeout(searchDebounce);
              searchDebounce = setTimeout(() => { window.gibiApp.render(); }, 150);
            "
            class="w-full bg-surface-container-low focus:bg-surface-container-lowest rounded-lg border-none pl-9 pr-8 py-2 text-xs text-on-surface focus:ring-2 focus:ring-[#10B981] transition-all outline-none"
          >
          ${store.filters.search ? `
            <button onclick="store.filters.search=''; window.gibiApp.render();" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary">
              <span class="material-symbols-outlined text-[16px]">cancel</span>
            </button>
          ` : ''}
        </div>

        <div class="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end text-xs">
          <!-- Ownership Filter -->
          <div class="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg border border-outline-variant/15">
            ${ownerships.map(o => `
              <button 
                onclick="store.filters.ownership='${o}'; window.gibiApp.render();"
                class="px-2.5 py-1 rounded-md font-bold uppercase text-[10px] transition ${(store.filters.ownership || 'All') === o ? 'bg-[#10B981] text-slate-950 shadow-xs' : 'text-on-surface-variant hover:text-primary'}"
              >
                ${o}
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Regional Filter Chips -->
      <div class="flex flex-wrap items-center gap-1.5 text-xs">
        <span class="font-bold text-on-surface-variant mr-1">Region:</span>
        ${regions.map(r => {
          const regionVal = r === 'All Regions' ? 'all' : r;
          const isActive = store.filters.region === regionVal;
          return `
            <button 
              onclick="store.filters.region='${regionVal}'; window.gibiApp.render();" 
              class="px-3 py-1.5 rounded-xl text-xs font-bold transition ${isActive ? 'bg-[#10B981] text-slate-950 shadow-sm' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-primary border border-outline-variant/15'}"
            >
              ${r}
            </button>
          `;
        }).join('')}
        ${(store.filters.region !== 'all' || store.filters.search || store.filters.ownership !== 'All') ? `
          <button onclick="store.filters.region='all'; store.filters.search=''; store.filters.ownership='All'; window.gibiApp.render();" class="text-xs text-[#10B981] font-bold hover:underline ml-2">
            Reset Filters
          </button>
        ` : ''}
      </div>

      <!-- Institutions Card Grid -->
      ${store.isLoading ? `
        <div class="p-16 text-center text-xs text-on-surface-variant flex items-center justify-center gap-2">
          <span class="material-symbols-outlined animate-spin text-[#10B981]">sync</span> Loading universities...
        </div>
      ` : (filtered.length > 0 ? `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${filtered.map(inst => `
            <div onclick="window.gibiApp.navigate('/institutions/' + '${inst.id}')" class="group rounded-2xl p-4 border border-outline-variant/15 bg-surface-container-lowest hover:border-[#10B981]/50 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between">
              <div>
                <!-- Cover Banner & University Seal -->
                <div class="relative h-36 -mx-4 -mt-4 mb-4 rounded-t-2xl overflow-hidden bg-slate-800">
                  <img src="${inst.cover_image_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600'}" alt="${inst.name}" onerror="this.src='https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600'" class="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-85">
                  <div class="absolute inset-0 bg-gradient-to-t from-[#0B0E14]/90 via-transparent to-transparent"></div>
                  
                  <div class="absolute bottom-3 left-3.5 flex items-center gap-2.5">
                    <div class="w-11 h-11 rounded-xl bg-white border-2 border-slate-700 overflow-hidden shadow-lg flex-shrink-0 p-0.5">
                      <img src="${inst.logo_url || 'assets/logos/university_default_logo.svg'}" alt="${inst.name} Logo" class="w-full h-full object-cover rounded-lg">
                    </div>
                    <div>
                      <span class="px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider bg-slate-900/90 text-amber-300 border border-slate-700">
                        ${inst.ownership} ${inst.type}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Institution Details -->
                <h3 class="font-headline-md font-bold text-base text-primary group-hover:text-[#10B981] transition leading-snug line-clamp-1">${inst.name}</h3>
                <p class="text-xs text-on-surface-variant flex items-center gap-1.5 mt-1 font-serif italic">
                  <span class="material-symbols-outlined text-[14px] text-[#10B981]">location_on</span> ${inst.city}, ${inst.region}
                </p>
                <p class="text-xs text-on-surface-variant mt-2.5 line-clamp-2 leading-relaxed">
                  ${inst.description || 'Accredited comprehensive higher education institution in Ethiopia.'}
                </p>
              </div>

              <!-- Footer Stats -->
              <div class="mt-4 pt-3 border-t border-outline-variant/10 flex items-center justify-between text-xs">
                <span class="text-[10px] font-bold text-[#10B981] uppercase tracking-wider">${inst.accreditation || 'Accredited'}</span>
                <span class="text-[#10B981] font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
                  Campus Hub <span class="material-symbols-outlined text-[15px]">chevron_right</span>
                </span>
              </div>
            </div>
          `).join('')}
        </div>
      ` : `
        <div class="p-16 text-center rounded-2xl border border-outline-variant/15 bg-surface-container-lowest text-on-surface-variant">
          <p class="text-sm font-bold">No universities match the selected filter criteria.</p>
          <button onclick="store.filters.region='all'; store.filters.search=''; store.filters.ownership='All'; window.gibiApp.render();" class="mt-3 px-4 py-2 rounded-xl bg-[#10B981] text-slate-950 font-bold text-xs">
            Reset All Filters
          </button>
        </div>
      `)}
    </main>
    ${renderFooter()}
  `;
}
