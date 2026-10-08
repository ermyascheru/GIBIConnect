import React from 'react';
import { Award, ShieldCheck, Layers, Sparkles } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-[#F8FAFC] text-[#0F172A] min-h-screen">
      
      {/* 1. Header: Our Mission Visual Banner */}
      <section className="max-w-5xl mx-auto px-6 pt-10 pb-4">
        <div className="relative rounded-3xl overflow-hidden shadow-sm h-80 sm:h-[420px] bg-[#0C373D]">
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=80"
            alt="Ethiopian Higher Education Community"
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C373D]/95 via-[#0C373D]/50 to-transparent flex items-end p-8 sm:p-14">
            <div className="max-w-3xl text-white">
              <span className="text-xs uppercase tracking-widest text-[#5AA7A7] font-bold bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                Our Mission
              </span>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold mt-3 leading-tight text-white">
                Empowering every Ethiopian student with clarity, verified data, and grounded guidance.
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Editorial Quote */}
      <section className="max-w-3xl mx-auto px-6 py-14 text-center">
        <blockquote className="text-xl sm:text-2xl font-medium text-[#0F172A] leading-relaxed italic">
          "Accurate academic decisions should not happen by chance. We employ verified data, strict provenance, and grounded AI to build transparent educational pathways for Ethiopia."
        </blockquote>
        <div className="w-16 h-1 bg-[#5AA7A7] mx-auto mt-6 rounded-full" />
      </section>

      {/* 3. Core Pillars (Card Grid with Clean Borders) */}
      <section className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
        
        {/* Pillar 1 */}
        <div className="p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#EBF6F6] text-[#4E9F9F] flex items-center justify-center mb-4">
            <Award className="w-5 h-5 text-[#4E9F9F]" />
          </div>
          <h2 className="text-xl font-bold text-[#0F172A]">
            19+ Verified Higher Education Institutions
          </h2>
          <p className="mt-2.5 text-xs sm:text-sm text-[#64748B] leading-relaxed">
            GIBIConnect indexes accredited Ethiopian universities across all regional states—including public research hubs such as Addis Ababa University (AAU) and ASTU, along with premier regional universities.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#EBF6F6] text-[#4E9F9F] flex items-center justify-center mb-4">
            <Layers className="w-5 h-5 text-[#4E9F9F]" />
          </div>
          <h2 className="text-xl font-bold text-[#0F172A]">
            500+ Accredited Degree Programs
          </h2>
          <p className="mt-2.5 text-xs sm:text-sm text-[#64748B] leading-relaxed">
            Our comprehensive academic catalog spans Bachelor’s, Master’s, and Doctoral degree offerings across Natural Sciences, Engineering, Medicine, Social Sciences, and Business with full 5-year ECTS outlines.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#EBF6F6] text-[#4E9F9F] flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5 text-[#4E9F9F]" />
          </div>
          <h2 className="text-xl font-bold text-[#0F172A]">
            100% Verified Records & Provenance
          </h2>
          <p className="mt-2.5 text-xs sm:text-sm text-[#64748B] leading-relaxed">
            All entrance cut-off points, gender quotas, and tuition fee schedules in Ethiopian Birr (ETB) are certified with Ministry of Education gazettes and verified university registrar publications.
          </p>
        </div>

        {/* Pillar 4 */}
        <div className="p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#EBF6F6] text-[#4E9F9F] flex items-center justify-center mb-4">
            <Sparkles className="w-5 h-5 text-[#4E9F9F]" />
          </div>
          <h2 className="text-xl font-bold text-[#0F172A]">
            24/7 Grounded AI Academic Advisory
          </h2>
          <p className="mt-2.5 text-xs sm:text-sm text-[#64748B] leading-relaxed">
            Our AI advisor synthesizes personalized academic guidance strictly anchored in official university documentation—providing direct citations, cost-sharing calculations, and zero hallucinations.
          </p>
        </div>

      </section>

    </div>
  );
};