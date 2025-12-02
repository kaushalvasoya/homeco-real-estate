// client/src/utils/api.js

// Decides which backend to call
// - Local dev: http://localhost:5000
// - Production: https://homeco-real-estate.onrender.com
export const API_BASE =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://homeco-real-estate.onrender.com';

export function api(path) {
  const base = API_BASE.replace(/\/+$/, ''); // remove trailing slash

  if (!path) return `${base}/api`;

  const clean = path.startsWith('/api')
    ? path
    : `/api${path.startsWith('/') ? path : '/' + path}`;

  return `${base}${clean}`;
}
