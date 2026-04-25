## Phase 14 Verification

### Must-Haves
- [x] Drag & Drop UI — VERIFIED (Evidence: `src/components/admin/SortableImage.tsx` with `useSortable` and `GripVertical`)
- [x] Persistence of priority — VERIFIED (Evidence: `ImageService.reorderImages` using `upsert` and `handleDragEnd` call)
- [x] Optimistic UI updates — VERIFIED (Evidence: `setImages(finalImages)` before the async call in `handleDragEnd`)
- [x] Category isolation — VERIFIED (Evidence: Reordering logic only affects images within the active category)

### Verdict: PASS
