import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  try {
    // Refresh session if expired - required for Server Components
    const { data: { session }, error } = await supabase.auth.getSession();

    // For auth routes (login/register)
    if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') {
      if (session) {
        // If we have a session, redirect to tables
        return NextResponse.redirect(new URL('/tables', request.url));
      }
      return res;
    }

    // For protected routes
    if (request.nextUrl.pathname.startsWith('/tables') || 
        request.nextUrl.pathname.startsWith('/settings') ||
        request.nextUrl.pathname.startsWith('/users')) {
      
      if (!session) {
        // If no session, redirect to login
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // For users page, check role
      if (request.nextUrl.pathname.startsWith('/users')) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (!profile || profile.role !== 'owner') {
          return NextResponse.redirect(new URL('/tables', request.url));
        }
      }

      return res;
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    
    // For auth routes, allow access
    if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') {
      return res;
    }
    
    // For all other routes, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/tables/:path*',
    '/settings/:path*',
    '/users/:path*',
    '/login',
    '/register',
  ],
}; 