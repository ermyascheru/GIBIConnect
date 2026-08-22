import React, { useState } from 'react';
import SearchBar from '../components/search/SearchBar';
import ProgramCard from '../components/programs/ProgramCard';
import ProgramDetails from '../components/programs/ProgramDetails';
import ProgramFilter from '../components/programs/ProgramFilter';
import Modal from '../components/common/Modal';

export default function ProgramsPage({
  programs = [],
  onAskAI
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    degrees: [],
    studyModes: []
  });
  const [selectedProgram, setSelectedProgram] = useState(null);

  const filtered = programs.filter(prog => {
    const matchSearch = !searchQuery || 
      prog.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      prog.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.institution.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDegree = filters.degrees.length === 0 || filters.degrees.includes(prog.degree);
    const matchMode = filters.studyModes.length === 0 || filters.studyModes.includes(prog.studyMode);

    return matchSearch && matchDegree && matchMode;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header with Background Photo */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-300 shadow-xl bg-slate-900 text-white p-6 sm:p-10">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <img
            src="/images/ColumbiaUniversity1.jpg"
            alt="University Curricula Background"
            className="w-full h-full object-cover filter brightness-110"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-blue-950/60" />

        <div className="relative z-10 max-w-3xl space-y-2">
          <span className="text-xs uppercase tracking-wider font-bold text-blue-400">Curricula</span>
          <h1 className="text-2xl sm:text-4xl font-black text-white">Academic Degree Programs</h1>
          <p className="text-xs sm:text-sm text-slate-200">
            Search undergraduate bachelor's, postgraduate master's, and doctorate curricula across Ethiopian universities.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <div className="lg:col-span-1">
          <ProgramFilter
            filters={filters}
            onChange={setFilters}
            counts={{
              bachelorCount: programs.filter(p => p.degree === 'Bachelor').length || 18,
              masterCount: programs.filter(p => p.degree === 'Master').length || 8,
              phdCount: 4,
              diplomaCount: 6
            }}
          />
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1 max-w-md">
              <SearchBar
                placeholder="Search by program name, faculty, or university..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
              Showing <strong>{filtered.length}</strong> Degree Programs
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((prog) => (
              <ProgramCard
                key={prog.id}
                program={prog}
                onSelect={() => setSelectedProgram(prog)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Program Details Modal */}
      {selectedProgram && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedProgram(null)}
          title={selectedProgram.name}
          size="xl"
        >
          <ProgramDetails
            program={selectedProgram}
            onAskAI={() => {
              const query = `Tell me about curriculum and career prospects for ${selectedProgram.name} at ${selectedProgram.institution}`;
              setSelectedProgram(null);
              onAskAI(query);
            }}
          />
        </Modal>
      )}
    </div>
  );
}
