import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  const isDev = process.env.NODE_ENV === 'development';
  const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');

  // Check if the current request is coming from the admin subdomain
  const isAdminDomain = hostname.startsWith('admin.') || hostname.startsWith('admin-');

  // For ease of development, allow accessing /admin routes directly on plain localhost:3000
  const allowAdminAccess = isAdminDomain || (isDev && isLocalhost);

  // Retrieve authentication status from cookies
  const token = request.cookies.get('admin_token');
  const isAuthenticated = token?.value === 'authenticated';

  if (isAdminDomain) {
    // 1. Handle root '/' on the admin subdomain
    if (pathname === '/') {
      if (!isAuthenticated) {
        // If not logged in, redirect to login page
        const loginUrl = new URL('/admin/login', request.url);
        return NextResponse.redirect(loginUrl);
      } else {
        // If logged in, rewrite to dashboard
        return NextResponse.rewrite(new URL('/admin', request.url));
      }
    }

    // 2. Protect any other '/admin' routes except the login page itself
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
      if (!isAuthenticated) {
        const loginUrl = new URL('/admin/login', request.url);
        return NextResponse.redirect(loginUrl);
      }
    }

    // 3. Block/redirect access to public-facing pages on the admin subdomain
    const isPublicPage = 
      !pathname.startsWith('/admin') && 
      !pathname.startsWith('/api') && 
      !pathname.startsWith('/_next') && 
      !pathname.includes('.');

    if (isPublicPage) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  } else {
    // On the public domain:
    if (pathname.startsWith('/admin')) {
      if (allowAdminAccess) {
        // Allow local development testing at http://localhost:3000/admin
        if (!pathname.startsWith('/admin/login')) {
          if (!isAuthenticated) {
            const loginUrl = new URL('/admin/login', request.url);
            return NextResponse.redirect(loginUrl);
          }
        }
      } else {
        // Block any attempt to access the admin portal directly on production public domain
        return new NextResponse(null, { status: 404 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt, etc. (metadata or asset files with file extensions)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
