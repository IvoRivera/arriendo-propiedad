---
phase: 9
plan: 2
wave: 1
---

# Plan 9.2: Price Snapshotting

## Objective
Ensure that the calculated price is "frozen" and stored when a user submits a reservation request.

## Context
- src/app/api/public/reservations/route.ts (or wherever the reservation creation logic is)
- src/lib/pricing.ts

## Tasks

<task type="auto">
  <name>Integrate Pricing into Reservation Creation</name>
  <files>src/app/api/public/reservations/route.ts</files>
  <action>
    Update the reservation request creation endpoint to:
    1. Call `calculateBookingPrice` using the requested dates.
    2. Store the resulting `total_price` and `price_breakdown` in the database record.
    3. Use this frozen price for subsequent email notifications instead of recalculating it.
  </action>
  <verify>Submit a test reservation and check the database record for total_price and breakdown.</verify>
  <done>Reservations store the exact price calculated at the time of submission.</done>
</task>

<task type="auto">
  <name>Update Email Notifications</name>
  <files>src/app/api/notify-new-request/route.ts, src/app/api/send-status-email/route.ts</files>
  <action>
    Update email logic to use the `total_price` and `price_breakdown` from the reservation record instead of calculating it on the fly from the current (potentially changed) configuration.
  </action>
  <verify>Send a status update email for an existing reservation and confirm the price matches the snapshot.</verify>
  <done>Emails reflect the frozen price stored in the reservation request.</done>
</task>

## Success Criteria
- [ ] Prices are snapshotted in the database upon request.
- [ ] All customer communication uses the snapshotted price.
