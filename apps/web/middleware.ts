import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';

export const middleware = withAuth(
  function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect dashboard and interview routes
    if (
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/interview') ||
      pathname.startsWith('/api/interviews')
    ) {
      const token = request.nextauth.token;
      if (!token) {
        const url = new URL('/login', request.url);
        url.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token }) {
        return !!token;
      },
    },
    pages: {
      signIn: '/login',
      error: '/login',
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/interview/:path*', '/api/interviews/:path*'],
};
