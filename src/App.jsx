import React, { useState } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import BottomBar from './components/layout/BottomBar';

// Real Application Pages
import HomePage from './pages/HomePage';
import InstitutionsPage from './pages/InstitutionsPage';
import InstitutionDetailPage from './pages/InstitutionDetailPage';
import ProgramsPage from './pages/ProgramsPage';
import ScholarshipsPage from './pages/ScholarshipsPage';
import AdmissionsPage from './pages/AdmissionsPage';
import ComparePage from './pages/ComparePage';
import AIConsultantPage from './pages/AIConsultantPage';
import ResourcesPage from './pages/ResourcesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Verified Ethiopian Higher Education Mock Data
const MOCK_INSTITUTIONS = [
  {
    id: '1',
    slug: 'aau',
    name: 'Addis Ababa University',
    location: 'Addis Ababa, Ethiopia',
    city: 'Addis Ababa',
    region: 'Addis Ababa',
    type: 'University',
    ownership: 'Public',
    isVerified: true,
    establishedYear: 1950,
    accreditationStatus: 'HERQA Accredited',
    studentEnrollment: 48000,
    facultyCount: 3200,
    programsCount: 142,
    rating: 4.8,
    website: 'https://www.aau.edu.et',
    email: 'info@aau.edu.et',
    phone: '+251 11 123 9700',
    description: 'Addis Ababa University is the oldest and largest higher education and research institution in Ethiopia, offering extensive undergraduate, graduate, and doctoral programs across multiple specialized campuses.',
    mission: 'To provide quality higher education and produce competent graduates capable of driving national development.',
    vision: 'To become one of the top ten pre-eminent graduate and research universities in Africa by 2030.',
    address: 'Sidist Kilo Main Campus, Addis Ababa, Ethiopia'
  },
  {
    id: '2',
    slug: 'astu',
    name: 'Adama Science & Technology University',
    location: 'Adama, Oromia',
    city: 'Adama',
    region: 'Oromia',
    type: 'University',
    ownership: 'Public',
    isVerified: true,
    establishedYear: 1993,
    accreditationStatus: 'HERQA Accredited',
    studentEnrollment: 18000,
    facultyCount: 1100,
    programsCount: 64,
    rating: 4.6,
    website: 'https://www.astu.edu.et',
    email: 'contact@astu.edu.et',
    description: 'ASTU is a premier center of excellence in science and technology education in Ethiopia, focused on engineering, applied natural sciences, and industrial innovation.',
    mission: 'Producing elite engineers and researchers for Ethiopian technological self-reliance.',
    address: 'Adama Campus, Oromia, Ethiopia'
  },
  {
    id: '3',
    slug: 'unity-university',
    name: 'Unity University',
    location: 'Gerji, Addis Ababa',
    city: 'Addis Ababa',
    region: 'Addis Ababa',
    type: 'University',
    ownership: 'Private',
    isVerified: true,
    establishedYear: 1998,
    accreditationStatus: 'HERQA Accredited',
    studentEnrollment: 12000,
    facultyCount: 450,
    programsCount: 38,
    rating: 4.2,
    website: 'https://www.unity.edu.et',
    email: 'admission@unity.edu.et',
    description: 'Unity University is the first private higher education institution in Ethiopia to earn university status, renowned for business administration and computing sciences.',
    address: 'Gerji Campus, Addis Ababa, Ethiopia'
  }
];

const MOCK_PROGRAMS = [
  {
    id: 'prog-1',
    slug: 'bsc-software-engineering',
    name: 'BSc in Software Engineering',
    degree: 'Bachelor',
    studyMode: 'Full-Time',
    department: 'Department of Software Engineering',
    faculty: 'School of Information Technology',
    institution: 'Addis Ababa University',
    duration: '4 Years (8 Semesters)',
    tuition: 'Government Cost Sharing / 4,200 ETB per credit (Extension)',
    languageOfInstruction: 'English',
    credits: 148,
    description: 'The Bachelor of Science in Software Engineering program provides rigorous foundations in software design, algorithms, cloud architectures, database management, and mobile computing.',
    admissionRequirements: [
      'Ethiopian Secondary School Leaving Certificate Examination (ESCE) cutoff met',
      'Minimum grade score in Mathematics, Physics, and English',
      'Natural Science stream background'
    ],
    careerOpportunities: [
      { title: 'Software Engineer / Full Stack Developer', description: 'Design and deploy scalable enterprise systems.' },
      { title: 'AI & Data Engineer', description: 'Build intelligence and machine learning pipelines.' },
      { title: 'Mobile Applications Engineer', description: 'Develop Android and iOS consumer applications.' }
    ]
  },
  {
    id: 'prog-2',
    slug: 'bsc-mechanical-engineering',
    name: 'BSc in Mechanical & Vehicle Engineering',
    degree: 'Bachelor',
    studyMode: 'Full-Time',
    department: 'School of Mechanical Engineering',
    faculty: 'Faculty of Engineering',
    institution: 'Adama Science & Technology University',
    duration: '5 Years (10 Semesters)',
    tuition: 'Government Cost Sharing',
    languageOfInstruction: 'English',
    credits: 164,
    description: 'Comprehensive engineering degree covering thermodynamics, mechatronics, manufacturing automation, and automotive dynamics.',
    admissionRequirements: [
      'Top percentile score in National STEM Entrance Exam',
      'Pass ASTU Institutional Aptitude Assessment'
    ],
    careerOpportunities: [
      { title: 'Mechanical Systems Engineer', description: 'Industrial automation and robotics.' },
      { title: 'Automotive Design Engineer', description: 'Vehicle prototyping and dynamics.' }
    ]
  },
  {
    id: 'prog-3',
    slug: 'msc-ai-data-science',
    name: 'MSc in Artificial Intelligence & Data Science',
    degree: 'Master',
    studyMode: 'Extension',
    department: 'School of Information Technology',
    faculty: 'Postgraduate Studies',
    institution: 'Addis Ababa University',
    duration: '2 Years (4 Semesters)',
    tuition: '1,800 ETB per credit hour',
    languageOfInstruction: 'English',
    credits: 64,
    description: 'Postgraduate program covering machine learning, deep neural networks, computer vision, natural language processing for Ethiopian languages, and big data architectures.',
    admissionRequirements: [
      'BSc degree in Computer Science, Software Engineering, or related discipline (CGPA >= 3.00)',
      'Pass National Graduate Admission Test (NGAT / GAT)'
    ],
    careerOpportunities: [
      { title: 'AI Research Scientist', description: 'Model development and applied machine intelligence.' },
      { title: 'Lead Data Architect', description: 'Large-scale distributed systems.' }
    ]
  }
];

const MOCK_SCHOLARSHIPS = [
  {
    id: 'sch-1',
    slug: 'national-merit-stem-scholarship',
    title: 'National Higher Education STEM Excellence Grant',
    coverageType: 'Full Tuition',
    amount: '100% Tuition + 2,500 ETB Monthly Living Stipend',
    provider: 'Ministry of Education / AAU Partnership',
    institution: 'Addis Ababa University',
    deadline: '2026-09-30',
    description: 'A prestigious merit scholarship designed to support high-achieving secondary school graduates pursuing undergraduate degrees in Computer Science, Software Engineering, and Biotechnology.',
    eligibilityCriteria: [
      'Ethiopian national with verified national exam results',
      'Cumulative entrance exam score in top 5th percentile',
      'Enrolled or accepted in an accredited STEM degree program'
    ],
    requiredDocuments: [
      { name: 'Official National Examination Transcript' },
      { name: 'Letter of Acceptance from University Department' },
      { name: 'Recommendation letter from high school dean' },
      { name: 'Copy of National Kebele ID or Passport' }
    ],
    applicationProcess: 'Submit your completed dossier via the ST-Network Scholarship portal or directly at the university financial aid registry before September 30.',
    contactEmail: 'scholarships@aau.edu.et'
  },
  {
    id: 'sch-2',
    slug: 'astu-innovation-fellowship',
    title: 'ASTU Center of Excellence Engineering Fellowship',
    coverageType: 'Full Tuition',
    amount: '100% Tuition Coverage + Campus Dormitory & Research Grant',
    provider: 'ASTU Industrial Research Fund',
    institution: 'Adama Science & Technology University',
    deadline: '2026-10-10',
    description: 'Fellowship targeted at innovative software developers, roboticists, and automotive engineering innovators admitted to ASTU.',
    eligibilityCriteria: [
      'Top score in ASTU Institutional Engineering Aptitude Exam',
      'Demonstrated project or science fair innovation record'
    ],
    requiredDocuments: [
      { name: 'ASTU Aptitude Evaluation Certificate' },
      { name: 'Innovation Project Abstract' }
    ]
  },
  {
    id: 'sch-3',
    slug: 'unity-merit-grant',
    title: 'Unity University Academic Merit Grant',
    coverageType: 'Partial',
    amount: '50% Semester Tuition Grant for 4 Years',
    provider: 'Unity University Foundation',
    institution: 'Unity University',
    deadline: '2026-11-15',
    description: 'Partial merit tuition grant enabling qualified students to pursue computing and business degrees at Unity University.',
    eligibilityCriteria: [
      'High school GPA above regional honors average',
      'Strong extracurricular leadership background'
    ],
    requiredDocuments: [
      { name: 'Grade 12 Certificate' },
      { name: '500-word Application Essay' }
    ]
  }
];

const MOCK_REVIEWS = [
  {
    id: 'rev-1',
    authorName: 'Yared Tesfaye',
    authorRole: 'Software Engineering Graduate',
    department: 'Software Engineering',
    institution: 'Addis Ababa University',
    rating: 5,
    title: 'Solid academic foundation and vibrant student community',
    content: 'The curriculum is intensive and the practical lab sessions prepared me directly for industry jobs. Sidist Kilo campus is vibrant with abundant library access.',
    date: '3 days ago',
    helpfulCount: 24,
    isHelpful: true,
    moderationStatus: 'Approved'
  },
  {
    id: 'rev-2',
    authorName: 'Selamawit Bekele',
    authorRole: '3rd Year Electrical Engineering Student',
    department: 'Electrical & Computer Engineering',
    institution: 'Addis Ababa University',
    rating: 4,
    title: 'Great professors, though registration line needs digital upgrade',
    content: 'The academic rigor is unmatched in Ethiopia. Professors are deeply knowledgeable and approachable during office hours.',
    date: '1 week ago',
    helpfulCount: 12,
    isHelpful: false,
    moderationStatus: 'Approved'
  }
];

export default function App() {
  const [currentRoute, setCurrentRoute] = useState('/');
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [comparisonList, setComparisonList] = useState([MOCK_INSTITUTIONS[0], MOCK_INSTITUTIONS[1]]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };
  
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am GIBI-Connect\'s AI Educational Consultant. I can help you explore accredited Ethiopian universities and colleges, compare tuition fees, admission cutoffs, and scholarship opportunities. What would you like to know today?',
      sources: [
        { title: 'Addis Ababa University', type: 'Institution', url: '/institutions/aau', isVerified: true },
        { title: 'BSc in Software Engineering', type: 'Program', url: '/programs/bsc-se', isVerified: true }
      ],
      timestamp: '10:30 AM'
    }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  const handleNavigate = (path) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentRoute(path);
  };

  const handleSelectInstitution = (inst) => {
    setSelectedInstitution(inst);
    handleNavigate(`/institutions/${inst.slug}`);
  };

  const handleAddComparison = (inst) => {
    if (comparisonList.length < 4 && !comparisonList.some(i => i.id === inst.id)) {
      setComparisonList(prev => [...prev, inst]);
    }
  };

  const handleRemoveComparison = (inst) => {
    setComparisonList(prev => prev.filter(i => i.id !== inst.id));
  };

  const handleSendAIMessage = (text) => {
    const userMsg = {
      role: 'user',
      content: text,
      timestamp: 'Just now'
    };
    setMessages(prev => [...prev, userMsg]);
    setAiLoading(true);

    setTimeout(() => {
      let replyText = 'Based on GIBI-Connect verified records, Addis Ababa University and Adama Science & Technology University (ASTU) are leading public institutions offering computing sciences and engineering curricula with HERQA accreditation.';
      let sources = [
        { title: 'Addis Ababa University', type: 'Institution', isVerified: true },
        { title: 'ASTU Engineering', type: 'Program', isVerified: true }
      ];

      if (text.toLowerCase().includes('scholarship')) {
        replyText = 'Currently, the National Higher Education STEM Excellence Grant is open for undergraduate applicants with full tuition coverage and monthly stipends.';
        sources = [{ title: 'National STEM Grant', type: 'Scholarship', isVerified: true }];
      } else if (text.toLowerCase().includes('compare')) {
        replyText = 'Comparing AAU and ASTU: AAU offers a broader comprehensive curriculum with 142+ programs established in 1950, whereas ASTU specializes in technology & industrial engineering founded in 1993.';
        sources = [
          { title: 'AAU Profile', type: 'Institution', isVerified: true },
          { title: 'ASTU Profile', type: 'Institution', isVerified: true }
        ];
      }

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: replyText,
          sources,
          timestamp: 'Just now'
        }
      ]);
      setAiLoading(false);
    }, 900);
  };

  const handleAskAIWithPrompt = (prompt) => {
    handleNavigate('/ai');
    handleSendAIMessage(prompt);
  };

  return (
    <div className={`min-h-screen flex flex-col relative font-sans antialiased transition-colors duration-300 ${
      isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Full-page bright, sharp, and clearly visible background photo */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="/images/Butler-Exterior-2-scaled.jpg"
          alt="Site Background"
          className="w-full h-full object-cover opacity-85 filter brightness-105 contrast-105"
        />
        <div className={`absolute inset-0 transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-slate-950/85 backdrop-blur-[2px]' 
            : 'bg-white/70 backdrop-blur-[2px]'
        }`} />
      </div>

      {/* Universal Navigation Bar */}
      <div className="relative z-30">
        <Navbar
          activeRoute={currentRoute}
          onNavigate={handleNavigate}
          onLogout={() => alert('Signed out successfully.')}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />
      </div>

      {/* Main Page Routing Switch */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {currentRoute === '/' && (
          <HomePage
            institutions={MOCK_INSTITUTIONS}
            programs={MOCK_PROGRAMS}
            scholarships={MOCK_SCHOLARSHIPS}
            onNavigate={handleNavigate}
            onSelectInstitution={handleSelectInstitution}
            onSelectProgram={() => handleNavigate('/programs')}
            onSelectScholarship={() => handleNavigate('/scholarships')}
          />
        )}

        {currentRoute.startsWith('/institutions') && !selectedInstitution && (
          <InstitutionsPage
            institutions={MOCK_INSTITUTIONS}
            onSelectInstitution={handleSelectInstitution}
            onCompare={handleAddComparison}
            comparedList={comparisonList}
          />
        )}

        {currentRoute.startsWith('/institutions') && selectedInstitution && (
          <InstitutionDetailPage
            institution={selectedInstitution}
            programs={MOCK_PROGRAMS}
            reviews={MOCK_REVIEWS}
            onBack={() => {
              setSelectedInstitution(null);
              handleNavigate('/institutions');
            }}
            onCompare={handleAddComparison}
            isCompared={comparisonList.some(i => i.id === selectedInstitution.id)}
            onAskAI={handleAskAIWithPrompt}
            onSelectProgram={() => handleNavigate('/programs')}
          />
        )}

        {currentRoute === '/programs' && (
          <ProgramsPage
            programs={MOCK_PROGRAMS}
            onAskAI={handleAskAIWithPrompt}
          />
        )}

        {currentRoute === '/scholarships' && (
          <ScholarshipsPage
            scholarships={MOCK_SCHOLARSHIPS}
            onAskAI={handleAskAIWithPrompt}
          />
        )}

        {currentRoute === '/admissions' && (
          <AdmissionsPage
            onAskAI={handleAskAIWithPrompt}
          />
        )}

        {currentRoute === '/compare' && (
          <ComparePage
            availableInstitutions={MOCK_INSTITUTIONS}
            comparisonList={comparisonList}
            onAddInstitution={handleAddComparison}
            onRemoveInstitution={handleRemoveComparison}
            onAskAI={handleAskAIWithPrompt}
          />
        )}

        {currentRoute === '/ai' && (
          <AIConsultantPage
            messages={messages}
            onSendMessage={handleSendAIMessage}
            loading={aiLoading}
            onResetChat={() => setMessages([])}
          />
        )}

        {currentRoute === '/resources' && (
          <ResourcesPage />
        )}

        {currentRoute === '/login' && (
          <LoginPage onNavigate={handleNavigate} />
        )}

        {currentRoute === '/register' && (
          <RegisterPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* Universal Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating Bottom Quick Action Bar & Buttons */}
      <BottomBar
        onNavigate={handleNavigate}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />
    </div>
  );
}
