export const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://homeco-real-estate.onrender.com');

export function api(path) {
  const base = API_BASE.replace(/\/+$/, '');
  const clean =
    path.startsWith('/api') ? path : `/api${path.startsWith('/') ? path : '/' + path}`;
  return `${base}${clean}`;
}
