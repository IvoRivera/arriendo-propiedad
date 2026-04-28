---
phase: 1
plan: 2
wave: 2
depends_on: ["1.1"]
files_modified: ["src/lib/pricing-engine.ts", "src/app/api/admin/pricing/apply/route.ts"]
autonomous: true
must_haves:
  truths:
    - "Core engine and API routes use shared utilities"
    - "API inputs are validated"
---

# Plan 1.2: Implementation & Refactor

<objective>
Refactor the pricing engine and API route to use the new foundation and implement validation.
</objective>

<context>
- src/lib/pricing-utils.ts
- src/types/pricing.ts
- src/lib/pricing-engine.ts
- src/app/api/admin/pricing/apply/route.ts
</context>

<tasks>

<task type="auto">
  <name>Refactor Pricing Engine</name>
  <files>src/lib/pricing-engine.ts</files>
  <action>
    Import `parseBasePrice` from `pricing-utils.ts`.
    Replace duplicated parsing logic in `getPriceForDate` and `getPricingForRange`.
    Clean up console.logs.
  </action>
  <verify>Code builds without errors</verify>
  <done>Logic is deduplicated</done>
</task>

<task type="auto">
  <name>Harden Pricing API Route</name>
  <files>src/app/api/admin/pricing/apply/route.ts</files>
  <action>
    Implement `PricingUpdateSchema.safeParse(body)`.
    Return 400 with Zod errors if validation fails.
    Use `parseBasePrice` for base price logic.
  </action>
  <verify>Test with invalid payload via curl/tool</verify>
  <done>API returns 400 on bad data</done>
</task>

</tasks>
