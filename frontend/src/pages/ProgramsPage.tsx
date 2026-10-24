import React, { useState, useMemo } from 'react';
import { 
  Search, BookOpen, Clock, Briefcase, GraduationCap, 
  X, CheckCircle2, ShieldCheck, Award, MapPin, 
  Layers
} from 'lucide-react';
import { ETHIOPIAN_INSTITUTIONS } from '../data/mockInstitutions';

interface ProgramItem {
  id: string;
  name: string;
  institutionCode: string;
  institutionName: string;
  faculty: string;
  degreeLevel: 'BACHELOR' | 'MASTER' | 'PHD';
  stream: 'NATURAL' | 'SOCIAL';
  studyMode: 'REGULAR' | 'EXTENSION' | 'ONLINE' | 'WEEKEND';
  durationYears: number;
  totalCredits: number;
  intakeQuota: number;
  maleCutoff: number;
  femaleCutoff: number;
  tuitionEtbPerCredit: number;
  costSharingEligible: boolean;
  careerPaths: string[];
  description: string;
  curriculumYears: { year: string; title: string; modules: string[] }[];
  admissionRequirements: string[];
}

interface ProgramsPageProps {
  theme?: 'light' | 'dark';
}

export const ProgramsPage: React.FC<ProgramsPageProps> = ({ theme = 'light' }) => {
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [degreeFilter, setDegreeFilter] = useState<'ALL' | 'BACHELOR' | 'MASTER' | 'PHD'>('ALL');
  const [streamFilter, setStreamFilter] = useState<'ALL' | 'NATURAL' | 'SOCIAL'>('ALL');
  const [selectedProgram, setSelectedProgram] = useState<ProgramItem | null>(null);

  // Generate comprehensive program items from verified institutions
  const programs: ProgramItem[] = useMemo(() => {
    const list: ProgramItem[] = [];
    
    ETHIOPIAN_INSTITUTIONS.forEach((inst) => {
      inst.admissions?.forEach((adm, idx) => {
        const isMed = adm.programName.includes('Medicine') || adm.programName.includes('MD');
        const isEng = adm.programName.includes('Engineering');
        const isLaw = adm.programName.includes('Law') || adm.programName.includes('LL.B');
        const isCS = adm.programName.includes('Computer Science');
        const isBiz = adm.programName.includes('Accounting') || adm.programName.includes('Economics') || adm.programName.includes('Management');

        const duration = isMed ? 6 : (isEng || isLaw) ? 5 : 4;
        const credits = isMed ? 360 : (isEng || isLaw) ? 300 : 240;

        let curriculum: { year: string; title: string; modules: string[] }[] = [];

        if (isMed) {
          curriculum = [
            { year: 'Year 1', title: 'Pre-Medical Science', modules: ['Human Gross Anatomy I & II', 'Medical Biochemistry', 'Physiology I', 'Medical Terminology & Ethics'] },
            { year: 'Year 2', title: 'Pre-Clinical Sciences', modules: ['General & Systemic Pathology', 'Medical Microbiology & Immunology', 'Basic Pharmacology', 'Parasitology'] },
            { year: 'Year 3', title: 'Introductory Clinical Skills', modules: ['Clinical Semiology & Physical Diagnosis', 'Community Health Clerkship', 'Forensic Medicine'] },
            { year: 'Year 4', title: 'Junior Clinical Clerkship', modules: ['Internal Medicine Rotation (12 wks)', 'General Surgery Rotation (12 wks)', 'Pediatrics Clerkship (10 wks)'] },
            { year: 'Year 5', title: 'Senior Clinical Clerkship', modules: ['Obstetrics & Gynecology (12 wks)', 'Psychiatry & Mental Health', 'Ophthalmology & ENT Surgery'] },
            { year: 'Year 6', title: 'Comprehensive Hospital Internship', modules: ['Full-Time Inpatient & Emergency Hospital Internship', 'Rural Health Center Community Attachment'] }
          ];
        } else if (isEng) {
          curriculum = [
            { year: 'Year 1', title: 'Freshman Engineering Core', modules: ['Applied Engineering Mathematics I & II', 'General Physics for Engineers', 'Introduction to Computing & Algorithms', 'Engineering Mechanics (Statics)'] },
            { year: 'Year 2', title: 'Departmental Fundamentals', modules: ['Circuit Analysis / Mechanics of Materials', 'Data Structures & OOP', 'Differential Equations', 'Engineering CAD Drafting'] },
            { year: 'Year 3', title: 'Intermediate Engineering Systems', modules: ['Control Systems / Structural Analysis', 'Thermodynamics / Software Architecture', 'Signals & Linear Systems', 'Applied Numerical Methods'] },
            { year: 'Year 4', title: 'Advanced Design & Internship', modules: ['Industrial Internship (6 Months Practicum)', 'System Modeling & Simulation', 'Engineering Economics & Project Management'] },
            { year: 'Year 5', title: 'Senior Capstone & Specialization', modules: ['Senior Capstone Project I & II', 'Specialized Department Electives', 'Professional Ethics & Safety Regulations'] }
          ];
        } else if (isLaw) {
          curriculum = [
            { year: 'Year 1', title: 'Foundations of Jurisprudence', modules: ['Introduction to Law & Legal Methods', 'Constitutional Law I', 'Law of Persons', 'Legal Research & Writing'] },
            { year: 'Year 2', title: 'Substantive Law Principles', modules: ['Law of Contracts I & II', 'Criminal Law (General Principles)', 'Constitutional Law II', 'Property Law & Land Tenure'] },
            { year: 'Year 3', title: 'Commercial & Procedural Law', modules: ['Commercial Law & Banking', 'Criminal Procedure Code', 'Law of Torts', 'International Human Rights Law'] },
            { year: 'Year 4', title: 'Litigation & Trial Advocacy', modules: ['Civil Procedure Code I & II', 'Law of Evidence', 'Tax Law & Ethiopian Customs', 'Legal Clinic & Moot Court'] },
            { year: 'Year 5', title: 'Senior Specialization & Thesis', modules: ['Public International Law & AU Treaties', 'Alternative Dispute Resolution (ADR)', 'Senior Dissertation Thesis'] }
          ];
        } else if (isCS) {
          curriculum = [
            { year: 'Year 1', title: 'Computational Foundations', modules: ['Calculus I & II', 'Fundamentals of Programming (Python/C++)', 'Discrete Mathematics', 'Logic & Critical Thinking'] },
            { year: 'Year 2', title: 'Core Computer Science', modules: ['Data Structures & Algorithms', 'Computer Organization & Architecture', 'Object-Oriented Programming (Java)', 'Probability & Statistics'] },
            { year: 'Year 3', title: 'Systems & Intelligence', modules: ['Database Systems (SQL & NoSQL)', 'Operating Systems & Concurrency', 'Artificial Intelligence', 'Computer Networks & Distributed Systems'] },
            { year: 'Year 4', title: 'Advanced Computing & Senior Thesis', modules: ['Machine Learning & Big Data', 'Cybersecurity Engineering', 'Compiler Design', 'Senior Capstone Software Project'] }
          ];
        } else {
          curriculum = [
            { year: 'Year 1', title: 'Business & Economic Foundations', modules: ['Principles of Accounting I & II', 'Microeconomics', 'Macroeconomics', 'Business Mathematics & Statistics'] },
            { year: 'Year 2', title: 'Core Accounting & Fiscal Law', modules: ['Financial Accounting I & II (IFRS)', 'Cost & Management Accounting I', 'Business Law', 'Quantitative Methods'] },
            { year: 'Year 3', title: 'Advanced Corporate Finance', modules: ['Corporate Finance', 'Tax Accounting & Administration', 'Audit & Assurance Principles', 'Public Sector Accounting'] },
            { year: 'Year 4', title: 'Strategic Auditing & Research', modules: ['Advanced Auditing & Forensic Accounting', 'Financial Markets & Banking Operations', 'Senior Research Dissertation'] }
          ];
        }

        list.push({
          id: `${inst.code}-${idx}-${adm.programName.replace(/\s+/g, '-').toLowerCase()}`,
          name: adm.programName,
          institutionCode: inst.code,
          institutionName: inst.nameEn,
          faculty: isMed ? 'College of Health & Medical Sciences' : isEng ? 'Institute of Technology' : isLaw ? 'College of Law' : isCS ? 'College of Natural & Computational Sciences' : 'College of Business & Economics',
          degreeLevel: 'BACHELOR',
          stream: adm.stream || (isLaw || isBiz ? 'SOCIAL' : 'NATURAL'),
          studyMode: 'REGULAR',
          durationYears: duration,
          totalCredits: credits,
          intakeQuota: isMed ? 180 : isEng ? 240 : 200,
          maleCutoff: adm.maleCutoff || 450,
          femaleCutoff: adm.femaleCutoff || 420,
          tuitionEtbPerCredit: inst.ownership === 'PUBLIC' ? 0 : 750,
          costSharingEligible: inst.ownership === 'PUBLIC',
          careerPaths: isCS || isEng
            ? ['Software Architect', 'Systems Engineer', 'Cloud Infrastructure Consultant', 'AI/ML Researcher']
            : isMed
            ? ['Medical Doctor (General Practitioner)', 'Resident Specialist', 'Public Health Officer', 'Clinical Researcher']
            : isLaw
            ? ['Attorney at Law', 'Corporate Legal Advisor', 'Public Prosecutor', 'Judge / Legal Researcher']
            : ['Certified Public Accountant (CPA)', 'Financial Analyst', 'Bank Manager', 'Auditor'],
          description: `The ${adm.programName} program at ${inst.nameEn} is a certified, rigorous curriculum designed to equip students with national and international standard competencies in accordance with the Ethiopian Ministry of Education guidelines.`,
          curriculumYears: curriculum,
          admissionRequirements: [
            `Official Ethiopian University Entrance Exam (EUEE) minimum score: ${adm.maleCutoff} (Male) / ${adm.femaleCutoff} (Female)`,
            `Completion of Preparatory Secondary School in the ${adm.stream || 'NATURAL'} Science stream`,
            'Minimum score of 70% in prerequisite high school major subjects',
            'Ministry of Education formal allocation or certified self-sponsored direct entry registration'
          ]
        });
      });
    });

    // Add Postgraduate Master & PhD programs
    list.push(
      {
        id: 'aau-msc-ds',
        name: 'M.Sc. in Data Science & Artificial Intelligence',
        institutionCode: 'AAU',
        institutionName: 'Addis Ababa University',
        faculty: 'Addis Ababa Institute of Technology (AAiT)',
        degreeLevel: 'MASTER',
        stream: 'NATURAL',
        studyMode: 'EXTENSION',
        durationYears: 2,
        totalCredits: 120,
        intakeQuota: 45,
        maleCutoff: 0,
        femaleCutoff: 0,
        tuitionEtbPerCredit: 1250,
        costSharingEligible: false,
        careerPaths: ['Principal Data Scientist', 'AI Research Engineer', 'Machine Learning Architect'],
        description: 'Elite postgraduate curriculum focusing on natural language processing for Ethiopian languages, distributed machine learning, and computer vision.',
        curriculumYears: [
          { year: 'Year 1', title: 'Postgraduate Machine Learning Core', modules: ['Advanced Machine Learning', 'Deep Learning & Neural Architectures', 'Big Data Engineering', 'Ethiopic Natural Language Processing'] },
          { year: 'Year 2', title: 'Applied AI & Master Dissertation', modules: ['Computer Vision Systems', 'AI Ethics & Research Methodology', 'Master Thesis Defense (30 ECTS)'] }
        ],
        admissionRequirements: [
          'Accredited B.Sc. degree in Computer Science, Software Engineering, or related STEM field with minimum CGPA of 3.00',
          'Passing score on the AAU Graduate Admission Test (NGAT / GAT)',
          'Two letters of academic recommendation and formal statement of research intent'
        ]
      },
      {
        id: 'aau-mba-exec',
        name: 'Master of Business Administration (MBA)',
        institutionCode: 'AAU',
        institutionName: 'Addis Ababa University',
        faculty: 'College of Business and Economics (CBE)',
        degreeLevel: 'MASTER',
        stream: 'SOCIAL',
        studyMode: 'WEEKEND',
        durationYears: 2,
        totalCredits: 120,
        intakeQuota: 90,
        maleCutoff: 0,
        femaleCutoff: 0,
        tuitionEtbPerCredit: 1350,
        costSharingEligible: false,
        careerPaths: ['Chief Executive Officer (CEO)', 'Strategy Consultant', 'Investment Banker', 'Operations Director'],
        description: 'Executive graduate program designed for business executives, banking managers, and entrepreneurs across East Africa.',
        curriculumYears: [
          { year: 'Year 1', title: 'Executive Management Core', modules: ['Strategic Leadership', 'Managerial Economics', 'Corporate Financial Strategy', 'Marketing Management in Africa'] },
          { year: 'Year 2', title: 'Applied Strategy & Capstone Project', modules: ['Supply Chain Logistics', 'Corporate Governance & Business Law', 'Executive MBA Capstone Thesis'] }
        ],
        admissionRequirements: [
          'Recognized Bachelor degree with CGPA ≥ 2.75 from an accredited university',
          'Minimum of 2 years verifiable professional management experience',
          'Passing score on university postgraduate entry examination'
        ]
      },
      {
        id: 'astu-phd-eng',
        name: 'Ph.D. in Electrical & Computer Engineering',
        institutionCode: 'ASTU',
        institutionName: 'Adama Science and Technology University',
        faculty: 'School of Electrical Engineering & Computing',
        degreeLevel: 'PHD',
        stream: 'NATURAL',
        studyMode: 'REGULAR',
        durationYears: 4,
        totalCredits: 240,
        intakeQuota: 15,
        maleCutoff: 0,
        femaleCutoff: 0,
        tuitionEtbPerCredit: 1800,
        costSharingEligible: false,
        careerPaths: ['University Professor', 'Principal Research Scientist', 'Industrial R&D Director'],
        description: 'Doctoral research program advancing national technologies in renewable microgrids, 5G wireless systems, and autonomous robotics.',
        curriculumYears: [
          { year: 'Year 1', title: 'Doctoral Seminars & Advanced Methods', modules: ['Advanced Applied Mathematics', 'Research Methodologies & Publication Standards', 'Comprehensive Qualification Exam'] },
          { year: 'Years 2–4', title: 'Original Doctoral Research & Publications', modules: ['Independent Laboratory Research', 'Peer-Reviewed Journal Publications', 'Final Dissertation Defense'] }
        ],
        admissionRequirements: [
          'Master of Science (M.Sc.) degree in Electrical/Computer Engineering with minimum CGPA of 3.50',
          'Approved research proposal aligned with ASTU Center of Excellence priority areas',
          'Oral defense of doctoral proposal before the School Graduate Committee'
        ]
      }
    );

    return list;
  }, []);

  const filteredPrograms = useMemo(() => {
    return programs.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.institutionCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.faculty.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDegree = degreeFilter === 'ALL' || p.degreeLevel === degreeFilter;
      const matchesStream = streamFilter === 'ALL' || p.stream === streamFilter;
      return matchesSearch && matchesDegree && matchesStream;
    });
  }, [programs, searchTerm, degreeFilter, streamFilter]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 transition-colors duration-200">
      
      {/* Title */}
      <div className="max-w-3xl">
        <h1 className={`text-3xl sm:text-4xl font-serif font-bold tracking-tight ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          Nationwide Degree Programs Catalog
        </h1>
        <p className={`mt-2 text-sm sm:text-base leading-relaxed ${
          isDark ? 'text-zinc-400' : 'text-slate-600'
        }`}>
          Compare curricula, degree requirements, graduation timelines, EUEE cutoffs, and career pathways across verified Ethiopian universities.
        </p>
      </div>

      {/* Search & Filters */}
      <div className={`mt-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl border shadow-sm transition-colors ${
        isDark ? 'bg-zinc-900 border-zinc-800 shadow-none' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
            isDark ? 'text-zinc-500' : 'text-slate-400'
          }`} />
          <input
            type="text"
            placeholder="Search programs (e.g., Software Engineering, Medicine, Law)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5AA7A7] transition-all ${
              isDark 
                ? 'bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-500' 
                : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400'
            }`}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Degree Level Filter */}
          <div className={`flex items-center p-1 rounded-xl text-xs font-semibold ${
            isDark ? 'bg-zinc-950 border border-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-600'
          }`}>
            {(['ALL', 'BACHELOR', 'MASTER', 'PHD'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setDegreeFilter(lvl)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  degreeFilter === lvl 
                    ? (isDark ? 'bg-zinc-800 text-white shadow-sm font-bold' : 'bg-[#0C373D] text-white shadow-sm font-bold') 
                    : (isDark ? 'hover:text-white' : 'hover:text-slate-900')
                }`}
              >
                {lvl === 'ALL' ? 'All Degrees' : lvl.charAt(0) + lvl.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Stream Filter */}
          <div className={`flex items-center p-1 rounded-xl text-xs font-semibold ${
            isDark ? 'bg-zinc-950 border border-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-600'
          }`}>
            {(['ALL', 'NATURAL', 'SOCIAL'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStreamFilter(st)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  streamFilter === st 
                    ? (isDark ? 'bg-zinc-800 text-white shadow-sm font-bold' : 'bg-[#5AA7A7] text-white shadow-sm font-bold') 
                    : (isDark ? 'hover:text-white' : 'hover:text-slate-900')
                }`}
              >
                {st === 'ALL' ? 'All Streams' : st.charAt(0) + st.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Program Cards Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrograms.map((prog) => (
          <div
            key={prog.id}
            className={`rounded-2xl p-6 border flex flex-col justify-between transition-all ${
              isDark 
                ? 'bg-zinc-900 border-zinc-800 hover:border-[#5AA7A7]/50 shadow-none' 
                : 'bg-white border-[#E2E8F0] shadow-sm hover:border-[#5AA7A7]/50 hover:shadow-md'
            }`}
          >
            <div>
              {/* Badge & University */}
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  prog.stream === 'NATURAL' 
                    ? (isDark ? 'bg-teal-950/60 text-teal-300 border border-teal-800/60' : 'bg-[#EBF6F6] text-[#1E5C64] border border-[#5AA7A7]/30')
                    : (isDark ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60' : 'bg-amber-50 text-amber-800 border border-amber-100')
                }`}>
                  {prog.degreeLevel} • {prog.stream}
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                  isDark ? 'bg-zinc-800 text-zinc-300 border border-zinc-700' : 'text-slate-700 bg-slate-100'
                }`}>
                  {prog.institutionCode}
                </span>
              </div>

              {/* Program Name */}
              <h3 className={`font-serif font-bold text-lg mt-3 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {prog.name}
              </h3>
              <p className={`text-xs mt-0.5 ${
                isDark ? 'text-zinc-400' : 'text-slate-500'
              }`}>{prog.institutionName}</p>

              {/* Specs */}
              <div className={`mt-4 grid grid-cols-2 gap-2 text-xs p-3 rounded-xl border ${
                isDark 
                  ? 'bg-zinc-950 border-zinc-800 text-zinc-300' 
                  : 'text-slate-600 bg-slate-50 border-slate-100'
              }`}>
                <div className="flex items-center gap-1.5">
                  <Clock className={`w-3.5 h-3.5 ${isDark ? 'text-zinc-500' : 'text-[#5AA7A7]'}`} />
                  <span>{prog.durationYears} Years Duration</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className={`w-3.5 h-3.5 ${isDark ? 'text-zinc-500' : 'text-[#5AA7A7]'}`} />
                  <span>{prog.totalCredits} ECTS Credits</span>
                </div>
              </div>

              {/* Career Paths */}
              <div className="mt-4">
                <p className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                  isDark ? 'text-zinc-400' : 'text-slate-400'
                }`}>
                  <Briefcase className="w-3 h-3 text-[#5AA7A7]" /> Career Pathways
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {prog.careerPaths.slice(0, 3).map((career, i) => (
                    <span 
                      key={i} 
                      className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                        isDark ? 'bg-zinc-800 text-zinc-300 border border-zinc-700/60' : 'bg-[#EBF6F6] text-[#1E5C64]'
                      }`}
                    >
                      {career}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className={`mt-6 pt-4 border-t flex items-center justify-between text-xs ${
              isDark ? 'border-zinc-800' : 'border-slate-100'
            }`}>
              <span className={`font-semibold px-2.5 py-0.5 rounded border text-[11px] flex items-center gap-1 ${
                isDark 
                  ? 'text-teal-400 bg-teal-950/40 border-teal-800/60' 
                  : 'text-[#1E5C64] bg-[#EBF6F6] border-[#5AA7A7]/30'
              }`}>
                <CheckCircle2 className="w-3 h-3 text-[#5AA7A7]" /> Verified Curriculum
              </span>
              <button 
                onClick={() => setSelectedProgram(prog)}
                className="text-xs font-bold text-[#0C373D] hover:text-[#5AA7A7] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <GraduationCap className="w-3.5 h-3.5 text-[#5AA7A7]" />
                <span>View Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPrograms.length === 0 && (
        <div className={`p-12 text-center rounded-3xl border text-sm mt-8 ${
          isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-white border-slate-200 text-slate-500'
        }`}>
          No degree programs found matching "{searchTerm}".
        </div>
      )}

      {/* ========================================================================= */}
      {/* PROGRAM DETAILS MODAL POPUP                                               */}
      {/* ========================================================================= */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div 
            className={`rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border flex flex-col ${
              isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`p-6 sm:p-8 border-b flex items-start justify-between gap-4 sticky top-0 backdrop-blur-md z-10 ${
              isDark ? 'bg-zinc-900/95 border-zinc-800' : 'bg-white/95 border-slate-100'
            }`}>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    selectedProgram.stream === 'NATURAL' 
                      ? (isDark ? 'bg-teal-950/60 text-teal-300 border border-teal-800/60' : 'bg-[#EBF6F6] text-[#1E5C64] border border-[#5AA7A7]/30')
                      : (isDark ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60' : 'bg-amber-50 text-amber-800 border border-amber-200')
                  }`}>
                    {selectedProgram.stream} STREAM
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    isDark ? 'bg-zinc-800 text-zinc-300 border border-zinc-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {selectedProgram.degreeLevel} DEGREE
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                    isDark 
                      ? 'text-teal-400 bg-teal-950/50 border-teal-800/60' 
                      : 'text-[#1E5C64] bg-[#EBF6F6] border-[#5AA7A7]/30'
                  }`}>
                    <ShieldCheck className="w-3 h-3 text-[#5AA7A7]" /> ETA Accredited
                  </span>
                </div>
                
                <h2 className={`text-2xl sm:text-3xl font-serif font-bold mt-2 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {selectedProgram.name}
                </h2>
                <p className={`text-xs mt-0.5 flex items-center gap-1 ${
                  isDark ? 'text-zinc-400' : 'text-slate-500'
                }`}>
                  <MapPin className={`w-3 h-3 ${isDark ? 'text-zinc-500' : 'text-[#5AA7A7]'}`} />
                  <span>{selectedProgram.institutionName} ({selectedProgram.institutionCode}) • {selectedProgram.faculty}</span>
                </p>
              </div>

              <button
                onClick={() => setSelectedProgram(null)}
                className={`p-2 rounded-full transition-all cursor-pointer ${
                  isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Program Overview */}
              <div>
                <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                  isDark ? 'text-zinc-400' : 'text-slate-400'
                }`}>
                  Program Overview
                </h3>
                <p className={`text-sm leading-relaxed ${
                  isDark ? 'text-zinc-300' : 'text-slate-700'
                }`}>
                  {selectedProgram.description}
                </p>
              </div>

              {/* Key Program Specifications */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className={`p-4 rounded-2xl border text-center ${
                  isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <p className={`text-[10px] font-bold uppercase ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Duration</p>
                  <p className={`text-base font-serif font-bold mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedProgram.durationYears} Years</p>
                </div>
                <div className={`p-4 rounded-2xl border text-center ${
                  isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <p className={`text-[10px] font-bold uppercase ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Total Credits</p>
                  <p className={`text-base font-serif font-bold mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedProgram.totalCredits} ECTS</p>
                </div>
                <div className={`p-4 rounded-2xl border text-center ${
                  isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <p className={`text-[10px] font-bold uppercase ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Study Mode</p>
                  <p className={`text-sm font-bold mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedProgram.studyMode}</p>
                </div>
                <div className={`p-4 rounded-2xl border text-center ${
                  isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <p className={`text-[10px] font-bold uppercase ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Intake Quota</p>
                  <p className="text-base font-serif font-bold text-[#0C373D] mt-0.5">{selectedProgram.intakeQuota} Seats</p>
                </div>
              </div>

              {/* Admission & Cutoff Criteria */}
              <div className={`p-5 rounded-2xl border space-y-3 ${
                isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-[#EBF6F6]/60 border-[#5AA7A7]/30'
              }`}>
                <div className="flex items-center justify-between">
                  <h4 className={`font-serif font-bold text-sm flex items-center gap-1.5 ${
                    isDark ? 'text-white' : 'text-[#0C373D]'
                  }`}>
                    <Award className="w-4 h-4 text-[#5AA7A7]" />
                    <span>Admission & Matriculation Cut-Offs</span>
                  </h4>
                  {selectedProgram.maleCutoff > 0 && (
                    <span className="text-xs font-bold text-[#0C373D]">
                      EUEE: Male {selectedProgram.maleCutoff} pts / Female {selectedProgram.femaleCutoff} pts
                    </span>
                  )}
                </div>
                <ul className={`text-xs space-y-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                  {selectedProgram.admissionRequirements.map((req, rIdx) => (
                    <li key={rIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#5AA7A7] shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Year-by-Year Curriculum Breakdown */}
              <div>
                <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5 ${
                  isDark ? 'text-zinc-400' : 'text-slate-400'
                }`}>
                  <Layers className="w-4 h-4 text-[#5AA7A7]" />
                  <span>Curriculum Structure & Core Courses</span>
                </h3>
                <div className="space-y-3">
                  {selectedProgram.curriculumYears.map((curr, idx) => (
                    <div key={idx} className={`p-4 rounded-2xl border ${
                      isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className={`flex items-center justify-between border-b pb-2 mb-2 ${
                        isDark ? 'border-zinc-800' : 'border-slate-200'
                      }`}>
                        <span className="font-serif font-bold text-xs text-[#0C373D]">{curr.year}</span>
                        <span className={`text-[11px] font-semibold ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{curr.title}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {curr.modules.map((mod, mIdx) => (
                          <div key={mIdx} className={`text-xs flex items-center gap-1.5 ${
                            isDark ? 'text-zinc-300' : 'text-slate-700'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#5AA7A7] shrink-0" />
                            <span>{mod}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Career Pathways & Tuition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200'
                }`}>
                  <span className={`font-bold block mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Career Opportunities</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProgram.careerPaths.map((career, cIdx) => (
                      <span key={cIdx} className={`px-2.5 py-1 rounded-lg font-medium ${
                        isDark ? 'bg-zinc-800 text-zinc-300 border border-zinc-700' : 'bg-[#EBF6F6] text-[#1E5C64]'
                      }`}>
                        {career}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200'
                }`}>
                  <span className={`font-bold block mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Tuition & Financial Terms</span>
                  <p className={isDark ? 'text-zinc-300' : 'text-slate-600'}>
                    {selectedProgram.costSharingEligible
                      ? 'National Cost-Sharing Scheme applicable for Ministry assigned regular students.'
                      : `${selectedProgram.tuitionEtbPerCredit} ETB per credit hour for extension/modular delivery.`}
                  </p>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className={`p-6 border-t rounded-b-3xl flex items-center justify-between ${
              isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-100'
            }`}>
              <span className={`text-xs ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>Official Ministry of Education curriculum code</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedProgram(null)}
                  className={`px-5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    isDark 
                      ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800' 
                      : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    alert(`Inquiry submitted for ${selectedProgram.name} at ${selectedProgram.institutionName}`);
                    setSelectedProgram(null);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#0C373D] hover:bg-[#072428] text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <span>Apply / Inquire</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};