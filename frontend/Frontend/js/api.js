// GIBIConnect Centralized Fetch API Client
const API_BASE = '/api';

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

export function setAuthSession(user, token) {
  if (user && token) {
    localStorage.setItem('gibi_user', JSON.stringify(user));
    localStorage.setItem('gibi_token', token);
  } else {
    localStorage.removeItem('gibi_user');
    localStorage.removeItem('gibi_token');
  }
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

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(`[API Error] ${endpoint}:`, err);
    return { success: false, message: err.message, data: null };
  }
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
  let endpoint = `/institutions/${id}/${subtab}`;
  if (subtab === 'calendar') endpoint = `/academic_calendar?institution_id=${id}`;
  return await fetchAPI(endpoint);
}

// Programs API
export async function getPrograms(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return await fetchAPI(`/programs${qs ? '?' + qs : ''}`);
}

export async function getProgram(id) {
  return await fetchAPI(`/programs/${id}`);
}

// Admissions API
export async function getAdmissions(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return await fetchAPI(`/admissions${qs ? '?' + qs : ''}`);
}

export async function getAdmission(id) {
  return await fetchAPI(`/admissions/${id}`);
}

// Scholarships API
export async function getScholarships(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return await fetchAPI(`/scholarships${qs ? '?' + qs : ''}`);
}

export async function getScholarship(id) {
  return await fetchAPI(`/scholarships/${id}`);
}

// Resources API
export async function getResources(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return await fetchAPI(`/resources${qs ? '?' + qs : ''}`);
}

export async function getResource(id) {
  return await fetchAPI(`/resources/${id}`);
}

// Research API
export async function getResearch(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return await fetchAPI(`/research${qs ? '?' + qs : ''}`);
}

// Admin / Users API
export async function getUsers() {
  return await fetchAPI('/users');
}

export async function updateUserRole(id, role) {
  return await fetchAPI(`/users/${id}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role })
  });
}

export async function updateUserStatus(id, status) {
  return await fetchAPI(`/users/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
}

// User Saved Bookmarks API
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
