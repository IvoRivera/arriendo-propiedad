---
phase: 13
plan: 2
wave: 1
---

# Plan 13.2: Compression & Upload Execution

## Objective
Implement the logic to process images and upload them to Supabase with real-time feedback.

## Context
- src/components/admin/ImageUploader.tsx
- src/services/image-service.ts
- .gsd/phases/13/RESEARCH.md

## Tasks

<task type="auto">
  <name>Implement Optional Compression Logic</name>
  <files>src/components/admin/ImageUploader.tsx</files>
  <action>
    Integrate `browser-image-compression` into the upload flow.
    - If optimization is enabled: compress image to max 1MB / 1920px width before upload.
    - Handle conversion to WebP for better browser performance.
    - Ensure Web Workers are used to prevent UI freezing.
  </action>
  <verify>grep "imageCompression" src/components/admin/ImageUploader.tsx</verify>
  <done>Images are optionally compressed on the client side.</done>
</task>

<task type="auto">
  <name>Execute Upload Loop & Progress tracking</name>
  <files>src/components/admin/ImageUploader.tsx</files>
  <action>
    Manage the concurrent upload of multiple files.
    - Iterate through the selected file list.
    - Call `ImageService.uploadImage` for each file.
    - Update individual progress/status in the UI.
    - Provide a final summary (e.g., "X images uploaded successfully").
  </action>
  <verify>grep "uploadImage" src/components/admin/ImageUploader.tsx</verify>
  <done>Multi-file uploads are processed with clear progress feedback.</done>
</task>

## Success Criteria
- [ ] Large images are reduced in size before hitting the server.
- [ ] UI remains responsive during heavy processing.
- [ ] Each file shows its specific upload status.
