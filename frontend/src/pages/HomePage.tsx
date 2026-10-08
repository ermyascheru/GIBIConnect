import React, { useState } from 'react';
import { 
  ArrowRight, Search, CheckCircle2, 
  MapPin, ChevronDown, ChevronUp,
  Award, Layers, ShieldCheck, ArrowUpRight,
  TrendingUp, Check
} from 'lucide-react';
import { ETHIOPIAN_INSTITUTIONS } from '../data/mockInstitutions';
import { MonogramAvatar } from '../components/common/MonogramAvatar';

interface HomePageProps {
  onGetStarted: () => void;
  onAbout: () => void;
  onSearch?: (query: string) => void;
  onSelectCampus?: (id: string) => void;
  theme?: 'light' | 'dark';
}

export const HomePage: React.FC<HomePageProps> = ({ 
  onGetStarted, 
  onAbout,
  onSearch,
  onSelectCampus,
  theme = 'light'
}) => {
  const isDark = theme === 'dark';
  const [heroQuery, setHeroQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PUBLIC' | 'PRIVATE'>('ALL');

  // Featured flagship universities
  const featuredInstitutions = ETHIOPIAN_INSTITUTIONS.slice(0, 6);

  // Filtered by ownership
  const filteredInstitutions = featuredInstitutions.filter(inst => {
    if (activeTab === 'PUBLIC') return inst.ownership === 'PUBLIC';
    if (activeTab === 'PRIVATE') return inst.ownership === 'PRIVATE';
    return true;
  });

  // Academic Disciplines with rich photography
  const academicDisciplines = [
    { 
      title: 'Engineering & Technology', 
      count: '140+ Programs', 
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      badge: 'Accredited Centers of Excellence',
      desc: 'Software, Civil, Electrical, Mechanical, and Biomedical Engineering curricula across national Centers of Excellence.' 
    },
    { 
      title: 'Medicine & Health Sciences', 
      count: '85+ Programs', 
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
      badge: 'Hospital Affiliations',
      desc: 'Doctor of Medicine (MD), Pharmacy, Nursing, Public Health, and Medical Laboratory Sciences.' 
    },
    { 
      title: 'Computing & Informatics', 
      count: '65+ Programs', 
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      badge: 'Tech & AI Curricula',
      desc: 'Computer Science, Information Systems, Artificial Intelligence, Data Science, and Cybersecurity.' 
    },
    { 
      title: 'Business & Economics', 
      count: '95+ Programs', 
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
      badge: 'Undergrad & Executive MBA',
      desc: 'Accounting & Finance, Economics, Management, Marketing, and Executive Leadership tracks.' 
    },
    { 
      title: 'Law & Governance', 
      count: '40+ Programs', 
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
      badge: 'LL.B. & LL.M. Tracks',
      desc: 'Ethiopian jurisprudence, constitutional law, human rights, and international commercial arbitration.' 
    },
    { 
      title: 'Agriculture & Natural Resources', 
      count: '75+ Programs', 
      image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22d57?auto=format&fit=crop&w=800&q=80',
      badge: 'National Research Stations',
      desc: 'Agribusiness, Horticulture, Plant Breeding, Dryland Farming, and Water Resource Engineering.' 
    },
  ];

  // FAQ Articles & Guidance
  const faqArticles = [
    {
      title: 'How GIBIConnect verifies university cut-offs and tuition data',
      date: 'Updated for 2016/2017 E.C.',
      summary: 'All entrance cut-off points and tuition fee schedules are collected directly from Ministry of Education (MoE) gazettes, Education and Training Authority (ETA) accreditations, and certified university registrar publications.'
    },
    {
      title: 'Understanding EUEE Stream Allocations & Gender Quotas',
      date: 'National Placement Framework',
      summary: 'Natural Science and Social Science matriculation cut-offs differ by institution and program. Female candidates receive affirmative threshold adjustments to support STEM enrollment, along with emerging region quotas.'
    },
    {
      title: 'National Cost-Sharing Scheme (Proclamation No. 650/2009)',
      date: 'Higher Education Legal Framework',
      summary: 'Regular undergraduate public university students receive 100% government tuition subsidies, repaying 15% of their gross salary post-graduation after entering formal employment.'
    },
    {
      title: 'Accreditation status of private universities in Ethiopia',
      date: 'ETA Certified Directory',
      summary: 'GIBIConnect indexes accredited private institutions (such as Unity, St. Mary’s, and Rift Valley) with transparent per-credit fee schedules and active degree authorization verifications.'
    }
  ];

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroQuery.trim() && onSearch) {
      onSearch(heroQuery.trim());
    } else {
      onGetStarted();
    }
  };

  return (
    <div className={`flex flex-col antialiased font-sans transition-colors duration-200 ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-[#F8FAFC] text-[#0F172A]'}`}>
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Video Finpay Layout with Cyan-Teal Accents & Stacked Card) */}
      {/* ========================================================================= */}
      <section className={`relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24 border-b transition-colors ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-[#F8FAFC] border-[#E2E8F0]'}`}>
        
        <div className="relative max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Compact Hero Typography & Input Bar */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              
              {/* Compact Headline matching video typography scale */}
              <h1 className={`text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight leading-[1.16] ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                Discover, compare &<br className="hidden sm:inline" />
                master your university<br className="hidden sm:inline" />
                journey.
              </h1>

              {/* Short & smaller subtitle matching video */}
              <p className={`mt-3.5 text-xs sm:text-sm leading-relaxed max-w-md font-normal ${isDark ? 'text-zinc-400' : 'text-[#64748B]'}`}>
                Access verified university cut-offs, 5-year degree curricula, national cost-sharing, and grounded AI advising.
              </p>

              {/* Smaller Width Integrated Search Input Bar with Cyan-Teal Accent */}
              <form onSubmit={handleHeroSubmit} className="mt-7 w-full max-w-md">
                <div className={`relative flex items-center p-1 rounded-2xl border shadow-sm transition-all focus-within:ring-2 ${
                  isDark 
                    ? 'bg-zinc-900 border-zinc-700 focus-within:ring-[#5AA7A7]/50 shadow-black/40' 
                    : 'bg-white border-[#E2E8F0] focus-within:ring-[#5AA7A7]/40 shadow-slate-200/50'
                }`}>
                  <Search className={`w-4 h-4 ml-3 flex-shrink-0 ${isDark ? 'text-zinc-400' : 'text-[#64748B]'}`} />
                  <input
                    type="text"
                    value={heroQuery}
                    onChange={(e) => setHeroQuery(e.target.value)}
                    placeholder="Search university, program, or cut-off..."
                    className={`w-full px-3 py-2 text-xs font-medium bg-transparent focus:outline-none placeholder:text-slate-400 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#5AA7A7] hover:bg-[#479393] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm flex-shrink-0 cursor-pointer"
                  >
                    <span>Get Started</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

            </div>

            {/* Right Column: Layered Interactive Mockup Cards (Finpay Blue-Teal Card Stack) */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
              
              <div className="relative w-full max-w-md pt-6">
                
                {/* TOP Overlaid Solid Cyan-Teal Card (Matching Credit Card in Video) */}
                <div className="absolute -top-3 right-0 sm:-right-4 z-20 flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-[#5AA7A7] text-white border border-[#4E9F9F] shadow-xl backdrop-blur-md transition-all">
                  <div className="w-9 h-9 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-tight text-white">National Cost-Sharing Scheme</p>
                    <p className="text-[11px] mt-0.5 text-white/90">
                      100% Subsidized (Proclamation 650/2009)
                    </p>
                  </div>
                </div>

                {/* Main Card (University Profile & Cutoffs) */}
                <div className={`rounded-3xl p-6 sm:p-7 border shadow-xl transition-all relative z-10 ${
                  isDark ? 'bg-zinc-900/95 border-zinc-800 shadow-black/80' : 'bg-white border-[#E2E8F0] shadow-slate-200/70'
                }`}>
                  
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <MonogramAvatar code="AAU" name="Addis Ababa University" size="md" />
                      <div>
                        <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                          Addis Ababa University
                        </h3>
                        <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-[#64748B]'}`}>
                          Flagship Autonomous Charter
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EBF6F6] text-[#2C7A7B] border border-[#BCE3E3]">
                      <CheckCircle2 className="w-3 h-3 text-[#2C7A7B]" />
                      Verified
                    </span>
                  </div>

                  {/* Selected Program Block */}
                  <div className={`mt-5 p-4 rounded-2xl border ${
                    isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-[#F8FAFC] border-[#E2E8F0]'
                  }`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#4E9F9F]">Selected Program</span>
                    <p className={`text-sm font-bold mt-0.5 ${isDark ? 'text-zinc-100' : 'text-[#0F172A]'}`}>
                      B.Sc. in Software Engineering
                    </p>
                    <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-[#64748B]'}`}>
                      School of Electrical & Computer Engineering (AAiT, 5 Kilo)
                    </p>
                    <div className="mt-3 flex items-center justify-between text-xs font-semibold pt-2 border-t border-[#E2E8F0] dark:border-zinc-800">
                      <span className={isDark ? 'text-zinc-400' : 'text-[#64748B]'}>Duration / Credits</span>
                      <span className={isDark ? 'text-white' : 'text-[#0F172A]'}>5.0 Yrs • 300 ECTS</span>
                    </div>
                  </div>

                  {/* Matriculation Cutoff Match Indicator */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className={isDark ? 'text-zinc-400' : 'text-[#64748B]'}>EUEE Natural Sci (Male):</span>
                      <span className="font-bold text-[#4E9F9F]">495+ Points</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className={isDark ? 'text-zinc-400' : 'text-[#64748B]'}>EUEE Natural Sci (Female):</span>
                      <span className="font-bold text-[#4E9F9F]">475+ Points</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className={isDark ? 'text-zinc-400' : 'text-[#64748B]'}>Developing Region Quota:</span>
                      <span className="font-bold text-[#2B6CB0]">450+ Points</span>
                    </div>
                  </div>

                  {/* Card Button */}
                  <button
                    onClick={() => {
                      if (onSelectCampus) onSelectCampus('aau');
                      else onGetStarted();
                    }}
                    className="mt-6 w-full py-2.5 rounded-xl bg-[#0C373D] hover:bg-[#14474E] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>View 8-Tab Campus Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. PARTNER / ECOSYSTEM STRIP (Monochrome Logo / University Strip)          */}
      {/* ========================================================================= */}
      <section className={`py-5 border-b ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-[#E2E8F0]'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs font-medium text-slate-400 dark:text-zinc-500">
            <span className="text-[11px] uppercase tracking-widest font-bold text-slate-500 dark:text-zinc-400">Accredited Network:</span>
            <span>Ministry of Education (MoE)</span>
            <span>•</span>
            <span>Addis Ababa University</span>
            <span>•</span>
            <span>ASTU Adama</span>
            <span>•</span>
            <span>AASTU</span>
            <span>•</span>
            <span>Jimma University</span>
            <span>•</span>
            <span>Bahir Dar University</span>
            <span>•</span>
            <span>Hawassa University</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. FEATURE VALUE PROPOSITION (Single Clean Card Container like Video Image 5) */}
      {/* ========================================================================= */}
      <section className={`py-14 sm:py-20 border-b transition-colors ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-[#F8FAFC] border-[#E2E8F0]'}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          
          {/* Unified Container Card */}
          <div className={`p-8 sm:p-12 rounded-3xl border shadow-sm transition-all ${
            isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-[#E2E8F0]'
          }`}>
            
            {/* Top Row: Title & Right Description */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-10 border-b border-[#E2E8F0] dark:border-zinc-800">
              <div>
                <span className="text-[11px] font-bold text-[#4E9F9F] uppercase tracking-wider">FUTURE EDUCATION</span>
                <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight mt-1.5 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                  Experience that grows<br />with your future.
                </h2>
              </div>
              <p className={`max-w-sm text-xs sm:text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-[#64748B]'}`}>
                Design an academic path that works for your goals with transparent higher education intelligence and verified admissions data.
              </p>
            </div>

            {/* Bottom Row: 3 Clean Inline Columns with Cyan-Teal Icons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10">
              
              {/* Column 1 */}
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EBF6F6] text-[#4E9F9F] flex items-center justify-center mb-4">
                  <Award className="w-5 h-5 text-[#4E9F9F]" />
                </div>
                <h3 className={`text-sm sm:text-base font-bold mb-1.5 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                  Verified Cutoff Intelligence
                </h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-[#64748B]'}`}>
                  Historic and current EUEE matriculation score thresholds for Natural and Social Science streams with gender quotas.
                </p>
              </div>

              {/* Column 2 */}
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EBF6F6] text-[#4E9F9F] flex items-center justify-center mb-4">
                  <Layers className="w-5 h-5 text-[#4E9F9F]" />
                </div>
                <h3 className={`text-sm sm:text-base font-bold mb-1.5 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                  8-Tab Campus Profiles
                </h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-[#64748B]'}`}>
                  Explore faculties, deans, 5-year curriculum outlines, laboratory specs, dormitory capacity, and campus photo galleries.
                </p>
              </div>

              {/* Column 3 */}
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EBF6F6] text-[#4E9F9F] flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5 text-[#4E9F9F]" />
                </div>
                <h3 className={`text-sm sm:text-base font-bold mb-1.5 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                  Cost-Sharing & AI Advising
                </h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-[#64748B]'}`}>
                  Calculate Proclamation No. 650/2009 repayment obligations and interact with a zero-hallucination AI academic advisor.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. ASYMMETRIC BENTO GRID WITH LIVE CUTOFF TREND CHART                      */}
      {/* ========================================================================= */}
      <section className={`py-14 sm:py-20 border-b transition-colors ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-[#F8FAFC] border-[#E2E8F0]'}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[11px] font-bold text-[#4E9F9F] uppercase tracking-wider">WHY THEY PREFER GIBICONNECT</span>
            <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight mt-1 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
              National Higher Education Intelligence
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Bento Card 1: 19+ Universities Stat */}
            <div className={`lg:col-span-4 p-8 rounded-3xl border flex flex-col justify-between ${
              isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-[#E2E8F0] shadow-sm'
            }`}>
              <div>
                <p className="text-5xl font-extrabold text-[#4E9F9F] tracking-tight">19+</p>
                <h3 className={`text-base font-bold mt-3 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                  Flagship Public & Private Universities
                </h3>
                <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-[#64748B]'}`}>
                  Covering regional states across Ethiopia with 100% verified registrar provenance and accredited program listings.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E2E8F0] dark:border-zinc-800 flex items-center justify-between text-xs font-semibold">
                <span className={isDark ? 'text-zinc-400' : 'text-[#64748B]'}>Standard:</span>
                <span className="text-[#4E9F9F]">100% MoE & ETA Grounded</span>
              </div>
            </div>

            {/* Bento Card 2: Interactive Cutoff Trend Area Line Chart */}
            <div className={`lg:col-span-8 p-8 rounded-3xl border flex flex-col justify-between ${
              isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-[#E2E8F0] shadow-sm'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <span className="text-[10px] font-bold text-[#4E9F9F] uppercase tracking-wider">HISTORICAL METRICS</span>
                  <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                    Average STEM Cut-off Trends (2014 – 2017 E.C.)
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EBF6F6] text-[#2C7A7B] border border-[#BCE3E3]">
                    <TrendingUp className="w-3.5 h-3.5" />
                    +25 pts Trend
                  </span>
                </div>
              </div>

              {/* Crisp SVG Area Line Chart with Video Cyan-Teal Fill */}
              <div className="w-full h-44 relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 600 160" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#5AA7A7" stopOpacity="0.30" />
                      <stop offset="100%" stopColor="#5AA7A7" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  <line x1="0" y1="20" x2="600" y2="20" stroke={isDark ? '#27272a' : '#f1f5f9'} strokeDasharray="4 4" />
                  <line x1="0" y1="60" x2="600" y2="60" stroke={isDark ? '#27272a' : '#f1f5f9'} strokeDasharray="4 4" />
                  <line x1="0" y1="100" x2="600" y2="100" stroke={isDark ? '#27272a' : '#f1f5f9'} strokeDasharray="4 4" />
                  <line x1="0" y1="140" x2="600" y2="140" stroke={isDark ? '#27272a' : '#f1f5f9'} strokeDasharray="4 4" />

                  {/* Area fill */}
                  <polygon
                    points="0,120 180,95 380,60 580,25 580,150 0,150"
                    fill="url(#chartGradient)"
                  />

                  {/* Line */}
                  <polyline
                    fill="none"
                    stroke="#4E9F9F"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points="0,120 180,95 380,60 580,25"
                  />

                  {/* Data Points */}
                  <circle cx="0" cy="120" r="4" fill="#4E9F9F" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="180" cy="95" r="4" fill="#4E9F9F" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="380" cy="60" r="4" fill="#4E9F9F" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="580" cy="25" r="4.5" fill="#4E9F9F" stroke="#ffffff" strokeWidth="2" />
                </svg>

                {/* X Axis Labels */}
                <div className={`flex justify-between text-xs font-medium mt-2 pt-2 border-t ${
                  isDark ? 'text-zinc-400 border-zinc-800' : 'text-[#64748B] border-[#E2E8F0]'
                }`}>
                  <span>2014 E.C. (465 pts)</span>
                  <span>2015 E.C. (472 pts)</span>
                  <span>2016 E.C. (480 pts)</span>
                  <span className="text-[#4E9F9F] font-bold">2017 E.C. (490+ pts)</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FEATURED FLAGSHIP UNIVERSITIES SHOWCASE                                */}
      {/* ========================================================================= */}
      <section className={`py-14 sm:py-20 border-b transition-colors ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-[#E2E8F0]'}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                Featured Flagship Universities
              </h2>
              <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-zinc-400' : 'text-[#64748B]'}`}>
                Click any institution to open the complete 8-tab campus portal.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className={`flex items-center gap-1.5 p-1 rounded-xl border self-start md:self-auto ${
              isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-[#F8FAFC] border-[#E2E8F0]'
            }`}>
              {(['ALL', 'PUBLIC', 'PRIVATE'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === tab 
                      ? isDark 
                        ? 'bg-zinc-800 text-white shadow-sm' 
                        : 'bg-white text-[#0F172A] shadow-sm'
                      : isDark
                        ? 'text-zinc-400 hover:text-white'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  {tab === 'ALL' ? 'All (19)' : tab === 'PUBLIC' ? 'Public (14)' : 'Private (5)'}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInstitutions.map((inst) => (
              <div
                key={inst.id}
                onClick={() => {
                  if (onSelectCampus) onSelectCampus(inst.id);
                  else onGetStarted();
                }}
                className={`group rounded-3xl p-6 border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer flex flex-col justify-between ${
                  isDark 
                    ? 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700' 
                    : 'bg-white border-[#E2E8F0] hover:border-slate-300 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <MonogramAvatar code={inst.code} name={inst.nameEn} size="md" />
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EBF6F6] text-[#2C7A7B] border border-[#BCE3E3]">
                      <CheckCircle2 className="w-3 h-3 text-[#2C7A7B]" />
                      Verified
                    </span>
                  </div>

                  <h3 className={`text-base font-bold mt-4 group-hover:text-[#4E9F9F] transition-colors ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                    {inst.nameEn}
                  </h3>
                  {inst.nameAm && (
                    <p className={`text-xs font-ethiopic mt-0.5 ${isDark ? 'text-zinc-400' : 'text-[#64748B]'}`}>
                      {inst.nameAm}
                    </p>
                  )}

                  <p className={`text-xs mt-2.5 line-clamp-2 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-[#64748B]'}`}>
                    {inst.overview}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-xs font-medium text-[#64748B] dark:text-zinc-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{inst.city}, {inst.region}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-[#E2E8F0] dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B] dark:text-zinc-400">
                    <span>{inst.totalFaculties} Faculties</span>
                    <span>•</span>
                    <span>{inst.totalPrograms} Programs</span>
                  </div>
                  <span className="text-xs font-bold text-[#4E9F9F] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                    Details <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. ACADEMIC DISCIPLINES (6 Fields with High-Res Photography)              */}
      {/* ========================================================================= */}
      <section className={`py-14 sm:py-20 border-b transition-colors ${isDark ? 'bg-zinc-900/30 border-zinc-800' : 'bg-[#F8FAFC] border-[#E2E8F0]'}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
              Explore 500+ Degree Curricula
            </h2>
            <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-zinc-400' : 'text-[#64748B]'}`}>
              Harmonized national curricula spanning undergraduate and post-graduate programs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {academicDisciplines.map((disc, idx) => (
              <div
                key={idx}
                onClick={onGetStarted}
                className={`group rounded-3xl overflow-hidden border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer flex flex-col ${
                  isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-[#E2E8F0] shadow-sm'
                }`}
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={disc.image}
                    alt={disc.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 backdrop-blur-md text-[#0F172A] shadow-sm">
                    {disc.count}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#4E9F9F] uppercase tracking-wider">{disc.badge}</span>
                    <h3 className={`text-sm sm:text-base font-bold mt-1 group-hover:text-[#4E9F9F] transition-colors ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                      {disc.title}
                    </h3>
                    <p className={`text-xs mt-1.5 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-[#64748B]'}`}>
                      {disc.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E2E8F0] dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-[#4E9F9F]">
                    <span>Browse Programs</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. DEEP CONTRAST DARK CONTAINER (Finpay 3-Step Student Roadmap)            */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-6 sm:px-10">
        <div className="rounded-3xl bg-[#0C373D] text-white p-8 sm:p-12 lg:p-14 border border-[#14474E] shadow-2xl relative overflow-hidden">
          
          {/* Section Header */}
          <div className="max-w-xl mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Your 3-step roadmap to Ethiopian higher education.
            </h2>
          </div>

          {/* 3 Steps with Dark Ocean Overlays */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-[#14474E]/70 border border-[#1E5C64] backdrop-blur-sm relative flex flex-col justify-between">
              <span className="text-3xl font-extrabold text-[#5AA7A7]/40">01</span>
              <div className="mt-4">
                <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">Check Score & Eligibility</h3>
                <p className="text-xs leading-relaxed text-zinc-300">
                  Input your Grade 12 EUEE matriculation score, stream, and regional status to instantly calculate qualifying university programs.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-[#14474E]/70 border border-[#1E5C64] backdrop-blur-sm relative flex flex-col justify-between">
              <span className="text-3xl font-extrabold text-[#5AA7A7]/40">02</span>
              <div className="mt-4">
                <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">Compare Faculties & Campuses</h3>
                <p className="text-xs leading-relaxed text-zinc-300">
                  Inspect 8-tab university profiles, library capacities, academic calendars, and Proclamation No. 650/2009 cost-sharing models.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-[#14474E]/70 border border-[#1E5C64] backdrop-blur-sm relative flex flex-col justify-between">
              <span className="text-3xl font-extrabold text-[#5AA7A7]/40">03</span>
              <div className="mt-4">
                <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">Get Grounded AI Advising</h3>
                <p className="text-xs leading-relaxed text-zinc-300">
                  Chat with the GIBIConnect AI Advisor for zero-hallucination freshman STEM tutoring, past exam solutions, and peer tutor connections.
                </p>
              </div>
            </div>

          </div>

          {/* Action inside Dark Container */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zinc-300">
              Join thousands of Ethiopian matriculated students making informed university choices.
            </p>
            <button
              onClick={onGetStarted}
              className="px-5 py-2.5 rounded-xl bg-[#5AA7A7] hover:bg-[#479393] text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2 self-start sm:self-auto"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FAQ ACCORDIONS & VERIFIED ADMISSIONS GUIDANCE                          */}
      {/* ========================================================================= */}
      <section className={`py-14 sm:py-20 border-b transition-colors ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-[#E2E8F0]'}`}>
        <div className="max-w-3xl mx-auto px-6">
          
          <div className="text-center mb-10">
            <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
              Verified Admissions & Policy Guidance
            </h2>
          </div>

          <div className="space-y-3.5">
            {faqArticles.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all ${
                    isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-[#F8FAFC] border-[#E2E8F0]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-[#4E9F9F] uppercase tracking-wider">{faq.date}</span>
                      <h3 className={`text-sm font-bold mt-0.5 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                        {faq.title}
                      </h3>
                    </div>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${
                      isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-white text-slate-700 shadow-sm border border-[#E2E8F0]'
                    }`}>
                      {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className={`px-5 pb-5 pt-1 text-xs leading-relaxed border-t ${
                      isDark ? 'text-zinc-400 border-zinc-800' : 'text-[#64748B] border-[#E2E8F0]'
                    }`}>
                      {faq.summary}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. BOTTOM CALL-TO-ACTION (CTA) BANNER & SINGLE MERGED FOOTER               */}
      {/* ========================================================================= */}
      <section className={`py-14 sm:py-16 transition-colors ${isDark ? 'bg-zinc-950 text-zinc-400' : 'bg-[#F8FAFC] text-[#64748B]'}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          
          {/* Rounded Action Banner using Video Deep Ocean Cyan #0C373D */}
          <div className="p-8 sm:p-12 rounded-3xl bg-[#0C373D] text-white border border-[#14474E] mb-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Find your accredited Ethiopian university.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-lg">
                Browse verified matriculation cut-offs, explore 8-tab campus profiles, or ask our grounded AI advisor.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onGetStarted}
                className="px-5 py-2.5 rounded-xl bg-[#5AA7A7] hover:bg-[#479393] text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <span>Explore Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onAbout}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold transition-all cursor-pointer"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Consolidated Single Merged Footer */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-t border-[#E2E8F0] dark:border-zinc-800 text-xs">
            <div>
              <p className={`font-bold mb-2.5 text-sm ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>GIBIConnect</p>
              <p className="text-[#64748B] dark:text-zinc-400 leading-relaxed">
                Empowering Ethiopian students with verified admissions intelligence and accredited higher education data.
              </p>
            </div>
            <div>
              <p className={`font-bold mb-2.5 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>Navigation</p>
              <ul className="space-y-2">
                <li><button onClick={onGetStarted} className="hover:text-[#4E9F9F] transition-colors cursor-pointer">Universities Directory</button></li>
                <li><button onClick={onGetStarted} className="hover:text-[#4E9F9F] transition-colors cursor-pointer">Programs & Curricula</button></li>
                <li><button onClick={onGetStarted} className="hover:text-[#4E9F9F] transition-colors cursor-pointer">EUEE Cutoffs</button></li>
              </ul>
            </div>
            <div>
              <p className={`font-bold mb-2.5 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>Student Resources</p>
              <ul className="space-y-2">
                <li><span className="hover:text-[#4E9F9F] cursor-pointer">Past Exam Repository</span></li>
                <li><span className="hover:text-[#4E9F9F] cursor-pointer">Cost-Sharing Guide</span></li>
                <li><span className="hover:text-[#4E9F9F] cursor-pointer">Academic Calendar</span></li>
              </ul>
            </div>
            <div>
              <p className={`font-bold mb-2.5 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>Legal & Standards</p>
              <ul className="space-y-2">
                <li><span>MoE Gazetted Guidelines</span></li>
                <li><span>Proclamation No. 650/2009</span></li>
                <li><span>ETA Accreditation Verification</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] dark:border-zinc-800 text-[11px] text-[#64748B] dark:text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>© 2026 GIBIConnect. All rights reserved. Ethiopian Higher Education Portal.</p>
            <p>Verified with Ministry of Education & University Registrars.</p>
          </div>

        </div>
      </section>

    </div>
  );
};