import React, { useState } from 'react';
import RatingInput from './RatingInput';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import Select from '../common/Select';
import Button from '../common/Button';

const ReviewForm = ({
  onSubmit,
  loading = false,
  departments = [],
  institutionName = 'this institution',
  onCancel
}) => {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [department, setDepartment] = useState('');
  const [authorRole, setAuthorRole] = useState('Current Student');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!rating) newErrors.rating = 'Please choose a rating.';
    if (!title.trim()) newErrors.title = 'Review title is required.';
    if (!content.trim() || content.length < 15) {
      newErrors.content = 'Please write at least 15 characters of constructive feedback.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit({
      rating,
      title,
      content,
      department,
      authorRole
    });
  };

  const roleOptions = [
    { label: 'Current Student', value: 'Current Student' },
    { label: 'Alumni / Graduate', value: 'Alumni' },
    { label: 'Academic Staff / Faculty', value: 'Faculty' },
    { label: 'Prospective Student', value: 'Prospective' }
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-base font-bold text-slate-900">Write an Academic Review</h3>
        <p className="text-xs text-slate-500">Share your experience about {institutionName} to help fellow students.</p>
      </div>

      {/* Star Rating */}
      <RatingInput
        label="Overall Rating *"
        value={rating}
        onChange={(val) => { setRating(val); setErrors({ ...errors, rating: null }); }}
        error={errors.rating}
      />

      {/* Role & Department */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Select
          label="Your Affiliation"
          value={authorRole}
          onChange={(e) => setAuthorRole(e.target.value)}
          options={roleOptions}
        />
        {departments.length > 0 ? (
          <Select
            label="Department / Faculty"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            options={departments.map(d => ({ label: d.name || d, value: d.name || d }))}
            placeholder="Select Department"
          />
        ) : (
          <Input
            label="Department / Field of Study"
            placeholder="e.g. Software Engineering"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        )}
      </div>

      {/* Review Title */}
      <Input
        label="Review Headline *"
        placeholder="e.g. Great faculty and campus life, but library gets crowded"
        value={title}
        onChange={(e) => { setTitle(e.target.value); setErrors({ ...errors, title: null }); }}
        error={errors.title}
        required
      />

      {/* Content */}
      <Textarea
        label="Detailed Review *"
        placeholder="Provide balanced feedback on academics, facilities, teachers, and campus environment..."
        rows={4}
        maxLength={1000}
        value={content}
        onChange={(e) => { setContent(e.target.value); setErrors({ ...errors, content: null }); }}
        error={errors.content}
        required
      />

      {/* Note on Moderation */}
      <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-800 flex items-start gap-2">
        <svg className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>All reviews are moderated for community guidelines and verified academic standards before publishing.</span>
      </div>

      {/* Actions */}
      <div className="pt-2 flex items-center justify-end gap-3">
        {onCancel && (
          <Button variant="outline" size="sm" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
        <Button variant="primary" size="sm" type="submit" isLoading={loading}>
          Submit Review
        </Button>
      </div>
    </form>
  );
};

export default ReviewForm;
