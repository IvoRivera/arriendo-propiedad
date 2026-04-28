import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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

export function proxy(req: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ip = (req as any).ip || req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  const { pathname } = req.nextUrl;

  // 0. Skip rate limiting for excluded paths or in development
  if (isExcludedPath(pathname) || process.env.NODE_ENV !== 'production') {
    return NextResponse.next();
  }

  // 1. Rate Limiting Logic
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

  // 2. Protection Layers
  const internalSecret = process.env.INTERNAL_SECRET;
  const providedSecret = req.headers.get('x-internal-key') || req.headers.get('x-internal-secret');

  // A. Protect Admin Routes
  if (pathname.startsWith('/api/admin')) {
    const authHeader = req.headers.get('authorization');

    // Early block if no credentials
    if (!authHeader && (!internalSecret || providedSecret !== internalSecret)) {
      return new NextResponse(
        JSON.stringify({ success: false, error: 'Autenticación requerida para acceder a recursos administrativos.' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      );
    }
  }

  // B. Protect Email/Notification Endpoints (Internal Only)
  const isEmailRoute = pathname.startsWith('/api/send-status-email') || pathname.startsWith('/api/notify-new-request');
  if (isEmailRoute) {
    if (!internalSecret || providedSecret !== internalSecret) {
      console.warn(`[Middleware] Unauthorized internal API access attempt from IP: ${ip} on ${pathname}`);
      return new NextResponse(
        JSON.stringify({ success: false, error: 'Acceso restringido: Secreto interno inválido o ausente.' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      );
    }
  }

  return NextResponse.next();
}

// Ensure middleware runs on relevant paths, including potential static assets if matcher is loose
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)', // All pages
    '/api/:path*', // All API routes
  ],
};
