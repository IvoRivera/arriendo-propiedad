import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from './utils/supabase/middleware';

/**
 * Next.js Edge Middleware
 * First line of defense for the application.
 */

// Basic Rate Limiting state (In-memory, local to the Edge node)
const ipCache = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60000;
const MAX_REQUESTS = 30; // Global threshold

// Path patterns to exclude from rate limiting
const EXCLUDED_PATHS = [
  /^\/_next\/static\//,
  /^\/_next\/image\//,
  /^\/_next\/static\/chunks\//,
  /^\/_next\/static\/css\//,
  /^\/favicon\.ico$/,
  /^\/robots\.txt$/,
  /^\/sitemap\.xml$/,
  /\.hot-update\.(json|js)$/,
  /^\/__nextjs_original-stack-frame/,
];

function isExcludedPath(pathname: string): boolean {
  return EXCLUDED_PATHS.some(pattern => pattern.test(pathname));
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 0. Skip rate limiting for excluded paths or in development
  if (isExcludedPath(pathname)) {
    return NextResponse.next();
  }

  // 1. Supabase Session Management (Crucial for SSR & Production)
  const { supabaseResponse, user } = await updateSession(req);

  // 2. Skip remaining logic in development if needed, but SESSION UPDATE must run
  if (process.env.NODE_ENV !== 'production') {
    return supabaseResponse;
  }

  // 3. Rate Limiting Logic
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ip = (req as any).ip || req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  const now = Date.now();
  const record = ipCache.get(ip) || { count: 0, lastReset: now };
  
  if (now - record.lastReset > RATE_LIMIT_WINDOW) {
    record.count = 1;
    record.lastReset = now;
  } else {
    record.count++;
  }
  ipCache.set(ip, record);

  if (record.count > MAX_REQUESTS) {
    console.warn(`[Middleware] Rate limit exceeded for IP: ${ip} on ${pathname}`);
    return new NextResponse(
      JSON.stringify({ success: false, error: 'Demasiadas peticiones. Por favor intenta más tarde.' }),
      { status: 429, headers: { 'content-type': 'application/json' } }
    );
  }

  // 4. Protection Layers
  const internalSecret = process.env.INTERNAL_SECRET;
  const providedSecret = req.headers.get('x-internal-key') || req.headers.get('x-internal-secret');

  // A. Protect Admin Routes (Pages and API)
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // RBAC check (Role-based access control)
    const isAdmin = user?.app_metadata?.role === 'admin';
    const isInternal = internalSecret && providedSecret === internalSecret;

    if (!isAdmin && !isInternal) {
      // If it's an API route, return 401 JSON
      if (pathname.startsWith('/api/')) {
        return new NextResponse(
          JSON.stringify({ success: false, error: 'Acceso administrativo denegado. Sesión inválida o permisos insuficientes.' }),
          { status: 401, headers: { 'content-type': 'application/json' } }
        );
      }
      // If it's a page, redirect to login
      if (pathname !== '/admin/login') {
        const url = req.nextUrl.clone();
        url.pathname = '/admin/login';
        url.searchParams.set('unauthorized', 'true');
        return NextResponse.redirect(url);
      }
    }
  }

  // B. Protect Email/Notification Endpoints (Internal OR Admin Only)
  const isEmailRoute = pathname.startsWith('/api/send-status-email') || pathname.startsWith('/api/notify-new-request');
  if (isEmailRoute) {
    const isAdmin = user?.app_metadata?.role === 'admin';
    const isInternal = internalSecret && providedSecret === internalSecret;

    if (!isAdmin && !isInternal) {
      console.warn(`[Middleware] Unauthorized email API access attempt from IP: ${ip} on ${pathname}`);
      return new NextResponse(
        JSON.stringify({ success: false, error: 'Acceso restringido: Se requiere sesión de administrador o secreto interno.' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      );
    }
  }

  return supabaseResponse;
}

// Ensure middleware runs on relevant paths
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};

