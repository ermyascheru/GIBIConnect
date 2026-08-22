/**
 * GIBIConnect Resources & Institutional Documents Frontend Logic
 */

const RESOURCES_DATA = [
  {
    id: 'res-aau-admission-guide-2026',
    title: 'AAU 2026/2027 Official Admission & Cutoff Handbook',
    category: 'Admission Guide',
    institution: 'Addis Ababa University',
    format: 'PDF',
    size: '2.8 MB',
    date: 'August 14, 2026',
    downloads: 1420,
    isVerified: true,
    description: 'Complete institutional guidelines containing department cutoffs, registration timelines, semester cost sharing tables, and campus accommodation details for all university faculties.'
  },
  {
    id: 'res-astu-engineering-curriculum',
    title: 'ASTU School of Engineering 4-Year Curriculum Handbook',
    category: 'Curriculum',
    institution: 'Adama Science & Technology University',
    format: 'PDF',
    size: '4.1 MB',
    date: 'July 28, 2026',
    downloads: 980,
    isVerified: true,
    description: 'Detailed modular course outlines, ECTS credit distributions, laboratory requirements, and senior capstone guidelines for all undergraduate engineering tracks.'
  },
  {
    id: 'res-national-stem-form',
    title: 'National STEM Merit Scholarship Application Form & Dossier Guide',
    category: 'Scholarship Form',
    institution: 'Ministry of Education',
    format: 'DOCX',
    size: '640 KB',
    date: 'August 02, 2026',
    downloads: 2150,
    isVerified: true,
    description: 'Official standard application document and endorsement template required when applying for governmental higher education STEM funding.'
  },
  {
    id: 'res-aau-academic-calendar-2026',
    title: 'AAU Academic Calendar & Examination Schedules (2026/2027)',
    category: 'Academic Calendar',
    institution: 'Addis Ababa University',
    format: 'PDF',
    size: '1.1 MB',
    date: 'August 18, 2026',
    downloads: 3200,
    isVerified: true,
    description: 'Semester 1 & 2 course add/drop periods, mid-term examinations, final semester dates, thesis defense weeks, and university graduation ceremonies.'
  },
  {
    id: 'res-unity-accreditation-report',
    title: 'Unity University HERQA Institutional Accreditation Summary',
    category: 'Policy Report',
    institution: 'Unity University',
    format: 'PDF',
    size: '1.9 MB',
    date: 'June 10, 2026',
    downloads: 450,
    isVerified: true,
    description: 'Official higher education quality assurance audit report confirming accredited degree-granting status across computing, accounting, and health disciplines.'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  initResourcesPage();
});

function initResourcesPage() {
  const container = document.getElementById('resources-list-container');
  const countText = document.getElementById('resources-count-text');
  const searchInput = document.getElementById('resource-search-input');
  const searchBtn = document.getElementById('resource-search-btn');
  const institutionSelect = document.getElementById('resource-institution-select');
  const sortSelect = document.getElementById('resources-sort-select');
  const resetBtn = document.getElementById('reset-resources-filter');

  // Preview Modal elements
  const previewModal = document.getElementById('document-preview-modal');
  const closePreviewBtn = document.getElementById('close-preview-btn');
  const modalCloseAction = document.getElementById('modal-close-action');
  const modalDownloadAction = document.getElementById('modal-download-action');

  // Upload Modal elements
  const uploadModal = document.getElementById('upload-resource-modal');
  const openUploadBtn = document.getElementById('open-upload-modal-btn');
  const closeUploadBtn = document.getElementById('close-upload-btn');
  const cancelUploadBtn = document.getElementById('cancel-upload-btn');
  const uploadForm = document.getElementById('resource-upload-form');

  let activePreviewItem = null;

  function render(list) {
    container.innerHTML = '';
    countText.innerHTML = `Showing <strong>${list.length}</strong> Verified Resources`;

    if (list.length === 0) {
      container.innerHTML = `
        <div class="col-span-full p-8 text-center bg-white rounded-2xl border border-slate-200">
          <p class="text-sm font-semibold text-slate-700">No educational resources found.</p>
          <p class="text-xs text-slate-500 mt-1">Try selecting another category or resetting filters.</p>
        </div>
      `;
      return;
    }

    list.forEach(item => {
      const card = document.createElement('div');
      card.className = 'bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between';
      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between gap-2 mb-2">
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              ${item.category}
            </span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
              ${item.format} • ${item.size}
            </span>
          </div>

          <h3 class="text-base font-bold text-slate-900 leading-snug line-clamp-2 hover:text-blue-600 cursor-pointer preview-trigger" data-id="${item.id}">
            ${item.title}
          </h3>

          <p class="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
            <span>🏛️ ${item.institution}</span>
          </p>

          <p class="text-xs text-slate-600 line-clamp-2 mt-3 leading-relaxed">
            ${item.description}
          </p>
        </div>

        <div class="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
          <span class="text-[11px] text-slate-400">📥 ${item.downloads.toLocaleString()} downloads</span>
          <div class="flex items-center gap-2">
            <button class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold preview-trigger cursor-pointer" data-id="${item.id}">
              Preview
            </button>
            <button class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs download-trigger cursor-pointer" data-id="${item.id}">
              Download
            </button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    // Attach click events
    document.querySelectorAll('.preview-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openPreview(id);
      });
    });

    document.querySelectorAll('.download-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        triggerDownload(id);
      });
    });
  }

  function openPreview(id) {
    const item = RESOURCES_DATA.find(r => r.id === id);
    if (!item) return;

    activePreviewItem = item;
    document.getElementById('preview-category').textContent = item.category;
    document.getElementById('preview-title').textContent = item.title;
    document.getElementById('preview-description').textContent = item.description;
    document.getElementById('preview-format').textContent = `${item.format} Document`;
    document.getElementById('preview-size').textContent = item.size;

    previewModal.classList.remove('hidden');
    previewModal.classList.add('flex');
  }

  function closePreview() {
    previewModal.classList.add('hidden');
    previewModal.classList.remove('flex');
    activePreviewItem = null;
  }

  function triggerDownload(id) {
    const item = RESOURCES_DATA.find(r => r.id === id) || activePreviewItem;
    if (!item) return;

    // Simulate verified backend download response
    alert(`Downloading verified file: "${item.title}" (${item.format}, ${item.size})\nAuthorized by ST-Network Backend API.`);
  }

  function applyFilters() {
    const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedInst = institutionSelect ? institutionSelect.value : '';
    const checkedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value);
    const checkedFormats = Array.from(document.querySelectorAll('input[name="format"]:checked')).map(cb => cb.value);

    let filtered = RESOURCES_DATA.filter(item => {
      const matchSearch = !searchVal || 
        item.title.toLowerCase().includes(searchVal) || 
        item.institution.toLowerCase().includes(searchVal) ||
        item.category.toLowerCase().includes(searchVal);
      const matchInst = !selectedInst || item.institution === selectedInst;
      const matchCategory = checkedCategories.length === 0 || checkedCategories.includes(item.category);
      const matchFormat = checkedFormats.length === 0 || checkedFormats.includes(item.format);

      return matchSearch && matchInst && matchCategory && matchFormat;
    });

    if (sortSelect && sortSelect.value === 'downloads') {
      filtered.sort((a, b) => b.downloads - a.downloads);
    } else {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    render(filtered);
  }

  // Filter Listeners
  document.querySelectorAll('.filter-checkbox').forEach(cb => cb.addEventListener('change', applyFilters));
  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (searchBtn) searchBtn.addEventListener('click', applyFilters);
  if (institutionSelect) institutionSelect.addEventListener('change', applyFilters);
  if (sortSelect) sortSelect.addEventListener('change', applyFilters);
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      document.querySelectorAll('.filter-checkbox').forEach(cb => cb.checked = true);
      if (searchInput) searchInput.value = '';
      if (institutionSelect) institutionSelect.value = '';
      applyFilters();
    });
  }

  // Preview Modal triggers
  if (closePreviewBtn) closePreviewBtn.addEventListener('click', closePreview);
  if (modalCloseAction) modalCloseAction.addEventListener('click', closePreview);
  if (modalDownloadAction) {
    modalDownloadAction.addEventListener('click', () => {
      if (activePreviewItem) triggerDownload(activePreviewItem.id);
      closePreview();
    });
  }

  // Upload Modal triggers
  if (openUploadBtn) {
    openUploadBtn.addEventListener('click', () => {
      uploadModal.classList.remove('hidden');
      uploadModal.classList.add('flex');
    });
  }
  if (closeUploadBtn) closeUploadBtn.addEventListener('click', () => uploadModal.classList.add('hidden'));
  if (cancelUploadBtn) cancelUploadBtn.addEventListener('click', () => uploadModal.classList.add('hidden'));

  if (uploadForm) {
    uploadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('upload-title').value;
      const category = document.getElementById('upload-category').value;
      const institution = document.getElementById('upload-institution').value;

      uploadModal.classList.add('hidden');
      alert(`Resource "${title}" (${category} - ${institution}) submitted successfully!\nStatus: Pending Institutional Verification before publication.`);
      uploadForm.reset();
    });
  }

  render(RESOURCES_DATA);
}
