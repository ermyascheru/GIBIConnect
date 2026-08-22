import React from 'react';
import SourceReference from './SourceReference';

const AIMessage = ({
  role = 'assistant', // 'assistant' | 'user' | 'system'
  content = '',
  sources = [],
  timestamp,
  onSelectSource,
  className = ''
}) => {
  const isUser = role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-5 ${className}`}>
      <div className={`flex gap-3 max-w-[90%] sm:max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 shadow-xs ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gradient-to-tr from-indigo-600 to-blue-600 text-white'
        }`}>
          {isUser ? 'You' : '✦'}
        </div>

        {/* Bubble */}
        <div className={`rounded-2xl px-4 py-3 shadow-xs ${
          isUser
            ? 'bg-blue-600 text-white rounded-tr-none'
            : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-none'
        }`}>
          <div className="flex items-center justify-between gap-4 mb-1">
            <span className={`text-[11px] font-bold ${isUser ? 'text-blue-100' : 'text-slate-500'}`}>
              {isUser ? 'You' : 'GIBIConnect Academic Consultant'}
            </span>
            {timestamp && (
              <span className={`text-[10px] ${isUser ? 'text-blue-200' : 'text-slate-400'}`}>
                {timestamp}
              </span>
            )}
          </div>

          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {content}
          </div>

          {/* Grounded Database Sources */}
          {sources && sources.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified Sources:
              </p>
              <div className="flex flex-wrap gap-2">
                {sources.map((src, idx) => (
                  <SourceReference
                    key={idx}
                    source={src}
                    onSelect={onSelectSource}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIMessage;
