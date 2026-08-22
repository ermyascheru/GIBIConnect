import React from 'react';
import FormError from './FormError';

const FormField = ({
  label,
  id,
  name,
  type = 'text',
  error,
  helperText,
  required = false,
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`mb-4 flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <label htmlFor={id || name} className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {children ? (
        children
      ) : (
        <input
          id={id || name}
          name={name}
          type={type}
          required={required}
          className={`px-3.5 py-2 border rounded-lg shadow-xs outline-none transition-colors text-sm
            ${error 
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
              : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
            }`}
          {...props}
        />
      )}

      {error ? (
        <FormError message={error} />
      ) : helperText ? (
        <p className="text-xs text-slate-500 mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
};

export default FormField;
