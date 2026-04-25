---
phase: 28
plan: 1
wave: 1
---

# Plan 28.1: Schema Validator Core

## Objective
Implement the core infrastructure for schema validation using a PostgreSQL function (RPC) to access `information_schema.columns` securely.

## Context
- .gsd/SPEC.md
- .gsd/phases/28/RESEARCH.md
- src/lib/supabaseServer.ts

## Tasks

<task type="checkpoint:human-verify">
  <name>Create PostgreSQL RPC Function</name>
  <files>None (Database SQL Editor)</files>
  <action>
    Run the following SQL in the Supabase SQL Editor to create the verification function:

    ```sql
    CREATE OR REPLACE FUNCTION verify_schema(p_queries jsonb)
    RETURNS TABLE(table_name text, column_name text, exists boolean) AS $$
    BEGIN
      RETURN QUERY
      SELECT 
        q.t::text, 
        q.c::text,
        EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = q.t 
          AND column_name = q.c
        )
      FROM jsonb_to_recordset(p_queries) AS q(t text, c text);
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    ```
    This function allows the service-role client to check column existence without exposing the entire `information_schema` to the public.
  </action>
  <verify>Call the RPC from the SQL editor to test: `select * from verify_schema('[{"t": "properties", "c": "property_id"}]'::jsonb);`</verify>
  <done>The function is created and returns a result indicating if the column exists.</done>
</task>

<task type="auto">
  <name>Implement SchemaValidator Utility</name>
  <files>src/lib/schemaValidator.ts</files>
  <action>
    Create `src/lib/schemaValidator.ts` that:
    1. Imports `supabaseService` from `src/lib/supabaseServer.ts`.
    2. Implements a function `validateSchema(checks: { table: string, column: string }[])` that calls the `verify_schema` RPC.
    3. Handles errors and returns a detailed report of missing columns.
    4. Includes a constant `CRITICAL_COLUMNS` defining the essential columns for `properties`, `price_overrides`, `images`, and `bookings`.
  </action>
  <verify>Check file existence and run basic syntax check.</verify>
  <done>`src/lib/schemaValidator.ts` exists and implements the RPC call logic.</done>
</task>

## Success Criteria
- [ ] The `verify_schema` RPC exists in the database.
- [ ] `src/lib/schemaValidator.ts` can successfully call the RPC and identify missing columns.
