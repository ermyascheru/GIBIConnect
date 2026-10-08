import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';

interface TutorProfile {
  id: string;
  name: string;
  university: string;
  specialty: string;
  rating: number;
  reviewsCount: number;
  hourlyRateEtb: number;
  avatarUrl: string;
  verified: boolean;
}

interface MarketplacePageProps {
  theme?: 'light' | 'dark';
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({ theme = 'light' }) => {
  const isDark = theme === 'dark';

  const tutors: TutorProfile[] = [
    {
      id: 't-1',
      name: 'Dr. Yared Tesfaye',
      university: 'Addis Ababa University',
      specialty: 'Calculus, Linear Algebra & Applied Physics',
      rating: 4.9,
      reviewsCount: 38,
      hourlyRateEtb: 450,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      verified: true,
    },
    {
      id: 't-2',
      name: 'Selamawit Bekele (M.Sc.)',
      university: 'Adama Science and Technology University',
      specialty: 'Data Structures, Python & Algorithms',
      rating: 4.8,
      reviewsCount: 26,
      hourlyRateEtb: 400,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      verified: true,
    },
    {
      id: 't-3',
      name: 'Henok Girma',
      university: 'Bahir Dar University',
      specialty: 'EUEE Exam Preparation & Chemistry',
      rating: 5.0,
      reviewsCount: 42,
      hourlyRateEtb: 350,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      verified: true,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 transition-colors duration-200">
      
      {/* Title */}
      <div className="max-w-2xl">
        <h1 className={`text-3xl font-serif font-bold ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          Tutor & Academic Marketplace
        </h1>
        <p className={`mt-2 text-sm leading-relaxed ${
          isDark ? 'text-zinc-400' : 'text-slate-500'
        }`}>
          Connect with verified top-tier academic tutors, graduate researchers, and peer mentors across Ethiopian universities.
        </p>
      </div>

      {/* Tutor Cards Grid */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {tutors.map((tutor) => (
          <div
            key={tutor.id}
            className={`rounded-3xl p-6 border transition-all flex flex-col justify-between ${
              isDark 
                ? 'bg-zinc-900 border-zinc-800 text-white hover:border-zinc-700 shadow-none' 
                : 'bg-white border-slate-200/80 shadow-sm hover:shadow-md'
            }`}
          >
            <div>
              <div className="flex items-start gap-4">
                <img
                  src={tutor.avatarUrl}
                  alt={tutor.name}
                  className={`w-16 h-16 rounded-2xl object-cover border shadow-sm ${
                    isDark ? 'border-zinc-700' : 'border-slate-200'
                  }`}
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className={`font-serif font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>{tutor.name}</h3>
                  </div>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{tutor.university}</p>
                  
                  <div className="mt-1 flex items-center gap-1 text-xs text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{tutor.rating}</span>
                    <span className={`font-normal ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>({tutor.reviewsCount} reviews)</span>
                  </div>
                </div>
              </div>

              <div className={`mt-5 p-3 rounded-xl border ${
                isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-100'
              }`}>
                <p className={`text-xs font-semibold ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>Specialty</p>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{tutor.specialty}</p>
              </div>

              <div className={`mt-4 flex items-center justify-between text-xs ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {tutor.hourlyRateEtb} ETB <span className={`text-xs font-normal ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>/ hr</span>
                </span>
                <span className={`font-semibold flex items-center gap-1 px-2 py-0.5 rounded border ${
                  isDark 
                    ? 'text-emerald-400 bg-emerald-950/50 border-emerald-800/60' 
                    : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                }`}>
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Tutor
                </span>
              </div>
            </div>

            <div className={`mt-6 pt-4 border-t ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
              <button className="w-full py-2.5 bg-[#0C373D] hover:bg-[#072428] text-white font-semibold text-xs rounded-xl transition-all shadow-sm cursor-pointer">
                Book Study Session
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};