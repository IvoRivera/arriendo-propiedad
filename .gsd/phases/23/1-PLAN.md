---
phase: 23
plan: 1
wave: 1
---

# Plan 23.1: Database Schema Expansion

## Objective
Create the foundation for multi-property support by adding the necessary tables and relationships in Supabase.

## Context
- .gsd/SPEC.md
- .gsd/phases/23/RESEARCH.md

## Tasks

<task type="auto">
  <name>Create properties and price_overrides tables</name>
  <files>supabase/migrations/20240425_create_properties.sql</files>
  <action>
    Create a new migration file to:
    1. Create 'properties' table with columns: id, name, slug, base_price, location_type, luxury_tier, seasonal_sensitivity.
    2. Create 'pricing_profiles' table with columns: id, name, multipliers (jsonb).
    3. Create 'price_overrides' table with columns: id, property_id (FK), date, price, reason.
    4. Add RLS (Row Level Security) policies for admin access.
  </action>
  <verify>ls supabase/migrations/20240425_create_properties.sql</verify>
  <done>Migration file created with correct schema and RLS policies.</done>
</task>

<task type="auto">
  <name>Add property_id to existing tables</name>
  <files>supabase/migrations/20240425_update_existing_tables.sql</files>
  <action>
    Create a migration to:
    1. Add 'property_id' column to 'seasonal_pricing' (nullable).
    2. Add 'property_id' column to 'bookings' (nullable).
    3. Add 'property_id' column to 'images' (to allow property-specific galleries later).
    Ensure columns are nullable for now to avoid breaking existing data.
  </action>
  <verify>ls supabase/migrations/20240425_update_existing_tables.sql</verify>
  <done>Existing tables updated with property_id column.</done>
</task>

## Success Criteria
- [ ] Schema migration files ready for execution.
- [ ] 'properties' table supports all fields defined in research.
- [ ] Relationships defined via foreign keys.
