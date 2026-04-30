---
phase: 15
plan: 1
wave: 1
---

# Plan 15.1: Admin Shell & Navigation Redesign

## Objective
Apply the "Digital Sanctuary" aesthetic to the core admin layout and navigation. This includes unifying typography, background surfaces, and transforming navigation buttons into premium capsules.

## Context
- `docs/design/DESIGN.md` (Design guidelines)
- `src/app/admin/page.tsx` (Target file)
- `src/app/globals.css` (Luxury tokens)

## Tasks

<task type="auto">
  <name>Redesign Admin Header & Shell</name>
  <files>src/app/admin/page.tsx</files>
  <action>
    - Update the main container background to use the `#faf7f2` surface if not already consistent.
    - Change the page title typography to use `font-serif italic text-[#2c2416]` (Newsreader) instead of generic fonts.
    - Refine the "Sesión activa" indicator using `.tracking-luxury` and a more subtle color hierarchy.
  </action>
  <verify>Check if the admin header matches the luxury editorial style (serif titles, luxury tracking).</verify>
  <done>Admin title uses Newsreader Italic and background is consistent with the "Digital Sanctuary" palette.</done>
</task>

<task type="auto">
  <name>Refine Navigation Tabs & Action Buttons</name>
  <files>src/app/admin/page.tsx</files>
  <action>
    - Transform the main view switcher (Inbox, Availability, etc.) into high-end capsules.
    - Use `rounded-full` for all navigation buttons and primary actions (Sync, Logout).
    - Apply `.tracking-luxury` to button labels.
    - Unify the active state background to `bg-[#6b7c4a]` (Pine) with white text.
    - Ensure icons have consistent sizing and subtle color treatment.
  </action>
  <verify>Verify that all admin navigation elements are capsule-shaped and use luxury tracking.</verify>
  <done>Navigation tabs and action buttons follow the "Interactive Elements" shape rule (capsules).</done>
</task>

## Success Criteria
- [ ] Admin header feels premium with Newsreader typography.
- [ ] Navigation is unified into a capsule-based system.
- [ ] Background and surface colors match the "Coastal Alchemist" theme.
