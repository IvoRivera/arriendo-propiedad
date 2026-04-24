import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Proxy
 * First line of defense for the application.
 * Renamed from middleware to proxy as per Next.js v16 convention.
 */

// Basic Rate Limiting state (In-memory, local to the Edge node)
const ipCache = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60000;
const MAX_REQUESTS = 30; // Global threshold

export function proxy(req: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ip = (req as any).ip || req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  const { pathname } = req.nextUrl;

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
    console.warn(`[Proxy] Rate limit exceeded for IP: ${ip} on ${pathname}`);
    return new NextResponse(
      JSON.stringify({ success: false, error: 'Demasiadas peticiones. Por favor intenta más tarde.' }),
      { status: 429, headers: { 'content-type': 'application/json' } }
    );
  }

  // 2. Admin Protection (Basic Check)
  if (pathname.startsWith('/api/admin')) {
    const authHeader = req.headers.get('authorization');
    const internalKey = req.headers.get('x-internal-key');

    // If no credentials at all, block early
    if (!authHeader && !internalKey) {
      return new NextResponse(
        JSON.stringify({ success: false, error: 'Autenticación requerida para acceder a recursos administrativos.' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      );
    }
  }

  return NextResponse.next();
}

// Ensure proxy only runs on relevant paths
export const config = {
  matcher: [
    '/api/admin/:path*',
    '/api/send-status-email/:path*',
    '/api/notify-new-request/:path*', // Also protect the notification endpoint from spam
  ],
};
