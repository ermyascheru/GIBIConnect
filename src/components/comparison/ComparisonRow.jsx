import React from 'react';

const ComparisonRow = ({
  label,
  values = [],
  highlightDiff = false,
  className = ''
}) => {
  const uniqueValues = new Set(values.map(v => typeof v === 'object' ? JSON.stringify(v) : v));
  const hasDiff = highlightDiff && uniqueValues.size > 1;

  return (
    <tr className={`border-b border-slate-100 ${hasDiff ? 'bg-amber-50/40' : 'hover:bg-slate-50/50'} ${className}`}>
      <td className="py-3.5 px-4 text-xs font-semibold text-slate-700 w-48 bg-slate-50/80 sticky left-0 z-10 border-r border-slate-200">
        <div className="flex items-center justify-between">
          <span>{label}</span>
          {hasDiff && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Different across institutions" />
          )}
        </div>
      </td>

      {values.map((val, idx) => (
        <td key={idx} className="py-3.5 px-4 text-xs text-slate-800 text-center min-w-[200px]">
          {val !== undefined && val !== null ? (
            typeof val === 'boolean' ? (
              val ? (
                <span className="inline-flex items-center text-emerald-600 font-bold">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Yes
                </span>
              ) : (
                <span className="inline-flex items-center text-slate-400">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  No
                </span>
              )
            ) : (
              val
            )
          ) : (
            <span className="text-slate-400 italic">—</span>
          )}
        </td>
      ))}
    </tr>
  );
};

export default ComparisonRow;
