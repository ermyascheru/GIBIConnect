import React from 'react';
import ComparisonSelector from '../components/comparison/ComparisonSelector';
import ComparisonTable from '../components/comparison/ComparisonTable';

export default function ComparePage({
  availableInstitutions = [],
  comparisonList = [],
  onAddInstitution,
  onRemoveInstitution,
  onAskAI
}) {
  return (
    <div className="space-y-8 pb-12">
      {/* Header with Background Photo */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-300 shadow-xl bg-slate-900 text-white p-6 sm:p-10">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <img
            src="/images/ColumbiaUniversity1.jpg"
            alt="University Comparison Background"
            className="w-full h-full object-cover filter brightness-110"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-blue-950/60" />

        <div className="relative z-10 max-w-3xl space-y-2">
          <span className="text-xs uppercase tracking-wider font-bold text-blue-400">Comparison Matrix</span>
          <h1 className="text-2xl sm:text-4xl font-black text-white">Compare Higher Education Institutions</h1>
          <p className="text-xs sm:text-sm text-slate-200">
            Select up to 4 universities or colleges to evaluate tuition fees, degree programs, faculty count, and accreditation side-by-side.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <ComparisonSelector
          selectedInstitutions={comparisonList}
          availableInstitutions={availableInstitutions}
          onAddInstitution={onAddInstitution}
          onRemoveInstitution={onRemoveInstitution}
        />

        <ComparisonTable
          institutions={comparisonList}
          onRemoveInstitution={onRemoveInstitution}
          onAskAIComparison={() => {
            const query = `Compare ${comparisonList.map(i => i.name).join(' and ')} in terms of academics, prestige, and campus life`;
            onAskAI(query);
          }}
        />
      </div>
    </div>
  );
}
