const fs = require('fs');
const path = require('path');
const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add HTTP security headers to mitigate clickjacking and related attacks
  async headers() {
    // Build a CSP that blocks framing (clickjacking), limits sources, and is dev-friendly
    const csp = [
      "default-src 'self'",
      "frame-ancestors 'none'", // prevents the app from being embedded in iframes
      isProd ? "script-src 'self'" : "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // dev needs eval/inline
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ');

    const headers = [
      // Clickjacking defense
      { key: 'X-Frame-Options', value: 'DENY' },
      // Strong CSP (also enforces frame-ancestors 'none')
      { key: 'Content-Security-Policy', value: csp },
      // Prevent MIME sniffing
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      // Limit referrer leakage
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    ];

    // Only send HSTS in production (avoid issues on localhost)
    if (isProd) {
      headers.push({ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' });
    }

    return [
      {
        source: '/:path*',
        headers,
      },
    ];
  },
};

module.exports = nextConfig;
