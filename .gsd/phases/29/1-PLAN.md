---
phase: 29
plan: 1
wave: 1
---

# Plan 29.1: Pricing Resilience Implementation

## Objective
Secure the Pricing Engine by injecting the `SchemaValidator` guard at the entry point of price calculations.

## Context
- .gsd/SPEC.md
- src/lib/pricing.ts
- src/lib/schemaValidator.ts

## Tasks

<task type="auto">
  <name>Inject Schema Guard in Pricing Service</name>
  <files>src/lib/pricing.ts</files>
  <action>
    Modify `calculateBookingPrice` to:
    1. Call `validateSchema()` at the very beginning.
    2. If validation fails (`success: false`), throw a detailed Error with the prefix `[SchemaGuard] [PricingAPI]`.
    3. Ensure the error message lists the missing components.
  </action>
  <verify>Check code for the validation call and error throwing logic.</verify>
  <done>`calculateBookingPrice` no longer executes if the schema is inconsistent.</done>
</task>

<task type="auto">
  <name>Verify Pricing Failure on Schema Inconsistency</name>
  <files>scripts/verify-pricing-guard.ts</files>
  <action>
    Create a test script that:
    1. Temporarily mocks or modifies the `CRITICAL_SCHEMA` (in memory or via a temporary edit) to include a non-existent column.
    2. Attempts to call `calculateBookingPrice`.
    3. Asserts that an error is thrown and caught with the correct prefix.
  </action>
  <verify>Run `npx tsx scripts/verify-pricing-guard.ts`.</verify>
  <done>The script proves that pricing logic is blocked when the schema check fails.</done>
</task>

## Success Criteria
- [ ] Pricing API/Service fails explicitly when schema is broken.
- [ ] Logs provide immediate diagnostic information (less than 1 minute to identify).
