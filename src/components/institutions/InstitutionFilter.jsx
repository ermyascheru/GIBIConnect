import React from 'react';
import FilterPanel, { FilterSection, FilterCheckbox } from '../common/FilterPanel';

const InstitutionFilter = ({
  filters = {
    types: [],
    ownerships: [],
    regions: [],
    verifiedOnly: false
  },
  onChange,
  onReset,
  counts = {}
}) => {
  const handleTypeChange = (type) => {
    const next = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    onChange({ ...filters, types: next });
  };

  const handleOwnershipChange = (own) => {
    const next = filters.ownerships.includes(own)
      ? filters.ownerships.filter(o => o !== own)
      : [...filters.ownerships, own];
    onChange({ ...filters, ownerships: next });
  };

  const handleRegionChange = (reg) => {
    const next = filters.regions.includes(reg)
      ? filters.regions.filter(r => r !== reg)
      : [...filters.regions, reg];
    onChange({ ...filters, regions: next });
  };

  const activeCount = 
    filters.types.length + 
    filters.ownerships.length + 
    filters.regions.length + 
    (filters.verifiedOnly ? 1 : 0);

  const regionOptions = [
    { label: 'Addis Ababa', value: 'Addis Ababa' },
    { label: 'Oromia', value: 'Oromia' },
    { label: 'Amhara', value: 'Amhara' },
    { label: 'Sidama', value: 'Sidama' },
    { label: 'Tigray', value: 'Tigray' },
    { label: 'Dire Dawa', value: 'Dire Dawa' },
    { label: 'Harari', value: 'Harari' },
    { label: 'SNNP / South Ethiopia', value: 'South Ethiopia' }
  ];

  return (
    <FilterPanel
      title="Filter Institutions"
      activeFilterCount={activeCount}
      onReset={onReset}
    >
      <FilterSection title="Institution Type" defaultOpen={true}>
        <FilterCheckbox
          id="type-university"
          label="University"
          count={counts.universityCount}
          checked={filters.types.includes('University')}
          onChange={() => handleTypeChange('University')}
        />
        <FilterCheckbox
          id="type-college"
          label="College"
          count={counts.collegeCount}
          checked={filters.types.includes('College')}
          onChange={() => handleTypeChange('College')}
        />
      </FilterSection>

      <FilterSection title="Ownership" defaultOpen={true}>
        <FilterCheckbox
          id="own-public"
          label="Public / Governmental"
          count={counts.publicCount}
          checked={filters.ownerships.includes('Public')}
          onChange={() => handleOwnershipChange('Public')}
        />
        <FilterCheckbox
          id="own-private"
          label="Private / Non-Gov"
          count={counts.privateCount}
          checked={filters.ownerships.includes('Private')}
          onChange={() => handleOwnershipChange('Private')}
        />
      </FilterSection>

      <FilterSection title="Verification" defaultOpen={true}>
        <FilterCheckbox
          id="filter-verified"
          label="Verified Institutions Only"
          checked={filters.verifiedOnly}
          onChange={(e) => onChange({ ...filters, verifiedOnly: e.target.checked })}
        />
      </FilterSection>

      <FilterSection title="Region" defaultOpen={false}>
        {regionOptions.map((reg) => (
          <FilterCheckbox
            key={reg.value}
            id={`reg-${reg.value}`}
            label={reg.label}
            checked={filters.regions.includes(reg.value)}
            onChange={() => handleRegionChange(reg.value)}
          />
        ))}
      </FilterSection>
    </FilterPanel>
  );
};

export default InstitutionFilter;
