/**
 * GIBIConnect Centralized API Configuration
 * Supports Vercel deployment with dynamic Render backend URL.
 */

// If VITE_API_URL is provided (e.g. https://gibiconnect-backend.onrender.com), use it.
// Otherwise, fallback to empty string (which uses relative paths like /api/v1/... for local proxy or Vercel rewrites).
export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

/**
 * Returns the fully qualified URL for an API endpoint.
 * Example: getApiUrl('/api/v1/institutions') -> 'https://gibiconnect-backend.onrender.com/api/v1/institutions'
 */
export function getApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (API_BASE_URL) {
    return `${API_BASE_URL}${cleanEndpoint}`;
  }
  return cleanEndpoint;
}
