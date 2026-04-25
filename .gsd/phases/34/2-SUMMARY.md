# Summary 34.2: Remaining Static Migration

## Deliverables
- Migrated remaining coastal components and unified hardcoded strings.

## Changes
- **CoastalDiscover.tsx**: Replaced `discoverData` with `SITE_CONTENT.discover`.
- **CoastalFooterCta.tsx**: Replaced `footerCtaData` and `siteConfig` with `SITE_CONTENT`.
- **CoastalRequestModal.tsx**: Replaced `siteConfig.houseRules` with `SITE_CONTENT.site.houseRules`.
- **CoastalGallery.tsx**: Unified hardcoded carousel titles and subtitles into `SITE_CONTENT.gallery`.
- **CoastalAvailability.tsx**: Unified hardcoded labels ("Llegada", "Salida", etc.) into `SITE_CONTENT.availability`.
- **CoastalLocationTestimonials.tsx**: Replaced `testimonialsData` and `siteConfig` with `SITE_CONTENT`.

## Verification
- `grep -r "mockData" src/components/coastal` returns no results.
- Visual parity maintained across all sections.
