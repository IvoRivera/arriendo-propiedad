---
phase: 1
plan: 4
wave: 4
depends_on: ["1.1"]
files_modified: ["src/app/api/public/pricing/route.ts"]
autonomous: true
must_haves:
  truths:
    - "Public API uses centralized pricing logic"
  artifacts:
    - "No hardcoded base prices in public API"
---

# Plan 1.4: Public API Parity

<objective>
Refactor the public pricing API to use the centralized pricing utilities and constants, ensuring parity with the admin panel logic.
</objective>

<context>
- src/app/api/public/pricing/route.ts
- src/lib/pricing-engine.ts
- src/lib/constants.ts
</context>

<tasks>

<task type="auto">
  <name>Migrate to Centralized Pricing Utilities</name>
  <files>src/app/api/public/pricing/route.ts</files>
  <action>
    - Import `parseBasePrice` from `@/lib/pricing-engine`.
    - Replace the manual `PROPERTY_RENT_VALUE` check and hardcoded `80000` default with `parseBasePrice(liveConfig['PROPERTY_RENT_VALUE'] ?? property?.base_price)`.
    - Ensure `validatePropertyRentValue` is used if still relevant, or rely on `parseBasePrice`'s internal validation.
  </action>
  <verify>Check that 80000 is no longer hardcoded in the file</verify>
  <done>Public API uses centralized logic</done>
</task>

<task type="auto">
  <name>Standardize Date Handling</name>
  <files>src/app/api/public/pricing/route.ts</files>
  <action>
    - Use `new Date().toISOString().split('T')[0]` consistently or migrate to a helper if needed (though ISO split is generally safe for UTC dates).
    - Ensure date filtering matches the admin panel's inclusive/exclusive logic.
  </action>
  <verify>API still returns correct future dates</verify>
  <done>Dates are handled consistently</done>
</task>

</tasks>

<verification>
- [ ] No hardcoded `80000` in the file.
- [ ] API response structure remains identical to prevent breaking the frontend.
</verification>

<success_criteria>
- [ ] Logic parity between admin and public pricing calculations.
- [ ] Code reduction through utility reuse.
</success_criteria>
