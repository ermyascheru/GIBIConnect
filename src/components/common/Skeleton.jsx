import React from 'react';

export const Skeleton = ({
  className = '',
  variant = 'text', // 'text' | 'circular' | 'rectangular' | 'card'
  width,
  height
}) => {
  const baseClasses = 'animate-pulse bg-slate-200';

  if (variant === 'circular') {
    return (
      <div
        className={`rounded-full ${baseClasses} ${className}`}
        style={{ width, height }}
      />
    );
  }

  if (variant === 'card') {
    return (
      <div className={`rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm ${className}`}>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-lg ${baseClasses}`} />
          <div className="space-y-2 flex-1">
            <div className={`h-4 w-3/4 rounded ${baseClasses}`} />
            <div className={`h-3 w-1/2 rounded ${baseClasses}`} />
          </div>
        </div>
        <div className="space-y-2 pt-2">
          <div className={`h-3 w-full rounded ${baseClasses}`} />
          <div className={`h-3 w-5/6 rounded ${baseClasses}`} />
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-slate-100">
          <div className={`h-3 w-24 rounded ${baseClasses}`} />
          <div className={`h-8 w-20 rounded-md ${baseClasses}`} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded ${baseClasses} ${className}`}
      style={{ width, height }}
    />
  );
};

export const SkeletonList = ({ count = 3, variant = 'card', className = '' }) => {
  return (
    <div className={`grid gap-4 ${className}`}>
      {Array.from({ length: count }).map((_, idx) => (
        <Skeleton key={idx} variant={variant} />
      ))}
    </div>
  );
};

export default Skeleton;
