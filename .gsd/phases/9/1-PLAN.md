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
    Create a migration file to add the `seasonal_pricing` table and update the `reservation_requests` table to include `total_price` and `price_breakdown` (JSONB) fields.
    - Include the constraints and indexes as defined in RESEARCH.md.
    - Add default values for priority.
  </action>
  <verify>Check if the table exists in Supabase (manual check or migration run simulation).</verify>
  <done>seasonal_pricing table created and reservation_requests table updated.</done>
</task>

<task type="auto">
  <name>Pricing Calculation Utility</name>
  <files>src/lib/pricing.ts</files>
  <action>
    Implement a server-side utility function `calculateBookingPrice(startDate, endDate)` that:
    1. Fetches relevant seasonal prices from Supabase.
    2. Fetches the base price from configuration.
    3. Iterates through each night and applies the highest priority/most specific price.
    4. Returns the total price and a daily breakdown.
  </action>
  <verify>Create a temporary test script in scratch/test-pricing.ts to verify calculation for overlapping ranges.</verify>
  <done>calculateBookingPrice correctly handles base price, seasonal overrides, and overlaps.</done>
</task>

## Success Criteria
- [ ] Database schema is ready for dynamic pricing.
- [ ] Logic for priority-based price calculation is implemented and verified.
