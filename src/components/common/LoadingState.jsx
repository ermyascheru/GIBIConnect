import React from 'react';

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div
      className={`inline-block rounded-full border-solid border-blue-600 border-r-transparent animate-spin ${sizes[size] || sizes.md} ${className}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

const LoadingState = ({
  message = 'Loading data...',
  description,
  size = 'md',
  fullPage = false,
  className = ''
}) => {
  const content = (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <Spinner size={size} />
      <p className="mt-4 text-sm font-semibold text-slate-700">{message}</p>
      {description && <p className="mt-1 text-xs text-slate-500 max-w-sm">{description}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingState;
