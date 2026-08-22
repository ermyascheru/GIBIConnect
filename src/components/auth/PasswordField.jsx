import React, { useState } from 'react';

const PasswordField = ({
  label = 'Password',
  id = 'password',
  name = 'password',
  value,
  onChange,
  error,
  required = false,
  placeholder = '••••••••',
  showStrength = false,
  className = ''
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const getStrength = (pass = '') => {
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = showStrength ? getStrength(value) : 0;
  const strengthLabels = ['Too Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const strengthColors = ['bg-red-400', 'bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <label htmlFor={id || name} className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        <input
          id={id || name}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full rounded-lg border bg-white px-3.5 py-2 pr-12 text-sm text-slate-900 shadow-sm transition-colors outline-none
            ${error 
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
              : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
            }
          `}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors p-1 cursor-pointer"
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>

      {showStrength && value && (
        <div className="mt-1.5 space-y-1">
          <div className="grid grid-cols-4 gap-1 h-1">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className={`rounded-full h-full transition-colors ${
                  idx < strength ? strengthColors[strength] : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">
            Strength: {strengthLabels[strength]}
          </span>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-600 font-medium mt-0.5">{error}</p>
      )}
    </div>
  );
};

export default PasswordField;
