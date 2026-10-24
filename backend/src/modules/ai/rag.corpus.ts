/**
 * GIBIConnect — Verified Ethiopian Higher Education & Freshman Syllabus Corpus
 * Only chunks with verificationStatus = 'VERIFIED' are eligible for RAG injection.
 */

import type { RAGDocumentChunk, ConceptNode, TutorQuizQuestion, TutorFlashcard } from './ai.types.js';

export const VERIFIED_RAG_CORPUS: RAGDocumentChunk[] = [
  // ============================================================================
  // 0. GIBICONNECT PLATFORM ARCHITECTURE, DATABASE COUNTS & FEATURES
  // ============================================================================
  {
    id: 'chunk-gibi-stats-01',
    institutionCode: 'MOE',
    domain: 'PLATFORM_METADATA',
    sourceTitle: 'GIBIConnect Official Higher Education Database Registry & System Metrics',
    pageNumber: 1,
    chunkIndex: 1,
    academicYear: '2016/2017 E.C.',
    verificationStatus: 'VERIFIED',
    keywords: ['gibiconnect', 'gibi', 'connect', 'how many', 'universities', 'institutions', 'database', 'count', 'total', 'records', 'programs', 'resources', 'curriculum', 'features'],
    content: `GIBIConnect Official Database Registry Statistics:
1. Higher Education Institutions: GIBIConnect currently accounts for and indexes exactly 18 verified higher education institutions across Ethiopia:
   - 16 Major Public Universities: Addis Ababa University (AAU), Adama Science and Technology University (ASTU), Jimma University (JU), Hawassa University (HU), Bahir Dar University (BDU), University of Gondar (UoG), Mekelle University (MU), Haramaya University (HU), Arba Minch University (AMU), Dilla University (DU), Wolaita Sodo University (WSU), Wolkite University (WKU), Ambo University, Debre Berhan University (DBU), Debre Markos University (DMU), and Dire Dawa University (DDU).
   - 2 Accredited Private Institutions: St. Mary's University and Addis Ababa Medical and Business College.
2. Academic Programs: 114 accredited degree programs covering Engineering, Computer Science, Health Sciences, Business, Natural Sciences, and Social Sciences.
3. Admissions & Cutoff Records: 116 entrance criteria, quota thresholds, and affirmative action points.
4. Academic Resources Vault: 39 educational files (university curricula PDFs, lecture notes, previous exam papers, and research datasets).
5. Scholarships: 14 national merit, STEM access, and university tuition support opportunities.
6. Academic Calendar & Events: 40 official semester dates, national exit exam schedules, and research symposiums.
7. Peer Tutors: Curated network of verified Ethiopian university peer tutors for 1-on-1 freshman STEM mentoring.`
  },
  {
    id: 'chunk-gibi-features-01',
    institutionCode: 'MOE',
    domain: 'PLATFORM_METADATA',
    sourceTitle: 'GIBIConnect Platform Features, Services & Capabilities Guide',
    pageNumber: 2,
    chunkIndex: 2,
    academicYear: '2016/2017 E.C.',
    verificationStatus: 'VERIFIED',
    keywords: ['features', 'capabilities', 'services', 'other than', 'besides', 'modules', 'vault', 'resources', 'past exams', 'tutor', 'marketplace', 'cost sharing', 'calculator', 'events', 'calendar', 'ai advisor'],
    content: `GIBIConnect Comprehensive Features and Modules (Beyond University Profiles):
1. Document & Resource Vault: A digital repository of 39 real academic materials including university curricula PDFs, semester lecture notes, previous exam papers, and syllabus guidelines across faculties.
2. Academic Programs & Degree Explorer: Search 114 degree programs by faculty, duration, ECTS credits, and career pathways.
3. EUEE Admissions & Cutoff Predictor: Evaluates matriculation scores against official Ministry of Education thresholds (gender quotas and regional affirmative action accommodations).
4. Statutory Cost-Sharing Calculator: Computes student tuition liabilities, dormitory fees, and cafeteria meal costs under Ethiopian Proclamation No. 650/2009 and Regulation No. 154/2008 with post-graduation repayment schedules.
5. Peer Tutor Marketplace: Connects students with top-performing peer tutors from AAiT, ASTU, Hawassa, and Jimma for 1-on-1 tutoring in Calculus, Physics, Programming, and Economics.
6. Academic Events & Calendar Tracker: Live tracker for national exit exams, university application deadlines, campus hackathons, STEM workshops, and academic conferences.
7. 6-Stage AI STEM Tutor & Admissions Advisor: An intelligent multi-modal assistant providing admissions advisory and structured 6-stage lessons for freshman STEM courses (MATH1011, PHYS1011, COSC1011, CHEM1011).`
  },

  {
    id: 'chunk-moe-cutoff-01',
    institutionCode: 'MOE',
    domain: 'ADMISSIONS',
    sourceTitle: 'Ministry of Education National Placement & EUEE Cutoff Directive',
    pageNumber: 22,
    chunkIndex: 1,
    academicYear: '2016/2017 E.C.',
    verificationStatus: 'VERIFIED',
    keywords: ['euee', 'esee', 'cutoff', 'cut-off', 'matriculation', 'score', 'natural', 'social', 'female', 'male', 'affirmative', 'emerging', 'developing', 'moe', 'passmark', 'passmarks', 'pass mark'],
    content: `Ministry of Education (MoE) 2016/2017 E.C. National University Entrance Examination (EUEE/ESEE) Eligibility & Placement Thresholds:
1. General Public University Entry Pass Mark (out of 700 / 600 scale normalized):
   - Natural Science Stream: Minimum 360 points for Male candidates; 345 points for Female candidates; 330 points for applicants from Emerging/Developing Regions (Afar, Somali, Benishangul-Gumuz, Gambella) and pastoralist woredas.
   - Social Science Stream: Minimum 340 points for Male candidates; 325 points for Female candidates; 310 points for Emerging Regions.
   - Applicants with documented physical disabilities receive an additional 15-point affirmative accommodation across both streams.
2. High-Demand First-Generation Research Universities require higher competitive campus placement scores based on national ranking and seat quotas.`
  },
  {
    id: 'chunk-moe-costsharing-01',
    institutionCode: 'MOE',
    domain: 'PROCLAMATION_FINANCE',
    sourceTitle: 'Ethiopian Higher Education Proclamation No. 650/2009 & Council of Ministers Cost-Sharing Regulation No. 154/2008',
    pageNumber: 8,
    chunkIndex: 1,
    academicYear: '2016/2017 E.C.',
    verificationStatus: 'VERIFIED',
    keywords: ['cost-sharing', 'cost', 'sharing', 'tuition', 'proclamation', '650/2009', 'repayment', 'tax', 'salary', '15%', 'cafeteria', 'dormitory', 'stipend', 'extension', 'fee'],
    content: `National Cost-Sharing Scheme (Proclamation No. 650/2009 & Regulation No. 154/2008):
1. Regular Undergraduate Students at Public Universities:
   - 100% of upfront tuition, dormitory accommodation, and campus cafeteria meals are covered by the Federal Government of Ethiopia during study.
   - Students sign a Cost-Sharing Beneficiary Agreement at registration each academic year.
   - Cost-sharing breakdown: Beneficiaries share 15% of estimated instructional tuition cost plus 100% of food and boarding expenses (or may opt for a monthly cash stipend in lieu of cafeteria/dormitory services, typically 1,200–1,800 ETB/month depending on campus).
2. Post-Graduation Repayment Rules:
   - Repayment begins one year after graduation upon securing formal employment.
   - Deducted monthly by the employer alongside income tax at a minimum rate of 10% (and up to 15% for graduate/medical tracks) of gross monthly salary until the total deferred balance is settled.
   - Education and Health graduates who serve in designated public rural institutions may qualify for service-in-kind waivers.`
  },

  // ============================================================================
  // 2. ADDIS ABABA UNIVERSITY (AAU) CATALOG & CUTOFFS
  // ============================================================================
  {
    id: 'chunk-aau-admissions-01',
    institutionCode: 'AAU',
    domain: 'UNIVERSITY_CATALOG',
    sourceTitle: 'Addis Ababa University (AAU) Registrar & AAiT Admissions Bulletin',
    pageNumber: 6,
    chunkIndex: 1,
    academicYear: '2016/2017 E.C.',
    verificationStatus: 'VERIFIED',
    keywords: ['aau', 'addis ababa university', 'aait', '5 kilo', 'sidist kilo', 'tikur anbessa', 'medicine', 'software engineering', 'computer science', 'law', 'cutoff', 'uet', 'extension'],
    content: `Addis Ababa University (AAU) — Autonomous Research University Admissions & Cut-Offs (2016/2017 E.C.):
1. Doctor of Medicine (MD) — Tikur Anbessa (Black Lion) College of Health Sciences:
   - Male Cut-Off: 540+ points | Female Cut-Off: 520+ points | Developing Region Quota: 495+ points.
   - Duration: 6.0 Years (360 ECTS) including 1-Year full-time clinical hospital internship. Annual intake quota: ~180 students.
2. B.Sc. in Software Engineering & Electrical/Computer Engineering — AAiT (5 Kilo Campus):
   - Male Cut-Off: 495+ points | Female Cut-Off: 475+ points | Developing Region Quota: 450+ points.
   - Duration: 5.0 Years (10 Semesters, 300 ECTS) including mandatory 6-month industrial internship in Year 4 Semester 2.
3. B.Sc. in Computer Science — College of Natural & Computational Sciences (4 Kilo Campus):
   - Male Cut-Off: 485+ points | Female Cut-Off: 465+ points. Duration: 4.0 Years (240 ECTS).
4. LL.B. in Law (Sidist Kilo Campus):
   - Male Cut-Off: 470+ points | Female Cut-Off: 450+ points. Duration: 5.0 Years (300 ECTS).
5. Extension (Evening) & Weekend Tuition Rates at AAU (Applies to Engineering, Computing & Business; NOT Medicine):
   - Undergraduate Extension: 750 ETB per credit hour for Engineering/Computing (AAiT) and 650 ETB per credit hour for Business/Social Sciences.
   - Master's (MBA/M.Sc.) Regular & Extension: 1,250–1,450 ETB per credit hour.
   - Note on Medicine: Doctor of Medicine (MD) is a full-time clinical hospital program and is NOT offered through evening or weekend extension credit-hour schemes.`
  },
  {
    id: 'chunk-aau-medicine-tuition-01',
    institutionCode: 'AAU',
    domain: 'PROCLAMATION_FINANCE',
    sourceTitle: 'Addis Ababa University (AAU) Tikur Anbessa College of Health Sciences Tuition & Cost-Sharing Bulletin',
    pageNumber: 3,
    chunkIndex: 1,
    academicYear: '2016/2017 E.C.',
    verificationStatus: 'VERIFIED',
    keywords: ['aau', 'medicine', 'md', 'tuition', 'credit-hour', 'credit', 'payment', 'month', 'monthly', 'tikur anbessa', 'cost-sharing', 'doctor of medicine', 'ects', '60 ects', 'health sciences', 'fee'],
    content: `Addis Ababa University (AAU) — Doctor of Medicine (MD) Tuition Policy, Credit-Hour Structure & Payment Schedule:
1. Academic Program Structure:
   - Program: Doctor of Medicine (MD), College of Health Sciences (Tikur Anbessa Hospital).
   - Duration: 6.0 Years (12 Semesters, 360 ECTS total; standard annual load: 60 ECTS, or 30 ECTS per semester).
2. Tuition Fees and Monthly Payment Breakdown:
   - Regular Government-Placed Students: Under the National Cost-Sharing Scheme (Proclamation No. 650/2009 & Council of Ministers Regulation No. 154/2008), 100% of upfront tuition, student dormitory housing, and campus cafeteria dining are fully covered by the Federal Government of Ethiopia during active studies. Placed regular students pay 0 ETB per month and 0 ETB per credit hour upfront while enrolled. Repayment starts 1 year after graduation upon securing formal employment, deducted monthly by employers at up to 15% of gross salary.
   - Billing Schedule: Addis Ababa University does NOT bill students on a monthly payment schedule. All university instructional fees (when applicable) are assessed per semester at registration, NOT on a monthly billing cycle.
   - Extension & Part-Time Medicine: AAU does NOT offer the Doctor of Medicine (MD) clinical program through evening/weekend extension credit schemes. Extension rates (750 ETB/credit for Engineering/Computing and 650 ETB/credit for Business) do NOT apply to Medicine.
   - Self-Sponsored Direct Tuition Benchmark (where authorized for non-subsidized quotas): The institutional benchmark is assessed per academic year (~27,800 ETB per year, representing ~463 ETB per ECTS over a 60-ECTS annual load). For monthly budgeting calculations, this equals approximately 2,317 ETB/month (total annual tuition divided by 12 months), though the university bills per semester (13,900 ETB/semester), never monthly.`
  },

  // ============================================================================
  // 3. ADAMA SCIENCE AND TECHNOLOGY UNIVERSITY (ASTU) & AASTU
  // ============================================================================
  {
    id: 'chunk-astu-catalog-01',
    institutionCode: 'ASTU',
    domain: 'UNIVERSITY_CATALOG',
    sourceTitle: 'ASTU Academic Catalog & Applied Engineering Admission Bulletin',
    pageNumber: 14,
    chunkIndex: 1,
    academicYear: '2016/2017 E.C.',
    verificationStatus: 'VERIFIED',
    keywords: ['astu', 'adama', 'science and technology', 'software engineering', 'cse', 'computer science', 'cutoff', 'entrance', 'exam', 'engineering'],
    content: `Adama Science and Technology University (ASTU) — Center of Excellence Admissions & Curricula (2016/2017 E.C.):
1. Specialized Entrance & Cut-Offs:
   - ASTU and AASTU are Ethiopia's two dedicated Science & Technology Universities operating under specialized STEM mandates.
   - B.Sc. in Software Engineering / Computer Science & Engineering (CSE):
     • Male Cut-Off: 485+ points | Female Cut-Off: 460+ points | Developing Regions: 440+ points.
   - B.Sc. in Mechanical, Civil, Chemical, and Electrical Power & Control Engineering:
     • Male Cut-Off: 465+ points | Female Cut-Off: 445+ points.
2. Academic Structure:
   - Common Year-1 Applied Engineering & Pre-Engineering foundation across all natural science entrants.
   - Competitive department placement at the end of Year 1 based on Freshman CGPA (Software Engineering & CSE typically require 3.50+ CGPA for males, 3.25+ CGPA for females).
   - Duration: 5.0 Years (300 ECTS). Extension tuition: 650 ETB per credit hour.`
  },
  {
    id: 'chunk-aastu-catalog-01',
    institutionCode: 'AASTU',
    domain: 'UNIVERSITY_CATALOG',
    sourceTitle: 'Addis Ababa Science and Technology University (AASTU) Kilinto Registrar Guide',
    pageNumber: 11,
    chunkIndex: 1,
    academicYear: '2016/2017 E.C.',
    verificationStatus: 'VERIFIED',
    keywords: ['aastu', 'kilinto', 'software engineering', 'electromechanical', 'biotechnology', 'mining', 'architecture', 'cutoff'],
    content: `Addis Ababa Science and Technology University (AASTU — Kilinto Campus) Admissions & Programs (2016/2017 E.C.):
1. Admissions Cut-Offs (Natural Science Stream Only):
   - Software Engineering & Artificial Intelligence Track: Male 490+ | Female 470+ points.
   - Architecture & Urban Planning: Male 480+ | Female 460+ points (plus spatial aptitude evaluation).
   - Electromechanical, Biotechnology, Environmental & Mining Engineering: Male 460+ | Female 440+ points.
2. Industry Linkage & Centers of Excellence:
   - Houses 8 National Centers of Excellence including Artificial Intelligence & Robotics, Nanotechnology, Sustainable Energy, and Construction Technology.
   - Regular undergraduate students are 100% covered under Proclamation No. 650/2009 Cost-Sharing. Extension rate: 700 ETB/credit.`
  },

  // ============================================================================
  // 4. UNIVERSITY OF GONDAR (UOG), JIMMA (JU), BAHIR DAR (BDU), HAWASSA (HU)
  // ============================================================================
  {
    id: 'chunk-uog-admissions-01',
    institutionCode: 'UOG',
    domain: 'UNIVERSITY_CATALOG',
    sourceTitle: 'University of Gondar (UoG) Registrar & Institute of Technology (IoT) Admission Bulletin',
    pageNumber: 8,
    chunkIndex: 1,
    academicYear: '2016/2017 E.C.',
    verificationStatus: 'VERIFIED',
    keywords: ['uog', 'gondar', 'goder', 'university of gondar', 'maraki', 'teda', 'atse fasil', 'engineering', 'cutoff', 'cut-off', 'software engineering', 'civil engineering', 'electrical', 'mechanical', 'iot', 'institute of technology', 'medicine'],
    content: `University of Gondar (UoG) — Admissions Thresholds & Department Cut-Offs (2016/2017 E.C.):
1. Institute of Technology (IoT — Maraki & Atse Fasil Campuses) Engineering Programs:
   - Faculty of Informatics / Software Engineering & Computer Science:
     • Male Cut-Off: 465+ points | Female Cut-Off: 445+ points | Developing Regions: 420+ points.
   - B.Sc. in Civil, Electrical & Computer, and Mechanical Engineering:
     • Male Cut-Off: 450+ points | Female Cut-Off: 430+ points | Developing Regions: 410+ points.
   - Common Pre-Engineering Freshman placement: Secondary competitive assignment at end of Year 1 requires a minimum Freshman CGPA of 3.20+ for Software/Civil Engineering.
2. College of Medicine & Health Sciences (Teda & Comprehensive Specialized Hospital):
   - Doctor of Medicine (MD): Male Cut-Off: 520+ points | Female Cut-Off: 500+ points | Developing Regions: 485+ points.
   - Optometry (O.D.) & Pharmacy: Male Cut-Off: 465+ points | Female Cut-Off: 445+ points.
   - Physical Therapy & Rehabilitation: Male Cut-Off: 440+ points | Female Cut-Off: 420+ points.
3. Cost-Sharing: Placed regular students enjoy 100% tuition, dormitory, and cafeteria support under Proclamation No. 650/2009.`
  },
  {
    id: 'chunk-regional-univ-01',
    institutionCode: 'JU',
    domain: 'UNIVERSITY_CATALOG',
    sourceTitle: 'Jimma, Bahir Dar, Hawassa & University of Gondar Comparative Academic Directory',
    pageNumber: 19,
    chunkIndex: 1,
    academicYear: '2016/2017 E.C.',
    verificationStatus: 'VERIFIED',
    keywords: ['jimma', 'ju', 'bahir dar', 'bdu', 'hawassa', 'hu', 'gondar', 'goder', 'uog', 'haramaya', 'cbe', 'medicine', 'engineering', 'textile', 'maritime', 'agriculture', 'cutoff'],
    content: `First-Generation Ethiopian Public Research Universities Comparative Guide (2016/2017 E.C.):
1. University of Gondar (UoG):
   - College of Medicine & Health Sciences (established 1954): Medicine cut-off Male 520+ | Female 500+.
   - Institute of Technology (IoT) Engineering (Civil, Electrical, Mechanical, Software): Male 450–465+ | Female 430–445+.
2. Jimma University (JU):
   - National pioneer in Community-Based Education (CBE) where students conduct field research in rural communities every academic year.
   - Doctor of Medicine (Jimma University Medical Center - JUMC): Male 525+ | Female 505+.
   - Software Engineering & Computing (Kito Furdisa Institute of Technology): Male 465+ | Female 445+.
3. Bahir Dar University (BDU):
   - Home to Bahir Dar Institute of Technology (BiT), Ethiopian Institute of Textile and Fashion Technology (EiTEX), and the Ethiopian Maritime Training Institute on Lake Tana.
   - Medicine (Tibebe Ghion Specialized Hospital): Male 520+ | Female 500+.
   - Software & Electrical Engineering (BiT Poly Campus): Male 470+ | Female 450+.
4. Hawassa University (HU):
   - Hawassa University excels in Forestry, Agricultural Sciences, Agribusiness, Law, and Engineering: Engineering cut-off Male 455+ | Female 435+.`
  },
  {
    id: 'chunk-dmu-admissions-01',
    institutionCode: 'DMU',
    domain: 'UNIVERSITY_CATALOG',
    sourceTitle: 'Debre Markos University (DMU) Admissions & Department Guide',
    pageNumber: 14,
    chunkIndex: 1,
    academicYear: '2016/2017 E.C.',
    verificationStatus: 'VERIFIED',
    keywords: ['debre markos', 'derbre markos', 'dmu', 'debremarkos', 'cutoff', 'cut-off', 'admissions', 'engineering', 'medicine'],
    content: `Debre Markos University (DMU) — Admissions Thresholds & Curricula (2016/2017 E.C.):
1. Entrance Cut-Offs:
   - College of Health Sciences / Medicine: Male Cut-Off: 510+ points | Female Cut-Off: 490+ points.
   - Institute of Technology (IoT) Engineering (Civil, Electrical, Mechanical, Software): Male Cut-Off: 435+ points | Female Cut-Off: 415+ points.
2. Structure & Financing: Regular undergraduate programs are 100% government-subsidized under Proclamation No. 650/2009 Cost-Sharing.`
  },
  {
    id: 'chunk-ddu-amu-hru-01',
    institutionCode: 'DDU',
    domain: 'UNIVERSITY_CATALOG',
    sourceTitle: 'Dire Dawa, Arba Minch & Haramaya Universities Admissions Guide',
    pageNumber: 22,
    chunkIndex: 1,
    academicYear: '2016/2017 E.C.',
    verificationStatus: 'VERIFIED',
    keywords: ['dire dawa', 'dira dewa', 'ddu', 'arba minch', 'amu', 'haramaya', 'hru', 'awti', 'water technology', 'cutoff', 'cut-off', 'passmark', 'admissions', 'engineering'],
    content: `Dire Dawa, Arba Minch & Haramaya Universities Admissions Cut-Offs (2016/2017 E.C.):
1. Dire Dawa University (DDU):
   - Institute of Technology Engineering & Computing Programs: Male Cut-Off: 435+ points | Female Cut-Off: 415+ points.
2. Arba Minch University (AMU):
   - Arba Minch Water Technology Institute (AWTI) & Engineering: Male Cut-Off: 445+ points | Female Cut-Off: 425+ points.
3. Haramaya University (HRU):
   - College of Agriculture & Environmental Sciences and Institute of Technology: Male Cut-Off: 440+ points | Female Cut-Off: 420+ points.
   - College of Health & Medical Sciences (Hiwot Fana Comprehensive Hospital): Male Cut-Off: 515+ points | Female Cut-Off: 495+ points.
4. Cost-Sharing: 100% upfront government tuition subsidy for all regular placed undergraduates (Proclamation No. 650/2009).`
  },

  // ============================================================================
  // 5. NATIONAL FRESHMAN & UNIVERSITY COURSE SYLLABI (FOR AI TUTOR)
  // ============================================================================
  {
    id: 'chunk-tutor-math1011-01',
    courseCode: 'MATH1011',
    domain: 'FRESHMAN_COURSE',
    sourceTitle: 'MoE Harmonized Freshman Mathematics for Natural Sciences (MATH1011) Module & Syllabus',
    pageNumber: 34,
    chunkIndex: 1,
    academicYear: '2016/2017 E.C.',
    verificationStatus: 'VERIFIED',
    keywords: ['math1011', 'calculus', 'limit', 'derivative', 'differentiation', 'integral', 'integration', 'propositional logic', 'quantifiers', 'matrix', 'determinant', 'conic', 'freshman math'],
    content: `MoE Harmonized Freshman Course: Mathematics for Natural Sciences (MATH1011 — 5 ECTS) & Applied Calculus I (MATH1041):
Chapter 1: Propositional Logic & Set Theory:
  - Compound propositions, truth tables, tautologies ($P \\lor \\neg P$), contrapositive ($\\neg Q \\Rightarrow \\neg P$), and universal/existential quantifiers ($\\forall x, \\exists x$).
Chapter 2: Functions, Limits & Continuity:
  - Formal $\\epsilon-\\delta$ definition of a limit: $\\lim_{x \\to a} f(x) = L$.
  - Standard indeterminate forms ($\\frac{0}{0}, \\frac{\\infty}{\\infty}$), L'Hôpital's Rule: If $\\lim_{x \\to a} f(x) = 0$ and $\\lim_{x \\to a} g(x) = 0$, then $\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\lim_{x \\to a} \\frac{f'(x)}{g'(x)}$.
  - Fundamental Trigonometric Limit: $\\lim_{x \\to 0} \\frac{\\sin(kx)}{x} = k$.
Chapter 3: Derivatives & Applications:
  - First principles definition: $f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$.
  - Chain Rule: $\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)$. Product Rule: $(uv)' = u'v + uv'$.
  - Critical points ($f'(c) = 0$), Second Derivative Test for local extrema ($f''(c) > 0 \\Rightarrow$ local minimum; $f''(c) < 0 \\Rightarrow$ local maximum).
Chapter 4: Definite & Indefinite Integrals:
  - Fundamental Theorem of Calculus: $\\int_a^b f(x)\\,dx = F(b) - F(a)$ where $F'(x) = f(x)$.
  - Integration by Parts: $\\int u\\,dv = uv - \\int v\\,du$.`
  },
  {
    id: 'chunk-tutor-phys1011-01',
    courseCode: 'PHYS1011',
    domain: 'FRESHMAN_COURSE',
    sourceTitle: 'MoE Harmonized General Physics (PHYS1011) Freshman Module & Past Exam Guide',
    pageNumber: 52,
    chunkIndex: 1,
    academicYear: '2016/2017 E.C.',
    verificationStatus: 'VERIFIED',
    keywords: ['phys1011', 'physics', 'kinematics', 'projectile', 'newton', 'work', 'energy', 'momentum', 'coulomb', 'electric field', 'ohm', 'kirchhoff', 'thermodynamics'],
    content: `MoE Harmonized Freshman Course: General Physics (PHYS1011 — 5 ECTS):
1. Kinematics & Projectile Motion:
   - Equations of uniformly accelerated motion: $v = v_0 + at$, $\\Delta x = v_0 t + \\frac{1}{2}at^2$, $v^2 = v_0^2 + 2a\\Delta x$.
   - 2D Projectile Motion (neglecting air resistance, $g = 9.8\\text{ m/s}^2$):
     • Maximum Height: $H_{\\max} = \\frac{v_0^2 \\sin^2\\theta}{2g}$
     • Total Time of Flight: $T = \\frac{2v_0 \\sin\\theta}{g}$
     • Horizontal Range: $R = \\frac{v_0^2 \\sin(2\\theta)}{g}$ (Maximum range occurs at $\\theta = 45^\\circ$).
2. Dynamics, Work-Energy Theorem & Conservation of Momentum:
   - Newton's Second Law: $\\sum \\vec{F} = m\\vec{a}$. Kinetic Friction: $f_k = \\mu_k N$.
   - Work-Energy Theorem: $W_{\\text{net}} = \\Delta K = \\frac{1}{2}mv_f^2 - \\frac{1}{2}mv_i^2$.
   - Conservation of Linear Momentum: $m_1 u_1 + m_2 u_2 = m_1 v_1 + m_2 v_2$ (Elastic collisions also conserve kinetic energy).
3. Electromagnetism & DC Circuits:
   - Coulomb's Law: $F = k_e \\frac{|q_1 q_2|}{r^2}$ where $k_e = 8.99 \\times 10^9\\text{ N}\\cdot\\text{m}^2/\\text{C}^2$.
   - Ohm's Law ($V = IR$) and Kirchhoff's Junction ($\\sum I_{\\text{in}} = \\sum I_{\\text{out}}$) & Loop Rules ($\\sum \\Delta V = 0$).`
  },
  {
    id: 'chunk-tutor-cosc1011-01',
    courseCode: 'COSC1011',
    domain: 'FRESHMAN_COURSE',
    sourceTitle: 'AAiT & ASTU Introduction to Programming & Data Structures (COSC1011 / SEng2021) Syllabus',
    pageNumber: 18,
    chunkIndex: 1,
    academicYear: '2016/2017 E.C.',
    verificationStatus: 'VERIFIED',
    keywords: ['cosc1011', 'programming', 'python', 'c++', 'data structures', 'algorithm', 'big o', 'time complexity', 'binary search', 'sorting', 'recursion', 'linked list', 'tree', 'graph'],
    content: `Ethiopian Engineering & Computing Curriculum: Programming & Data Structures (COSC1011 / SEng2021):
1. Asymptotic Complexity & Big-O Notation:
   - Constant $O(1) <$ Logarithmic $O(\\log n) <$ Linear $O(n) <$ Linearithmic $O(n \\log n) <$ Quadratic $O(n^2) <$ Exponential $O(2^n)$.
   - Binary Search on a sorted array of size $n$ divides the search space in half each iteration: recurrence $T(n) = T(n/2) + O(1) \\Rightarrow O(\\log_2 n)$ time complexity and $O(1)$ iterative space complexity.
2. Sorting Algorithms Comparison:
   - Merge Sort & Heap Sort: Guaranteed $O(n \\log n)$ worst-case time. Merge Sort uses $O(n)$ auxiliary space and is stable.
   - Quick Sort: $O(n \\log n)$ average time, $O(n^2)$ worst-case (mitigated via randomized pivot or median-of-three), $O(\\log n)$ in-place stack space.
3. Core Data Structures:
   - Hash Table: $O(1)$ average lookup/insert/delete, $O(n)$ worst-case on collision chains.
   - Binary Search Tree (AVL / Red-Black Balanced): $O(\\log n)$ search, insertion, and deletion.
   - Graph Traversals: Breadth-First Search (BFS uses a Queue, finds shortest path in unweighted graphs in $O(V + E)$); Depth-First Search (DFS uses a Stack/Recursion in $O(V + E)$).`
  },
  {
    id: 'chunk-tutor-chem1011-01',
    courseCode: 'CHEM1011',
    domain: 'EUEE_PAST_EXAM',
    sourceTitle: 'EUEE & Freshman General Chemistry (CHEM1011) Equilibrium, Acids-Bases & Electrochemistry Guide',
    pageNumber: 41,
    chunkIndex: 1,
    academicYear: '2016/2017 E.C.',
    verificationStatus: 'VERIFIED',
    keywords: ['chem1011', 'chemistry', 'euee chemistry', 'ph', 'buffer', 'henderson-hasselbalch', 'equilibrium', 'le chatelier', 'galvanic', 'nernst', 'oxidation', 'reduction', 'molarity'],
    content: `EUEE National Exam & Freshman General Chemistry (CHEM1011) Core Review:
1. Chemical Equilibrium & Le Chatelier's Principle:
   - For $aA + bB \\rightleftharpoons cC + dD$, the equilibrium constant is $K_c = \\frac{[C]^c[D]^d}{[A]^a[B]^b}$.
   - Relation between $K_p$ and $K_c$: $K_p = K_c(RT)^{\\Delta n}$ where $\\Delta n = (c+d) - (a+b)$ moles of gas.
2. Acid-Base Equilibria & Buffer Solutions:
   - $\\text{pH} = -\\log_{10}[\\text{H}_3\\text{O}^+]$, and at $25^\\circ\\text{C}$, $\\text{pH} + \\text{pOH} = 14$.
   - Henderson-Hasselbalch Equation for Buffer Solutions: $\\text{pH} = \\text{p}K_a + \\log_{10}\\left(\\frac{[\\text{Conjugate Base } A^-]}{[\\text{Weak Acid } HA]}\\right)$.
3. Electrochemistry & Nernst Equation:
   - Standard Cell Potential: $E^\\circ_{\\text{cell}} = E^\\circ_{\\text{cathode (reduction)}} - E^\\circ_{\\text{anode (oxidation)}}$.
   - Nernst Equation at $25^\\circ\\text{C}$: $E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{0.0592}{n} \\log_{10} Q$. A reaction is spontaneous when $E_{\\text{cell}} > 0$ ($\\Delta G^\\circ = -nFE^\\circ_{\\text{cell}} < 0$).`
  }
];

// ============================================================================
// CONCEPT PREREQUISITE KNOWLEDGE GRAPH (PostgreSQL CTE Equivalent)
// ============================================================================
export const CONCEPT_PREREQUISITE_GRAPH: ConceptNode[] = [
  {
    conceptId: 'math-logic-sets',
    courseCode: 'MATH1011',
    title: 'Propositional Logic & Set Theory',
    prerequisites: [],
    difficulty: 'FOUNDATION'
  },
  {
    conceptId: 'math-limits-continuity',
    courseCode: 'MATH1011',
    title: 'Limits, Indeterminate Forms & Continuity',
    prerequisites: ['math-logic-sets'],
    difficulty: 'FOUNDATION'
  },
  {
    conceptId: 'math-derivatives',
    courseCode: 'MATH1011',
    title: 'Derivatives, Chain Rule & Optimization',
    prerequisites: ['math-limits-continuity'],
    difficulty: 'INTERMEDIATE'
  },
  {
    conceptId: 'math-integrals',
    courseCode: 'MATH1011',
    title: 'Definite Integrals & Fundamental Theorem of Calculus',
    prerequisites: ['math-derivatives'],
    difficulty: 'ADVANCED'
  },
  {
    conceptId: 'phys-kinematics-2d',
    courseCode: 'PHYS1011',
    title: '1D & 2D Projectile Motion Kinematics',
    prerequisites: ['math-derivatives'],
    difficulty: 'FOUNDATION'
  },
  {
    conceptId: 'phys-work-energy',
    courseCode: 'PHYS1011',
    title: 'Newtonian Dynamics, Work-Energy & Momentum',
    prerequisites: ['phys-kinematics-2d'],
    difficulty: 'INTERMEDIATE'
  },
  {
    conceptId: 'cs-complexity-search',
    courseCode: 'COSC1011',
    title: 'Big-O Time Complexity & Binary Search',
    prerequisites: ['math-logic-sets'],
    difficulty: 'FOUNDATION'
  },
  {
    conceptId: 'cs-sorting-graphs',
    courseCode: 'COSC1011',
    title: 'Divide-and-Conquer Sorting & Graph Traversal (BFS/DFS)',
    prerequisites: ['cs-complexity-search'],
    difficulty: 'INTERMEDIATE'
  }
];

// ============================================================================
// VERIFIED PRACTICE QUESTION BANK (Grounded in Freshman & EUEE Exams)
// ============================================================================
export const VERIFIED_TUTOR_QUIZ_BANK: TutorQuizQuestion[] = [
  {
    id: 'q-math-01',
    conceptId: 'math-limits-continuity',
    courseCode: 'MATH1011',
    question: 'Evaluate the limit: lim (x -> 0) [ sin(5x) / (2x) ]',
    options: ['0', '5/2', '2/5', 'Infinity'],
    correctOptionIndex: 1,
    explanation: 'Using the fundamental trigonometric limit lim(u->0) sin(u)/u = 1, rewrite sin(5x)/(2x) as (5/2) * [sin(5x)/(5x)]. As x -> 0, sin(5x)/(5x) -> 1, giving (5/2) * 1 = 5/2.',
    hint: 'Multiply numerator and denominator by 5 so the argument inside sin(5x) matches the denominator.',
    difficulty: 'EASY',
    sourceCitation: { title: 'MoE Harmonized Freshman Mathematics (MATH1011) Module', page: 34 }
  },
  {
    id: 'q-math-02',
    conceptId: 'math-derivatives',
    courseCode: 'MATH1011',
    question: 'If f(x) = ln(x^2 + 1), what is the first derivative f\'(x)?',
    options: ['1 / (x^2 + 1)', '2x / (x^2 + 1)', '2x * ln(x^2 + 1)', 'x / (x^2 + 1)'],
    correctOptionIndex: 1,
    explanation: 'By the Chain Rule, d/dx [ln(u)] = u\' / u. Here u = x^2 + 1 and u\' = 2x, so f\'(x) = 2x / (x^2 + 1).',
    hint: 'Apply the chain rule: derivative of ln(u) is (1/u) multiplied by du/dx.',
    difficulty: 'MEDIUM',
    sourceCitation: { title: 'MoE Harmonized Freshman Mathematics (MATH1011) Module', page: 34 }
  },
  {
    id: 'q-phys-01',
    conceptId: 'phys-kinematics-2d',
    courseCode: 'PHYS1011',
    question: 'A projectile is launched from level ground with initial speed v0 = 20 m/s at an angle of 30° above the horizontal (take g = 10 m/s^2). What is the maximum height reached?',
    options: ['5.0 m', '10.0 m', '15.0 m', '20.0 m'],
    correctOptionIndex: 0,
    explanation: 'Maximum height H_max = (v0^2 * sin^2(theta)) / (2g). Since sin(30°) = 0.5, H_max = (400 * 0.25) / (2 * 10) = 100 / 20 = 5.0 m.',
    hint: 'Use the vertical component of velocity v0y = v0 * sin(30°) and H_max = v0y^2 / (2g).',
    difficulty: 'MEDIUM',
    sourceCitation: { title: 'MoE Harmonized General Physics (PHYS1011) Module', page: 52 }
  },
  {
    id: 'q-cs-01',
    conceptId: 'cs-complexity-search',
    courseCode: 'COSC1011',
    question: 'What is the worst-case time complexity of Binary Search on a sorted array of N elements, and how many comparisons at most are needed for N = 1,024?',
    options: ['O(N) — 1,024 comparisons', 'O(log2 N) — at most 11 comparisons', 'O(N log N) — 10,240 comparisons', 'O(1) — 1 comparison'],
    correctOptionIndex: 1,
    explanation: 'Binary search halves the array each step, giving O(log2 N) worst-case time. Since log2(1024) = 10, at most floor(log2(1024)) + 1 = 11 comparisons are required.',
    hint: 'How many times can you divide 1,024 by 2 until only 1 element remains?',
    difficulty: 'EASY',
    sourceCitation: { title: 'AAiT & ASTU Programming & Data Structures (COSC1011) Syllabus', page: 18 }
  },
  {
    id: 'q-chem-01',
    conceptId: 'chem-buffers',
    courseCode: 'CHEM1011',
    question: 'Using the Henderson-Hasselbalch equation, what is the pH of a buffer solution containing 0.10 M acetic acid (pKa = 4.76) and 0.10 M sodium acetate?',
    options: ['2.38', '4.76', '7.00', '9.24'],
    correctOptionIndex: 1,
    explanation: 'pH = pKa + log10([A-]/[HA]). Since [A-] = [HA] = 0.10 M, the ratio is 1, and log10(1) = 0. Thus pH = pKa = 4.76.',
    hint: 'When the molar concentrations of weak acid and conjugate base are equal, log10([A-]/[HA]) = log10(1) = 0.',
    difficulty: 'EASY',
    sourceCitation: { title: 'EUEE & Freshman General Chemistry (CHEM1011) Guide', page: 41 }
  }
];

export const VERIFIED_TUTOR_FLASHCARDS: TutorFlashcard[] = [
  {
    id: 'fc-math-1',
    courseCode: 'MATH1011',
    front: 'State L’Hôpital’s Rule for indeterminate limits.',
    back: 'If lim(x->a) f(x)/g(x) gives 0/0 or ∞/∞ and g\'(x) ≠ 0 near a, then lim(x->a) f(x)/g(x) = lim(x->a) f\'(x)/g\'(x).',
    tag: 'Calculus Limits'
  },
  {
    id: 'fc-phys-1',
    courseCode: 'PHYS1011',
    front: 'Formula for Horizontal Range (R) of a projectile on level ground?',
    back: 'R = (v0^2 * sin(2θ)) / g. Maximum range occurs at launch angle θ = 45°.',
    tag: 'Kinematics'
  },
  {
    id: 'fc-cs-1',
    courseCode: 'COSC1011',
    front: 'When should you use Breadth-First Search (BFS) over Depth-First Search (DFS)?',
    back: 'Use BFS (Queue-based, O(V+E)) to find the shortest path (minimum number of edges) in an unweighted graph.',
    tag: 'Algorithms'
  },
  {
    id: 'fc-chem-1',
    courseCode: 'CHEM1011',
    front: 'What is the Henderson-Hasselbalch equation for an acid buffer?',
    back: 'pH = pKa + log10([Conjugate Base A-] / [Weak Acid HA])',
    tag: 'Acid-Base Equilibrium'
  }
];
