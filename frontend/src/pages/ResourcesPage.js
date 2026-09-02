import { store } from '../state/store.js';
import { renderNavbar } from '../components/Navbar.js';
import { renderFooter } from '../components/Footer.js';
import { apiCall } from '../api/client.js';

let resDebounce = null;

export async function loadResourcesData(forced = false) {
  if (store.resources.length === 0 || forced) {
    store.isLoading = true;
    window.gibiApp.render();
    const queryParams = new URLSearchParams({ page: 1, limit: 50 });
    if (store.filters.resourceSearch.trim()) queryParams.set('q', store.filters.resourceSearch.trim());

    const res = await apiCall('/resources?' + queryParams.toString());
    store.isLoading = false;
    if (res.success && res.data) {
      store.resources = res.data;
    }
    window.gibiApp.render();
  }
}

export function renderResourcesPage() {
  loadResourcesData();

  return `
    ${renderNavbar()}
    <main class="flex-grow w-full max-w-7xl mx-auto px-4 md:px-6 pt-20 pb-8 flex flex-col gap-6">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-3 pb-3 border-b border-outline-variant/10">
        <div>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#10B981] border border-emerald-200/60 dark:border-emerald-800/50 text-[11px] font-bold mb-1.5 shadow-2xs">
            <span class="material-symbols-outlined text-[15px]">folder</span> Academic Library
          </div>
          <h1 class="font-headline-lg text-xl sm:text-2xl font-extrabold text-primary tracking-tight">
            Educational Materials & Documents
          </h1>
          <p class="font-body-md text-xs text-on-surface-variant max-w-2xl mt-0.5 leading-relaxed">
            Multi-format course guides, lecture documents, spreadsheets, and recordings across Ethiopian faculties.
          </p>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="bg-surface-container-lowest rounded-xl p-3 shadow-2xs border border-outline-variant/15">
        <div class="relative w-full group">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-[#10B981] transition-colors text-[18px]">search</span>
          <input 
            type="text" 
            placeholder="Search resources by title, category, or file format..." 
            value="${store.filters.resourceSearch}" 
            oninput="
              store.filters.resourceSearch = this.value;
              clearTimeout(resDebounce);
              resDebounce = setTimeout(() => { loadResourcesData(true); }, 200);
            "
            class="w-full bg-surface-container-low focus:bg-surface-container-lowest rounded-lg border-none pl-9 pr-8 py-2 text-xs text-on-surface focus:ring-2 focus:ring-[#10B981] transition-all outline-none"
          >
        </div>
      </div>

      <!-- Resource Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        ${store.resources.map(r => `
          <div class="p-4 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest hover:border-[#10B981]/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-indigo-500/20 text-indigo-300">
                  ${r.file_extension}
                </span>
                <span class="text-[11px] text-on-surface-variant font-mono">${r.file_size_formatted || 'Document'}</span>
              </div>
              <h3 class="font-bold text-sm text-primary group-hover:text-[#10B981] transition line-clamp-1">${r.title}</h3>
              <p class="text-xs text-on-surface-variant mt-1.5 line-clamp-2">${r.description || 'Verified course document.'}</p>
            </div>
            <div class="mt-4 pt-3 border-t border-outline-variant/10 flex items-center justify-between">
              <span class="text-[11px] text-on-surface-variant truncate max-w-[120px]">${r.institution_name || 'Verified Resource'}</span>
              <div class="flex gap-2">
                <a href="/api/resources/${r.id}/stream" target="_blank" class="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary transition text-xs font-bold flex items-center gap-1" title="Stream Preview">
                  <span class="material-symbols-outlined text-[15px]">visibility</span> Preview
                </a>
                <a href="/api/resources/${r.id}/download" target="_blank" class="px-2.5 py-1.5 rounded-lg bg-[#10B981] hover:bg-[#0da271] text-slate-950 transition text-xs font-bold flex items-center gap-1" title="Direct Download">
                  <span class="material-symbols-outlined text-[15px]">download</span> Get
                </a>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </main>
    ${renderFooter()}
  `;
}
