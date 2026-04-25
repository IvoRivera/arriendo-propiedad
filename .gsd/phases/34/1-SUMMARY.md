# Summary 34.1: Initial Static Migration

## Deliverables
- Migrated core landing sections to `SITE_CONTENT`.

## Changes
- **CoastalHero.tsx**: Replaced `heroData` with `SITE_CONTENT.hero`.
- **CoastalExperience.tsx**: Replaced `experienceData` with `SITE_CONTENT.experience`.
- **CoastalSpecs.tsx**: Replaced `specificationsData` with `SITE_CONTENT.specs`.

## Verification
- Visual parity maintained in Hero, Experience, and Specs sections.
- JSX and Tailwind classes remain untouched.
