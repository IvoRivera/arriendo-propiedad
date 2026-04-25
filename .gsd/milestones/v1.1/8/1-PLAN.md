---
phase: 8
plan: 1
wave: 1
---

# Plan 8.1: Mobile Polish & Final Data Persistence

## Objective
Finalize Phase 8 by addressing critical mobile usability issues (iOS input zoom) and ensuring all newly captured data points (specifically `rules_accepted`) are properly persisted in Supabase to provide the Owner with full legal/compliance visibility.

## Context
- .gsd/SPEC.md
- .gsd/ROADMAP.md
- src/components/coastal/CoastalRequestModal.tsx

## Tasks

<task type="auto">
  <name>Prevent iOS Input Zoom (Mobile Optimization)</name>
  <files>src/components/coastal/CoastalRequestModal.tsx</files>
  <action>
    Review all `input` and `select` elements within the modal.
    Change `text-sm` to `text-base sm:text-sm` on all form controls.
    - **Why:** iOS Safari automatically zooms in when focusing on an input with a font size smaller than 16px. Changing to 16px (`text-base`) on mobile prevents this jarring UX shift, while `sm:text-sm` preserves the designed look on desktop.
    - Also ensure `min-w-0` or similar constraints are present so fields don't overflow on small screens (mostly done, but double check).
  </action>
  <verify>grep_search `text-base sm:text-sm` in CoastalRequestModal.tsx</verify>
  <done>Inputs use text-base on mobile to prevent zoom.</done>
</task>

<task type="auto">
  <name>Persist rules_accepted to Supabase</name>
  <files>
    src/components/coastal/CoastalRequestModal.tsx
    scratch/schema_inventory.sql
  </files>
  <action>
    1. Update the Supabase `insert` call in `CoastalRequestModal.tsx:onSubmit` to include `rules_accepted: true`. (Since validation enforces it, it will always be true).
    2. Add an `ALTER TABLE booking_requests ADD COLUMN IF NOT EXISTS rules_accepted BOOLEAN DEFAULT FALSE;` statement to `scratch/schema_inventory.sql` for documentation purposes.
  </action>
  <verify>grep_search `rules_accepted:` in CoastalRequestModal.tsx</verify>
  <done>The `rules_accepted` boolean is sent to the backend during form submission.</done>
</task>

## Success Criteria
- [ ] No inputs trigger auto-zoom on iOS due to `text-sm` class.
- [ ] Supabase payload includes `rules_accepted` for compliance tracking.
