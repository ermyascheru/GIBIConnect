import React, { useState } from 'react';

const RatingInput = ({
  value = 0,
  onChange,
  maxStars = 5,
  size = 'md', // 'sm' | 'md' | 'lg'
  disabled = false,
  label,
  error
}) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
  const activeRating = hoveredRating || value;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {Array.from({ length: maxStars }).map((_, idx) => {
            const starValue = idx + 1;
            const isFilled = starValue <= activeRating;

            return (
              <button
                key={starValue}
                type="button"
                disabled={disabled}
                onClick={() => onChange?.(starValue)}
                onMouseEnter={() => !disabled && setHoveredRating(starValue)}
                onMouseLeave={() => !disabled && setHoveredRating(0)}
                className={`transition-transform duration-100 cursor-pointer ${
                  !disabled ? 'hover:scale-110' : 'cursor-not-allowed'
                } ${isFilled ? 'text-amber-400' : 'text-slate-200'}`}
              >
                <svg className={starSizes[size] || starSizes.md} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            );
          })}
        </div>

        {activeRating > 0 && (
          <span className="text-xs font-semibold text-slate-600 ml-1">
            {labels[activeRating] || `${activeRating} Stars`}
          </span>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default RatingInput;
