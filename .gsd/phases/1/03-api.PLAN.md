---
phase: 1
plan: 3
wave: 3
depends_on: ["1.1"]
files_modified: ["src/app/api/admin/pricing/apply/route.ts", "src/types/pricing.ts"]
autonomous: true
must_haves:
  truths:
    - "API routes are protected and validated"
  artifacts:
    - "Zod schemas in src/types/pricing.ts"
---

# Plan 1.3: API Hardening & Validation

<objective>
Harden the pricing API routes using Zod validation and standardized error handling.
</objective>

<context>
- src/app/api/admin/pricing/apply/route.ts
- src/types/pricing.ts
</context>

<tasks>

<task type="auto">
  <name>Implement Zod Validation</name>
  <files>src/app/api/admin/pricing/apply/route.ts</files>
  <action>
    Refactor the POST handler to use `PricingUpdateSchema.safeParse(body)`.
    Remove manual `if (!startDate || ...)` checks.
    Return 400 with structured Zod errors on validation failure.
  </action>
  <verify>curl with invalid data returns 400</verify>
  <done>API route is strictly validated</done>
</task>

<task type="auto">
  <name>Standardize Error Responses</name>
  <files>src/app/api/admin/pricing/apply/route.ts</files>
  <action>
    Use a shared error response utility if available, or standardize the `{ error: string, details?: any }` format.
    Ensure all error paths are handled (auth, validation, DB errors).
  </action>
  <verify>Check error response structure</verify>
  <done>API errors are predictable and informative</done>
</task>

</tasks>

<verification>
- [ ] Invalid payloads are rejected by Zod.
- [ ] Successful responses remain compatible with the frontend.
</verification>

<success_criteria>
- [ ] No manual validation logic in the route.
- [ ] Robust error handling for all edge cases.
</success_criteria>
