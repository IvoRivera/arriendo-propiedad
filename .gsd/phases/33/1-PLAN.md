---
phase: 33
plan: 1
wave: 1
---

# Plan 33.1: Foundation of Site Content

## Objective
Create the typed foundation for all static content to enable the progressive migration away from `mockData.ts`.

## Context
- src/data/mockData.ts
- .gsd/phases/33/RESEARCH.md

## Tasks

<task type="auto">
  <name>Create Site Content Configuration File</name>
  <files>src/config/site-content.ts</files>
  <action>
    Create a new file `src/config/site-content.ts` that:
    1. Defines TypeScript interfaces for each content section (Hero, Experience, Specs, etc.).
    2. Exports a `SITE_CONTENT` constant populated with the data currently in `mockData.ts`.
    3. Ensure all fields identified in `RESEARCH.md` are included.
    4. Include the hardcoded strings found in `CoastalGallery` and `CoastalAvailability` to unify them.
  </action>
  <verify>Check that the file exists and is correctly typed.</verify>
  <done>`src/config/site-content.ts` contains all static data from `mockData.ts` and hardcoded components.</done>
</task>

<task type="auto">
  <name>Verify SITE_CONTENT parity</name>
  <files>src/config/site-content.ts,src/data/mockData.ts</files>
  <action>
    Perform a manual or script-based comparison to ensure `SITE_CONTENT` has 100% parity with the visible content of the landing page.
  </action>
  <verify>Review the constant values against mockData exports.</verify>
  <done>No data is lost in the move to the new config file.</done>
</task>

## Success Criteria
- [ ] `src/config/site-content.ts` is ready for consumption.
- [ ] Interfaces are strictly typed.
- [ ] No logic is moved, only data.
