---
phase: 11
plan: 2
wave: 1
---

# Plan 11.2: Consistency & Cleanup Logic

## Objective
Implement logic to ensure consistency between Supabase Storage and the database, preventing orphaned files.

## Context
- .gsd/phases/11/RESEARCH.md
- src/lib/supabase.ts (existing client)

## Tasks

<task type="auto">
  <name>Atomic Image Service</name>
  <files>src/services/image-service.ts</files>
  <action>
    Implement a service class for image operations.
    - `uploadImage`: Performs Storage upload followed by DB insert. If DB insert fails, it MUST attempt to delete the Storage file.
    - `deleteImage`: Performs DB deletion followed by Storage removal. 
    - Use proper error handling and logging.
  </action>
  <verify>test -f src/services/image-service.ts</verify>
  <done>Service implemented with rollback logic for failed uploads.</done>
</task>

<task type="auto">
  <name>Reaper Script Placeholder</name>
  <files>scripts/cleanup-orphans.ts</files>
  <action>
    Create a script that:
    - Lists files in the `carousel-images` bucket.
    - Queries the `images` table.
    - Identifies files in storage that have no database reference.
    - Logs orphans (actual deletion can be a manual flag for now to prevent accidents).
  </action>
  <verify>test -f scripts/cleanup-orphans.ts</verify>
  <done>Cleanup script created and able to identify orphans.</done>
</task>

## Success Criteria
- [ ] Rollback logic prevents database-less storage files during upload.
- [ ] Orphan detection script is ready to run as a maintenance task.
