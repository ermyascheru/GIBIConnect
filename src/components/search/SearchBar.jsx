import React, { useState } from 'react';
import Button from '../common/Button';

const SearchBar = ({
  placeholder = 'Search universities, colleges, programs, scholarships...',
  onSearch,
  value: controlledValue,
  onChange: controlledOnChange,
  showFilterButton = false,
  onToggleFilter,
  isFilterActive = false,
  className = '',
  size = 'md' // 'sm' | 'md' | 'lg'
}) => {
  const [internalValue, setInternalValue] = useState('');
  const isControlled = controlledValue !== undefined;
  const searchTerm = isControlled ? controlledValue : internalValue;

  const handleInputChange = (e) => {
    if (isControlled) {
      controlledOnChange?.(e);
    } else {
      setInternalValue(e.target.value);
    }
  };

  const handleClear = () => {
    if (isControlled) {
      controlledOnChange?.({ target: { value: '' } });
    } else {
      setInternalValue('');
    }
    onSearch?.('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(searchTerm);
  };

  const heightClasses = {
    sm: 'py-2 pl-9 pr-20 text-xs',
    md: 'py-2.5 pl-10 pr-24 text-sm',
    lg: 'py-3.5 pl-12 pr-28 text-base'
  };

  const iconSizes = {
    sm: 'w-4 h-4 left-2.5',
    md: 'w-5 h-5 left-3',
    lg: 'w-6 h-6 left-3.5'
  };

  return (
    <form onSubmit={handleSubmit} className={`relative flex items-center w-full ${className}`}>
      {/* Search Icon */}
      <div className={`absolute text-slate-400 pointer-events-none flex items-center justify-center ${iconSizes[size] || iconSizes.md}`}>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Input */}
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={`w-full bg-white border border-slate-300 rounded-xl text-slate-900 shadow-sm transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${heightClasses[size] || heightClasses.md}`}
      />

      {/* Clear Button */}
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-20 text-slate-400 hover:text-slate-600 p-1 rounded-full transition-colors cursor-pointer"
          title="Clear search"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Filter Action & Submit Action */}
      <div className="absolute right-2 flex items-center gap-1">
        {showFilterButton && (
          <button
            type="button"
            onClick={onToggleFilter}
            className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
              isFilterActive 
                ? 'bg-blue-50 border-blue-200 text-blue-700' 
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            title="Toggle filters"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
        )}
        <Button
          type="submit"
          variant="primary"
          size={size === 'lg' ? 'md' : 'sm'}
          className="rounded-lg shadow-none"
        >
          Search
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
