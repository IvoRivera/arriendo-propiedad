---
phase: 28
plan: 2
wave: 1
---

# Plan 28.2: Critical Schema Verification

## Objective
Establish the definitive list of critical columns and verify that the validator correctly detects both existing and missing columns.

## Context
- .gsd/SPEC.md
- src/lib/schemaValidator.ts

## Tasks

<task type="auto">
  <name>Define Validated Schema Mapping</name>
  <files>src/lib/schemaValidator.ts</files>
  <action>
    Update `src/lib/schemaValidator.ts` with the schema verified interactively:
    - `properties`: `id`, `name`, `location_type`, `luxury_tier`, `base_price`
    - `price_overrides`: `id`, `property_id`, `date`, `price`
    - `images`: `id`, `url`, `property_id`, `category`, `metadata`
    - `booking_requests`: `id`, `property_id`, `check_in`, `check_out`
    - `seasonal_pricing`: `id`, `property_id`, `start_date`, `end_date`, `price_per_night`
  </action>
  <verify>Verify the `CRITICAL_SCHEMA` object matches these names.</verify>
  <done>The mapping is accurate to the real database state.</done>
</task>

<task type="auto">
  <name>Create Verification Test Script</name>
  <files>scripts/test-schema-integrity.ts</files>
  <action>
    Create a standalone script in `scripts/test-schema-integrity.ts` that:
    1. Calls `validateSchema` with the `CRITICAL_COLUMNS`.
    2. Deliberately adds a fake check (e.g., table `properties`, column `non_existent_col`) to verify failure detection.
    3. Prints a clean report to the console.
  </action>
  <verify>Run the script with `npx tsx scripts/test-schema-integrity.ts`.</verify>
  <done>The script identifies real columns as present and the fake column as missing.</done>
</task>

## Success Criteria
- [ ] Comprehensive mapping of all critical tables/columns.
- [ ] Test script provides empirical evidence of detection capability (both positive and negative).
