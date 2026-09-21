// src/api/media.js
// Resolves a product / category / project `image` value into a
// browser-loadable URL.

const RAW_API_URL =
  process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

// Strip the trailing '/api' so we get the server origin.
export const API_ORIGIN = RAW_API_URL.replace(/\/api\/?$/, '');

/**
 * @param {object} item  any row from the API that may have an image
 * @returns {string|null} a URL the browser can load, or null for placeholder
 */
export const resolveImage = (item) => {
  if (!item) return null;

  // 1. Backend already produced a full URL → trust it.
  const direct = item.image_url || item.imageUrl;
  if (direct && typeof direct === 'string') {
    if (/^https?:\/\//i.test(direct)) return direct;
    if (direct.startsWith('//')) return window.location.protocol + direct;
    return `${API_ORIGIN}${direct.startsWith('/') ? '' : '/'}${direct}`;
  }

  // 2. Fall back to raw `image` column.
  const raw = item.image;
  if (!raw || typeof raw !== 'string') return null;

  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith('//')) return window.location.protocol + raw;

  // Legacy static assets already in CRA public/
  if (raw.startsWith('/images/') || raw.startsWith('/assets/')) return raw;

  // Pure emoji / no path separator → not an image
  if (!raw.includes('/') && !raw.includes('.')) return null;

  // Relative storage path → serve via API origin
  const cleaned = raw.replace(/^\/?storage\//, '').replace(/^\//, '');
  return `${API_ORIGIN}/storage/${cleaned}`;
};

export const isImageValue = (value) => {
  if (typeof value !== 'string' || !value) return false;
  return (
    /^https?:\/\//i.test(value) ||
    value.startsWith('//') ||
    value.startsWith('/') ||
    /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(value)
  );
};