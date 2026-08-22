import React, { useState } from 'react';
import InstitutionComparisonCard from '../institutions/InstitutionComparisonCard';
import Button from '../common/Button';
import SearchBar from '../search/SearchBar';

const ComparisonSelector = ({
  selectedInstitutions = [],
  availableInstitutions = [],
  onAddInstitution,
  onRemoveInstitution,
  onStartComparison,
  maxAllowed = 4
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInstitutions = availableInstitutions.filter(inst => {
    const isAlreadySelected = selectedInstitutions.some(s => s.id === inst.id || s.slug === inst.slug);
    const matchesSearch = inst.name.toLowerCase().includes(searchTerm.toLowerCase());
    return !isAlreadySelected && matchesSearch;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Compare Higher Education Institutions</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select 2 to 4 universities or colleges to compare academics, fees, admission standards, and facilities.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">
            {selectedInstitutions.length} / {maxAllowed} selected
          </span>
          <Button
            variant="primary"
            size="sm"
            disabled={selectedInstitutions.length < 2}
            onClick={onStartComparison}
          >
            Compare Now ({selectedInstitutions.length})
          </Button>
        </div>
      </div>

      {/* Selected Items Tray */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {selectedInstitutions.map((inst, idx) => (
          <InstitutionComparisonCard
            key={idx}
            institution={inst}
            onRemove={() => onRemoveInstitution(inst)}
          />
        ))}

        {/* Empty placeholder slots up to max */}
        {Array.from({ length: maxAllowed - selectedInstitutions.length }).map((_, idx) => (
          <div
            key={`empty-${idx}`}
            className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center text-slate-400 min-h-[76px]"
          >
            <span className="text-xs font-medium">+ Add Institution</span>
          </div>
        ))}
      </div>

      {/* Available picker search if under max */}
      {selectedInstitutions.length < maxAllowed && (
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Add an Institution to Comparison
          </h3>
          <SearchBar
            size="sm"
            placeholder="Search universities or colleges to add..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {filteredInstitutions.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pt-2">
              {filteredInstitutions.slice(0, 6).map((inst) => (
                <div
                  key={inst.id || inst.slug}
                  onClick={() => onAddInstitution(inst)}
                  className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="truncate mr-2">
                    <p className="text-xs font-bold text-slate-800 truncate">{inst.name}</p>
                    <p className="text-[10px] text-slate-500">{inst.type} • {inst.location || inst.city}</p>
                  </div>
                  <span className="text-xs font-bold text-blue-600 shrink-0">+ Add</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComparisonSelector;
