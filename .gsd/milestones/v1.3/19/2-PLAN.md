---
phase: 19
plan: 2
wave: 2
---

# Plan 19.2: Parent Integration & Final Cleanup

## Objective
Update the parent components and page structure to ensure clean data flow and typed props.

## Context
- src/app/home-client.tsx
- src/app/page.tsx

## Tasks

<task type="auto">
  <name>Update HomeClient Types</name>
  <files>src/app/home-client.tsx</files>
  <action>
    - Import `DbImage`.
    - Update `HomeClientProps` to use `dynamicImages: DbImage[]`.
  </action>
  <verify>grep "dynamicImages: DbImage\[]" src/app/home-client.tsx</verify>
  <done>HomeClient uses strict types for dynamic images.</done>
</task>

<task type="auto">
  <name>Update Page Integration</name>
  <files>src/app/page.tsx</files>
  <action>
    - Ensure `ImageService.getPublicImages()` result is correctly passed to `HomeClient`.
  </action>
  <verify>grep "ImageService.getPublicImages()" src/app/page.tsx</verify>
  <done>Data flow is typed from server to client.</done>
</task>

## Success Criteria
- [ ] End-to-end type safety for images.
- [ ] Components render images from Supabase.
- [ ] No console errors related to missing images.
