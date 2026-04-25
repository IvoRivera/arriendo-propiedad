---
phase: 14
plan: 1
wave: 1
---

# Plan 14.1: Drag & Drop UI Infrastructure

## Objective
Install DnD dependencies and refactor the image gallery to support drag-and-drop reordering.

## Context
- .gsd/phases/14/RESEARCH.md
- src/components/admin/ImageManager.tsx

## Tasks

<task type="auto">
  <name>Install DnD Dependencies</name>
  <files>package.json</files>
  <action>
    Install `@dnd-kit/core`, `@dnd-kit/sortable`, and `@dnd-kit/utilities`.
  </action>
  <verify>npm list @dnd-kit/core</verify>
  <done>DnD libraries are installed.</done>
</task>

<task type="auto">
  <name>Implement Sortable Image Component</name>
  <files>src/components/admin/SortableImage.tsx</files>
  <action>
    Create a wrapper component for images that implements `useSortable`.
    - Include a drag handle icon (`GripVertical`).
    - Apply `transform` and `transition` styles from `dnd-kit`.
    - Ensure it receives `id` and `image` data correctly.
  </action>
  <verify>test -f src/components/admin/SortableImage.tsx</verify>
  <done>Sortable wrapper component is ready.</done>
</task>

<task type="auto">
  <name>Integrate DnD Context into ImageManager</name>
  <files>src/components/admin/ImageManager.tsx</files>
  <action>
    Refactor `ImageManager` to enable reordering.
    - Wrap the image grids in `DndContext` and `SortableContext`.
    - Use `rectSortingStrategy` for the grid layout.
    - Implement a basic `handleDragEnd` that updates the local state using `arrayMove`.
  </action>
  <verify>grep "DndContext" src/components/admin/ImageManager.tsx</verify>
  <done>Gallery UI supports visual reordering (optimistic).</done>
</task>

## Success Criteria
- [ ] User can drag images within their respective categories.
- [ ] The grid reorders smoothly as items are moved.
