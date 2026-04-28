---
phase: 2
plan: 1
wave: 1
depends_on: ["1.1"]
files_modified: ["src/hooks/usePricingData.ts", "src/components/admin/PricingCalendar.tsx", "src/components/admin/HolidaySidebar.tsx"]
autonomous: true
must_haves:
  truths:
    - "Holiday data is fetched from Supabase"
    - "Calendar shell follows DESIGN.md spacing and typography"
  artifacts:
    - "src/components/admin/PricingCalendar.tsx"
---

# Plan 2.1: Calendar Foundation

<objective>
Build the data layer and visual shell for the administrative pricing calendar, integrating holiday data and following the "Digital Sanctuary" design guidelines.
</objective>

<context>
- src/hooks/usePricingData.ts
- docs/design/DESIGN.md
- src/components/admin/PricingManager.tsx
</context>

<tasks>

<task type="auto">
  <name>Extend Data Layer with Holidays</name>
  <files>src/hooks/usePricingData.ts</files>
  <action>
    - Update `usePricingData` to fetch all future holidays from the `holidays` table.
    - Add `holidays` state to the hook and return it.
    - Ensure date normalization matches the rest of the app.
  </action>
  <verify>Check that fetchData now queries the holidays table</verify>
  <done>Holiday data is available for the UI</done>
</task>

<task type="auto">
  <name>Create Calendar & Sidebar Components</name>
  <files>src/components/admin/PricingCalendar.tsx, src/components/admin/HolidaySidebar.tsx</files>
  <action>
    - Implement a basic Month Calendar grid using `date-fns`.
    - Create a `HolidaySidebar` component to list holidays for the currently viewed month.
    - **Layout**: Ensure the sidebar is positioned to the right of the calendar in the container.
    - Style using `surface_container` and newsreader fonts for headers as per `DESIGN.md`.
    - Add month navigation (Prev/Next).
  </action>
  <verify>Components render without errors and show current month grid with sidebar on the right</verify>
  <done>Visual shell for calendar is ready with correct layout</done>
</task>

</tasks>

<verification>
- [ ] `usePricingData` returns a `holidays` array.
- [ ] `PricingCalendar` renders a 7-column grid.
- [ ] No 1px borders (use tonal separation).
</verification>

<success_criteria>
- [ ] Admin can navigate between months.
- [ ] Holidays are correctly associated with the visible month.
</success_criteria>
