import React from 'react';
import { 
  Building2, Calculator, BookOpen, Bot, 
  FileText, Coins, ArrowRight 
} from 'lucide-react';

interface ServicesPageProps {
  onContact: () => void;
  onNavigateToFeature?: (featureTab: 'institutions' | 'programs' | 'admissions' | 'resources' | 'market' | 'ai-advisor') => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onContact, onNavigateToFeature }) => {
  const services = [
    {
      id: 'directory',
      icon: Building2,
      title: 'Verified University Directory',
      description: 'Accredited institutional structures covering 19+ Ethiopian public and private universities with regional campus breakdowns and intake quotas.',
      tag: 'Admissions & Campuses'
    },
    {
      id: 'cutoffs',
      icon: Calculator,
      title: 'EUEE Cut-Off Calculator',
      description: 'Interactive national matriculation score engine comparing male and female entrance benchmarks across faculties and departments.',
      tag: 'Placement Intelligence'
    },
    {
      id: 'curriculum',
      icon: BookOpen,
      title: '5-Year Degree Curricula',
      description: 'Complete year-by-year ECTS modular outlines, prerequisites, and graduation roadmaps verified by the Ministry of Education.',
      tag: 'Academic Catalog'
    },
    {
      id: 'ai-advisor',
      icon: Bot,
      title: 'Grounded AI Academic Advisor',
      description: '24/7 natural-language conversational assistant answering admission, tuition, and career pathway queries with verified source citations.',
      tag: 'AI Advisory'
    },
    {
      id: 'repository',
      icon: FileText,
      title: 'Digital PDF Repository',
      description: 'Centralized in-browser document streaming for verified course syllabi, past national examinations, and academic research papers.',
      tag: 'Resource Vault'
    },
    {
      id: 'cost-sharing',
      icon: Coins,
      title: 'Cost-Sharing & Tuition Estimator',
      description: 'Proclamation 650/2009 repayment breakdowns and itemized ETB per-credit tuition schedules for extension and weekend programs.',
      tag: 'Financial Terms'
    }
  ];

  const studentLifeShowcase = [
    {
      university: 'Jimma University',
      code: 'JU',
      logo: '/images/logos/ju-logo.jpg',
      image: '/images/students/ju-student-life.jpg',
      tag: 'Community Education',
      desc: 'Hands-on clinical internships and multidisciplinary field practice in Jimma and southwestern Ethiopia.',
    },
    {
      university: 'Hawassa University',
      code: 'HU',
      logo: '/images/logos/hu-logo.jpg',
      image: '/images/students/hu-student-life.jpg',
      tag: 'Academic Excellence',
      desc: 'Collaborative student seminars, agricultural sciences, and technology labs along Lake Hawassa.',
    },
    {
      university: 'Bahir Dar University',
      code: 'BDU',
      logo: '/images/logos/bdu-logo.jpg',
      image: '/images/students/bdu-student-life.jpg',
      tag: 'Innovation & Maritime',
      desc: 'Comprehensive engineering projects, textile technology hubs, and vibrant student union initiatives.',
    },
    {
      university: 'University of Gondar',
      code: 'UOG',
      logo: '/images/logos/uog-logo.jpg',
      image: '/images/students/uog-student-life.jpg',
      tag: 'Medical Heritage',
      desc: 'Centuries-old academic tradition paired with Ethiopia’s pioneer public health and medical training hospital.',
    },
  ];

  return (
    <div className="bg-[#EBF4F7] text-[#0F172A] min-h-screen">
      
      {/* ========================================================================= */}
      {/* 1. HERO HEADER BANNER WITH AUTHENTIC ENTRANCE & LOGO                      */}
      {/* ========================================================================= */}
      <section className="relative bg-[#0C373D] text-white py-24 sm:py-36 px-6 overflow-hidden flex items-center justify-center">
        {/* Authentic Entrance Background Image with Natural Color and Gradient Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/entrances/aau-entrance.jpg"
            alt="Addis Ababa University Main Entrance Gate"
            className="w-full h-full object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0C373D]/90 via-[#0C373D]/80 to-[#0C373D]" />
        </div>

        {/* Decorative Grid / Dot Accents */}
        <div className="absolute top-12 right-16 opacity-25 pointer-events-none hidden sm:block">
          <div className="grid grid-cols-6 gap-2.5">
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#5AA7A7]" />
            ))}
          </div>
        </div>

        <div className="absolute bottom-12 left-16 opacity-25 pointer-events-none hidden sm:block">
          <div className="grid grid-cols-6 gap-2.5">
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#5AA7A7]" />
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Official University Directory Pill */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-teal-200 mb-5">
            <img
              src="/images/logos/aau-logo.jpg"
              alt="AAU Emblem"
              className="w-4 h-4 object-contain rounded-full bg-white p-0.5"
            />
            <span>Serving 19+ Ethiopian Universities</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-serif tracking-tight text-white">
            Our Services
          </h1>
          <p className="mt-4 text-sm sm:text-base text-teal-100/90 max-w-2xl mx-auto leading-relaxed">
            Transparent admissions data, official curricula, financial calculators, and grounded AI advisory built for Ethiopian higher education.
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. 6-CARD SERVICES GRID WITH PROTRUDING ICON BADGES                       */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#5AA7A7] bg-[#EBF6F6] px-3.5 py-1 rounded-full border border-[#5AA7A7]/30">
            Features & Capabilities
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#0F172A] mt-4 tracking-tight leading-snug">
            A wide range of higher education & advising services
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-[#64748B] leading-relaxed">
            Every feature on GIBIConnect is designed to provide transparent institutional data and grounded student advisory across Ethiopia.
          </p>
        </div>

        {/* 6 Services Grid (3 cols x 2 rows) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 pt-4">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.id}
                className="group relative bg-white rounded-3xl p-8 pt-12 border border-[#E2E8F0] shadow-sm hover:shadow-xl hover:border-[#5AA7A7]/40 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Top Floating / Protruding Icon Badge */}
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-white px-5 py-3 rounded-2xl border border-[#E2E8F0] shadow-md group-hover:border-[#5AA7A7] group-hover:scale-110 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-[#EBF6F6] flex items-center justify-center text-[#0C373D]">
                    <Icon className="w-5 h-5 text-[#5AA7A7]" />
                  </div>
                </div>

                {/* Card Content */}
                <div className="text-center mt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E5C64] bg-[#EBF6F6] px-2.5 py-0.5 rounded-full inline-block mb-3">
                    {svc.tag}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-[#0F172A] group-hover:text-[#0C373D] transition-colors leading-snug">
                    {svc.title}
                  </h3>
                  <p className="mt-3 text-xs text-[#64748B] leading-relaxed">
                    {svc.description}
                  </p>
                </div>

                {/* Circular Action Arrow Button at Bottom */}
                <div className="mt-8 pt-4 border-t border-slate-100 flex justify-center">
                  <button
                    onClick={() => {
                      if (onNavigateToFeature) {
                        const tabMap: Record<string, 'institutions' | 'programs' | 'admissions' | 'resources' | 'market' | 'ai-advisor'> = {
                          directory: 'institutions',
                          cutoffs: 'admissions',
                          curriculum: 'programs',
                          'ai-advisor': 'ai-advisor',
                          repository: 'resources',
                          'cost-sharing': 'institutions',
                        };
                        onNavigateToFeature(tabMap[svc.id] || 'institutions');
                      } else {
                        onContact();
                      }
                    }}
                    className="w-9 h-9 rounded-full bg-[#EBF4F7] border border-[#E2E8F0] text-[#0C373D] group-hover:bg-[#0C373D] group-hover:text-white group-hover:border-[#0C373D] flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer"
                    title={`Explore ${svc.title}`}
                  >
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 3. STUDENT LIFE & CAMPUS COMMUNITY IMMERSION SHOWCASE                     */}
      {/* ========================================================================= */}
      <section className="bg-white py-20 border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#5AA7A7] bg-[#EBF6F6] px-3.5 py-1 rounded-full border border-[#5AA7A7]/30">
                Campus Immersion
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#0F172A] mt-4 tracking-tight">
                Authentic Student Life & Regional Campuses
              </h2>
              <p className="mt-2 text-sm text-[#64748B] max-w-2xl">
                See real university environments, student experiences, and accredited faculties across Ethiopian public universities.
              </p>
            </div>
            {onNavigateToFeature && (
              <button
                onClick={() => onNavigateToFeature('institutions')}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#0C373D] hover:text-[#5AA7A7] transition-colors group cursor-pointer shrink-0"
              >
                <span>Explore All Universities</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {studentLifeShowcase.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-[#F8FAFC] rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={item.image}
                      alt={`${item.university} Student Community`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
                    
                    {/* Official University Logo Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-md border border-white">
                      <img
                        src={item.logo}
                        alt={`${item.code} Seal`}
                        className="w-4 h-4 object-contain rounded-full"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                      <span className="text-[10px] font-bold text-slate-900">{item.code}</span>
                    </div>

                    <span className="absolute bottom-2.5 left-3 bg-[#0C373D]/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {item.tag}
                    </span>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-sm text-[#0F172A] group-hover:text-[#0C373D] transition-colors">
                      {item.university}
                    </h3>
                    <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <a
                    href={`#campus/${item.code.toLowerCase()}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E5C64] hover:text-[#0C373D] transition-colors"
                  >
                    <span>View University Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. BOTTOM CTA / ADVISING BANNER                                           */}
      {/* ========================================================================= */}
      <section className="bg-[#0C373D] text-white py-16 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-[#5AA7A7]">
              Need Academic Guidance?
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold mt-1 text-white">
              Connect with verified university data today
            </h3>
            <p className="text-xs text-white/70 mt-2 max-w-lg leading-relaxed">
              Have questions regarding matriculation scores, regional campus allocations, or cost-sharing directives? Our advisory team is here to assist.
            </p>
          </div>

          <button
            onClick={onContact}
            className="px-8 py-3.5 bg-[#5AA7A7] hover:bg-[#4E9F9F] text-white text-xs font-bold rounded-full transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>Contact Support</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
};
