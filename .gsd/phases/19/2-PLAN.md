---
phase: 19
plan: 2
wave: 1
---

# Plan 19.2: Admin Image Fullscreen Preview

## Objective
Enable full-screen preview functionality for uploaded images in the admin panel using the newly enhanced Lightbox component.

## Context
- .gsd/SPEC.md
- d:\Proyectos\departamento-ls\src\components\admin\ImageManager.tsx
- d:\Proyectos\departamento-ls\src\components\admin\SortableImage.tsx

## Tasks

<task type="auto">
  <name>Integrate Lightbox into Admin ImageManager</name>
  <files>
    - d:\Proyectos\departamento-ls\src\components\admin\ImageManager.tsx
    - d:\Proyectos\departamento-ls\src\components\admin\SortableImage.tsx
  </files>
  <action>
    1. In `SortableImage.tsx`, add an `onPreview(id: string)` prop. Attach this callback to an `onClick` event on the image container so clicking the image itself triggers the preview (ensure it doesn't interfere with the drag handle). Add a hover state to indicate the image is clickable (e.g., a subtle magnifying glass cursor or an overlay).
    2. In `ImageManager.tsx`, import `Lightbox` from `../coastal/Lightbox`.
    3. Add state for `previewImageIndex` (number | null) and `previewImages` (an array mapped to Lightbox format: `{ src, alt }`).
    4. Pass the `onPreview` prop to `SortableImage`. When triggered, compute the array of images currently visible in that category, format them, and open the Lightbox at the correct index.
  </action>
  <verify>grep -q "Lightbox" src/components/admin/ImageManager.tsx && grep -q "onPreview" src/components/admin/SortableImage.tsx</verify>
  <done>Admin users can click any uploaded image to preview it in a full-screen Lightbox, matching the coastal gallery experience.</done>
</task>

## Success Criteria
- [ ] Clicking an image in the admin panel opens the Lightbox.
- [ ] The Lightbox opens with the context of the clicked image's category, allowing pagination through siblings.
- [ ] The full-screen preview supports all zoom interactions (wheel, pinch, double-click).
