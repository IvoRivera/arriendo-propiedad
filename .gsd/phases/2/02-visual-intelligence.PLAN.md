---
phase: 2
plan: 2
wave: 2
depends_on: ["2.1"]
files_modified: ["src/lib/date-utils.ts", "src/lib/pricing-engine.ts", "src/components/admin/PricingCalendar.tsx", "src/components/admin/PricingManager.tsx"]
autonomous: true
must_haves:
  truths:
    - "Weekends and bridge holidays are visually distinct"
    - "Seasonal periods are reflected in the calendar grid"
  artifacts:
    - "Refactored date-utils.ts with shared logic"
---

# Plan 2.2: Visual Intelligence & Integration

<objective>
Implement advanced visual logic to highlight weekends, holidays, and seasonal periods in the calendar, ensuring a premium "Digital Sanctuary" experience for administrators.
</objective>

<context>
- src/lib/pricing-engine.ts
- src/components/admin/PricingCalendar.tsx
- docs/design/DESIGN.md
</context>

<tasks>

<task type="auto">
  <name>Shared Visual Logic Utilities</name>
  <files>src/lib/date-utils.ts, src/lib/pricing-engine.ts</files>
  <action>
    - Move `isDateHoliday` and `isLongWeekend` from `pricing-engine.ts` to `date-utils.ts` to allow client-side reuse.
    - Export them correctly and update imports in `pricing-engine.ts`.
  </action>
  <verify>Check that both files compile without errors</verify>
  <done>Visual logic is shared between server and client</done>
</task>

<task type="auto">
  <name>Implement Highlighting & Integration</name>
  <files>src/components/admin/PricingCalendar.tsx, src/components/admin/PricingManager.tsx</files>
  <action>
    - Apply color coding to calendar days:
      - Weekends: Soft secondary tone.
      - Holidays: Distinct accent.
      - **Bridge Weekends (Puentes)**: Specialized highlight for sequences where a holiday joins with Friday or Monday (e.g., Friday holiday, Monday holiday, or "sandwich" days joining a mid-week holiday to the weekend).
      - **Active Seasons**: Use **non-invasive, non-saturated background colors** (e.g., very light HSL tones) to indicate the full range of each active rule.
    - Show the price per night within each day cell.
    - Integrate components into `PricingManager.tsx`: Calendar (flex-1) + Sidebar (w-64/80) on the right.
    - Follow `DESIGN.md`: use `surface_container_low` for cells, no harsh borders, generous spacing.
  </action>
  <verify>Visual check: Weekends, holidays, and active periods are clearly visible but aesthetically calm</verify>
  <done>Advanced Pricing Calendar is fully functional and integrated with refined styling</done>
</task>

</tasks>

<verification>
- [ ] Bridge holidays are identified based on Friday/Monday status.
- [ ] Calendar updates when `seasonalPrices` are added/modified.
- [ ] UI follows the tonal hierarchy from DESIGN.md.
</verification>

<success_criteria>
- [ ] Prices are visible on every day of the calendar.
- [ ] Sidebar shows a clear list of holidays for the current month.
</success_criteria>
