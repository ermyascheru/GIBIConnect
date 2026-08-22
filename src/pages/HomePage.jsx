import React, { useState } from 'react';
import SearchBar from '../components/search/SearchBar';
import InstitutionCard from '../components/institutions/InstitutionCard';
import ProgramCard from '../components/programs/ProgramCard';
import ScholarshipCard from '../components/scholarships/ScholarshipCard';
import Button from '../components/common/Button';

export default function HomePage({
  institutions = [],
  programs = [],
  scholarships = [],
  onNavigate,
  onSelectInstitution,
  onSelectProgram,
  onSelectScholarship
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    if (!query) return;
    onNavigate(`/institutions?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="space-y-12 pb-12">
      
      {/* Hero Section with Bright, Sharp Campus Background Photos */}
      <section className="relative rounded-3xl overflow-hidden border border-slate-300 shadow-xl bg-slate-900 text-white">
        
        {/* Background Campus Photos Grid with High Visibility & Brightness */}
        <div className="absolute inset-0 grid grid-cols-3 opacity-60 pointer-events-none">
          <img
            src="/images/Butler-Exterior-2-scaled.jpg"
            alt="University Campus Hall"
            className="w-full h-full object-cover filter brightness-110 contrast-110"
          />
          <img
            src="/images/ColumbiaUniversity1.jpg"
            alt="University Quadrangle"
            className="w-full h-full object-cover filter brightness-110 contrast-110"
          />
          <img
            src="/images/181005columbia00088_cropped.jpg"
            alt="Academic Library"
            className="w-full h-full object-cover filter brightness-110 contrast-110"
          />
        </div>

        {/* Crisp Gradient Overlay for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-blue-950/60" />

        {/* Hero Content */}
        <div className="relative z-10 p-8 sm:p-14 max-w-4xl space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-600/30 border border-blue-400/50 text-xs font-bold text-blue-200">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>GIBI-Connect Higher Education Intelligence</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
              Discover Ethiopian Higher Education & Degree Programs
            </h1>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
              Explore accredited universities and colleges across Ethiopia. Compare academic degree curricula, official entrance cutoff scores, verified scholarships, and consult our AI advisor.
            </p>
          </div>

          {/* Search Box */}
          <div className="pt-2 max-w-2xl">
            <SearchBar
              size="lg"
              placeholder="Search universities, colleges, degree programs, scholarships..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onSearch={handleSearch}
            />
          </div>

          {/* Quick Category Navigation (No Emojis) */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs">
            <span className="font-bold text-slate-300">Quick Explore:</span>
            <button
              onClick={() => onNavigate('/institutions')}
              className="px-3.5 py-2 bg-slate-900/90 hover:bg-blue-600 text-white rounded-xl border border-slate-700/80 shadow-xs transition-all cursor-pointer font-medium"
            >
              Universities Directory
            </button>
            <button
              onClick={() => onNavigate('/programs')}
              className="px-3.5 py-2 bg-slate-900/90 hover:bg-blue-600 text-white rounded-xl border border-slate-700/80 shadow-xs transition-all cursor-pointer font-medium"
            >
              Academic Programs
            </button>
            <button
              onClick={() => onNavigate('/scholarships')}
              className="px-3.5 py-2 bg-slate-900/90 hover:bg-blue-600 text-white rounded-xl border border-slate-700/80 shadow-xs transition-all cursor-pointer font-medium"
            >
              Active Scholarships
            </button>
            <button
              onClick={() => onNavigate('/admissions')}
              className="px-3.5 py-2 bg-slate-900/90 hover:bg-blue-600 text-white rounded-xl border border-slate-700/80 shadow-xs transition-all cursor-pointer font-medium"
            >
              Cutoff Scores
            </button>
          </div>
        </div>

        {/* Floating Verified Advisor Badge (Desktop) */}
        <div className="hidden lg:block absolute bottom-8 right-8 z-20">
          <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 p-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <img src="/logo.jpg" alt="GIBI-Connect Student Avatar" className="w-12 h-12 rounded-xl object-cover border border-blue-400" />
            <div className="text-xs">
              <span className="text-[10px] uppercase font-bold text-blue-400 block">AI Consultant Ready</span>
              <span className="font-bold text-white block">Ask GIBI-Connect Advisor</span>
              <span className="text-[10px] text-slate-300">Grounded in verified data</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Universities */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
              Accredited Directory
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Featured Ethiopian Universities</h2>
            <p className="text-xs sm:text-sm text-slate-500">Discover recognized higher education institutions across Ethiopia.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => onNavigate('/institutions')}>
            View All Institutions &rarr;
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {institutions.slice(0, 3).map((inst) => (
            <InstitutionCard
              key={inst.id}
              institution={inst}
              onSelect={() => onSelectInstitution(inst)}
            />
          ))}
        </div>
      </section>

      {/* Interactive AI Consultant Card with Bright Campus Background */}
      <section className="relative rounded-3xl overflow-hidden border border-blue-200 shadow-xl bg-slate-900 text-white p-8 sm:p-12">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <img
            src="/images/Butler-Exterior-2-scaled.jpg"
            alt="Campus Library Background"
            className="w-full h-full object-cover filter brightness-110"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/80 to-blue-950/70" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/30 border border-blue-400/40 text-xs font-bold text-blue-200">
              <span>Instant Academic Guidance</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">Not sure where to apply? Ask GIBI-Connect AI</h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Get personalized academic advice grounded in verified Ethiopian university cutoffs, curriculum requirements, and tuition costs.
            </p>
          </div>
          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
            <Button variant="primary" size="lg" onClick={() => onNavigate('/ai')} className="w-full sm:w-auto shadow-lg">
              Start Free AI Consultation &rarr;
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
              Curricula & Degrees
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Popular Academic Degree Programs</h2>
            <p className="text-xs sm:text-sm text-slate-500">Explore bachelor's, master's, and doctorate curricula.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => onNavigate('/programs')}>
            Browse All Programs &rarr;
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.slice(0, 3).map((prog) => (
            <ProgramCard
              key={prog.id}
              program={prog}
              onSelect={() => onSelectProgram(prog)}
            />
          ))}
        </div>
      </section>

      {/* Featured Scholarships */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
              Financial Aid
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Scholarships & Grants</h2>
            <p className="text-xs sm:text-sm text-slate-500">Merit awards and government fee waivers.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => onNavigate('/scholarships')}>
            All Scholarships &rarr;
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {scholarships.slice(0, 3).map((sch) => (
            <ScholarshipCard
              key={sch.id}
              scholarship={sch}
              onSelect={() => onSelectScholarship(sch)}
            />
          ))}
        </div>
      </section>

    </div>
  );
}
