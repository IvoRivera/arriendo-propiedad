---
phase: 1
plan: 1
wave: 1
depends_on: []
files_modified: ["src/lib/constants.ts", "src/lib/formatters.ts", "src/lib/pricing-utils.ts", "src/types/pricing.ts", "src/lib/date-utils.ts"]
autonomous: true
must_haves:
  truths:
    - "All pricing magic numbers are consolidated"
    - "Base price parsing logic is unique"
  artifacts:
    - "src/lib/constants.ts"
    - "src/lib/pricing-utils.ts"
    - "src/lib/date-utils.ts"
---

# Plan 1.1: Foundation Consolidation

<objective>
Eliminate redundant logic and hardcoded values by creating a centralized foundation for pricing, date handling, and formatting.
</objective>

<context>
- src/lib/pricing-engine.ts
- src/app/api/admin/pricing/apply/route.ts
- src/components/admin/PricingManager.tsx
</context>

<tasks>

<task type="auto">
  <name>Create Centralized Constants & Utilities</name>
  <files>src/lib/constants.ts, src/lib/formatters.ts, src/lib/date-utils.ts</files>
  <action>
    1. **Constants**: Create `src/lib/constants.ts` and define `DEFAULT_BASE_PRICE = 80000`.
    2. **Formatters**: Create `src/lib/formatters.ts` with `formatCurrency(val: number): string` using Intl.NumberFormat.
    3. **Date Utils**: Create `src/lib/date-utils.ts` with `toISODate(date: Date | string): string` and `parseSafeISO(dateStr: string): Date` (handling the T12:00:00 logic).
  </action>
  <verify>Check files exist and exports are correct</verify>
  <done>Core constants and utilities are available for refactoring</done>
</task>

<task type="auto">
  <name>Consolidate Pricing Logic</name>
  <files>src/lib/pricing-utils.ts</files>
  <action>
    Implement `parseBasePrice(configValue: string | undefined): number` in `src/lib/pricing-utils.ts`.
    Use `DEFAULT_BASE_PRICE` from constants.
    Handle regex `\D/g` in ONE place.
    Add Zod schemas for pricing inputs in `src/types/pricing.ts`.
  </action>
  <verify>Check exports</verify>
  <done>Pricing logic is unique and importable</done>
</task>

<task type="auto">
  <name>Clean Dead Code & Imports</name>
  <files>src/lib/pricing-engine.ts, src/app/api/admin/pricing/apply/route.ts</files>
  <action>
    Scan and remove unused imports.
    Standardize naming (e.g., ensuring consistency between `startDate` and `start_date` across API boundaries by documenting mapping).
  </action>
  <verify>npm run lint (if available)</verify>
  <done>Codebase is cleaner and follows consistent naming</done>
</task>

</tasks>

<verification>
- [ ] `src/lib/constants.ts` contains DEFAULT_BASE_PRICE.
- [ ] `parseBasePrice` is exported from `pricing-utils.ts`.
- [ ] No `replace(/\D/g, '')` remains in `pricing-engine.ts` (replaced by util).
</verification>

<success_criteria>
- [ ] All foundational utilities created.
- [ ] Logic duplication for base price parsing eliminated.
</success_criteria>
