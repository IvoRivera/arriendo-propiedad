# Research: Full Frontend Decoupling (Phase 19)

## Objective
Finalize the migration by ensuring all frontend components consume image data exclusively from the database and handle empty states gracefully.

## Findings

### 1. Component State
- `CoastalGallery`: Currently filters `dynamicImages` locally. It can be simplified by using `ImageService.categorizeImages` if we fetch it in the parent or by moving the categorization logic to a shared utility.
- `CoastalHero`: Currently takes the first `featured` image. It needs a fallback placeholder if no images are found.

### 2. Prop Types
- `dynamicImages` is currently typed as `any[]`.
- It should be updated to `DbImage[]` (imported from `ImageService`).

### 3. HomeClient Integration
- `HomeClient` passes `dynamicImages` to both components.
- We should ensure `dynamicImages` are properly typed in `HomeClient` too.

## Decisions
- Update `CoastalGallery` and `CoastalHero` to use `DbImage` type.
- Remove all fallback logic to `mockData.images`.
- Add a "System Fallback" (e.g., a generic coastal placeholder image) in case the DB is completely empty (though not expected after migration).
