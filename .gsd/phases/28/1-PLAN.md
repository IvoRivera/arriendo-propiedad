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
  <name>Create Corrected PostgreSQL RPC Function</name>
  <files>None (Database SQL Editor)</files>
  <action>
    Ensure the RPC function in Supabase uses unique output names to avoid ambiguity:

    ```sql
    CREATE OR REPLACE FUNCTION verify_schema(p_queries jsonb)
    RETURNS TABLE(out_table text, out_column text, exists_flag boolean) AS $$
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
  </action>
  <verify>Test with: `SELECT * FROM verify_schema('[{"t": "properties", "c": "id"}]'::jsonb);`</verify>
  <done>The function returns `out_table`, `out_column`, and `exists_flag` correctly.</done>
</task>

<task type="auto">
  <name>Implement SchemaValidator Utility</name>
  <files>src/lib/schemaValidator.ts</files>
  <action>
    Create `src/lib/schemaValidator.ts` that:
    1. Imports `supabaseService` from `src/lib/supabaseServer.ts`.
    2. Implements `validateSchema(checks: { table: string, column: string }[])`.
    3. Handles the response mapping (out_table -> table, etc.).
    4. Includes the confirmed `CRITICAL_SCHEMA` mapping.
  </action>
  <verify>Check file existence and exported functions.</verify>
  <done>`src/lib/schemaValidator.ts` implements the RPC call logic with correct column names.</done>
</task>

## Success Criteria
- [ ] The `verify_schema` RPC exists in the database.
- [ ] `src/lib/schemaValidator.ts` can successfully call the RPC and identify missing columns.
