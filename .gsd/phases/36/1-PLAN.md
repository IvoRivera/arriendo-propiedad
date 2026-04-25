---
phase: 36
plan: 1
wave: 1
---

# Plan 36.1: Final Cleanup and Project Audit

## Objective
Identify and remove any remaining imports of `mockData.ts` across the entire project and ensure the codebase is 100% decoupled from it.

## Context
- src/data/mockData.ts
- All project files under `src/`

## Tasks

<task type="auto">
  <name>Final Import Audit</name>
  <files>src/**/*</files>
  <action>
    1. Run a comprehensive search for `@/data/mockData` or `from "../data/mockData"` etc.
    2. Remove any imports that are no longer used.
    3. If any import is still needed, it's a mistake in previous phases; migrate the data immediately.
  </action>
  <verify>Run `Get-ChildItem -Path src -Recurse -File | Select-String -Pattern "mockData" | Where-Object { $_.Filename -ne "mockData.ts" }` and expect zero results.</verify>
  <done>Zero functional references to mockData.ts in the project.</done>
</task>

<task type="auto">
  <name>Verify Project Integrity</name>
  <files>package.json</files>
  <action>
    1. Check for any build or test scripts that might rely on mock data.
    2. Ensure the dev server is still running without errors.
  </action>
  <verify>Check terminal logs for compilation errors.</verify>
  <done>Project is healthy and decoupled.</done>
</task>

## Success Criteria
- [ ] No functional files import from `mockData.ts`.
- [ ] No TypeScript errors related to missing data.
