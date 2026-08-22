import React from 'react';

const VerificationStatus = ({
  status = 'Verified Academic Data',
  provider = 'Official Directory',
  className = ''
}) => {
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-[11px] font-medium text-blue-800 shadow-2xs ${className}`}>
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
      </span>
      <span className="font-semibold">{status}</span>
      <span className="text-blue-400 hidden sm:inline">•</span>
      <span className="text-blue-600 text-[10px] hidden sm:inline">{provider}</span>
    </div>
  );
};

export default VerificationStatus;
