# Research: Persistent Reordering (Phase 14)

## Objective
Implement a drag-and-drop interface for reordering images within their categories and persist the new order to the database.

## Findings

### 1. Drag & Drop Library
- **Choice**: `dnd-kit`.
- **Packages**: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`.
- **Why**: Modern, lightweight, accessible, and compatible with React 19 / Next.js 15. It handles grids and lists efficiently.

### 2. Persistence Strategy
- **Approach**: Optimistic + Immediate.
- **Logic**:
  1. User drags an item.
  2. `onDragEnd` updates the local React state (using `arrayMove`).
  3. Immediately call `ImageService.updatePriority` with the new ordered list.
  4. Backend (Supabase) performs a batch update of the `priority` column for the affected images.

### 3. Handling Conflicts
- Since reordering happens per category, we only need to update the `priority` of images within that specific category.
- If multiple admins are reordering at the same time, the "last write wins" strategy is acceptable for this administrative use case.

### 4. Implementation Details
- Add a drag handle icon (e.g., `GripVertical` from lucide-react).
- Use `SortableContext` with `rectSortingStrategy` for the grid.

## Decisions
- Use `dnd-kit`.
- Implement `reorderImages` in `ImageService`.
- Use an optimistic UI for zero-latency feel.
