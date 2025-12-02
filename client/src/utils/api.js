// client/src/utils/api.js

// Single source of truth for backend URL.
// - On localhost: use your local Node server.
// - Everywhere else (Vercel, etc): use the Render API.
//
// We IGNORE VITE_API_BASE here on purpose so that
// misconfigured env vars cannot break production.

export const API_BASE =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://homeco-real-estate.onrender.com';

// Helper to build the full API URL
export function api(path) {
  const base = API_BASE.replace(/\/+$/, ''); // trim trailing slashes

  // Ensure we always prefix with /api
  const clean = path.startsWith('/api')
    ? path
    : `/api${path.startsWith('/') ? path : '/' + path}`;

  return `${base}${clean}`;
}
