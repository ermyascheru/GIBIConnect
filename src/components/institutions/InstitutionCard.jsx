import React from 'react';
import VerificationBadge from './VerificationBadge';
import Badge from '../common/Badge';

const InstitutionCard = ({
  institution,
  onSelect,
  onSave,
  isSaved = false,
  onCompare,
  isCompared = false,
  className = ''
}) => {
  if (!institution) return null;

  const {
    id,
    slug,
    name,
    location,
    city,
    region,
    type = 'University',
    ownership = 'Public',
    isVerified = false,
    description,
    logoUrl,
    coverUrl,
    programsCount,
    establishedYear,
    rating
  } = institution;

  const displayLocation = location || (city && region ? `${city}, ${region}` : city || region || 'Ethiopia');
  const backgroundPhoto = coverUrl || (id === '2' ? '/images/181005columbia00088_cropped.jpg' : id === '3' ? '/images/ColumbiaUniversity1.jpg' : '/images/Butler-Exterior-2-scaled.jpg');

  return (
    <div className={`bg-white border border-slate-200 rounded-2xl shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full group ${className}`}>
      {/* Cover / Background Photo Banner Top */}
      <div className="h-32 bg-slate-950 relative p-4 flex items-end justify-between overflow-hidden">
        <img
          src={backgroundPhoto}
          alt={`${name} campus`}
          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-75 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <Badge variant={type === 'University' ? 'primary' : 'purple'} size="sm">
            {type}
          </Badge>
          <Badge variant={ownership === 'Public' ? 'default' : 'info'} size="sm">
            {ownership}
          </Badge>
        </div>

        {/* Quick action buttons (Save / Compare) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {onCompare && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onCompare(institution); }}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors shadow-xs cursor-pointer ${
                isCompared 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-900/80 backdrop-blur-xs text-white hover:bg-slate-900'
              }`}
              title={isCompared ? 'Remove from comparison' : 'Compare institution'}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </button>
          )}

          {onSave && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onSave(institution); }}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors shadow-xs cursor-pointer ${
                isSaved 
                  ? 'bg-amber-500 text-white' 
                  : 'bg-slate-900/80 backdrop-blur-xs text-white hover:bg-slate-900'
              }`}
              title={isSaved ? 'Saved to bookmarks' : 'Save institution'}
            >
              <svg className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          )}
        </div>

        {/* Logo overlapping banner */}
        <div className="relative -mb-6 z-10">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`${name} logo`}
              className="w-14 h-14 rounded-xl object-contain bg-white shadow-md border-2 border-white"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-blue-600 text-white border-2 border-white flex items-center justify-center font-black text-xl shadow-md">
              {name?.charAt(0) || 'U'}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-8 px-5 pb-5 flex-1 flex flex-col bg-white">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3
            onClick={() => onSelect?.(slug || id || institution)}
            className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer leading-snug line-clamp-1"
          >
            {name || 'Unnamed Institution'}
          </h3>
          <VerificationBadge isVerified={isVerified} />
        </div>

        <p className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{displayLocation}</span>
          {establishedYear && (
            <>
              <span>•</span>
              <span>Est. {establishedYear}</span>
            </>
          )}
        </p>

        <p className="text-xs text-slate-600 line-clamp-2 mb-4 flex-1 leading-relaxed">
          {description || 'Comprehensive higher educational institution offering accredited academic undergraduate and postgraduate programs.'}
        </p>

        {/* Footer info bar */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            {programsCount !== undefined ? (
              <span className="font-medium text-slate-700 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {programsCount} Programs
              </span>
            ) : (
              <span>Programs available</span>
            )}
            {rating && (
              <span className="flex items-center gap-1 text-amber-600 font-semibold">
                ★ {rating}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => onSelect?.(slug || id || institution)}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            Explore <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstitutionCard;
