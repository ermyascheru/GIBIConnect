import { getResources } from './api.js';

let searchQuery = '';

async function loadResources() {
  const grid = document.getElementById('resources-grid');
  const res = await getResources({ q: searchQuery, limit: 50 });
  if (res.success && res.data && grid) {
    grid.innerHTML = res.data.map(r => `
      <div class="p-4 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest hover:border-[#10B981]/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-indigo-500/20 text-indigo-300">${r.file_extension}</span>
            <span class="text-[11px] text-on-surface-variant font-mono">${r.file_size_formatted || 'Document'}</span>
          </div>
          <h3 class="font-bold text-sm text-primary group-hover:text-[#10B981] transition line-clamp-1">${r.title}</h3>
          <p class="text-xs text-on-surface-variant mt-1.5 line-clamp-2">${r.description || 'Verified course document.'}</p>
        </div>
        <div class="mt-4 pt-3 border-t border-outline-variant/10 flex items-center justify-between">
          <span class="text-[11px] text-on-surface-variant truncate max-w-[120px]">${r.institution_name || 'Verified Resource'}</span>
          <div class="flex gap-2">
            <button onclick="window.previewResource('${r.id}', '${(r.title || '').replace(/'/g, "\\'")}', '${r.file_extension}', '${(r.institution_name || '').replace(/'/g, "\\'")}')" class="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary transition text-xs font-bold flex items-center gap-1 cursor-pointer" title="Stream Preview">
              <span class="material-symbols-outlined text-[15px]">visibility</span> Preview
            </button>
            <button onclick="window.downloadResource('${r.id}', '${(r.original_filename || r.title || 'resource').replace(/'/g, "\\'")}')" class="px-2.5 py-1.5 rounded-lg bg-[#10B981] hover:bg-[#0da271] text-slate-950 transition text-xs font-bold flex items-center gap-1 cursor-pointer" title="Direct Download">
              <span class="material-symbols-outlined text-[15px]">download</span> Get
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }
}

export function previewResource(id, title, ext, instName) {
  const modal = document.getElementById('resource-preview-modal');
  const iframe = document.getElementById('modal-preview-iframe');
  const titleEl = document.getElementById('modal-res-title');
  const instEl = document.getElementById('modal-res-inst');
  const extEl = document.getElementById('modal-res-ext');
  const dlBtn = document.getElementById('modal-res-dl-btn');

  if (titleEl) titleEl.textContent = title;
  if (instEl) instEl.textContent = instName || 'Verified Higher Education Material';
  if (extEl) extEl.textContent = (ext || 'PDF').toUpperCase();
  if (iframe) iframe.src = `/api/resources/${id}/stream`;
  if (dlBtn) {
    dlBtn.onclick = () => downloadResource(id, `${title}.${ext || 'pdf'}`);
  }

  if (modal) modal.classList.remove('hidden');
}

export function closePreviewModal() {
  const modal = document.getElementById('resource-preview-modal');
  const iframe = document.getElementById('modal-preview-iframe');
  if (iframe) iframe.src = 'about:blank';
  if (modal) modal.classList.add('hidden');
}

export function downloadResource(id, filename) {
  const token = localStorage.getItem('gibi_token');
  const link = document.createElement('a');
  link.href = `/api/resources/${id}/download`;
  link.setAttribute('download', filename || 'resource');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

window.previewResource = previewResource;
window.closePreviewModal = closePreviewModal;
window.downloadResource = downloadResource;

function initResources() {
  const searchInput = document.getElementById('res-search-input');
  if (searchInput) {
    let deb = null;
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      clearTimeout(deb);
      deb = setTimeout(loadResources, 200);
    });
  }
  loadResources();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initResources);
} else {
  initResources();
}
