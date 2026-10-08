import { useState } from 'react';
import { Navbar, type PublicNavView } from './components/layout/Navbar';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ContactPage } from './pages/ContactPage';
import { AuthPage } from './pages/AuthPage';
import { DirectoryGrid } from './components/directory/DirectoryGrid';
import { ProgramsPage } from './pages/ProgramsPage';
import { AdmissionsPage } from './pages/AdmissionsPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { AIAdvisorPage } from './pages/AIAdvisorPage';
import { CampusDetailPage } from './pages/CampusDetailPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { EventsPage } from './pages/EventsPage';
import { Sparkles, Building2, BookOpen, GraduationCap, FileText, ShoppingBag, Calendar, Sun, Moon } from 'lucide-react';

export type PlatformTab = 'institutions' | 'programs' | 'admissions' | 'events' | 'resources' | 'market' | 'ai-advisor';

export default function App() {
  const [currentView, setCurrentView] = useState<PublicNavView | 'platform' | 'search'>('home');
  const [activePlatformTab, setActivePlatformTab] = useState<PlatformTab>('institutions');
  const [selectedCampusId, setSelectedCampusId] = useState<string | null>(null);
  const [activeSearchQuery, setActiveSearchQuery] = useState<string>('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSelectCampus = (id: string) => {
    setSelectedCampusId(id);
  };

  const handleSearch = (query: string) => {
    setActiveSearchQuery(query);
    setCurrentView('search');
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-zinc-950 text-slate-100' : 'bg-[#FAF9F6] text-slate-900'} antialiased flex flex-col justify-between transition-colors duration-200`}>
      
      {/* 1. Public Landing Navigation Bar */}
      {currentView !== 'platform' && currentView !== 'auth' ? (
        <Navbar
          currentView={currentView === 'search' ? 'home' : currentView}
          onNavigate={(view) => {
            setSelectedCampusId(null);
            setCurrentView(view);
          }}
          onGetStarted={() => {
            setSelectedCampusId(null);
            setCurrentView('platform');
          }}
        />
      ) : null}

      {/* 2. Platform Feature Navigation Bar */}
      {currentView === 'platform' && (
        <header className={`sticky top-0 z-50 px-6 h-16 flex items-center justify-between shadow-sm transition-colors duration-200 ${
          theme === 'dark' ? 'bg-black border-b border-zinc-800 text-white' : 'bg-white border-b border-slate-200/80 text-slate-900'
        }`}>
          
          {/* Logo */}
          <div className="flex items-center gap-8">
            <button onClick={() => setCurrentView('home')} className="flex items-center gap-2 group text-left cursor-pointer">
              <span className={`w-8 h-8 rounded-lg font-bold flex items-center justify-center text-sm tracking-tight transition-colors ${
                theme === 'dark' ? 'bg-white text-black group-hover:bg-[#8C4A2F] group-hover:text-white' : 'bg-slate-900 text-white group-hover:bg-[#8C4A2F]'
              }`}>
                G
              </span>
              <span className={`text-lg font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                GIBI<span className="text-[#8C4A2F]">Connect</span>
              </span>
            </button>

            {/* Direct Platform Feature Tabs */}
            <nav className={`hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider ${
              theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'
            }`}>
              <button
                onClick={() => {
                  setSelectedCampusId(null);
                  setActivePlatformTab('institutions');
                }}
                className={`flex items-center gap-1.5 transition-colors py-1 cursor-pointer ${activePlatformTab === 'institutions' && !selectedCampusId ? 'text-[#8C4A2F] font-bold border-b-2 border-[#8C4A2F]' : (theme === 'dark' ? 'hover:text-white' : 'hover:text-slate-900')}`}
              >
                <Building2 className="w-4 h-4" />
                <span>Institutions</span>
              </button>
              <button
                onClick={() => {
                  setSelectedCampusId(null);
                  setActivePlatformTab('programs');
                }}
                className={`flex items-center gap-1.5 transition-colors py-1 cursor-pointer ${activePlatformTab === 'programs' ? 'text-[#8C4A2F] font-bold border-b-2 border-[#8C4A2F]' : (theme === 'dark' ? 'hover:text-white' : 'hover:text-slate-900')}`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Programs</span>
              </button>
              <button
                onClick={() => {
                  setSelectedCampusId(null);
                  setActivePlatformTab('admissions');
                }}
                className={`flex items-center gap-1.5 transition-colors py-1 cursor-pointer ${activePlatformTab === 'admissions' ? 'text-[#8C4A2F] font-bold border-b-2 border-[#8C4A2F]' : (theme === 'dark' ? 'hover:text-white' : 'hover:text-slate-900')}`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Admissions</span>
              </button>
              <button
                onClick={() => {
                  setSelectedCampusId(null);
                  setActivePlatformTab('events');
                }}
                className={`flex items-center gap-1.5 transition-colors py-1 cursor-pointer ${activePlatformTab === 'events' ? 'text-[#8C4A2F] font-bold border-b-2 border-[#8C4A2F]' : (theme === 'dark' ? 'hover:text-white' : 'hover:text-slate-900')}`}
              >
                <Calendar className="w-4 h-4" />
                <span>Events</span>
              </button>
              <button
                onClick={() => {
                  setSelectedCampusId(null);
                  setActivePlatformTab('resources');
                }}
                className={`flex items-center gap-1.5 transition-colors py-1 cursor-pointer ${activePlatformTab === 'resources' ? 'text-[#8C4A2F] font-bold border-b-2 border-[#8C4A2F]' : (theme === 'dark' ? 'hover:text-white' : 'hover:text-slate-900')}`}
              >
                <FileText className="w-4 h-4" />
                <span>Resources</span>
              </button>
              <button
                onClick={() => {
                  setSelectedCampusId(null);
                  setActivePlatformTab('market');
                }}
                className={`flex items-center gap-1.5 transition-colors py-1 cursor-pointer ${activePlatformTab === 'market' ? 'text-[#8C4A2F] font-bold border-b-2 border-[#8C4A2F]' : (theme === 'dark' ? 'hover:text-white' : 'hover:text-slate-900')}`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Market</span>
              </button>
            </nav>
          </div>

          {/* Right Action: Light/Dark Toggle, AI Advisor Pill & Sign In */}
          <div className="flex items-center gap-3">
            {/* Header Theme Switcher */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                theme === 'dark' 
                  ? 'bg-zinc-900 border-zinc-700 text-amber-400 hover:bg-zinc-800' 
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                setSelectedCampusId(null);
                setActivePlatformTab('ai-advisor');
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                activePlatformTab === 'ai-advisor'
                  ? 'bg-[#8C4A2F] text-white border-[#8C4A2F] shadow-sm'
                  : (theme === 'dark' ? 'text-amber-400 bg-zinc-900 border-zinc-700 hover:bg-zinc-800' : 'text-[#8C4A2F] bg-amber-50/80 hover:bg-amber-100 border-amber-200')
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Advisor</span>
            </button>

            <button
              onClick={() => setCurrentView('auth')}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                theme === 'dark' ? 'text-zinc-300 hover:text-white hover:bg-zinc-800' : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              Sign In
            </button>
          </div>

        </header>
      )}

      {/* 3. Main Views Rendering */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            onGetStarted={() => {
              setSelectedCampusId(null);
              setCurrentView('platform');
            }}
            onAbout={() => setCurrentView('about')}
            onSearch={handleSearch}
            onSelectCampus={(id) => {
              setSelectedCampusId(id);
              setActivePlatformTab('institutions');
              setCurrentView('platform');
            }}
          />
        )}

        {currentView === 'search' && (
          <SearchResultsPage
            initialQuery={activeSearchQuery}
            onBack={() => setCurrentView('home')}
            onSelectCampus={(id) => {
              setSelectedCampusId(id);
              setActivePlatformTab('institutions');
              setCurrentView('platform');
            }}
            theme={theme}
          />
        )}

        {currentView === 'about' && <AboutPage />}

        {currentView === 'services' && (
          <ServicesPage onContact={() => setCurrentView('contact')} />
        )}

        {currentView === 'contact' && <ContactPage />}

        {currentView === 'auth' && (
          <AuthPage
            onBack={() => setCurrentView('home')}
            onSuccess={() => setCurrentView('platform')}
          />
        )}

        {/* Platform View with Campus Detail Drilldown */}
        {currentView === 'platform' && (
          <div>
            {selectedCampusId ? (
              <CampusDetailPage
                institutionId={selectedCampusId}
                onBack={() => setSelectedCampusId(null)}
                onNavigateToTab={(tab) => {
                  setSelectedCampusId(null);
                  setActivePlatformTab(tab);
                }}
                theme={theme}
              />
            ) : (
              <>
                {activePlatformTab === 'institutions' && (
                  <DirectoryGrid onSelectCampus={handleSelectCampus} theme={theme} />
                )}
                {activePlatformTab === 'programs' && <ProgramsPage theme={theme} />}
                {activePlatformTab === 'admissions' && <AdmissionsPage theme={theme} />}
                {activePlatformTab === 'events' && <EventsPage theme={theme} />}
                {activePlatformTab === 'resources' && <ResourcesPage theme={theme} />}
                {activePlatformTab === 'market' && <MarketplacePage theme={theme} />}
                {activePlatformTab === 'ai-advisor' && (
                  <AIAdvisorPage theme={theme} onToggleTheme={toggleTheme} />
                )}
              </>
            )}
          </div>
        )}
      </main>
      
      {/* 4. Rich Academic Footer ONLY on Public Informational Pages */}
      {currentView !== 'platform' && currentView !== 'auth' && (
        <footer className="border-t border-slate-200/80 bg-white text-slate-600 text-xs">
          <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Col 1: Brand & Provenance */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                  G
                </span>
                <span className="text-base font-bold tracking-tight text-slate-900">
                  GIBI<span className="text-[#8C4A2F]">Connect</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ethiopia’s unified higher education intelligence platform. Dedicated to transparent university admissions, verified curricula, and grounded AI academic advisory.
              </p>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <span>●</span> 100% MoE & ETA Verified Records
              </div>
            </div>

            {/* Col 2: Platform Links */}
            <div className="space-y-2">
              <p className="font-serif font-bold text-slate-900 text-sm">Academic Gateway</p>
              <ul className="space-y-1.5 text-slate-500">
                <li>
                  <button 
                    onClick={() => {
                      setSelectedCampusId(null);
                      setActivePlatformTab('institutions');
                      setCurrentView('platform');
                    }} 
                    className="hover:text-slate-900 transition-colors"
                  >
                    19+ Universities Directory
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setSelectedCampusId(null);
                      setActivePlatformTab('admissions');
                      setCurrentView('platform');
                    }} 
                    className="hover:text-slate-900 transition-colors"
                  >
                    EUEE Cut-Off Calculator
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setSelectedCampusId(null);
                      setActivePlatformTab('programs');
                      setCurrentView('platform');
                    }} 
                    className="hover:text-slate-900 transition-colors"
                  >
                    Degree Programs Catalog
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setSelectedCampusId(null);
                      setActivePlatformTab('events');
                      setCurrentView('platform');
                    }} 
                    className="hover:text-slate-900 transition-colors"
                  >
                    Campus Events & Deadlines
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setSelectedCampusId(null);
                      setActivePlatformTab('resources');
                      setCurrentView('platform');
                    }} 
                    className="hover:text-slate-900 transition-colors"
                  >
                    Digital Syllabi & Past Exams
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: AI & Student Advisory */}
            <div className="space-y-2">
              <p className="font-serif font-bold text-slate-900 text-sm">Guidance & Support</p>
              <ul className="space-y-1.5 text-slate-500">
                <li>
                  <button 
                    onClick={() => {
                      setSelectedCampusId(null);
                      setActivePlatformTab('ai-advisor');
                      setCurrentView('platform');
                    }} 
                    className="hover:text-slate-900 transition-colors"
                  >
                    Grounded AI Academic Advisor
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setSelectedCampusId(null);
                      setActivePlatformTab('market');
                      setCurrentView('platform');
                    }} 
                    className="hover:text-slate-900 transition-colors"
                  >
                    Peer & Graduate Tutors
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setCurrentView('about')} 
                    className="hover:text-slate-900 transition-colors"
                  >
                    Data Provenance Architecture
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setCurrentView('contact')} 
                    className="hover:text-slate-900 transition-colors"
                  >
                    Registrar Data Submissions
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Regional Coverage */}
            <div className="space-y-2">
              <p className="font-serif font-bold text-slate-900 text-sm">Regional Coverage</p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Indexing public research hubs and accredited private colleges across Addis Ababa, Oromia, Amhara, Tigray, Sidama, SNNPR, Harari, and Dire Dawa.
              </p>
              <div className="pt-2 text-[11px] text-slate-400">
                Academic Year: <span className="font-semibold text-slate-700">2016/2017 E.C.</span>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-100 py-6 px-6 text-center text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto gap-2">
            <p>© 2026 GIBIConnect. Ethiopian Higher Education & AI Ecosystem. All rights reserved.</p>
            <p className="text-slate-400">Grounded in verified institutional bulletins & MoE standards.</p>
          </div>
        </footer>
      )}

    </div>
  );
}