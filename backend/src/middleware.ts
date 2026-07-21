import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only protect the /admin/dashboard routes
  if (request.nextUrl.pathname.startsWith('/admin/dashboard')) {
    const token = request.cookies.get('auth_token');

    if (!token) {
      // Not logged in, redirect to login
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    // Role check: ensure they are not a customer or guest
    const role = token.value;
    if (role === 'customer' || role === 'guest') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/dashboard/:path*'],
};
