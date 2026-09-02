// GIBIConnect Centralized Fetch API Client

export function getAPIBase() {
  if (typeof window === 'undefined') return 'http://localhost:5000/api';

  const custom = localStorage.getItem('gibi_api_base');
  if (custom) return custom;

  const port = window.location.port;
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;

  // If page is hosted on the same backend port (5000) or production reverse proxy
  if (port === '5000') {
    return '/api';
  }

  if ((port === '80' || port === '443' || port === '') && protocol.startsWith('http') && hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return '/api';
  }

  // If loaded via Live Server (5500), Vite (5173), http-server (8080/8000), or file://
  return 'http://localhost:5000/api';
}

export function getToken() {
  return localStorage.getItem('gibi_token');
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem('gibi_user') || 'null');
  } catch (e) {
    return null;
  }
}

export async function getUsers(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return await fetchAPI(`/users${qs ? '?' + qs : ''}`);
}

export function setAuthSession(user, token) {
  if (user && token) {
    localStorage.setItem('gibi_user', JSON.stringify(user));
    localStorage.setItem('gibi_token', token);
  } else {
    localStorage.removeItem('gibi_user');
    localStorage.removeItem('gibi_token');
  }
}

let seedCache = null;
async function loadSeedFallback() {
  if (seedCache) return seedCache;
  try {
    const res = await fetch('seed.json');
    if (res.ok) {
      seedCache = await res.json();
      return seedCache;
    }
  } catch (e) {
    try {
      const res = await fetch('/seed.json');
      if (res.ok) {
        seedCache = await res.json();
        return seedCache;
      }
    } catch (e2) { }
  }
  return null;
}

async function getLocalFallbackData(endpoint) {
  const cleanPath = endpoint.split('?')[0];
  const params = new URLSearchParams(endpoint.includes('?') ? endpoint.split('?')[1] : '');
  const seed = await loadSeedFallback();
  if (!seed) return null;

  if (cleanPath === '/institutions') {
    let list = seed.institutions || [];
    const q = params.get('q');
    const region = params.get('region');
    const limit = parseInt(params.get('limit') || '50', 10);
    if (q) {
      const query = q.toLowerCase();
      list = list.filter(i => (i.name || '').toLowerCase().includes(query) || (i.city || '').toLowerCase().includes(query));
    }
    if (region && region !== 'all') {
      list = list.filter(i => (i.region || '').toLowerCase().includes(region.toLowerCase()));
    }
    return { success: true, data: list.slice(0, limit), total: list.length };
  }

  if (cleanPath.startsWith('/institutions/')) {
    const parts = cleanPath.split('/');
    const id = parts[2];
    const subtab = parts[3];
    if (subtab) {
      const collection = seed[subtab] || [];
      const filtered = collection.filter(item => item.institution_id === id);
      return { success: true, data: filtered };
    }
    const inst = (seed.institutions || []).find(i => i.id === id || i.slug === id);
    if (inst) return { success: true, data: inst };
  }

  if (cleanPath === '/programs') {
    let list = seed.programs || [];
    const q = params.get('q');
    const limit = parseInt(params.get('limit') || '50', 10);
    if (q) {
      const query = q.toLowerCase();
      list = list.filter(p => (p.name || '').toLowerCase().includes(query));
    }
    return { success: true, data: list.slice(0, limit), total: list.length };
  }

  if (cleanPath.startsWith('/programs/')) {
    const id = cleanPath.split('/')[2];
    const prog = (seed.programs || []).find(p => p.id === id || p.slug === id);
    if (prog) return { success: true, data: prog };
  }

  if (cleanPath === '/resources') {
    let list = seed.resources || [];
    const limit = parseInt(params.get('limit') || '50', 10);
    return { success: true, data: list.slice(0, limit), total: list.length };
  }

  if (cleanPath === '/scholarships') {
    return { success: true, data: seed.scholarships || [] };
  }

  return null;
}

export async function fetchAPI(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const base = getAPIBase();
  try {
    const res = await fetch(`${base}${endpoint}`, {
      ...options,
      headers
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn(`[API Notice] ${base}${endpoint} connection failed (${err.message}). Using local fallback.`);
  }

  // Graceful fallback for GET requests
  if (!options.method || options.method === 'GET') {
    const fallback = await getLocalFallbackData(endpoint);
    if (fallback) return fallback;
  }

  return { success: false, message: 'Request could not be completed', data: null };
}

// Institutions API
export async function getInstitutions(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return await fetchAPI(`/institutions${qs ? '?' + qs : ''}`);
}

export async function getInstitution(id) {
  return await fetchAPI(`/institutions/${id}`);
}

export async function getInstitutionSubtab(id, subtab) {
  return await fetchAPI(`/institutions/${id}/${subtab}`);
}

// Programs API
export async function getPrograms(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return await fetchAPI(`/programs${qs ? '?' + qs : ''}`);
}

export async function getProgram(id) {
  return await fetchAPI(`/programs/${id}`);
}

// Resources API
export async function getResources(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return await fetchAPI(`/resources${qs ? '?' + qs : ''}`);
}

export async function getResource(id) {
  return await fetchAPI(`/resources/${id}`);
}

export async function getResourceFacets() {
  return await fetchAPI('/resources/facets');
}

export async function uploadResource(formData) {
  const token = getToken();
  const base = getAPIBase();
  try {
    const res = await fetch(`${base}/resources/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: formData
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
}

// Admissions API
export async function getAdmissions(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return await fetchAPI(`/admissions${qs ? '?' + qs : ''}`);
}

// Scholarships API
export async function getScholarships(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return await fetchAPI(`/scholarships${qs ? '?' + qs : ''}`);
}

// Auth API
export async function loginUser(email, password) {
  return await fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export async function registerUser(userData) {
  return await fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
}

// User Bookmarks API
export async function getUserSavedItems() {
  return await fetchAPI('/users/me/saved');
}

export async function saveInstitution(institution_id) {
  return await fetchAPI('/users/saved/institutions', {
    method: 'POST',
    body: JSON.stringify({ institution_id })
  });
}

export async function removeSavedInstitution(institution_id) {
  return await fetchAPI(`/users/saved/institutions/${institution_id}`, {
    method: 'DELETE'
  });
}

export async function saveProgram(program_id) {
  return await fetchAPI('/users/saved/programs', {
    method: 'POST',
    body: JSON.stringify({ program_id })
  });
}

export async function removeSavedProgram(program_id) {
  return await fetchAPI(`/users/saved/programs/${program_id}`, {
    method: 'DELETE'
  });
}

export async function saveResource(resource_id) {
  return await fetchAPI('/users/saved/resources', {
    method: 'POST',
    body: JSON.stringify({ resource_id })
  });
}

export async function removeSavedResource(resource_id) {
  return await fetchAPI(`/users/saved/resources/${resource_id}`, {
    method: 'DELETE'
  });
}

export async function approveResource(id) {
  return await fetchAPI(`/resources/${id}/approve`, { method: 'PATCH' });
}

export async function rejectResource(id, reason = 'Quality standards') {
  return await fetchAPI(`/resources/${id}/reject`, {
    method: 'PATCH',
    body: JSON.stringify({ reason })
  });
}

// AI Advisor API
export async function sendAIChat(prompt, institution_id = null) {
  return await fetchAPI('/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ prompt, institution_id })
  });
}

// Institution Logo Resolution & Initials Helpers
export function getInstitutionLogoUrl(inst) {
  if (!inst || !inst.logo_url) return null;
  if (inst.logo_url.includes('unsplash.com')) return null;
  return inst.logo_url;
}

export function getInstitutionInitials(name) {
  if (!name) return 'UN';
  const clean = name.replace(/University|College|Science|and|Technology|of/gi, '').trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export async function updateUserRole(id, newRole) {
  return await fetchAPI(`/users/${id}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role: newRole })
  });
}

export async function updateUserStatus(id, newStatus) {
  return await fetchAPI(`/users/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: newStatus })
  });
}