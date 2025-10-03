import { NextResponse } from 'next/server';

export function middleware(request) {
  const proto = request.headers.get('x-forwarded-proto');
  const host = request.headers.get('host') || '';

  // Redirect to HTTPS only when behind a proxy reporting HTTP and not on localhost
  if (proto === 'http' && !/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host)) {
    const url = new URL(request.url);
    url.protocol = 'https:';
    return NextResponse.redirect(url.toString(), 308);
  }

  // Attach baseline security headers on every response to reduce clickjacking/session risks in browsers
  const res = NextResponse.next();
  res.headers.set('X-Frame-Options', 'DENY'); // clickjacking defense
  res.headers.set('X-Content-Type-Options', 'nosniff');
  // Minimal CSP with frame-ancestors none; full policy is also sent via next.config.js
  res.headers.set(
    'Content-Security-Policy',
    "frame-ancestors 'none'"
  );
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|manifest.json|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)',
  ],
};
