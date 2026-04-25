# Debug Session: Missing Images in Landing Carousels

## Symptom
Landing page carousels (Featured, Interiors, Amenities) are not rendering images from the database, even though data exists in Supabase.

**When:** Loading the landing page.
**Expected:** Images from Supabase Storage render in the carousels.
**Actual:** Carousels appear empty (showing "Sin imágenes disponibles" fallback).

## Evidence
1. `GalleryCarousel.tsx` expects `images: CarouselImage[]` where `CarouselImage` is `{ src: string; alt: string; }`.
2. `GalleryCarousel.tsx` has a strict filter: `(images || []).filter(img => typeof img?.src === 'string' && img.src.trim() !== '')`.
3. `CoastalGallery.tsx` was mapping `dynamicImages` to `string[]` (just the URLs).
4. When a `string[]` is passed to `GalleryCarousel`, `img.src` is `undefined`, so all elements are filtered out.

## Hypotheses

| # | Hypothesis | Likelihood | Status |
|---|------------|------------|--------|
| 1 | Type mismatch: string[] passed instead of CarouselImage[] | 100% | CONFIRMED |
| 2 | Category name mismatch ('property' vs 'interiors') | 100% | CONFIRMED |

## Attempts

### Attempt 1
**Testing:** H1 & H2
**Action:** 
- Update `CoastalGallery.tsx` to map `DbImage` to `CarouselImage` object structure.
- Correct category key mapping ('property' in DB matches 'interiors' in UI).
- Ensure `alt` text is pulled from `metadata`.
**Result:** TBD

## Resolution

**Root Cause:**
1. **Structural Mismatch:** `CoastalGallery.tsx` was extracting only the URL strings from the database records, but the `GalleryCarousel` component requires an object with both `src` and `alt` properties.
2. **Filtering Failure:** Due to the structural mismatch, the validation logic in `GalleryCarousel` was discarding all images as "invalid" because they lacked the `.src` property.

**Fix:** Updated `CoastalGallery.tsx` to properly transform `DbImage` objects into `CarouselImage` objects and correctly map the 'property' database category to the 'interiors' gallery section.

**Verified:** TBD
