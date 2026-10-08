import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, BookOpen, Search } from 'lucide-react';

interface ServicesPageProps {
  onContact: () => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onContact }) => {
  return (
    <div className="bg-[#F8FAFC] text-slate-800 py-16 px-6 min-h-screen">
      <div className="max-w-5xl mx-auto">
        
        {/* Editorial Heading */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EBF6F6] text-[#1E5C64] border border-[#5AA7A7]/30 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#5AA7A7]" />
            <span>National Higher Education Platform</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#0F172A] tracking-tight">
            GIBIConnect <span className="text-[#5AA7A7]">Services</span>
          </h1>
          <p className="mt-4 text-sm text-[#64748B] leading-relaxed">
            Empowering Ethiopian higher education with transparent institutional data, verified academic resources, and grounded AI advisory.
          </p>
        </div>

        {/* Hero Image Banner */}
        <div className="mt-10 rounded-3xl overflow-hidden shadow-sm h-64 sm:h-80 w-full bg-[#0C373D] relative">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80"
            alt="Academic Advisory Services"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C373D]/90 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
            <div className="flex items-center gap-2 text-xs font-semibold bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
              <ShieldCheck className="w-4 h-4 text-[#5AA7A7]" />
              <span>MoE & ETA Accredited Data Repository</span>
            </div>
          </div>
        </div>

        {/* Services Flow Cards */}
        <div className="mt-16 space-y-8">
          
          {/* Service 1 */}
          <div className="bg-white p-8 rounded-3xl border border-[#E2E8F0] shadow-sm hover:border-[#5AA7A7]/40 transition-all">
            <div className="flex items-center gap-3 text-xs font-bold text-[#5AA7A7] uppercase tracking-wider mb-2">
              <Search className="w-4 h-4" />
              <span>Service 01</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F172A]">
              Verified Directory & Admissions Gateway
            </h2>
            <p className="mt-3 text-sm text-[#64748B] leading-relaxed">
              We provide access to accredited data covering 19+ Ethiopian universities, complete with verified campus structures, gender-specific entrance cut-off points, intake deadlines, and itemized tuition fee schedules in Ethiopian Birr (ETB) for both regular and extension programs. Students can compare admission criteria across institutions without relying on unverified social channels.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-[#1E5C64]">
              <span className="px-3 py-1 bg-[#EBF6F6] rounded-full border border-[#5AA7A7]/20 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5AA7A7]" /> 19+ Public & Private Campuses
              </span>
              <span className="px-3 py-1 bg-[#EBF6F6] rounded-full border border-[#5AA7A7]/20 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5AA7A7]" /> EUEE Matriculation Cut-Offs
              </span>
            </div>
          </div>

          {/* Service 2 */}
          <div className="bg-white p-8 rounded-3xl border border-[#E2E8F0] shadow-sm hover:border-[#5AA7A7]/40 transition-all">
            <div className="flex items-center gap-3 text-xs font-bold text-[#5AA7A7] uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Service 02</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F172A]">
              Grounded AI Academic Advisor
            </h2>
            <p className="mt-3 text-sm text-[#64748B] leading-relaxed">
              Our natural-language conversational AI assistant evaluates admission eligibility, explains curriculum prerequisites, and guides students through major selection. Built with local Retrieval-Augmented Generation (RAG) and dense vector embeddings, every recommendation is strictly anchored in official registrar bulletins with verifiable source citations, eliminating false claims and hallucinations.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-[#1E5C64]">
              <span className="px-3 py-1 bg-[#EBF6F6] rounded-full border border-[#5AA7A7]/20 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5AA7A7]" /> 100% MoE Grounded Citations
              </span>
              <span className="px-3 py-1 bg-[#EBF6F6] rounded-full border border-[#5AA7A7]/20 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5AA7A7]" /> Proclamation 650/2009 Cost-Sharing Guidance
              </span>
            </div>
          </div>

          {/* Service 3 */}
          <div className="bg-white p-8 rounded-3xl border border-[#E2E8F0] shadow-sm hover:border-[#5AA7A7]/40 transition-all">
            <div className="flex items-center gap-3 text-xs font-bold text-[#5AA7A7] uppercase tracking-wider mb-2">
              <BookOpen className="w-4 h-4" />
              <span>Service 03</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F172A]">
              Academic Resource & Research Repository
            </h2>
            <p className="mt-3 text-sm text-[#64748B] leading-relaxed">
              A centralized digital library containing official university course syllabi, lecture slides, past national examinations, and peer-reviewed institutional research papers. Features include secure in-browser PDF streaming and typo-tolerant search, allowing scholars from any region to access verified curriculum materials instantly.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-[#1E5C64]">
              <span className="px-3 py-1 bg-[#EBF6F6] rounded-full border border-[#5AA7A7]/20 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5AA7A7]" /> In-Browser PDF Streaming
              </span>
              <span className="px-3 py-1 bg-[#EBF6F6] rounded-full border border-[#5AA7A7]/20 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5AA7A7]" /> Past EUEE Exams & Solutions
              </span>
            </div>
          </div>

        </div>

        {/* Contact Us Button at the Bottom */}
        <div className="mt-14 text-center pt-8 border-t border-[#E2E8F0]">
          <button
            onClick={onContact}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0C373D] hover:bg-[#072428] text-white text-xs font-semibold rounded-full transition-all shadow-md cursor-pointer hover:shadow-lg"
          >
            <span>Contact Us</span>
            <ArrowRight className="w-4 h-4 text-[#5AA7A7]" />
          </button>
        </div>

      </div>
    </div>
  );
};