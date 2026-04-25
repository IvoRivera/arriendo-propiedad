---
phase: 34
plan: 1
wave: 1
---

# Plan 34.1: Initial Static Migration (Hero, Experience, Specs)

## Objective
Migrate the editorial content of the main landing sections from `mockData.ts` to `SITE_CONTENT`, preserving JSX and Tailwind structure.

## Context
- src/config/site-content.ts
- src/components/coastal/CoastalHero.tsx
- src/components/coastal/CoastalExperience.tsx
- src/components/coastal/CoastalSpecs.tsx

## Tasks

<task type="auto">
  <name>Migrate CoastalHero</name>
  <files>src/components/coastal/CoastalHero.tsx</files>
  <action>
    1. Import `SITE_CONTENT` from `@/config/site-content`.
    2. Remove the import of `heroData` from `@/data/mockData`.
    3. Replace all references to `heroData` with `SITE_CONTENT.hero`.
    4. Maintain the existing logic for `displayPrice` and `getValue`.
    5. Ensure the visual output remains identical.
  </action>
  <verify>Check component for import removal and use of SITE_CONTENT.hero.</verify>
  <done>CoastalHero is powered by SITE_CONTENT.hero.</done>
</task>

<task type="auto">
  <name>Migrate CoastalExperience</name>
  <files>src/components/coastal/CoastalExperience.tsx</files>
  <action>
    1. Import `SITE_CONTENT` from `@/config/site-content`.
    2. Remove the import of `experienceData` from `@/data/mockData`.
    3. Replace all references to `experienceData` with `SITE_CONTENT.experience`.
  </action>
  <verify>Check component for correct data mapping.</verify>
  <done>CoastalExperience is powered by SITE_CONTENT.experience.</done>
</task>

<task type="auto">
  <name>Migrate CoastalSpecs</name>
  <files>src/components/coastal/CoastalSpecs.tsx</files>
  <action>
    1. Import `SITE_CONTENT` from `@/config/site-content`.
    2. Remove the import of `specificationsData` from `@/data/mockData`.
    3. Replace all references to `specificationsData` with `SITE_CONTENT.specs`.
  </action>
  <verify>Check component for correct data mapping.</verify>
  <done>CoastalSpecs is powered by SITE_CONTENT.specs.</done>
</task>

## Success Criteria
- [ ] Three core sections migrated to `SITE_CONTENT`.
- [ ] No JSX structure changes.
- [ ] No UI regressions.
