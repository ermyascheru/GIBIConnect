import React, { useState } from 'react';
import SearchBar from '../components/search/SearchBar';
import InstitutionCard from '../components/institutions/InstitutionCard';
import InstitutionFilter from '../components/institutions/InstitutionFilter';
import Pagination from '../components/common/Pagination';

export default function InstitutionsPage({
  institutions = [],
  onSelectInstitution,
  onCompare,
  comparedList = []
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    types: [],
    ownerships: [],
    regions: [],
    verifiedOnly: false
  });
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = institutions.filter(inst => {
    const matchSearch = !searchQuery || 
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      inst.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.region.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = filters.types.length === 0 || filters.types.includes(inst.type);
    const matchOwnership = filters.ownerships.length === 0 || filters.ownerships.includes(inst.ownership);
    const matchRegion = filters.regions.length === 0 || filters.regions.includes(inst.region);
    const matchVerified = !filters.verifiedOnly || inst.isVerified;

    return matchSearch && matchType && matchOwnership && matchRegion && matchVerified;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header with Background Image */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-300 shadow-xl bg-slate-900 text-white p-6 sm:p-10">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <img
            src="/images/Butler-Exterior-2-scaled.jpg"
            alt="University Campus Background"
            className="w-full h-full object-cover filter brightness-110"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-blue-950/60" />

        <div className="relative z-10 max-w-3xl space-y-2">
          <span className="text-xs uppercase tracking-wider font-bold text-blue-400">Directory</span>
          <h1 className="text-2xl sm:text-4xl font-black text-white">Higher Education Institutions</h1>
          <p className="text-xs sm:text-sm text-slate-200">
            Browse accredited public universities and private colleges across Ethiopia. Filter by region, ownership, accreditation, and degree offerings.
          </p>
        </div>
      </div>

      {/* Main Grid with Filter Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar Filter */}
        <div className="lg:col-span-1">
          <InstitutionFilter
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters({ types: [], ownerships: [], regions: [], verifiedOnly: false })}
            counts={{
              universityCount: institutions.filter(i => i.type === 'University').length,
              collegeCount: institutions.filter(i => i.type === 'College').length,
              publicCount: institutions.filter(i => i.ownership === 'Public').length,
              privateCount: institutions.filter(i => i.ownership === 'Private').length
            }}
          />
        </div>

        {/* Results Column */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1 max-w-md">
              <SearchBar
                placeholder="Search by institution name or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
              Showing <strong>{filtered.length}</strong> Institutions
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-2">
              <p className="text-base font-bold text-slate-800">No institutions found</p>
              <p className="text-xs text-slate-500">Try adjusting your filters or search keywords.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((inst) => (
                <InstitutionCard
                  key={inst.id}
                  institution={inst}
                  onSelect={() => onSelectInstitution(inst)}
                  onCompare={() => onCompare(inst)}
                  isCompared={comparedList.some(i => i.id === inst.id)}
                />
              ))}
            </div>
          )}

          <div className="pt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filtered.length / 6) || 1}
              totalItems={filtered.length}
              pageSize={6}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
