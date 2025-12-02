// client/src/utils/api.js

// Very explicit helper: always returns a full backend URL.
// - On localhost: uses http://localhost:5000
// - On Vercel (or any other host): uses your Render API
export function api(path = '') {
  const isLocal =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1');

  const BASE = isLocal
    ? 'http://localhost:5000'
    : 'https://homeco-real-estate.onrender.com';

  // Ensure path starts with a single slash
  let clean = path.startsWith('/') ? path : `/${path}`;

  // Avoid double `/api/api/...`
  if (clean.startsWith('/api/')) {
    clean = clean.slice(4); // remove leading "/api"
  }

  // Final URL: BASE + /api + clean-path
  return `${BASE}/api${clean}`;
}
