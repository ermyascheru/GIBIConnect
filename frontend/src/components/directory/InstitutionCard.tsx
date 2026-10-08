import React from 'react';
import { MapPin, ArrowUpRight, BookOpen, Layers } from 'lucide-react';
import type { Institution } from '../../types/institution';
import { MonogramAvatar } from '../common/MonogramAvatar';
import { Badge } from '../common/Badge';

interface InstitutionCardProps {
  institution: Institution;
  onClick?: (id: string) => void;
  theme?: 'light' | 'dark';
}

export const InstitutionCard: React.FC<InstitutionCardProps> = ({ institution, onClick, theme = 'light' }) => {
  const isDark = theme === 'dark';

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
          <MonogramAvatar code={institution.code} name={institution.nameEn} size="md" />
          <div className="flex items-center gap-2">
            <Badge status={institution.verificationStatus} />
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
            {institution.nameEn}
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
            <span>{institution.city}, {institution.region}</span>
          </div>
        </div>

        {/* Overview */}
        <p className={`text-xs mt-3 line-clamp-2 leading-relaxed ${
          isDark ? 'text-zinc-400' : 'text-[#64748B]'
        }`}>
          {institution.overview}
        </p>
      </div>

      {/* Bottom Minimal Meta Stats */}
      <div className={`mt-6 pt-4 border-t flex items-center justify-between text-xs ${
        isDark ? 'border-zinc-800 text-zinc-400' : 'border-[#E2E8F0] text-[#64748B]'
      }`}>
        <div className="flex items-center gap-1.5">
          <Layers className={`w-3.5 h-3.5 ${isDark ? 'text-zinc-500' : 'text-[#5AA7A7]'}`} />
          <span>{institution.totalFaculties} Faculties</span>
        </div>
        <div className="flex items-center gap-1.5">
          <BookOpen className={`w-3.5 h-3.5 ${isDark ? 'text-zinc-500' : 'text-[#5AA7A7]'}`} />
          <span>{institution.totalPrograms} Programs</span>
        </div>
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
          isDark ? 'text-zinc-400 bg-zinc-950 border border-zinc-800' : 'text-[#1E5C64] bg-[#EBF6F6] border border-[#5AA7A7]/20'
        }`}>
          Est. {institution.establishedYear}
        </span>
      </div>
    </div>
  );
};
