import React from 'react';

const SourceReference = ({
  source,
  onSelect,
  className = ''
}) => {
  if (!source) return null;

  const {
    title,
    type = 'Record',
    isVerified = true
  } = source;

  const typeIcons = {
    Institution: '🏛️',
    Program: '🎓',
    Scholarship: '🎁',
    Admission: '📋',
    Tuition: '💵',
    Career: '💼'
  };

  return (
    <div
      onClick={() => onSelect?.(source)}
      className={`inline-flex items-center gap-2 p-2 bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-300 rounded-xl shadow-xs transition-all cursor-pointer text-left group ${className}`}
    >
      <span className="text-sm shrink-0">{typeIcons[type] || '📄'}</span>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 truncate transition-colors">
            {title}
          </span>
          {isVerified && (
            <svg className="w-3 h-3 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-medium">
          {type}
        </span>
      </div>
    </div>
  );
};

export default SourceReference;
