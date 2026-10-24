import React, { useState } from 'react';
import { 
  ArrowLeft, MapPin, 
  ExternalLink, Phone, Mail, 
  Share2, Maximize2,
  Award, Building2, Layers, BookOpen, GraduationCap, 
  Coins, Check, Calendar, Search, 
  CheckCircle2, ChevronRight, ChevronLeft
} from 'lucide-react';
import { getCampusMedia } from '../data/campusMedia';
import { resolveInstitution } from '../utils/resolveInstitution';

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

  const institution = resolveInstitution(institutionId);
  const currentPhotos = getCampusMedia(institution.code);

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
  const getUniversityFaculties = (inst: any): FacultyDetail[] => {
    const code = (inst?.code || '').toUpperCase();
    const nameEn = inst?.nameEn || 'University';
    const city = inst?.city || 'Ethiopia';
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

    if (code === 'AAMC') {
      return [
        {
          id: 'aamc-som',
          name: 'School of Medicine & Clinical Sciences',
          campus: 'Tikur Anbessa Hospital Clinical Pavilion',
          dean: 'Prof. Andualem Deneke (MD, Associate Prof. of Surgery)',
          established: 1964,
          studentCount: 2200,
          facultyCount: 260,
          description: 'Ethiopia premier clinical medicine training center, fully embedded in the 800-bed Tikur Anbessa Specialized Hospital with comprehensive residency programs.',
          departments: [
            { name: 'Department of Surgery', head: 'Dr. Yonas Bahru', degrees: ['MD (Doctor of Medicine)', 'Residency in Surgery', 'Subspecialty Fellowship'], enrolled: 650, specialization: 'Neurosurgery, Pediatric Surgery, Oncology Surgery' },
            { name: 'Department of Internal Medicine', head: 'Dr. Daniel Asrat', degrees: ['MD (Doctor of Medicine)', 'Residency in Internal Medicine'], enrolled: 600, specialization: 'Cardiology, Pulmonology, Nephrology' },
            { name: 'Department of Pediatrics & Child Health', head: 'Dr. Aster Berhe', degrees: ['MD (Doctor of Medicine)', 'Residency in Pediatrics'], enrolled: 450, specialization: 'Neonatal Care, Pediatric Oncology' },
            { name: 'Department of Oncology & Radiotherapy', head: 'Dr. Workineh Shibeshi', degrees: ['Clinical Oncology Residency', 'Medical Physics M.Sc.'], enrolled: 250, specialization: 'Radiation Therapy, Medical Oncology' },
            { name: 'Department of Obstetrics & Gynecology', head: 'Dr. Emebet Kebede', degrees: ['MD (Doctor of Medicine)', 'Residency in Ob-Gyn'], enrolled: 250, specialization: 'Maternal-Fetal Medicine, Gynecologic Oncology' }
          ]
        },
        {
          id: 'aamc-pharm',
          name: 'School of Pharmacy',
          campus: 'Tikur Anbessa Health Sciences Quad',
          dean: 'Dr. Workineh Shibeshi (PhD in Pharmacology)',
          established: 1961,
          studentCount: 750,
          facultyCount: 70,
          description: 'Pioneer pharmaceutical education center in Ethiopia offering clinical pharmacy, pharmaceutical chemistry, and advanced drug development.',
          departments: [
            { name: 'Department of Pharmacology & Clinical Pharmacy', head: 'Dr. Tefera Abula', degrees: ['B.Pharm', 'Pharm.D', 'M.Sc. Pharmacology'], enrolled: 420, specialization: 'Clinical Toxicology, Rational Drug Use' },
            { name: 'Department of Pharmaceutical Chemistry', head: 'Dr. Ariaya Hymete', degrees: ['B.Pharm', 'M.Sc. Quality Assurance'], enrolled: 330, specialization: 'Drug Formulation, Pharmacognosy' }
          ]
        },
        {
          id: 'aamc-public-health',
          name: 'School of Public Health',
          campus: 'Tikur Anbessa / Senga Tera Campus',
          dean: 'Dr. Adamu Addissie (MD, MPH, PhD)',
          established: 1965,
          studentCount: 850,
          facultyCount: 65,
          description: 'Center of excellence in public health research, disease surveillance, healthcare economics, and epidemiology in the Horn of Africa.',
          departments: [
            { name: 'Epidemiology & Biostatistics', head: 'Dr. Wakgari Deressa', degrees: ['MPH', 'Ph.D. in Public Health'], enrolled: 480, specialization: 'Infectious Disease Tracking, Bio-Statistics' },
            { name: 'Health Systems & Reproductive Health', head: 'Dr. Seblewengel Lemma', degrees: ['B.Sc. Public Health', 'MPH'], enrolled: 370, specialization: 'Community Health Programs, Health Policy' }
          ]
        },
        {
          id: 'aamc-allied',
          name: 'School of Allied Health Sciences & Nursing',
          campus: 'Tikur Anbessa Clinical Complex',
          dean: 'Dr. Daniel Asrat (MD, PhD in Microbiology)',
          established: 1970,
          studentCount: 950,
          facultyCount: 85,
          description: 'Dedicated to diagnostic medical technology, pathology, emergency nursing, and clinical rehabilitation.',
          departments: [
            { name: 'Medical Laboratory Sciences', head: 'Dr. Aster Tsegaye', degrees: ['B.Sc. Medical Laboratory', 'M.Sc. Clinical Microbiology'], enrolled: 380, specialization: 'Molecular Diagnostics, Hematology' },
            { name: 'Nursing & Midwifery', head: 'Sr. Tigist Lemma', degrees: ['B.Sc. Nursing', 'B.Sc. Midwifery', 'M.Sc. Emergency Care'], enrolled: 390, specialization: 'Critical Care, Neonatal Resuscitation' },
            { name: 'Radiologic Technology & Physiotherapy', head: 'Dr. Solomon Worku', degrees: ['B.Sc. Radiologic Tech', 'B.Sc. Physiotherapy'], enrolled: 180, specialization: 'MRI/CT Imaging, Neuro-Rehab' }
          ]
        }
      ];
    }

    if (code === 'WKU') {
      return [
        {
          id: 'wku-eng',
          name: 'Gubre Institute of Technology (GubIoT)',
          campus: 'Gubre Engineering Campus (Wolkite)',
          dean: 'Dr. Jemal Abdu (PhD in Mechatronics Engineering)',
          established: 2012,
          studentCount: 4200,
          facultyCount: 220,
          description: 'Modern engineering institute driving regional infrastructure, agricultural mechanization, smart grid power systems, and software engineering.',
          departments: [
            { name: 'Electrical & Computer Engineering', head: 'Dr. Temesgen Bekele', degrees: ['B.Sc. Electrical Engineering', 'M.Sc. Power Systems'], enrolled: 1200, specialization: 'Renewable Microgrids, Embedded Hardware' },
            { name: 'Civil & Water Resources Engineering', head: 'Dr. Henok Haile', degrees: ['B.Sc. Civil Engineering', 'B.Sc. Hydraulic Engineering'], enrolled: 1100, specialization: 'Structural Design, Gurage Zone Water Infrastructure' },
            { name: 'Mechanical & Automotive Engineering', head: 'Dr. Tsegaye Ayele', degrees: ['B.Sc. Mechanical Engineering', 'B.Sc. Electromechanical'], enrolled: 1000, specialization: 'Agro-Machinery Fabrication, Automotive Systems' },
            { name: 'Chemical Engineering', head: 'Dr. Genet Molla', degrees: ['B.Sc. Chemical Engineering'], enrolled: 900, specialization: 'Process Engineering, Bio-Fuels' }
          ]
        },
        {
          id: 'wku-comp',
          name: 'College of Computing & Informatics',
          campus: 'Main Academic Campus, Wolkite',
          dean: 'Dr. Temesgen Walelign (PhD in Computer Science)',
          established: 2013,
          studentCount: 2100,
          facultyCount: 110,
          description: 'Accelerating software systems development, machine intelligence, cyber defense, and network infrastructure.',
          departments: [
            { name: 'Software Engineering', head: 'Dr. Fikadu Tadesse', degrees: ['B.Sc. Software Engineering', 'M.Sc.'], enrolled: 950, specialization: 'Full-Stack Architecture, Enterprise Mobile Solutions' },
            { name: 'Computer Science & Information Technology', head: 'Ato Getachew Belay', degrees: ['B.Sc. Computer Science', 'B.Sc. IT'], enrolled: 1150, specialization: 'AI, Distributed Data Systems, Cloud Platforms' }
          ]
        },
        {
          id: 'wku-health',
          name: 'College of Medicine & Health Sciences',
          campus: 'Wolkite University Referral Hospital Campus',
          dean: 'Dr. Habtamu Girma (MD, MPH)',
          established: 2014,
          studentCount: 2300,
          facultyCount: 140,
          description: 'Regional healthcare complex operating the Wolkite Referral Hospital, training medical doctors, public health officers, and clinical midwives.',
          departments: [
            { name: 'School of Public Health', head: 'Dr. Almaz Kebede', degrees: ['B.Sc. Public Health Officer', 'MPH'], enrolled: 800, specialization: 'Maternal & Child Epidemiology, Community Health' },
            { name: 'Department of Nursing & Midwifery', head: 'Sr. Rahel Desta', degrees: ['B.Sc. Comprehensive Nursing', 'B.Sc. Midwifery'], enrolled: 750, specialization: 'Emergency Triage, Surgical Nursing' },
            { name: 'Department of Medicine & Pharmacy', head: 'Dr. Yared Assefa', degrees: ['MD (Doctor of Medicine)', 'B.Pharm'], enrolled: 750, specialization: 'Primary Clinical Care, Pharmacotherapy' }
          ]
        },
        {
          id: 'wku-agri',
          name: 'College of Agricultural & Natural Resource Sciences',
          campus: 'Main Campus Agro-Science Complex',
          dean: 'Dr. Bekele Tulu (PhD in Agronomy)',
          established: 2012,
          studentCount: 1800,
          facultyCount: 95,
          description: 'Specializing in enset (false banana) biotechnology, dairy sciences, soil conservation, and modern horticulture value chains.',
          departments: [
            { name: 'Plant Sciences & Enset Biotechnology', head: 'Dr. Mulugeta Zewde', degrees: ['B.Sc. Plant Science', 'M.Sc. Agronomy'], enrolled: 700, specialization: 'Crop Protection, Sustainable Agroforestry' },
            { name: 'Animal Science & Agribusiness', head: 'Ato Birhanu Lemma', degrees: ['B.Sc. Animal Science', 'B.Sc. Agribusiness'], enrolled: 1100, specialization: 'Livestock Nutrition, Agricultural Marketing' }
          ]
        }
      ];
    }

    if (code === 'MU') {
      return [
        {
          id: 'mu-mit',
          name: 'Mekelle Institute of Technology (MIT)',
          campus: 'MIT Engineering Campus, Aynalem (Mekelle)',
          dean: 'Dr. Berihu Teklehaimanot (PhD in Telecommunications)',
          established: 2002,
          studentCount: 3800,
          facultyCount: 240,
          description: 'Pioneering technology and engineering institute renowned across Ethiopia for rigorous hands-on engineering, software development, electronics, and applied sciences.',
          departments: [
            { name: 'Department of Software Engineering & Computing', head: 'Dr. Haftu Tasew', degrees: ['B.Sc. Software Engineering', 'M.Sc. Computer Science', 'Ph.D.'], enrolled: 1100, specialization: 'Distributed Systems, Embedded Systems, AI' },
            { name: 'Department of Electrical & Electronics Engineering', head: 'Dr. Mebrahtu Gebre', degrees: ['B.Sc. Electrical Engineering', 'M.Sc. Power & Control'], enrolled: 1050, specialization: 'Wireless Communications, Microelectronics, Renewable Energy' },
            { name: 'Department of Mechanical & Industrial Engineering', head: 'Dr. Gebremariam Tesfay', degrees: ['B.Sc. Mechanical Engineering', 'B.Sc. Industrial Engineering'], enrolled: 850, specialization: 'Automotive Design, Advanced Manufacturing' },
            { name: 'Department of Civil & Structural Engineering', head: 'Dr. Araya Woldu', degrees: ['B.Sc. Civil Engineering', 'M.Sc. Geotechnical'], enrolled: 800, specialization: 'Bridge & Dam Infrastructure, Structural Dynamics' }
          ]
        },
        {
          id: 'mu-chs',
          name: 'College of Health Sciences (Ayder Comprehensive Hospital)',
          campus: 'Ayder Specialized Hospital Campus, Mekelle',
          dean: 'Dr. Amanuel Haile (MD, Consultant Pediatrician)',
          established: 2003,
          studentCount: 3400,
          facultyCount: 310,
          description: 'Major regional healthcare referral complex operating the 500+ bed Ayder Comprehensive Specialized Hospital serving northern Ethiopia.',
          departments: [
            { name: 'School of Medicine (MD)', head: 'Dr. Kibrom Gebreselassie', degrees: ['MD (Doctor of Medicine)', 'Residency in Surgery', 'Internal Medicine Specialization'], enrolled: 1300, specialization: 'Neurosurgery, Emergency Medicine, Trauma Care' },
            { name: 'School of Public Health', head: 'Dr. Afework Mulugeta', degrees: ['B.Sc. Public Health', 'MPH', 'Ph.D. in Nutrition'], enrolled: 750, specialization: 'Community Health Epidemiology, Maternal Nutrition' },
            { name: 'School of Pharmacy', head: 'Dr. Hagos Abrha', degrees: ['B.Pharm', 'Pharm.D'], enrolled: 650, specialization: 'Clinical Pharmacy, Pharmacognosy' },
            { name: 'School of Nursing & Midwifery', head: 'Sr. Letebirhan Gebre', degrees: ['B.Sc. Nursing', 'B.Sc. Midwifery'], enrolled: 700, specialization: 'Neonatal Critical Care, Surgical Nursing' }
          ]
        },
        {
          id: 'mu-agri',
          name: 'College of Dryland Agriculture & Natural Resources',
          campus: 'Main Campus Agro-Complex, Mekelle',
          dean: 'Dr. Eyasu Yazew (PhD in Land Resources)',
          established: 1993,
          studentCount: 2200,
          facultyCount: 160,
          description: 'Nationally acclaimed center of excellence in dryland farming, watershed harvesting, soil conservation, and drought-resilient crops.',
          departments: [
            { name: 'Land Resource Management & Environmental Protection', head: 'Dr. Girmay Gebresamuel', degrees: ['B.Sc. Land Resources', 'M.Sc. Soil Science'], enrolled: 800, specialization: 'Watershed Management, GIS & Remote Sensing' },
            { name: 'Dryland Crop & Horticultural Sciences', head: 'Dr. Fetien Abay', degrees: ['B.Sc. Plant Science', 'M.Sc. Plant Breeding'], enrolled: 750, specialization: 'Barley Genetics, Drought Resistance' },
            { name: 'Animal, Rangeland & Wildlife Sciences', head: 'Dr. Yayneshet Tesfay', degrees: ['B.Sc. Animal Science', 'M.Sc. Livestock Nutrition'], enrolled: 650, specialization: 'Ruminant Nutrition, Apiculture' }
          ]
        },
        {
          id: 'mu-cbe',
          name: 'College of Business and Economics (CBE)',
          campus: 'Adi Haki Campus, Mekelle',
          dean: 'Dr. Gebrehiwot Weldegebriel (PhD in Economics)',
          established: 1993,
          studentCount: 3100,
          facultyCount: 180,
          description: 'Key institution for business, development economics, management, and financial administration in Tigray.',
          departments: [
            { name: 'Department of Accounting & Finance', head: 'Ato Berhane Teklay', degrees: ['B.A. Accounting & Finance', 'M.Sc.'], enrolled: 1250, specialization: 'Auditing, Corporate Finance' },
            { name: 'Department of Economics', head: 'Dr. Halefom Nigus', degrees: ['B.A. Economics', 'M.Sc. Development Economics'], enrolled: 950, specialization: 'Econometrics, Resource Economics' },
            { name: 'Department of Management', head: 'Dr. Atsbeha Gebre', degrees: ['B.A. Management', 'MBA'], enrolled: 900, specialization: 'Operations & Enterprise Leadership' }
          ]
        },
        {
          id: 'mu-law',
          name: 'College of Law and Governance',
          campus: 'Main Campus, Mekelle',
          dean: 'Ato Alula Gidey (LL.M.)',
          established: 1995,
          studentCount: 1200,
          facultyCount: 75,
          description: 'Nationally recognized law faculty providing clinical legal education, human rights defense, and judicial training.',
          departments: [
            { name: 'School of Law (LL.B.)', head: 'Ato Solomon Berhane', degrees: ['LL.B. in Law', 'LL.M. in International Law'], enrolled: 850, specialization: 'Constitutional Law, Customary Legal Systems' },
            { name: 'Department of Political Science & Public Policy', head: 'Dr. Mehari Taddele', degrees: ['B.A. Political Science', 'M.A. Governance'], enrolled: 350, specialization: 'Regional Geopolitics, Public Governance' }
          ]
        }
      ];
    }

    if (code === 'UOG') {
      return [
        {
          id: 'uog-cmhs',
          name: 'College of Medicine and Health Sciences (Hospital Est. 1954)',
          campus: 'Gondar Comprehensive Hospital Campus',
          dean: 'Dr. Assefa Mulugeta (MD, Associate Prof. of Public Health)',
          established: 1954,
          studentCount: 4100,
          facultyCount: 360,
          description: 'The historic Public Health College and Training Centre founded in 1954, Ethiopia pioneer health training institution integrated with the 1,000-bed Gondar Comprehensive Hospital.',
          departments: [
            { name: 'School of Medicine (MD)', head: 'Dr. Getachew Arage', degrees: ['MD (Doctor of Medicine)', 'Residency in Surgery', 'Pediatrics Specialization'], enrolled: 1500, specialization: 'Tropical Medicine, Infectious Diseases, Surgery' },
            { name: 'Institute of Public Health', head: 'Dr. Mezgebu Yitayal', degrees: ['B.Sc. Public Health', 'MPH', 'Ph.D.'], enrolled: 950, specialization: 'Epidemiology, Health Informatics, Community Health' },
            { name: 'School of Pharmacy', head: 'Dr. Birhanu Demeke', degrees: ['B.Pharm', 'M.Sc. Clinical Pharmacy'], enrolled: 750, specialization: 'Pharmacotherapy, Drug Discovery' },
            { name: 'School of Midwifery & Nursing', head: 'Sr. Tigist Kassa', degrees: ['B.Sc. Midwifery', 'B.Sc. Nursing', 'M.Sc.'], enrolled: 900, specialization: 'Neonatal Care, Obstetric Emergencies' }
          ]
        },
        {
          id: 'uog-iot',
          name: 'Institute of Technology (IoT - Gondar)',
          campus: 'Maraki Campus, Gondar',
          dean: 'Dr. Asrat Mekonnen (PhD in Computer Engineering)',
          established: 2004,
          studentCount: 3600,
          facultyCount: 220,
          description: 'Dynamic engineering institute driving software development, civil infrastructure, and electrical hardware engineering in the historic city of Gondar.',
          departments: [
            { name: 'Department of Software Engineering', head: 'Dr. Molla Tadesse', degrees: ['B.Sc. Software Engineering', 'M.Sc. Data Engineering'], enrolled: 1100, specialization: 'Enterprise Software, Mobile & Cloud Systems' },
            { name: 'Department of Civil Engineering', head: 'Dr. Solomon Melese', degrees: ['B.Sc. Civil Engineering', 'M.Sc. Structural'], enrolled: 1000, specialization: 'Heritage Site Geotechnics, Transportation' },
            { name: 'Department of Electrical & Computer Engineering', head: 'Dr. Endalkachew Gashaw', degrees: ['B.Sc. Electrical Engineering', 'M.Sc. Power Systems'], enrolled: 950, specialization: 'Control Systems, Renewable Energy' },
            { name: 'Department of Mechanical Engineering', head: 'Dr. Yohannes Tefera', degrees: ['B.Sc. Mechanical Engineering'], enrolled: 550, specialization: 'Thermal Systems, Manufacturing' }
          ]
        },
        {
          id: 'uog-vet',
          name: 'Faculty of Veterinary Medicine (FVM)',
          campus: 'Teda Campus, Gondar',
          dean: 'Dr. Fentahun Tsegaye (DVM, M.Sc.)',
          established: 1995,
          studentCount: 1100,
          facultyCount: 85,
          description: 'Renowned veterinary faculty providing comprehensive clinical veterinary medicine, zoological disease control, and livestock epidemiology.',
          departments: [
            { name: 'Veterinary Clinical Medicine (DVM)', head: 'Dr. Belayneh Getachew', degrees: ['DVM (Doctor of Veterinary Medicine)', 'M.Sc. Surgery'], enrolled: 700, specialization: 'Bovine Surgery, Equine Health' },
            { name: 'Veterinary Public Health & Microbiology', head: 'Dr. Alula Alemayehu', degrees: ['B.Sc. Veterinary Lab Tech', 'M.Sc. Zoonoses'], enrolled: 400, specialization: 'Zoonotic Disease Surveillance, Vaccine Testing' }
          ]
        },
        {
          id: 'uog-cbe',
          name: 'College of Business and Economics',
          campus: 'Maraki Campus, Gondar',
          dean: 'Dr. Yared Worku (PhD in Finance)',
          established: 2002,
          studentCount: 2900,
          facultyCount: 170,
          description: 'Center for tourism economics, commercial accounting, business analytics, and regional financial planning.',
          departments: [
            { name: 'Department of Accounting & Finance', head: 'Ato Abebaw Kassie', degrees: ['B.A. Accounting & Finance', 'M.Sc.'], enrolled: 1200, specialization: 'IFRS, Tax Administration' },
            { name: 'Department of Tourism & Hotel Management', head: 'Dr. Daniel Getahun', degrees: ['B.A. Tourism Management', 'M.A.'], enrolled: 700, specialization: 'UNESCO Heritage Tourism, Hospitality' },
            { name: 'Department of Economics & Management', head: 'Dr. Mesfin Ayele', degrees: ['B.A. Economics', 'B.A. Management', 'MBA'], enrolled: 1000, specialization: 'Macroeconomic Analysis, Operations' }
          ]
        }
      ];
    }

    if (code === 'JU') {
      return [
        {
          id: 'ju-jit',
          name: 'Jimma Institute of Technology (JiT)',
          campus: 'Kito Furdisa Campus, Jimma',
          dean: 'Dr. Efrem Wakjira (PhD in Civil Engineering)',
          established: 1997,
          studentCount: 4900,
          facultyCount: 310,
          description: 'Leading polytechnic institute pioneering Community-Based Education (CBE) in engineering, biomedical innovation, and water systems.',
          departments: [
            { name: 'Department of Biomedical Engineering', head: 'Dr. Million Kebede', degrees: ['B.Sc. Biomedical Engineering', 'M.Sc.'], enrolled: 650, specialization: 'Medical Device Prototyping, Clinical Instrumentation' },
            { name: 'Department of Electrical & Computer Engineering', head: 'Dr. Tadesse Hailu', degrees: ['B.Sc. Electrical Engineering', 'M.Sc.'], enrolled: 1300, specialization: 'Industrial Automation, Smart Grid Power' },
            { name: 'Department of Civil & Environmental Engineering', head: 'Dr. Jemal Mohammed', degrees: ['B.Sc. Civil Engineering', 'M.Sc. Hydraulics'], enrolled: 1400, specialization: 'Hydropower, River Basin Management' },
            { name: 'Department of Mechanical & Industrial Engineering', head: 'Dr. Bekele Desta', degrees: ['B.Sc. Mechanical Engineering'], enrolled: 950, specialization: 'Coffee Processing Machinery, Agro-Mechanization' },
            { name: 'Department of Computing & Software', head: 'Dr. Worku Geda', degrees: ['B.Sc. Software Engineering', 'B.Sc. Computer Science'], enrolled: 600, specialization: 'Health Informatics, Mobile Apps' }
          ]
        },
        {
          id: 'ju-fms',
          name: 'Faculty of Medical Sciences (JUSH Hospital)',
          campus: 'Main Hospital Campus, Jimma',
          dean: 'Dr. Negash Tesfaye (MD, Associate Prof. of Surgery)',
          established: 1983,
          studentCount: 3800,
          facultyCount: 320,
          description: 'Center of excellence in clinical medicine and public health, integrated with the 800-bed Jimma University Specialized Hospital (JUSH).',
          departments: [
            { name: 'School of Medicine (MD)', head: 'Dr. Tsegaye Berhanu', degrees: ['MD (Doctor of Medicine)', 'Residency in Surgery', 'Internal Medicine'], enrolled: 1550, specialization: 'Cardiovascular Surgery, Tropical Pediatrics' },
            { name: 'School of Public Health', head: 'Dr. Mirkuzie Woldie', degrees: ['B.Sc. Public Health', 'MPH', 'Ph.D.'], enrolled: 850, specialization: 'Community-Based Health Care, Health Policy' },
            { name: 'School of Pharmacy', head: 'Dr. Tefera Gizaw', degrees: ['B.Pharm', 'Pharm.D'], enrolled: 700, specialization: 'Clinical Pharmacology, Herbal Medicines' },
            { name: 'School of Dentistry & Medical Laboratory', head: 'Dr. Sisay Lemma', degrees: ['B.Sc. Dentistry (DMD)', 'B.Sc. Medical Lab'], enrolled: 700, specialization: 'Oral Surgery, Hematology Diagnostics' }
          ]
        },
        {
          id: 'ju-jucavm',
          name: 'College of Agriculture & Veterinary Medicine (JUCAVM)',
          campus: 'Eladale Campus, Jimma',
          dean: 'Prof. Ali Mohammed (PhD in Postharvest Physiology)',
          established: 1952,
          studentCount: 2400,
          facultyCount: 190,
          description: 'Ethiopia premier coffee and agronomy institute, founded in 1952 as Jimma Agricultural Technical School.',
          departments: [
            { name: 'Department of Horticulture & Coffee Science', head: 'Dr. Weyessa Garedew', degrees: ['B.Sc. Plant Science', 'M.Sc. Coffee Processing', 'Ph.D.'], enrolled: 950, specialization: 'Arabica Coffee Genetics, Specialty Postharvest' },
            { name: 'School of Veterinary Medicine (DVM)', head: 'Dr. Tadele Tolosa', degrees: ['DVM', 'M.Sc. Veterinary Public Health'], enrolled: 800, specialization: 'Zoonoses, Tropical Animal Health' },
            { name: 'Department of Animal Science & Agribusiness', head: 'Dr. Ketema Bekele', degrees: ['B.Sc. Animal Science', 'B.Sc. Agribusiness'], enrolled: 650, specialization: 'Dairy Science, Value Chains' }
          ]
        }
      ];
    }

    if (code === 'BDU') {
      return [
        {
          id: 'bdu-bit',
          name: 'Bahir Dar Institute of Technology (BiT)',
          campus: 'BiT Polytechnic Campus, Lake Tana Waterfront',
          dean: 'Dr. Bimrew Tamrat (PhD in Sustainable Energy)',
          established: 1953,
          studentCount: 5200,
          facultyCount: 340,
          description: 'Originally established in 1953 as the Poly-Technic Institute with Soviet cooperation, BiT is one of Ethiopia foremost engineering hubs.',
          departments: [
            { name: 'Faculty of Electrical & Computer Engineering', head: 'Dr. Tesfaye Negash', degrees: ['B.Sc. Electrical Engineering', 'M.Sc. Power'], enrolled: 1400, specialization: 'Hydroelectric Integration, Control Automation' },
            { name: 'Faculty of Computing & Software Engineering', head: 'Dr. Getnet Mequanint', degrees: ['B.Sc. Software Engineering', 'B.Sc. Computer Science', 'M.Sc.'], enrolled: 1250, specialization: 'Cloud Architectures, Machine Learning' },
            { name: 'Faculty of Civil & Water Resources Engineering', head: 'Dr. Megersa Olumana', degrees: ['B.Sc. Civil Engineering', 'B.Sc. Hydraulic Engineering'], enrolled: 1350, specialization: 'Lake Tana Hydrology, Dam Safety, Geotechnics' },
            { name: 'Faculty of Mechanical & Industrial Engineering', head: 'Dr. Zenamarkos Biresaw', degrees: ['B.Sc. Mechanical Engineering'], enrolled: 1200, specialization: 'Turbine Fabrication, Thermal Power' }
          ]
        },
        {
          id: 'bdu-cmhs',
          name: 'College of Medicine & Health Sciences (Tibebe Ghion)',
          campus: 'Tibebe Ghion Specialized Hospital Campus, Bahir Dar',
          dean: 'Dr. Firew Tegegne (MD, MPH)',
          established: 2007,
          studentCount: 3100,
          facultyCount: 260,
          description: 'Premier health institute operating the state-of-the-art 600-bed Tibebe Ghion Specialized Teaching Hospital.',
          departments: [
            { name: 'School of Medicine (MD)', head: 'Dr. Mulat Yimer', degrees: ['MD (Doctor of Medicine)', 'Residency in Surgery', 'Pediatrics'], enrolled: 1200, specialization: 'General Surgery, Internal Medicine, Ob-Gyn' },
            { name: 'School of Public Health', head: 'Dr. Destaw Fetene', degrees: ['B.Sc. Public Health', 'MPH'], enrolled: 700, specialization: 'Infectious Disease Control, Environmental Health' },
            { name: 'School of Pharmacy & Nursing', head: 'Sr. Mulugeta Baye', degrees: ['B.Pharm', 'B.Sc. Nursing', 'B.Sc. Midwifery'], enrolled: 1200, specialization: 'Clinical Pharmacology, Critical Care' }
          ]
        },
        {
          id: 'bdu-eitex',
          name: 'Ethiopian Institute of Textile and Fashion Technology (EiTEX)',
          campus: 'EiTEX Textile Campus, Bahir Dar',
          dean: 'Dr. Abera Kechi (PhD in Textile Engineering)',
          established: 1963,
          studentCount: 1800,
          facultyCount: 110,
          description: 'Ethiopia unique national center of excellence for textile manufacturing, garment engineering, leather technology, and fashion design.',
          departments: [
            { name: 'Department of Textile Engineering', head: 'Dr. Tamrat Tesfaye', degrees: ['B.Sc. Textile Engineering', 'M.Sc.'], enrolled: 750, specialization: 'Yarn Spinning, Weaving Technology, Nanofibers' },
            { name: 'Department of Garment Engineering & Fashion', head: 'Ato Birhanu Asfaw', degrees: ['B.Sc. Garment Engineering', 'B.A. Fashion Design'], enrolled: 650, specialization: 'Apparel Industrial Engineering, CAD Pattern Making' },
            { name: 'Department of Leather Engineering & Chemical Processing', head: 'Dr. Solomon Tilahun', degrees: ['B.Sc. Leather Technology'], enrolled: 400, specialization: 'Eco-Tanning, Textile Dyeing & Finishing' }
          ]
        }
      ];
    }

    if (code === 'HU') {
      return [
        {
          id: 'hu-iot',
          name: 'Hawassa Institute of Technology (HU-IoT)',
          campus: 'Main Engineering Campus, Hawassa',
          dean: 'Dr. Fasika Bete (PhD in Computer Science)',
          established: 2006,
          studentCount: 4200,
          facultyCount: 260,
          description: 'Modern engineering polytechnic powering software engineering, smart textile integration, power systems, and civil infrastructure.',
          departments: [
            { name: 'School of Electrical & Computer Engineering', head: 'Dr. Girma Bekele', degrees: ['B.Sc. Electrical Engineering', 'M.Sc. Control'], enrolled: 1250, specialization: 'Industrial Automation, Communications' },
            { name: 'School of Software & Computing Sciences', head: 'Dr. Solomon Negatu', degrees: ['B.Sc. Software Engineering', 'B.Sc. IT'], enrolled: 1150, specialization: 'Smart City Platforms, Full-Stack Architecture' },
            { name: 'School of Civil & Urban Engineering', head: 'Dr. Tefera Belachew', degrees: ['B.Sc. Civil Engineering', 'B.Sc. Architecture'], enrolled: 1100, specialization: 'Rift Valley Soils, Urban Planning' },
            { name: 'School of Mechanical Engineering', head: 'Dr. Ashenafi Kebede', degrees: ['B.Sc. Mechanical Engineering'], enrolled: 700, specialization: 'Agro-Processing, Heating & Ventilation' }
          ]
        },
        {
          id: 'hu-cmhs',
          name: 'College of Medicine & Health Sciences (HUCSH)',
          campus: 'HUCSH Referral Hospital Campus, Hawassa',
          dean: 'Dr. Anteneh Gadisa (MD, Associate Prof. of Surgery)',
          established: 2003,
          studentCount: 3500,
          facultyCount: 290,
          description: 'Flagship medical complex in southern Ethiopia running the Hawassa University Comprehensive Specialized Hospital with 650 inpatient beds.',
          departments: [
            { name: 'School of Medicine (MD)', head: 'Dr. Teshome Berhanu', degrees: ['MD (Doctor of Medicine)', 'Residency Programs'], enrolled: 1400, specialization: 'Internal Medicine, Pediatric Surgery, Oncology' },
            { name: 'School of Public Health', head: 'Dr. Birkneh Tilahun', degrees: ['B.Sc. Public Health', 'MPH'], enrolled: 800, specialization: 'Maternal-Child Health, Epidemiology' },
            { name: 'School of Pharmacy & Medical Laboratory', head: 'Dr. Daniel Getachew', degrees: ['B.Pharm', 'B.Sc. Med Lab'], enrolled: 800, specialization: 'Clinical Toxicology, Microbiology' },
            { name: 'School of Nursing & Midwifery', head: 'Sr. Rahel Bekele', degrees: ['B.Sc. Nursing', 'B.Sc. Midwifery'], enrolled: 500, specialization: 'Emergency Triage, Neonatal Care' }
          ]
        },
        {
          id: 'hu-wondo',
          name: 'Wondo Genet College of Forestry & Natural Resources',
          campus: 'Wondo Genet Arboretum Campus, Sidama',
          dean: 'Dr. Motuma Tolera (PhD in Agroforestry)',
          established: 1978,
          studentCount: 1600,
          facultyCount: 95,
          description: 'Ethiopia foremost institution for forestry conservation, agroforestry, wildlife ecology, and natural resource management.',
          departments: [
            { name: 'Department of General Forestry', head: 'Dr. Tesfaye Bekele', degrees: ['B.Sc. Forestry', 'M.Sc. Silviculture'], enrolled: 600, specialization: 'Indigenous Tree Conservation, Carbon Sequestration' },
            { name: 'Department of Wildlife & Ecotourism', head: 'Dr. Girma Mengesha', degrees: ['B.Sc. Wildlife Management', 'B.A. Ecotourism'], enrolled: 500, specialization: 'National Park Ecology, Protected Areas' },
            { name: 'Department of Agroforestry & Soil Conservation', head: 'Dr. Tefera Mengistu', degrees: ['B.Sc. Agroforestry', 'M.Sc.'], enrolled: 500, specialization: 'Catchment Restoration, Biodiversity' }
          ]
        }
      ];
    }

    if (code === 'ASTU') {
      return [
        {
          id: 'astu-ece',
          name: 'School of Electrical Engineering & Computing',
          campus: 'Main STEM Quadrant, Adama',
          dean: 'Dr. Kumsa Dereje (PhD in Computer Engineering)',
          established: 1993,
          studentCount: 3900,
          facultyCount: 240,
          description: 'Dedicated center of excellence for software engineering, artificial intelligence, communications, and electronic systems.',
          departments: [
            { name: 'Department of Software Engineering', head: 'Dr. Gemechu Boku', degrees: ['B.Sc. Software Engineering', 'M.Sc. AI', 'Ph.D.'], enrolled: 1300, specialization: 'Cybersecurity, Cloud Infrastructure, Ethiopian Speech AI' },
            { name: 'Department of Computer Science & Engineering', head: 'Dr. Dereje Shiferaw', degrees: ['B.Sc. Computer Science', 'M.Sc.'], enrolled: 1200, specialization: 'Algorithms, High Performance Computing' },
            { name: 'Department of Electrical Power & Control', head: 'Dr. Belayneh Tolassa', degrees: ['B.Sc. Electrical Engineering', 'M.Sc. Renewable Power'], enrolled: 1400, specialization: 'Grid Automation, EV Propulsion Systems' }
          ]
        },
        {
          id: 'astu-mech',
          name: 'School of Mechanical, Chemical & Materials Engineering',
          campus: 'Advanced Manufacturing Hub, Adama',
          dean: 'Dr. Tolera Gemechu (PhD in Materials Science)',
          established: 2006,
          studentCount: 3200,
          facultyCount: 200,
          description: 'Home of ASTU Centers of Excellence in Space Science, Robotics, Advanced Nanomaterials, and Automotive Fabrication.',
          departments: [
            { name: 'Department of Mechanical & Mechatronics Engineering', head: 'Dr. Yared Assefa', degrees: ['B.Sc. Mechanical Engineering', 'B.Sc. Mechatronics'], enrolled: 1400, specialization: 'Industrial Robotics, CNC Prototyping, Drone Design' },
            { name: 'Department of Materials Science & Metallurgy', head: 'Dr. Hirpa Geda', degrees: ['B.Sc. Materials Engineering', 'M.Sc.'], enrolled: 900, specialization: 'Semiconductors, Ceramic Nanocomposites' },
            { name: 'Department of Chemical & Bio-Process Engineering', head: 'Dr. Fanta Bedasa', degrees: ['B.Sc. Chemical Engineering'], enrolled: 900, specialization: 'Polymer Synthesis, Petrochemical Processes' }
          ]
        },
        {
          id: 'astu-civil',
          name: 'School of Civil Engineering & Architecture',
          campus: 'Infrastructure Testing Grounds, Adama',
          dean: 'Dr. Solomon Bekele (PhD in Structural Dynamics)',
          established: 2000,
          studentCount: 2500,
          facultyCount: 160,
          description: 'High-precision infrastructure research center focusing on geotechnical engineering, transportation corridors, and sustainable architecture.',
          departments: [
            { name: 'Department of Structural & Geotechnical Engineering', head: 'Dr. Mulugeta Regassa', degrees: ['B.Sc. Civil Engineering', 'M.Sc. Structural'], enrolled: 1400, specialization: 'Seismic Design, Express Highway Materials' },
            { name: 'Department of Architecture & Urban Design', head: 'Ato Dawit Birhanu', degrees: ['B.Sc. Architecture', 'M.Sc. Urban Planning'], enrolled: 1100, specialization: 'Sustainable High-Rises, Green City Logistics' }
          ]
        }
      ];
    }

    if (code === 'AASTU') {
      return [
        {
          id: 'aastu-elec-mech',
          name: 'College of Electrical & Mechanical Engineering',
          campus: 'Kilinto High-Tech Campus, Addis Ababa (Akaki)',
          dean: 'Dr. Terefe Feyisa (PhD in Mechatronics)',
          established: 2011,
          studentCount: 3600,
          facultyCount: 220,
          description: 'Center of excellence for industrial automation, robotics, power systems, software architecture, and automotive engineering.',
          departments: [
            { name: 'Department of Software Engineering', head: 'Dr. Fitsum Kebede', degrees: ['B.Sc. Software Engineering', 'M.Sc.'], enrolled: 1100, specialization: 'Distributed Ledger, Embedded Systems, AI' },
            { name: 'Department of Electromechanical Engineering', head: 'Dr. Getachew Birru', degrees: ['B.Sc. Electromechanical', 'B.Sc. Electrical Power'], enrolled: 1300, specialization: 'Robotics, High Voltage Transmission' },
            { name: 'Department of Mechanical Engineering', head: 'Dr. Tadesse Mengesha', degrees: ['B.Sc. Mechanical Engineering'], enrolled: 1200, specialization: 'Aerospace Components, Industrial Tooling' }
          ]
        },
        {
          id: 'aastu-nano-bio',
          name: 'College of Biological & Chemical Engineering (CoE Nanotechnology)',
          campus: 'Kilinto Nanotech Pavilion, Addis Ababa',
          dean: 'Dr. Aster Haile (PhD in Nanobiotechnology)',
          established: 2013,
          studentCount: 2200,
          facultyCount: 140,
          description: 'Houses Ethiopia advanced national Nanotechnology and Biotechnology Centers of Excellence.',
          departments: [
            { name: 'Department of Biotechnology & Food Engineering', head: 'Dr. Endale Tsegaye', degrees: ['B.Sc. Biotechnology', 'B.Sc. Food Process'], enrolled: 1100, specialization: 'Industrial Microbiology, Fermentation Science' },
            { name: 'Department of Chemical Engineering & Nanomaterials', head: 'Dr. Yonas Chebude', degrees: ['B.Sc. Chemical Engineering', 'M.Sc. Nanotech'], enrolled: 1100, specialization: 'Carbon Nanotubes, Water Filtration Membranes' }
          ]
        }
      ];
    }

    if (code === 'AMU') {
      return [
        {
          id: 'amu-awti',
          name: 'Arba Minch Water Technology Institute (AWTI)',
          campus: 'AWTI Waterfront Campus, Lake Abaya & Chamo',
          dean: 'Dr. Alemayehu Kasaye (PhD in Hydrology)',
          established: 1986,
          studentCount: 3800,
          facultyCount: 260,
          description: 'Ethiopia and East Africa premier national flagship institute for water resources engineering, hydraulic modeling, meteorology, and irrigation.',
          departments: [
            { name: 'Department of Hydraulic & Water Resources Engineering', head: 'Dr. Kinfe Kassa', degrees: ['B.Sc. Hydraulic Engineering', 'M.Sc. Hydrology', 'Ph.D.'], enrolled: 1400, specialization: 'Dam Break Modeling, River Engineering, Large Scale Irrigation' },
            { name: 'Department of Irrigation & Water Drainage Engineering', head: 'Dr. Yilma Seleshi', degrees: ['B.Sc. Irrigation Engineering', 'M.Sc.'], enrolled: 1200, specialization: 'Pressurized Drip Systems, Salinity Control' },
            { name: 'Department of Meteorology & Hydrological Science', head: 'Dr. Tsegaye Tadesse', degrees: ['B.Sc. Meteorology', 'M.Sc. Climate Modeling'], enrolled: 1200, specialization: 'Drought Forecasting, East African Monsoons' }
          ]
        },
        {
          id: 'amu-amit',
          name: 'Arba Minch Institute of Technology (AMiT)',
          campus: 'Main Science Campus, Arba Minch',
          dean: 'Dr. Behailu Merdekios (PhD in Electrical Systems)',
          established: 2004,
          studentCount: 3400,
          facultyCount: 210,
          description: 'Polytechnic engineering faculty delivering accredited computer science, electrical, software, and mechanical degrees.',
          departments: [
            { name: 'Department of Software Engineering & Computer Science', head: 'Dr. Dawit Bekele', degrees: ['B.Sc. Software Engineering', 'B.Sc. CS'], enrolled: 1200, specialization: 'Full-Stack Web, Embedded Telemetry' },
            { name: 'Department of Electrical & Computer Engineering', head: 'Dr. Ermias Geda', degrees: ['B.Sc. Electrical Engineering'], enrolled: 1100, specialization: 'Off-Grid Solar, Hydroelectric Generators' },
            { name: 'Department of Civil Engineering', head: 'Dr. Kassa Mengistu', degrees: ['B.Sc. Civil Engineering'], enrolled: 1100, specialization: 'Rift Valley Bridge Construction, Highways' }
          ]
        }
      ];
    }

    if (code === 'HRU') {
      return [
        {
          id: 'hru-agri',
          name: 'College of Agriculture & Environmental Sciences',
          campus: 'Historic Oklahoma State Quad, Haramaya',
          dean: 'Dr. Jemal Yousuf (PhD in Plant Pathology)',
          established: 1954,
          studentCount: 3900,
          facultyCount: 270,
          description: 'The historic mother of Ethiopian modern agricultural education, established in 1954 with Oklahoma State University collaboration.',
          departments: [
            { name: 'Department of Plant Sciences & Agronomy', head: 'Dr. Benti Gelalcha', degrees: ['B.Sc. Plant Science', 'M.Sc. Crop Genetics', 'Ph.D.'], enrolled: 1500, specialization: 'Sorghum & Maize Breeding, Rust Resistance' },
            { name: 'Department of Animal Sciences & Dairy Tech', head: 'Dr. Mengistu Urge', degrees: ['B.Sc. Animal Science', 'M.Sc. Dairy Science'], enrolled: 1300, specialization: 'Pastoral Rangelands, High-Yield Dairy Genetics' },
            { name: 'Department of Agricultural Economics & Agribusiness', head: 'Dr. Jema Haji', degrees: ['B.Sc. Agribusiness', 'M.Sc. Agricultural Econ'], enrolled: 1100, specialization: 'Rural Value Chains, Food Security Policy' }
          ]
        },
        {
          id: 'hru-cmhs',
          name: 'College of Health & Medical Sciences (Hiwot Fana Hospital)',
          campus: 'Hiwot Fana Specialized Hospital Campus, Harar',
          dean: 'Dr. Yadeta Dessie (PhD in Epidemiology)',
          established: 2007,
          studentCount: 3100,
          facultyCount: 240,
          description: 'Major clinical training complex located in historic Harar, managing the Hiwot Fana Comprehensive Specialized Hospital.',
          departments: [
            { name: 'School of Medicine (MD)', head: 'Dr. Ahmed Mohammed', degrees: ['MD (Doctor of Medicine)', 'Residency in Surgery'], enrolled: 1250, specialization: 'Emergency Trauma, Tropical Medicine, Pediatrics' },
            { name: 'School of Public Health', head: 'Dr. Berhanu Seyoum', degrees: ['B.Sc. Public Health', 'MPH'], enrolled: 850, specialization: 'Vector Borne Diseases, Community Sanitation' },
            { name: 'School of Pharmacy & Nursing', head: 'Sr. Fatuma Abdurahman', degrees: ['B.Pharm', 'B.Sc. Nursing'], enrolled: 1000, specialization: 'Clinical Pharmacy, Midwifery Care' }
          ]
        }
      ];
    }

    // Dynamic tailored schema for all other Ethiopian institutions (DU, WU, DMU, DBU, WSU, WCU, SMU, RVU, UNITY, AMBO, DDU)
    return [
      {
        id: `${code.toLowerCase()}-iot`,
        name: `${nameEn} Institute of Technology (${code}-IoT)`,
        campus: `${city} Engineering & Polytechnic Campus`,
        dean: `Dr. Girma Bekele (PhD in Engineering)`,
        established: inst?.establishedYear || 2000,
        studentCount: 3800,
        facultyCount: 210,
        description: `Flagship engineering institute delivering nationally accredited polytechnic degrees in software engineering, electrical systems, and civil infrastructure.`,
        departments: [
          { name: 'Electrical & Computer Engineering', head: 'Dr. Abebe Tadesse', degrees: ['B.Sc.', 'M.Sc.'], enrolled: 1150, specialization: 'Power Systems & Electronics' },
          { name: 'Software Engineering & Computing', head: 'Dr. Selamawit Haile', degrees: ['B.Sc.', 'M.Sc.'], enrolled: 1050, specialization: 'Full-Stack Software, Applied AI' },
          { name: 'Civil & Construction Engineering', head: 'Dr. Henok Desta', degrees: ['B.Sc.', 'M.Sc.'], enrolled: 950, specialization: 'Structural Engineering & Hydraulics' },
          { name: 'Mechanical Engineering', head: 'Dr. Tewodros Lemma', degrees: ['B.Sc.'], enrolled: 650, specialization: 'Thermodynamics & Manufacturing' }
        ]
      },
      {
        id: `${code.toLowerCase()}-health`,
        name: `${nameEn} College of Medicine & Health Sciences`,
        campus: `${city} Teaching Referral Hospital Campus`,
        dean: `Dr. Emebet Kebede (MD, MPH)`,
        established: (inst?.establishedYear || 2000) + 2,
        studentCount: 2800,
        facultyCount: 190,
        description: `Healthcare training facility managing community health, clinical medical clerkships, pharmacy, and nursing.`,
        departments: [
          { name: 'School of Medicine (MD)', head: 'Dr. Dereje Assefa', degrees: ['MD (Doctor of Medicine)'], enrolled: 1100, specialization: 'Internal Medicine, Surgery, Pediatrics' },
          { name: 'School of Public Health', head: 'Dr. Almaz Negash', degrees: ['B.Sc.', 'MPH'], enrolled: 700, specialization: 'Epidemiology, Community Health' },
          { name: 'School of Pharmacy', head: 'Dr. Kassahun Tefera', degrees: ['B.Pharm'], enrolled: 500, specialization: 'Clinical Pharmacology' },
          { name: 'School of Nursing & Midwifery', head: 'Sr. Tigist Lemma', degrees: ['B.Sc. Nursing', 'B.Sc. Midwifery'], enrolled: 500, specialization: 'Maternal Care, Emergency Triage' }
        ]
      },
      {
        id: `${code.toLowerCase()}-cbe`,
        name: `${nameEn} College of Business & Economics`,
        campus: `${city} Main Academic Campus`,
        dean: `Dr. Yared Lemma (PhD in Finance)`,
        established: (inst?.establishedYear || 2000) + 1,
        studentCount: 3100,
        facultyCount: 160,
        description: `Center for regional business administration, accounting compliance, economic modeling, and financial analytics.`,
        departments: [
          { name: 'Department of Accounting & Finance', head: 'Ato Birhanu Ayele', degrees: ['B.A.', 'M.Sc.'], enrolled: 1400, specialization: 'IFRS Accounting, Auditing' },
          { name: 'Department of Economics', head: 'Dr. Genet Haile', degrees: ['B.A.', 'M.Sc.'], enrolled: 900, specialization: 'Development Economics, Econometrics' },
          { name: 'Department of Management', head: 'Dr. Fikadu Belay', degrees: ['B.A.', 'MBA'], enrolled: 800, specialization: 'Strategic Leadership, Supply Chain' }
        ]
      },
      {
        id: `${code.toLowerCase()}-cncs`,
        name: `${nameEn} College of Natural & Computational Sciences`,
        campus: `${city} Science Quad`,
        dean: `Dr. Belayneh Mesfin (PhD in Physics)`,
        established: inst?.establishedYear || 2000,
        studentCount: 2200,
        facultyCount: 130,
        description: `Conducts foundational science education and experimental laboratory training across physics, chemistry, biology, and mathematics.`,
        departments: [
          { name: 'Department of Computer Science', head: 'Dr. Mulugeta Libsie', degrees: ['B.Sc. CS', 'M.Sc.'], enrolled: 800, specialization: 'Computer Networks, Data Analysis' },
          { name: 'Department of Biology & Biotechnology', head: 'Dr. Fassil Assefa', degrees: ['B.Sc. Biology'], enrolled: 650, specialization: 'Microbiology, Ecological Studies' },
          { name: 'Department of Chemistry & Physics', head: 'Dr. Negussie Megersa', degrees: ['B.Sc. Chemistry', 'B.Sc. Physics'], enrolled: 750, specialization: 'Analytical Chemistry, Solar Materials' }
        ]
      }
    ];
  };

  const facultiesData = getUniversityFaculties(institution);

  // Dynamic naming helpers for programs and facilities
  const getEngFacultyName = (code: string, nameEn: string): string => {
    switch (code.toUpperCase()) {
      case 'AAU': return 'Addis Ababa Institute of Technology (AAiT)';
      case 'ASTU': return 'School of Electrical Engineering & Computing (ASTU)';
      case 'AASTU': return 'College of Electrical & Mechanical Engineering (AASTU)';
      case 'BDU': return 'Bahir Dar Institute of Technology (BiT)';
      case 'JU': return 'Jimma Institute of Technology (JiT)';
      case 'HU': return 'Hawassa Institute of Technology (IoT)';
      case 'MU': return 'Mekelle Institute of Technology (MIT)';
      case 'UOG': return 'Gondar Institute of Technology (IoT)';
      case 'AMU': return 'Arba Minch Institute of Technology (AMiT)';
      case 'HRU': return 'Haramaya Institute of Technology (HiT)';
      case 'WKU': return 'Gubre Institute of Technology (GubIoT)';
      case 'WU': return 'Kombolcha Institute of Technology (KIOT)';
      default: return `${nameEn} Institute of Technology`;
    }
  };

  const getCivilFacultyName = (code: string, nameEn: string): string => {
    switch (code.toUpperCase()) {
      case 'AAU': return 'Addis Ababa Institute of Technology (AAiT)';
      case 'ASTU': return 'School of Civil Engineering & Architecture (ASTU)';
      case 'AASTU': return 'College of Architecture & Civil Engineering (AASTU)';
      case 'BDU': return 'Bahir Dar Institute of Technology (BiT)';
      case 'JU': return 'Jimma Institute of Technology (JiT)';
      case 'HU': return 'Hawassa Institute of Technology (IoT)';
      case 'MU': return 'Mekelle Institute of Technology (MIT)';
      case 'UOG': return 'Gondar Institute of Technology (IoT)';
      case 'AMU': return 'Arba Minch Water Technology Institute (AWTI)';
      case 'HRU': return 'Haramaya Institute of Technology (HiT)';
      case 'WKU': return 'Gubre Institute of Technology (GubIoT)';
      default: return `${nameEn} College of Engineering`;
    }
  };

  const getMedFacultyName = (code: string, nameEn: string): string => {
    switch (code.toUpperCase()) {
      case 'AAU': return 'College of Health Sciences (Tikur Anbessa CHS)';
      case 'AAMC': return 'School of Medicine & Clinical Sciences (Tikur Anbessa)';
      case 'BDU': return 'College of Medicine & Health Sciences (Tibebe Ghion)';
      case 'JU': return 'Faculty of Medical Sciences (Jimma Specialized Hospital)';
      case 'HU': return 'College of Medicine & Health Sciences (HUCSH)';
      case 'MU': return 'College of Health Sciences (Ayder Comprehensive Hospital)';
      case 'UOG': return 'College of Medicine & Health Sciences (Gondar Comprehensive)';
      case 'AMU': return 'College of Medicine & Health Sciences (Arba Minch Hospital)';
      case 'HRU': return 'College of Health & Medical Sciences (Hiwot Fana)';
      case 'WKU': return 'College of Medicine & Health Sciences (Wolkite Referral)';
      case 'WSU': return 'College of Health Sciences (Wolaita Sodo Hospital)';
      default: return `${nameEn} College of Health Sciences`;
    }
  };

  const getLabName = (code: string, nameEn: string): string => {
    switch (code.toUpperCase()) {
      case 'AAU': return 'AAiT Advanced Polytechnic, Robotics & AI Laboratories';
      case 'ASTU': return 'ASTU Space Science & Advanced Robotics Center';
      case 'AASTU': return 'AASTU Nanotechnology & Biotechnology CoE Laboratories';
      case 'BDU': return 'BiT Advanced Engineering & EiTEX Textile Testing Laboratories';
      case 'JU': return 'JiT Community-Based Innovation & Engineering Laboratories';
      case 'HU': return 'Hawassa IoT Software & Smart Irrigation Laboratories';
      case 'MU': return 'Mekelle Institute of Technology (MIT) AI & Advanced Hardware Labs';
      case 'UOG': return 'Gondar IoT & Specialized Medical Diagnostics Laboratories';
      case 'AMU': return 'AWTI Hydraulic Modeling Flumes & Water Research Labs';
      case 'HRU': return 'Haramaya Agricultural Biotechnology & Seed Science Labs';
      case 'WKU': return 'GubIoT Mechatronics & Agro-Machinery Fabrication Labs';
      default: return `${nameEn} Polytechnic, Robotics & Science Laboratories`;
    }
  };

  const getHospitalName = (code: string, city: string): string => {
    switch (code.toUpperCase()) {
      case 'AAU':
      case 'AAMC': return 'Tikur Anbessa (Black Lion) Specialized Teaching & Referral Hospital';
      case 'MU': return 'Ayder Comprehensive Specialized Referral Hospital';
      case 'UOG': return 'Gondar Comprehensive Specialized Teaching Hospital (Est. 1954)';
      case 'JU': return 'Jimma University Specialized Teaching Hospital (JUSH)';
      case 'BDU': return 'Tibebe Ghion Specialized Teaching Hospital';
      case 'HU': return 'Hawassa University Comprehensive Specialized Hospital (HUCSH)';
      case 'HRU': return 'Hiwot Fana Comprehensive Specialized Hospital (Harar)';
      case 'WKU': return 'Wolkite University Referral Hospital';
      case 'AMU': return 'Arba Minch General & Teaching Hospital';
      case 'WSU': return 'Wolaita Sodo University Comprehensive Specialized Hospital';
      default: return `${city} Teaching & Clinical Referral Hospital`;
    }
  };

  // 2. Comprehensive Program database
  const getAllUniversityPrograms = (): DetailedProgram[] => {
    return [
      {
        name: 'Doctor of Medicine (MD)',
        faculty: getMedFacultyName(institution.code, institution.nameEn),
        degreeLevel: 'DOCTORAL',
        stream: 'NATURAL',
        duration: '6.0 Years (12 Semesters)',
        credits: '360 ECTS',
        modes: ['Regular Full-Time Day'],
        intakeQuota: institution.code === 'AAMC' ? 250 : 180,
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
        faculty: getEngFacultyName(institution.code, institution.nameEn),
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
        faculty: getCivilFacultyName(institution.code, institution.nameEn),
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
        faculty: institution.code === 'AAU' ? 'College of Business and Economics (CBE)' : `${institution.nameEn} College of Business & Economics`,
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
        faculty: institution.code === 'AAU' ? 'College of Law and Governance Studies (CLGS)' : institution.code === 'MU' ? 'College of Law & Governance' : `${institution.nameEn} School of Law`,
        degreeLevel: 'BACHELOR',
        stream: 'SOCIAL',
        duration: '5.0 Years (10 Semesters)',
        credits: '300 ECTS',
        modes: ['Regular Day', 'Extension Evening'],
        intakeQuota: 150,
        careerPaths: ['Attorney at Law', 'Federal / Regional High Court Judge', 'Corporate Legal Counsel', 'Human Rights Diplomat'],
        curriculumHighlights: [
          { year: 'Year 1', modules: ['Introduction to Law & Legal Systems', 'Constitutional Law I & II', 'Law of Persons', 'Philosophy of Law'] },
          { year: 'Year 2', modules: ['Law of Contracts', 'Criminal Law I & II', 'Property Law', 'Family Law & Succession'] },
          { year: 'Year 3', modules: ['Commercial & Company Law', 'Administrative Law', 'Law of Evidence', 'Public International Law'] },
          { year: 'Year 4', modules: ['Civil Procedure & Litigation', 'Criminal Procedure', 'Tax Law & Ethiopian Customs', 'Environmental Law'] },
          { year: 'Year 5', modules: ['Clinical Legal Aid Practicum', 'Conflict of Laws (Private International)', 'Senior Legal Dissertation'] }
        ]
      },
      {
        name: 'B.Sc. in Electrical & Computer Engineering',
        faculty: getEngFacultyName(institution.code, institution.nameEn),
        degreeLevel: 'BACHELOR',
        stream: 'NATURAL',
        duration: '5.0 Years (10 Semesters)',
        credits: '300 ECTS',
        modes: ['Regular Full-Time Day'],
        intakeQuota: 200,
        careerPaths: ['Telecommunications Engineer', 'Power Systems Grid Engineer', 'Embedded Hardware Specialist', 'Control Systems Engineer'],
        curriculumHighlights: [
          { year: 'Year 1', modules: ['Engineering Physics', 'Calculus for Engineers', 'Linear Algebra', 'Computer Programming'] },
          { year: 'Year 2', modules: ['Electric Circuit Analysis I & II', 'Digital Logic Design', 'Electromagnetic Fields', 'Electronics I'] },
          { year: 'Year 3', modules: ['Signals & Systems', 'Microprocessor Systems & Interfacing', 'Electrical Machines', 'Electronics II'] },
          { year: 'Year 4', modules: ['Control Systems', 'Communication Systems', 'Power Systems Analysis', 'Industrial Internship'] },
          { year: 'Year 5', modules: ['Senior Engineering Capstone Project', 'Wireless Networks', 'Renewable Microgrids'] }
        ]
      },
      {
        name: 'Master of Business Administration (MBA)',
        faculty: institution.code === 'AAU' ? 'College of Business and Economics (CBE)' : `${institution.nameEn} College of Business & Economics`,
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
      id: `${institution.code.toLowerCase()}-lib`,
      name: institution.code === 'AAU' 
        ? 'John F. Kennedy Memorial Central Academic Library & Digital Knowledge Stacks' 
        : `${institution.nameEn} Central Academic Library & Digital Knowledge Stacks`,
      category: 'Library',
      location: `${institution.city} Main Campus, Academic Quadrant`,
      capacity: '4,500 Seated Capacity • 1.2M Physical & Digital Stacks',
      description: 'The primary reference library and digital repository, containing historical academic manuscripts, international journal subscriptions, and 24/7 quiet study hubs.',
      features: [
        'Over 1,200,000 physical volumes and bound periodicals',
        '24/7 Digital E-Resource Center with high-speed workstations',
        'Direct access to IEEE Xplore, ScienceDirect, JSTOR, and Springer',
        'Ethiopian Heritage & National Manuscript Archive Room'
      ],
      images: (currentPhotos.facilities.libraries || []).map(img => ({ url: img.url, caption: img.caption }))
    },
    {
      id: `${institution.code.toLowerCase()}-labs`,
      name: getLabName(institution.code, institution.nameEn),
      category: 'Laboratory',
      location: 'Engineering & Innovation Complex',
      capacity: '42 Specialized Labs • 1,800 Concurrent Workstations',
      description: 'Cutting-edge engineering and research facility featuring high-voltage electrical test benches, materials testing rigs, robotics benches, and GPU computing nodes.',
      features: [
        'NVIDIA GPU High-Performance AI & Machine Learning Cluster',
        'Hydraulics, Geotechnical & Soil Mechanics Testing Hall',
        'Renewable Solar Photovoltaic & Smart Microgrid Research Center',
        'Precision CNC Milling, 3D Prototyping & Fabrication FabLab'
      ],
      images: (currentPhotos.facilities.labs || []).map(img => ({ url: img.url, caption: img.caption }))
    },
    {
      id: `${institution.code.toLowerCase()}-hospital`,
      name: getHospitalName(institution.code, institution.city),
      category: 'Healthcare',
      location: 'College of Health Sciences Campus',
      capacity: '800 Inpatient Beds • Comprehensive Clinical Outpatient Care',
      description: 'Specialized tertiary referral hospital serving as the primary clinical clerkship and residency hospital for medical, nursing, and pharmacy students.',
      features: [
        'Comprehensive Inpatient Oncology, Surgery & Trauma Care',
        'Advanced Surgical Suites and Level-1 Emergency Care',
        'State-of-the-Art MRI, CT Scanning, and Pathology Diagnostics',
        'Full residency and medical clerkship training rotations'
      ],
      images: (currentPhotos.facilities.healthcare || []).map(img => ({ url: img.url, caption: img.caption }))
    },
    {
      id: 'student-dorms',
      name: 'Residential Halls & Campus Dining Pavilions',
      category: 'Housing',
      location: 'Main Campus Residential Quads',
      capacity: '28,000 Dormitory Capacity • Central Dining Halls',
      description: 'Complete student housing village providing safe dormitory accommodations, government-subsidized three-course daily meals, study rooms, and recreation areas.',
      features: [
        'Separate multi-story residential blocks for Male & Female students',
        'Three daily government-subsidized meals served in hygienic central cafeterias',
        'High-speed Wi-Fi access in common recreation and study lounges',
        '24/7 security gate control, on-duty proctors, and laundry facilities'
      ],
      images: (currentPhotos.facilities.dorms || []).map(img => ({ url: img.url, caption: img.caption }))
    },
    {
      id: 'stadium-sports',
      name: 'Olympic Athletics Stadium & Multi-Purpose Sports Complex',
      category: 'Sports',
      location: 'Campus Athletics Quadrant',
      capacity: '15,000 Seated Spectator Stadium',
      description: 'Standard all-weather athletics track, professional football pitch, indoor basketball and volleyball arenas, and modern fitness gymnasium.',
      features: [
        'Standard 400m synthetic running track and natural grass football pitch',
        'Indoor sports pavilion for basketball, volleyball, badminton, and handball',
        'Student & staff strength-training and cardio fitness gymnasium',
        'Hosts annual Ethiopian Inter-University Athletic Games'
      ],
      images: (currentPhotos.facilities.sports || []).map(img => ({ url: img.url, caption: img.caption }))
    },
    {
      id: 'ict-center',
      name: 'ICT Data Center & Campus Fiber Core Network Hub',
      category: 'ICT & Innovation',
      location: 'Central IT & E-Learning Center',
      capacity: '10 Gbps Redundant Bandwidth • 50,000 Connected Devices',
      description: 'High-speed campus-wide fiber optic network connecting all university faculties with redundant cloud data storage and e-learning servers.',
      features: [
        'Tier-2 campus data center powering the university portal and LMS',
        'Campus-wide eduroam and open authenticated student Wi-Fi network',
        'Cloud storage for students and certified academic email accounts',
        'Virtual classroom lecture recording studios'
      ],
      images: (currentPhotos.facilities.ict || []).map(img => ({ url: img.url, caption: img.caption }))
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
      isDark ? 'bg-zinc-950 text-white' : 'bg-[#EBF4F7] text-slate-900'
    }`}>
      
      {/* 1. Full-Width Campus Hero */}
      <div className="relative h-[360px] sm:h-[440px] lg:h-[480px] w-full overflow-hidden bg-slate-900">
        <img
          src={currentPhotos.hero}
          alt={`${institution.nameEn} Main Entrance`}
          className="w-full h-full object-cover object-center opacity-90 transition-opacity duration-300"
        />
        {/* Natural gradient scrim preserving authentic photo colors while maintaining high text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />
        
        <div className="absolute inset-0 flex flex-col justify-between max-w-7xl mx-auto px-6 sm:px-10 py-8">
          <div>
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold transition-all cursor-pointer border border-white/20 shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Directory</span>
            </button>
          </div>

          <div className="max-w-3xl">
            {/* University Logo & Accreditation Tag */}
            <div className="flex items-center gap-4 mb-4">
              {institution.logoUrl && (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-2 shadow-2xl flex items-center justify-center shrink-0 border border-white/60 ring-4 ring-black/20 overflow-hidden backdrop-blur-sm">
                  <img
                    src={institution.logoUrl}
                    alt={`${institution.nameEn} official emblem`}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider border border-white/25 shadow-sm">
                  {institution.code} • {institution.ownership} {institution.type}
                </span>
                <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  <span>Est. {institution.establishedYear} • {institution.city}, {institution.region}</span>
                </p>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight drop-shadow-md">
              {institution.nameEn}
            </h1>
            {institution.nameAm && (
              <p className="text-base sm:text-lg text-slate-200 font-ethiopic mt-1.5 drop-shadow">
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
