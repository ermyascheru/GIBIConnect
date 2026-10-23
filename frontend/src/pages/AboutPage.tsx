import React from 'react';
import { Award, Target, GraduationCap, Play, Users, MapPin, ExternalLink } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const heroStudentCards = [
    {
      university: 'ASTU • Adama Science & Tech',
      shortName: 'ASTU',
      logo: '/images/logos/astu-logo.jpg',
      image: '/images/students/astu-student-life.jpg',
      caption: 'Engineering & Innovation Hub',
      heightClass: 'h-56 sm:h-64',
    },
    {
      university: 'Hawassa University',
      shortName: 'HU',
      logo: '/images/logos/hu-logo.jpg',
      image: '/images/students/hu-student-life.jpg',
      caption: 'Lake City Campus Community',
      heightClass: 'h-48 sm:h-56',
    },
    {
      university: 'Jimma University',
      shortName: 'JU',
      logo: '/images/logos/ju-logo.jpg',
      image: '/images/students/ju-student-life.jpg',
      caption: 'Community-Based Education',
      heightClass: 'h-52 sm:h-60',
    },
    {
      university: 'University of Gondar',
      shortName: 'UoG',
      logo: '/images/logos/uog-logo.jpg',
      image: '/images/students/uog-student-life.jpg',
      caption: 'Medical & Historic Heritage',
      heightClass: 'h-48 sm:h-56',
    },
  ];

  const regionalCampusLife = [
    {
      name: 'Bahir Dar University',
      code: 'BDU',
      location: 'Bahir Dar, Amhara Region',
      logo: '/images/logos/bdu-logo.jpg',
      image: '/images/students/bdu-student-life.jpg',
      desc: 'Active student union leadership, lakefront campus engagement, and maritime engineering research groups.',
    },
    {
      name: 'Haramaya University',
      code: 'HRU',
      location: 'Haramaya, Oromia Region',
      logo: '/images/logos/hru-logo.jpg',
      image: '/images/students/hru-student-life.jpg',
      desc: 'Historic agricultural research legacy, community outreach, and vibrant multidisciplinary student societies.',
    },
    {
      name: 'Arba Minch University',
      code: 'AMU',
      location: 'Arba Minch, Southern Ethiopia',
      logo: '/images/logos/amu-logo.jpg',
      image: '/images/students/amu-student-life.jpg',
      desc: 'Renowned institute of water technology, scenic Rift Valley campus life, and active student innovation teams.',
    },
    {
      name: 'Mekelle University',
      code: 'MU',
      location: 'Mekelle, Tigray Region',
      logo: '/images/logos/mu-logo.jpg',
      image: '/images/students/mu-student-life.jpg',
      desc: 'Resilient academic community, high-impact clinical rotations, and dynamic engineering workshops.',
    },
  ];

  return (
    <div className="bg-[#EBF4F7] text-[#0F172A] min-h-screen">
      
      {/* ========================================================================= */}
      {/* 1. HERO BANNER WITH AUTHENTIC STUDENT LIFE & OFFICIAL LOGOS               */}
      {/* ========================================================================= */}
      <section className="relative bg-gradient-to-b from-[#EBF6F6] via-[#EBF6F6]/70 to-[#F8FAFC] pt-16 pb-20 px-6 overflow-hidden">
        {/* Subtle decorative geometric rings */}
        <div className="absolute top-8 right-1/4 text-[#5AA7A7]/30 pointer-events-none select-none">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full border-2 border-[#5AA7A7]/40 inline-block" />
            <span className="w-2 h-2 rounded-full bg-[#5AA7A7]/40 inline-block" />
          </div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-white/80 text-[#1E5C64] border border-[#5AA7A7]/30 mb-4 shadow-sm backdrop-blur-sm">
            <Users className="w-3.5 h-3.5 text-[#1E5C64]" />
            <span>National Higher Education Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#0F172A] font-serif">
            About us
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-[#64748B] leading-relaxed">
            Empowering Ethiopian higher education with transparent institutional data, verified 5-year degree curricula, national cost-sharing calculators, and grounded AI academic advising.
          </p>

          {/* 4 Image Cards Row with Authentic Ethiopian University Student Life & Official Logos */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 items-center">
            {heroStudentCards.map((card, idx) => (
              <div 
                key={idx} 
                className={`rounded-3xl overflow-hidden shadow-md border-4 border-white bg-slate-900 ${card.heightClass} group relative`}
              >
                <img
                  src={card.image}
                  alt={`${card.university} Student Life`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Natural-color gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
                
                {/* Official University Logo Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2 py-1 rounded-full shadow-md border border-white">
                  <img
                    src={card.logo}
                    alt={`${card.shortName} Logo`}
                    className="w-4 h-4 object-contain rounded-full"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="text-[10px] font-bold text-slate-900">{card.shortName}</span>
                </div>

                <div className="absolute bottom-2.5 left-3 right-3 text-left">
                  <p className="text-[11px] font-bold text-white tracking-wide leading-tight drop-shadow-sm">
                    {card.university}
                  </p>
                  <p className="text-[9px] text-teal-200/90 font-medium mt-0.5 truncate">
                    {card.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. HEADLINE & TWO-COLUMN STORY SECTION                                    */}
      {/* ========================================================================= */}
      <section className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
        <h2 className="text-2xl sm:text-4xl font-bold text-[#0F172A] tracking-tight max-w-2xl font-serif leading-snug">
          We make sure your university journey & academic future is delivered with clarity
        </h2>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-[#64748B] leading-relaxed">
          <p>
            Navigating higher education in Ethiopia has historically been fragmented across unverified social channels, word-of-mouth notices, and hard-to-find registrar bulletins. GIBIConnect bridges this gap by providing an authoritative single source of truth for university structures, regional campus divisions, and matriculation cut-offs.
          </p>
          <p>
            From national EUEE entrance scoring and Ministry placement frameworks to Proclamation 650/2009 cost-sharing models and postgraduate research pathways, our platform ensures students and families make informed, data-grounded educational choices.
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SPOTLIGHT SECTION (IMAGE + FOUNDER QUOTE & HIGHLIGHT BOX)              */}
      {/* ========================================================================= */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          
          {/* Left: Video / Image Card with University Logo & Quote Badge */}
          <div className="md:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-900 h-80 sm:h-96 w-full relative group">
              <img
                src="/images/students/astu-student-life.jpg"
                alt="Adama Science and Technology University Academic Collaboration"
                className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Natural Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/30" />

              {/* University Logo Pill */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-white">
                <img
                  src="/images/logos/astu-logo.jpg"
                  alt="ASTU Official Seal"
                  className="w-5 h-5 object-contain rounded-full"
                />
                <span className="text-xs font-bold text-slate-900">ASTU Adama</span>
              </div>

              {/* Center Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button 
                  onClick={() => alert('Playing GIBIConnect platform introduction video...')}
                  className="w-14 h-14 rounded-full bg-white/95 text-[#0C373D] flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer"
                  title="Play video"
                >
                  <Play className="w-5 h-5 fill-[#0C373D] ml-1" />
                </button>
              </div>
            </div>

            {/* Floating Quote Badge at Bottom */}
            <div className="absolute -bottom-6 left-6 right-6 sm:right-auto sm:max-w-xs bg-white p-4 rounded-2xl shadow-xl border border-[#E2E8F0]">
              <p className="text-xs font-bold text-[#0F172A]">
                &quot;Making an impact, together&quot;
              </p>
              <p className="text-[11px] text-[#64748B] mt-0.5">
                GIBIConnect Academic Initiative
              </p>
            </div>
          </div>

          {/* Right: Text & Testimonial Quote Box */}
          <div className="md:col-span-6 pt-6 sm:pt-0">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#0F172A] font-serif leading-snug">
              We empower Ethiopian students & scholars
            </h3>
            
            <p className="mt-4 text-sm text-[#64748B] leading-relaxed">
              Whether you are calculating your EUEE matriculation eligibility, comparing tuition fee structures in ETB for extension degrees, or exploring verified syllabi, GIBIConnect equips every scholar with the tools to succeed.
            </p>

            {/* Quote Box with Teal Accent Bar */}
            <div className="mt-6 border-l-4 border-[#5AA7A7] bg-[#EBF6F6]/60 p-5 rounded-r-2xl">
              <p className="text-xs sm:text-sm italic font-medium text-[#1E5C64] leading-relaxed">
                &quot;Accurate academic decisions should not happen by chance. We employ verified data, strict registrar provenance, and grounded AI to build transparent educational pathways for Ethiopia.&quot;
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. REGIONAL CAMPUS STUDENT LIFE & UNIVERSITY BADGES SECTION               */}
      {/* ========================================================================= */}
      <section className="bg-white py-20 px-6 border-t border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#5AA7A7] bg-[#EBF6F6] px-3.5 py-1 rounded-full border border-[#5AA7A7]/30">
              Campus Communities
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#0F172A] font-serif tracking-tight mt-3">
              Vibrant Student Life Across Ethiopian Universities
            </h2>
            <p className="mt-3 text-sm text-[#64748B] leading-relaxed">
              Real university experiences, active student unions, and campus culture documented across our regional partner institutions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {regionalCampusLife.map((campus, idx) => (
              <div 
                key={idx} 
                className="bg-[#F8FAFC] rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 overflow-hidden relative">
                    <img
                      src={campus.image}
                      alt={`${campus.name} Campus Life`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    
                    {/* Official University Logo Pill */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-md border border-white">
                      <img
                        src={campus.logo}
                        alt={`${campus.code} Seal`}
                        className="w-4 h-4 object-contain rounded-full"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                      <span className="text-[10px] font-bold text-slate-900">{campus.code}</span>
                    </div>

                    <div className="absolute bottom-2.5 left-3 flex items-center gap-1 text-[11px] text-white font-medium drop-shadow-sm">
                      <MapPin className="w-3 h-3 text-[#5AA7A7]" />
                      <span>{campus.location}</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-sm text-[#0F172A] group-hover:text-[#0C373D] transition-colors">
                      {campus.name}
                    </h3>
                    <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                      {campus.desc}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <a
                    href={`#campus/${campus.code.toLowerCase()}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E5C64] hover:text-[#0C373D] transition-colors"
                  >
                    <span>View Campus Details</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. VALUES & PILLARS SECTION (CENTERED HEADER + 3 CIRCULAR BADGES)         */}
      {/* ========================================================================= */}
      <section className="bg-[#EBF4F7] border-t border-[#E2E8F0] py-20 px-6">
        <div className="max-w-5xl mx-auto">
          
          {/* Centered Header */}
          <div className="text-center max-w-2xl mx-auto relative">
            <h2 className="text-2xl sm:text-4xl font-bold text-[#0F172A] font-serif tracking-tight">
              We help students grow faster and bigger
            </h2>
            <p className="mt-3 text-sm text-[#64748B] leading-relaxed">
              Grounding higher education decisions with official university records and intelligent academic advising.
            </p>
          </div>

          {/* 3 Value Pillars Grid */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            
            {/* Pillar 1 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white text-[#0C373D] border border-[#5AA7A7]/30 flex items-center justify-center shadow-sm mb-5 group-hover:scale-105 transition-transform">
                <Award className="w-7 h-7 text-[#5AA7A7]" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] font-serif">
                Verified Data & Accreditation
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#64748B] leading-relaxed max-w-xs">
                Accredited catalogs covering 19+ Ethiopian public and private universities with 100% verified registrar records.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white text-[#0C373D] border border-[#5AA7A7]/30 flex items-center justify-center shadow-sm mb-5 group-hover:scale-105 transition-transform">
                <Target className="w-7 h-7 text-[#5AA7A7]" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] font-serif">
                Target-Oriented Advising
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#64748B] leading-relaxed max-w-xs">
                Grounded conversational AI providing personalized major selection, prerequisites, and cost-sharing calculations.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white text-[#0C373D] border border-[#5AA7A7]/30 flex items-center justify-center shadow-sm mb-5 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-7 h-7 text-[#5AA7A7]" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] font-serif">
                Academic Success
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#64748B] leading-relaxed max-w-xs">
                Clear 5-year graduation roadmaps, career pathways, in-browser PDF repository, and national placement assistance.
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
