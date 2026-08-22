import React from 'react';
import Badge from '../common/Badge';

const ProgramCard = ({
  program,
  onSelect,
  onSave,
  isSaved = false,
  className = ''
}) => {
  if (!program) return null;

  const {
    id,
    slug,
    name,
    degree = 'Bachelor',
    studyMode = 'Full-Time',
    department,
    faculty,
    institution,
    duration = '4 Years',
    tuition,
    applicationDeadline,
    careers = []
  } = program;

  const degreeVariants = {
    Bachelor: 'primary',
    Master: 'default',
    PhD: 'info',
    Diploma: 'default'
  };

  const bgImage = id === 'prog-2' ? '/images/ColumbiaUniversity1.jpg' : id === 'prog-3' ? '/images/181005columbia00088_cropped.jpg' : '/images/Butler-Exterior-2-scaled.jpg';

  return (
    <div className={`bg-white border border-slate-200 rounded-2xl shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between h-full group ${className}`}>
      {/* Top Background Photo Header */}
      <div className="h-24 bg-slate-950 relative p-3.5 flex items-end justify-between overflow-hidden">
        <img
          src={bgImage}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 group-hover:opacity-65 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

        <div className="flex items-center gap-1.5 z-10">
          <Badge variant={degreeVariants[degree] || 'primary'} size="sm">
            {degree}
          </Badge>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 backdrop-blur-xs text-white border border-slate-700">
            {studyMode}
          </span>
        </div>

        {onSave && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onSave(program); }}
            className={`p-1.5 rounded-lg text-xs font-medium transition-colors shadow-xs z-10 cursor-pointer ${
              isSaved ? 'text-amber-400 bg-slate-900' : 'text-slate-200 hover:text-white bg-slate-900/70 hover:bg-slate-900'
            }`}
            title={isSaved ? 'Saved' : 'Save program'}
          >
            <svg className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3
            onClick={() => onSelect?.(slug || id || program)}
            className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer leading-snug line-clamp-1 mb-2"
          >
            {name || 'Unnamed Academic Program'}
          </h3>

          <div className="space-y-1 mb-3.5 text-xs text-slate-600">
            {institution && (
              <p className="flex items-center gap-2 font-semibold text-slate-800">
                <svg className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m3-4h1m-1 4h1m-5 8h8" />
                </svg>
                <span className="truncate">{institution}</span>
              </p>
            )}
            {(department || faculty) && (
              <p className="flex items-center gap-2 text-slate-500">
                <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="truncate">{department || faculty}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs mb-3">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Duration</span>
              <span className="font-semibold text-slate-800">{duration}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Tuition</span>
              <span className="font-semibold text-slate-800 truncate block">{tuition || 'Gov Cost-Share'}</span>
            </div>
          </div>

          {careers.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {careers.slice(0, 2).map((career, idx) => (
                <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium border border-slate-200">
                  {typeof career === 'string' ? career : career.title}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs mt-auto">
          {applicationDeadline ? (
            <span className="text-slate-500 text-[11px]">
              Deadline: <span className="font-semibold text-red-600">{applicationDeadline}</span>
            </span>
          ) : (
            <span className="text-slate-400 text-[11px]">Regular Intake</span>
          )}

          <button
            type="button"
            onClick={() => onSelect?.(slug || id || program)}
            className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            Details <span>&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;
