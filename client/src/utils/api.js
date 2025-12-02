// client/src/utils/api.js

// Base URL for the API
// 1) Locally: http://localhost:5000
// 2) In production: https://homeco-real-estate.onrender.com
// 3) If VITE_API_BASE is set, that wins (for flexibility)

export const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://homeco-real-estate.onrender.com');

// Helper to build full API URL
export function api(path) {
  const base = API_BASE.replace(/\/+$/, ''); // remove trailing slashes

  // Ensure path starts with /api
  const clean = path.startsWith('/api')
    ? path
    : `/api${path.startsWith('/') ? path : '/' + path}`;

  return `${base}${clean}`;
}
