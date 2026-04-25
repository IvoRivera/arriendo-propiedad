---
phase: 37
plan: 1
wave: 1
---

# Plan 37.1: Deletion and Final Health Check

## Objective
Finalize the migration by deleting the legacy `mockData.ts` file and performing a comprehensive health check of the site.

## Context
- src/data/mockData.ts
- src/config/site-content.ts
- src/config/inventory.ts

## Tasks

<task type="auto">
  <name>Delete Legacy Mock Data</name>
  <files>src/data/mockData.ts</files>
  <action>
    1. Delete the file `src/data/mockData.ts`.
  </action>
  <verify>Check that the file no longer exists.</verify>
  <done>Legacy data file removed from the project.</done>
</task>

<task type="auto">
  <name>Final Health Check</name>
  <files>src/app/page.tsx, src/app/guest/checkin/[id]/page.tsx</files>
  <action>
    1. Verify that the home page and check-in page still render correctly (no 500 errors).
    2. Ensure that the dynamic data sources (Supabase/Config) are providing all necessary content.
  </action>
  <verify>Check terminal logs for runtime errors.</verify>
  <done>Site is fully operational and "mockData-free".</done>
</task>

## Success Criteria
- [ ] `src/data/mockData.ts` deleted.
- [ ] No compilation errors in the project.
- [ ] All coastal UI components display correct content from `SITE_CONTENT`.
