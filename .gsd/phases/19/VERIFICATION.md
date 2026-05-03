## Phase 19 Verification

### Must-Haves
- [x] **Universal Zoom Interaction**: `Lightbox.tsx` now supports `onWheel` (mouse wheel) and `onDoubleClick`. Pinch-to-zoom was already present and remains functional.
- [x] **Admin Fullscreen Preview**: `ImageManager.tsx` now renders a `Lightbox` when an image in `SortableImage.tsx` is clicked.

### Verdict: PASS

### Evidence
- `src/components/coastal/Lightbox.tsx`: Added `onWheel`, `onDoubleClick`, and refined `onPointerDown`.
- `src/components/admin/SortableImage.tsx`: Added `onPreview` and `cursor-zoom-in`.
- `src/components/admin/ImageManager.tsx`: Integrated `Lightbox` and `handlePreview` logic.
