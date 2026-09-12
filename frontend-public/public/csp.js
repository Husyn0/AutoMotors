// public/csp.js
// Injects an environment-aware Content-Security-Policy before the app boots.
(function () {
  var host = window.location.hostname;

  var isLocal =
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '0.0.0.0' ||
    host.endsWith('.local') ||
    /^192\.168\./.test(host); // local network testing

  // ---- Configure your real backend here for production ----
  var PROD_API_ORIGIN = 'https://api.automotors.ci'; // <-- change me

  var connectSrc = isLocal
    ? [
        "'self'",
        'http://localhost:8000',
        'http://127.0.0.1:8000',
        'ws://localhost:3000',      // CRA HMR websocket
        'ws://127.0.0.1:3000',
      ].join(' ')
    : ["'self'", PROD_API_ORIGIN].join(' ');

  var scriptSrc = isLocal
    ? "'self' 'unsafe-inline' 'unsafe-eval'"  // required by CRA HMR
    : "'self'";                                // no unsafe-* in prod

  var styleSrc = "'self' 'unsafe-inline'";     // SCSS/CSS modules need this

  var imgSrc = isLocal
    ? "'self' data: blob:"
    : "'self' data: blob: https:";

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