import React from 'react';
import { MapPin, ArrowUpRight, BookOpen, Layers } from 'lucide-react';
import type { Institution } from '../../types/institution';
import { MonogramAvatar } from '../common/MonogramAvatar';
import { Badge } from '../common/Badge';

interface InstitutionCardProps {
  institution: Institution | any;
  onClick?: (id: string) => void;
  theme?: 'light' | 'dark';
}

export const InstitutionCard: React.FC<InstitutionCardProps> = ({ institution, onClick, theme = 'light' }) => {
  const isDark = theme === 'dark';

  const name = institution.nameEn || institution.name || 'Institution';
  const code = institution.code || name.slice(0, 4).toUpperCase();
  const city = institution.city || institution.region || 'Addis Ababa';
  const region = institution.region || 'Ethiopia';
  const overview = institution.overview || institution.description || 'Verified Ethiopian higher education institution.';
  const totalFaculties = institution.totalFaculties ?? institution.total_faculties ?? 4;
  const totalPrograms = institution.totalPrograms ?? institution.total_programs ?? 12;
  const establishedYear = institution.establishedYear || institution.established_year || 1950;
  const verificationStatus = institution.verificationStatus || (institution.status === 'published' ? 'VERIFIED' : 'VERIFIED');

  return (
    <div 
      onClick={() => onClick && onClick(institution.id)}
      className={`group rounded-2xl p-6 border transition-all duration-200 flex flex-col justify-between cursor-pointer ${
        isDark 
          ? 'bg-zinc-900 border-zinc-800 hover:border-[#5AA7A7]/50 shadow-none' 
          : 'bg-white border-[#E2E8F0] hover:border-[#5AA7A7]/50 hover:shadow-md'
      }`}
    >
      {/* Top Row: Avatar & Status */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <MonogramAvatar code={code} name={name} logoUrl={institution.logoUrl} size="md" />
          <div className="flex items-center gap-2">
            <Badge status={verificationStatus} />
            <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              isDark 
                ? 'bg-zinc-800 text-zinc-400 group-hover:text-white group-hover:bg-[#0C373D]' 
                : 'bg-[#F8FAFC] text-slate-400 group-hover:text-white group-hover:bg-[#0C373D]'
            }`}>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Title & Location */}
        <div className="mt-4">
          <h3 className={`font-semibold text-base transition-colors leading-snug ${
            isDark ? 'text-white group-hover:text-[#5AA7A7]' : 'text-[#0F172A] group-hover:text-[#0C373D]'
          }`}>
            {name}
          </h3>
          {institution.nameAm && (
            <p className={`text-xs font-ethiopic mt-0.5 ${
              isDark ? 'text-zinc-500' : 'text-[#64748B]'
            }`}>
              {institution.nameAm}
            </p>
          )}
          <div className={`flex items-center gap-1 text-xs mt-2 ${
            isDark ? 'text-zinc-400' : 'text-[#64748B]'
          }`}>
            <MapPin className={`w-3.5 h-3.5 ${isDark ? 'text-zinc-500' : 'text-[#5AA7A7]'}`} />
            <span>{city}, {region}</span>
          </div>
        </div>

        {/* Overview */}
        <p className={`text-xs mt-3 line-clamp-2 leading-relaxed ${
          isDark ? 'text-zinc-400' : 'text-[#64748B]'
        }`}>
          {overview}
        </p>
      </div>

      {/* Bottom Minimal Meta Stats */}
      <div className={`mt-6 pt-4 border-t flex items-center justify-between text-xs ${
        isDark ? 'border-zinc-800 text-zinc-400' : 'border-[#E2E8F0] text-[#64748B]'
      }`}>
        <div className="flex items-center gap-1.5">
          <Layers className={`w-3.5 h-3.5 ${isDark ? 'text-zinc-500' : 'text-[#5AA7A7]'}`} />
          <span>{totalFaculties} Faculties</span>
        </div>
        <div className="flex items-center gap-1.5">
          <BookOpen className={`w-3.5 h-3.5 ${isDark ? 'text-zinc-500' : 'text-[#5AA7A7]'}`} />
          <span>{totalPrograms} Programs</span>
        </div>
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
          isDark ? 'text-zinc-400 bg-zinc-950 border border-zinc-800' : 'text-[#1E5C64] bg-[#EBF6F6] border border-[#5AA7A7]/20'
        }`}>
          Est. {establishedYear}
        </span>
      </div>
    </div>
  );
};
