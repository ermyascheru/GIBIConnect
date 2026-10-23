import React, { useState } from 'react';

interface MonogramAvatarProps {
  code?: string;
  name?: string;
  logoUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const KNOWN_UNIVERSITY_LOGOS: Record<string, string> = {
  AAU: '/images/logos/aau-logo.jpg',
  ASTU: '/images/logos/astu-logo.jpg',
  AASTU: '/images/logos/aastu-logo.jpg',
  BDU: '/images/logos/bdu-logo.jpg',
  JU: '/images/logos/ju-logo.jpg',
  HU: '/images/logos/hu-logo.jpg',
  MU: '/images/logos/mu-logo.jpg',
  UOG: '/images/logos/uog-logo.jpg',
  AMU: '/images/logos/amu-logo.jpg',
  HRU: '/images/logos/hru-logo.jpg',
  DU: '/images/logos/du-logo.jpg',
  DMU: '/images/logos/dmu-logo.jpg',
  DBU: '/images/logos/dbu-logo.jpg',
  WSU: '/images/logos/wsu-logo.jpg',
  WKU: '/images/logos/wku-logo.jpg',
  WCU: '/images/logos/wku-logo.jpg',
  SMU: '/images/logos/smu-logo.jpg',
  AMBO: '/images/logos/ambo-logo.jpg',
  DDU: '/images/logos/ddu-logo.jpg',
  AAMC: '/images/logos/aau-medical-logo.jpg',
  'AAU-CHS': '/images/logos/aau-medical-logo.jpg',
};

export const MonogramAvatar: React.FC<MonogramAvatarProps> = ({ 
  code = '', 
  name = '', 
  logoUrl,
  size = 'md' 
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  const sizeClasses = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-14 h-14 text-sm',
    lg: 'w-20 h-20 text-xl font-bold',
    xl: 'w-24 h-24 text-2xl font-bold',
  };

  const displayText = (code || name || 'UNI').trim().slice(0, 5).toUpperCase();
  const normalizedCode = code ? code.trim().toUpperCase() : displayText;

  // Resolve logo from direct prop or known logo registry
  const resolvedLogo = logoUrl || KNOWN_UNIVERSITY_LOGOS[normalizedCode];

  // Generate deterministic gradient background based on university code if logo missing
  const getGradient = (text: string) => {
    const gradients = [
      'from-slate-900 to-indigo-900',
      'from-blue-900 to-slate-900',
      'from-emerald-900 to-slate-900',
      'from-violet-900 to-slate-900',
    ];
    if (!text || text.length === 0) return gradients[0];
    const index = text.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  if (resolvedLogo && !imgFailed) {
    return (
      <div className={`${sizeClasses[size]} rounded-2xl p-1.5 bg-white border border-slate-200 shadow-sm flex items-center justify-center flex-shrink-0 overflow-hidden ring-1 ring-slate-100`}>
        <img
          src={resolvedLogo}
          alt={name ? `${name} emblem` : `${displayText} emblem`}
          onError={() => setImgFailed(true)}
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  return (
    <div 
      className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br ${getGradient(displayText)} text-white flex items-center justify-center font-bold tracking-wider flex-shrink-0 shadow-sm border border-white/20 select-none`}
      title={name || displayText}
    >
      <span>{displayText}</span>
    </div>
  );
};
