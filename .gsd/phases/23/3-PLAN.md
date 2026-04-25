---
phase: 23
plan: 3
wave: 1
---

# Plan 23.3: UI & API Adaptation

## Objective
Update the application to fetch property-specific data instead of relying on global configuration for the base price.

## Context
- .gsd/SPEC.md
- src/lib/pricing.ts
- src/components/coastal/CoastalHero.tsx
- src/app/api/public/pricing/route.ts

## Tasks

<task type="auto">
  <name>Update pricing engine to use property_id</name>
  <files>src/lib/pricing.ts</files>
  <action>
    Refactor `calculateBookingPrice` to:
    1. Accept an optional `propertyId: string`.
    2. Fetch the property record (including base_price) from the 'properties' table.
    3. Filter 'seasonal_pricing' by `property_id` (matching the given ID or global rules).
    4. Maintain the current behavior if no propertyId is provided (fetch the first property).
  </action>
  <verify>npm run build</verify>
  <done>Pricing logic is property-aware and no longer relies on 'system_config' for base price.</done>
</task>

<task type="auto">
  <name>Update Public Hero and API routes</name>
  <files>
    src/components/coastal/CoastalHero.tsx
    src/app/api/public/pricing/route.ts
  </files>
  <action>
    1. Update `CoastalHero.tsx` to fetch the base price of the default property.
    2. Update `/api/public/pricing` route to optionally accept a `propertyId` query param.
  </action>
  <verify>Test the pricing API with a tool or browser: /api/public/pricing?startDate=...&endDate=...</verify>
  <done>Frontend and public APIs display the correct price from the new 'properties' table.</done>
</task>

## Success Criteria
- [ ] 'PROPERTY_RENT_VALUE' is effectively deprecated in favor of property-specific base_price.
- [ ] The public landing page shows the correct price.
- [ ] The booking API returns prices based on the property record.
