import React from 'react';
import FilterPanel, { FilterSection, FilterCheckbox } from '../common/FilterPanel';

const ProgramFilter = ({
  filters = {
    degrees: [], // 'Bachelor', 'Master', 'PhD', 'Diploma'
    studyModes: [], // 'Full-Time', 'Extension', 'Weekend'
    durations: []
  },
  onChange,
  onReset,
  counts = {}
}) => {
  const handleDegreeChange = (deg) => {
    const next = filters.degrees.includes(deg)
      ? filters.degrees.filter(d => d !== deg)
      : [...filters.degrees, deg];
    onChange({ ...filters, degrees: next });
  };

  const handleStudyModeChange = (mode) => {
    const next = filters.studyModes.includes(mode)
      ? filters.studyModes.filter(m => m !== mode)
      : [...filters.studyModes, mode];
    onChange({ ...filters, studyModes: next });
  };

  const activeCount = (filters.degrees?.length || 0) + (filters.studyModes?.length || 0);

  return (
    <FilterPanel
      title="Filter Programs"
      activeFilterCount={activeCount}
      onReset={onReset}
    >
      {/* Degree Level */}
      <FilterSection title="Degree Level" defaultOpen={true}>
        <FilterCheckbox
          id="deg-bachelor"
          label="Bachelor's Degree"
          count={counts.bachelorCount}
          checked={filters.degrees.includes('Bachelor')}
          onChange={() => handleDegreeChange('Bachelor')}
        />
        <FilterCheckbox
          id="deg-master"
          label="Master's Degree"
          count={counts.masterCount}
          checked={filters.degrees.includes('Master')}
          onChange={() => handleDegreeChange('Master')}
        />
        <FilterCheckbox
          id="deg-phd"
          label="Doctorate / PhD"
          count={counts.phdCount}
          checked={filters.degrees.includes('PhD')}
          onChange={() => handleDegreeChange('PhD')}
        />
        <FilterCheckbox
          id="deg-diploma"
          label="Diploma / TVET"
          count={counts.diplomaCount}
          checked={filters.degrees.includes('Diploma')}
          onChange={() => handleDegreeChange('Diploma')}
        />
      </FilterSection>

      {/* Study Mode */}
      <FilterSection title="Study Mode" defaultOpen={true}>
        <FilterCheckbox
          id="mode-fulltime"
          label="Full-Time (Regular)"
          checked={filters.studyModes.includes('Full-Time')}
          onChange={() => handleStudyModeChange('Full-Time')}
        />
        <FilterCheckbox
          id="mode-extension"
          label="Extension (Evening)"
          checked={filters.studyModes.includes('Extension')}
          onChange={() => handleStudyModeChange('Extension')}
        />
        <FilterCheckbox
          id="mode-weekend"
          label="Weekend / Summer"
          checked={filters.studyModes.includes('Weekend')}
          onChange={() => handleStudyModeChange('Weekend')}
        />
      </FilterSection>
    </FilterPanel>
  );
};

export default ProgramFilter;
