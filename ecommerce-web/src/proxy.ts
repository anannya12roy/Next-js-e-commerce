import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Protect all /admin routes except the login page itself (/admin)
  if (path.startsWith('/admin') && path !== '/admin') {
    const token = request.cookies.get('admin_token')?.value;
    
    if (!token) {
      // Redirect to admin login if no token is found
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
