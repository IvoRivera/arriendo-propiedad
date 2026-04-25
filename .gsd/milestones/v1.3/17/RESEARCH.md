# Research: Migration Execution (Phase 17)

## Objective
Execute the migration of static images to Supabase and verify the consistency of the database and storage.

## Findings

### 1. Execution Method
- **Tool**: `tsx`.
- **Command**: `npx tsx scripts/migrate-static-images.ts`.
- **Environment**: `.env.local` is correctly configured with `SUPABASE_SERVICE_ROLE_KEY`.

### 2. Idempotency
- The script uses `upsert` on the `storage_path` column.
- This means if the script is run multiple times, it will update existing records rather than creating duplicates.
- Existing records from v1.2 (uploaded manually via Admin) might overlap if they have the same filenames, but the script uses specific subfolders (`featured/`, `property/`, `amenities/`) which should keep them distinct unless the filename is identical.

### 3. Verification Strategy
- **Row Count**: Should have at least 34 images (the count from `mockData.ts`).
- **Storage**: Verify files exist in the `carousel-images` bucket via Supabase dashboard or CLI.
- **Data Integrity**: Verify that `priority` is set (1 to N) for each category.

## Decisions
- Execute the script using `tsx`.
- Verify row counts per category.
