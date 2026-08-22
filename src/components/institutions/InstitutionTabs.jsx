import React from 'react';
import Tabs from '../common/Tabs';

const InstitutionTabs = ({
  activeTab = 'overview',
  onChange,
  counts = {} // { programs: 24, admissions: 3, scholarships: 5, facilities: 12, reviews: 18 }
}) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: '🏛️' },
    { id: 'departments', label: 'Faculties & Depts', count: counts.departments, icon: '🏢' },
    { id: 'programs', label: 'Programs', count: counts.programs, icon: '🎓' },
    { id: 'admissions', label: 'Admissions', count: counts.admissions, icon: '📋' },
    { id: 'tuition', label: 'Tuition & Fees', icon: '💵' },
    { id: 'scholarships', label: 'Scholarships', count: counts.scholarships, icon: '🎁' },
    { id: 'facilities', label: 'Campus Facilities', count: counts.facilities, icon: '🏋️' },
    { id: 'reviews', label: 'Reviews', count: counts.reviews, icon: '⭐' },
    { id: 'news', label: 'News & Events', count: counts.news, icon: '📰' },
    { id: 'location', label: 'Location & Map', icon: '📍' }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 px-4 py-1 shadow-xs mb-6 overflow-x-auto">
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={onChange}
        variant="underline"
      />
    </div>
  );
};

export default InstitutionTabs;
