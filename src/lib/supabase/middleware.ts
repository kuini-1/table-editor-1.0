import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { CookieOptions } from '@supabase/ssr';

export async function updateSession(request: NextRequest) {
  // Create a response with the request headers
  const supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create a Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          supabaseResponse.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          supabaseResponse.cookies.delete({
            name,
            ...options,
          });
        },
      },
    }
  );

  // Get authenticated user data
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  // Define public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/pricing', '/'];
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname === route || request.nextUrl.pathname === `${route}/`
  );
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth');

  // Always allow access to auth routes (including OAuth callback)
  if (isAuthRoute) {
    return supabaseResponse;
  }

  // If on a public route, allow access regardless of auth status
  if (isPublicRoute) {
    return supabaseResponse;
  }

  // If we have a user, check if their profile still exists
  if (user && !userError) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    // If profile doesn't exist or there's an error, clear all auth cookies and redirect to login
    if (!profile || profileError) {
      const cookies = request.cookies.getAll();
      cookies.forEach(cookie => {
        if (cookie.name.includes('supabase') || cookie.name.includes('sb-')) {
          supabaseResponse.cookies.delete(cookie.name);
        }
      });
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // For protected routes, check authentication
  if ((!user || userError) && !isPublicRoute) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If authenticated user tries to access login/register pages, redirect to dashboard
  if (user && !userError && (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register'))) {
    return NextResponse.redirect(new URL('/tables', request.url));
  }

  // If authenticated user is on home page, redirect to tables
  if (user && !userError && (request.nextUrl.pathname === '/' || request.nextUrl.pathname === '')) {
    return NextResponse.redirect(new URL('/tables', request.url));
  }

  return supabaseResponse;
}