# Summary - Plan 23.3

## Completed Tasks
- **Update pricing engine to use property_id**: Refactored `calculateBookingPrice` to fetch property-specific base prices and filter seasonal rules/overrides.
- **Update Public Hero and API routes**:
    - Updated `src/app/page.tsx` (server component) to fetch the default property.
    - Updated `HomeClient` and `CoastalHero` to pass and consume property data.
    - Refactored `/api/public/pricing` to support property-based filtering.

## Evidence
- `src/lib/pricing.ts` now supports `propertyId`.
- `CoastalHero` displays the price from the `properties` table.
- `/api/public/pricing` returns property context and overrides.
