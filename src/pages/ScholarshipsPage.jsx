import React, { useState } from 'react';
import SearchBar from '../components/search/SearchBar';
import ScholarshipCard from '../components/scholarships/ScholarshipCard';
import ScholarshipDetails from '../components/scholarships/ScholarshipDetails';
import Modal from '../components/common/Modal';

export default function ScholarshipsPage({
  scholarships = [],
  onAskAI
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCoverage, setSelectedCoverage] = useState('all');
  const [activeScholarship, setActiveScholarship] = useState(null);

  const filtered = scholarships.filter(sch => {
    const matchSearch = !searchQuery || 
      sch.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      sch.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sch.institution.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCoverage = selectedCoverage === 'all' || sch.coverageType === selectedCoverage;

    return matchSearch && matchCoverage;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header with Background Photo */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-300 shadow-xl bg-slate-900 text-white p-6 sm:p-10">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <img
            src="/images/181005columbia00088_cropped.jpg"
            alt="Scholarships Background"
            className="w-full h-full object-cover filter brightness-110"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-blue-950/60" />

        <div className="relative z-10 max-w-3xl space-y-2">
          <span className="text-xs uppercase tracking-wider font-bold text-blue-400">Financial Aid</span>
          <h1 className="text-2xl sm:text-4xl font-black text-white">Higher Education Scholarships & Grants</h1>
          <p className="text-xs sm:text-sm text-slate-200">
            Browse verified tuition waivers, government excellence grants, and university financial aid awards.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <SearchBar
            placeholder="Search by scholarship title or sponsor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Coverage:</span>
          <select
            value={selectedCoverage}
            onChange={(e) => setSelectedCoverage(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="all">All Coverage Types</option>
            <option value="Full Tuition">Full Tuition + Stipend</option>
            <option value="Tuition Waiver">100% Tuition Waiver</option>
            <option value="Partial">Partial Grant</option>
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((sch) => (
          <ScholarshipCard
            key={sch.id}
            scholarship={sch}
            onSelect={() => setActiveScholarship(sch)}
          />
        ))}
      </div>

      {activeScholarship && (
        <Modal
          isOpen={true}
          onClose={() => setActiveScholarship(null)}
          title={activeScholarship.title}
          size="lg"
        >
          <ScholarshipDetails
            scholarship={activeScholarship}
            onApply={() => alert('Direct application dossier generated!')}
            onAskAI={() => {
              const query = `Am I eligible for ${activeScholarship.title}?`;
              setActiveScholarship(null);
              onAskAI(query);
            }}
          />
        </Modal>
      )}
    </div>
  );
}
