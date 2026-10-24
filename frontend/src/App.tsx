import { useState, useEffect, useCallback } from 'react';
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
import { Building2, BookOpen, GraduationCap, FileText, ShoppingBag, Calendar, Sun, Moon } from 'lucide-react';

export type PlatformTab = 'institutions' | 'programs' | 'admissions' | 'events' | 'resources' | 'market' | 'ai-advisor';

function parseHash(hash: string): {
  view: PublicNavView | 'platform' | 'search';
  tab: PlatformTab;
  campusId: string | null;
} {
  const clean = hash.replace(/^#\/?/, '').trim();
  if (!clean || clean === 'home') {
    return { view: 'home', tab: 'institutions', campusId: null };
  }
  if (clean === 'about') return { view: 'about', tab: 'institutions', campusId: null };
  if (clean === 'services' || clean === 'features') return { view: 'services', tab: 'institutions', campusId: null };
  if (clean === 'contact') return { view: 'contact', tab: 'institutions', campusId: null };
  if (clean === 'auth') return { view: 'auth', tab: 'institutions', campusId: null };
  if (clean === 'search') return { view: 'search', tab: 'institutions', campusId: null };

  if (clean.startsWith('campus/') || clean.startsWith('campuses/')) {
    const campusId = clean.replace(/^campuses?\//, '').trim();
    return { view: 'platform', tab: 'institutions', campusId: campusId || null };
  }

  if (clean.startsWith('platform')) {
    const parts = clean.split('/');
    const tabName = parts[1] as PlatformTab;
    const validTabs: PlatformTab[] = ['institutions', 'programs', 'admissions', 'events', 'resources', 'market', 'ai-advisor'];
    return {
      view: 'platform',
      tab: validTabs.includes(tabName) ? tabName : 'institutions',
      campusId: null
    };
  }

  return { view: 'home', tab: 'institutions', campusId: null };
}

function buildHash(view: PublicNavView | 'platform' | 'search', tab: PlatformTab, campusId: string | null): string {
  if (view === 'platform') {
    if (campusId) return `#campus/${campusId}`;
    return `#platform/${tab}`;
  }
  if (view === 'home') return '#home';
  return `#${view}`;
}

export default function App() {
  const initialRoute = parseHash(typeof window !== 'undefined' ? window.location.hash : '');
  const [currentView, setCurrentView] = useState<PublicNavView | 'platform' | 'search'>(initialRoute.view);
  const [activePlatformTab, setActivePlatformTab] = useState<PlatformTab>(initialRoute.tab);
  const [selectedCampusId, setSelectedCampusId] = useState<string | null>(initialRoute.campusId);
  const [activeSearchQuery, setActiveSearchQuery] = useState<string>('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Navigation dispatcher that updates URL hash (enabling browser Back/Forward)
  const navigateTo = useCallback((view: PublicNavView | 'platform' | 'search', tab?: PlatformTab, campusId?: string | null) => {
    const targetTab = tab || 'institutions';
    const targetCampusId = campusId !== undefined ? campusId : null;
    const newHash = buildHash(view, targetTab, targetCampusId);
    
    if (window.location.hash !== newHash) {
      window.location.hash = newHash;
    }
    setCurrentView(view);
    setActivePlatformTab(targetTab);
    setSelectedCampusId(targetCampusId);
  }, []);

  // Listen for browser Back/Forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      const parsed = parseHash(window.location.hash);
      setCurrentView(parsed.view);
      setActivePlatformTab(parsed.tab);
      setSelectedCampusId(parsed.campusId);
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  // Auto-scroll to top when page, platform tab, or campus view changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentView, activePlatformTab, selectedCampusId]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSelectCampus = (id: string) => {
    navigateTo('platform', 'institutions', id);
  };

  const handleSearch = (query: string) => {
    setActiveSearchQuery(query);
    navigateTo('search');
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-zinc-950 text-slate-100' : 'bg-[#EBF4F7] text-[#0F172A]'} antialiased flex flex-col justify-between transition-colors duration-200`}>
      
      {/* 1. Public Landing Navigation Bar */}
      {currentView !== 'platform' && currentView !== 'auth' ? (
        <Navbar
          currentView={currentView === 'search' ? 'home' : currentView}
          onNavigate={(view) => {
            navigateTo(view);
          }}
          onGetStarted={() => {
            navigateTo('platform', 'institutions');
          }}
        />
      ) : null}

      {/* 2. Platform Feature Navigation Bar */}
      {currentView === 'platform' && (
        <header className={`sticky top-0 z-50 px-6 h-16 flex items-center justify-between shadow-sm transition-colors duration-200 ${
          theme === 'dark' ? 'bg-black border-b border-zinc-800 text-white' : 'bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] text-[#0F172A]'
        }`}>
          
          {/* Logo */}
          <div className="flex items-center gap-8">
            <button onClick={() => navigateTo('home')} className="flex items-center gap-2 group text-left cursor-pointer">
              <span className={`w-8 h-8 rounded-lg font-bold flex items-center justify-center text-sm tracking-tight transition-colors ${
                theme === 'dark' ? 'bg-white text-black group-hover:bg-[#5AA7A7] group-hover:text-white' : 'bg-[#0C373D] text-[#5AA7A7] group-hover:bg-[#072428]'
              }`}>
                G
              </span>
              <span className={`text-lg font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-[#0F172A]'}`}>
                GIBI<span className="text-[#5AA7A7]">Connect</span>
              </span>
            </button>

            {/* Direct Platform Feature Tabs - Hidden when in AI Advisor tab */}
            {activePlatformTab !== 'ai-advisor' && (
              <nav className={`hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider ${
                theme === 'dark' ? 'text-zinc-400' : 'text-[#64748B]'
              }`}>
                <button
                  onClick={() => navigateTo('platform', 'institutions', null)}
                  className={`flex items-center gap-1.5 transition-colors py-1 cursor-pointer ${activePlatformTab === 'institutions' && !selectedCampusId ? 'text-[#0C373D] font-bold border-b-2 border-[#0C373D]' : (theme === 'dark' ? 'hover:text-white' : 'hover:text-[#0F172A]')}`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Institutions</span>
                </button>
                <button
                  onClick={() => navigateTo('platform', 'programs', null)}
                  className={`flex items-center gap-1.5 transition-colors py-1 cursor-pointer ${activePlatformTab === 'programs' ? 'text-[#0C373D] font-bold border-b-2 border-[#0C373D]' : (theme === 'dark' ? 'hover:text-white' : 'hover:text-[#0F172A]')}`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Programs</span>
                </button>
                <button
                  onClick={() => navigateTo('platform', 'admissions', null)}
                  className={`flex items-center gap-1.5 transition-colors py-1 cursor-pointer ${activePlatformTab === 'admissions' ? 'text-[#0C373D] font-bold border-b-2 border-[#0C373D]' : (theme === 'dark' ? 'hover:text-white' : 'hover:text-[#0F172A]')}`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Admissions</span>
                </button>
                <button
                  onClick={() => navigateTo('platform', 'events', null)}
                  className={`flex items-center gap-1.5 transition-colors py-1 cursor-pointer ${activePlatformTab === 'events' ? 'text-[#0C373D] font-bold border-b-2 border-[#0C373D]' : (theme === 'dark' ? 'hover:text-white' : 'hover:text-[#0F172A]')}`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Events</span>
                </button>
                <button
                  onClick={() => navigateTo('platform', 'resources', null)}
                  className={`flex items-center gap-1.5 transition-colors py-1 cursor-pointer ${activePlatformTab === 'resources' ? 'text-[#0C373D] font-bold border-b-2 border-[#0C373D]' : (theme === 'dark' ? 'hover:text-white' : 'hover:text-[#0F172A]')}`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Resources</span>
                </button>
                <button
                  onClick={() => navigateTo('platform', 'market', null)}
                  className={`flex items-center gap-1.5 transition-colors py-1 cursor-pointer ${activePlatformTab === 'market' ? 'text-[#0C373D] font-bold border-b-2 border-[#0C373D]' : (theme === 'dark' ? 'hover:text-white' : 'hover:text-[#0F172A]')}`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Market</span>
                </button>
              </nav>
            )}
          </div>

          {/* Right Action: Light/Dark Toggle, AI Advisor Pill & Sign In */}
          <div className="flex items-center gap-3">
            {/* Header Theme Switcher */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                theme === 'dark' 
                  ? 'bg-zinc-900 border-zinc-700 text-[#5AA7A7] hover:bg-zinc-800' 
                  : 'bg-[#EBF4F7] border-[#E2E8F0] text-[#0C373D] hover:bg-[#E2EDF0]'
              }`}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                navigateTo('platform', 'ai-advisor', null);
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                activePlatformTab === 'ai-advisor'
                  ? 'bg-[#0C373D] text-white border-[#0C373D] shadow-sm'
                  : (theme === 'dark' ? 'text-[#5AA7A7] bg-zinc-900 border-zinc-700 hover:bg-zinc-800' : 'text-[#1E5C64] bg-[#EBF6F6] hover:bg-[#dceef0] border-[#5AA7A7]/30')
              }`}
            >
              <span>AI Advisor</span>
            </button>

            <button
              onClick={() => navigateTo('auth')}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                theme === 'dark' ? 'text-zinc-300 hover:text-white hover:bg-zinc-800' : 'text-[#0F172A] hover:bg-[#EBF4F7]'
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
              navigateTo('platform', 'institutions');
            }}
            onAbout={() => navigateTo('about')}
            onSearch={handleSearch}
            onSelectCampus={(id) => {
              navigateTo('platform', 'institutions', id);
            }}
          />
        )}

        {currentView === 'search' && (
          <SearchResultsPage
            initialQuery={activeSearchQuery}
            onBack={() => navigateTo('home')}
            onSelectCampus={(id) => {
              navigateTo('platform', 'institutions', id);
            }}
            theme={theme}
          />
        )}

        {currentView === 'about' && <AboutPage />}

        {currentView === 'services' && (
          <ServicesPage
            onContact={() => navigateTo('contact')}
            onNavigateToFeature={(tab) => navigateTo('platform', tab, null)}
          />
        )}

        {currentView === 'contact' && <ContactPage />}

        {currentView === 'auth' && (
          <AuthPage
            onBack={() => navigateTo('home')}
            onSuccess={() => navigateTo('platform', 'institutions')}
          />
        )}

        {/* Platform View with Campus Detail Drilldown */}
        {currentView === 'platform' && (
          <div>
            {selectedCampusId ? (
              <CampusDetailPage
                institutionId={selectedCampusId}
                onBack={() => navigateTo('platform', activePlatformTab, null)}
                onNavigateToTab={(tab) => {
                  navigateTo('platform', tab, null);
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
      
      {/* 4. Rich Academic Deep Ocean Footer ONLY on Public Informational Pages */}
      {currentView !== 'platform' && currentView !== 'auth' && (
        <footer className="border-t border-[#14474E] bg-[#0C373D] text-slate-300 text-xs">
          <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Col 1: Brand & Provenance */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <img
                  src="/images/brand/gibiconnect-icon.png"
                  alt="GIBIConnect"
                  className="w-7 h-7 object-contain rounded-md shadow-xs"
                />
                <span className="text-base font-bold tracking-tight text-white">
                  GIBI<span className="text-[#5AA7A7]">Connect</span>
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ethiopia’s unified higher education intelligence platform. Dedicated to transparent university admissions, verified curricula, and grounded AI academic advisory.
              </p>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#5AA7A7] bg-[#14474E]/80 px-2.5 py-1 rounded-full border border-[#5AA7A7]/40">
                <span>●</span> 100% MoE & ETA Verified Records
              </div>
            </div>

            {/* Col 2: Platform Links */}
            <div className="space-y-2">
              <p className="font-serif font-bold text-white text-sm">Academic Gateway</p>
              <ul className="space-y-1.5 text-slate-300">
                <li>
                  <button 
                    onClick={() => navigateTo('platform', 'institutions')} 
                    className="hover:text-[#5AA7A7] transition-colors cursor-pointer"
                  >
                    19+ Universities Directory
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigateTo('platform', 'admissions')} 
                    className="hover:text-[#5AA7A7] transition-colors cursor-pointer"
                  >
                    EUEE Cut-Off Calculator
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigateTo('platform', 'programs')} 
                    className="hover:text-[#5AA7A7] transition-colors cursor-pointer"
                  >
                    Degree Programs Catalog
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigateTo('platform', 'events')} 
                    className="hover:text-[#5AA7A7] transition-colors cursor-pointer"
                  >
                    Campus Events & Deadlines
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigateTo('platform', 'resources')} 
                    className="hover:text-[#5AA7A7] transition-colors cursor-pointer"
                  >
                    Digital Syllabi & Past Exams
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: AI & Student Advisory */}
            <div className="space-y-2">
              <p className="font-serif font-bold text-white text-sm">Guidance & Support</p>
              <ul className="space-y-1.5 text-slate-300">
                <li>
                  <button 
                    onClick={() => navigateTo('platform', 'ai-advisor')} 
                    className="hover:text-[#5AA7A7] transition-colors cursor-pointer"
                  >
                    Grounded AI Academic Advisor
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigateTo('platform', 'market')} 
                    className="hover:text-[#5AA7A7] transition-colors cursor-pointer"
                  >
                    Peer & Graduate Tutors
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigateTo('about')} 
                    className="hover:text-[#5AA7A7] transition-colors cursor-pointer"
                  >
                    Data Provenance Architecture
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigateTo('contact')} 
                    className="hover:text-[#5AA7A7] transition-colors cursor-pointer"
                  >
                    Registrar Data Submissions
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Regional Coverage */}
            <div className="space-y-2">
              <p className="font-serif font-bold text-white text-sm">Regional Coverage</p>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Indexing public research hubs and accredited private colleges across Addis Ababa, Oromia, Amhara, Tigray, Sidama, SNNPR, Harari, and Dire Dawa.
              </p>
              <div className="pt-2 text-[11px] text-slate-400">
                Academic Year: <span className="font-semibold text-white">2016/2017 E.C.</span>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="border-t border-[#14474E] py-6 px-6 text-center text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto gap-2">
            <p>© 2026 GIBIConnect. Ethiopian Higher Education & AI Ecosystem. All rights reserved.</p>
            <p className="text-slate-400">Grounded in verified institutional bulletins & MoE standards.</p>
          </div>
        </footer>
      )}

    </div>
  );
}