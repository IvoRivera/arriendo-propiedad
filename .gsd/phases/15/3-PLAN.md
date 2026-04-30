---
phase: 15
plan: 3
wave: 2
---

# Plan 15.3: Manager Components Unification

## Objective
Ensure all sub-manager panels (Pricing, Images, Config, Availability) are visually unified with the new design system. This includes form elements, tables, and specific manager layouts.

## Context
- `docs/design/DESIGN.md`
- `src/components/admin/SystemConfigPanel.tsx`
- `src/components/admin/DateBlockingManager.tsx`
- `src/components/admin/PricingManager.tsx`
- `src/components/admin/ImageManager.tsx`

## Tasks

<task type="auto">
  <name>Audit & Refine Manager UI</name>
  <files>
    src/components/admin/SystemConfigPanel.tsx
    src/components/admin/DateBlockingManager.tsx
    src/components/admin/PricingManager.tsx
    src/components/admin/ImageManager.tsx
  </files>
  <action>
    - Ensure all section headers use `font-serif-luxury`.
    - Apply `rounded-2xl` or similar soft radius to all internal containers and cards.
    - Standardize input fields to use `surface-container-high` backgrounds and soft focus states.
    - Transform action buttons (Save, Delete, Add) into capsules.
    - Ensure tables and lists use tonal separation instead of high-contrast borders.
  </action>
  <verify>Check each manager panel for typography and shape consistency.</verify>
  <done>All manager panels follow the unified luxury-management design system.</done>
</task>

## Success Criteria
- [ ] Manager panels use Newsreader for titles.
- [ ] Input fields and buttons follow the design system shape rules.
- [ ] Visual harmony is maintained across all administrative tools.
