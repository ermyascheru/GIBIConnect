import React from 'react';
import ScholarshipDeadline from './ScholarshipDeadline';
import Badge from '../common/Badge';

const ScholarshipCard = ({
  scholarship,
  onSelect,
  onSave,
  isSaved = false,
  className = ''
}) => {
  if (!scholarship) return null;

  const {
    id,
    slug,
    title,
    coverageType = 'Full Tuition',
    amount,
    provider,
    institution,
    deadline,
    eligibilitySummary,
    targetDegree
  } = scholarship;

  const bgImage = id === 'sch-2' ? '/images/181005columbia00088_cropped.jpg' : id === 'sch-3' ? '/images/ColumbiaUniversity1.jpg' : '/images/Butler-Exterior-2-scaled.jpg';

  return (
    <div className={`bg-white border border-slate-200 rounded-2xl shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between h-full group ${className}`}>
      {/* Top Background Photo Header */}
      <div className="h-24 bg-slate-950 relative p-3.5 flex items-end justify-between overflow-hidden">
        <img
          src={bgImage}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 group-hover:opacity-65 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

        <div className="flex items-center gap-1.5 z-10">
          <Badge variant="primary" size="sm">
            {coverageType}
          </Badge>
          {targetDegree && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 backdrop-blur-xs text-white border border-slate-700">
              {targetDegree}
            </span>
          )}
        </div>

        {onSave && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onSave(scholarship); }}
            className={`p-1.5 rounded-lg text-xs font-medium transition-colors shadow-xs z-10 cursor-pointer ${
              isSaved ? 'text-amber-400 bg-slate-900' : 'text-slate-200 hover:text-white bg-slate-900/70 hover:bg-slate-900'
            }`}
            title={isSaved ? 'Saved' : 'Save scholarship'}
          >
            <svg className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3
            onClick={() => onSelect?.(slug || id || scholarship)}
            className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer leading-snug line-clamp-2 mb-2"
          >
            {title || 'Academic Scholarship Grant'}
          </h3>

          {/* Provider / Institution */}
          <p className="text-xs text-slate-600 mb-3 flex items-center gap-1.5 font-medium">
            <svg className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m3-4h1m-1 4h1m-5 8h8" />
            </svg>
            <span className="truncate">{institution || provider || 'Institutional Scholarship'}</span>
          </p>

          {/* Amount Box */}
          <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-100 text-xs mb-3 flex items-center justify-between">
            <span className="text-blue-800 font-semibold">Grant Value:</span>
            <span className="font-bold text-blue-950 text-right truncate max-w-[65%]">{amount || 'Full Coverage'}</span>
          </div>

          {/* Eligibility summary */}
          {eligibilitySummary && (
            <p className="text-xs text-slate-500 line-clamp-2 mb-3">
              {eligibilitySummary}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs mt-auto">
          <ScholarshipDeadline deadlineDate={deadline} />
          <button
            type="button"
            onClick={() => onSelect?.(slug || id || scholarship)}
            className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            Apply Details <span>&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipCard;
