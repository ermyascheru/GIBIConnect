/**
 * ST-Network Scholarships & Grants Frontend Logic
 * Higher Education Scholarships
 */

const SCHOLARSHIPS_DATA = [
  {
    id: 'stem-excellence-grant-2026',
    title: 'National Higher Education STEM Excellence Grant',
    coverage: 'Full Tuition',
    amount: '100% Tuition Waiver + 2,500 ETB Monthly Living Allowance',
    provider: 'Ministry of Education / AAU Partnership',
    institution: 'Addis Ababa University',
    degree: 'Undergraduate',
    field: 'STEM, Computing & Engineering',
    deadline: 'September 30, 2026',
    daysLeft: 39,
    status: 'Open',
    description: 'Premier governmental merit scholarship awarded to outstanding high school graduates entering accredited undergraduate STEM degree curricula.',
    eligibility: [
      'Ethiopian national with verified national entrance examination certificate',
      'Entrance examination cumulative score in top 5th percentile nationally',
      'Enrolled or formally admitted into an accredited STEM or Information Technology degree track',
      'Commitment to maintain minimum semester GPA of 3.25 throughout duration'
    ],
    documents: [
      'Official National Grade 12 Certificate and Score Transcript',
      'Formal Letter of Admission / Department Acceptance',
      'Two letters of academic endorsement from secondary school mentors',
      'Certified copy of Kebele ID / Passport'
    ],
    procedure: 'Submit your completed application dossier via the ST-Network scholarship desk or present credentials at the AAU Student Financial Services Bureau.'
  },
  {
    id: 'astu-innovation-fellowship-2026',
    title: 'ASTU Center of Excellence Engineering Fellowship',
    coverage: 'Full Tuition',
    amount: '100% Tuition Coverage + Campus Dormitory & Research Stipend',
    provider: 'ASTU Industrial Research Fund',
    institution: 'Adama Science & Technology University',
    degree: 'Undergraduate',
    field: 'Applied Engineering & Robotics',
    deadline: 'October 10, 2026',
    daysLeft: 49,
    status: 'Open',
    description: 'Designed to accelerate technical innovators in software development, mechatronics, renewable energy systems, and automotive engineering.',
    eligibility: [
      'Top score in ASTU Institutional Engineering Aptitude Exam',
      'Demonstrated project or science fair innovation track record',
      'Full-time student commitment'
    ],
    documents: [
      'ASTU Aptitude Evaluation Certificate',
      'Project portfolio / technical innovation abstract',
      'Official Grade 12 results transcript'
    ],
    procedure: 'Upload technical portfolio and secondary school transcripts through the ASTU Fellowship Registry before October 10.'
  },
  {
    id: 'unity-merit-scholarship-2026',
    title: 'Unity University Academic Merit Grant',
    coverage: 'Partial',
    amount: '50% Semester Tuition Grant for 4 Years',
    provider: 'Unity University Foundation',
    institution: 'Unity University',
    degree: 'Undergraduate',
    field: 'Business Administration & IT',
    deadline: 'November 15, 2026',
    daysLeft: 85,
    status: 'Open',
    description: 'Partial merit tuition grant enabling qualified students to pursue business and computer science degrees at Unity University.',
    eligibility: [
      'Minimum Grade 12 score above regional average',
      'Strong extracurricular leadership background'
    ],
    documents: [
      'Grade 12 Certificate',
      'Application Essay (500 words)',
      'Character reference letter'
    ],
    procedure: 'Submit application along with personal statement to Unity University Registrar Office.'
  },
  {
    id: 'postgrad-research-grant-2026',
    title: 'Ethiopian Postgraduate Artificial Intelligence Research Grant',
    coverage: 'Tuition Waiver',
    amount: 'Full Graduate Tuition Waiver + 15,000 ETB Annual Thesis Grant',
    provider: 'Artificial Intelligence Institute of Ethiopia',
    institution: 'Addis Ababa University',
    degree: 'Master',
    field: 'AI & Data Science',
    deadline: 'October 25, 2026',
    daysLeft: 64,
    status: 'Open',
    description: 'Graduate fellowship providing research funding and full tuition support for master thesis candidates in machine learning and data engineering.',
    eligibility: [
      'Enrolled in Master of Science in AI / Software Engineering',
      'Approved thesis proposal addressing local challenges in healthcare, agriculture, or linguistics'
    ],
    documents: [
      'BSc Degree Transcript (CGPA ≥ 3.2)',
      'Approved Research Proposal Concept Note',
      'Curriculum Vitae (CV)'
    ],
    procedure: 'Submit concept note through the GIBIConnect AI Grant Portal.'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('scholarships-list-container')) {
    initScholarshipsListPage();
  } else if (document.getElementById('scholarship-hero-card')) {
    initScholarshipProfilePage();
  }
});

function initScholarshipsListPage() {
  const container = document.getElementById('scholarships-list-container');
  const countText = document.getElementById('scholarships-count-text');
  const searchInput = document.getElementById('scholarship-search-input');
  const searchBtn = document.getElementById('scholarship-search-btn');
  const sortSelect = document.getElementById('scholarships-sort-select');
  const resetBtn = document.getElementById('reset-scholarships-filter');

  function render(list) {
    container.innerHTML = '';
    countText.innerHTML = `Showing <strong>${list.length}</strong> Active Scholarships`;

    if (list.length === 0) {
      container.innerHTML = `
        <div class="col-span-full p-8 text-center bg-white rounded-2xl border border-slate-200">
          <p class="text-sm font-semibold text-slate-700">No scholarships found matching your filters.</p>
          <p class="text-xs text-slate-500 mt-1">Try resetting your filters or modifying search keywords.</p>
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
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              ${item.coverage}
            </span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${item.daysLeft < 40 ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}">
              Closes in ${item.daysLeft}d
            </span>
          </div>

          <h3 class="text-base font-bold text-slate-900 leading-snug line-clamp-2 hover:text-emerald-700 cursor-pointer">
            <a href="scholarship_profile.html?id=${item.id}">${item.title}</a>
          </h3>

          <p class="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
            <span>🏛️ ${item.provider}</span>
          </p>

          <div class="mt-3 p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100 text-[11px] flex items-center justify-between">
            <span class="font-bold text-emerald-900">Grant Value:</span>
            <span class="font-bold text-emerald-950 text-right truncate max-w-[65%]">${item.amount}</span>
          </div>

          <p class="text-xs text-slate-600 line-clamp-2 mt-3 leading-relaxed">
            ${item.description}
          </p>
        </div>

        <div class="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
          <span class="text-[11px] text-slate-500 font-medium">Target: ${item.degree}</span>
          <a href="scholarship_profile.html?id=${item.id}" class="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1">
            Apply Details <span>&rarr;</span>
          </a>
        </div>
      `;
      container.appendChild(card);
    });
  }

  function applyFilters() {
    const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const checkedCoverage = Array.from(document.querySelectorAll('input[name="coverage"]:checked')).map(cb => cb.value);
    const checkedDegree = Array.from(document.querySelectorAll('input[name="degree"]:checked')).map(cb => cb.value);

    let filtered = SCHOLARSHIPS_DATA.filter(item => {
      const matchSearch = !searchVal || 
        item.title.toLowerCase().includes(searchVal) || 
        item.provider.toLowerCase().includes(searchVal) ||
        item.field.toLowerCase().includes(searchVal);
      const matchCoverage = checkedCoverage.length === 0 || checkedCoverage.includes(item.coverage);
      const matchDegree = checkedDegree.length === 0 || checkedDegree.includes(item.degree);

      return matchSearch && matchCoverage && matchDegree;
    });

    if (sortSelect && sortSelect.value === 'amount') {
      filtered.sort((a, b) => b.coverage.localeCompare(a.coverage));
    } else {
      filtered.sort((a, b) => a.daysLeft - b.daysLeft);
    }

    render(filtered);
  }

  document.querySelectorAll('.filter-checkbox').forEach(cb => cb.addEventListener('change', applyFilters));
  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (searchBtn) searchBtn.addEventListener('click', applyFilters);
  if (sortSelect) sortSelect.addEventListener('change', applyFilters);
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      document.querySelectorAll('.filter-checkbox').forEach(cb => cb.checked = true);
      if (searchInput) searchInput.value = '';
      applyFilters();
    });
  }

  render(SCHOLARSHIPS_DATA);
}

function initScholarshipProfilePage() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id') || 'stem-excellence-grant-2026';
  const data = SCHOLARSHIPS_DATA.find(item => item.id === id) || SCHOLARSHIPS_DATA[0];

  document.getElementById('scholarship-title').textContent = data.title;
  document.getElementById('scholarship-provider').textContent = `🏛️ Sponsored by ${data.provider}`;
  document.getElementById('scholarship-coverage-badge').textContent = data.coverage;
  document.getElementById('scholarship-target-badge').textContent = data.degree;
  document.getElementById('scholarship-amount').textContent = data.amount;
  document.getElementById('scholarship-deadline').textContent = data.deadline;
  document.getElementById('scholarship-field').textContent = data.field;
  document.getElementById('scholarship-instructions').textContent = data.procedure;

  // Eligibility
  const elList = document.getElementById('scholarship-eligibility-list');
  elList.innerHTML = '';
  data.eligibility.forEach(crit => {
    const li = document.createElement('li');
    li.className = 'flex items-start gap-2';
    li.innerHTML = `<span class="text-emerald-500 font-bold">✓</span> <span>${crit}</span>`;
    elList.appendChild(li);
  });

  // Documents
  const docList = document.getElementById('scholarship-documents-list');
  docList.innerHTML = '';
  data.documents.forEach(doc => {
    const li = document.createElement('li');
    li.className = 'flex items-start gap-2';
    li.innerHTML = `<span class="text-blue-500 font-bold">•</span> <span>${doc}</span>`;
    docList.appendChild(li);
  });

  const aiBtn = document.getElementById('scholarship-ask-ai-btn');
  if (aiBtn) {
    aiBtn.addEventListener('click', () => {
      window.location.href = `/ai?query=Am+I+eligible+for+the+${encodeURIComponent(data.title)}+scholarship?`;
    });
  }
}
