import React from 'react';

const ScholarshipEligibility = ({
  criteria = [], // ['Minimum CGPA 3.5', 'Ethiopian Citizen', 'Undergraduate Enrolled']
  className = ''
}) => {
  if (!criteria || criteria.length === 0) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
        Eligibility Criteria
      </h4>
      <ul className="space-y-1.5 text-xs text-slate-600">
        {criteria.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <svg className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <span>{typeof item === 'string' ? item : item.criterion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScholarshipEligibility;
