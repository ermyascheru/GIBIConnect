import React, { useState, useMemo } from 'react';
import { Search, Calendar as CalendarIcon, MapPin, Clock, Bookmark } from 'lucide-react';

interface AcademicEvent {
  id: string;
  title: string;
  universityCode: string;
  universityName: string;
  category: 'DEADLINE' | 'CONFERENCE' | 'ORIENTATION' | 'HACKATHON' | 'CAREER';
  dateGregorian: string;
  dateEthiopic: string;
  time: string;
  location: string;
  isVirtual: boolean;
  image: string;
  description: string;
  registrationOpen: boolean;
  attendeesCount: number;
}

interface EventsPageProps {
  theme?: 'light' | 'dark';
}

export const EventsPage: React.FC<EventsPageProps> = ({ theme = 'light' }) => {
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [savedEvents, setSavedEvents] = useState<string[]>([]);

  const events: AcademicEvent[] = [
    {
      id: 'ev-1',
      title: 'Ministry of Education 2017 E.C. University Choice Submission Window',
      universityCode: 'MoE',
      universityName: 'Ministry of Education Ethiopia',
      category: 'DEADLINE',
      dateGregorian: 'October 10 - 20, 2026',
      dateEthiopic: 'Meskerem 30 - Tikimt 10, 2017 E.C.',
      time: '11:59 PM EAT',
      location: 'National Placement Portal (Online)',
      isVirtual: true,
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
      description: 'Official online window for matriculated Grade 12 students to prioritize their preferred public universities and academic streams.',
      registrationOpen: true,
      attendeesCount: 14200,
    },
    {
      id: 'ev-2',
      title: 'AASTU National Artificial Intelligence & Robotics Summit 2026',
      universityCode: 'AASTU',
      universityName: 'Addis Ababa Science and Technology University',
      category: 'CONFERENCE',
      dateGregorian: 'November 14 - 15, 2026',
      dateEthiopic: 'Hidar 5 - 6, 2017 E.C.',
      time: '9:00 AM - 5:00 PM',
      location: 'AASTU Multipurpose Auditorium, Akaki Campus',
      isVirtual: false,
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      description: 'Keynotes from leading East African computer scientists, AI student project exhibitions, and high-performance computing workshops.',
      registrationOpen: true,
      attendeesCount: 650,
    },
    {
      id: 'ev-3',
      title: 'Addis Ababa University (AAU) Freshman Welcome & Campus Orientation',
      universityCode: 'AAU',
      universityName: 'Addis Ababa University',
      category: 'ORIENTATION',
      dateGregorian: 'October 25, 2026',
      dateEthiopic: 'Tikimt 15, 2017 E.C.',
      time: '8:30 AM - 1:00 PM',
      location: 'Sidist Kilo Main Campus & FBE Campus',
      isVirtual: false,
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
      description: 'Orientation for newly admitted undergraduate students covering library access, faculty advising, meal plans, and student IDs.',
      registrationOpen: false,
      attendeesCount: 3200,
    },
    {
      id: 'ev-4',
      title: 'ASTU Annual Software Innovation Hackathon & Tech Expo',
      universityCode: 'ASTU',
      universityName: 'Adama Science and Technology University',
      category: 'HACKATHON',
      dateGregorian: 'December 5 - 7, 2026',
      dateEthiopic: 'Hidar 26 - 28, 2017 E.C.',
      time: '48-Hour Continuous Event',
      location: 'ASTU Innovation Incubation Center, Adama',
      isVirtual: false,
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      description: 'National collegiate hackathon focused on building fintech, agri-tech, and healthcare solutions for Ethiopian communities with cash grants.',
      registrationOpen: true,
      attendeesCount: 280,
    },
    {
      id: 'ev-5',
      title: 'Jimma University Annual Community Health Research Symposium',
      universityCode: 'JU',
      universityName: 'Jimma University',
      category: 'CONFERENCE',
      dateGregorian: 'December 18 - 19, 2026',
      dateEthiopic: 'Tahsas 9 - 10, 2017 E.C.',
      time: '9:00 AM - 4:30 PM',
      location: 'JU Specialized Teaching Hospital Hall, Jimma',
      isVirtual: false,
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
      description: 'Presentation of clinical epidemiology, tropical medicine breakthroughs, and rural healthcare delivery model research.',
      registrationOpen: true,
      attendeesCount: 420,
    },
    {
      id: 'ev-6',
      title: 'National Higher Education Career & Graduate Job Fair 2026',
      universityCode: 'ALL',
      universityName: 'Inter-University Consortium',
      category: 'CAREER',
      dateGregorian: 'January 20, 2027',
      dateEthiopic: 'Tir 12, 2017 E.C.',
      time: '9:00 AM - 6:00 PM',
      location: 'Millennium Hall, Addis Ababa',
      isVirtual: false,
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
      description: 'Connecting graduating seniors and alumni across all Ethiopian universities with 150+ national employers, banks, and technology firms.',
      registrationOpen: true,
      attendeesCount: 5400,
    },
  ];

  const categories = [
    { id: 'ALL', label: 'All Events' },
    { id: 'DEADLINE', label: 'Admission Deadlines' },
    { id: 'CONFERENCE', label: 'Academic Conferences' },
    { id: 'ORIENTATION', label: 'Orientations' },
    { id: 'HACKATHON', label: 'Hackathons & Fairs' },
    { id: 'CAREER', label: 'Career & Job Fairs' },
  ];

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchesSearch =
        ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ev.universityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ev.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'ALL' || ev.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [events, searchTerm, selectedCategory]);

  const toggleSave = (id: string) => {
    setSavedEvents((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 antialiased transition-colors duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3 ${
            isDark ? 'bg-teal-950/50 border border-teal-800/60 text-teal-300' : 'bg-[#EBF6F6] border border-[#5AA7A7]/30 text-[#1E5C64]'
          }`}>
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Academic Calendar & Intake Schedule</span>
          </div>
          <h1 className={`text-3xl font-serif font-bold ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            University Events & Admissions Deadlines
          </h1>
          <p className={`mt-2 text-sm leading-relaxed ${
            isDark ? 'text-zinc-400' : 'text-slate-500'
          }`}>
            Stay informed about national matriculation cutoff announcements, academic conferences, campus open days, and student hackathons across Ethiopia.
          </p>
        </div>

        {/* Dual Calendar Ticker */}
        <div className={`p-4 rounded-2xl border shadow-sm flex items-center gap-4 text-xs self-start md:self-auto transition-colors ${
          isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200/80'
        }`}>
          <div className="text-left">
            <span className={`text-[10px] uppercase font-bold ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Current Academic Year</span>
            <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>2016 / 2017 E.C.</p>
          </div>
          <div className={`h-8 w-px ${isDark ? 'bg-zinc-800' : 'bg-slate-200'}`} />
          <div className="text-left">
            <span className={`text-[10px] uppercase font-bold ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Gregorian</span>
            <p className={`font-bold text-sm ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>2026 / 2027 G.C.</p>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="mt-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
            isDark ? 'text-zinc-500' : 'text-slate-400'
          }`} />
          <input
            type="text"
            placeholder="Search events by title, campus, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl focus:outline-none transition-all ${
              isDark 
                ? 'bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 focus:border-[#5AA7A7]' 
                : 'bg-white border border-[#E2E8F0] text-[#0F172A] placeholder:text-[#64748B] focus:border-[#5AA7A7]'
            }`}
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? (isDark ? 'bg-white text-black shadow-sm font-bold' : 'bg-[#0C373D] text-white shadow-sm font-bold')
                  : (isDark ? 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white' : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:border-[#5AA7A7]')
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

      </div>

      {/* Events Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((ev) => {
          const isSaved = savedEvents.includes(ev.id);
          return (
            <div
              key={ev.id}
              className={`rounded-2xl overflow-hidden border transition-all flex flex-col justify-between group ${
                isDark 
                  ? 'bg-zinc-900 border-zinc-800 hover:border-[#5AA7A7]/50 shadow-none' 
                  : 'bg-white border-[#E2E8F0] hover:border-[#5AA7A7]/50 hover:shadow-md'
              }`}
            >
              {/* Event Image & Header Badges */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                <img
                  src={ev.image}
                  alt={ev.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                />
                <div className="absolute top-3 left-3 bg-[#0C373D]/90 backdrop-blur-sm text-[#5AA7A7] text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm border border-[#5AA7A7]/30">
                  {ev.universityCode}
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button
                    onClick={() => toggleSave(ev.id)}
                    className={`p-2 rounded-full backdrop-blur-sm shadow-sm transition-colors cursor-pointer ${
                      isDark ? 'bg-zinc-900/90 text-zinc-300 hover:text-[#5AA7A7] border border-zinc-700' : 'bg-white/90 text-[#0F172A] hover:text-[#5AA7A7]'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#5AA7A7] text-[#5AA7A7]' : ''}`} />
                  </button>
                </div>
                <div className={`absolute bottom-3 left-3 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-semibold shadow-sm flex items-center gap-1 ${
                  isDark ? 'bg-zinc-950/90 text-zinc-200 border border-zinc-800' : 'bg-white/95 text-slate-800'
                }`}>
                  <Clock className="w-3 h-3 text-[#5AA7A7]" />
                  <span>{ev.dateGregorian}</span>
                </div>
              </div>

              {/* Event Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                      isDark ? 'bg-teal-950/50 text-teal-300 border-teal-800/60' : 'bg-[#EBF6F6] text-[#1E5C64] border-[#5AA7A7]/30'
                    }`}>
                      {ev.category}
                    </span>
                    <span className={`text-[11px] font-ethiopic ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                      {ev.dateEthiopic}
                    </span>
                  </div>

                  <h3 className={`font-bold text-base transition-colors leading-snug font-serif ${
                    isDark ? 'text-white group-hover:text-[#5AA7A7]' : 'text-[#0F172A] group-hover:text-[#0C373D]'
                  }`}>
                    {ev.title}
                  </h3>

                  <div className={`mt-3 space-y-1.5 text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                    <div className="flex items-center gap-1.5">
                      <MapPin className={`w-3.5 h-3.5 flex-shrink-0 ${isDark ? 'text-zinc-500' : 'text-[#5AA7A7]'}`} />
                      <span className="line-clamp-1">{ev.location}</span>
                    </div>
                  </div>

                  <p className={`mt-3 text-xs line-clamp-2 leading-relaxed ${
                    isDark ? 'text-zinc-400' : 'text-[#64748B]'
                  }`}>
                    {ev.description}
                  </p>
                </div>

                {/* Event Actions */}
                <div className={`mt-6 pt-4 border-t flex items-center justify-between ${
                  isDark ? 'border-zinc-800' : 'border-slate-100'
                }`}>
                  <div className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{ev.attendeesCount.toLocaleString()}</span> interested
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alert(`RSVP recorded for: ${ev.title}`)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        ev.registrationOpen
                          ? 'bg-[#0C373D] hover:bg-[#072428] text-white shadow-sm'
                          : (isDark ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-slate-100 text-slate-500 cursor-not-allowed')
                      }`}
                      disabled={!ev.registrationOpen}
                    >
                      {ev.registrationOpen ? 'RSVP / Register' : 'Closed'}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div className={`mt-12 text-center py-16 rounded-2xl border ${
          isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-white border-slate-200'
        }`}>
          <CalendarIcon className={`w-10 h-10 mx-auto mb-3 ${isDark ? 'text-zinc-600' : 'text-slate-300'}`} />
          <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>No events found</p>
          <p className={`text-xs mt-1 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>Try selecting a different category or adjusting your search term.</p>
        </div>
      )}

    </div>
  );
};
