---
phase: 9
plan: 3
wave: 2
---

# Plan 9.3: Admin Management UI

## Objective
Provide the administrator with a simple interface to create, edit, and delete seasonal pricing ranges.

## Context
- src/app/admin/pricing/page.tsx
- src/components/admin/PricingList.tsx

## Tasks

<task type="auto">
  <name>Admin Pricing Dashboard</name>
  <files>src/app/admin/pricing/page.tsx, src/components/admin/PricingForm.tsx</files>
  <action>
    Create a new admin page and form to manage seasonal prices.
    - Fields: Start Date, End Date, Price per Night, Season Name, Priority.
    - Validation: Start date must be before or equal to End date. Price must be > 0.
  </action>
  <verify>Access /admin/pricing and create a new seasonal range.</verify>
  <done>Admin can create and view seasonal pricing ranges.</done>
</task>

<task type="auto">
  <name>Pricing CRUD Logic</name>
  <files>src/lib/admin/pricing-actions.ts</files>
  <action>
    Implement Server Actions or API routes for creating, updating, and deleting records in the `seasonal_pricing` table.
  </action>
  <verify>Delete a test seasonal range and verify it's removed from the DB.</verify>
  <done>Full CRUD operations for seasonal pricing are functional.</done>
</task>

## Success Criteria
- [ ] Admin can manage seasonal pricing via a user-friendly UI.
- [ ] CRUD operations are secure and functional.
