---
phase: 34
plan: 2
wave: 1
---

# Plan 34.2: Remaining Static Migration

## Objective
Unify all remaining static content (Discover, Gallery, Availability, Footer, Modal) into `SITE_CONTENT`.

## Context
- src/config/site-content.ts
- src/components/coastal/CoastalDiscover.tsx
- src/components/coastal/CoastalGallery.tsx
- src/components/coastal/CoastalAvailability.tsx
- src/components/coastal/CoastalFooterCta.tsx
- src/components/coastal/CoastalLocationTestimonials.tsx
- src/components/coastal/CoastalRequestModal.tsx

## Tasks

<task type="auto">
  <name>Migrate Discover, Footer and Modal</name>
  <files>
    src/components/coastal/CoastalDiscover.tsx,
    src/components/coastal/CoastalFooterCta.tsx,
    src/components/coastal/CoastalRequestModal.tsx
  </files>
  <action>
    1. Import `SITE_CONTENT` and remove `mockData` imports.
    2. Map the data:
       - `CoastalDiscover`: `SITE_CONTENT.discover`
       - `CoastalFooterCta`: `SITE_CONTENT.footerCta` and `SITE_CONTENT.site`
       - `CoastalRequestModal`: `SITE_CONTENT.site.houseRules`
  </action>
  <verify>Check each file for correct imports and mappings.</verify>
  <done>Textual content migrated for these components.</done>
</task>

<task type="auto">
  <name>Unify Gallery and Availability Strings</name>
  <files>
    src/components/coastal/CoastalGallery.tsx,
    src/components/coastal/CoastalAvailability.tsx
  </files>
  <action>
    1. Import `SITE_CONTENT` from `@/config/site-content`.
    2. Replace hardcoded strings in `CoastalGallery` with `SITE_CONTENT.gallery` sections.
    3. Replace labels and hints in `CoastalAvailability` with `SITE_CONTENT.availability.labels`.
  </action>
  <verify>Check that hardcoded strings are gone and replaced by SITE_CONTENT references.</verify>
  <done>Gallery and Availability now use unified configuration.</done>
</task>

<task type="auto">
  <name>Migrate Testimonials</name>
  <files>src/components/coastal/CoastalLocationTestimonials.tsx</files>
  <action>
    1. Import `SITE_CONTENT`.
    2. Replace `testimonialsData` and `siteConfig` imports with `SITE_CONTENT.testimonials` and `SITE_CONTENT.site`.
  </action>
  <verify>Check component for data mapping.</verify>
  <done>Testimonials migrated to SITE_CONTENT.</done>
</task>

## Success Criteria
- [ ] All coastal components (except inventory) migrated to `SITE_CONTENT`.
- [ ] No `mockData` imports remaining in the migrated components.
- [ ] UI visual parity maintained.
