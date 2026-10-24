import { store } from '../state/store.js';
import { renderNavbar } from '../components/Navbar.js';
import { renderFooter } from '../components/Footer.js';
import { apiCall } from '../api/client.js';

export async function loadDetailData(id, subtab = 'overview') {
  if (!store.selectedInstitution || store.selectedInstitution.id !== id) {
    store.isLoading = true;
    window.gibiApp.render();
    const instRes = await apiCall(`/institutions/${id}`);
    store.isLoading = false;
    if (instRes.success && instRes.data) {
      store.selectedInstitution = instRes.data;
    } else {
      store.selectedInstitution = null;
      window.gibiApp.render();
      return;
    }
  }

  const cacheKey = `${id}_${subtab}`;
  if (!store.institutionSubtabsData[cacheKey] && subtab !== 'overview') {
    let endpoint = null;
    if (subtab === 'departments') endpoint = `/institutions/${id}/faculties`;
    if (subtab === 'programs') endpoint = `/institutions/${id}/programs`;
    if (subtab === 'admissions') endpoint = `/institutions/${id}/admissions`;
    if (subtab === 'tuition') endpoint = `/institutions/${id}/tuition`;
    if (subtab === 'scholarships') endpoint = `/institutions/${id}/scholarships`;
    if (subtab === 'facilities') endpoint = `/institutions/${id}/facilities`;
    if (subtab === 'resources') endpoint = `/institutions/${id}/resources`;
    if (subtab === 'calendar') endpoint = `/academic_calendar?institution_id=${id}`;

    if (endpoint) {
      const res = await apiCall(endpoint);
      store.institutionSubtabsData[cacheKey] = res.data || [];
    }
  }

  window.gibiApp.render();
}

export function renderInstitutionDetailPage(subtab = 'overview') {
  const inst = store.selectedInstitution;

  if (store.isLoading) {
    return `
      ${renderNavbar()}
      <div class="max-w-7xl mx-auto px-4 py-24 text-center text-xs text-on-surface-variant flex items-center justify-center gap-2">
        <span class="material-symbols-outlined animate-spin text-[#10B981]">sync</span> Loading campus hub records...
      </div>
    `;
  }

  if (!inst) {
    return `
      ${renderNavbar()}
      <div class="max-w-xl mx-auto px-4 py-24 text-center">
        <div class="p-8 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest shadow-sm">
          <span class="material-symbols-outlined text-[40px] text-amber-400 mx-auto mb-2">error</span>
          <h2 class="text-base font-bold text-primary">Institution Record Not Found</h2>
          <p class="text-xs text-on-surface-variant mt-1">Unable to load information for this university.</p>
          <a href="#/institutions" class="inline-block mt-4 px-4 py-2 rounded-xl bg-[#10B981] text-slate-950 font-bold text-xs">
            Back to Directory
          </a>
        </div>
      </div>
    `;
  }

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

  const subtabData = store.institutionSubtabsData[`${inst.id}_${subtab}`] || [];

  return `
    ${renderNavbar()}
    <div class="flex-grow w-full max-w-7xl mx-auto px-4 md:px-6 pt-20 pb-8 flex flex-col gap-6">
      
      <!-- Breadcrumb -->
      <div class="flex items-center gap-2 text-xs text-on-surface-variant">
        <a href="#/institutions" class="hover:text-[#10B981] transition flex items-center gap-1">
          <span class="material-symbols-outlined text-[14px]">arrow_back</span> Universities
        </a>
        <span>/</span>
        <span class="text-[#10B981] font-bold truncate">${inst.name}</span>
      </div>

      <!-- Campus Hero Banner -->
      <div class="relative h-64 sm:h-72 rounded-3xl overflow-hidden border border-outline-variant/15 shadow-lg bg-surface-container-lowest">
        <img src="${inst.cover_image_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200'}" alt="${inst.name}" onerror="this.src='https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200'" class="w-full h-full object-cover opacity-80">
        <div class="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/40 to-transparent"></div>
        
        <div class="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-20 h-20 rounded-2xl bg-white border-2 border-slate-700 overflow-hidden shadow-2xl flex-shrink-0 p-1">
              <img src="${inst.logo_url || 'assets/logos/university_default_logo.svg'}" alt="${inst.name} Logo" class="w-full h-full object-cover rounded-xl">
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider bg-emerald-500/20 text-[#10B981] border border-emerald-500/30">
                  ${inst.ownership} ${inst.type}
                </span>
                <span class="px-2 py-0.5 text-[9px] font-bold rounded uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  ✓ Verified Higher Ed
                </span>
              </div>
              <h1 class="font-headline-lg text-2xl sm:text-3xl font-extrabold text-white">${inst.name}</h1>
              <p class="text-xs text-slate-300 flex items-center gap-1.5 mt-1 font-serif italic">
                <span class="material-symbols-outlined text-[14px] text-[#10B981]">location_on</span> ${inst.city}, ${inst.region}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 9 Sub-Tabs Navigation Bar -->
      <div class="flex border-b border-outline-variant/15 overflow-x-auto gap-1 pb-1 scrollbar-hide">
        ${tabs.map(t => `
          <button 
            onclick="window.gibiApp.navigate('/institutions/' + '${inst.id}/' + '${t.id}');" 
            class="px-3.5 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition flex items-center gap-1.5 ${subtab === t.id ? 'bg-[#10B981] text-slate-950 shadow-sm' : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'}"
          >
            <span class="material-symbols-outlined text-[15px]">${t.icon}</span> ${t.label}
          </button>
        `).join('')}
      </div>

      <!-- Active Tab Content Area -->
      <div class="rounded-2xl p-6 sm:p-8 border border-outline-variant/15 bg-surface-container-lowest shadow-sm">
        ${renderActiveTabBody(inst, subtab, subtabData)}
      </div>
    </div>
    ${renderFooter()}
  `;
}

function renderActiveTabBody(inst, tab, data) {
  if (tab === 'overview') {
    return `
      <div class="space-y-6">
        <div>
          <h3 class="text-base font-bold text-primary mb-2 font-headline-md">Institutional Profile & Academic Standing</h3>
          <p class="text-xs sm:text-sm leading-relaxed text-on-surface-variant">${inst.description || 'Comprehensive accredited higher education institution in Ethiopia.'}</p>
          ${inst.history ? `<p class="text-xs sm:text-sm mt-3 leading-relaxed text-on-surface-variant/80 font-serif italic">${inst.history}</p>` : ''}
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-outline-variant/10">
          <div class="p-4 rounded-xl bg-surface-container-low border border-outline-variant/10">
            <span class="text-xs text-on-surface-variant">Campus Location</span>
            <div class="text-sm font-bold text-primary mt-1">${inst.city}, ${inst.region}</div>
          </div>
          <div class="p-4 rounded-xl bg-surface-container-low border border-outline-variant/10">
            <span class="text-xs text-on-surface-variant">Official Portal</span>
            <div class="text-sm font-bold text-[#10B981] mt-1">
              <a href="${inst.website_url || '#'}" target="_blank" class="hover:underline flex items-center gap-1">Visit Portal <span class="material-symbols-outlined text-[14px]">open_in_new</span></a>
            </div>
          </div>
          <div class="p-4 rounded-xl bg-surface-container-low border border-outline-variant/10">
            <span class="text-xs text-on-surface-variant">Institutional Contact</span>
            <div class="text-sm font-bold text-primary mt-1">${inst.email || 'info@' + (inst.slug || 'university') + '.edu.et'}</div>
          </div>
        </div>
      </div>
    `;
  }

  if (tab === 'departments') {
    return `
      <div>
        <h3 class="text-base font-bold text-primary mb-4 font-headline-md">Faculties & Academic Divisions</h3>
        ${data && data.length > 0 ? `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${data.map(f => `
              <div class="p-4 rounded-xl border border-outline-variant/15 bg-surface-container-low">
                <h4 class="font-bold text-sm text-[#10B981] flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[16px]">folder</span> ${f.name}
                </h4>
                <p class="text-xs text-on-surface-variant mt-1">${f.description || 'Academic faculty division.'}</p>
              </div>
            `).join('')}
          </div>
        ` : '<p class="text-xs text-on-surface-variant">Loading academic divisions...</p>'}
      </div>
    `;
  }

  if (tab === 'programs') {
    return `
      <div>
        <h3 class="text-base font-bold text-primary mb-4 font-headline-md">Degree Offerings</h3>
        ${data && data.length > 0 ? `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${data.map(p => `
              <div onclick="window.gibiApp.navigate('/programs/' + '${p.id}');" class="p-4 rounded-xl border border-outline-variant/15 bg-surface-container-low hover:border-[#10B981] transition cursor-pointer">
                <div class="flex items-center justify-between mb-1.5">
                  <span class="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-purple-500/20 text-purple-300">
                    ${p.degree_level || 'Degree'}
                  </span>
                  <span class="text-xs text-on-surface-variant">⏱ ${p.duration || '4 Years'}</span>
                </div>
                <h4 class="font-bold text-sm text-primary">${p.name}</h4>
                <p class="text-xs text-on-surface-variant mt-1 line-clamp-2">${p.description || 'Program curriculum.'}</p>
              </div>
            `).join('')}
          </div>
        ` : '<p class="text-xs text-on-surface-variant">Loading degree offerings...</p>'}
      </div>
    `;
  }

  if (tab === 'admissions') {
    return `
      <div class="space-y-4">
        <h3 class="text-base font-bold text-primary font-headline-md">Admissions Requirements & Windows</h3>
        ${data && data.length > 0 ? `
          ${data.map(adm => `
            <div class="p-4 rounded-xl border border-outline-variant/15 bg-surface-container-low">
              <div class="flex items-center justify-between mb-2">
                <span class="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-purple-500/20 text-purple-300">${adm.degree_level} Intake</span>
                <span class="text-xs text-amber-400 font-bold">Deadline: ${adm.application_end || '2026-08-31'}</span>
              </div>
              <p class="text-xs font-semibold text-primary mb-1">Entrance Criteria:</p>
              <p class="text-xs text-on-surface-variant">${adm.requirements || 'National examination scores required.'}</p>
              ${adm.documents ? `
                <div class="mt-2 text-xs text-on-surface-variant">
                  <span class="font-bold text-primary">Required Documents:</span> ${adm.documents}
                </div>
              ` : ''}
            </div>
          `).join('')}
        ` : '<p class="text-xs text-on-surface-variant">Loading admissions criteria...</p>'}
      </div>
    `;
  }

  if (tab === 'tuition') {
    return `
      <div>
        <h3 class="text-base font-bold text-primary mb-4 font-headline-md">Tuition Fees Schedule</h3>
        ${data && data.length > 0 ? `
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="uppercase text-[10px] bg-surface-container-low text-on-surface-variant">
                <tr><th class="p-3">Program Offering</th><th class="p-3">Degree Level</th><th class="p-3">Tuition Fee</th><th class="p-3">Billing Cycle</th></tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/10">
                ${data.map(t => `
                  <tr>
                    <td class="p-3 font-semibold text-primary">${t.program_name || 'Standard Curriculum'}</td>
                    <td class="p-3"><span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-purple-500/20 text-purple-300">${t.degree_level || 'Undergraduate'}</span></td>
                    <td class="p-3 font-bold text-[#10B981]">${Number(t.amount).toLocaleString()} ${t.currency || 'ETB'}</td>
                    <td class="p-3 text-on-surface-variant">${t.period ? t.period.replace('_', ' ') : 'per year'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : '<p class="text-xs text-on-surface-variant">Loading tuition schedule...</p>'}
      </div>
    `;
  }

  if (tab === 'scholarships') {
    return `
      <div>
        <h3 class="text-base font-bold text-primary mb-4 font-headline-md">Institutional Scholarships & Grants</h3>
        ${data && data.length > 0 ? `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${data.map(s => `
              <div class="p-4 rounded-xl border border-outline-variant/15 bg-surface-container-low">
                <span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500/20 text-amber-300">Grant</span>
                <h4 class="font-bold text-sm mt-1 text-primary">${s.name}</h4>
                <p class="text-xs text-[#10B981] font-bold mt-0.5">${s.funding || 'Tuition Aid'}</p>
                <p class="text-xs text-on-surface-variant mt-2">${s.description}</p>
              </div>
            `).join('')}
          </div>
        ` : '<p class="text-xs text-on-surface-variant">Loading scholarships...</p>'}
      </div>
    `;
  }

  if (tab === 'facilities') {
    return `
      <div>
        <h3 class="text-base font-bold text-primary mb-4 font-headline-md">Campus Facilities & Specialized Infrastructure</h3>
        ${data && data.length > 0 ? `
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            ${data.map(fac => `
              <div class="rounded-xl overflow-hidden border border-outline-variant/15 bg-surface-container-low">
                <div class="h-28 relative bg-slate-800">
                  <img src="https://images.unsplash.com/photo-1568667256549-094345857637?w=600" alt="${fac.name}" class="w-full h-full object-cover">
                  <span class="absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-900/90 text-amber-300">
                    ${fac.type}
                  </span>
                </div>
                <div class="p-3">
                  <h4 class="font-bold text-xs text-primary">${fac.name}</h4>
                  <p class="text-[11px] text-on-surface-variant mt-1 line-clamp-2">${fac.description}</p>
                </div>
              </div>
            `).join('')}
          </div>
        ` : '<p class="text-xs text-on-surface-variant">Loading campus facilities...</p>'}
      </div>
    `;
  }

  if (tab === 'resources') {
    return `
      <div>
        <h3 class="text-base font-bold text-primary mb-4 font-headline-md">Institutional Educational Materials</h3>
        ${data && data.length > 0 ? `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${data.map(r => `
              <div class="p-4 rounded-xl border border-outline-variant/15 bg-surface-container-low flex items-center justify-between">
                <div>
                  <span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-indigo-500/20 text-indigo-300">${r.file_extension}</span>
                  <h4 class="font-bold text-xs mt-1 text-primary line-clamp-1">${r.title}</h4>
                </div>
                <div class="flex gap-1.5">
                  <a href="/api/resources/${r.id}/stream" target="_blank" class="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary transition text-xs" title="Stream Preview">
                    <span class="material-symbols-outlined text-[16px]">visibility</span>
                  </a>
                  <a href="/api/resources/${r.id}/download" target="_blank" class="p-1.5 rounded-lg bg-[#10B981] hover:bg-[#0da271] text-slate-950 transition text-xs font-bold" title="Download">
                    <span class="material-symbols-outlined text-[16px]">download</span>
                  </a>
                </div>
              </div>
            `).join('')}
          </div>
        ` : '<p class="text-xs text-on-surface-variant">Loading institutional resources...</p>'}
      </div>
    `;
  }

  if (tab === 'calendar') {
    return `
      <div>
        <h3 class="text-base font-bold text-primary mb-4 font-headline-md">Academic Calendar Milestones</h3>
        ${data && data.length > 0 ? `
          <div class="space-y-3">
            ${data.map(c => `
              <div class="p-3.5 rounded-xl border border-outline-variant/15 bg-surface-container-low flex items-center justify-between">
                <div>
                  <span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-purple-500/20 text-purple-300">${c.event_type}</span>
                  <h4 class="font-bold text-xs mt-1 text-primary">${c.title}</h4>
                </div>
                <span class="text-xs text-amber-400 font-bold">${c.start_date}</span>
              </div>
            `).join('')}
          </div>
        ` : '<p class="text-xs text-on-surface-variant">Loading calendar milestones...</p>'}
      </div>
    `;
  }

  return `<p class="text-xs text-on-surface-variant">Content loaded.</p>`;
}
