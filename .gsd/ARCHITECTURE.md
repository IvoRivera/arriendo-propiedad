# Architecture

> Updated on 2026-04-25 (Post-Milestone v1.3 — Image System Migration)

## Overview

A premium, trust-based rental booking platform for a boutique property in La Serena. The system focuses on exclusivity and curated guest experiences, using a "social trust" recommendation system instead of traditional instant booking.

```
┌─────────────────────────────────────────┐
│        [Next.js App Router UI]          │
│ (Coastal Components + Framer Motion)    │
├─────────────────────────────────────────┤
│        [Dynamic Image Management]        │
│ (Supabase Storage + Admin Control)      │
├─────────────────────────────────────────┤
│        [System & Pricing Layer]         │
│ (Dynamic Seasonal Rates + Inventory)    │
├─────────────────────────────────────────┤
│        [API & Integration Layer]        │
│ (Supabase RPCs + Resend Email API)      │
├─────────────────────────────────────────┤
│            [Data Layer]                 │
│      (Supabase PostgreSQL + RLS)        │
└─────────────────────────────────────────┘
```

## Core Systems

### Dynamic Image Management (New in v1.3)
- **Purpose:** Full control over visual content without code redeployment.
- **Components:** `ImageManager`, `ImageUploader` (Admin Panel).
- **Service Layer:** `image-service.ts` (Next.js cached fetches with tag revalidation).
- **Fallback Logic:** Isolated `src/config/image-fallbacks.ts` for offline/DB-failure scenarios.
- **Storage:** Supabase Storage bucket (`carousel-images`).

### Coastal UI System
- **Purpose:** High-end, editorial-style interface for guests.
- **Location:** `src/components/coastal/`
- **Features:** Responsive carousels (`GalleryCarousel`), emotional loading states, and dynamic Hero sections.

### Dynamic Pricing System
- **Purpose:** Manages seasonal rates and base pricing with visual calendar integration.
- **Location:** `src/lib/pricingClient.ts`, `src/api/public/pricing`
- **Data Source:** `seasonal_pricing` table in Supabase.

### Booking Request Flow
- **Purpose:** Multi-step modal that captures stay intent, calculates dynamic pricing, and validates social recommendations.
- **Location:** `src/components/coastal/CoastalRequestModal.tsx`

## Data Flow

1. **Content Fetching**: Landing page fetches images via `ImageService.getPublicImages` (cached).
2. **Fallback Switch**: If Supabase is unreachable, components automatically switch to local `public/images/` via `image-fallbacks.ts`.
3. **Admin Mutation**: When an image is uploaded/deleted/reordered, `revalidateTag('images-all')` is triggered to refresh the landing page cache globally.
4. **Dynamic Calculation**: As guest selects dates, `getPriceForDate` calculates total stay cost.

## Integration Points

| Service | Type | Purpose |
|---------|------|---------|
| Supabase | BaaS | Database, Storage, RLS Security, and Dynamic Pricing. |
| Resend | API | Automated email notifications for new requests. |

## Technical Debt / Next Steps

- [ ] **Middleware Hardening**: Move IP parsing to Edge middleware.
- [ ] **Admin UI Consolidation**: Unify pricing, inventory, and image management.
- [ ] **Type Hardening**: Finalize DB types for image metadata.

## Conventions

- **Hydration Safety**: Use `createPortal` for top-level modals.
- **Defensive Scripting**: Robust fallback patterns for all external data fetches.
- **Naming:** Feature-based organization within `src/components/coastal`.
