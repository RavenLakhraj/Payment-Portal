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

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|manifest.json|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)',
  ],
};
