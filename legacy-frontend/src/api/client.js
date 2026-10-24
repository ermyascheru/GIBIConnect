// Resilient API Client with Fallback to Centralized Seed Data
import { store } from '../state/store.js';

const API_BASE = 'http://localhost:5000/api';

let cachedSeed = null;
async function getSeedFallback() {
  if (!cachedSeed) {
    try {
      const res = await fetch('/seed.json');
      cachedSeed = await res.json();
    } catch (e) {
      console.warn('Seed fallback unavailable:', e);
      cachedSeed = {};
    }
  }
  return cachedSeed;
}

export async function apiCall(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  
  if (store.token) {
    headers['Authorization'] = `Bearer ${store.token}`;
  }
  
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });
    
    if (!res.ok && res.status >= 500) {
      throw new Error(`HTTP ${res.status}`);
    }
    
    return await res.json();
  } catch (err) {
    console.warn(`API ${endpoint} failed, utilizing authoritative seed fallback:`, err.message);
    const seed = await getSeedFallback();
    
    // Graceful offline fallback to verified seed data
    if (endpoint.startsWith('/institutions/')) {
      const id = endpoint.split('/')[2];
      const sub = endpoint.split('/')[3];
      const inst = (seed.institutions || []).find(i => i.id === id || i.slug === id);
      
      if (sub === 'faculties') return { success: true, data: (seed.faculties || []).filter(f => f.institution_id === id) };
      if (sub === 'programs') return { success: true, data: (seed.programs || []).filter(p => p.institution_id === id) };
      if (sub === 'admissions') return { success: true, data: (seed.admissions || []).filter(a => a.institution_id === id) };
      if (sub === 'tuition') return { success: true, data: (seed.tuition || []).filter(t => t.institution_id === id) };
      if (sub === 'scholarships') return { success: true, data: (seed.scholarships || []).slice(0, 3) };
      if (sub === 'facilities') return { success: true, data: (seed.facilities || []).filter(f => f.institution_id === id) };
      if (sub === 'resources') return { success: true, data: (seed.resources || []).filter(r => r.institution_id === id) };
      return { success: true, data: inst };
    }
    
    if (endpoint.startsWith('/institutions')) return { success: true, data: seed.institutions || [] };
    if (endpoint.startsWith('/programs')) return { success: true, data: seed.programs || [] };
    if (endpoint.startsWith('/resources')) return { success: true, data: seed.resources || [] };
    if (endpoint.startsWith('/research')) return { success: true, data: seed.research || [] };
    if (endpoint.startsWith('/scholarships')) return { success: true, data: seed.scholarships || [] };
    if (endpoint.startsWith('/users')) return { success: true, data: seed.users || [] };

    return { success: false, message: err.message };
  }
}
