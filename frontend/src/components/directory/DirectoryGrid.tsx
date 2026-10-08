import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { ETHIOPIAN_INSTITUTIONS } from '../../data/mockInstitutions';
import { InstitutionCard } from './InstitutionCard';

const REGIONS = ['All', 'Addis Ababa', 'Oromia', 'Amhara', 'Tigray', 'Sidama'] as const;

interface DirectoryGridProps {
  onSelectCampus?: (id: string) => void;
  theme?: 'light' | 'dark';
}

export const DirectoryGrid: React.FC<DirectoryGridProps> = ({ onSelectCampus, theme = 'light' }) => {
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedOwnership, setSelectedOwnership] = useState<'ALL' | 'PUBLIC' | 'PRIVATE'>('ALL');

  const filteredInstitutions = useMemo(() => {
    return ETHIOPIAN_INSTITUTIONS.filter((inst) => {
      const matchesSearch =
        inst.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.city.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRegion = selectedRegion === 'All' || inst.region === selectedRegion;
      const matchesOwnership = selectedOwnership === 'ALL' || inst.ownership === selectedOwnership;

      return matchesSearch && matchesRegion && matchesOwnership;
    });
  }, [searchTerm, selectedRegion, selectedOwnership]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 transition-colors duration-200">
      
      {/* Minimal Header */}
      <div className="max-w-2xl">
        <h2 className={`text-3xl font-bold tracking-tight font-serif ${
          isDark ? 'text-white' : 'text-[#0F172A]'
        }`}>
          Verified Higher Education Directory
        </h2>
        <p className={`mt-2 text-sm leading-relaxed ${
          isDark ? 'text-zinc-400' : 'text-[#64748B]'
        }`}>
          Explore accredited Ethiopian public and private universities with verified admissions, tuition fees, and academic programs.
        </p>
      </div>

      {/* Minimal Search & Filter Bar */}
      <div className="mt-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
            isDark ? 'text-zinc-500' : 'text-[#64748B]'
          }`} />
          <input
            type="text"
            placeholder="Search by university name, code (e.g. ASTU), or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-xl focus:outline-none transition-all ${
              isDark 
                ? 'bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 focus:border-[#5AA7A7]' 
                : 'bg-white border border-[#E2E8F0] text-[#0F172A] placeholder:text-[#64748B] focus:border-[#5AA7A7] focus:ring-1 focus:ring-[#5AA7A7]'
            }`}
          />
        </div>

        {/* Ownership Toggle */}
        <div className={`flex items-center p-1 rounded-xl text-xs font-medium self-start md:self-auto ${
          isDark ? 'bg-zinc-900 border border-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-600'
        }`}>
          {(['ALL', 'PUBLIC', 'PRIVATE'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedOwnership(type)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedOwnership === type
                  ? (isDark ? 'bg-zinc-800 text-white shadow-sm font-semibold' : 'bg-[#0C373D] text-white shadow-sm font-semibold')
                  : (isDark ? 'hover:text-white' : 'hover:text-[#0F172A]')
              }`}
            >
              {type === 'ALL' ? 'All Types' : type.charAt(0) + type.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

      </div>

      {/* Region Filter Chips */}
      <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {REGIONS.map((region) => (
          <button
            key={region}
            onClick={() => setSelectedRegion(region)}
            className={`px-3 py-1 text-xs rounded-full border transition-all whitespace-nowrap cursor-pointer ${
              selectedRegion === region
                ? (isDark ? 'bg-white text-black border-white font-semibold' : 'bg-[#0C373D] text-white border-[#0C373D] font-medium')
                : (isDark ? 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700' : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#5AA7A7]')
            }`}
          >
            {region}
          </button>
        ))}
      </div>

      {/* Card Grid with onSelectCampus Click Connected */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInstitutions.map((institution) => (
          <InstitutionCard
            key={institution.id}
            institution={institution}
            onClick={onSelectCampus}
            theme={theme}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredInstitutions.length === 0 && (
        <div className={`mt-12 text-center py-16 rounded-2xl border ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-[#E2E8F0]'
        }`}>
          <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>No universities found</p>
          <p className={`text-xs mt-1 ${isDark ? 'text-zinc-500' : 'text-[#64748B]'}`}>Try adjusting your search terms or filters.</p>
        </div>
      )}

    </section>
  );
};