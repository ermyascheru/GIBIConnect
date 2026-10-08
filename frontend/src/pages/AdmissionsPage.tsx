import React, { useState } from 'react';
import { CheckCircle2, ShieldAlert, Sparkles, Calculator } from 'lucide-react';
import { ETHIOPIAN_INSTITUTIONS } from '../data/mockInstitutions';

interface AdmissionsPageProps {
  theme?: 'light' | 'dark';
}

export const AdmissionsPage: React.FC<AdmissionsPageProps> = ({ theme = 'light' }) => {
  const isDark = theme === 'dark';
  const [userScore, setUserScore] = useState<string>('');
  const [userGender, setUserGender] = useState<'MALE' | 'FEMALE'>('MALE');

  const scoreNum = parseFloat(userScore) || 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 transition-colors duration-200">
      
      {/* Header */}
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EBF6F6] text-[#1E5C64] border border-[#5AA7A7]/30 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#5AA7A7]" />
          <span>2016/2017 E.C. Matriculation Intelligence</span>
        </div>
        <h1 className={`text-3xl font-serif font-bold ${
          isDark ? 'text-white' : 'text-[#0F172A]'
        }`}>
          Admissions & Matriculation Cut-Off Gateway
        </h1>
        <p className={`mt-2 text-sm leading-relaxed ${
          isDark ? 'text-zinc-400' : 'text-[#64748B]'
        }`}>
          Official entrance exam (EUEE) requirements, gender-specific cut-offs, and eligibility calculation for 2016/2017 E.C.
        </p>
      </div>

      {/* Interactive Score Eligibility Calculator */}
      <div className={`mt-8 rounded-3xl p-8 shadow-md border transition-colors ${
        isDark 
          ? 'bg-gradient-to-r from-zinc-900 to-zinc-950 border-zinc-800 text-white' 
          : 'bg-gradient-to-r from-[#0C373D] via-[#0E444B] to-[#12535C] text-white border-transparent'
      }`}>
        <div className="max-w-xl">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-[#5AA7A7]" />
            <span className="text-xs font-bold text-[#5AA7A7] uppercase tracking-widest">
              Eligibility Calculator
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
            Check Which Programs Match Your EUEE Score
          </h2>
          <p className="text-xs text-white/80 mt-2">
            Enter your national matriculation score to view verified eligible degree programs.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div className="relative flex-1">
              <input
                type="number"
                placeholder="Enter score (e.g. 485)..."
                value={userScore}
                onChange={(e) => setUserScore(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 text-sm focus:outline-none focus:bg-white/20 focus:border-[#5AA7A7]"
              />
            </div>

            <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded-xl border border-white/10">
              <button
                onClick={() => setUserGender('MALE')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  userGender === 'MALE' ? 'bg-[#5AA7A7] text-white shadow-sm font-bold' : 'text-white/80 hover:text-white'
                }`}
              >
                Male
              </button>
              <button
                onClick={() => setUserGender('FEMALE')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  userGender === 'FEMALE' ? 'bg-[#5AA7A7] text-white shadow-sm font-bold' : 'text-white/80 hover:text-white'
                }`}
              >
                Female
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cut-Offs Table View */}
      <div className="mt-12">
        <h3 className={`text-xl font-serif font-bold mb-4 ${
          isDark ? 'text-white' : 'text-[#0F172A]'
        }`}>
          Verified Department Cut-Off Scores (2016/2017 E.C.)
        </h3>

        <div className={`rounded-2xl border shadow-sm overflow-hidden ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-[#E2E8F0]'
        }`}>
          <div className="overflow-x-auto">
            <table className={`w-full text-left text-xs ${
              isDark ? 'text-zinc-300' : 'text-slate-700'
            }`}>
              <thead className={`border-b font-semibold uppercase tracking-wider text-[11px] ${
                isDark 
                  ? 'bg-zinc-950 border-zinc-800 text-zinc-300' 
                  : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'
              }`}>
                <tr>
                  <th className="py-4 px-6">University</th>
                  <th className="py-4 px-6">Program / Major</th>
                  <th className="py-4 px-6">Stream</th>
                  <th className="py-4 px-6">Male Cut-off</th>
                  <th className="py-4 px-6">Female Cut-off</th>
                  <th className="py-4 px-6">Your Status</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-zinc-800' : 'divide-[#E2E8F0]'}`}>
                {ETHIOPIAN_INSTITUTIONS.flatMap((inst) =>
                  (inst.admissions || []).map((adm, i) => {
                    const requiredCutoff = userGender === 'MALE' ? adm.maleCutoff : adm.femaleCutoff;
                    const isEligible = scoreNum > 0 && scoreNum >= requiredCutoff;
                    const isBelow = scoreNum > 0 && scoreNum < requiredCutoff;

                    return (
                      <tr key={`${inst.code}-${i}`} className={`transition-colors ${
                        isDark ? 'hover:bg-zinc-800/50' : 'hover:bg-[#F8FAFC]'
                      }`}>
                        <td className={`py-4 px-6 font-bold flex items-center gap-2 ${
                          isDark ? 'text-white' : 'text-[#0F172A]'
                        }`}>
                          <span className={`w-7 h-7 rounded font-bold flex items-center justify-center text-[10px] ${
                            isDark ? 'bg-zinc-800 text-white border border-zinc-700' : 'bg-[#0C373D] text-[#5AA7A7]'
                          }`}>
                            {inst.code}
                          </span>
                          <span>{inst.nameEn}</span>
                        </td>
                        <td className={`py-4 px-6 font-semibold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>{adm.programName}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-0.5 rounded font-medium ${
                            isDark ? 'bg-zinc-800 text-zinc-300 border border-zinc-700' : 'bg-[#EBF6F6] text-[#1E5C64] border border-[#5AA7A7]/20'
                          }`}>
                            {adm.stream}
                          </span>
                        </td>
                        <td className={`py-4 px-6 font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>{adm.maleCutoff}</td>
                        <td className={`py-4 px-6 font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>{adm.femaleCutoff}</td>
                        <td className="py-4 px-6">
                          {isEligible && (
                            <span className={`inline-flex items-center gap-1 font-bold px-2.5 py-1 rounded-full border ${
                              isDark 
                                ? 'text-teal-400 bg-teal-950/50 border-teal-800/60' 
                                : 'text-[#1E5C64] bg-[#EBF6F6] border-[#5AA7A7]/30'
                            }`}>
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#5AA7A7]" /> Eligible
                            </span>
                          )}
                          {isBelow && (
                            <span className={`inline-flex items-center gap-1 font-bold px-2.5 py-1 rounded-full border ${
                              isDark 
                                ? 'text-rose-400 bg-rose-950/50 border-rose-800/60' 
                                : 'text-rose-700 bg-rose-50 border-rose-200'
                            }`}>
                              <ShieldAlert className="w-3.5 h-3.5" /> -{Math.round(requiredCutoff - scoreNum)} pts
                            </span>
                          )}
                          {!scoreNum && (
                            <span className={isDark ? 'text-zinc-600' : 'text-[#64748B]'}>—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};