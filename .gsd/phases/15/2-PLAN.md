---
phase: 15
plan: 2
wave: 1
---

# Plan 15.2: Admin Dashboard & Inbox Aesthetic Refinement

## Objective
Elevate the main admin dashboard and the Booking Request inbox to match the "Luxury Editorial" style. This focuses on container shapes, typography hierarchy in lists, and refined status indicators.

## Context
- `docs/design/DESIGN.md` (Shape language & surfaces)
- `src/app/admin/page.tsx` (Target file)

## Tasks

<task type="auto">
  <name>Redesign Booking Request Cards</name>
  <files>src/app/admin/page.tsx</files>
  <action>
    - Update request card radius to `rounded-[24px]` (Soft Radius rule).
    - Use `font-serif italic` for guest names.
    - Improve metadata legibility (dates, email, phone) using `font-sans-luxury`.
    - Replace generic borders with subtle tonal separation (`bg-white` on `bg-[#faf7f2]`).
    - Standardize the guest info badges (Huéspedes, Reason, Referral) using capsule shapes and subtle backgrounds.
  </action>
  <verify>Check card aesthetics: newsreader titles, capsule badges, and soft radius containers.</verify>
  <done>Booking Request cards match the "Structural Containers" shape rule and luxury typography.</done>
</task>

<task type="auto">
  <name>Refine Filters & Status Indicators</name>
  <files>src/app/admin/page.tsx</files>
  <action>
    - Transform status filter buttons into capsules with `font-sans-luxury`.
    - Standardize the "Excepciones" and "Archivados" buttons to use the capsule shape and appropriate color accents.
    - Ensure status labels inside cards use the capsule shape and refined color palette (Amber, Blue, Emerald, Rose, Gray).
  </action>
  <verify>Verify that all filters and status labels are capsule-shaped and legible.</verify>
  <done>Filters and status indicators are consistent with the "Interactive Elements" shape rule.</done>
</task>

## Success Criteria
- [ ] Booking cards use Newsreader for guest names and have a soft radius.
- [ ] All status indicators and filter buttons are unified into capsules.
- [ ] The Inbox view feels like a cohesive part of the "Digital Sanctuary."
