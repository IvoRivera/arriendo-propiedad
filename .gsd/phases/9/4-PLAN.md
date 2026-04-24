---
phase: 9
plan: 4
wave: 2
---

# Plan 9.4: Admin Visual Calendar

## Objective
Visualize the pricing schedule in a calendar format within the admin panel to easily identify gaps or overlaps.

## Context
- src/components/admin/PricingCalendar.tsx

## Tasks

<task type="auto">
  <name>Pricing Visualization Calendar</name>
  <files>src/components/admin/PricingCalendar.tsx</files>
  <action>
    Implement a calendar view in the admin panel that shows:
    - Daily prices.
    - Color-coded seasons.
    - Indicators for higher priority overrides.
    - Fetch the `PROPERTY_RENT_VALUE` from `system_config` to display the base price for days without overrides.
  </action>
  <verify>npx tsx scratch/test-admin-calendar.ts</verify>
  <done>Visual calendar provides a clear overview of pricing schedule including the base price.</done>
</task>

## Success Criteria
- [ ] Admin has a visual overview of pricing schedule.
