---
phase: 9
plan: 5
wave: 3
---

# Plan 9.5: Calendar & Modal Integration

## Objective
Update the public-facing availability calendar and booking modal to reflect dynamic pricing.

## Context
- src/components/coastal/CoastalAvailability.tsx
- src/components/coastal/CoastalRequestModal.tsx
- src/components/coastal/CoastalHero.tsx

## Tasks

<task type="auto">
  <name>Public Calendar Pricing Integration</name>
  <files>src/components/coastal/CoastalAvailability.tsx</files>
  <action>
    Update the availability calendar to:
    1. Fetch dynamic prices for the displayed dates. The API route needs to return both the seasonal prices and the `PROPERTY_RENT_VALUE` from `system_config`.
    2. (Optional but recommended) Show the daily price in a small label within each calendar day cell.
    3. Calculate and show an "Estimated Total" when dates are selected using the `calculateBookingPrice` logic on the frontend.
  </action>
  <verify>npx tsx scratch/test-public-calendar-pricing.ts</verify>
  <done>Public calendar shows dynamic pricing info and accurate estimates.</done>
</task>

<task type="auto">
  <name>Booking Modal Breakdown</name>
  <files>src/components/coastal/CoastalRequestModal.tsx</files>
  <action>
    Update the booking modal to:
    1. Display a clear breakdown of the total price (e.g., "N nights x $X = $Total").
    2. Show the "Frozen Price" warning if applicable.
    3. Ensure the dynamic total is calculated via an API request to the backend using `calculateBookingPrice` to prevent client-side manipulation, or at least re-verified when sending the request.
  </action>
  <verify>npx tsx scratch/test-booking-modal-pricing.ts</verify>
  <done>Booking modal provides transparency on how the total price was calculated.</done>
</task>

<task type="auto">
  <name>Hero Price Update</name>
  <files>src/components/coastal/CoastalHero.tsx</files>
  <action>
    Update the `CoastalHero` to show "Desde $minPrice".
    1. Fetch the `PROPERTY_RENT_VALUE` from `system_config`.
    2. Fetch the lowest price from `seasonal_pricing` in the next 90 days.
    3. Display the minimum of the two.
  </action>
  <verify>npx tsx scratch/test-hero-pricing.ts</verify>
  <done>Hero component shows the most accurate "starting from" price.</done>
</task>

## Success Criteria
- [ ] Users see accurate, dynamic pricing throughout the booking flow.
- [ ] Price transparency is improved with breakdowns.
