---
phase: 12
plan: 2
wave: 1
---

# Plan 12.2: Image Management Actions & Deletion Security

## Objective
Implement secure management actions, specifically deletion, with proper user confirmation and state synchronization.

## Context
- src/components/admin/ImageManager.tsx
- src/services/image-service.ts

## Tasks

<task type="auto">
  <name>Implement Image Deletion with Confirmation</name>
  <files>src/components/admin/ImageManager.tsx</files>
  <action>
    Add deletion capabilities to the `ImageManager`.
    - Implement `handleDelete` using `ImageService.deleteImage`.
    - Use `window.confirm` to validate destructive actions ("¿Estás seguro de eliminar esta imagen? Esta acción no se puede deshacer.").
    - Update local state immediately after a successful deletion to reflect changes in the UI.
    - Add loading states to the delete button to prevent multiple clicks.
  </action>
  <verify>grep "deleteImage" src/components/admin/ImageManager.tsx</verify>
  <done>Images can be securely deleted with a confirmation prompt.</done>
</task>

<task type="auto">
  <name>Add Error Handling & Status Feedback</name>
  <files>src/components/admin/ImageManager.tsx</files>
  <action>
    Ensure the user receives feedback for management actions.
    - Add error handling to fetch and delete operations.
    - Display toast-like notifications or status messages for success/failure.
    - Ensure the UI indicates when operations are in progress.
  </action>
  <verify>grep "catch" src/components/admin/ImageManager.tsx</verify>
  <done>User receives clear feedback for all management actions.</done>
</task>

## Success Criteria
- [ ] Deletion requires explicit user confirmation.
- [ ] UI stays in sync with the database/storage state after deletion.
- [ ] Errors are caught and reported to the user gracefully.
