# Research: Public Integration & Performance (Phase 15)

## Objective
Connect the dynamic image data to public carousels and implement robust caching and revalidation strategies.

## Findings

### 1. Caching Strategy
- **Mechanism**: Use Next.js `unstable_cache` for fetching image lists from the database.
- **Tags**: 
  - `images-all` (global)
  - `images-property`, `images-amenities`, `images-featured` (specific categories)
- **Revalidation**: Trigger `revalidateTag('images-all')` in the Admin Server Actions whenever an image is uploaded, deleted, or reordered.

### 2. Browser Cache Busting
- **Issue**: Supabase storage URLs remain static even if the file is replaced (though our implementation creates unique filenames, it's good practice).
- **Solution**: Append the `updated_at` timestamp as a query parameter (e.g., `url?v=1712345678`) to ensure the browser always fetches the latest version if needed.

### 3. Public Components
- **Target**: `src/app/page.tsx` and related carousel components.
- **Change**: Replace hardcoded image arrays with data fetched from the `images` table via the `ImageService`.

### 4. Performance Optimizations
- **Next.js Image**: Use `priority` for the first image in each carousel.
- **Blur Placeholders**: Use a generic subtle blur placeholder while loading.
- **Sequential Fetching**: Fetch all images in a single query filtered by category on the server side.

## Decisions
- Use `unstable_cache` with category tags.
- Create a `getImagesByCategory(category)` utility in `ImageService`.
- Implement a Server Action for cache invalidation.
