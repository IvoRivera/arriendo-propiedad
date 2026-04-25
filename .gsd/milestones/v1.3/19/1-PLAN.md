---
phase: 19
plan: 1
wave: 1
---

# Plan 19.1: Frontend Component Refactor

## Objective
Refactor the main image-consuming components to use the new typed dynamic data and remove all references to static mock images.

## Context
- src/components/coastal/CoastalGallery.tsx
- src/components/coastal/CoastalHero.tsx
- src/services/image-service.ts

## Tasks

<task type="auto">
  <name>Refactor CoastalGallery</name>
  <files>src/components/coastal/CoastalGallery.tsx</files>
  <action>
    - Import `DbImage` and `ImageService`.
    - Update `CoastalGalleryProps` to use `dynamicImages: DbImage[]`.
    - Use `ImageService.categorizeImages(dynamicImages)` to get the arrays.
    - Remove `getImages` local helper and all fallbacks to `galleryData.images`.
  </action>
  <verify>grep "dynamicImages: DbImage\[]" src/components/coastal/CoastalGallery.tsx</verify>
  <done>CoastalGallery is fully decoupled from mock images.</done>
</task>

<task type="auto">
  <name>Refactor CoastalHero</name>
  <files>src/components/coastal/CoastalHero.tsx</files>
  <action>
    - Import `DbImage`.
    - Update `CoastalHeroProps` to use `dynamicImages: DbImage[]`.
    - Update `heroImage` logic to use the first `featured` image.
    - Remove `heroData.image` fallback.
    - Add a default placeholder URL if no image is found (e.g., a generic coastal image).
  </action>
  <verify>grep "dynamicImages: DbImage\[]" src/components/coastal/CoastalHero.tsx</verify>
  <done>CoastalHero is fully decoupled from mock images.</done>
</task>

## Success Criteria
- [ ] `CoastalGallery` and `CoastalHero` use `DbImage` type.
- [ ] No `mockData.images` usages in these components.
