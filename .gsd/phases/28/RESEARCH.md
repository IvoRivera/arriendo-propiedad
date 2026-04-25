# RESEARCH.md — Phase 28: Base de Validación de Schema

## Objective
Determine the most robust and low-overhead way to verify the existence of tables and columns in Supabase (PostgreSQL) from a Next.js server-side context.

## Options Considered

### 1. PostgreSQL RPC (Recommended by Supabase)
- **Pros**: Clean, performant, can check multiple columns at once by querying `information_schema`.
- **Cons**: Requires deploying a SQL function to the database. Adds a migration step.

### 2. "Select Hack" (Lightweight)
- **Pros**: No database changes required. Uses standard `@supabase/supabase-js` client.
- **Cons**: One request per check (or one large select that might fail entirely). Harder to distinguish between "table missing" and "column missing" without parsing error codes.

### 3. Raw SQL via `postgres` or `knex`
- **Pros**: Full control.
- **Cons**: Adds a new dependency and requires managing a separate connection pool/credentials. Not recommended for this project's constraints (low overhead).

## Decision
**Option 1 (PostgreSQL RPC)** is the most professional and scalable approach. We will create a function `check_schema_integrity` that takes a JSON object of expected tables/columns and returns a report.

However, to keep it simple and aligned with the "low overhead" constraint in `SPEC.md`, we will start with **Option 2 (Select Hack)** for individual checks, OR a simplified RPC that just exposes `information_schema` securely.

Actually, the `SPEC.md` mentioned:
> "Uso de `information_schema.columns` para checks"

So we should probably go with the RPC that queries `information_schema`.

## Proposed SQL Function
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

## Implementation Plan
1. Create the RPC function in Supabase.
2. Implement `src/lib/schemaValidator.ts` to call this RPC.
3. Define the list of "Critical Columns" to check.
