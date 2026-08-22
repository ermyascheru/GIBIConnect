import React from 'react';
import VerificationBadge from './VerificationBadge';
import Badge from '../common/Badge';
import Button from '../common/Button';

const InstitutionHeader = ({
  institution,
  onSave,
  isSaved = false,
  onCompare,
  isCompared = false,
  onShare,
  onAskAI
}) => {
  if (!institution) return null;

  const {
    name,
    type = 'University',
    ownership = 'Public',
    isVerified = false,
    city,
    region,
    location,
    establishedYear,
    website,
    email,
    phone,
    logoUrl,
    coverUrl,
    accreditationStatus
  } = institution;

  const displayLocation = location || (city && region ? `${city}, ${region}` : city || region || 'Ethiopia');

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
      {/* Banner / Cover */}
      <div className="h-44 sm:h-56 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 relative">
        {coverUrl && (
          <img
            src={coverUrl}
            alt={`${name} cover`}
            className="w-full h-full object-cover opacity-40"
          />
        )}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {onShare && (
            <button
              type="button"
              onClick={onShare}
              className="p-2 rounded-lg bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs transition-colors cursor-pointer"
              title="Share institution"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          )}
          {onSave && (
            <button
              type="button"
              onClick={onSave}
              className={`p-2 rounded-lg backdrop-blur-xs transition-colors cursor-pointer ${
                isSaved ? 'bg-amber-500 text-white' : 'bg-black/40 hover:bg-black/60 text-white'
              }`}
              title={isSaved ? 'Saved' : 'Save Institution'}
            >
              <svg className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Main Info section */}
      <div className="px-6 pb-6 pt-0 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-4">
          {/* Logo + Basic Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="relative">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={`${name} logo`}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-contain bg-white p-2 shadow-lg border-4 border-white"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-3xl shadow-lg border-4 border-white">
                  {name?.charAt(0) || 'U'}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">{name}</h1>
                <VerificationBadge isVerified={isVerified} />
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <Badge variant={type === 'University' ? 'primary' : 'purple'} size="sm">
                  {type}
                </Badge>
                <Badge variant={ownership === 'Public' ? 'default' : 'info'} size="sm">
                  {ownership}
                </Badge>
                {accreditationStatus && (
                  <Badge variant="success" size="sm">
                    {accreditationStatus}
                  </Badge>
                )}
                <span>•</span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {displayLocation}
                </span>
                {establishedYear && (
                  <>
                    <span>•</span>
                    <span>Est. {establishedYear}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
            {onAskAI && (
              <Button
                variant="primary"
                size="sm"
                onClick={onAskAI}
                leftIcon={
                  <svg className="w-4 h-4 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                }
              >
                Ask AI About This Institution
              </Button>
            )}
            {onCompare && (
              <Button
                variant={isCompared ? 'secondary' : 'outline'}
                size="sm"
                onClick={onCompare}
              >
                {isCompared ? 'In Compare List' : 'Compare'}
              </Button>
            )}
          </div>
        </div>

        {/* Contact info bar */}
        {(website || email || phone) && (
          <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
            {website && (
              <a
                href={website.startsWith('http') ? website : `https://${website}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:underline"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                {website.replace(/^https?:\/\//, '')}
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} className="flex items-center gap-1 hover:text-slate-900">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {email}
              </a>
            )}
            {phone && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {phone}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstitutionHeader;
