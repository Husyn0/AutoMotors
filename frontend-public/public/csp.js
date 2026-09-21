// public/csp.js
(function () {
  var host = window.location.hostname;

  var isLocal =
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '0.0.0.0' ||
    host.endsWith('.local') ||
    /^192\.168\./.test(host);

  // ---- Configure your real backend here for production ----
  var PROD_API_ORIGIN = 'https://api.automotors.ci';

  // Local backend origins (both spellings — the dev server may be
  // reached either way, and the backend may emit either one in image_url)
  var LOCAL_API_ORIGINS = [
    'http://localhost:8000',
    'http://127.0.0.1:8000',
  ].join(' ');

  var connectSrc = isLocal
    ? ["'self'", LOCAL_API_ORIGINS,
       'ws://localhost:3000', 'ws://127.0.0.1:3000'].join(' ')
    : ["'self'", PROD_API_ORIGIN].join(' ');

  var scriptSrc = isLocal
    ? "'self' 'unsafe-inline' 'unsafe-eval'"
    : "'self'";

  var styleSrc = "'self' 'unsafe-inline'";

  // ✅ Allow images from the API origin in BOTH environments.
  var imgSrc = isLocal
    ? ["'self'", 'data:', 'blob:', LOCAL_API_ORIGINS].join(' ')
    : ["'self'", 'data:', 'blob:', 'https:', PROD_API_ORIGIN].join(' ');

  var policy = [
    "default-src 'self'",
    'script-src ' + scriptSrc,
    'style-src ' + styleSrc,
    'img-src ' + imgSrc,
    "font-src 'self' data:",
    'connect-src ' + connectSrc,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ');

  var meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = policy;
  document.head.appendChild(meta);

  console.info(
    '%c[CSP] ' + (isLocal ? 'DEV' : 'PROD') + ' policy applied:',
    'color:#facc15;font-weight:bold;',
    policy
  );
})();