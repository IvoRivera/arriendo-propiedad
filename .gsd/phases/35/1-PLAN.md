---
phase: 35
plan: 1
wave: 1
---

# Plan 35.1: Inventory Migration & Structure Audit

## Objective
Migrate the remaining structural data (`baseInventory`) from `mockData.ts` to a dedicated config file, completing the first step of the final cleanup.

## Context
- src/data/mockData.ts
- src/app/guest/checkin/[id]/page.tsx
- src/config/site-content.ts

## Tasks

<task type="auto">
  <name>Create Inventory Config</name>
  <files>src/config/inventory.ts</files>
  <action>
    1. Create `src/config/inventory.ts`.
    2. Define `InventoryItem` interface.
    3. Export `BASE_INVENTORY` containing the data from `mockData.ts`.
  </action>
  <verify>Check file existence and content parity with mockData.ts.</verify>
  <done>Inventory data re-homed to src/config/inventory.ts.</done>
</task>

<task type="auto">
  <name>Update Guest Check-in Page</name>
  <files>src/app/guest/checkin/[id]/page.tsx</files>
  <action>
    1. Update the import from `baseInventory` (@/data/mockData) to `BASE_INVENTORY` (@/config/inventory).
    2. Ensure the logic for `inventory_snapshot` uses the new constant.
  </action>
  <verify>Check component for import update and functional parity.</verify>
  <done>Check-in page no longer depends on mockData.ts.</done>
</task>

<task type="auto">
  <name>Audit Structural Data</name>
  <files>src/data/mockData.ts</files>
  <action>
    1. Identify any remaining exports in `mockData.ts`.
    2. Check if they are used anywhere in the project.
    3. If used, migrate them to `SITE_CONTENT` or appropriate config.
  </action>
  <verify>Run grep/search for "mockData" across the whole `src` directory.</verify>
  <done>No functional dependencies on mockData.ts remain.</done>
</task>

## Success Criteria
- [ ] `BASE_INVENTORY` moved to `src/config/inventory.ts`.
- [ ] `GuestCheckInPage` updated and working.
- [ ] Search for `@/data/mockData` returns 0 results outside of its own file.
