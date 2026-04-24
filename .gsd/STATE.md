# Project State

> Last Updated: 2026-04-24 17:13

## Current Position
- **Phase**: 6 & 8 (Stability & Mobile Excellence)
- **Task**: Finalizing Mobile Interactivity & Availability
- **Status**: Paused at 2026-04-24 19:25

## Last Session Summary
Resolved critical mobile loading and interactivity issues.
- **Availability Fix**: Implemented timestamp-based cache busting and `AbortController` timeouts in `CoastalAvailability` to prevent infinite loading on mobile incognito.
- **Gallery Carousel**: Refined mobile UX using displacement-based tap detection, separating swipe navigation from lightbox expansion.
- **Framework Recovery**: Reverted an accidental upgrade to Next.js 16 (which had broken client-side JS) back to a stable **Next.js 15.1.4**.
- **Resilience**: Added a manual "Reintentar" button to the availability overlay to handle slow cold-starts.
- **Build Quality**: Fixed all remaining Lint errors in `CoastalAvailability.tsx` and `CoastalRequestModal.tsx`.

## In-Progress Work
- The site is fully stable and building on v15.1.4.
- `middleware.ts` is restored (replacing the experimental `proxy.ts`).
- Files modified: `package.json`, `src/middleware.ts`, `src/components/coastal/CoastalAvailability.tsx`, `src/components/coastal/CoastalRequestModal.tsx`, `src/components/coastal/GalleryCarousel.tsx`.
- Tests status: `npm run build` passes Lint.

## Blockers
None currently.

## Context Dump
### Decisions Made
- **Reverted to 15.1.4**: Next.js 16 (React 19 stable) caused hydration failures and "dead" buttons. v15.1.4 is the current stable point for this repo.
- **Displacement-based Tap**: Relying on touch coordinates (dx/dy < 10px) is more reliable than scroll timestamps for separating swipe vs click on mobile.
- **Manual Retry**: Added a small link in the loading overlay to prevent users from getting stuck if Supabase or Next.js API routes have high latency.

### Approaches Tried
- **Next.js 16 Upgrade**: Outcome: FAILED. Broke interactivity.
- **`proxy.ts` migration**: Outcome: ABANDONED. Reverted to `middleware.ts` for v15 compatibility.

### Current Hypothesis
The `ChunkLoadError` was likely caused by internal instrumentation module mismatches between Next versions. Purging `.next` and staying on 15.1.x should prevent recurrence.

### Files of Interest
- `src/components/coastal/CoastalAvailability.tsx`: High-resilience fetch logic.
- `src/components/coastal/GalleryCarousel.tsx`: Touch gesture logic.
- `src/components/coastal/CoastalRequestModal.tsx`: Core form logic and validation.

## Next Steps
1. Perform final mobile regression test on a physical device in incognito.
2. Monitor build logs for any recurring chunk errors.
3. Proceed to Phase 7 (Admin Inventory Management).
