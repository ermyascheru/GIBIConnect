import React from 'react';

const Textarea = ({
  id,
  name,
  label,
  placeholder,
  value,
  defaultValue,
  onChange,
  rows = 4,
  maxLength,
  error,
  helperText,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const currentLength = typeof value === 'string' ? value.length : 0;

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      <div className="flex justify-between items-center">
        {label && (
          <label htmlFor={id || name} className="text-sm font-medium text-slate-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        {maxLength && (
          <span className="text-xs text-slate-400">
            {currentLength}/{maxLength}
          </span>
        )}
      </div>
      <textarea
        id={id || name}
        name={name}
        rows={rows}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition-colors outline-none resize-y
          ${error 
            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
            : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
          }
          ${disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200' : ''}
        `}
        {...props}
      />
      {error ? (
        <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-0.5">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Textarea;
