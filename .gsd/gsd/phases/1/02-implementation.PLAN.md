---
phase: 1
plan: 2
wave: 2
depends_on: ["1.1"]
files_modified: ["src/components/admin/PricingManager.tsx", "src/components/admin/SeasonTable.tsx", "src/components/admin/RuleForm.tsx", "src/components/admin/BasePriceDisplay.tsx"]
autonomous: true
must_haves:
  truths:
    - "PricingManager is split into smaller, manageable components"
    - "Components are decoupled from direct DB fetching (using props or custom hooks)"
  artifacts:
    - "src/components/admin/SeasonTable.tsx"
    - "src/components/admin/RuleForm.tsx"
---

# Plan 1.2: Component Decoupling & Splitting

<objective>
Break down giant components and decouple them from direct data fetching to improve maintainability and reuse.
</objective>

<context>
- src/components/admin/PricingManager.tsx
- src/lib/pricing-utils.ts
</context>

<tasks>

<task type="auto">
  <name>Split PricingManager into Sub-components</name>
  <files>src/components/admin/SeasonTable.tsx, src/components/admin/RuleForm.tsx, src/components/admin/BasePriceDisplay.tsx</files>
  <action>
    Extract the table logic to `SeasonTable.tsx`.
    Extract the "Add Rule" form logic to `RuleForm.tsx`.
    Extract the "Base Price" header to `BasePriceDisplay.tsx`.
    Ensure each component receives data via props.
  </action>
  <verify>Check file existence</verify>
  <done>Giant file broken into 3 smaller ones</done>
</task>

<task type="auto">
  <name>Refactor Main PricingManager</name>
  <files>src/components/admin/PricingManager.tsx</files>
  <action>
    Update `PricingManager.tsx` to act as an orchestrator.
    Keep the data fetching logic here (or move to a custom hook in Task 3).
    Pass state and handlers down to the sub-components.
  </action>
  <verify>Ensure UI still works and data is displayed</verify>
  <done>PricingManager is now < 150 lines</done>
</task>

<task type="auto">
  <name>Decouple Data Fetching</name>
  <files>src/hooks/usePricingData.ts</files>
  <action>
    (Optional but recommended) Extract the Supabase fetching logic from `PricingManager.tsx` into a custom hook `usePricingData.ts`.
    This separates UI from Data Layer.
  </action>
  <verify>Check hook functionality</verify>
  <done>Data fetching is decoupled from UI components</done>
</task>

</tasks>

<verification>
- [ ] `PricingManager.tsx` is significantly smaller.
- [ ] `RuleForm.tsx` handles its own internal validation but reports back to parent.
</verification>

<success_criteria>
- [ ] No single component in the pricing module exceeds 200 lines.
- [ ] Components are reusable.
</success_criteria>
