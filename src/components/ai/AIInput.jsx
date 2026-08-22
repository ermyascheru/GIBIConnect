import React, { useState } from 'react';
import Button from '../common/Button';

const AIInput = ({
  onSend,
  disabled = false,
  suggestions = [],
  placeholder = 'Ask anything about Ethiopian universities, colleges, cutoffs, tuition, or scholarships...'
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (!disabled) {
      onSend(suggestion);
    }
  };

  return (
    <div className="bg-white border-t border-slate-200 p-4 space-y-3">
      {/* Suggestions Pills */}
      {suggestions && suggestions.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Try asking:</span>
          {suggestions.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSuggestionClick(item)}
              disabled={disabled}
              className="px-3 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-xs shrink-0 transition-colors border border-slate-200/60 cursor-pointer disabled:opacity-50"
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={disabled}
            placeholder={placeholder}
            className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all disabled:opacity-60"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={!input.trim() || disabled}
          rightIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          }
        >
          Ask
        </Button>
      </form>
    </div>
  );
};

export default AIInput;
