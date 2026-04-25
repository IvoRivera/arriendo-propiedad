---
phase: 18
plan: 2
wave: 2
---

# Plan 18.2: mockData.ts Image Cleanup

## Objective
Remove all hardcoded image references from the mock data to ensure the database is the only source of truth.

## Context
- src/data/mockData.ts

## Tasks

<task type="auto">
  <name>Remove Images from mockData</name>
  <files>src/data/mockData.ts</files>
  <action>
    - Empty the `images` arrays in `galleryData` (featured, interiors, amenities).
    - Remove `image` and `imageAlt` from `heroData`.
    - Note: Keep the structure so types don't break, but the content must be gone.
  </action>
  <verify>grep "images: \[]" src/data/mockData.ts</verify>
  <done>mockData.ts contains no image paths.</done>
</task>

## Success Criteria
- [ ] `mockData.ts` has zero references to `/images/` paths.
- [ ] The project still compiles (types are preserved).
