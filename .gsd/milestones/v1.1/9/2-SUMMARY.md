# Plan 9.2 Summary: Price Snapshotting & Server-Side Booking

## Accomplished
- Created `src/app/api/public/bookings/route.ts` to handle booking requests server-side.
- The new API performs Zod validation, calculates the dynamic price using `calculateBookingPrice`, and snapshots `total_price` and `price_breakdown` into the database.
- Moved "Anti-Fiesta" scoring logic to the backend for improved security.
- Updated `CoastalRequestModal.tsx` to use the new server-side API instead of direct Supabase insertion.
- Updated notification routes (`notify-new-request` and `send-status-email`) to prioritize snapshotted prices from the request body.

## Verification Results
- Manual verification of API route logic: Correctly implements the requirements for backend-only pricing calculation.
- Component update: Successfully redirects submission flow to the server.
- Notification updates: Email templates now support dynamic/snapshotted totals.
