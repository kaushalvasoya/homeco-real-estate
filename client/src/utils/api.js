const API_BASE =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://homeco-real-estate.onrender.com';

export function api(path) {
  return `${API_BASE}/api${path.startsWith('/') ? path : '/' + path}`;
}
