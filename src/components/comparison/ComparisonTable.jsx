import React, { useState } from 'react';
import ComparisonRow from './ComparisonRow';
import VerificationBadge from '../institutions/VerificationBadge';
import Button from '../common/Button';

const ComparisonTable = ({
  institutions = [],
  onRemoveInstitution,
  onAddMore,
  onAskAIComparison
}) => {
  const [highlightDiffs, setHighlightDiffs] = useState(true);

  if (institutions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <p className="text-sm text-slate-500 mb-4">No institutions selected for comparison.</p>
        {onAddMore && (
          <Button variant="primary" size="sm" onClick={onAddMore}>
            Add Institutions to Compare
          </Button>
        )}
      </div>
    );
  }

  const comparisonSections = [
    {
      title: 'General Information',
      rows: [
        { label: 'Institution Type', values: institutions.map(i => i.type || 'University') },
        { label: 'Ownership', values: institutions.map(i => i.ownership || 'Public') },
        { label: 'Location', values: institutions.map(i => i.location || i.city || 'Ethiopia') },
        { label: 'Established Year', values: institutions.map(i => i.establishedYear || 'N/A') },
        { label: 'Official Verification', values: institutions.map(i => i.isVerified) },
        { label: 'Accreditation', values: institutions.map(i => i.accreditationStatus || 'Accredited') },
      ]
    },
    {
      title: 'Academics & Admissions',
      rows: [
        { label: 'Total Programs Offered', values: institutions.map(i => i.programsCount ? `${i.programsCount} Programs` : '100+') },
        { label: 'Average Tuition / Year', values: institutions.map(i => i.averageTuition || 'Gov Scale / Varies') },
        { label: 'Faculty Count', values: institutions.map(i => i.facultyCount ? `${i.facultyCount} Academic Staff` : 'N/A') },
        { label: 'Student Body', values: institutions.map(i => i.studentEnrollment ? `${Number(i.studentEnrollment).toLocaleString()} Students` : 'N/A') },
        { label: 'Entrance Exam Required', values: institutions.map(i => i.requiresEntranceExam ?? true) },
      ]
    },
    {
      title: 'Campus & Facilities',
      rows: [
        { label: 'Student Dormitory Housing', values: institutions.map(i => i.hasDormitory ?? true) },
        { label: 'Digital Library & Research', values: institutions.map(i => i.hasDigitalLibrary ?? true) },
        { label: 'Sports & Recreational', values: institutions.map(i => i.hasSportsComplex ?? true) },
        { label: 'Internet / Wi-Fi Coverage', values: institutions.map(i => i.hasCampusWifi ?? true) },
      ]
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Comparing {institutions.length} Institutions (Max 4)
          </span>
          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={highlightDiffs}
              onChange={(e) => setHighlightDiffs(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
            />
            <span>Highlight Differences</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          {onAskAIComparison && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onAskAIComparison(institutions)}
              leftIcon={
                <svg className="w-3.5 h-3.5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            >
              AI Comparison Summary
            </Button>
          )}
          {institutions.length < 4 && onAddMore && (
            <Button variant="outline" size="sm" onClick={onAddMore}>
              + Add Another
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-white">
              <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-48 bg-slate-50 sticky left-0 z-20 border-r border-slate-200">
                Institution
              </th>
              {institutions.map((inst, idx) => (
                <th key={idx} className="py-4 px-4 min-w-[220px] text-center align-top relative">
                  {onRemoveInstitution && (
                    <button
                      type="button"
                      onClick={() => onRemoveInstitution(inst)}
                      className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1 rounded transition-colors cursor-pointer"
                      title="Remove from comparison"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}

                  <div className="flex flex-col items-center">
                    {inst.logoUrl ? (
                      <img src={inst.logoUrl} alt={inst.name} className="w-12 h-12 rounded-xl object-contain bg-slate-50 border border-slate-100 mb-2 p-1" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-black text-xl flex items-center justify-center mb-2 shadow-xs">
                        {inst.name?.charAt(0) || 'U'}
                      </div>
                    )}
                    <h3 className="text-sm font-bold text-slate-900 leading-tight mb-1 text-center line-clamp-2">
                      {inst.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <VerificationBadge isVerified={inst.isVerified} />
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {comparisonSections.map((sec, secIdx) => (
              <React.Fragment key={secIdx}>
                <tr className="bg-slate-100/80 border-y border-slate-200">
                  <td colSpan={institutions.length + 1} className="py-2 px-4 text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {sec.title}
                  </td>
                </tr>
                {sec.rows.map((row, rIdx) => (
                  <ComparisonRow
                    key={rIdx}
                    label={row.label}
                    values={row.values}
                    highlightDiff={highlightDiffs}
                  />
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonTable;
