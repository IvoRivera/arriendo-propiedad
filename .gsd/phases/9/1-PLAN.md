---
phase: 9
plan: 1
wave: 1
---

# Plan 9.1: Database & Core Logic

## Objective
Establish the database schema for seasonal pricing and implement the core calculation logic on the server.

## Context
- .gsd/SPEC.md
- .gsd/phases/9/RESEARCH.md
- src/app/api/notify-new-request/route.ts (example of price usage)

## Tasks

<task type="auto">
  <name>Database Schema</name>
  <files>supabase/migrations/20260424_seasonal_pricing.sql</files>
  <action>
    Create a migration file to add the `seasonal_pricing` table and update the `booking_requests` table to include `total_price` and `price_breakdown` (JSONB) fields.
    - Include the constraints and indexes as defined in RESEARCH.md.
    - Add default values for priority.
  </action>
  <verify>npx tsx scratch/verify-schema.ts</verify>
  <done>seasonal_pricing table created and booking_requests table updated.</done>
</task>

<task type="auto">
  <name>Pricing Calculation Utility</name>
  <files>src/lib/pricing.ts</files>
  <action>
    Implement a server-side utility function `calculateBookingPrice(startDate, endDate)` that:
    1. Fetches relevant seasonal prices from Supabase `seasonal_pricing` table.
    2. Fetches the base price specifically from the `system_config` table (field `PROPERTY_RENT_VALUE`).
    3. Iterates through each night and applies the highest priority/most specific price.
    4. Returns the total price and a daily breakdown.
  </action>
  <verify>npx tsx scratch/test-pricing.ts</verify>
  <done>calculateBookingPrice correctly handles base price from system_config, seasonal overrides, and overlaps.</done>
</task>

## Success Criteria
- [ ] Database schema is ready for dynamic pricing.
- [ ] Logic for priority-based price calculation is implemented and verified.
