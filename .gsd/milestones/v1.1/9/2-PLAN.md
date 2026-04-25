---
phase: 9
plan: 2
wave: 1
---

# Plan 9.2: Price Snapshotting & Server-Side Booking

## Objective
Ensure that the calculated price is "frozen" and stored when a user submits a reservation request, moving the creation logic to the server for security.

## Context
- src/components/coastal/CoastalRequestModal.tsx
- src/app/api/notify-new-request/route.ts
- src/lib/pricing.ts

## Tasks

<task type="auto">
  <name>Create Server-Side Booking API</name>
  <files>src/app/api/public/bookings/route.ts</files>
  <action>
    Create a new POST endpoint to handle booking requests:
    1. Validate input data using Zod.
    2. Perform concurrency check (check if dates are still available).
    3. Call `calculateBookingPrice(check_in, check_out)` to get the "frozen" price.
    4. Insert the record into `booking_requests` with `total_price` and `price_breakdown`.
    5. Return the created record ID.
  </action>
  <verify>npx tsx scratch/test-booking-api.ts</verify>
  <done>API route successfully handles creation with snapshotting.</done>
</task>

<task type="auto">
  <name>Update Frontend Submission Logic</name>
  <files>src/components/coastal/CoastalRequestModal.tsx</files>
  <action>
    Update the `onSubmit` handler in `CoastalRequestModal`:
    1. Remove direct Supabase insertion.
    2. Call the new `/api/public/bookings` endpoint instead.
    3. Keep existing loading and error states.
  </action>
  <verify>Submit a reservation from the UI and verify it calls the new API.</verify>
  <done>Frontend uses the server-side API for creation.</done>
</task>

<task type="auto">
  <name>Update Notifications to Use Snapshots</name>
  <files>src/app/api/notify-new-request/route.ts, src/app/api/send-status-email/route.ts</files>
  <action>
    Update email routes to use the snapshotted `total_price` and `price_breakdown` from the database instead of calculating it on-the-fly.
  </action>
  <verify>npx tsx scratch/test-notifications-snapshot.ts</verify>
  <done>All emails reflect the frozen price stored at creation time.</done>
</task>

## Success Criteria
- [ ] Prices are snapshotted and stored in the database.
- [ ] Booking creation logic is moved to the server.
- [ ] Customer communications use the snapshotted price.
