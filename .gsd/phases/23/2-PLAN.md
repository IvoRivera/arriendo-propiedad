---
phase: 23
plan: 2
wave: 1
---

# Plan 23.2: Initial Property Bootstrap

## Objective
Populate the new schema with existing data and ensure continuity for the current "Depto Reñaca" unit.

## Context
- .gsd/SPEC.md
- .gsd/phases/23/RESEARCH.md
- src/lib/systemConfig.ts

## Tasks

<task type="auto">
  <name>Migrate current settings to default property</name>
  <files>supabase/migrations/20240425_migrate_data.sql</files>
  <action>
    Create a migration to:
    1. Insert a default property "Depto Reñaca" with slug 'depto-renaca'.
    2. Set its 'base_price' using the current 'PROPERTY_RENT_VALUE' from 'system_config'.
    3. Update all existing rows in 'seasonal_pricing', 'bookings', and 'images' to point to this new property ID.
  </action>
  <verify>ls supabase/migrations/20240425_migrate_data.sql</verify>
  <done>Data migrated and linked to the new default property.</done>
</task>

<task type="auto">
  <name>Refactor system config to handle property defaults</name>
  <files>src/lib/systemConfigServer.ts</files>
  <action>
    Modify `getLiveConfigServer` or create a new `getPropertyConfig` helper that:
    1. Fetches data from the 'properties' table if a propertyId is provided.
    2. Falls back to 'system_config' for global settings.
    3. Ensures existing code calling `getLiveConfigServer` for `PROPERTY_RENT_VALUE` is updated to look at the property record instead.
  </action>
  <verify>npm run build (to catch type/dependency errors)</verify>
  <done>Codebase correctly fetches base price from the new 'properties' table.</done>
</task>

## Success Criteria
- [ ] At least one property exists in the database.
- [ ] Existing seasonal prices and bookings are linked to the property.
- [ ] No regression in pricing calculation for the existing unit.
