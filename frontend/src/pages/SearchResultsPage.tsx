import React, { useState, useMemo } from 'react';
import { Search, ArrowLeft, Building2, BookOpen, MapPin, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { ETHIOPIAN_INSTITUTIONS } from '../data/mockInstitutions';
import { matchesInstitution } from '../utils/resolveInstitution';
import { MonogramAvatar } from '../components/common/MonogramAvatar';
import type { Institution } from '../types/institution';

interface SearchResultsPageProps {
  initialQuery: string;
  onBack: () => void;
  onSelectCampus: (id: string) => void;
  theme?: 'light' | 'dark';
}

export const SearchResultsPage: React.FC<SearchResultsPageProps> = ({
  initialQuery,
  onBack,
  onSelectCampus,
  theme = 'light',
}) => {
  const isDark = theme === 'dark';
  const [query, setQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'UNIVERSITIES' | 'PROGRAMS' | 'CUTOFFS'>('ALL');

  // Search matching institutions
  const matchedInstitutions = useMemo(() => {
    if (!query.trim()) return ETHIOPIAN_INSTITUTIONS;
    const lower = query.toLowerCase();
    return ETHIOPIAN_INSTITUTIONS.filter((inst) => {
      return (
        matchesInstitution(inst, query) ||
        inst.overview.toLowerCase().includes(lower) ||
        inst.admissions?.some((adm) => adm.programName.toLowerCase().includes(lower))
      );
    });
  }, [query]);

  // Search matching degree programs across all institutions
  const matchedPrograms = useMemo(() => {
    const lower = query.toLowerCase();
    const progs: { inst: Institution; programName: string; maleCutoff: number; femaleCutoff: number; stream: string }[] = [];
    ETHIOPIAN_INSTITUTIONS.forEach((inst) => {
      inst.admissions?.forEach((adm) => {
        if (!query.trim() || adm.programName.toLowerCase().includes(lower) || inst.nameEn.toLowerCase().includes(lower) || inst.code.toLowerCase().includes(lower)) {
          progs.push({
            inst,
            programName: adm.programName,
            maleCutoff: adm.maleCutoff,
            femaleCutoff: adm.femaleCutoff,
            stream: adm.stream,
          });
        }
      });
    });
    return progs;
  }, [query]);

  return (
    <div className={`min-h-screen py-10 px-6 antialiased transition-colors duration-200 ${
      isDark ? 'bg-zinc-950 text-slate-100' : 'bg-[#EBF4F7] text-slate-900'
    }`}>
      <div className="max-w-6xl mx-auto">
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className={`inline-flex items-center gap-2 text-xs font-semibold mb-6 transition-colors cursor-pointer ${
            isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Search Header */}
        <div className={`rounded-3xl p-8 border shadow-sm transition-colors ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200/80'
        }`}>
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-[#5AA7A7] uppercase tracking-wider">
              Search Results
            </span>
            <h1 className={`text-2xl sm:text-3xl font-serif font-bold mt-1 ${
              isDark ? 'text-white' : 'text-[#0F172A]'
            }`}>
              Search Ethiopian Higher Education Directory
            </h1>
          </div>

          {/* Active Search Input */}
          <div className="mt-6 relative max-w-2xl">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
              isDark ? 'text-zinc-500' : 'text-[#64748B]'
            }`} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search universities, degrees, cut-offs, or cities..."
              className={`w-full pl-12 pr-4 py-3.5 rounded-2xl text-sm transition-all focus:outline-none ${
                isDark 
                  ? 'bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-500 focus:border-[#5AA7A7]' 
                  : 'bg-slate-50 border border-[#E2E8F0] text-[#0F172A] placeholder:text-[#64748B] focus:border-[#5AA7A7] focus:bg-white'
              }`}
            />
          </div>

          {/* Filter Tabs */}
          <div className={`mt-6 flex flex-wrap items-center gap-2 pt-4 border-t ${
            isDark ? 'border-zinc-800' : 'border-slate-100'
          }`}>
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === 'ALL'
                  ? (isDark ? 'bg-white text-black shadow-sm font-bold' : 'bg-[#0C373D] text-white shadow-sm font-bold')
                  : (isDark ? 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
              }`}
            >
              All Results ({matchedInstitutions.length + matchedPrograms.length})
            </button>
            <button
              onClick={() => setActiveFilter('UNIVERSITIES')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === 'UNIVERSITIES'
                  ? (isDark ? 'bg-white text-black shadow-sm font-bold' : 'bg-[#0C373D] text-white shadow-sm font-bold')
                  : (isDark ? 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
              }`}
            >
              Universities ({matchedInstitutions.length})
            </button>
            <button
              onClick={() => setActiveFilter('PROGRAMS')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === 'PROGRAMS'
                  ? (isDark ? 'bg-white text-black shadow-sm font-bold' : 'bg-[#0C373D] text-white shadow-sm font-bold')
                  : (isDark ? 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
              }`}
            >
              Degree Curricula ({matchedPrograms.length})
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="mt-10 space-y-10">
          
          {/* Universities Results */}
          {(activeFilter === 'ALL' || activeFilter === 'UNIVERSITIES') && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-[#5AA7A7]" />
                <h2 className={`text-xl font-serif font-bold ${
                  isDark ? 'text-white' : 'text-[#0F172A]'
                }`}>
                  Matching Universities ({matchedInstitutions.length})
                </h2>
              </div>

              {matchedInstitutions.length === 0 ? (
                <div className={`p-8 rounded-2xl border text-center text-sm ${
                  isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-white border-slate-200 text-slate-500'
                }`}>
                  No universities match &quot;{query}&quot;.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matchedInstitutions.map((inst) => (
                    <div
                      key={inst.id}
                      onClick={() => onSelectCampus(inst.id)}
                      className={`group rounded-2xl p-6 border transition-all cursor-pointer flex flex-col justify-between ${
                        isDark 
                          ? 'bg-zinc-900 border-zinc-800 hover:border-[#5AA7A7]/50 shadow-none' 
                          : 'bg-white border-[#E2E8F0] hover:border-[#5AA7A7]/50 hover:shadow-md'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <MonogramAvatar code={inst.code} name={inst.nameEn} size="md" />
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                              isDark 
                                ? 'text-teal-400 bg-teal-950/50 border-teal-800/60' 
                                : 'text-[#1E5C64] bg-[#EBF6F6] border-[#5AA7A7]/30'
                            }`}>
                              <CheckCircle2 className="w-3 h-3 text-[#5AA7A7]" /> Verified
                            </span>
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                              isDark 
                                ? 'bg-zinc-800 text-zinc-400 group-hover:text-white group-hover:bg-[#0C373D]' 
                                : 'bg-[#EBF4F7] text-slate-400 group-hover:text-white group-hover:bg-[#0C373D]'
                            }`}>
                              <ArrowUpRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>

                        <h3 className={`font-bold text-base transition-colors mt-4 font-serif ${
                          isDark ? 'text-white group-hover:text-[#5AA7A7]' : 'text-[#0F172A] group-hover:text-[#0C373D]'
                        }`}>
                          {inst.nameEn}
                        </h3>
                        {inst.nameAm && (
                          <p className={`text-xs font-ethiopic mt-0.5 ${
                            isDark ? 'text-zinc-500' : 'text-slate-400'
                          }`}>{inst.nameAm}</p>
                        )}
                        <div className={`flex items-center gap-1 text-xs mt-2 ${
                          isDark ? 'text-zinc-400' : 'text-slate-500'
                        }`}>
                          <MapPin className={`w-3.5 h-3.5 ${isDark ? 'text-zinc-500' : 'text-[#5AA7A7]'}`} />
                          <span>{inst.city}, {inst.region}</span>
                        </div>
                        <p className={`text-xs mt-3 line-clamp-2 leading-relaxed ${
                          isDark ? 'text-zinc-400' : 'text-[#64748B]'
                        }`}>
                          {inst.overview}
                        </p>
                      </div>

                      <div className={`mt-5 pt-4 border-t flex items-center justify-between text-xs ${
                        isDark ? 'border-zinc-800 text-zinc-400' : 'border-slate-100 text-slate-500'
                      }`}>
                        <span>{inst.totalFaculties} Faculties</span>
                        <span>•</span>
                        <span>{inst.totalPrograms} Programs</span>
                        <span>•</span>
                        <span>Est. {inst.establishedYear}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Programs & Cut-Offs Results */}
          {(activeFilter === 'ALL' || activeFilter === 'PROGRAMS') && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-[#5AA7A7]" />
                <h2 className={`text-xl font-serif font-bold ${
                  isDark ? 'text-white' : 'text-[#0F172A]'
                }`}>
                  Matching Degree Programs & Cut-Offs ({matchedPrograms.length})
                </h2>
              </div>

              {matchedPrograms.length === 0 ? (
                <div className={`p-8 rounded-2xl border text-center text-sm ${
                  isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-white border-slate-200 text-slate-500'
                }`}>
                  No degree programs match &quot;{query}&quot;.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matchedPrograms.map((p, idx) => (
                    <div
                      key={idx}
                      onClick={() => onSelectCampus(p.inst.id)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer flex justify-between items-start ${
                        isDark 
                          ? 'bg-zinc-900 border-zinc-800 hover:border-[#5AA7A7]/50 shadow-none' 
                          : 'bg-white border-[#E2E8F0] hover:border-[#5AA7A7]/50 hover:shadow-sm'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            isDark ? 'bg-zinc-800 text-zinc-300 border border-zinc-700' : 'bg-[#EBF6F6] text-[#0C373D]'
                          }`}>
                            {p.inst.code}
                          </span>
                          <span className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{p.inst.nameEn}</span>
                        </div>
                        <h3 className={`font-bold text-sm font-serif ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>{p.programName}</h3>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Stream: {p.stream}</p>
                      </div>

                      <div className="text-right">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                          isDark 
                            ? 'text-teal-300 bg-teal-950/50 border-teal-800/60' 
                            : 'text-[#0C373D] bg-[#EBF6F6] border-[#5AA7A7]/30'
                        }`}>
                          {p.maleCutoff}M / {p.femaleCutoff}F
                        </span>
                        <p className={`text-[10px] mt-1 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>EUEE Cut-off</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
