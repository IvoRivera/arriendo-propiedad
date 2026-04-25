---
phase: 12
plan: 1
wave: 1
---

# Plan 12.1: Admin UI Navigation & Image Gallery

## Objective
Extend the admin dashboard with an "Imágenes" tab and create a secure gallery view for managing uploaded content.

## Context
- .gsd/SPEC.md
- .gsd/phases/12/RESEARCH.md
- src/app/admin/page.tsx (main admin entry)
- src/services/image-service.ts (data operations)

## Tasks

<task type="auto">
  <name>Add Images View to Admin Page</name>
  <files>src/app/admin/page.tsx</files>
  <action>
    Update the `AdminPage` component to support the new `images` view.
    - Update `activeView` type and initial state.
    - Add the "Imágenes" button to the navigation bar (using `Image` icon from lucide-react).
    - Update the header title logic for the `images` view.
    - Render the `<ImageManager />` component when `activeView === 'images'`.
  </action>
  <verify>grep "'images'" src/app/admin/page.tsx</verify>
  <done>Admin navigation updated with the "Imágenes" option.</done>
</task>

<task type="auto">
  <name>Create ImageManager Component</name>
  <files>src/components/admin/ImageManager.tsx</files>
  <action>
    Build the foundation of the image management interface.
    - Fetch images from the `images` table using `supabaseAdmin`.
    - Group images by category ('property', 'amenities', 'featured').
    - Display images in a responsive grid with category labels.
    - Include placeholder UI for the upload action (to be implemented in Phase 13).
  </action>
  <verify>test -f src/components/admin/ImageManager.tsx</verify>
  <done>Gallery component created and displaying existing images.</done>
</task>

## Success Criteria
- [ ] "Imágenes" tab is visible and functional in the admin panel.
- [ ] Current images are displayed and categorized correctly.
