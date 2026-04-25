---
phase: 16
plan: 1
wave: 1
---

# Plan 16.1: Migration Script Logic

## Objective
Create the core infrastructure for the migration script that will move local images to Supabase.

## Context
- .gsd/phases/16/RESEARCH.md
- src/data/mockData.ts
- src/lib/supabase.ts

## Tasks

<task type="auto">
  <name>Initialize Migration Script</name>
  <files>scripts/migrate-static-images.ts</files>
  <action>
    Create a Node.js script using `supabaseAdmin`.
    - Import `fs` and `path`.
    - Implement a `migrateFile(localPath, category, priority, alt)` function.
    - Logic:
      1. Read file as Buffer.
      2. Upload to `carousel-images` bucket.
      3. Insert into `images` table.
    - Note: Handle the fact that `supabaseAdmin` might need env vars loaded manually if not using `next dev`.
  </action>
  <verify>test -f scripts/migrate-static-images.ts</verify>
  <done>Migration script skeleton with upload logic exists.</done>
</task>

<task type="auto">
  <name>Extract Mapping from mockData</name>
  <files>scripts/migrate-static-images.ts</files>
  <action>
    Hardcode the current mapping from `mockData.ts` into the script.
    - Extract `featured`, `interiors` (property), and `amenities` arrays.
    - Ensure correct path resolution (e.g., prefixing with `public/`).
  </action>
  <verify>grep "interiors" scripts/migrate-static-images.ts</verify>
  <done>Script contains the full list of images to migrate.</done>
</task>

## Success Criteria
- [ ] Migration script is ready for execution.
- [ ] All 30+ images from mockData are accounted for in the script.
