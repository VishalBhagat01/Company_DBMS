const rawApiBaseUrl = import.meta.env.VITE_API_URL || '/api';
const apiBaseUrl = rawApiBaseUrl.replace(/\/$/, '');

export const API_BASE_URL = apiBaseUrl;

export function apiUrl(path = '') {
  if (!path) {
    return API_BASE_URL;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return `${API_BASE_URL}/${normalizedPath}`;
}