import { store } from '../state/store.js';
import { themeState } from '../state/theme.js';
import { renderNavbar } from '../components/Navbar.js';
import { apiCall } from '../api/client.js';

export async function loadResearchData() {
  if (store.research.length === 0) {
    store.isLoading = true;
    window.gibiApp.render();
    const res = await apiCall('/research?limit=50');
    store.isLoading = false;
    if (res.success && res.data) {
      store.research = res.data;
      window.gibiApp.render();
    }
  }
}

export function renderResearchPage() {
  loadResearchData();
  const isDark = themeState.current === 'dark';

  return `
    ${renderNavbar()}
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}">
          Scientific Research & Publications
        </h1>
        <p class="text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'} font-serif italic">
          Graduate theses, peer-reviewed articles, and conference papers from Ethiopian institutions.
        </p>
      </div>

      <div class="space-y-4">
        ${store.research.map(paper => `
          <div class="rounded-2xl p-6 border transition hover:shadow-xl ${isDark ? 'bg-[#2D323E] border-slate-700 hover:border-indigo-500/40' : 'bg-white border-slate-200 hover:border-indigo-400 shadow-sm'}">
            <div class="flex items-center gap-2 mb-2">
              <span class="px-2 py-0.5 text-[9px] font-bold rounded uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                ${paper.research_type || 'Paper'}
              </span>
              <span class="text-xs text-slate-400">Year: ${paper.publication_year || 2026}</span>
              ${paper.doi ? `<span class="text-xs text-indigo-400 font-mono">DOI: ${paper.doi}</span>` : ''}
            </div>

            <h3 class="font-bold text-lg leading-snug ${isDark ? 'text-white' : 'text-slate-900'}">${paper.title}</h3>
            <p class="text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}">${paper.abstract || 'Scientific research publication abstract.'}</p>

            <div class="mt-4 pt-3 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'} flex items-center justify-between text-xs">
              <div class="text-slate-400 font-serif italic">
                Affiliation: <span class="font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}">${paper.institution_name || 'Addis Ababa University'}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </main>
  `;
}
