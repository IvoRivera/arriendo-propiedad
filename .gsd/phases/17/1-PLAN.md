---
phase: 17
plan: 1
wave: 1
---

# Plan 17.1: Migration Execution

## Objective
Execute the migration script to move all static images to Supabase and verify the results.

## Context
- scripts/migrate-static-images.ts
- .env.local

## Tasks

<task type="auto">
  <name>Run Migration Script</name>
  <files>scripts/migrate-static-images.ts</files>
  <action>
    Execute the migration script using `tsx`.
    - Command: `npx tsx scripts/migrate-static-images.ts`
    - Monitor output for any errors or missing files.
  </action>
  <verify>npx tsx scripts/migrate-static-images.ts</verify>
  <done>All 34 images from mockData are uploaded and indexed in the DB.</done>
</task>

<task type="auto">
  <name>Verify DB Records</name>
  <files>src/services/image-service.ts</files>
  <action>
    Run a quick query to count images per category.
    - Expected:
      - Featured: 5
      - Property: 18
      - Amenities: 11
    - Use a temporary script or SQL to verify.
  </action>
  <verify>npx tsx -e "import { createClient } from '@supabase/supabase-js'; import dotenv from 'dotenv'; dotenv.config({ path: '.env.local' }); const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!); async function c() { const { count } = await s.from('images').select('*', { count: 'exact', head: true }); console.log('Count:', count); } c();"</verify>
  <done>Database contains the correct number of image records.</done>
</task>

## Success Criteria
- [ ] 34+ image records in the `images` table.
- [ ] All images have valid public URLs pointing to Supabase Storage.
