// GIBIConnect Single Page Application Engine
const API_BASE = 'http://localhost:5000/api';

// --- Global Application State ---
const state = {
  user: JSON.parse(localStorage.getItem('gibi_user') || 'null'),
  token: localStorage.getItem('gibi_token') || null,
  activeRoute: window.location.hash ? window.location.hash.slice(1) : '/',
  routeParams: {},
  activeTab: 'overview',
  authMode: 'login', // 'login' | 'register'
  isLoading: false,
  error: null,
  successMsg: null,
  
  // Data Caches
  institutions: [],
  selectedInstitution: null,
  programs: [],
  resources: [],
  research: [],
  admissions: [],
  scholarships: [],
  categories: [],
  tags: [],
  
  // Search & Filters
  filters: {
    region: 'all',
    type: 'all',
    ownership: 'all',
    degreeLevel: 'all',
    resourceType: 'all',
    search: ''
  },
  
  // AI Consultation Chat State
  ai: {
    messages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: "Hello! I am your **GIBIConnect Grounded AI Academic Advisor**. I can help you explore accredited Ethiopian universities, degree curricula, tuition schedules, admission criteria, scholarships, and verified research publications.\n\nHow can I guide your educational journey today?",
        sources: [],
        intent: 'GENERAL',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ],
    input: '',
    isThinking: false,
    selectedInstitutionContext: ''
  },
  
  // Modals & Viewers
  previewResource: null,
  isSearchModalOpen: false,
  searchQuery: '',
  searchResults: null,
  isSearchLoading: false,
  
  // Admin Data
  adminTab: 'moderation',
  pendingResources: [],
  auditLogs: [],
  usersList: []
};

// --- API Helper Client ---
async function apiCall(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  
  if (state.token) {
    headers['Authorization'] = `Bearer ${state.token}`;
  }
  
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    return { success: false, message: err.message };
  }
}

// --- Navigation & Router ---
function navigate(route, params = {}) {
  state.activeRoute = route;
  state.routeParams = params;
  window.location.hash = route;
  window.scrollTo(0, 0);
  render();
}

window.addEventListener('hashchange', () => {
  const hash = window.location.hash.slice(1) || '/';
  if (hash !== state.activeRoute) {
    state.activeRoute = hash;
    render();
  }
});

// --- Auth Operations ---
async function handleLogin(email, password) {
  state.isLoading = true;
  state.error = null;
  render();
  
  const res = await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  
  state.isLoading = false;
  if (res.success && res.data) {
    state.user = res.data.user;
    state.token = res.data.token;
    localStorage.setItem('gibi_user', JSON.stringify(res.data.user));
    localStorage.setItem('gibi_token', res.data.token);
    navigate('/institutions');
  } else {
    state.error = res.message || 'Login failed. Please check credentials.';
    render();
  }
}

async function handleRegister(fullName, email, password, role = 'user') {
  state.isLoading = true;
  state.error = null;
  render();
  
  const res = await apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ full_name: fullName, email, password, role })
  });
  
  state.isLoading = false;
  if (res.success && res.data) {
    state.user = res.data.user;
    state.token = res.data.token;
    localStorage.setItem('gibi_user', JSON.stringify(res.data.user));
    localStorage.setItem('gibi_token', res.data.token);
    navigate('/institutions');
  } else {
    state.error = res.message || 'Registration failed.';
    render();
  }
}

function handleLogout() {
  state.user = null;
  state.token = null;
  localStorage.removeItem('gibi_user');
  localStorage.removeItem('gibi_token');
  navigate('/');
}

function loginAsPersona(email, password) {
  handleLogin(email, password);
}

// --- Data Fetching ---
async function loadInstitutions() {
  if (state.institutions.length === 0) {
    const res = await apiCall('/institutions?limit=50');
    if (res.success && res.data) {
      state.institutions = res.data;
      render();
    }
  }
}

async function loadInstitutionDetail(id) {
  state.isLoading = true;
  render();
  const [instRes, facRes, progRes, admRes, tuiRes, schRes, facilRes, revRes, resRes, calRes] = await Promise.all([
    apiCall(`/institutions/${id}`),
    apiCall(`/institutions/${id}/faculties`),
    apiCall(`/institutions/${id}/programs`),
    apiCall(`/institutions/${id}/admissions`),
    apiCall(`/institutions/${id}/tuition`),
    apiCall(`/institutions/${id}/scholarships`),
    apiCall(`/institutions/${id}/facilities`),
    apiCall(`/institutions/${id}/reviews`),
    apiCall(`/institutions/${id}/resources`),
    apiCall(`/academic_calendar?institution_id=${id}`)
  ]);
  
  state.isLoading = false;
  state.selectedInstitution = {
    ...(instRes.data || {}),
    faculties: facRes.data || [],
    programs: progRes.data || [],
    admissions: admRes.data || [],
    tuition: tuiRes.data || [],
    scholarships: schRes.data || [],
    facilities: facilRes.data || [],
    reviews: revRes.data || [],
    resources: resRes.data || [],
    calendar: calRes.data || []
  };
  render();
}

async function loadPrograms() {
  if (state.programs.length === 0) {
    const res = await apiCall('/programs?limit=150');
    if (res.success && res.data) {
      state.programs = res.data;
      render();
    }
  }
}

async function loadResources() {
  if (state.resources.length === 0) {
    const res = await apiCall('/resources?limit=100');
    if (res.success && res.data) {
      state.resources = res.data;
      render();
    }
  }
}

async function loadResearch() {
  if (state.research.length === 0) {
    const res = await apiCall('/research?limit=50');
    if (res.success && res.data) {
      state.research = res.data;
      render();
    }
  }
}

async function loadScholarships() {
  if (state.scholarships.length === 0) {
    const res = await apiCall('/scholarships?limit=50');
    if (res.success && res.data) {
      state.scholarships = res.data;
      render();
    }
  }
}

async function loadAdminData() {
  const [resPending, usersRes] = await Promise.all([
    apiCall('/resources?status=pending'),
    apiCall('/users')
  ]);
  state.pendingResources = resPending.data || [];
  state.usersList = usersRes.data || [];
  render();
}

// --- AI Chat Service ---
async function sendAIMessage() {
  const prompt = state.ai.input.trim();
  if (!prompt || state.ai.isThinking) return;

  // Append user message
  state.ai.messages.push({
    id: 'user_' + Date.now(),
    role: 'user',
    content: prompt,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
  state.ai.input = '';
  state.ai.isThinking = true;
  render();

  const body = {
    prompt,
    institution_id: state.ai.selectedInstitutionContext || null
  };

  const res = await apiCall('/ai/chat', {
    method: 'POST',
    body: JSON.stringify(body)
  });

  state.ai.isThinking = false;
  if (res.success && res.data) {
    state.ai.messages.push({
      id: 'ai_' + Date.now(),
      role: 'assistant',
      content: res.data.answer || res.data.response,
      sources: res.data.sources || [],
      intent: res.data.intent || 'RAG',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  } else {
    state.ai.messages.push({
      id: 'ai_' + Date.now(),
      role: 'assistant',
      content: "I encountered a problem reaching the AI advisor engine. Please ensure Ollama and the backend server are running.",
      sources: [],
      intent: 'ERROR',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  }
  render();
}

// --- Moderation Operations ---
async function approveResource(id) {
  const res = await apiCall(`/resources/${id}/approve`, { method: 'PATCH' });
  if (res.success) {
    state.pendingResources = state.pendingResources.filter(r => r.id !== id);
    alert('Resource approved and indexed into public catalog.');
    render();
  }
}

async function rejectResource(id) {
  const reason = prompt('Enter rejection reason:') || 'Quality standards';
  const res = await apiCall(`/resources/${id}/reject`, {
    method: 'PATCH',
    body: JSON.stringify({ reason })
  });
  if (res.success) {
    state.pendingResources = state.pendingResources.filter(r => r.id !== id);
    render();
  }
}

// =========================================================================
// RENDERERS & VIEWS
// =========================================================================

function renderNavbar() {
  const user = state.user;
  const current = state.activeRoute;
  
  return `
    <header class="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center gap-3 cursor-pointer" onclick="navigate('/institutions')">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <i data-lucide="graduation-cap" class="w-6 h-6 text-white"></i>
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <span class="font-bold text-lg tracking-tight text-white">GIBI<span class="text-brand-400">Connect</span></span>
              <span class="px-1.5 py-0.5 text-[10px] font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20 rounded">ET Higher Ed</span>
            </div>
            <p class="text-[11px] text-slate-400 hidden sm:block">National Educational & AI Advisory</p>
          </div>
        </div>

        <!-- Catalog Nav Items -->
        <nav class="hidden md:flex items-center gap-1">
          <button onclick="navigate('/institutions')" class="px-3 py-1.5 rounded-lg text-sm font-medium transition ${current.startsWith('/institutions') ? 'bg-slate-800 text-brand-400' : 'text-slate-300 hover:text-white hover:bg-slate-900'}">
            Universities
          </button>
          <button onclick="navigate('/programs')" class="px-3 py-1.5 rounded-lg text-sm font-medium transition ${current === '/programs' ? 'bg-slate-800 text-brand-400' : 'text-slate-300 hover:text-white hover:bg-slate-900'}">
            Programs
          </button>
          <button onclick="navigate('/resources')" class="px-3 py-1.5 rounded-lg text-sm font-medium transition ${current === '/resources' ? 'bg-slate-800 text-brand-400' : 'text-slate-300 hover:text-white hover:bg-slate-900'}">
            Resources
          </button>
          <button onclick="navigate('/research')" class="px-3 py-1.5 rounded-lg text-sm font-medium transition ${current === '/research' ? 'bg-slate-800 text-brand-400' : 'text-slate-300 hover:text-white hover:bg-slate-900'}">
            Research
          </button>
          <button onclick="navigate('/scholarships')" class="px-3 py-1.5 rounded-lg text-sm font-medium transition ${current === '/scholarships' ? 'bg-slate-800 text-brand-400' : 'text-slate-300 hover:text-white hover:bg-slate-900'}">
            Scholarships
          </button>
          <button onclick="navigate('/ai-consultation')" class="px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${current === '/ai-consultation' ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' : 'text-emerald-400 hover:bg-brand-950/40'}">
            <i data-lucide="sparkles" class="w-4 h-4"></i> AI Advisor
          </button>
          ${user && (user.role === 'admin' || user.role === 'moderator') ? `
            <button onclick="navigate('/admin')" class="px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${current === '/admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-amber-400 hover:bg-amber-950/40'}">
              <i data-lucide="shield-check" class="w-4 h-4"></i> Admin Hub
            </button>
          ` : ''}
        </nav>

        <!-- User Controls -->
        <div class="flex items-center gap-3">
          ${user ? `
            <button onclick="navigate('/profile')" class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
              <div class="w-7 h-7 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-xs">
                ${user.full_name ? user.full_name[0] : 'U'}
              </div>
              <span class="text-xs font-medium text-slate-200 hidden sm:inline">${user.full_name || user.email}</span>
            </button>
            <button onclick="handleLogout()" title="Logout" class="p-2 text-slate-400 hover:text-rose-400 transition">
              <i data-lucide="log-out" class="w-5 h-5"></i>
            </button>
          ` : `
            <button onclick="navigate('/')" class="px-4 py-2 text-xs font-semibold rounded-lg bg-brand-600 hover:bg-brand-500 text-white transition shadow-lg shadow-brand-500/20">
              Sign In
            </button>
          `}
        </div>
      </div>
    </header>
  `;
}

// -------------------------------------------------------------------------
// 1. SPLIT-SCREEN LANDING & LOGIN PAGE (Root Route: /)
// -------------------------------------------------------------------------
function renderLandingLoginPage() {
  return `
    <div class="flex-1 flex min-h-screen">
      <!-- Left: Sleek Auth Form -->
      <div class="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 lg:p-16 z-10">
        <div>
          <!-- Brand -->
          <div class="flex items-center gap-3 mb-10">
            <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <i data-lucide="graduation-cap" class="w-6 h-6 text-white"></i>
            </div>
            <div>
              <span class="font-bold text-xl tracking-tight text-white">GIBI<span class="text-brand-400">Connect</span></span>
              <p class="text-xs text-slate-400">National Ethiopian Higher Education Gateway</p>
            </div>
          </div>

          <!-- Headline -->
          <div class="mb-8">
            <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Empowering Ethiopian Minds with <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-200">Grounded Intelligence</span>
            </h1>
            <p class="text-slate-400 text-sm mt-3 leading-relaxed">
              Explore 18 accredited universities, 114 degree programs, verified research, admissions deadlines, and conversational AI grounded in real academic facts.
            </p>
          </div>

          <!-- Error Alert -->
          ${state.error ? `
            <div class="p-4 mb-6 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-3">
              <i data-lucide="alert-circle" class="w-5 h-5 flex-shrink-0"></i>
              <span>${state.error}</span>
            </div>
          ` : ''}

          <!-- Form Tab -->
          <div class="flex border-b border-slate-800 mb-6">
            <button onclick="state.authMode='login'; render();" class="pb-3 px-4 font-semibold text-sm transition relative ${state.authMode === 'login' ? 'text-brand-400 border-b-2 border-brand-500' : 'text-slate-400 hover:text-slate-200'}">
              Sign In
            </button>
            <button onclick="state.authMode='register'; render();" class="pb-3 px-4 font-semibold text-sm transition relative ${state.authMode === 'register' ? 'text-brand-400 border-b-2 border-brand-500' : 'text-slate-400 hover:text-slate-200'}">
              Create Student Account
            </button>
          </div>

          <!-- Auth Form -->
          <form onsubmit="
            event.preventDefault();
            const form = event.target;
            if (state.authMode === 'login') {
              handleLogin(form.email.value, form.password.value);
            } else {
              handleRegister(form.fullName.value, form.email.value, form.password.value, form.role ? form.role.value : 'user');
            }
          " class="space-y-4 max-w-md">
            ${state.authMode === 'register' ? `
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1.5">Full Legal Name</label>
                <input name="fullName" type="text" required placeholder="Abebe Bikila" class="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-brand-500 focus:outline-none text-sm text-white placeholder-slate-500 transition">
              </div>
            ` : ''}

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Institutional or Personal Email</label>
              <input name="email" type="email" required placeholder="student@aau.edu.et" class="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-brand-500 focus:outline-none text-sm text-white placeholder-slate-500 transition">
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <input name="password" type="password" required placeholder="••••••••" class="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-brand-500 focus:outline-none text-sm text-white placeholder-slate-500 transition">
            </div>

            <button type="submit" ${state.isLoading ? 'disabled' : ''} class="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 text-white font-semibold text-sm transition shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2">
              ${state.isLoading ? `
                <i data-lucide="loader" class="w-4 h-4 animate-spin"></i> Processing...
              ` : (state.authMode === 'login' ? 'Sign In to Portal' : 'Complete Registration')}
            </button>
          </form>

          <!-- 1-Click Demo Personas -->
          <div class="mt-8 pt-6 border-t border-slate-800/80 max-w-md">
            <p class="text-[11px] font-semibold tracking-wider uppercase text-slate-400 mb-3 flex items-center gap-2">
              <i data-lucide="zap" class="w-3.5 h-3.5 text-amber-400"></i> Instant 1-Click Demo Personas
            </p>
            <div class="grid grid-cols-2 gap-2">
              <button onclick="loginAsPersona('admin@gibiconnect.edu.et', 'admin123')" class="p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-left transition group">
                <div class="text-xs font-bold text-amber-400 group-hover:text-amber-300 flex items-center gap-1.5">
                  <i data-lucide="shield" class="w-3.5 h-3.5"></i> Admin
                </div>
                <div class="text-[10px] text-slate-400 truncate">Dr. Ermias (Full Control)</div>
              </button>

              <button onclick="loginAsPersona('sara.hailu@bdu.edu.et', 'moderator123')" class="p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 text-left transition group">
                <div class="text-xs font-bold text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1.5">
                  <i data-lucide="check-circle" class="w-3.5 h-3.5"></i> Moderator
                </div>
                <div class="text-[10px] text-slate-400 truncate">Dr. Sara (BDU Faculty)</div>
              </button>

              <button onclick="loginAsPersona('abebe.bikila@aau.edu.et', 'student123')" class="p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-brand-500/40 text-left transition group">
                <div class="text-xs font-bold text-brand-400 group-hover:text-brand-300 flex items-center gap-1.5">
                  <i data-lucide="book-open" class="w-3.5 h-3.5"></i> Student
                </div>
                <div class="text-[10px] text-slate-400 truncate">Abebe Bikila (AAU)</div>
              </button>

              <button onclick="navigate('/institutions')" class="p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 text-left transition group">
                <div class="text-xs font-bold text-slate-300 group-hover:text-white flex items-center gap-1.5">
                  <i data-lucide="compass" class="w-3.5 h-3.5"></i> Guest Browse
                </div>
                <div class="text-[10px] text-slate-400 truncate">Explore without login</div>
              </button>
            </div>
          </div>
        </div>

        <!-- Footer Note -->
        <div class="text-[11px] text-slate-400 mt-8">
          © 2026 GIBIConnect. Powered by PostgreSQL 16, pgvector, and Ollama AI.
        </div>
      </div>

      <!-- Right: Split-Screen Bespoke Showcase with User's Uploaded 3D Character -->
      <div class="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#0c1427] via-[#09101f] to-[#040813] items-center justify-center p-12 overflow-hidden border-l border-slate-800/80">
        <!-- Ambient Glow Backdrops -->
        <div class="absolute w-[500px] h-[500px] rounded-full bg-brand-500/10 blur-3xl pointer-events-none top-1/4 left-1/4 animate-pulse-soft"></div>
        <div class="absolute w-[400px] h-[400px] rounded-full bg-amber-500/10 blur-3xl pointer-events-none bottom-10 right-10"></div>

        <!-- Center 3D Character Graphic Frame -->
        <div class="relative z-10 max-w-md w-full flex flex-col items-center">
          <div class="relative w-80 sm:w-96">
            <!-- Center 3D Student Illustration -->
            <img src="/assets/hero_character.png" alt="GIBIConnect Academic Showcase" class="w-full h-auto drop-shadow-2xl select-none object-contain animate-float-slow">

            <!-- Floating Card 1: Create -->
            <div class="absolute -top-6 -left-12 glass-card p-3.5 rounded-2xl shadow-xl border border-white/10 w-56 animate-float-medium">
              <div class="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <span>1. Create</span>
              </div>
              <p class="text-xs text-slate-200 font-medium">Photosynthesis converts sunlight into energy.</p>
              <div class="flex gap-1.5 mt-2">
                <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-500/20 text-brand-300">True</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400">False</span>
              </div>
            </div>

            <!-- Floating Card 2: Evaluate -->
            <div class="absolute top-1/2 -left-16 glass-card p-3.5 rounded-2xl shadow-xl border border-white/10 w-48 animate-float-fast">
              <div class="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                2. Evaluate
              </div>
              <div class="flex items-center justify-between mt-1">
                <span class="text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded">82% Score</span>
                <span class="text-xs text-rose-400 font-bold">♥ 4 / 5</span>
              </div>
              <p class="text-[11px] text-slate-300 mt-1 font-semibold">Nice work!</p>
            </div>

            <!-- Floating Card 3: Track -->
            <div class="absolute -bottom-8 -right-8 glass-card p-4 rounded-2xl shadow-xl border border-white/10 w-60 animate-float-slow">
              <div class="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>3. Track</span>
                <span class="text-emerald-400 text-[10px]">Active</span>
              </div>
              <div class="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-[11px] text-emerald-200 mb-2">
                🎉 Breakthrough in mastery of curriculum
              </div>
              <!-- Sparkline SVG -->
              <svg class="w-full h-8 stroke-brand-400 fill-none" viewBox="0 0 100 25">
                <path d="M 0 20 Q 25 15 50 8 T 100 2" stroke-width="2.5" stroke-linecap="round"/>
              </svg>
            </div>

            <!-- Floating Card 4: Personalise -->
            <div class="absolute -top-4 -right-10 glass-card p-3.5 rounded-2xl shadow-xl border border-white/10 w-48 animate-float-medium">
              <div class="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1">
                4. Personalise
              </div>
              <div class="flex items-center gap-2 mt-1">
                <div class="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs">☀️</div>
                <div class="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs">🌿</div>
                <span class="text-[11px] text-slate-300 font-medium">Goal Match</span>
              </div>
            </div>
          </div>

          <!-- Bottom Micro Metrics -->
          <div class="grid grid-cols-3 gap-4 w-full mt-12 pt-6 border-t border-slate-800/80 text-center">
            <div>
              <div class="text-lg font-extrabold text-white">18</div>
              <div class="text-[10px] text-slate-400 uppercase">Universities</div>
            </div>
            <div>
              <div class="text-lg font-extrabold text-brand-400">114</div>
              <div class="text-[10px] text-slate-400 uppercase">Degrees</div>
            </div>
            <div>
              <div class="text-lg font-extrabold text-amber-400">768-d</div>
              <div class="text-[10px] text-slate-400 uppercase">pgvector RAG</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------------------
// 2. INSTITUTIONS DIRECTORY PAGE (/institutions)
// -------------------------------------------------------------------------
function renderInstitutionsPage() {
  loadInstitutions();

  const filtered = state.institutions.filter(inst => {
    if (state.filters.region !== 'all' && inst.region !== state.filters.region) return false;
    if (state.filters.type !== 'all' && inst.type !== state.filters.type) return false;
    if (state.filters.ownership !== 'all' && inst.ownership !== state.filters.ownership) return false;
    if (state.filters.search) {
      const q = state.filters.search.toLowerCase();
      return (inst.name || '').toLowerCase().includes(q) || (inst.city || '').toLowerCase().includes(q);
    }
    return true;
  });

  const regions = [...new Set(state.institutions.map(i => i.region).filter(Boolean))];

  return `
    ${renderNavbar()}
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white">Accredited Higher Education Institutions</h1>
          <p class="text-slate-400 text-sm mt-1">Directory of 18 premier public and private universities and colleges across Ethiopia.</p>
        </div>
        <div class="flex items-center gap-2">
          <input type="text" placeholder="Filter by name or city..." value="${state.filters.search}" oninput="state.filters.search=this.value; render();" class="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 w-64">
        </div>
      </div>

      <!-- Filter Chips -->
      <div class="flex flex-wrap items-center gap-2 mb-6 text-xs">
        <span class="text-slate-400 font-semibold mr-1">Region:</span>
        <button onclick="state.filters.region='all'; render();" class="px-3 py-1.5 rounded-lg ${state.filters.region === 'all' ? 'bg-brand-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}">All Regions</button>
        ${regions.map(r => `
          <button onclick="state.filters.region='${r}'; render();" class="px-3 py-1.5 rounded-lg ${state.filters.region === r ? 'bg-brand-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}">${r}</button>
        `).join('')}
      </div>

      <!-- Institution Card Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${filtered.map(inst => `
          <div onclick="navigate('/institutions/' + '${inst.id}')" class="group glass-card rounded-2xl p-5 border border-slate-800/80 hover:border-brand-500/50 transition cursor-pointer flex flex-col justify-between hover:shadow-xl hover:shadow-brand-950/20">
            <div>
              <!-- Cover Image & Logo Header -->
              <div class="relative h-36 -mx-5 -mt-5 mb-4 rounded-t-2xl overflow-hidden bg-slate-900">
                <img src="${inst.cover_image_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600'}" alt="${inst.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                <div class="absolute bottom-3 left-4 flex items-center gap-3">
                  <div class="w-12 h-12 rounded-xl bg-slate-900 border-2 border-slate-800 overflow-hidden shadow-lg flex-shrink-0">
                    <img src="${inst.logo_url || 'assets/logos/university_default_logo.svg'}" alt="${inst.name} Seal" class="w-full h-full object-cover">
                  </div>
                  <div>
                    <span class="px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${inst.ownership === 'public' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}">
                      ${inst.ownership} ${inst.type}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Title & Location -->
              <h3 class="font-bold text-lg text-white group-hover:text-brand-400 transition leading-snug">${inst.name}</h3>
              <p class="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                <i data-lucide="map-pin" class="w-3.5 h-3.5 text-brand-500"></i> ${inst.city}, ${inst.region}
              </p>
              <p class="text-xs text-slate-300 line-clamp-2 mt-2.5 leading-relaxed">
                ${inst.description || 'Public comprehensive higher education institution.'}
              </p>
            </div>

            <!-- Footer Stats & Rating -->
            <div class="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div class="flex items-center gap-1 text-amber-400 font-bold">
                <span>★ ${inst.average_rating ? Number(inst.average_rating).toFixed(1) : '4.8'}</span>
                <span class="text-slate-400 font-normal">(${inst.review_count || 12})</span>
              </div>
              <span class="text-brand-400 font-semibold group-hover:translate-x-0.5 transition flex items-center gap-1">
                Campus Hub <i data-lucide="chevron-right" class="w-4 h-4"></i>
              </span>
            </div>
          </div>
        `).join('')}
      </div>
    </main>
  `;
}

// -------------------------------------------------------------------------
// 3. INSTITUTION DETAIL & 10-TAB CAMPUS HUB (/institutions/:id)
// -------------------------------------------------------------------------
function renderInstitutionDetail() {
  const inst = state.selectedInstitution;
  if (!inst) {
    return `${renderNavbar()}<div class="p-16 text-center text-slate-400">Loading campus hub records...</div>`;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'info' },
    { id: 'departments', label: 'Faculties & Depts', icon: 'layers' },
    { id: 'programs', label: 'Degree Programs', icon: 'graduation-cap' },
    { id: 'admissions', label: 'Admissions Criteria', icon: 'calendar-clock' },
    { id: 'tuition', label: 'Tuition & Fees', icon: 'credit-card' },
    { id: 'scholarships', label: 'Scholarships', icon: 'gift' },
    { id: 'facilities', label: 'Campus Facilities', icon: 'building' },
    { id: 'reviews', label: 'Student Reviews', icon: 'star' },
    { id: 'resources', label: 'Course Documents', icon: 'file-text' },
    { id: 'calendar', label: 'Academic Calendar', icon: 'calendar' }
  ];

  return `
    ${renderNavbar()}
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
      <!-- Breadcrumb -->
      <div class="flex items-center gap-2 text-xs text-slate-400 mb-4">
        <span class="cursor-pointer hover:text-white" onclick="navigate('/institutions')">Universities</span>
        <span>/</span>
        <span class="text-brand-400 font-medium">${inst.name}</span>
      </div>

      <!-- Master Hero Banner -->
      <div class="relative h-64 sm:h-72 rounded-3xl overflow-hidden glass-card mb-6 border border-slate-800">
        <img src="${inst.cover_image_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200'}" alt="${inst.name}" class="w-full h-full object-cover opacity-70">
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>
        <div class="absolute bottom-6 left-6 sm:left-8 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-20 h-20 rounded-2xl bg-slate-900 border-2 border-white/20 overflow-hidden shadow-2xl flex-shrink-0">
              <img src="${inst.logo_url || 'assets/logos/university_default_logo.svg'}" alt="${inst.name} Seal" class="w-full h-full object-cover">
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${inst.ownership === 'public' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}">
                  ${inst.ownership} ${inst.type}
                </span>
                <span class="px-2 py-0.5 text-[10px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 rounded">
                  ✓ Verified Higher Ed
                </span>
              </div>
              <h1 class="text-2xl sm:text-3xl font-extrabold text-white">${inst.name}</h1>
              <p class="text-xs text-slate-300 flex items-center gap-2 mt-1">
                <i data-lucide="map-pin" class="w-3.5 h-3.5 text-brand-400"></i> ${inst.city}, ${inst.region} | ${inst.website_url || 'Official University'}
              </p>
            </div>
          </div>

          <div class="flex gap-2">
            <button onclick="
              state.ai.selectedInstitutionContext = '${inst.id}';
              navigate('/ai-consultation');
            " class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-lg shadow-brand-600/30">
              <i data-lucide="sparkles" class="w-4 h-4"></i> Ask AI About This University
            </button>
          </div>
        </div>
      </div>

      <!-- 10 Sub-Tabs Navigation Bar -->
      <div class="flex border-b border-slate-800 overflow-x-auto gap-1 mb-6 pb-1">
        ${tabs.map(t => `
          <button onclick="state.activeTab='${t.id}'; render();" class="px-3.5 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition flex items-center gap-1.5 ${state.activeTab === t.id ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}">
            <i data-lucide="${t.icon}" class="w-3.5 h-3.5"></i> ${t.label}
          </button>
        `).join('')}
      </div>

      <!-- Sub-Tab Content -->
      <div class="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800">
        ${renderSubTabContent(inst)}
      </div>
    </div>
  `;
}

function renderSubTabContent(inst) {
  const tab = state.activeTab;

  if (tab === 'overview') {
    return `
      <div class="space-y-6">
        <div>
          <h3 class="text-base font-bold text-white mb-2">Institutional Overview & History</h3>
          <p class="text-sm text-slate-300 leading-relaxed">${inst.description || 'Comprehensive higher education institution in Ethiopia.'}</p>
          ${inst.history ? `<p class="text-sm text-slate-400 mt-3 leading-relaxed">${inst.history}</p>` : ''}
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
          <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span class="text-xs text-slate-400">Campus Location</span>
            <div class="text-sm font-bold text-white mt-1">${inst.city}, ${inst.region}</div>
          </div>
          <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span class="text-xs text-slate-400">Contact Registrar</span>
            <div class="text-sm font-bold text-white mt-1">${inst.email || 'info@' + inst.slug + '.edu.et'}</div>
          </div>
          <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span class="text-xs text-slate-400">Official Portal</span>
            <div class="text-sm font-bold text-brand-400 mt-1">
              <a href="${inst.website_url || '#'}" target="_blank" class="hover:underline flex items-center gap-1">Visit Website <i data-lucide="external-link" class="w-3 h-3"></i></a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (tab === 'departments') {
    return `
      <div>
        <h3 class="text-base font-bold text-white mb-4">Faculties, Colleges & Departments</h3>
        ${inst.faculties && inst.faculties.length > 0 ? `
          <div class="space-y-4">
            ${inst.faculties.map(f => `
              <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <h4 class="font-bold text-sm text-brand-300 flex items-center gap-2">
                  <i data-lucide="folder" class="w-4 h-4"></i> ${f.name}
                </h4>
                <p class="text-xs text-slate-400 mt-1">${f.description || 'Academic faculty division.'}</p>
              </div>
            `).join('')}
          </div>
        ` : '<p class="text-xs text-slate-400">No faculty records loaded for this institution.</p>'}
      </div>
    `;
  }

  if (tab === 'programs') {
    return `
      <div>
        <h3 class="text-base font-bold text-white mb-4">Degree Programs Offered</h3>
        ${inst.programs && inst.programs.length > 0 ? `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${inst.programs.map(p => `
              <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div class="flex items-center gap-2 mb-1.5">
                    <span class="px-2 py-0.5 text-[10px] font-bold rounded bg-brand-500/20 text-brand-300 uppercase">
                      ${p.degree_level || 'Degree'}
                    </span>
                    <span class="text-xs text-slate-400">⏱ ${p.duration || '4 Years'}</span>
                  </div>
                  <h4 class="font-bold text-sm text-white">${p.name}</h4>
                  <p class="text-xs text-slate-400 mt-1 line-clamp-2">${p.description || 'Degree program.'}</p>
                </div>
              </div>
            `).join('')}
          </div>
        ` : '<p class="text-xs text-slate-400">No programs attached to this institution.</p>'}
      </div>
    `;
  }

  if (tab === 'facilities') {
    return `
      <div>
        <h3 class="text-base font-bold text-white mb-4">Campus Facilities & Research Laboratories</h3>
        ${inst.facilities && inst.facilities.length > 0 ? `
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            ${inst.facilities.map(fac => {
              let photo = 'https://images.unsplash.com/photo-1568667256549-094345857637?w=600';
              if (fac.type === 'computer_lab') photo = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600';
              if (fac.type === 'sports_facility') photo = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600';
              if (fac.type === 'medical_services') photo = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600';
              return `
                <div class="rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                  <div class="h-32 bg-slate-800 relative">
                    <img src="${photo}" alt="${fac.name}" class="w-full h-full object-cover">
                    <span class="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950/80 text-brand-400 uppercase">
                      ${fac.type}
                    </span>
                  </div>
                  <div class="p-3.5">
                    <h4 class="font-bold text-sm text-white">${fac.name}</h4>
                    <p class="text-xs text-slate-400 mt-1 line-clamp-2">${fac.description}</p>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        ` : '<p class="text-xs text-slate-400">No facility records found.</p>'}
      </div>
    `;
  }

  if (tab === 'admissions') {
    return `
      <div>
        <h3 class="text-base font-bold text-white mb-4">Admissions & Eligibility Windows</h3>
        ${inst.admissions && inst.admissions.length > 0 ? `
          <div class="space-y-4">
            ${inst.admissions.map(adm => `
              <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div class="flex items-center justify-between mb-2">
                  <span class="px-2 py-0.5 text-[10px] font-bold rounded bg-brand-500/20 text-brand-300 uppercase">
                    ${adm.degree_level} Intake
                  </span>
                  <span class="text-xs text-amber-400 font-semibold">
                    Deadline: ${adm.application_end || '2026-08-31'}
                  </span>
                </div>
                <div class="text-xs text-slate-300 font-medium">Requirements:</div>
                <p class="text-xs text-slate-400 mt-0.5">${adm.requirements || 'National entrance exam qualifications apply.'}</p>
              </div>
            `).join('')}
          </div>
        ` : '<p class="text-xs text-slate-400">Admissions criteria will be published soon.</p>'}
      </div>
    `;
  }

  if (tab === 'tuition') {
    return `
      <div>
        <h3 class="text-base font-bold text-white mb-4">Tuition Fees & Academic Costs</h3>
        ${inst.tuition && inst.tuition.length > 0 ? `
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-300">
              <thead class="bg-slate-900 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th class="p-3 rounded-l-lg">Program / Level</th>
                  <th class="p-3">Fee Amount</th>
                  <th class="p-3">Billing Period</th>
                  <th class="p-3 rounded-r-lg">Currency</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800">
                ${inst.tuition.map(t => `
                  <tr>
                    <td class="p-3 font-semibold text-white">${t.program_name || 'Standard Undergraduate'}</td>
                    <td class="p-3 font-bold text-emerald-400">${Number(t.amount).toLocaleString()}</td>
                    <td class="p-3 text-slate-400">${t.period}</td>
                    <td class="p-3 text-slate-400">${t.currency || 'ETB'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : '<p class="text-xs text-slate-400">Tuition schedule not required for state-sponsored programs.</p>'}
      </div>
    `;
  }

  if (tab === 'resources') {
    return `
      <div>
        <h3 class="text-base font-bold text-white mb-4">University Course Materials & Documents</h3>
        ${inst.resources && inst.resources.length > 0 ? `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${inst.resources.map(r => `
              <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center font-bold text-xs">
                    ${(r.file_extension || 'PDF').toUpperCase()}
                  </div>
                  <div>
                    <h5 class="font-bold text-xs text-white line-clamp-1">${r.title}</h5>
                    <span class="text-[10px] text-slate-400">${(r.file_size_bytes / (1024 * 1024)).toFixed(2)} MB</span>
                  </div>
                </div>
                <a href="${API_BASE}/resources/${r.id}/download" target="_blank" class="p-2 rounded-lg bg-slate-800 hover:bg-brand-600 text-slate-300 hover:text-white transition">
                  <i data-lucide="download" class="w-4 h-4"></i>
                </a>
              </div>
            `).join('')}
          </div>
        ` : '<p class="text-xs text-slate-400">No resources linked to this institution.</p>'}
      </div>
    `;
  }

  return `<p class="text-xs text-slate-400">Data records for ${tab} will appear here.</p>`;
}

// -------------------------------------------------------------------------
// 4. DEGREE PROGRAMS CATALOG PAGE (/programs)
// -------------------------------------------------------------------------
function renderProgramsPage() {
  loadPrograms();

  const filtered = state.programs.filter(p => {
    if (state.filters.degreeLevel !== 'all' && p.degree_level !== state.filters.degreeLevel) return false;
    if (state.filters.search) {
      const q = state.filters.search.toLowerCase();
      return (p.name || '').toLowerCase().includes(q) || (p.institution_name || '').toLowerCase().includes(q);
    }
    return true;
  });

  return `
    ${renderNavbar()}
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white">Degree Programs & Curricula</h1>
          <p class="text-slate-400 text-sm mt-1">Explore 114 accredited degree offerings across undergraduate and postgraduate divisions.</p>
        </div>
        <input type="text" placeholder="Search programs..." value="${state.filters.search}" oninput="state.filters.search=this.value; render();" class="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 w-64">
      </div>

      <!-- Filter Buttons -->
      <div class="flex gap-2 mb-6 text-xs">
        <button onclick="state.filters.degreeLevel='all'; render();" class="px-3 py-1.5 rounded-lg ${state.filters.degreeLevel === 'all' ? 'bg-brand-600 text-white' : 'bg-slate-900 text-slate-400'}">All Levels</button>
        <button onclick="state.filters.degreeLevel='bachelor'; render();" class="px-3 py-1.5 rounded-lg ${state.filters.degreeLevel === 'bachelor' ? 'bg-brand-600 text-white' : 'bg-slate-900 text-slate-400'}">Bachelor</button>
        <button onclick="state.filters.degreeLevel='master'; render();" class="px-3 py-1.5 rounded-lg ${state.filters.degreeLevel === 'master' ? 'bg-brand-600 text-white' : 'bg-slate-900 text-slate-400'}">Master</button>
        <button onclick="state.filters.degreeLevel='phd'; render();" class="px-3 py-1.5 rounded-lg ${state.filters.degreeLevel === 'phd' ? 'bg-brand-600 text-white' : 'bg-slate-900 text-slate-400'}">PhD</button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${filtered.map(p => `
          <div class="glass-card rounded-2xl p-5 border border-slate-800 hover:border-brand-500/40 transition flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="px-2 py-0.5 text-[10px] font-bold rounded uppercase bg-brand-500/20 text-brand-300">
                  ${p.degree_level}
                </span>
                <span class="text-xs text-slate-400">⏱ ${p.duration || '4 Years'}</span>
              </div>
              <h3 class="font-bold text-base text-white mt-1">${p.name}</h3>
              <p class="text-xs text-brand-400 font-semibold mt-0.5">${p.institution_name || 'Accredited University'}</p>
              <p class="text-xs text-slate-300 mt-2 line-clamp-2">${p.description || 'Curriculum framework.'}</p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span class="text-slate-400">Mode: ${p.study_mode || 'Full Time'}</span>
              <button onclick="
                state.ai.input = 'Tell me about the curriculum and admission requirements for ' + '${p.name}' + ' at ' + '${p.institution_name}';
                navigate('/ai-consultation');
              " class="text-brand-400 font-semibold hover:underline flex items-center gap-1">
                Ask AI <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </main>
  `;
}

// -------------------------------------------------------------------------
// 5. ACADEMIC RESOURCES LIBRARY (/resources)
// -------------------------------------------------------------------------
function renderResourcesPage() {
  loadResources();

  return `
    ${renderNavbar()}
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white">Academic Resources Library</h1>
          <p class="text-slate-400 text-sm mt-1">Multi-format educational materials across PDF, DOCX, XLSX, PPTX, EPUB, Video, and Audio.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${state.resources.map(res => `
          <div class="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between hover:border-brand-500/40 transition">
            <div>
              <div class="flex items-center justify-between mb-3">
                <span class="px-2.5 py-1 rounded-lg text-xs font-bold uppercase bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  ${(res.file_extension || 'PDF').toUpperCase()}
                </span>
                <span class="text-xs text-slate-400">${((res.file_size_bytes || 1000000) / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
              <h3 class="font-bold text-base text-white leading-snug">${res.title}</h3>
              <p class="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">${res.description || 'Educational resource material.'}</p>
            </div>

            <div class="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
              <a href="${API_BASE}/resources/${res.id}/stream" target="_blank" class="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition">
                <i data-lucide="eye" class="w-3.5 h-3.5"></i> Stream
              </a>
              <a href="${API_BASE}/resources/${res.id}/download" target="_blank" class="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-md shadow-brand-600/20">
                <i data-lucide="download" class="w-3.5 h-3.5"></i> Download
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    </main>
  `;
}

// -------------------------------------------------------------------------
// 6. RESEARCH REPOSITORY (/research)
// -------------------------------------------------------------------------
function renderResearchPage() {
  loadResearch();

  return `
    ${renderNavbar()}
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-white">Scientific Research & Publications</h1>
        <p class="text-slate-400 text-sm mt-1">Graduate theses, peer-reviewed articles, and conference papers from Ethiopian institutions.</p>
      </div>

      <div class="space-y-4">
        ${state.research.map(paper => `
          <div class="glass-card rounded-2xl p-6 border border-slate-800 hover:border-brand-500/40 transition">
            <div class="flex items-center gap-2 mb-2">
              <span class="px-2 py-0.5 text-[10px] font-bold rounded uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                ${paper.research_type || 'Paper'}
              </span>
              <span class="text-xs text-slate-400">Year: ${paper.publication_year || 2026}</span>
              ${paper.doi ? `<span class="text-xs text-brand-400">DOI: ${paper.doi}</span>` : ''}
            </div>

            <h3 class="font-bold text-lg text-white leading-snug">${paper.title}</h3>
            <p class="text-xs text-slate-300 mt-2 leading-relaxed">${paper.abstract || 'Scientific abstract.'}</p>

            <div class="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <div class="text-slate-400">
                Affiliation: <span class="text-slate-200 font-medium">${paper.institution_name || 'Addis Ababa University'}</span>
              </div>
              <button onclick="
                state.ai.input = 'Summarize the research paper: ' + '${paper.title}' + ' and explain its methodology';
                navigate('/ai-consultation');
              " class="text-brand-400 font-semibold hover:underline flex items-center gap-1">
                AI Summary <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </main>
  `;
}

// -------------------------------------------------------------------------
// 7. SCHOLARSHIPS HUB (/scholarships)
// -------------------------------------------------------------------------
function renderScholarshipsPage() {
  loadScholarships();

  return `
    ${renderNavbar()}
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-white">Scholarships & Financial Aid</h1>
        <p class="text-slate-400 text-sm mt-1">Institutional grants, merit scholarships, and STEM support packages.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${state.scholarships.map(s => `
          <div class="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500/20 text-amber-300 uppercase">
                  Active Grant
                </span>
                <span class="text-xs text-slate-400">Deadline: ${s.deadline || '2026-08-31'}</span>
              </div>
              <h3 class="font-bold text-lg text-white">${s.name}</h3>
              <p class="text-xs text-emerald-400 font-semibold mt-1">Coverage: ${s.funding || 'Tuition Assistance'}</p>
              <p class="text-xs text-slate-300 mt-2.5 leading-relaxed">${s.description}</p>
              <div class="mt-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                <span class="font-bold text-slate-200">Eligibility:</span> ${s.eligibility || 'Merit and academic achievement.'}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </main>
  `;
}

// -------------------------------------------------------------------------
// 8. AI ADVISOR WORKSPACE (/ai-consultation)
// -------------------------------------------------------------------------
function renderAIConsultationPage() {
  loadInstitutions();

  return `
    ${renderNavbar()}
    <main class="max-w-5xl mx-auto px-4 py-6 flex-1 flex flex-col h-[calc(100vh-4rem)]">
      <!-- Top Title & Institution Filter -->
      <div class="flex items-center justify-between pb-4 border-b border-slate-800">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <i data-lucide="sparkles" class="w-5 h-5 text-white"></i>
          </div>
          <div>
            <h2 class="font-extrabold text-base text-white">Grounded AI Academic Advisor</h2>
            <p class="text-[11px] text-slate-400">Strictly powered by PostgreSQL 16, pgvector, and Ollama Llama 3.2</p>
          </div>
        </div>

        <div>
          <select onchange="state.ai.selectedInstitutionContext = this.value; render();" class="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500">
            <option value="">National Context (All Universities)</option>
            ${state.institutions.map(i => `
              <option value="${i.id}" ${state.ai.selectedInstitutionContext === i.id ? 'selected' : ''}>${i.name}</option>
            `).join('')}
          </select>
        </div>
      </div>

      <!-- Messages Thread Scroll Area -->
      <div id="ai-chat-thread" class="flex-1 overflow-y-auto py-6 space-y-6 pr-2">
        ${state.ai.messages.map(msg => `
          <div class="flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}">
            <div class="max-w-2xl ${msg.role === 'user' ? 'bg-brand-600 text-white rounded-2xl rounded-tr-none px-4 py-3 shadow-lg shadow-brand-600/20' : 'glass-card text-slate-100 rounded-2xl rounded-tl-none p-5 border border-slate-800'}">
              
              ${msg.role === 'assistant' ? `
                <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[10px] text-slate-400">
                  <span class="font-bold text-brand-400 flex items-center gap-1">
                    <i data-lucide="bot" class="w-3.5 h-3.5"></i> GIBIConnect Advisor
                  </span>
                  ${msg.intent ? `<span class="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">${msg.intent}</span>` : ''}
                </div>
              ` : ''}

              <div class="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">${msg.content}</div>

              <!-- Attributed Sources Box -->
              ${msg.sources && msg.sources.length > 0 ? `
                <div class="mt-4 pt-3 border-t border-slate-800/80">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-2">
                    <i data-lucide="book-open" class="w-3.5 h-3.5 text-brand-400"></i> Attributed Grounded Sources:
                  </span>
                  <div class="space-y-1.5">
                    ${msg.sources.map(s => `
                      <div class="p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] flex items-center justify-between">
                        <span class="text-slate-200 font-medium truncate max-w-xs">${s.title}</span>
                        <span class="text-brand-400 font-bold text-[10px]">
                          ${s.similarity ? (Number(s.similarity) * 100).toFixed(0) + '% Match' : 'Verified'}
                        </span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              <div class="text-[10px] text-slate-400 text-right mt-1.5">${msg.timestamp}</div>
            </div>
          </div>
        `).join('')}

        ${state.ai.isThinking ? `
          <div class="flex justify-start">
            <div class="glass-card p-4 rounded-2xl rounded-tl-none border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <i data-lucide="loader" class="w-4 h-4 animate-spin text-brand-400"></i> Grounding query against pgvector and Llama 3.2...
            </div>
          </div>
        ` : ''}
      </div>

      <!-- Quick Prompt Suggestions -->
      <div class="flex flex-wrap gap-2 py-2 text-[11px]">
        <button onclick="state.ai.input='Which universities offer Computer Science and Software Engineering?'; sendAIMessage();" class="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition">
          💻 CS Programs
        </button>
        <button onclick="state.ai.input='What are the admission requirements for graduate AI programs?'; sendAIMessage();" class="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition">
          📋 AI Admission GPA
        </button>
        <button onclick="state.ai.input='Tell me about scholarships available in Ethiopian universities'; sendAIMessage();" class="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition">
          🎁 Scholarships
        </button>
      </div>

      <!-- Input Bar -->
      <form onsubmit="event.preventDefault(); sendAIMessage();" class="flex gap-2 pt-2">
        <input type="text" placeholder="Ask any question about Ethiopian universities, admissions, or research..." value="${state.ai.input}" oninput="state.ai.input=this.value;" class="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 focus:outline-none focus:border-brand-500 text-xs text-white placeholder-slate-500 transition">
        <button type="submit" ${state.ai.isThinking ? 'disabled' : ''} class="px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition flex items-center gap-2 shadow-lg shadow-brand-600/30">
          <i data-lucide="send" class="w-4 h-4"></i>
        </button>
      </form>
    </main>
  `;
}

// -------------------------------------------------------------------------
// 9. ADMIN & MODERATOR PORTAL (/admin)
// -------------------------------------------------------------------------
function renderAdminPortal() {
  loadAdminData();

  return `
    ${renderNavbar()}
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
      <div class="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
        <div>
          <h1 class="text-2xl font-extrabold text-white flex items-center gap-2">
            <i data-lucide="shield-check" class="w-6 h-6 text-amber-400"></i> Admin & Moderator Console
          </h1>
          <p class="text-xs text-slate-400 mt-1">Resource moderation, institutional verification, and user management.</p>
        </div>
        <span class="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase">
          ${state.user ? state.user.role : 'Admin'} Privilege Active
        </span>
      </div>

      <!-- Admin Tabs -->
      <div class="flex gap-2 mb-6 text-xs">
        <button onclick="state.adminTab='moderation'; render();" class="px-4 py-2 rounded-xl font-bold ${state.adminTab === 'moderation' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400'}">
          Resource Moderation (${state.pendingResources.length})
        </button>
        <button onclick="state.adminTab='users'; render();" class="px-4 py-2 rounded-xl font-bold ${state.adminTab === 'users' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400'}">
          User Registry
        </button>
      </div>

      <!-- Pending Resources Queue -->
      ${state.adminTab === 'moderation' ? `
        <div>
          <h3 class="text-sm font-bold text-white mb-4">Pending Educational Resources Queue</h3>
          ${state.pendingResources.length > 0 ? `
            <div class="space-y-4">
              ${state.pendingResources.map(r => `
                <div class="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span class="px-2 py-0.5 text-[10px] font-bold rounded uppercase bg-amber-500/20 text-amber-300">
                      ${r.resource_type} (${r.file_extension})
                    </span>
                    <h4 class="font-bold text-sm text-white mt-1">${r.title}</h4>
                    <p class="text-xs text-slate-400 mt-0.5">${r.description || 'Uploaded file'}</p>
                  </div>
                  <div class="flex gap-2">
                    <button onclick="approveResource('${r.id}')" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition">
                      Approve & Publish
                    </button>
                    <button onclick="rejectResource('${r.id}')" class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition">
                      Reject
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : '<div class="p-8 text-center glass-card rounded-2xl text-xs text-slate-400">✓ Moderation queue is clean. No pending uploads.</div>'}
        </div>
      ` : ''}

      <!-- Users Registry -->
      ${state.adminTab === 'users' ? `
        <div class="glass-card rounded-2xl p-6 border border-slate-800">
          <h3 class="text-sm font-bold text-white mb-4">Registered System Users</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-300">
              <thead class="bg-slate-900 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th class="p-3">Full Name</th>
                  <th class="p-3">Email Address</th>
                  <th class="p-3">System Role</th>
                  <th class="p-3">Account Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800">
                ${state.usersList.map(u => `
                  <tr>
                    <td class="p-3 font-semibold text-white">${u.full_name}</td>
                    <td class="p-3 text-slate-400">${u.email}</td>
                    <td class="p-3 font-bold ${u.role === 'admin' ? 'text-amber-400' : (u.role === 'moderator' ? 'text-indigo-400' : 'text-slate-300')}">${u.role}</td>
                    <td class="p-3 text-emerald-400">${u.status}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}
    </main>
  `;
}

// -------------------------------------------------------------------------
// 10. USER PROFILE PAGE (/profile)
// -------------------------------------------------------------------------
function renderProfilePage() {
  const user = state.user;
  if (!user) {
    navigate('/');
    return '';
  }

  return `
    ${renderNavbar()}
    <main class="max-w-4xl mx-auto px-4 py-8 flex-1">
      <div class="glass-card rounded-2xl p-8 border border-slate-800 mb-6">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-16 h-16 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-2xl">
            ${user.full_name ? user.full_name[0] : 'U'}
          </div>
          <div>
            <h1 class="text-xl font-bold text-white">${user.full_name}</h1>
            <p class="text-xs text-slate-400">${user.email}</p>
            <span class="inline-block mt-2 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-500/30">
              ${user.role} Role
            </span>
          </div>
        </div>
      </div>
    </main>
  `;
}

// --- Main Root Render Engine ---
function render() {
  const app = document.getElementById('app');
  if (!app) return;

  const route = state.activeRoute;

  if (route === '/' || route === '/login' || route === '/register') {
    app.innerHTML = renderLandingLoginPage();
  } else if (route === '/institutions') {
    app.innerHTML = renderInstitutionsPage();
  } else if (route.startsWith('/institutions/')) {
    const id = route.split('/')[2];
    if (!state.selectedInstitution || state.selectedInstitution.id !== id) {
      loadInstitutionDetail(id);
    }
    app.innerHTML = renderInstitutionDetail();
  } else if (route === '/programs') {
    app.innerHTML = renderProgramsPage();
  } else if (route === '/resources') {
    app.innerHTML = renderResourcesPage();
  } else if (route === '/research') {
    app.innerHTML = renderResearchPage();
  } else if (route === '/scholarships') {
    app.innerHTML = renderScholarshipsPage();
  } else if (route === '/ai-consultation') {
    app.innerHTML = renderAIConsultationPage();
  } else if (route === '/admin') {
    app.innerHTML = renderAdminPortal();
  } else if (route === '/profile') {
    app.innerHTML = renderProfilePage();
  } else {
    app.innerHTML = renderInstitutionsPage();
  }

  // Refresh Lucide icon renderings across dynamic DOM nodes
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Auto-scroll AI chat to bottom if on consultation page
  const chatThread = document.getElementById('ai-chat-thread');
  if (chatThread) {
    chatThread.scrollTop = chatThread.scrollHeight;
  }
}

// Initial Boot
document.addEventListener('DOMContentLoaded', () => {
  render();
});
