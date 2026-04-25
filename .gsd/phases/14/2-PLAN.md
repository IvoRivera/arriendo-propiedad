---
phase: 14
plan: 2
wave: 1
---

# Plan 14.2: Priority Persistence Logic

## Objective
Implement the backend logic and service calls to persist the new image order to Supabase.

## Context
- src/services/image-service.ts
- src/components/admin/ImageManager.tsx

## Tasks

<task type="auto">
  <name>Implement Bulk Priority Update in ImageService</name>
  <files>src/services/image-service.ts</files>
  <action>
    Add a `reorderImages` method to `ImageService`.
    - Accepts an array of `{ id: string, priority: number }`.
    - Uses `supabaseAdmin` to perform an upsert or multiple updates to sync the new order.
    - Tip: Since we only have a few images per category, we can use `.upsert(updates)` if the schema allows or multiple `.update().eq('id', id)` calls.
  </action>
  <verify>grep "reorderImages" src/services/image-service.ts</verify>
  <done>Service layer supports reordering.</done>
</task>

<task type="auto">
  <name>Finalize Persistence in UI</name>
  <files>src/components/admin/ImageManager.tsx</files>
  <action>
    Complete the `handleDragEnd` logic.
    - After the local state update, calculate the new priorities.
    - Call `ImageService.reorderImages` with the updated list.
    - Add error handling to revert the local state if the backend update fails.
    - Show a subtle success indicator (toast or status message).
  </action>
  <verify>grep "reorderImages" src/components/admin/ImageManager.tsx</verify>
  <done>Changes to image order are persisted to the database.</done>
</task>

## Success Criteria
- [ ] Reordering persists after a page refresh.
- [ ] Errors during reordering are handled gracefully (reverting the UI).
