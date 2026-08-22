/**
 * ST-Network Admissions & Cutoffs Frontend Logic
 */

const ADMISSIONS_DATA = [
  {
    id: 'aau-undergrad-2026',
    title: 'Addis Ababa University — Regular Undergraduate Admissions',
    institution: 'Addis Ababa University',
    city: 'Addis Ababa',
    region: 'Addis Ababa',
    type: 'University',
    ownership: 'Public',
    degree: 'Bachelor',
    mode: 'Regular',
    year: '2026 / 2027',
    deadline: 'October 15, 2026',
    daysLeft: 54,
    cutoff: 'National Entrance Exam Score ≥ 380 (Natural) / 365 (Social)',
    tuition: 'Government Cost Sharing',
    isVerified: true,
    description: 'General admission for first-year undergraduate students enrolling in engineering, medicine, computing sciences, business, and humanities faculties.',
    eligibility: [
      'ESCE (Ethiopian Secondary Education Certificate Examination) completed',
      'National University Entrance Exam minimum cutoff score achieved',
      'Natural Science stream background for Engineering, Medicine, and Computing programs',
      'Grade 12 transcript cumulative GPA of 3.0 or higher'
    ],
    documents: [
      'Original and copy of National Grade 12 Certificate',
      'Grade 9-12 Student Report Cards / Official Transcripts',
      'Valid National Kebele ID or Ethiopian Passport',
      'Two recent passport-size photographs',
      'Bank receipt of registration fee (where applicable)'
    ],
    procedure: [
      'Review Department cutoff criteria on the ST-Network Portal.',
      'Submit academic dossier via the Ministry of Education centralized placement or AAU direct registration portal.',
      'Attend departmental orientation and complete campus biometric verification.',
      'Sign the national cost-sharing agreement at the Registrar Office.'
    ]
  },
  {
    id: 'astu-engineering-2026',
    title: 'Adama Science & Technology University — Engineering & STEM Intake',
    institution: 'Adama Science & Technology University',
    city: 'Adama',
    region: 'Oromia',
    type: 'University',
    ownership: 'Public',
    degree: 'Bachelor',
    mode: 'Regular',
    year: '2026 / 2027',
    deadline: 'September 28, 2026',
    daysLeft: 37,
    cutoff: 'National STEM Cutoff ≥ 410 + ASTU Institutional Aptitude Exam',
    tuition: 'Government Cost Sharing',
    isVerified: true,
    description: 'Elite center of excellence admissions for Mechanical, Electrical, Chemical, Civil, and Software Engineering degree tracks.',
    eligibility: [
      'Top 10th percentile in National Mathematics and Physics examinations',
      'Pass the ASTU Institutional STEM Aptitude Evaluation',
      'Natural Science stream candidate with proven analytical aptitude'
    ],
    documents: [
      'National Examination Certificate',
      'High School Transcripts with Dean verification stamp',
      'ASTU Aptitude Examination Admit Slip',
      'National ID / Kebele Identification Card'
    ],
    procedure: [
      'Register for the ASTU Institutional Aptitude Exam online.',
      'Take the on-campus assessment at Adama Main Campus.',
      'Check selection status and departmental allocation results on the university board.'
    ]
  },
  {
    id: 'unity-computing-2026',
    title: 'Unity University — Computing & Business Degree Admissions',
    institution: 'Unity University',
    city: 'Addis Ababa',
    region: 'Addis Ababa',
    type: 'University',
    ownership: 'Private',
    degree: 'Bachelor',
    mode: 'Regular',
    year: '2026 / 2027',
    deadline: 'November 05, 2026',
    daysLeft: 75,
    cutoff: 'National Exam Pass Mark or Diploma Equivalent Transfer',
    tuition: '4,200 ETB per credit hour',
    isVerified: true,
    description: 'Direct enrollment for BSc in Computer Science, Management Information Systems, and Business Administration at Gerji Campus.',
    eligibility: [
      'Completed secondary education meeting Ministry of Education private university cutoff',
      'Or Level IV TVET Diploma with COC verification for advance standing entry'
    ],
    documents: [
      'Grade 12 Official Certificate',
      'Level IV COC Certificate (if diploma transfer)',
      'Identification Document'
    ],
    procedure: [
      'Complete online application form on Unity University admissions portal.',
      'Submit transcripts for evaluation at Gerji Admissions Office.',
      'Pay semester registration fees and complete course selection.'
    ]
  },
  {
    id: 'aau-msc-ai-2026',
    title: 'AAU School of IT — Master of Science in Artificial Intelligence',
    institution: 'Addis Ababa University',
    city: 'Addis Ababa',
    region: 'Addis Ababa',
    type: 'University',
    ownership: 'Public',
    degree: 'Master',
    mode: 'Extension',
    year: '2026 / 2027',
    deadline: 'October 30, 2026',
    daysLeft: 69,
    cutoff: 'Undergraduate CGPA ≥ 3.0 in Computing / Engineering + GAT Exam Pass',
    tuition: '1,800 ETB per credit hour',
    isVerified: true,
    description: 'Postgraduate program covering machine learning, natural language processing, computer vision, and neural networks.',
    eligibility: [
      'BSc degree in Computer Science, Software Engineering, or related technical field',
      'Pass the National Graduate Admission Test (NGAT / GAT)',
      'Minimum undergraduate CGPA of 3.00'
    ],
    documents: [
      'Official BSc Degree & Student Copy Transcripts sent directly from former institution',
      'National GAT Score Report certificate',
      'Two academic/professional recommendation letters',
      'Statement of Purpose / Research Proposal outline'
    ],
    procedure: [
      'Take and clear the National GAT Exam.',
      'Submit postgraduate application dossier via AAU Registrar Portal.',
      'Attend departmental interview and presentation if shortlisted.'
    ]
  }
];

document.addEventListener('DOMContentLoaded', () => {
  // Page detection
  if (document.getElementById('admissions-list-container')) {
    initAdmissionsListPage();
  } else if (document.getElementById('admission-hero-card')) {
    initAdmissionProfilePage();
  }
});

function initAdmissionsListPage() {
  const container = document.getElementById('admissions-list-container');
  const countText = document.getElementById('admissions-count-text');
  const searchInput = document.getElementById('admission-search-input');
  const searchBtn = document.getElementById('admission-search-btn');
  const regionSelect = document.getElementById('region-select');
  const sortSelect = document.getElementById('admissions-sort-select');
  const resetBtn = document.getElementById('reset-admissions-filter');

  function render(list) {
    container.innerHTML = '';
    countText.innerHTML = `Showing <strong>${list.length}</strong> Active Admissions`;

    if (list.length === 0) {
      container.innerHTML = `
        <div class="col-span-full p-8 text-center bg-white rounded-2xl border border-slate-200">
          <p class="text-sm font-semibold text-slate-700">No admissions found matching your filters.</p>
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
            <div class="flex items-center gap-1.5">
              <span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">${item.degree}</span>
              <span class="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">${item.mode}</span>
            </div>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${item.daysLeft < 40 ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}">
              ${item.daysLeft} days left
            </span>
          </div>

          <h3 class="text-base font-bold text-slate-900 leading-snug line-clamp-2 hover:text-blue-600 cursor-pointer">
            <a href="Admission_profile.html?id=${item.id}">${item.title}</a>
          </h3>

          <p class="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
            <span>🏛️ ${item.institution}</span>
            <span>•</span>
            <span>📍 ${item.city}</span>
          </p>

          <p class="text-xs text-slate-600 line-clamp-2 mt-3 leading-relaxed">
            ${item.description}
          </p>

          <div class="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] space-y-1">
            <div class="flex items-center justify-between text-slate-600">
              <span class="font-medium">Cutoff:</span>
              <span class="font-bold text-slate-800 text-right truncate max-w-[65%]">${item.cutoff}</span>
            </div>
            <div class="flex items-center justify-between text-slate-600">
              <span class="font-medium">Deadline:</span>
              <span class="font-bold text-red-600">${item.deadline}</span>
            </div>
          </div>
        </div>

        <div class="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
          <span class="text-[11px] text-slate-500 font-medium">Year: ${item.year}</span>
          <a href="Admission_profile.html?id=${item.id}" class="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
            Full Profile <span>&rarr;</span>
          </a>
        </div>
      `;
      container.appendChild(card);
    });
  }

  function applyFilters() {
    const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedRegion = regionSelect ? regionSelect.value : '';
    
    // Checked types
    const checkedTypes = Array.from(document.querySelectorAll('input[name="type"]:checked')).map(cb => cb.value);
    const checkedDegrees = Array.from(document.querySelectorAll('input[name="degree"]:checked')).map(cb => cb.value);
    const checkedModes = Array.from(document.querySelectorAll('input[name="mode"]:checked')).map(cb => cb.value);

    let filtered = ADMISSIONS_DATA.filter(item => {
      const matchSearch = !searchVal || 
        item.title.toLowerCase().includes(searchVal) || 
        item.institution.toLowerCase().includes(searchVal);
      const matchRegion = !selectedRegion || item.region === selectedRegion;
      const matchType = checkedTypes.length === 0 || checkedTypes.includes(item.type);
      const matchDegree = checkedDegrees.length === 0 || checkedDegrees.includes(item.degree);
      const matchMode = checkedModes.length === 0 || checkedModes.includes(item.mode);

      return matchSearch && matchRegion && matchType && matchDegree && matchMode;
    });

    if (sortSelect && sortSelect.value === 'name') {
      filtered.sort((a, b) => a.institution.localeCompare(b.institution));
    } else {
      filtered.sort((a, b) => a.daysLeft - b.daysLeft);
    }

    render(filtered);
  }

  // Event Listeners
  document.querySelectorAll('.filter-checkbox').forEach(cb => cb.addEventListener('change', applyFilters));
  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (searchBtn) searchBtn.addEventListener('click', applyFilters);
  if (regionSelect) regionSelect.addEventListener('change', applyFilters);
  if (sortSelect) sortSelect.addEventListener('change', applyFilters);
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      document.querySelectorAll('.filter-checkbox').forEach(cb => cb.checked = true);
      if (searchInput) searchInput.value = '';
      if (regionSelect) regionSelect.value = '';
      applyFilters();
    });
  }

  render(ADMISSIONS_DATA);
}

function initAdmissionProfilePage() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id') || 'aau-undergrad-2026';
  const data = ADMISSIONS_DATA.find(item => item.id === id) || ADMISSIONS_DATA[0];

  document.getElementById('profile-title').textContent = data.title;
  document.getElementById('profile-institution').innerHTML = `
    <span>🏛️ ${data.institution}</span>
    <span>•</span>
    <span>📍 ${data.city}, ${data.region} (${data.ownership} ${data.type})</span>
  `;
  document.getElementById('profile-degree-badge').textContent = data.degree;
  document.getElementById('profile-mode-badge').textContent = data.mode;
  document.getElementById('profile-year').textContent = data.year;
  document.getElementById('profile-deadline').textContent = data.deadline;
  document.getElementById('profile-cutoff').textContent = data.cutoff;
  document.getElementById('profile-tuition').textContent = data.tuition;

  // Eligibility
  const elList = document.getElementById('profile-eligibility-list');
  elList.innerHTML = '';
  data.eligibility.forEach(crit => {
    const li = document.createElement('li');
    li.className = 'flex items-start gap-2';
    li.innerHTML = `<span class="text-emerald-500 font-bold">✓</span> <span>${crit}</span>`;
    elList.appendChild(li);
  });

  // Documents
  const docList = document.getElementById('profile-documents-list');
  docList.innerHTML = '';
  data.documents.forEach(doc => {
    const li = document.createElement('li');
    li.className = 'flex items-start gap-2';
    li.innerHTML = `<span class="text-blue-500 font-bold">•</span> <span>${doc}</span>`;
    docList.appendChild(li);
  });

  // Procedures
  const procDiv = document.getElementById('profile-procedure-steps');
  procDiv.innerHTML = '';
  data.procedure.forEach((step, idx) => {
    const stepEl = document.createElement('div');
    stepEl.className = 'p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-start gap-3';
    stepEl.innerHTML = `
      <div class="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
        ${idx + 1}
      </div>
      <p class="text-xs text-slate-700 leading-relaxed">${step}</p>
    `;
    procDiv.appendChild(stepEl);
  });

  const aiBtn = document.getElementById('profile-ask-ai-btn');
  if (aiBtn) {
    aiBtn.addEventListener('click', () => {
      window.location.href = `/ai?query=What+are+the+cutoff+scores+and+admissions+steps+for+${encodeURIComponent(data.institution)}`;
    });
  }
}
