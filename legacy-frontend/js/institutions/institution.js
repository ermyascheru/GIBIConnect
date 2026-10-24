import { getInstitution, getInstitutionSubtab, saveInstitution, removeSavedInstitution, getInstitutionLogoUrl, getInstitutionInitials } from '../core/api.js';

let currentInst = null;
let currentTab = 'overview';
let isBookmarked = false;
const subtabCache = {};

const tabs = [
  { id: 'overview', label: 'Overview', icon: 'info' },
  { id: 'departments', label: 'Faculties & Depts', icon: 'folder' },
  { id: 'programs', label: 'Degree Programs', icon: 'school' },
  { id: 'admissions', label: 'Admissions Criteria', icon: 'calendar_clock' },
  { id: 'tuition', label: 'Tuition Schedule', icon: 'payments' },
  { id: 'scholarships', label: 'Scholarships', icon: 'workspace_premium' },
  { id: 'facilities', label: 'Campus Facilities', icon: 'apartment' },
  { id: 'resources', label: 'Institutional Resources', icon: 'description' },
  { id: 'calendar', label: 'Academic Calendar', icon: 'event' }
];

async function initInstitutionPage() {
  const params = new URLSearchParams(window.location.search);
  let id = params.get('id') || '00000000-0000-4000-8000-000000000008'; // Default to ASTU if none specified
  if (params.get('tab')) currentTab = params.get('tab');

  const res = await getInstitution(id);
  if (res.success && res.data) {
    currentInst = res.data;
    renderBanner();
    renderSubtabsBar();
    loadActiveTab();
  }
}

function renderBanner() {
  const breadcrumb = document.getElementById('breadcrumb-inst-name');
  if (breadcrumb) breadcrumb.textContent = currentInst.name;

  const banner = document.getElementById('inst-banner-container');
  if (banner) {
    const logoSrc = getInstitutionLogoUrl(currentInst);
    const initials = getInstitutionInitials(currentInst.name);

    banner.innerHTML = `
      <img src="${currentInst.cover_image_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200'}" alt="${currentInst.name}" onerror="this.src='https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200'" class="w-full h-full object-cover opacity-80">
      <div class="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/40 to-transparent"></div>
      <div class="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-20 h-20 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-700/50 overflow-hidden shadow-2xl flex-shrink-0 p-2 flex items-center justify-center relative group">
            ${logoSrc ? `
              <img src="${logoSrc}" alt="${currentInst.name} Official Logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" class="w-full h-full object-contain">
              <div style="display: none;" class="w-full h-full rounded-xl bg-emerald-500/10 text-[#10B981] font-extrabold text-xl items-center justify-center border border-emerald-500/30">
                ${initials}
              </div>
            ` : `
              <div class="w-full h-full rounded-xl bg-emerald-500/10 text-[#10B981] font-extrabold text-xl flex items-center justify-center border border-emerald-500/30">
                ${initials}
              </div>
            `}
          </div>
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider bg-emerald-500/20 text-[#10B981] border border-emerald-500/30">
                ${currentInst.ownership} ${currentInst.type}
              </span>
              <span class="px-2 py-0.5 text-[9px] font-bold rounded uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                ✓ Verified Higher Ed
              </span>
            </div>
            <h1 class="font-headline-lg text-2xl sm:text-3xl font-extrabold text-white">${currentInst.name}</h1>
            <p class="text-xs text-slate-300 flex items-center gap-1.5 mt-1 font-serif italic">
              <span class="material-symbols-outlined text-[14px] text-[#10B981]">location_on</span> ${currentInst.city}, ${currentInst.region}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          ${currentInst.website_url ? `
            <a href="${currentInst.website_url}" target="_blank" rel="noopener noreferrer" class="px-3.5 py-2 rounded-xl bg-surface-container-lowest/90 backdrop-blur border border-outline-variant/30 text-on-surface-variant hover:text-[#10B981] font-bold text-xs flex items-center gap-1.5 transition shadow-lg">
              <span class="material-symbols-outlined text-[16px]">language</span> Official Website
            </a>
          ` : ''}
          <button id="btn-save-inst" onclick="window.handleBookmarkInstitution()" class="px-4 py-2 rounded-xl bg-surface-container-lowest/90 backdrop-blur border border-outline-variant/30 text-primary hover:text-[#10B981] font-bold text-xs flex items-center gap-1.5 transition shadow-lg cursor-pointer">
            <span class="material-symbols-outlined text-[16px] text-[#10B981]">bookmark_add</span> Save University
          </button>
        </div>
      </div>
    `;
  }
}

window.handleBookmarkInstitution = async function() {
  if (!currentInst) return;
  const res = await saveInstitution(currentInst.id);
  const btn = document.getElementById('btn-save-inst');
  if (btn) {
    btn.innerHTML = '<span class="material-symbols-outlined text-[16px] text-[#10B981]">bookmark_added</span> Saved to Workspace';
    btn.classList.add('border-[#10B981]');
  }
};

function renderSubtabsBar() {
  const bar = document.getElementById('subtabs-bar');
  if (!bar) return;

  bar.innerHTML = tabs.map(t => `
    <button onclick="window.switchSubtab('${t.id}')" class="px-3.5 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition flex items-center gap-1.5 ${currentTab === t.id ? 'bg-[#10B981] text-slate-950 shadow-sm' : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'}">
      <span class="material-symbols-outlined text-[15px]">${t.icon}</span> ${t.label}
    </button>
  `).join('');
}

async function loadActiveTab() {
  const body = document.getElementById('subtab-body');
  if (!body) return;

  if (currentTab === 'overview') {
    body.innerHTML = `
      <div class="space-y-6">
        <div>
          <h3 class="text-base font-bold text-primary mb-2 font-headline-md">Institutional Overview</h3>
          <p class="text-xs sm:text-sm leading-relaxed text-on-surface-variant">${currentInst.description || 'Comprehensive higher education institution in Ethiopia.'}</p>
          ${currentInst.history ? `<p class="text-xs sm:text-sm mt-3 leading-relaxed text-on-surface-variant/80 font-serif italic">${currentInst.history}</p>` : ''}
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-outline-variant/10">
          <div class="p-4 rounded-xl bg-surface-container-low border border-outline-variant/10">
            <span class="text-xs text-on-surface-variant">Campus Location</span>
            <div class="text-sm font-bold text-primary mt-1">${currentInst.city}, ${currentInst.region}</div>
          </div>
          <div class="p-4 rounded-xl bg-surface-container-low border border-outline-variant/10">
            <span class="text-xs text-on-surface-variant">Official Website</span>
            <div class="text-sm font-bold text-[#10B981] mt-1">
              <a href="${currentInst.website_url || '#'}" target="_blank" class="hover:underline flex items-center gap-1">Visit Portal <span class="material-symbols-outlined text-[14px]">open_in_new</span></a>
            </div>
          </div>
          <div class="p-4 rounded-xl bg-surface-container-low border border-outline-variant/10">
            <span class="text-xs text-on-surface-variant">Contact Email</span>
            <div class="text-sm font-bold text-primary mt-1">${currentInst.email || 'info@' + (currentInst.slug || 'university') + '.edu.et'}</div>
          </div>
        </div>
      </div>
    `;
    return;
  }

  body.innerHTML = '<div class="p-8 text-center text-xs text-on-surface-variant">Loading data...</div>';

  if (!subtabCache[currentTab]) {
    const res = await getInstitutionSubtab(currentInst.id, currentTab);
    subtabCache[currentTab] = res.data || [];
  }

  const data = subtabCache[currentTab];

  if (currentTab === 'departments') {
    body.innerHTML = `
      <div>
        <h3 class="text-base font-bold text-primary mb-4 font-headline-md">Faculties & Academic Divisions</h3>
        ${data.length > 0 ? `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${data.map(f => `
              <div class="p-4 rounded-xl border border-outline-variant/15 bg-surface-container-low">
                <h4 class="font-bold text-sm text-[#10B981] flex items-center gap-1.5"><span class="material-symbols-outlined text-[16px]">folder</span> ${f.name}</h4>
                <p class="text-xs text-on-surface-variant mt-1">${f.description || 'Academic faculty division.'}</p>
              </div>
            `).join('')}
          </div>
        ` : '<p class="text-xs text-on-surface-variant">No faculties registered.</p>'}
      </div>
    `;
  } else if (currentTab === 'programs') {
    body.innerHTML = `
      <div>
        <h3 class="text-base font-bold text-primary mb-4 font-headline-md">Degree Offerings</h3>
        ${data.length > 0 ? `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${data.map(p => `
              <div onclick="window.location.href='program.html?id=${p.id}'" class="p-4 rounded-xl border border-outline-variant/15 bg-surface-container-low hover:border-[#10B981] transition cursor-pointer">
                <div class="flex items-center justify-between mb-1.5">
                  <span class="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-purple-500/20 text-purple-300">${p.degree_level}</span>
                  <span class="text-xs text-on-surface-variant">⏱ ${p.duration || '4 Years'}</span>
                </div>
                <h4 class="font-bold text-sm text-primary">${p.name}</h4>
                <p class="text-xs text-on-surface-variant mt-1 line-clamp-2">${p.description || 'Curriculum framework.'}</p>
              </div>
            `).join('')}
          </div>
        ` : '<p class="text-xs text-on-surface-variant">No programs registered.</p>'}
      </div>
    `;
  } else if (currentTab === 'admissions') {
    body.innerHTML = `
      <div class="space-y-4">
        <h3 class="text-base font-bold text-primary font-headline-md">Admissions Criteria</h3>
        ${data.length > 0 ? data.map(adm => `
          <div class="p-4 rounded-xl border border-outline-variant/15 bg-surface-container-low">
            <div class="flex items-center justify-between mb-2">
              <span class="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-purple-500/20 text-purple-300">${adm.degree_level} Intake</span>
              <span class="text-xs text-amber-400 font-bold">Deadline: ${adm.application_end || '2026-08-31'}</span>
            </div>
            <p class="text-xs text-on-surface-variant">${adm.requirements}</p>
          </div>
        `).join('') : '<p class="text-xs text-on-surface-variant">No admission criteria listed.</p>'}
      </div>
    `;
  } else if (currentTab === 'tuition') {
    body.innerHTML = `
      <div>
        <h3 class="text-base font-bold text-primary mb-4 font-headline-md">Tuition Fees Schedule</h3>
        ${data.length > 0 ? `
          <table class="w-full text-left text-xs">
            <thead class="uppercase text-[10px] bg-surface-container-low text-on-surface-variant">
              <tr><th class="p-3">Program</th><th class="p-3">Level</th><th class="p-3">Fee</th><th class="p-3">Cycle</th></tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/10">
              ${data.map(t => `
                <tr>
                  <td class="p-3 font-semibold text-primary">${t.program_name || 'Curriculum'}</td>
                  <td class="p-3"><span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-purple-500/20 text-purple-300">${t.degree_level || 'Undergraduate'}</span></td>
                  <td class="p-3 font-bold text-[#10B981]">${Number(t.amount).toLocaleString()} ${t.currency || 'ETB'}</td>
                  <td class="p-3 text-on-surface-variant">${t.period ? t.period.replace('_', ' ') : 'per year'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : '<p class="text-xs text-on-surface-variant">No tuition schedule published.</p>'}
      </div>
    `;
  } else if (currentTab === 'resources') {
    body.innerHTML = `
      <div>
        <h3 class="text-base font-bold text-primary mb-4 font-headline-md">Institutional Resources</h3>
        ${data.length > 0 ? `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${data.map(r => `
              <div class="p-4 rounded-xl border border-outline-variant/15 bg-surface-container-low flex items-center justify-between">
                <div>
                  <span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-indigo-500/20 text-indigo-300">${r.file_extension}</span>
                  <h4 class="font-bold text-xs mt-1 text-primary line-clamp-1">${r.title}</h4>
                </div>
                <div class="flex gap-1.5">
                  <a href="/api/resources/${r.id}/stream" target="_blank" class="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary"><span class="material-symbols-outlined text-[16px]">visibility</span></a>
                  <a href="/api/resources/${r.id}/download" target="_blank" class="p-1.5 rounded-lg bg-[#10B981] text-slate-950 font-bold"><span class="material-symbols-outlined text-[16px]">download</span></a>
                </div>
              </div>
            `).join('')}
          </div>
        ` : '<p class="text-xs text-on-surface-variant">No institutional resources found.</p>'}
      </div>
    `;
  } else {
    body.innerHTML = `<p class="text-xs text-on-surface-variant">Data loaded for ${currentTab}.</p>`;
  }
}

window.switchSubtab = function(tabId) {
  currentTab = tabId;
  renderSubtabsBar();
  loadActiveTab();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initInstitutionPage);
} else {
  initInstitutionPage();
}
