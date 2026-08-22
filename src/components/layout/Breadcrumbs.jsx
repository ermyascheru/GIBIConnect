import React from 'react';

const Breadcrumbs = ({
  items = [], // [{ label: 'Home', path: '/' }, { label: 'Institutions', path: '/institutions' }, { label: 'Addis Ababa University' }]
  onNavigate,
  className = ''
}) => {
  if (!items.length) return null;

  return (
    <nav className={`flex items-center text-xs text-slate-500 py-2.5 overflow-x-auto ${className}`} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 sm:space-x-2 whitespace-nowrap">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;

          return (
            <li key={idx} className="inline-flex items-center">
              {idx > 0 && (
                <svg className="w-3.5 h-3.5 text-slate-400 mx-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              )}
              {isLast || !item.path ? (
                <span className="font-semibold text-slate-800" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate?.(item.path)}
                  className="hover:text-blue-600 font-medium transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
