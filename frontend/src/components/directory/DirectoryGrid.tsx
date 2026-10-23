import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { ETHIOPIAN_INSTITUTIONS } from '../../data/mockInstitutions';
import { resolveInstitution, matchesInstitution } from '../../utils/resolveInstitution';
import { InstitutionCard } from './InstitutionCard';
import { getApiUrl } from '../../config/api';

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
  const [institutionsList, setInstitutionsList] = useState<any[]>([]);

  React.useEffect(() => {
    let isMounted = true;
    fetch(getApiUrl('/api/v1/institutions'))
      .then((res) => res.json())
      .then((json) => {
        if (isMounted && json.success && Array.isArray(json.data) && json.data.length > 0) {
          const normalized = json.data.map((item: any) => {
            const matched = resolveInstitution(item.id || item.code || item.slug || item.name || item.nameEn);

            const nameEn = item.nameEn || item.name || matched?.nameEn || 'University';
            const code = item.code || matched?.code || (item.name || item.nameEn || 'UNI').split(' ').map((w: string) => w[0]).join('').slice(0, 4).toUpperCase();
            const nameAm = item.nameAm || matched?.nameAm;
            const ownership = (item.ownership || matched?.ownership || 'PUBLIC').toUpperCase();
            const type = (item.type || matched?.type || 'UNIVERSITY').toUpperCase();
            const region = item.region || matched?.region || 'Addis Ababa';
            const city = item.city || matched?.city || 'Addis Ababa';
            const establishedYear = item.establishedYear || matched?.establishedYear || 1950;
            const verificationStatus = (item.verificationStatus || (item.status === 'published' ? 'VERIFIED' : matched?.verificationStatus || 'VERIFIED'));
            const overview = item.overview || item.description || matched?.overview || `${nameEn} is a distinguished higher education institution in Ethiopia.`;
            const totalFaculties = item.totalFaculties ?? item.total_faculties ?? matched?.totalFaculties ?? 4;
            const totalDepartments = item.totalDepartments ?? item.total_departments ?? matched?.totalDepartments ?? 12;
            const totalPrograms = item.totalPrograms ?? item.total_programs ?? matched?.totalPrograms ?? 18;

            return {
              id: matched?.id || item.id,
              dbId: item.id,
              code,
              nameEn,
              nameAm,
              ownership,
              type,
              region,
              city,
              establishedYear,
              verificationStatus,
              overview,
              totalFaculties,
              totalDepartments,
              totalPrograms,
              websiteUrl: item.website_url || item.websiteUrl || matched?.websiteUrl,
              logoUrl: item.logo_url || item.logoUrl || matched?.logoUrl,
              admissions: matched?.admissions || [],
              tuition: matched?.tuition || [],
              facilities: matched?.facilities || [],
              scholarshipsAvailable: matched?.scholarshipsAvailable ?? 5,
            };
          });
          // Merge API data with any local ETHIOPIAN_INSTITUTIONS not present in API so all institutions remain accessible
          const missingLocals = ETHIOPIAN_INSTITUTIONS.filter(
            (local) => !normalized.some((n: any) => n.id === local.id || n.code === local.code)
          );
          setInstitutionsList([...normalized, ...missingLocals]);
        } else if (isMounted) {
          setInstitutionsList(ETHIOPIAN_INSTITUTIONS);
        }
      })
      .catch(() => {
        if (isMounted) setInstitutionsList(ETHIOPIAN_INSTITUTIONS);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const activeInstitutions = institutionsList.length > 0 ? institutionsList : ETHIOPIAN_INSTITUTIONS;

  const filteredInstitutions = useMemo(() => {
    return activeInstitutions.filter((inst) => {
      const matchesSearch = matchesInstitution(inst, searchTerm);
      const matchesRegion = selectedRegion === 'All' || inst.region === selectedRegion;
      const matchesOwnership = selectedOwnership === 'ALL' || inst.ownership?.toUpperCase() === selectedOwnership;

      return matchesSearch && matchesRegion && matchesOwnership;
    });
  }, [activeInstitutions, searchTerm, selectedRegion, selectedOwnership]);

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