# ROADMAP.md

> **Current Milestone**: Gap Closure — Category Editing & Admin UX
> **Goal**: Enhance the image management system to allow direct metadata editing and category switching without re-uploading.

## Must-Haves
- [ ] Backend support for partial image updates (`updateImage`).
- [ ] Admin UI for editing image category and metadata directly.
- [ ] Optimistic UI updates for category changes in `ImageManager`.
- [ ] State consistency: Priority reset on category change.

## Phases

### Phase 22: Image Metadata Editing & Category Switching (Gap Closure)
**Status**: ⬜ Not Started
**Objective**: Eliminate the "delete + reupload" flow for correcting image categorization.

**Tasks:**
- [ ] Implement `updateImage` in `ImageService`.
- [ ] Add category editing dropdown to `SortableImage` or a modal in `ImageManager`.
- [ ] Implement logic to move images between categories in the UI state.
- [ ] Ensure cache revalidation triggers on metadata update.
