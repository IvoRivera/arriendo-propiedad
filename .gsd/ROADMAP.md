# ROADMAP.md

> **Current Milestone**: Gap Closure — Category Editing & Admin UX
> **Goal**: Enhance the image management system to allow direct metadata editing and category switching without re-uploading.

## Must-Haves
- [x] Backend support for partial image updates (`updateImage`).
- [x] Admin UI for editing image category and metadata directly.
- [x] Optimistic UI updates for category changes in `ImageManager`.
- [x] State consistency: Priority reset on category change.

## Phases

### Phase 22: Image Metadata Editing & Category Switching (Gap Closure)
**Status**: ✅ Complete
**Objective**: Eliminate the "delete + reupload" flow for correcting image categorization.

**Tasks:**
- [x] Implement `updateImage` in `ImageService`.
- [x] Add category editing dropdown to `SortableImage` or a modal in `ImageManager`.
- [x] Implement logic to move images between categories in the UI state.
- [x] Ensure cache revalidation triggers on metadata update.
