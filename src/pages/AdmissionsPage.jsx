import React, { useState } from 'react';
import SearchBar from '../components/search/SearchBar';
import Button from '../components/common/Button';

const ADMISSIONS_LIST = [
  {
    id: 'aau-undergrad-2026',
    title: 'Addis Ababa University — Regular Undergraduate Admissions',
    institution: 'Addis Ababa University',
    city: 'Addis Ababa',
    degree: 'Bachelor',
    mode: 'Regular',
    year: '2026 / 2027',
    deadline: 'October 15, 2026',
    cutoff: 'National Entrance Exam Score ≥ 380 (Natural) / 365 (Social)',
    tuition: 'Government Cost Sharing'
  },
  {
    id: 'astu-engineering-2026',
    title: 'Adama Science & Technology University — Engineering & STEM Intake',
    institution: 'Adama Science & Technology University',
    city: 'Adama',
    degree: 'Bachelor',
    mode: 'Regular',
    year: '2026 / 2027',
    deadline: 'September 28, 2026',
    cutoff: 'National STEM Cutoff ≥ 410 + ASTU Institutional Aptitude Exam',
    tuition: 'Government Cost Sharing'
  },
  {
    id: 'unity-computing-2026',
    title: 'Unity University — Computing & Business Degree Admissions',
    institution: 'Unity University',
    city: 'Addis Ababa',
    degree: 'Bachelor',
    mode: 'Regular',
    year: '2026 / 2027',
    deadline: 'November 05, 2026',
    cutoff: 'National Exam Pass Mark or Diploma Equivalent Transfer',
    tuition: '4,200 ETB per credit hour'
  }
];

export default function AdmissionsPage({ onAskAI }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = ADMISSIONS_LIST.filter(adm => 
    !searchQuery || 
    adm.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    adm.institution.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header with Background Photo */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-300 shadow-xl bg-slate-900 text-white p-6 sm:p-10">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <img
            src="/images/Butler-Exterior-2-scaled.jpg"
            alt="University Admissions Background"
            className="w-full h-full object-cover filter brightness-110"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-blue-950/60" />

        <div className="relative z-10 max-w-3xl space-y-2">
          <span className="text-xs uppercase tracking-wider font-bold text-blue-400">Admissions</span>
          <h1 className="text-2xl sm:text-4xl font-black text-white">University Admissions & Cutoff Scores</h1>
          <p className="text-xs sm:text-sm text-slate-200">
            Find official admission requirements, entrance examination cutoffs, registration timelines, and application procedures.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <SearchBar
            placeholder="Search admissions by university or program..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
          Showing <strong>{filtered.length}</strong> Admissions
        </span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(adm => (
          <div key={adm.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">{adm.degree}</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">{adm.mode}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">{adm.title}</h3>
              <p className="text-xs text-slate-500">{adm.institution} • {adm.city}</p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5 mt-3">
                <p className="text-slate-600"><span className="font-semibold text-slate-800">Cutoff:</span> {adm.cutoff}</p>
                <p className="text-slate-600"><span className="font-semibold text-slate-800">Deadline:</span> <span className="text-red-600 font-bold">{adm.deadline}</span></p>
                <p className="text-slate-600"><span className="font-semibold text-slate-800">Tuition:</span> {adm.tuition}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Year {adm.year}</span>
              <Button variant="primary" size="sm" onClick={() => onAskAI(`What are the full admission requirements and procedure for ${adm.institution}?`)}>
                Ask AI About Cutoffs
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
