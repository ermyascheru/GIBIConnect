import React from 'react';
import VerificationBadge from './VerificationBadge';

const InstitutionComparisonCard = ({
  institution,
  onRemove,
  className = ''
}) => {
  if (!institution) return null;

  const {
    name,
    type = 'University',
    location,
    city,
    region,
    logoUrl,
    isVerified
  } = institution;

  const displayLocation = location || (city && region ? `${city}, ${region}` : city || region || 'Ethiopia');

  return (
    <div className={`flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl shadow-xs ${className}`}>
      <div className="flex items-center gap-3 min-w-0">
        {logoUrl ? (
          <img src={logoUrl} alt={name} className="w-10 h-10 rounded-lg object-contain bg-slate-50 border border-slate-100 shrink-0" />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-blue-600 text-white font-bold text-base flex items-center justify-center shrink-0">
            {name?.charAt(0) || 'U'}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs font-bold text-slate-900 truncate">{name}</h4>
            <VerificationBadge isVerified={isVerified} />
          </div>
          <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
            <span>{type}</span>
            <span>•</span>
            <span>{displayLocation}</span>
          </p>
        </div>
      </div>

      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(institution)}
          className="text-slate-400 hover:text-red-500 p-1 rounded-md transition-colors cursor-pointer shrink-0 ml-2"
          title="Remove from comparison"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default InstitutionComparisonCard;
