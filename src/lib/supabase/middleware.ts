import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { CookieOptions } from "@supabase/ssr";
import { hasActiveSubscriptionSync } from "@/lib/subscription-check";

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
  const publicRoutes = ['/login', '/register', '/pricing', '/forgot-password', '/reset-password', '/verify-email', '/'];
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route + '/')
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

  // For protected routes, check authentication first
  if ((!user || userError) && !isPublicRoute) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If we have a user, check if their profile still exists and has active subscription/trial
  if (user && !userError) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, stripe_subscription_id, subscription_status')
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

    // Check subscription/trial access for protected routes (excluding settings where they can manage subscription)
    const protectedRoutes = ['/tables', '/users'];
    const isProtectedRoute = protectedRoutes.some(route => 
      request.nextUrl.pathname.startsWith(route)
    );

    if (isProtectedRoute) {
      const hasAccess = hasActiveSubscriptionSync(profile);

      if (!hasAccess) {
        // Redirect to subscription settings page
        return NextResponse.redirect(new URL('/settings/subscription', request.url));
      }
    }

    // If authenticated user tries to access login/register pages, check subscription first
    if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register')) {
      if (hasActiveSubscriptionSync(profile)) {
        return NextResponse.redirect(new URL('/tables', request.url));
      } else {
        // No subscription, redirect to subscription settings
        return NextResponse.redirect(new URL('/settings/subscription', request.url));
      }
    }

    // If authenticated user is on home page, check subscription first
    if (request.nextUrl.pathname === '/' || request.nextUrl.pathname === '') {
      if (hasActiveSubscriptionSync(profile)) {
        return NextResponse.redirect(new URL('/tables', request.url));
      } else {
        // No subscription, redirect to subscription settings
        return NextResponse.redirect(new URL('/settings/subscription', request.url));
      }
    }
    
    // Redirect /settings to /settings/profile
    if (request.nextUrl.pathname === '/settings') {
      return NextResponse.redirect(new URL('/settings/profile', request.url));
    }
  }

  return supabaseResponse;
}