# Research: Backend Data Layer Hardening (Phase 18)

## Objective
Decouple the image system from `mockData.ts` and ensure all image data flows exclusively from the database.

## Findings

### 1. `mockData.ts` Dependencies
Currently, `galleryData` and `heroData` contain:
- `featured.images`
- `interiors.images`
- `amenities.images`
- `heroData.image`
- `heroData.imageAlt`

These arrays and fields should be removed or emptied.

### 2. Service Layer State
`ImageService.getPublicImages` already exists and fetches from Supabase.
However, we need to ensure:
- Types are strict (avoid `any[]`).
- The method returns a structured object or categorized arrays to make frontend consumption easier.

### 3. Frontend Fallbacks
Current components (`CoastalGallery`, `CoastalHero`) use logic like:
```typescript
const heroImage = dynamicImages.find(...)?.url || heroData.image;
```
This needs to be updated to:
- Use a generic "Placeholder" if no dynamic image exists.
- Or simply fail gracefully if the DB is empty (though Phase 17 ensured it's not).

## Decisions
- Refactor `ImageService.getPublicImages` to return a categorized object for easier consumption.
- Remove all image-related fields from `mockData.ts`.
- Update components to rely solely on the injected `dynamicImages` prop.
