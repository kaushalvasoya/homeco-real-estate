// client/src/utils/api.js

// Single source of truth for backend URL.
// Localhost -> talk to your local Node server.
// Anything else (Vercel, etc) -> talk to Render backend.

export const API_BASE =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://homeco-real-estate.onrender.com';

// Build full API URL from a relative path, always under /api
export function api(path) {
  const base = API_BASE.replace(/\/+$/, ''); // trim trailing slash

  const clean = path.startsWith('/api')
    ? path
    : `/api${path.startsWith('/') ? path : '/' + path}`;

  return `${base}${clean}`;
}
