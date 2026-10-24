import { getInstitutions, getInstitutionLogoUrl, getInstitutionInitials } from '../core/api.js';

let allInstitutions = [];
let activeRegion = 'all';
let activeOwnership = 'All';
let searchQuery = '';

const regions = ['All Regions', 'Oromia', 'Addis Ababa', 'South Ethiopia', 'Amhara', 'Dire Dawa', 'Sidama', 'Tigray'];
const ownerships = ['All', 'public', 'private'];

export async function initInstitutions() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('q')) searchQuery = urlParams.get('q');
  if (urlParams.get('region')) activeRegion = urlParams.get('region');

  const searchInput = document.getElementById('inst-search-input');
  if (searchInput && searchQuery) searchInput.value = searchQuery;

  renderFilters();

  const grid = document.getElementById('institutions-grid');
  if (grid) {
    grid.innerHTML = '<div class="col-span-full text-center py-16 text-xs text-on-surface-variant">Loading universities...</div>';
  }

  try {
    const res = await getInstitutions({ limit: 50 });
    if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
      allInstitutions = res.data;
    } else {
      console.warn('API returned non-array data, grid will show empty state or fallback');
      allInstitutions = [];
    }
  } catch (err) {
    console.error('Error fetching institutions:', err);
    allInstitutions = [];
  } finally {
    renderGrid();
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderGrid();
    });
  }
}

function renderFilters() {
  const regionContainer = document.getElementById('region-chips-container');
  if (regionContainer) {
    regionContainer.innerHTML = `
      <span class="font-bold text-on-surface-variant mr-1">Region:</span>
      ${regions.map(r => {
        const val = r === 'All Regions' ? 'all' : r;
        const isActive = activeRegion.toLowerCase() === val.toLowerCase() || (val === 'all' && (activeRegion.toLowerCase() === 'all' || activeRegion.toLowerCase() === 'all regions'));
        return `
          <button onclick="window.selectRegion('${val}')" class="px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${isActive ? 'bg-[#10B981] text-slate-950 shadow-sm' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-primary border border-outline-variant/15'}">
            ${r}
          </button>
        `;
      }).join('')}
    `;
  }

  const ownerContainer = document.getElementById('ownership-filter-container');
  if (ownerContainer) {
    ownerContainer.innerHTML = ownerships.map(o => `
      <button onclick="window.selectOwnership('${o}')" class="px-2.5 py-1 rounded-md font-bold uppercase text-[10px] transition cursor-pointer ${activeOwnership.toLowerCase() === o.toLowerCase() ? 'bg-[#10B981] text-slate-950 shadow-xs' : 'text-on-surface-variant hover:text-primary'}">
        ${o}
      </button>
    `).join('');
  }
}

function renderGrid() {
  const grid = document.getElementById('institutions-grid');
  if (!grid) {
    console.error('institutions-grid element not found');
    return;
  }

  const filtered = allInstitutions.filter(inst => {
    if (activeRegion && activeRegion.toLowerCase() !== 'all' && activeRegion.toLowerCase() !== 'all regions') {
      const reg = (inst.region || '').toLowerCase();
      const targetReg = activeRegion.toLowerCase();
      if (!reg.includes(targetReg) && !targetReg.includes(reg)) return false;
    }
    if (activeOwnership && activeOwnership.toLowerCase() !== 'all') {
      if ((inst.ownership || '').toLowerCase() !== activeOwnership.toLowerCase()) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = (inst.name || '').toLowerCase().includes(q);
      const matchCity = (inst.city || '').toLowerCase().includes(q);
      const matchReg = (inst.region || '').toLowerCase().includes(q);
      return matchName || matchCity || matchReg;
    }
    return true;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full p-16 text-center rounded-2xl border border-outline-variant/15 bg-surface-container-lowest text-on-surface-variant">
        <p class="text-sm font-bold">No universities match the selected filter criteria.</p>
        <button onclick="window.resetFilters()" class="mt-3 px-4 py-2 rounded-xl bg-[#10B981] text-slate-950 font-bold text-xs cursor-pointer hover:bg-[#0da271] transition">
          Reset All Filters
        </button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(inst => {
    const logoSrc = getInstitutionLogoUrl(inst);
    const initials = getInstitutionInitials(inst.name);

    return `
    <div onclick="window.location.href='institution.html?id=${inst.id}'" class="group rounded-2xl p-4 border border-outline-variant/15 bg-surface-container-lowest hover:border-[#10B981]/50 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between">
      <div>
        <div class="relative h-36 -mx-4 -mt-4 mb-4 rounded-t-2xl overflow-hidden bg-slate-800">
          <img src="${inst.cover_image_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600'}" alt="${inst.name}" onerror="this.src='https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600'" class="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-85">
          <div class="absolute inset-0 bg-gradient-to-t from-[#0B0E14]/90 via-transparent to-transparent"></div>
          <div class="absolute bottom-3 left-3.5 flex items-center gap-2.5">
            <div class="w-11 h-11 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-700 overflow-hidden shadow-lg flex-shrink-0 p-1 flex items-center justify-center relative">
              ${logoSrc ? `
                <img src="${logoSrc}" alt="${inst.name} Logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" class="w-full h-full object-contain">
                <div style="display: none;" class="w-full h-full rounded-lg bg-emerald-500/10 text-[#10B981] font-extrabold text-xs items-center justify-center">
                  ${initials}
                </div>
              ` : `
                <div class="w-full h-full rounded-lg bg-emerald-500/10 text-[#10B981] font-extrabold text-xs flex items-center justify-center">
                  ${initials}
                </div>
              `}
            </div>
            <div>
              <span class="px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider bg-slate-900/90 text-amber-300 border border-slate-700">
                ${inst.ownership} ${inst.type}
              </span>
            </div>
          </div>
        </div>
        <h3 class="font-headline-md font-bold text-base text-primary group-hover:text-[#10B981] transition leading-snug line-clamp-1">${inst.name}</h3>
        <p class="text-xs text-on-surface-variant flex items-center gap-1.5 mt-1 font-serif italic">
          <span class="material-symbols-outlined text-[14px] text-[#10B981]">location_on</span> ${inst.city}, ${inst.region}
        </p>
        <p class="text-xs text-on-surface-variant mt-2.5 line-clamp-2 leading-relaxed">
          ${inst.description || 'Accredited comprehensive higher education institution.'}
        </p>
      </div>
      <div class="mt-4 pt-3 border-t border-outline-variant/10 flex items-center justify-between text-xs">
        <span class="text-[10px] font-bold text-[#10B981] uppercase tracking-wider">${inst.accreditation || 'Accredited'}</span>
        <span class="text-[#10B981] font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
          Campus Hub <span class="material-symbols-outlined text-[15px]">chevron_right</span>
        </span>
      </div>
    </div>
  `;
  }).join('');
}

window.selectRegion = function(r) {
  activeRegion = r;
  renderFilters();
  renderGrid();
};

window.selectOwnership = function(o) {
  activeOwnership = o;
  renderFilters();
  renderGrid();
};

window.resetFilters = function() {
  activeRegion = 'all';
  activeOwnership = 'All';
  searchQuery = '';
  const searchInput = document.getElementById('inst-search-input');
  if (searchInput) searchInput.value = '';
  renderFilters();
  renderGrid();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initInstitutions);
} else {
  initInstitutions();
}
