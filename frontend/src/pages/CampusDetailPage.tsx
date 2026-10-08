import React, { useState } from 'react';
import { 
  ArrowLeft, MapPin, 
  ExternalLink, Phone, Mail, 
  Share2, Maximize2, Sparkles,
  Award, Building2, Layers, BookOpen, GraduationCap, 
  Coins, Check, Calendar, Search, 
  CheckCircle2, ChevronRight, ChevronLeft
} from 'lucide-react';
import { ETHIOPIAN_INSTITUTIONS } from '../data/mockInstitutions';

interface CampusDetailPageProps {
  institutionId: string;
  onBack: () => void;
  onNavigateToTab?: (tab: 'institutions' | 'programs' | 'admissions' | 'events' | 'resources' | 'market' | 'ai-advisor') => void;
  theme?: 'light' | 'dark';
}

interface FacultyDetail {
  id: string;
  name: string;
  campus: string;
  dean: string;
  established: number;
  studentCount: number;
  facultyCount: number;
  description: string;
  departments: {
    name: string;
    head: string;
    degrees: string[];
    enrolled: number;
    specialization: string;
  }[];
}

interface DetailedProgram {
  name: string;
  faculty: string;
  degreeLevel: 'BACHELOR' | 'MASTER' | 'DOCTORAL' | 'DIPLOMA';
  stream: 'NATURAL' | 'SOCIAL';
  duration: string;
  credits: string;
  modes: string[];
  intakeQuota: number;
  careerPaths: string[];
  curriculumHighlights: { year: string; modules: string[] }[];
}

interface FacilityGalleryItem {
  id: string;
  name: string;
  category: 'Library' | 'Laboratory' | 'Healthcare' | 'Housing' | 'Sports' | 'ICT & Innovation';
  location: string;
  capacity: string;
  description: string;
  features: string[];
  images: { url: string; caption: string }[];
}

export const CampusDetailPage: React.FC<CampusDetailPageProps> = ({ 
  institutionId, 
  onBack,
  onNavigateToTab,
  theme = 'light'
}) => {
  const isDark = theme === 'dark';
  const [activeSection, setActiveSection] = useState<string>('overview');
  
  // Search & filter states
  const [facultySearch, setFacultySearch] = useState('');
  const [programSearch, setProgramSearch] = useState('');
  const [programStreamFilter, setProgramStreamFilter] = useState<'ALL' | 'NATURAL' | 'SOCIAL'>('ALL');
  const [programLevelFilter, setProgramLevelFilter] = useState<'ALL' | 'BACHELOR' | 'MASTER' | 'DOCTORAL'>('ALL');
  const [selectedFacilityCategory, setSelectedFacilityCategory] = useState<string>('ALL');
  
  // Gallery slider state per facility ID
  const [galleryIndexes, setGalleryIndexes] = useState<Record<string, number>>({});

  const institution = ETHIOPIAN_INSTITUTIONS.find((inst) => inst.id === institutionId) || ETHIOPIAN_INSTITUTIONS[0];

  const campusImages: Record<string, { hero: string; campusTour: string; landmark: string }> = {
    AAU: {
      hero: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=2000&q=85',
      campusTour: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
      landmark: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80'
    },
    ASTU: {
      hero: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=2000&q=85',
      campusTour: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80',
      landmark: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1200&q=80'
    },
    AASTU: {
      hero: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=2000&q=85',
      campusTour: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
      landmark: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=1200&q=80'
    },
    BDU: {
      hero: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22d57?auto=format&fit=crop&w=2000&q=85',
      campusTour: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
      landmark: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=1200&q=80'
    },
    JU: {
      hero: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=2000&q=85',
      campusTour: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
      landmark: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'
    }
  };

  const currentPhotos = campusImages[institution.code] || {
    hero: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=2000&q=85',
    campusTour: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
    landmark: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80'
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'faculties', label: 'Faculties & Depts', icon: Layers },
    { id: 'programs', label: 'Programs & Curricula', icon: BookOpen },
    { id: 'admissions', label: 'Admissions & Cut-Offs', icon: GraduationCap },
    { id: 'tuition', label: 'Tuition & Cost Sharing', icon: Coins },
    { id: 'facilities', label: 'Facilities & Infrastructure', icon: Building2 },
    { id: 'scholarships', label: 'Scholarships & Aid', icon: Award },
    { id: 'calendar', label: 'Academic Calendar', icon: Calendar },
  ];

  // 1. Comprehensive faculties and departments database
  const getUniversityFaculties = (code: string): FacultyDetail[] => {
    if (code === 'AAU') {
      return [
        {
          id: 'chs',
          name: 'College of Health Sciences (CHS)',
          campus: 'Tikur Anbessa (Black Lion) Campus',
          dean: 'Prof. Andualem Deneke (MD, Associate Prof. of Surgery)',
          established: 1964,
          studentCount: 4200,
          facultyCount: 380,
          description: 'Ethiopia premier medical training complex, integrated with Tikur Anbessa Specialized Hospital with over 800 inpatient beds and 24 clinical research departments.',
          departments: [
            { name: 'School of Medicine (MD)', head: 'Dr. Yonas Bahru', degrees: ['MD (Doctor of Medicine)', 'Residency in Surgery', 'Internal Medicine Specialization'], enrolled: 1600, specialization: 'Clinical Medicine, Neurosurgery, Oncology' },
            { name: 'School of Pharmacy', head: 'Dr. Workineh Shibeshi', degrees: ['B.Pharm', 'M.Sc. in Pharmacology', 'Pharm.D'], enrolled: 650, specialization: 'Pharmaceutical Chemistry, Clinical Pharmacy' },
            { name: 'School of Public Health', head: 'Dr. Adamu Addissie', degrees: ['B.Sc. in Public Health', 'MPH', 'Ph.D. in Epidemiology'], enrolled: 820, specialization: 'Biostatistics, Infectious Disease Modeling' },
            { name: 'School of Nursing & Midwifery', head: 'Sr. Aster Berhe', degrees: ['B.Sc. Nursing', 'B.Sc. Midwifery', 'M.Sc. Critical Care'], enrolled: 750, specialization: 'Emergency & Neonatal Intensive Care' },
            { name: 'School of Allied Health Sciences', head: 'Dr. Daniel Asrat', degrees: ['B.Sc. Medical Laboratory', 'B.Sc. Physiotherapy', 'Radiology Tech'], enrolled: 380, specialization: 'Diagnostic Pathology, Medical Imaging' }
          ]
        },
        {
          id: 'aait',
          name: 'Addis Ababa Institute of Technology (AAiT)',
          campus: '5 Kilo (King George VI) Campus',
          dean: 'Dr. Bikila Teklu (PhD in Transportation Engineering)',
          established: 1953,
          studentCount: 6800,
          facultyCount: 420,
          description: 'Autonomous polytechnic engineering institute pioneering technological innovation, renewable energy, and artificial intelligence in the Horn of Africa.',
          departments: [
            { name: 'School of Electrical & Computer Engineering', head: 'Dr. Fitsum Assamnew', degrees: ['B.Sc. Electrical Engineering', 'B.Sc. Computer Engineering', 'M.Sc. Telecommunications', 'Ph.D.'], enrolled: 1850, specialization: '5G Wireless Networks, Power Systems, Embedded AI' },
            { name: 'School of Software Engineering & Computing', head: 'Dr. Mesfin Kifle', degrees: ['B.Sc. Software Engineering', 'M.Sc. Data Science', 'Ph.D. Computer Science'], enrolled: 1400, specialization: 'Cloud Computing, Distributed Systems, Ethiopian NLP' },
            { name: 'School of Civil & Environmental Engineering', head: 'Dr. Esayas Gebreyohannes', degrees: ['B.Sc. Civil Engineering', 'M.Sc. Geotechnical', 'M.Sc. Structural'], enrolled: 1650, specialization: 'Mega-Infrastructure Design, Rail Transit, Hydrology' },
            { name: 'School of Mechanical & Industrial Engineering', head: 'Dr. Daniel Tilahun', degrees: ['B.Sc. Mechanical Engineering', 'B.Sc. Industrial Engineering', 'M.Sc. Thermal'], enrolled: 1100, specialization: 'Manufacturing Automation, Automotive Design' },
            { name: 'School of Chemical & Bio-Engineering', head: 'Dr. Beteley Tekola', degrees: ['B.Sc. Chemical Engineering', 'M.Sc. Process Engineering'], enrolled: 800, specialization: 'Bioprocessing, Industrial Catalysis' }
          ]
        },
        {
          id: 'cbe',
          name: 'College of Business and Economics (CBE)',
          campus: 'FBE (Sidist Kilo / Yared) Campus',
          dean: 'Dr. Fanta Mandefro (PhD in Economics)',
          established: 1961,
          studentCount: 5100,
          facultyCount: 290,
          description: 'Premier training institute for leaders of Ethiopian banking, finance, policy institutions, and regional corporate enterprises.',
          departments: [
            { name: 'Department of Accounting & Finance', head: 'Ato Abebe Teshome (CPA)', degrees: ['B.A. Accounting & Finance', 'M.Sc. Accounting', 'Executive MBA'], enrolled: 1900, specialization: 'IFRS Accounting, Commercial Banking, Tax Law' },
            { name: 'Department of Economics', head: 'Dr. Berhanu Denu', degrees: ['B.A. Economics', 'M.Sc. Development Economics', 'Ph.D. Economics'], enrolled: 1400, specialization: 'Macroeconomic Modeling, Trade Policy' },
            { name: 'Department of Management & Public Admin', head: 'Dr. Worku Mekonnen', degrees: ['B.A. Management', 'B.A. Public Administration', 'MBA'], enrolled: 1200, specialization: 'Supply Chain, Strategic Leadership' },
            { name: 'Department of Marketing Management', head: 'W/ro Selamawit Hailu', degrees: ['B.A. Marketing Management', 'M.Sc. Strategic Marketing'], enrolled: 600, specialization: 'Digital Commerce, Brand Strategy' }
          ]
        },
        {
          id: 'clgs',
          name: 'College of Law and Governance Studies (CLGS)',
          campus: 'Sidist Kilo Main Campus',
          dean: 'Dr. Solomon Negussise (LL.D.)',
          established: 1963,
          studentCount: 2200,
          facultyCount: 140,
          description: 'The historic Law Faculty that educated Ethiopia supreme court justices, constitutional scholars, international diplomats, and human rights jurists.',
          departments: [
            { name: 'School of Law (LL.B. & LL.M.)', head: 'Dr. Muradu Abdo', degrees: ['LL.B. in Law', 'LL.M. in Business Law', 'LL.M. in Human Rights', 'Ph.D. in Law'], enrolled: 1400, specialization: 'Commercial Arbitration, Constitutional Law, Maritime Law' },
            { name: 'Center for Federalism & Governance', head: 'Dr. Assefa Fiseha', degrees: ['M.A. in Federal Studies', 'Ph.D. in Governance'], enrolled: 450, specialization: 'Constitutional Design, Inter-governmental Relations' },
            { name: 'Institute of Peace and Security Studies (IPSS)', head: 'Dr. Yonas Adaye', degrees: ['M.A. Peace & Security', 'Executive Master of African Peace'], enrolled: 350, specialization: 'African Union Peace Architecture, Conflict Resolution' }
          ]
        },
        {
          id: 'cncs',
          name: 'College of Natural & Computational Sciences (CNCS)',
          campus: 'Arat Kilo Campus',
          dean: 'Prof. Tileye Feyissa (PhD in Biotechnology)',
          established: 1950,
          studentCount: 3900,
          facultyCount: 310,
          description: 'The scientific birthplace of modern tertiary science education in Ethiopia, with advanced analytical labs for physics, chemistry, biology, and computational mathematics.',
          departments: [
            { name: 'Department of Computer Science', head: 'Dr. Mulugeta Libsie', degrees: ['B.Sc. Computer Science', 'M.Sc. Computer Science', 'Ph.D.'], enrolled: 950, specialization: 'Machine Learning, Cybersecurity, Systems Design' },
            { name: 'Department of Physics', head: 'Dr. Belayneh Mesfin', degrees: ['B.Sc. Physics', 'M.Sc. Condensed Matter', 'Ph.D. Nuclear Physics'], enrolled: 620, specialization: 'Materials Science, Solar Photovoltaics' },
            { name: 'Department of Chemistry', head: 'Dr. Negussie Megersa', degrees: ['B.Sc. Chemistry', 'M.Sc. Analytical Chemistry', 'Ph.D.'], enrolled: 710, specialization: 'Natural Product Extraction, Environmental Chemistry' },
            { name: 'Department of Mathematics', head: 'Dr. Tilahun Abebe', degrees: ['B.Sc. Mathematics', 'M.Sc. Optimization', 'Ph.D.'], enrolled: 540, specialization: 'Differential Equations, Actuarial Science' },
            { name: 'Department of Biology & Biotechnology', head: 'Dr. Fassil Assefa', degrees: ['B.Sc. Biology', 'B.Sc. Biotechnology', 'M.Sc. Microbiology'], enrolled: 1080, specialization: 'Crop Genetics, Industrial Enzymes' }
          ]
        }
      ];
    }

    // Default template for ASTU, AASTU, BDU, JU, etc.
    return [
      {
        id: 'eng-tech',
        name: 'School / College of Engineering & Technology',
        campus: 'Main Science Quadrant',
        dean: 'Dr. Bekele Haile (PhD)',
        established: 1993,
        studentCount: 4500,
        facultyCount: 280,
        description: 'Flagship engineering faculty delivering nationally accredited polytechnic and computer science degrees.',
        departments: [
          { name: 'Electrical & Computer Engineering', head: 'Dr. Getachew Abebe', degrees: ['B.Sc.', 'M.Sc.'], enrolled: 1200, specialization: 'Power Electronics & Embedded Systems' },
          { name: 'Software Engineering & IT', head: 'Dr. Selamawit Tadesse', degrees: ['B.Sc.', 'M.Sc.'], enrolled: 950, specialization: 'Full-Stack Development, Cloud Computing' },
          { name: 'Civil & Construction Engineering', head: 'Dr. Henok Mekonnen', degrees: ['B.Sc.', 'M.Sc.'], enrolled: 1100, specialization: 'Structural Engineering & Highway Design' },
          { name: 'Mechanical & Manufacturing', head: 'Dr. Tewodros Girma', degrees: ['B.Sc.'], enrolled: 850, specialization: 'Thermodynamics & CAD/CAM' }
        ]
      },
      {
        id: 'health-med',
        name: 'College of Health & Medical Sciences',
        campus: 'Teaching Hospital Campus',
        dean: 'Dr. Emebet Kebede (MD, MPH)',
        established: 1983,
        studentCount: 3100,
        facultyCount: 220,
        description: 'Comprehensive health complex dedicated to community medicine, general clinical practice, and pharmaceutical care.',
        departments: [
          { name: 'School of Medicine (MD)', head: 'Dr. Dereje Assefa', degrees: ['MD (Doctor of Medicine)'], enrolled: 1200, specialization: 'Internal Medicine, General Surgery, Pediatrics' },
          { name: 'Department of Public Health', head: 'Dr. Almaz Negash', degrees: ['B.Sc.', 'MPH'], enrolled: 750, specialization: 'Epidemiology & Community Health' },
          { name: 'School of Pharmacy', head: 'Dr. Kassahun Tefera', degrees: ['B.Pharm'], enrolled: 550, specialization: 'Clinical Pharmacology' },
          { name: 'Department of Nursing', head: 'Sr. Tigist Lemma', degrees: ['B.Sc. Nursing'], enrolled: 600, specialization: 'Maternal & Emergency Nursing' }
        ]
      },
      {
        id: 'biz-econ',
        name: 'College of Business & Economics',
        campus: 'Main Academic Campus',
        dean: 'Dr. Yared Lemma (PhD in Finance)',
        established: 1998,
        studentCount: 3800,
        facultyCount: 190,
        description: 'Dynamic business school producing qualified accountants, economists, and enterprise administrators.',
        departments: [
          { name: 'Accounting & Finance', head: 'Ato Birhanu Ayele', degrees: ['B.A.', 'M.Sc.'], enrolled: 1600, specialization: 'Financial Accounting, Tax Audit' },
          { name: 'Economics', head: 'Dr. Genet Haile', degrees: ['B.A.', 'M.Sc.'], enrolled: 1100, specialization: 'Development Economics, Econometrics' },
          { name: 'Management', head: 'Dr. Fikadu Belay', degrees: ['B.A.', 'MBA'], enrolled: 1100, specialization: 'Strategic Management, Operations' }
        ]
      }
    ];
  };

  const facultiesData = getUniversityFaculties(institution.code);

  // 2. Comprehensive Program database
  const getAllUniversityPrograms = (): DetailedProgram[] => {
    return [
      {
        name: 'Doctor of Medicine (MD)',
        faculty: institution.code === 'AAU' ? 'College of Health Sciences (CHS)' : 'College of Health & Medical Sciences',
        degreeLevel: 'DOCTORAL',
        stream: 'NATURAL',
        duration: '6.0 Years (12 Semesters)',
        credits: '360 ECTS',
        modes: ['Regular Full-Time Day'],
        intakeQuota: 180,
        careerPaths: ['Medical Doctor (General Practitioner)', 'Hospital Resident Specialist', 'Clinical Researcher', 'Public Health Director'],
        curriculumHighlights: [
          { year: 'Year 1 (Pre-Med)', modules: ['Human Gross Anatomy I & II', 'Medical Biochemistry', 'Physiology I', 'Medical Ethics'] },
          { year: 'Year 2 (Pre-Clinical)', modules: ['General Pathology', 'Medical Microbiology & Immunology', 'Pharmacology I & II', 'Parasitology'] },
          { year: 'Year 3 (Intro Clinical)', modules: ['Clinical Semiology & Physical Diagnosis', 'Community Health Clerkship', 'Forensic Medicine'] },
          { year: 'Year 4 (Junior Clerkship)', modules: ['Internal Medicine Rotation (12 wks)', 'General Surgery (12 wks)', 'Pediatrics (10 wks)'] },
          { year: 'Year 5 (Senior Clerkship)', modules: ['Obstetrics & Gynecology (12 wks)', 'Psychiatry & Mental Health', 'Ophthalmology & ENT'] },
          { year: 'Year 6 (Hospital Internship)', modules: ['Full-Time Inpatient & Emergency Hospital Internship', 'Rural Primary Health Center Practicum'] }
        ]
      },
      {
        name: 'B.Sc. in Software Engineering',
        faculty: institution.code === 'AAU' ? 'Addis Ababa Institute of Technology (AAiT)' : 'College of Engineering & Technology',
        degreeLevel: 'BACHELOR',
        stream: 'NATURAL',
        duration: '5.0 Years (10 Semesters)',
        credits: '300 ECTS',
        modes: ['Regular Full-Time', 'Extension Evening'],
        intakeQuota: 240,
        careerPaths: ['Senior Software Engineer', 'Cloud Solutions Architect', 'Cybersecurity Specialist', 'AI Engineer'],
        curriculumHighlights: [
          { year: 'Year 1', modules: ['Applied Calculus I & II', 'Fundamentals of Programming (Python/C++)', 'Discrete Mathematics', 'Physics for Engineers'] },
          { year: 'Year 2', modules: ['Data Structures & Algorithms', 'Computer Architecture & Org', 'Object-Oriented Design (Java)', 'Database Management Systems'] },
          { year: 'Year 3', modules: ['Operating Systems & Concurrency', 'Software Requirements & Architecture', 'Computer Networks & Security', 'Web Applications'] },
          { year: 'Year 4', modules: ['Software Testing & Quality Assurance', '6-Month Industrial Practicum / Internship', 'Distributed Systems'] },
          { year: 'Year 5', modules: ['Senior Capstone Software Engineering Project I & II', 'AI & Machine Learning', 'Professional Ethics'] }
        ]
      },
      {
        name: 'B.Sc. in Civil Engineering',
        faculty: institution.code === 'AAU' ? 'Addis Ababa Institute of Technology (AAiT)' : 'College of Engineering & Technology',
        degreeLevel: 'BACHELOR',
        stream: 'NATURAL',
        duration: '5.0 Years (10 Semesters)',
        credits: '300 ECTS',
        modes: ['Regular Full-Time Day'],
        intakeQuota: 220,
        careerPaths: ['Structural Design Engineer', 'Highway & Transport Planner', 'Geotechnical Consultant', 'Construction Project Manager'],
        curriculumHighlights: [
          { year: 'Year 1', modules: ['Engineering Mechanics I (Statics)', 'Calculus & Linear Algebra', 'Engineering Drawing & CAD', 'General Physics'] },
          { year: 'Year 2', modules: ['Mechanics of Materials', 'Fluid Mechanics', 'Surveying I & II', 'Construction Materials Testing'] },
          { year: 'Year 3', modules: ['Structural Analysis I & II', 'Soil Mechanics', 'Hydrology & Water Resources', 'Reinforced Concrete I'] },
          { year: 'Year 4', modules: ['Steel & Timber Structures', 'Foundation Engineering', 'Highway Engineering', 'Industrial Internship'] },
          { year: 'Year 5', modules: ['Reinforced Concrete II', 'Contract Administration & Project Law', 'Senior Structural Capstone'] }
        ]
      },
      {
        name: 'B.A. in Accounting & Finance',
        faculty: institution.code === 'AAU' ? 'College of Business and Economics (CBE)' : 'College of Business & Economics',
        degreeLevel: 'BACHELOR',
        stream: 'SOCIAL',
        duration: '4.0 Years (8 Semesters)',
        credits: '240 ECTS',
        modes: ['Regular Day', 'Evening Extension', 'Weekend Modular'],
        intakeQuota: 300,
        careerPaths: ['Certified Public Accountant (CPA)', 'Bank Credit Manager', 'Tax Auditor', 'Financial Analyst'],
        curriculumHighlights: [
          { year: 'Year 1', modules: ['Principles of Accounting I & II', 'Microeconomics', 'Macroeconomics', 'Business Mathematics'] },
          { year: 'Year 2', modules: ['Financial Accounting (IFRS)', 'Cost & Management Accounting I', 'Business Law', 'Statistical Inference'] },
          { year: 'Year 3', modules: ['Advanced Financial Accounting', 'Corporate Finance', 'Taxation in Ethiopia', 'Audit & Assurance I'] },
          { year: 'Year 4', modules: ['Governmental & Non-Profit Accounting', 'Financial Institutions & Markets', 'Audit II', 'Senior Research'] }
        ]
      },
      {
        name: 'Bachelor of Laws (LL.B.)',
        faculty: institution.code === 'AAU' ? 'College of Law and Governance Studies (CLGS)' : 'College of Law',
        degreeLevel: 'BACHELOR',
        stream: 'SOCIAL',
        duration: '5.0 Years (10 Semesters)',
        credits: '300 ECTS',
        modes: ['Regular Full-Time', 'Extension Evening'],
        intakeQuota: 160,
        careerPaths: ['Attorney at Law', 'Federal / Regional Judge', 'Legal Counsel to Corporations', 'Diplomat / UN Officer'],
        curriculumHighlights: [
          { year: 'Year 1', modules: ['Introduction to Law & Legal Methods', 'Constitutional Law I', 'Law of Persons', 'Legal Research & Writing'] },
          { year: 'Year 2', modules: ['Law of Contracts I & II', 'Criminal Law I (General Principles)', 'Constitutional Law II', 'Property Law'] },
          { year: 'Year 3', modules: ['Law of Torts', 'Criminal Procedure', 'Commercial Law & Banking', 'Human Rights Law'] },
          { year: 'Year 4', modules: ['Civil Procedure I & II', 'Tax Law', 'Conflict of Laws', 'Moot Court & Legal Clinic'] },
          { year: 'Year 5', modules: ['International Law & Treaties', 'Maritime Law', 'Alternative Dispute Resolution', 'Senior Thesis'] }
        ]
      },
      {
        name: 'M.Sc. in Data Science & Artificial Intelligence',
        faculty: institution.code === 'AAU' ? 'Addis Ababa Institute of Technology (AAiT)' : 'Institute of Technology',
        degreeLevel: 'MASTER',
        stream: 'NATURAL',
        duration: '2.0 Years (4 Semesters)',
        credits: '120 ECTS',
        modes: ['Weekend & Extension Modular'],
        intakeQuota: 45,
        careerPaths: ['Lead AI Scientist', 'Data Architect', 'Machine Learning Infrastructure Engineer'],
        curriculumHighlights: [
          { year: 'Year 1', modules: ['Advanced Machine Learning', 'Deep Learning & Neural Networks', 'Distributed Big Data Architectures', 'Natural Language Processing for Ethiopic'] },
          { year: 'Year 2', modules: ['Computer Vision & Robotics', 'Research Methodology & Ethics in AI', 'Master Thesis Defense (30 ECTS)'] }
        ]
      },
      {
        name: 'Master of Business Administration (MBA)',
        faculty: institution.code === 'AAU' ? 'College of Business and Economics (CBE)' : 'College of Business & Economics',
        degreeLevel: 'MASTER',
        stream: 'SOCIAL',
        duration: '2.0 Years (4 Semesters)',
        credits: '120 ECTS',
        modes: ['Executive Weekend', 'Evening Modular'],
        intakeQuota: 90,
        careerPaths: ['Chief Executive Officer (CEO)', 'Management Consultant', 'Investment Banker', 'Operations Director'],
        curriculumHighlights: [
          { year: 'Year 1', modules: ['Strategic Management', 'Managerial Economics', 'Corporate Financial Strategy', 'Organizational Behavior & Leadership'] },
          { year: 'Year 2', modules: ['Supply Chain & Global Logistics', 'Business Analytics', 'Entrepreneurship & Innovation', 'Executive MBA Master Project'] }
        ]
      }
    ];
  };

  const allPrograms = getAllUniversityPrograms();
  const filteredPrograms = allPrograms.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(programSearch.toLowerCase()) || p.faculty.toLowerCase().includes(programSearch.toLowerCase());
    const matchesStream = programStreamFilter === 'ALL' || p.stream === programStreamFilter;
    const matchesLevel = programLevelFilter === 'ALL' || p.degreeLevel === programLevelFilter;
    return matchesSearch && matchesStream && matchesLevel;
  });

  // 3. Comprehensive Facilities & Infrastructure with Image Galleries
  const universityFacilitiesGallery: FacilityGalleryItem[] = [
    {
      id: 'kennedy-lib',
      name: 'Kennedy Memorial Central Library & Digital Hub',
      category: 'Library',
      location: 'Sidist Kilo Campus, Main Academic Quadrant',
      capacity: '4,500 Seated Capacity • 1.2M Physical Books',
      description: 'The national reference library and digital repository of Ethiopia, containing historical manuscripts, international academic journal subscriptions, and 24/7 quiet study hubs.',
      features: [
        'Over 1,200,000 physical volumes and bound periodicals',
        '24/7 Digital E-Resource Center with 500+ high-speed workstations',
        'Direct access to IEEE Xplore, ScienceDirect, JSTOR, and Springer',
        'Ethiopian Heritage & Ge’ez Rare Manuscript Archive Room'
      ],
      images: [
        { url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80', caption: 'Central Reading Hall & Academic Stacks' },
        { url: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=1200&q=80', caption: 'Silent Study Desks & Digital Catalog Stations' },
        { url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80', caption: 'Group Discussion & Collaborative Pods' }
      ]
    },
    {
      id: 'aait-labs',
      name: 'AAiT Advanced Polytechnic & AI Research Laboratories',
      category: 'Laboratory',
      location: '5 Kilo Campus, Innovation Complex',
      capacity: '42 Specialized Labs • 1,800 Concurrent Workstations',
      description: 'Cutting-edge engineering research facility featuring high-voltage electrical benches, materials testing rigs, clean-room robotics benches, and GPU supercomputing nodes.',
      features: [
        'NVIDIA GPU High-Performance AI & Machine Learning Cluster',
        'Hydraulics, Geotechnical & Soil Mechanics Testing Hall',
        'Renewable Solar Photovoltaic & Smart Microgrid Research Center',
        'Precision CNC Milling, 3D Prototyping & Fabrication FabLab'
      ],
      images: [
        { url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80', caption: 'Precision Robotics & Hardware Testing Rig' },
        { url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80', caption: 'Biochemical & Materials Analysis Workbenches' },
        { url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80', caption: 'Electronics & Circuit Design Studio' }
      ]
    },
    {
      id: 'black-lion-hospital',
      name: 'Tikur Anbessa (Black Lion) Teaching & Referral Hospital',
      category: 'Healthcare',
      location: 'Tikur Anbessa Campus, Central Addis Ababa',
      capacity: '800 Inpatient Beds • 2,000 Daily Outpatients',
      description: 'The national specialized tertiary hospital serving as the primary clinical clerkship and medical residency hospital for medical, pharmacy, and nursing students.',
      features: [
        'Comprehensive Oncology, Cardiac Surgery & Radiotherapy Centers',
        'Advanced Surgical Suites and Level-1 Trauma Emergency Care',
        'State-of-the-Art MRI, CT Scanning, and Pathology Diagnostics',
        'Full residency and medical clerkship inpatient training rotations'
      ],
      images: [
        { url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80', caption: 'Hospital Main Clinical Pavilion' },
        { url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80', caption: 'Clinical Skills Simulation Ward' }
      ]
    },
    {
      id: 'student-dorms',
      name: 'Residential Halls & Campus Dining Pavilions',
      category: 'Housing',
      location: 'Sidist Kilo, 5 Kilo, and FBE Residential Quads',
      capacity: '28,000 Dormitory Capacity • 8 Central Dining Halls',
      description: 'Complete student housing village providing safe dormitory accommodations, government-subsidized three-course daily meals, study rooms, and recreation areas.',
      features: [
        'Separate multi-story residential blocks for Male & Female freshmen and seniors',
        'Three daily government-subsidized meals served in hygienic central cafeterias',
        'High-speed Wi-Fi access in common recreation and study lounges',
        '24/7 security gate control, on-duty proctors, and laundry facilities'
      ],
      images: [
        { url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80', caption: 'Campus Dormitory Courtyard & Living Quarters' },
        { url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80', caption: 'Student Dining Hall & Common Area' },
        { url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80', caption: 'Residential Walkways & Green Campus Parks' }
      ]
    },
    {
      id: 'stadium-sports',
      name: 'Olympic Sports Stadium & Multi-Purpose Gymnasium',
      category: 'Sports',
      location: 'Main Campus Sports Complex',
      capacity: '15,000 Seated Spectators',
      description: 'Standard all-weather athletics track, professional football pitch, indoor basketball and volleyball arenas, and modern fitness gymnasium.',
      features: [
        'Standard 400m synthetic running track and natural grass football pitch',
        'Indoor sports pavilion for basketball, volleyball, badminton, and handball',
        'Student & staff strength-training and cardio fitness gymnasium',
        'Hosts annual Ethiopian Inter-University Athletic Games'
      ],
      images: [
        { url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80', caption: 'Olympic Track & Main Campus Football Stadium' },
        { url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80', caption: 'Indoor Gymnasium & Multi-Sport Arena' }
      ]
    },
    {
      id: 'ict-center',
      name: 'ICT Data Center & Campus Fiber Network Hub',
      category: 'ICT & Innovation',
      location: 'FBE & Sidist Kilo Campus',
      capacity: '10 Gbps Redundant Bandwidth • 50,000 Connected Devices',
      description: 'High-speed campus-wide fiber optic network connecting all 14 university campuses with redundant cloud data storage and e-learning servers.',
      features: [
        'Tier-2 campus data center powering the university portal and LMS',
        'Campus-wide eduroam and open authenticated student Wi-Fi network',
        'Cloud storage for students and certified academic email accounts',
        'Virtual classroom lecture recording studios'
      ],
      images: [
        { url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80', caption: 'Central Data Center Server Infrastructure' },
        { url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80', caption: 'Smart Classroom & Digital Learning Studio' }
      ]
    }
  ];

  const filteredFacilities = universityFacilitiesGallery.filter(f => 
    selectedFacilityCategory === 'ALL' || f.category === selectedFacilityCategory
  );

  const nextImage = (facilityId: string, maxImages: number) => {
    setGalleryIndexes(prev => ({
      ...prev,
      [facilityId]: ((prev[facilityId] || 0) + 1) % maxImages
    }));
  };

  const prevImage = (facilityId: string, maxImages: number) => {
    setGalleryIndexes(prev => ({
      ...prev,
      [facilityId]: ((prev[facilityId] || 0) - 1 + maxImages) % maxImages
    }));
  };

  const featurePills = [
    'Accepts regular first-year intake',
    institution.region + ' State',
    (institution.ownership === 'PUBLIC' ? 'Public Autonomous' : 'Accredited Private') + ' Institution',
    institution.totalFaculties + ' Accredited Faculties',
    institution.totalPrograms + ' Degree Programs',
    institution.ownership === 'PUBLIC' ? 'Cost-sharing scheme eligible' : 'Self-sponsored / Credit-based',
    'No additional entrance fee for MoE assigned',
    'Dormitory & Meal Plan Accommodations Available'
  ];

  return (
    <div className={`min-h-screen antialiased font-sans transition-colors duration-200 ${
      isDark ? 'bg-zinc-950 text-white' : 'bg-[#FAF9F6] text-slate-900'
    }`}>
      
      {/* 1. Full-Width Campus Hero */}
      <div className="relative h-[340px] sm:h-[420px] lg:h-[460px] w-full overflow-hidden bg-slate-900">
        <img
          src={currentPhotos.hero}
          alt={institution.nameEn}
          className="w-full h-full object-cover object-center opacity-50 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-between max-w-7xl mx-auto px-6 sm:px-10 py-8">
          <div>
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Directory</span>
            </button>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight">
              {institution.nameEn}
            </h1>
            {institution.nameAm && (
              <p className="text-sm sm:text-base text-slate-300 font-ethiopic mt-1">
                {institution.nameAm}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  if (onNavigateToTab) onNavigateToTab('admissions');
                  else alert(`Inquiry initiated for ${institution.nameEn}`);
                }}
                className="px-7 py-3 rounded-full bg-white text-slate-950 hover:bg-slate-100 text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                Apply for first-year
              </button>

              <button
                onClick={() => {
                  if (onNavigateToTab) onNavigateToTab('ai-advisor');
                }}
                className="px-6 py-3 rounded-full bg-[#0C373D] hover:bg-[#072428] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask AI Advisor</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Navigation Bar for 8 Dedicated University Sections */}
      <div className={`sticky top-0 z-40 backdrop-blur-md border-b shadow-sm transition-colors ${
        isDark ? 'bg-zinc-950/95 border-zinc-800' : 'bg-white/95 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center gap-1.5 overflow-x-auto py-3 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#0C373D] text-white shadow-sm font-bold'
                    : (isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12">
        
        {/* ========================================================================= */}
        {/* A. OVERVIEW TAB: 2-Column Layout with Right Sidebar                       */}
        {/* ========================================================================= */}
        {activeSection === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start animate-fadeIn">
            
            {/* Left Column: Overview Details */}
            <div className="lg:col-span-8 space-y-8">
              <div>
                <span className="text-xs font-bold text-[#0C373D] uppercase tracking-wider">Institutional Profile</span>
                <h2 className={`text-2xl sm:text-3xl font-serif font-bold mt-1 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  About {institution.nameEn}
                </h2>
              </div>

              <div className={`space-y-4 leading-relaxed text-sm sm:text-base ${
                isDark ? 'text-zinc-300' : 'text-slate-700'
              }`}>
                <p>
                  {institution.nameEn} is one of Ethiopia’s cornerstone tertiary institutions, catering to tens of thousands of regular and extension students across bachelor, graduate, and doctoral levels. Rooted in academic rigor and driven by national developmental goals, the institution provides certified qualifications in science, technology, medicine, law, and the humanities.
                </p>
                <p>
                  {institution.overview} With {institution.totalFaculties} specialized faculties and over {institution.totalPrograms} accredited programs, students gain practical hands-on experience supported by certified faculty and comprehensive campus infrastructure.
                </p>
              </div>

              {/* Feature Badges */}
              <div className="flex flex-wrap gap-2 pt-2">
                {featurePills.map((pill, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#D8E6C8] text-[#2D4A1D] border border-[#C5D8B0]"
                  >
                    {pill}
                  </span>
                ))}
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                <div className={`p-4 rounded-2xl border text-center ${
                  isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                }`}>
                  <p className={`text-xs font-bold uppercase ${isDark ? 'text-zinc-400' : 'text-slate-400'}`}>Colleges / Faculties</p>
                  <p className={`text-2xl font-serif font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{institution.totalFaculties}</p>
                </div>
                <div className={`p-4 rounded-2xl border text-center ${
                  isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                }`}>
                  <p className={`text-xs font-bold uppercase ${isDark ? 'text-zinc-400' : 'text-slate-400'}`}>Departments</p>
                  <p className={`text-2xl font-serif font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{institution.totalDepartments}</p>
                </div>
                <div className={`p-4 rounded-2xl border text-center ${
                  isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                }`}>
                  <p className={`text-xs font-bold uppercase ${isDark ? 'text-zinc-400' : 'text-slate-400'}`}>Accredited Programs</p>
                  <p className={`text-2xl font-serif font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{institution.totalPrograms}</p>
                </div>
                <div className={`p-4 rounded-2xl border text-center ${
                  isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                }`}>
                  <p className={`text-xs font-bold uppercase ${isDark ? 'text-zinc-400' : 'text-slate-400'}`}>Scholarships</p>
                  <p className={`text-2xl font-serif font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{institution.scholarshipsAvailable || 12}</p>
                </div>
              </div>

              {/* Campus Tour Photo Banner */}
              <div className="relative rounded-2xl overflow-hidden shadow-sm h-72 sm:h-96 w-full bg-slate-900 group mt-4">
                <img
                  src={currentPhotos.campusTour}
                  alt={`${institution.nameEn} Campus Grounds`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-between p-6">
                  <div>
                    <span className="text-xs uppercase font-bold text-amber-300 tracking-wider">Campus View</span>
                    <p className="text-lg sm:text-xl font-bold text-white mt-0.5">Explore Our Campus Grounds</p>
                  </div>
                  <button 
                    onClick={() => setActiveSection('facilities')}
                    className="px-4 py-2 bg-[#5AA7A7] hover:bg-[#4E9F9F] text-white text-xs font-bold uppercase rounded-lg shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>View All Facilities</span>
                  </button>
                </div>
              </div>

              {/* Quick Shortcuts */}
              <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-amber-50/60 border-amber-200/80'
              }`}>
                <div>
                  <h3 className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>Explore Academic Departments</h3>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>Browse all official schools, colleges, and divisions operating at {institution.code}.</p>
                </div>
                <button
                  onClick={() => setActiveSection('faculties')}
                  className="px-4 py-2 bg-[#0C373D] hover:bg-[#072428] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <span>View Faculties</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column: Overview Sidebar */}
            <div className="lg:col-span-4 space-y-8 sticky top-20">
              
              {/* 1. University Emblem & Logo Card */}
              <div className="bg-[#0F172A] text-white rounded-2xl p-6 text-center shadow-lg border border-slate-800">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 rounded-2xl bg-[#1E293B] border border-slate-700 flex items-center justify-center font-serif text-2xl font-bold text-white tracking-wider shadow-inner">
                    {institution.code}
                  </div>
                </div>
                <h3 className="font-serif font-bold text-xl">{institution.nameEn}</h3>
                <p className="text-xs text-slate-400 mt-1">Established in {institution.establishedYear}</p>
                
                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-center gap-2 text-xs text-emerald-400 font-semibold">
                  <Award className="w-4 h-4" />
                  <span>MoE & ETA Accredited Institution</span>
                </div>

                <button
                  onClick={() => {
                    if (onNavigateToTab) onNavigateToTab('admissions');
                    else alert(`Inquiry submitted for ${institution.nameEn}`);
                  }}
                  className="mt-6 w-full py-3.5 rounded-full bg-[#0C373D] hover:bg-[#072428] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  Apply for first-year
                </button>
              </div>

              {/* 2. Admissions Office & Location Card */}
              <div className={`border rounded-2xl p-6 space-y-4 shadow-sm ${
                isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}>
                <h3 className={`font-serif font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>Admissions Office</h3>
                
                <div className="h-32 rounded-xl bg-slate-200 overflow-hidden relative border border-slate-300 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80"
                    alt="Campus Location Map"
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-indigo-950/20" />
                  <div className="absolute p-2 bg-white rounded-full shadow-md text-[#0C373D]">
                    <MapPin className="w-5 h-5" />
                  </div>
                </div>

                <div className={`space-y-3 text-xs ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                  <div>
                    <span className={`font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>Campus Address</span>
                    <p>{institution.city}, {institution.region}, Ethiopia</p>
                  </div>
                  <div>
                    <span className={`font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>Phone number</span>
                    <p className="flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-[#0C373D]" />
                      <span>+251 11 123 4567</span>
                    </p>
                  </div>
                  <div>
                    <span className={`font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>Registrar Email</span>
                    <p className="flex items-center gap-1.5 mt-0.5 text-[#0C373D]">
                      <Mail className="w-3.5 h-3.5" />
                      <span>registrar@{institution.code.toLowerCase()}.edu.et</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. For First-Year & Transfer Students */}
              <div className={`border rounded-2xl p-6 space-y-3 text-xs shadow-sm ${
                isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}>
                <h3 className={`font-serif font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>For First-Year Students</h3>
                
                <div>
                  <span className={`font-bold block ${isDark ? 'text-zinc-200' : 'text-slate-700'}`}>Official University Website</span>
                  <a
                    href={institution.websiteUrl || `http://www.${institution.code.toLowerCase()}.edu.et`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0C373D] hover:underline flex items-center gap-1 mt-0.5 font-medium break-all"
                  >
                    <span>{institution.websiteUrl || `www.${institution.code.toLowerCase()}.edu.et`}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>

                <div>
                  <span className={`font-bold block ${isDark ? 'text-zinc-200' : 'text-slate-700'}`}>Admissions Portal</span>
                  <a
                    href={`http://www.${institution.code.toLowerCase()}.edu.et/admissions`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0C373D] hover:underline flex items-center gap-1 mt-0.5 font-medium"
                  >
                    <span>portal.{institution.code.toLowerCase()}.edu.et/admissions</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>

                <div>
                  <span className={`font-bold block ${isDark ? 'text-zinc-200' : 'text-slate-700'}`}>Cost-Sharing & Financial Aid</span>
                  <p className={`mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                    Administered in accordance with Ministry of Education cost-sharing regulations.
                  </p>
                </div>
              </div>

              {/* 4. Region Locator Card */}
              <div className={`border rounded-2xl p-6 space-y-3 shadow-sm ${
                isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}>
                <h3 className={`font-serif font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>Region</h3>
                <div className={`p-3 rounded-xl border flex items-center justify-between ${
                  isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div>
                    <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{institution.region}</p>
                    <p className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Regional Higher Ed Hub</p>
                  </div>
                  <span className="text-xs font-bold text-[#0C373D] bg-amber-50 px-2 py-1 rounded border border-amber-200">
                    {institution.city}
                  </span>
                </div>
                <button
                  onClick={onBack}
                  className="text-xs font-bold text-[#0C373D] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View all universities in {institution.region} ›</span>
                </button>
              </div>

              {/* 5. Follow Channels */}
              <div className={`border rounded-2xl p-6 space-y-3 shadow-sm ${
                isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}>
                <h3 className={`font-serif font-bold text-xs uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Follow {institution.code}</h3>
                <div className={`flex items-center gap-3 text-xs font-semibold ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                  <span className="hover:text-[#0C373D] cursor-pointer">Telegram</span>
                  <span>•</span>
                  <span className="hover:text-[#0C373D] cursor-pointer">Facebook</span>
                  <span>•</span>
                  <span className="hover:text-[#0C373D] cursor-pointer">YouTube</span>
                  <span>•</span>
                  <span className="hover:text-[#0C373D] cursor-pointer"><Share2 className="w-3.5 h-3.5 inline" /></span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* B. FACULTIES & DEPTS TAB                                                  */}
        {/* ========================================================================= */}
        {activeSection === 'faculties' && (
          <div className="space-y-8 animate-fadeIn">
            <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 ${
              isDark ? 'border-zinc-800' : 'border-slate-200'
            }`}>
              <div>
                <span className="text-xs font-bold text-[#0C373D] uppercase tracking-wider">Academic Architecture</span>
                <h2 className={`text-2xl sm:text-4xl font-serif font-bold mt-1 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  Faculties, Schools & Departments of {institution.nameEn}
                </h2>
                <p className={`text-sm mt-1 max-w-3xl ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                  Comprehensive directory of official colleges, academic institutes, and specialized departments operating across all {institution.code} campuses.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`} />
                <input
                  type="text"
                  placeholder="Search faculty, department, or dean..."
                  value={facultySearch}
                  onChange={(e) => setFacultySearch(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0C373D] transition-all ${
                    isDark 
                      ? 'bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500' 
                      : 'bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 shadow-sm'
                  }`}
                />
              </div>
            </div>

            {/* Comprehensive Faculty Cards */}
            <div className="space-y-8">
              {facultiesData
                .filter(fac => 
                  fac.name.toLowerCase().includes(facultySearch.toLowerCase()) ||
                  fac.campus.toLowerCase().includes(facultySearch.toLowerCase()) ||
                  fac.dean.toLowerCase().includes(facultySearch.toLowerCase()) ||
                  fac.departments.some(d => d.name.toLowerCase().includes(facultySearch.toLowerCase()) || d.specialization.toLowerCase().includes(facultySearch.toLowerCase()))
                )
                .map((fac) => (
                  <div key={fac.id} className={`p-6 sm:p-8 rounded-3xl border transition-all ${
                    isDark 
                      ? 'bg-zinc-900 border-zinc-800 text-white shadow-none' 
                      : 'bg-white border-slate-200 text-slate-900 shadow-sm hover:shadow-md'
                  }`}>
                    
                    {/* Faculty Header */}
                    <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b pb-6 ${
                      isDark ? 'border-zinc-800' : 'border-slate-100'
                    }`}>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#0C373D]/10 text-[#0C373D]">
                            Faculty / College
                          </span>
                          <span className={`px-3 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 ${
                            isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-100 text-slate-700'
                          }`}>
                            <MapPin className="w-3 h-3 text-[#0C373D]" />
                            {fac.campus}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-[11px] font-semibold ${
                            isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-100 text-slate-700'
                          }`}>
                            Est. {fac.established}
                          </span>
                        </div>
                        <h3 className={`font-serif font-bold text-xl sm:text-2xl mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {fac.name}
                        </h3>
                        <p className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                          Dean: <strong className={isDark ? 'text-zinc-200' : 'text-slate-800'}>{fac.dean}</strong>
                        </p>
                      </div>

                      <div className={`flex items-center gap-4 text-xs font-semibold px-4 py-2 rounded-2xl border self-start lg:self-center ${
                        isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-slate-50 border-slate-100 text-slate-600'
                      }`}>
                        <div>
                          <span className={`block text-[10px] uppercase ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Enrolled Students</span>
                          <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{fac.studentCount.toLocaleString()}+</span>
                        </div>
                        <div className={`h-6 w-px ${isDark ? 'bg-zinc-800' : 'bg-slate-200'}`} />
                        <div>
                          <span className={`block text-[10px] uppercase ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Faculty Staff</span>
                          <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{fac.facultyCount}+</span>
                        </div>
                        <div className={`h-6 w-px ${isDark ? 'bg-zinc-800' : 'bg-slate-200'}`} />
                        <div>
                          <span className={`block text-[10px] uppercase ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Departments</span>
                          <span className="font-bold text-[#0C373D] text-sm">{fac.departments.length}</span>
                        </div>
                      </div>
                    </div>

                    <p className={`text-sm mt-4 leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                      {fac.description}
                    </p>

                    {/* Departments Detail Grid */}
                    <div className="mt-6">
                      <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-zinc-400' : 'text-slate-400'}`}>
                        Accredited Academic Departments & Degree Offerings
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {fac.departments.map((dept, dIdx) => (
                          <div key={dIdx} className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                            isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-slate-50/80 border-slate-200 text-slate-900'
                          }`}>
                            <div>
                              <div className="flex items-center justify-between gap-2">
                                <h5 className={`font-serif font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{dept.name}</h5>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                  isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-slate-200 text-slate-500'
                                }`}>
                                  {dept.enrolled} Students
                                </span>
                              </div>
                              <p className={`text-[11px] mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Department Head: {dept.head}</p>
                              
                              <p className={`text-xs mt-2 font-medium ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                                <span className={`font-normal ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Specialization:</span> {dept.specialization}
                              </p>
                            </div>

                            <div className={`mt-3 pt-3 border-t flex flex-wrap gap-1.5 ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
                              {dept.degrees.map((deg, degIdx) => (
                                <span key={degIdx} className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                                  isDark ? 'bg-zinc-900 text-amber-300 border border-zinc-800' : 'bg-white text-[#0C373D] border border-amber-200'
                                }`}>
                                  {deg}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* C. PROGRAMS & CURRICULA TAB                                               */}
        {/* ========================================================================= */}
        {activeSection === 'programs' && (
          <div className="space-y-8 animate-fadeIn">
            <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 ${
              isDark ? 'border-zinc-800' : 'border-slate-200'
            }`}>
              <div>
                <span className="text-xs font-bold text-[#0C373D] uppercase tracking-wider">Curriculum Catalog</span>
                <h2 className={`text-2xl sm:text-4xl font-serif font-bold mt-1 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  Accredited Programs & Curricula
                </h2>
                <p className={`text-sm mt-1 max-w-3xl ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                  Explore complete degree roadmaps, semester course structures, credit hour requirements, and study modes available at {institution.nameEn}.
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full md:w-72">
                <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`} />
                <input
                  type="text"
                  placeholder="Search program or field..."
                  value={programSearch}
                  onChange={(e) => setProgramSearch(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0C373D] ${
                    isDark ? 'bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500' : 'bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 shadow-sm'
                  }`}
                />
              </div>
            </div>

            {/* Filter Bar */}
            <div className={`flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border ${
              isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <span className={`text-xs font-bold mr-2 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Level:</span>
                {(['ALL', 'BACHELOR', 'MASTER', 'DOCTORAL'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setProgramLevelFilter(level)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      programLevelFilter === level
                        ? 'bg-[#0C373D] text-white shadow-sm'
                        : (isDark ? 'bg-zinc-950 text-zinc-300 border border-zinc-800 hover:text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200')
                    }`}
                  >
                    {level === 'ALL' ? 'All Degrees' : level}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-bold mr-2 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Stream:</span>
                {(['ALL', 'NATURAL', 'SOCIAL'] as const).map((stream) => (
                  <button
                    key={stream}
                    onClick={() => setProgramStreamFilter(stream)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      programStreamFilter === stream
                        ? (isDark ? 'bg-white text-black font-bold' : 'bg-slate-900 text-white shadow-sm')
                        : (isDark ? 'bg-zinc-950 text-zinc-300 border border-zinc-800 hover:text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200')
                    }`}
                  >
                    {stream === 'ALL' ? 'Both Streams' : `${stream} Science`}
                  </button>
                ))}
              </div>
            </div>

            {/* Program Detail Cards */}
            <div className="space-y-6">
              {filteredPrograms.map((prog, idx) => (
                <div key={idx} className={`p-6 sm:p-8 rounded-3xl border transition-all space-y-6 ${
                  isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                }`}>
                  
                  {/* Top Meta */}
                  <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b pb-6 ${
                    isDark ? 'border-zinc-800' : 'border-slate-100'
                  }`}>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#0C373D]/10 text-[#0C373D]">
                          {prog.degreeLevel} • {prog.stream} STREAM
                        </span>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-semibold ${
                          isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {prog.credits}
                        </span>
                        <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Ministry Accredited
                        </span>
                      </div>
                      <h3 className={`font-serif font-bold text-2xl sm:text-3xl mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {prog.name}
                      </h3>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                        Administering Faculty: <span className="font-semibold text-[#0C373D]">{prog.faculty}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`px-4 py-2 rounded-2xl border text-center ${
                        isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-100'
                      }`}>
                        <span className={`text-[10px] uppercase font-bold block ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Duration</span>
                        <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{prog.duration}</span>
                      </div>
                      <div className={`px-4 py-2 rounded-2xl border text-center ${
                        isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-100'
                      }`}>
                        <span className={`text-[10px] uppercase font-bold block ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Intake Seats</span>
                        <span className="font-bold text-sm text-[#0C373D]">{prog.intakeQuota}</span>
                      </div>
                    </div>
                  </div>

                  {/* Career Paths & Study Modes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className={`p-4 rounded-2xl border ${
                      isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-slate-50 border-slate-100 text-slate-700'
                    }`}>
                      <span className={`font-bold uppercase tracking-wider text-[11px] block mb-2 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                        Target Career Pathways
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {prog.careerPaths.map((c, cIdx) => (
                          <span key={cIdx} className={`px-2.5 py-1 rounded-lg font-medium ${
                            isDark ? 'bg-zinc-900 text-zinc-300 border border-zinc-800' : 'bg-white text-slate-800 border border-slate-200'
                          }`}>
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className={`p-4 rounded-2xl border ${
                      isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-slate-50 border-slate-100 text-slate-700'
                    }`}>
                      <span className={`font-bold uppercase tracking-wider text-[11px] block mb-2 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                        Available Study Modes & Delivery
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {prog.modes.map((m, mIdx) => (
                          <span key={mIdx} className="bg-amber-50 text-[#0C373D] border border-amber-200 px-2.5 py-1 rounded-lg font-semibold">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Year-by-Year Curriculum Modules */}
                  <div>
                    <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5 ${
                      isDark ? 'text-zinc-400' : 'text-slate-400'
                    }`}>
                      <Layers className="w-4 h-4 text-[#0C373D]" />
                      <span>Curriculum Breakdown by Academic Year</span>
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {prog.curriculumHighlights.map((yr, yIdx) => (
                        <div key={yIdx} className={`p-4 rounded-2xl border ${
                          isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50/90 border-slate-200/80'
                        }`}>
                          <div className={`font-serif font-bold text-xs pb-2 mb-2 border-b flex items-center justify-between ${
                            isDark ? 'text-amber-400 border-zinc-800' : 'text-[#0C373D] border-slate-200'
                          }`}>
                            <span>{yr.year}</span>
                            <span className={`text-[10px] font-normal ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{yr.modules.length} Core Modules</span>
                          </div>
                          <ul className="space-y-1.5 text-xs">
                            {yr.modules.map((mod, mIdx) => (
                              <li key={mIdx} className={`flex items-start gap-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#0C373D] shrink-0 mt-1.5" />
                                <span>{mod}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* D. ADMISSIONS & CUT-OFFS TAB                                              */}
        {/* ========================================================================= */}
        {activeSection === 'admissions' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <span className="text-xs font-bold text-[#0C373D] uppercase tracking-wider">Placement Matrix</span>
              <h2 className={`text-2xl sm:text-4xl font-serif font-bold mt-1 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Official Admission Cut-Off Scores & Matriculation Criteria
              </h2>
              <p className={`text-sm mt-1 max-w-3xl ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                Official Ethiopian University Entrance Examination (EUEE) minimum cutoff points for 2016/2017 E.C. regular undergraduate intake at {institution.nameEn}.
              </p>
            </div>

            {/* Cutoffs Table */}
            <div className={`rounded-3xl border shadow-sm overflow-hidden ${
              isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
            }`}>
              <div className="overflow-x-auto">
                <table className={`w-full text-left text-xs ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                  <thead className={`border-b font-semibold uppercase tracking-wider text-[11px] ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}>
                    <tr>
                      <th className="py-4 px-6">Department / Program</th>
                      <th className="py-4 px-6">Stream</th>
                      <th className="py-4 px-6">Male Cut-Off</th>
                      <th className="py-4 px-6">Female Cut-Off</th>
                      <th className="py-4 px-6">Quota Seats</th>
                      <th className="py-4 px-6">Admission Criteria</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-zinc-800' : 'divide-slate-100'}`}>
                    {(institution.admissions || []).map((adm, aIdx) => (
                      <tr key={aIdx} className={`transition-colors ${isDark ? 'hover:bg-zinc-800/50' : 'hover:bg-slate-50/80'}`}>
                        <td className={`py-4 px-6 font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{adm.programName}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-0.5 rounded-full font-semibold ${
                            isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {adm.stream}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-bold text-[#0C373D] text-sm">{adm.maleCutoff} pts</td>
                        <td className="py-4 px-6 font-bold text-emerald-600 text-sm">{adm.femaleCutoff} pts</td>
                        <td className={`py-4 px-6 font-semibold ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>180 Regular Intake</td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded border border-emerald-200 font-semibold text-[11px]">
                            <Check className="w-3 h-3" /> Ministry Placement List
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* E. TUITION & COST SHARING TAB                                             */}
        {/* ========================================================================= */}
        {activeSection === 'tuition' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <span className="text-xs font-bold text-[#0C373D] uppercase tracking-wider">Financial Structure</span>
              <h2 className={`text-2xl sm:text-4xl font-serif font-bold mt-1 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Tuition Fees & Government Cost-Sharing Terms
              </h2>
              <p className={`text-sm mt-1 max-w-3xl ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                Transparent breakdown of tuition per credit hour for self-sponsored/extension students and national cost-sharing repayment guidelines.
              </p>
            </div>

            {/* Tuition Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-6 rounded-3xl border shadow-sm space-y-4 ${
                isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}>
                <span className="text-xs font-bold text-[#0C373D] uppercase tracking-wider">Undergraduate Regular</span>
                <h3 className={`text-3xl font-serif font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Cost Sharing</h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                  100% government tuition grant with deferred cost-sharing repayment post-graduation after securing formal employment.
                </p>
                <div className={`pt-4 border-t text-xs space-y-2 ${isDark ? 'border-zinc-800 text-zinc-400' : 'border-slate-100 text-slate-500'}`}>
                  <p>• Tuition Grant: 100% Subsidized</p>
                  <p>• Boarding & Meal: Government Covered</p>
                  <p>• Repayment: 10% monthly deduction after work</p>
                </div>
              </div>

              <div className={`p-6 rounded-3xl border shadow-sm space-y-4 ${
                isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}>
                <span className="text-xs font-bold text-[#0C373D] uppercase tracking-wider">Extension / Evening B.Sc.</span>
                <h3 className="text-3xl font-serif font-bold text-[#0C373D]">750 - 950 <span className="text-xs font-normal text-slate-400">ETB/credit</span></h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                  Flexible self-sponsored credit fee structure for working professionals attending evening or weekend modular sessions.
                </p>
                <div className={`pt-4 border-t text-xs space-y-2 ${isDark ? 'border-zinc-800 text-zinc-400' : 'border-slate-100 text-slate-500'}`}>
                  <p>• Registration fee: 500 ETB per semester</p>
                  <p>• Lab & Practicum fee: 1,200 ETB</p>
                  <p>• Installment payments allowed</p>
                </div>
              </div>

              <div className={`p-6 rounded-3xl border shadow-sm space-y-4 ${
                isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}>
                <span className="text-xs font-bold text-[#0C373D] uppercase tracking-wider">Postgraduate M.Sc. / MBA</span>
                <h3 className="text-3xl font-serif font-bold text-[#0C373D]">1,250 - 1,800 <span className="text-xs font-normal text-slate-400">ETB/credit</span></h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                  Accredited master and doctoral tuition for industry leaders, researchers, and government sponsored fellows.
                </p>
                <div className={`pt-4 border-t text-xs space-y-2 ${isDark ? 'border-zinc-800 text-zinc-400' : 'border-slate-100 text-slate-500'}`}>
                  <p>• Thesis Examination fee: 6,000 ETB</p>
                  <p>• Research Lab access: Included</p>
                  <p>• Industry sponsorship certificates accepted</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* F. FACILITIES & INFRASTRUCTURE TAB: Image Galleries Included              */}
        {/* ========================================================================= */}
        {activeSection === 'facilities' && (
          <div className="space-y-8 animate-fadeIn">
            <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 ${
              isDark ? 'border-zinc-800' : 'border-slate-200'
            }`}>
              <div>
                <span className="text-xs font-bold text-[#0C373D] uppercase tracking-wider">Campus Resources</span>
                <h2 className={`text-2xl sm:text-4xl font-serif font-bold mt-1 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  Facilities, Labs & Student Living Infrastructure
                </h2>
                <p className={`text-sm mt-1 max-w-3xl ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                  Browse comprehensive photo galleries and specifications for central libraries, advanced laboratories, research centers, and dormitories.
                </p>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {(['ALL', 'Library', 'Laboratory', 'Healthcare', 'Housing', 'Sports', 'ICT & Innovation'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedFacilityCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedFacilityCategory === cat
                        ? 'bg-[#0C373D] text-white shadow-sm'
                        : (isDark ? 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50')
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Facilities Cards with Image Slideshow */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredFacilities.map((fac) => {
                const currentImgIdx = galleryIndexes[fac.id] || 0;
                const currentImg = fac.images[currentImgIdx] || fac.images[0];
                return (
                  <div key={fac.id} className={`rounded-3xl border overflow-hidden transition-all flex flex-col justify-between ${
                    isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                  }`}>
                    
                    {/* Facility Image Slideshow */}
                    <div className="relative h-64 sm:h-72 w-full bg-slate-900 overflow-hidden group">
                      <img
                        src={currentImg.url}
                        alt={currentImg.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      
                      {/* Category Tag */}
                      <span className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20">
                        {fac.category}
                      </span>

                      {/* Photo Caption */}
                      <div className="absolute bottom-4 left-4 right-16">
                        <p className="text-white text-xs font-semibold drop-shadow">{currentImg.caption}</p>
                        <span className="text-[10px] text-slate-300">Photo {currentImgIdx + 1} of {fac.images.length}</span>
                      </div>

                      {/* Gallery Navigation Arrows */}
                      {fac.images.length > 1 && (
                        <div className="absolute bottom-4 right-4 flex items-center gap-1">
                          <button
                            onClick={() => prevImage(fac.id, fac.images.length)}
                            className="p-1.5 rounded-full bg-white/30 hover:bg-white/50 backdrop-blur-md text-white transition-all cursor-pointer"
                            aria-label="Previous image"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => nextImage(fac.id, fac.images.length)}
                            className="p-1.5 rounded-full bg-white/30 hover:bg-white/50 backdrop-blur-md text-white transition-all cursor-pointer"
                            aria-label="Next image"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Facility Details */}
                    <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className={`font-serif font-bold text-xl sm:text-2xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {fac.name}
                          </h3>
                        </div>
                        <p className={`text-xs mt-1 flex items-center gap-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                          <MapPin className="w-3.5 h-3.5 text-[#0C373D]" />
                          <span>{fac.location} • {fac.capacity}</span>
                        </p>

                        <p className={`text-xs mt-3 leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                          {fac.description}
                        </p>

                        {/* Feature Checklist */}
                        <div className={`mt-4 pt-4 border-t space-y-2 text-xs ${isDark ? 'border-zinc-800 text-zinc-300' : 'border-slate-100 text-slate-700'}`}>
                          {fac.features.map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#0C373D] shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Thumbnail Strip */}
                      {fac.images.length > 1 && (
                        <div className="flex items-center gap-2 pt-2">
                          {fac.images.map((img, tIdx) => (
                            <button
                              key={tIdx}
                              onClick={() => setGalleryIndexes(prev => ({ ...prev, [fac.id]: tIdx }))}
                              className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                                currentImgIdx === tIdx ? 'border-[#0C373D] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                              }`}
                            >
                              <img src={img.url} alt="" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}

                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* G. SCHOLARSHIPS & AID TAB                                                 */}
        {/* ========================================================================= */}
        {activeSection === 'scholarships' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <span className="text-xs font-bold text-[#0C373D] uppercase tracking-wider">Financial Opportunities</span>
              <h2 className={`text-2xl sm:text-4xl font-serif font-bold mt-1 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Scholarships, Grants & Merit Fellowships
              </h2>
              <p className={`text-sm mt-1 max-w-3xl ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                Discover government, institutional, and international grants available for undergraduate and graduate scholars at {institution.nameEn}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Ministry of Education Female Academic Excellence Scholarship',
                  amount: 'Full Living Stipend + Free Dormitory',
                  eligibility: 'Top 5% scoring female candidates in the National EUEE examination',
                  deadline: 'Meskerem 30, 2017 E.C.'
                },
                {
                  title: 'STEM Innovation & Digital Technology Research Fellowship',
                  amount: '50,000 ETB Annual Project Grant',
                  eligibility: 'Undergraduate engineering seniors working on Ethiopian developmental projects',
                  deadline: 'Tikimt 15, 2017 E.C.'
                },
                {
                  title: 'Postgraduate Graduate Assistantship (GA-I / GA-II)',
                  amount: 'Monthly University Salary + Full Tuition Exemption',
                  eligibility: 'Graduating seniors with CGPA >= 3.75 admitted to Master degrees',
                  deadline: 'Hidar 1, 2017 E.C.'
                },
                {
                  title: 'Regional Emerging State Support Scheme',
                  amount: 'Complete Food, Book & Lodging Subsidy',
                  eligibility: 'Assigned students from pastoralist and developing regional states',
                  deadline: 'Rolling Intake'
                }
              ].map((sch, sIdx) => (
                <div key={sIdx} className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-4 ${
                  isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}>
                  <span className="text-xs font-bold text-[#0C373D] uppercase tracking-wider">Merit & Need-Based</span>
                  <h3 className={`font-serif font-bold text-xl sm:text-2xl ${isDark ? 'text-white' : 'text-slate-900'}`}>{sch.title}</h3>
                  <div className="p-3 bg-emerald-50 text-emerald-800 font-bold text-sm rounded-xl border border-emerald-200 inline-block">
                    {sch.amount}
                  </div>
                  <div className={`text-xs space-y-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                    <p><strong className={isDark ? 'text-zinc-200' : 'text-slate-800'}>Eligibility:</strong> {sch.eligibility}</p>
                    <p><strong className={isDark ? 'text-zinc-200' : 'text-slate-800'}>Deadline:</strong> {sch.deadline}</p>
                  </div>
                  <button className="w-full py-2.5 bg-[#0C373D] hover:bg-[#072428] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer">
                    Apply for Fellowship
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* H. ACADEMIC CALENDAR TAB                                                  */}
        {/* ========================================================================= */}
        {activeSection === 'calendar' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <span className="text-xs font-bold text-[#0C373D] uppercase tracking-wider">Key Milestones</span>
              <h2 className={`text-2xl sm:text-4xl font-serif font-bold mt-1 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Official Academic Calendar (2016 / 2017 E.C.)
              </h2>
              <p className={`text-sm mt-1 max-w-3xl ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                Key registrar timelines, intake registration deadlines, semester exams, and graduation ceremonies for {institution.nameEn}.
              </p>
            </div>

            <div className={`rounded-3xl border shadow-sm p-6 sm:p-8 space-y-6 ${
              isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
            }`}>
              {[
                { date: 'Meskerem 15 - 20, 2017 E.C.', event: 'Freshman Orientation & Dormitory Check-In', type: 'ORIENTATION' },
                { date: 'Meskerem 25, 2017 E.C.', event: 'Official Commencement of Semester I Classes', type: 'ACADEMIC' },
                { date: 'Hidar 10 - 15, 2017 E.C.', event: 'Mid-Semester Examinations & Continuous Assessment', type: 'EXAM' },
                { date: 'Tahsas 25 - Tir 10, 2017 E.C.', event: 'Semester I Final Examinations', type: 'EXAM' },
                { date: 'Tir 15 - 25, 2017 E.C.', event: 'Inter-Semester Student Break', type: 'BREAK' },
                { date: 'Yekatit 1, 2017 E.C.', event: 'Commencement of Semester II Classes', type: 'ACADEMIC' },
                { date: 'Sene 25 - Hamle 5, 2017 E.C.', event: 'Annual Commencement & Graduation Ceremony', type: 'GRADUATION' }
              ].map((cal, cIdx) => (
                <div key={cIdx} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b last:border-none ${
                  isDark ? 'border-zinc-800' : 'border-slate-100'
                }`}>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#0C373D]/10 text-[#0C373D] flex items-center justify-center font-bold text-xs">
                      {cIdx + 1}
                    </span>
                    <div>
                      <h4 className={`font-serif font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>{cal.event}</h4>
                      <span className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{cal.date}</span>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase self-start sm:self-center ${
                    cal.type === 'GRADUATION' ? 'bg-amber-100 text-[#0C373D] border border-amber-300' :
                    cal.type === 'EXAM' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    cal.type === 'BREAK' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                    isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {cal.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
