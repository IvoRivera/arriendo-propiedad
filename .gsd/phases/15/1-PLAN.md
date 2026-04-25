---
phase: 15
plan: 1
wave: 1
---

# Plan 15.1: Data Access & Revalidation Layer

## Objective
Implement server-side caching for image data and a revalidation mechanism to ensure the public site stays in sync with admin changes.

## Context
- src/services/image-service.ts
- .gsd/phases/15/RESEARCH.md

## Tasks

<task type="auto">
  <name>Implement Cached Image Fetching</name>
  <files>src/services/image-service.ts</files>
  <action>
    Add a cached data fetching method to `ImageService`.
    - Use `unstable_cache` from `next/cache`.
    - Implement `getPublicImages()` which fetches all images from the `images` table ordered by category and priority.
    - Set cache tags: `['images-all']`.
  </action>
  <verify>grep "unstable_cache" src/services/image-service.ts</verify>
  <done>Images are fetched with server-side caching enabled.</done>
</task>

<task type="auto">
  <name>Create Revalidation Server Action</name>
  <files>src/app/actions/images.ts</files>
  <action>
    Implement a Server Action to clear the image cache.
    - Function `revalidateImages()` that calls `revalidateTag('images-all')`.
  </action>
  <verify>test -f src/app/actions/images.ts</verify>
  <done>Server action for cache invalidation is ready.</done>
</task>

<task type="auto">
  <name>Integrate Revalidation into Admin UI</name>
  <files>src/components/admin/ImageManager.tsx, src/components/admin/ImageUploader.tsx</files>
  <action>
    Trigger cache revalidation after any change.
    - In `ImageManager.handleDelete`, call `revalidateImages()` after success.
    - In `ImageManager.handleDragEnd`, call `revalidateImages()` after persistence.
    - In `ImageUploader.uploadAll`, call `revalidateImages()` once all uploads finish.
  </action>
  <verify>grep "revalidateImages" src/components/admin/ImageManager.tsx</verify>
  <done>Admin actions automatically refresh the public site's data cache.</done>
</task>

## Success Criteria
- [ ] Image data is cached on the server for performance.
- [ ] Adding/Deleting/Reordering images in Admin triggers a cache purge.
