---
phase: 13
plan: 1
wave: 1
---

# Plan 13.1: Multi-file Uploader UI & Dependencies

## Objective
Install necessary libraries and build the UI for the multi-file upload system.

## Context
- .gsd/SPEC.md
- .gsd/phases/13/RESEARCH.md
- src/components/admin/ImageManager.tsx (parent component)

## Tasks

<task type="auto">
  <name>Install Compression Library</name>
  <files>package.json</files>
  <action>
    Install `browser-image-compression` to handle client-side optimization.
  </action>
  <verify>npm list browser-image-compression</verify>
  <done>Library installed and available in the project.</done>
</task>

<task type="auto">
  <name>Create ImageUploader Component</name>
  <files>src/components/admin/ImageUploader.tsx</files>
  <action>
    Build the UI for the upload system.
    - File input (multiple) with Drag & Drop area.
    - Category dropdown (Property, Amenities, Featured).
    - "Optimizar imágenes" toggle (default: true).
    - List of selected files with status (pending/uploading/done/error).
  </action>
  <verify>test -f src/components/admin/ImageUploader.tsx</verify>
  <done>Uploader UI is functional for file selection and configuration.</done>
</task>

<task type="auto">
  <name>Integrate Uploader into ImageManager</name>
  <files>src/components/admin/ImageManager.tsx</files>
  <action>
    Replace the "Upload Placeholder" in `ImageManager` with the new `ImageUploader` component.
    - Pass an `onUploadComplete` callback to refresh the gallery when new images are added.
  </action>
  <verify>grep "ImageUploader" src/components/admin/ImageManager.tsx</verify>
  <done>Uploader is accessible from the admin dashboard.</done>
</task>

## Success Criteria
- [ ] User can select multiple files and assign a category.
- [ ] Optimization toggle is visible and functional.
- [ ] UI correctly lists selected files before upload.
