import React, { useState, useEffect } from 'react';
import { 
  Star, ShieldCheck, Calendar, Clock, 
  Search, CheckCircle2, ArrowRight
} from 'lucide-react';
import { TutorBookingModal } from '../components/marketplace/TutorBookingModal';
import type { TutorProfile, BookingData } from '../components/marketplace/TutorBookingModal';
import { getApiUrl } from '../config/api';

interface MarketplacePageProps {
  theme?: 'light' | 'dark';
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({ theme = 'light' }) => {
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'tutors' | 'bookings'>('tutors');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');
  const [selectedTutorForBooking, setSelectedTutorForBooking] = useState<TutorProfile | null>(null);
  const [tutorsList, setTutorsList] = useState<TutorProfile[]>([]);
  const [bookingsList, setBookingsList] = useState<BookingData[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const defaultTutors: TutorProfile[] = [
    {
      id: 'tut-1',
      name: 'Selamawit Kebede',
      university: 'Addis Ababa University (AAiT)',
      specialty: 'Computer Science, Data Structures & Algorithms, C++, Python',
      rating: 4.9,
      reviewsCount: 38,
      hourlyRateEtb: 300,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      verified: true,
      specialtySubjects: ['Data Structures & Algorithms', 'C++ Programming', 'Python for Engineers'],
    },
    {
      id: 'tut-2',
      name: 'Dawit Haile',
      university: 'Adama Science and Technology University (ASTU)',
      specialty: 'Calculus I & II, Linear Algebra, Applied Physics (PHYS1011)',
      rating: 4.8,
      reviewsCount: 45,
      hourlyRateEtb: 250,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      verified: true,
      specialtySubjects: ['Calculus I & II', 'Linear Algebra', 'Freshman Physics (PHYS1011)'],
    },
    {
      id: 'tut-3',
      name: 'Dr. Henok Tadesse',
      university: 'Hawassa University (College of Medicine)',
      specialty: 'General Biology (BIOL1011), General Chemistry (CHEM1011)',
      rating: 5.0,
      reviewsCount: 62,
      hourlyRateEtb: 400,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      verified: true,
      specialtySubjects: ['General Biology (BIOL1011)', 'General Chemistry (CHEM1011)', 'Pre-Med Anatomy'],
    },
    {
      id: 'tut-4',
      name: 'Bethelhem Mekonnen',
      university: 'Bahir Dar University (Institute of Technology)',
      specialty: 'Microeconomics, Macroeconomics, Accounting & Finance',
      rating: 4.9,
      reviewsCount: 29,
      hourlyRateEtb: 280,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      verified: true,
      specialtySubjects: ['Microeconomics', 'Macroeconomics', 'Financial Accounting'],
    },
  ];

  useEffect(() => {
    let isMounted = true;
    fetch(getApiUrl('/api/v1/marketplace/tutors'))
      .then((res) => res.json())
      .then((json) => {
        if (isMounted && json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped: TutorProfile[] = json.data.map((t: any) => ({
            id: t.id,
            name: t.name,
            university: t.universityName || t.university,
            specialty: Array.isArray(t.specialtySubjects) ? t.specialtySubjects.join(', ') : t.specialty || 'General STEM',
            rating: t.ratingAverage || t.rating || 4.9,
            reviewsCount: t.reviewsCount || 30,
            hourlyRateEtb: t.hourlyRateEtb || 300,
            avatarUrl: t.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            verified: t.isVerified ?? true,
            specialtySubjects: Array.isArray(t.specialtySubjects) ? t.specialtySubjects : undefined,
          }));
          setTutorsList(mapped);
        } else if (isMounted) {
          setTutorsList(defaultTutors);
        }
      })
      .catch(() => {
        if (isMounted) setTutorsList(defaultTutors);
      });

    // Fetch existing bookings
    fetch(getApiUrl('/api/v1/marketplace/bookings'))
      .then((res) => res.json())
      .then((json) => {
        if (isMounted && json.success && Array.isArray(json.data)) {
          setBookingsList(json.data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleBookingSuccess = (newBooking: BookingData) => {
    setBookingsList((prev) => [newBooking, ...prev]);
    showToast(`Study session requested with ${newBooking.tutorName}!`);
  };

  const activeTutors = tutorsList.length > 0 ? tutorsList : defaultTutors;

  const filteredTutors = activeTutors.filter((tutor) => {
    const matchesSearch = 
      tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = 
      selectedSpecialty === 'ALL' ||
      tutor.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 transition-colors duration-200">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0C373D] text-[#5AA7A7] border border-[#5AA7A7]/40 px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#5AA7A7]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/80 dark:border-zinc-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#5AA7A7]">
            Peer Tutoring & Academic Mentorship
          </span>
          <h1 className={`text-3xl font-serif font-bold mt-1 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Verified Ethiopian University Tutor Marketplace
          </h1>
          <p className={`mt-2 text-sm leading-relaxed max-w-2xl ${
            isDark ? 'text-zinc-400' : 'text-slate-500'
          }`}>
            Schedule 1-on-1 and small-group study sessions with top-ranking student tutors from AAiT, ASTU, Hawassa, and Jimma.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl border bg-slate-100 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('tutors')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'tutors'
                ? 'bg-white dark:bg-zinc-800 text-[#0C373D] dark:text-[#5AA7A7] shadow-sm'
                : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Browse Tutors ({activeTutors.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'bookings'
                ? 'bg-white dark:bg-zinc-800 text-[#0C373D] dark:text-[#5AA7A7] shadow-sm'
                : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <span>My Bookings</span>
            {bookingsList.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#0C373D] text-[#5AA7A7] text-[10px] font-bold flex items-center justify-center">
                {bookingsList.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'tutors' ? (
        <div>
          {/* Search & Subject Filters */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                isDark ? 'text-zinc-500' : 'text-slate-400'
              }`} />
              <input
                type="text"
                placeholder="Search by tutor name, subject, or university..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl focus:outline-none transition-all ${
                  isDark 
                    ? 'bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 focus:border-zinc-600' 
                    : 'bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#5AA7A7]'
                }`}
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {['ALL', 'Calculus', 'Physics', 'Programming', 'Biology'].map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                    selectedSpecialty === spec
                      ? (isDark ? 'bg-white text-black border-white shadow-sm font-bold' : 'bg-[#0C373D] text-white border-[#0C373D] shadow-sm')
                      : (isDark ? 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300')
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>

          {/* Tutor Cards Grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutors.map((tutor) => (
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
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-serif font-bold text-base truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {tutor.name}
                      </h3>
                      <p className={`text-xs mt-0.5 truncate ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                        {tutor.university}
                      </p>
                      
                      <div className="mt-1.5 flex items-center gap-1 text-xs text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{tutor.rating}</span>
                        <span className={`font-normal ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                          ({tutor.reviewsCount} sessions)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={`mt-5 p-3.5 rounded-2xl border ${
                    isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-100'
                  }`}>
                    <p className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'text-[#5AA7A7]' : 'text-[#0C373D]'}`}>
                      Specialty Areas
                    </p>
                    <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                      {tutor.specialty}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className={`font-serif font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {tutor.hourlyRateEtb} ETB <span className={`text-xs font-normal ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>/ hr</span>
                    </span>
                    <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified Student Tutor
                    </span>
                  </div>
                </div>

                <div className={`mt-6 pt-4 border-t ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
                  <button
                    onClick={() => setSelectedTutorForBooking(tutor)}
                    className="w-full py-2.5 bg-[#0C373D] hover:bg-[#072428] text-white font-semibold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Book Study Session</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#5AA7A7]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* My Bookings Tab View */
        <div className="mt-8 animate-fadeIn">
          {bookingsList.length === 0 ? (
            <div className={`py-16 text-center rounded-3xl border ${
              isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
            }`}>
              <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-serif font-bold">No Active Bookings Yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Explore our directory of verified peer tutors and book your first 1-on-1 calculus, physics, or programming session.
              </p>
              <button
                onClick={() => setActiveTab('tutors')}
                className="mt-6 px-6 py-2.5 bg-[#0C373D] hover:bg-[#072428] text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Browse Available Tutors
              </button>
            </div>
          ) : (
            <div className="space-y-4 max-w-3xl">
              {bookingsList.map((booking) => (
                <div
                  key={booking.id}
                  className={`p-6 rounded-3xl border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                        {booking.status || 'REQUESTED'}
                      </span>
                      <span className="text-xs text-slate-400">Ref #{booking.id?.slice(0, 8)}</span>
                    </div>

                    <h4 className="font-serif font-bold text-base">
                      {booking.subject}
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Tutor: <strong>{booking.tutorName}</strong> • Student: {booking.studentName}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-zinc-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#5AA7A7]" />
                        {booking.sessionDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#5AA7A7]" />
                        {booking.timeSlot}
                      </span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-zinc-800">
                    <div className="font-serif font-bold text-base text-[#0C373D] dark:text-[#5AA7A7]">
                      {booking.totalPriceEtb} ETB
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {booking.durationHours} Hour Session
                    </div>
                    <button
                      onClick={() => alert(`Meeting link will be activated for ${booking.studentEmail} 15 minutes before ${booking.sessionDate}`)}
                      className="mt-3 px-4 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                    >
                      Session Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tutor Booking Interactive Modal */}
      {selectedTutorForBooking && (
        <TutorBookingModal
          tutor={selectedTutorForBooking}
          onClose={() => setSelectedTutorForBooking(null)}
          onBookingSuccess={handleBookingSuccess}
          isDark={isDark}
        />
      )}

    </div>
  );
};