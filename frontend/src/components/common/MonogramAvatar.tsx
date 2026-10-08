import React from 'react';

interface MonogramAvatarProps {
  code: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

export const MonogramAvatar: React.FC<MonogramAvatarProps> = ({ code, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-14 h-14 text-sm',
    lg: 'w-20 h-20 text-xl font-bold',
  };

  // Generate deterministic gradient background based on university code
  const getGradient = (text: string) => {
    const gradients = [
      'from-slate-900 to-indigo-900',
      'from-blue-900 to-slate-900',
      'from-emerald-900 to-slate-900',
      'from-violet-900 to-slate-900',
    ];
    const index = text.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br ${getGradient(
        code
      )} flex items-center justify-center text-white font-bold tracking-wider shadow-sm flex-shrink-0 border border-white/10`}
    >
      {code}
    </div>
  );
};