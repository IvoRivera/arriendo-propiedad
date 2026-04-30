---
phase: 17
plan: 1
wave: 1
---

# Plan 17.1: Inbox Bulk Actions & Selection UI

## Objective
Enhance the Inbox with bulk management capabilities, allowing administrators to select and archive multiple requests simultaneously, improving operational efficiency.

## Context
- src/app/admin/page.tsx
- docs/design/DESIGN.md

## Tasks

<task type="auto">
  <name>Implement Multi-Selection Logic and UI</name>
  <files>
    - src/app/admin/page.tsx
  </files>
  <action>
    - Add \`selectedIds\` state to manage the list of selected requests.
    - Implement a "Select All" checkbox in the filter bar area.
    - Add a custom checkbox (Luxury Capsule style) to each booking request card.
    - Style the cards when selected (subtle background shift or border emphasis).
  </action>
  <verify>Check state updates when clicking checkboxes.</verify>
  <done>Selection logic and individual card checkboxes functional.</done>
</task>

<task type="auto">
  <name>Create Floating Bulk Action Bar</name>
  <files>
    - src/app/admin/page.tsx
  </files>
  <action>
    - Implement a fixed-bottom floating bar using \`framer-motion\` for entry/exit animations.
    - Style: Glassmorphism (#faf7f2/90 backdrop blur) with a shadow-2xl.
    - Actions: "Archivar Seleccionados" and "Deseleccionar".
    - Logic: Implement \`handleBulkArchive\` and \`handleBulkUnarchive\` (depending on view).
    - Logic: Implement \`clearSelection\`.
  </action>
  <verify>Perform bulk archive and verify persistence.</verify>
  <done>Floating bar appears with correct counts and functional actions.</done>
</task>

## Success Criteria
- [ ] Admin can select multiple requests using individual checkboxes or "Select All".
- [ ] A premium floating action bar appears only when items are selected.
- [ ] Bulk archiving works correctly and updates the UI instantly.
