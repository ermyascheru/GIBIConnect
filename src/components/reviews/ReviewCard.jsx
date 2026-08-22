import React from 'react';
import ModerationStatus from './ModerationStatus';

const ReviewCard = ({
  review,
  onHelpfulVote,
  onReport,
  className = ''
}) => {
  if (!review) return null;

  const {
    authorName = 'Anonymous Student',
    authorAvatar,
    authorRole = 'Alumni / Student',
    rating = 5,
    title,
    content,
    date = 'Recently',
    department,
    institution,
    helpfulCount = 0,
    isHelpful = false,
    moderationStatus = 'Approved'
  } = review;

  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {authorAvatar ? (
            <img src={authorAvatar} alt={authorName} className="w-10 h-10 rounded-full object-cover border border-slate-100" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center border border-blue-200">
              {authorName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-slate-900">{authorName}</h4>
              <ModerationStatus status={moderationStatus} />
            </div>
            <p className="text-[11px] text-slate-500">
              {authorRole} {department ? `• ${department}` : ''} {institution ? `@ ${institution}` : ''}
            </p>
          </div>
        </div>

        <span className="text-[11px] text-slate-400">{date}</span>
      </div>

      {/* Rating & Review Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="flex text-amber-400 text-xs">
            {Array.from({ length: 5 }).map((_, idx) => (
              <span key={idx} className={idx < rating ? 'text-amber-400' : 'text-slate-200'}>
                ★
              </span>
            ))}
          </div>
          <span className="text-xs font-bold text-slate-800">{rating}.0</span>
        </div>
        {title && <h5 className="text-sm font-bold text-slate-900">{title}</h5>}
      </div>

      {/* Review Content */}
      <p className="text-xs text-slate-600 leading-relaxed">
        {content}
      </p>

      {/* Footer / Helpful vote */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <button
          type="button"
          onClick={() => onHelpfulVote?.(review)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
            isHelpful ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:bg-slate-50 text-slate-600'
          }`}
        >
          <svg className="w-3.5 h-3.5" fill={isHelpful ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          Helpful ({helpfulCount})
        </button>

        {onReport && (
          <button
            type="button"
            onClick={() => onReport(review)}
            className="text-[11px] text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
          >
            Report
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
