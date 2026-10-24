// Global Application State Store - Lightweight Global Context Only
export const store = {
  user: JSON.parse(localStorage.getItem('gibi_user') || 'null'),
  token: localStorage.getItem('gibi_token') || null,
  activeRoute: window.location.hash ? window.location.hash.slice(1) : '/',
  authMode: 'login', // 'login' | 'register'
  isLoading: false,
  error: null,
  successMsg: null,
  
  // Page-Specific Lightweight Caches
  institutions: [],
  selectedInstitution: null,
  institutionSubtabsData: {}, // Cached by institutionId_subtab
  programs: [],
  selectedProgram: null,
  resources: [],
  research: [],
  admissions: [],
  scholarships: [],
  
  // Active Filter States
  filters: {
    region: 'all',
    degreeLevel: 'all',
    search: '',
    programSearch: '',
    resourceSearch: ''
  },
  
  // Grounded AI Chat State
  ai: {
    messages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: "Hello! I am your **GIBIConnect Grounded AI Academic Advisor**.\n\nI provide factual, verified guidance regarding Ethiopian universities, curricula, tuition schedules, admission requirements, scholarships, and research.\n\nHow can I assist your educational journey today?",
        sources: [],
        intent: 'GENERAL',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ],
    input: '',
    isThinking: false,
    selectedInstitutionContext: ''
  },

  setUser(user, token) {
    this.user = user;
    this.token = token;
    if (user && token) {
      localStorage.setItem('gibi_user', JSON.stringify(user));
      localStorage.setItem('gibi_token', token);
    } else {
      localStorage.removeItem('gibi_user');
      localStorage.removeItem('gibi_token');
    }
  }
};
