# RESEARCH.md — Phase 33: Discovery & Mapping

## Audit of `src/data/mockData.ts`

| Exported Name | Usage in Code | Destination |
|---------------|---------------|-------------|
| `siteConfig` | FooterCta, Testimonials, RequestModal | `site-content.ts` (Static) |
| `heroData` | CoastalHero | `site-content.ts` (Static) |
| `experienceData` | CoastalExperience | `site-content.ts` (Static) |
| `galleryData` | **UNUSED** (Hardcoded in CoastalGallery) | `site-content.ts` (Migration needed) |
| `specificationsData`| CoastalSpecs | `site-content.ts` (Static) |
| `availabilityData` | **UNUSED** (Labels in component) | `site-content.ts` (Migration needed) |
| `discoverData` | CoastalDiscover | `site-content.ts` (Static) |
| `testimonialsData` | CoastalLocationTestimonials | `site-content.ts` (Static/Future DB) |
| `baseInventory` | Check-in Page | Supabase `inventory_items` (Pending) |
| `footerCtaData` | CoastalFooterCta | `site-content.ts` (Static) |

## Dependency Mapping (Detailed)

- **CoastalHero.tsx**: Uses `headline`, `tagline`, `subheadline`, `availabilityPrompt`, `ctaText`.
- **CoastalExperience.tsx**: Uses `sectionTitle`, `sectionSubtitle`, `features` (array of items with icon, title, description).
- **CoastalSpecs.tsx**: Uses `sectionTitle`, `items` (array of icon, label, sublabel).
- **CoastalDiscover.tsx**: Uses `sectionTitle`, `sectionSubtitle`, `items` (emoji, title, description).
- **CoastalLocationTestimonials.tsx**: Uses `testimonialsData.sectionTitle`, `testimonialsData.items` (name, avatar, source, rating, text), and `siteConfig.address`, `siteConfig.googleMapsEmbedSrc`.
- **CoastalFooterCta.tsx**: Uses `footerCtaData`, `siteConfig.address`, `siteConfig.location`.
- **CoastalRequestModal.tsx**: Uses `siteConfig.houseRules`.

## Critical Findings
- `CoastalGallery` and `CoastalAvailability` have duplicated or hardcoded strings that match `mockData` but don't import it.
- `baseInventory` is the only "structural" data that might belong in the DB if we want admin control over it.

## Target Structure for `src/config/site-content.ts`

```typescript
export interface SiteContent {
  site: {
    address: string;
    location: string;
    mapUrl: string;
    googleMapsEmbedSrc: string;
    houseRules: string[];
  };
  hero: {
    headline: string;
    tagline: string;
    subheadline: string;
    ctaText: string;
  };
  // ... and so on
}
```
