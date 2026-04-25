# Architecture

> Updated on 2026-04-24 (Post-Milestone v1.1)

## Overview

A premium, trust-based rental booking platform for a boutique property in La Serena. The system focuses on exclusivity and curated guest experiences, using a "social trust" recommendation system instead of traditional instant booking.

```
┌─────────────────────────────────────────┐
│        [Next.js App Router UI]          │
│ (Coastal Components + Framer Motion)    │
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

## Components

### Coastal UI System
- **Purpose:** High-end, editorial-style interface for guests.
- **Location:** `src/components/coastal/`
- **Features:** Responsive carousels, emotional loading states, and localized form validations.

### Dynamic Pricing System
- **Purpose:** Manages seasonal rates and base pricing with visual calendar integration.
- **Location:** `src/lib/pricingClient.ts`, `src/api/public/pricing`
- **Data Source:** `seasonal_pricing` table in Supabase.

### Booking Request Flow
- **Purpose:** Multi-step modal that captures stay intent, calculates dynamic pricing, and validates social recommendations.
- **Location:** `src/components/coastal/CoastalRequestModal.tsx`
- **Security:** Root-level Web3 Bug Guard to prevent browser-injector crashes.

### Inventory Management (MVP)
- **Purpose:** Guest-led inventory confirmation during check-in.
- **Location:** `/guest/checkin/[id]`

## Data Flow

1. **Guest Visit**: Landing page loads. `CoastalAvailability` fetches real-time date blocks and `seasonal_pricing` data.
2. **Dynamic Calculation**: As guest selects dates, `getPriceForDate` calculates the total stay cost including seasonal spikes.
3. **Request Submission**: Guest fills the form. Payload includes `trip_reason`, `referred_by`, and `rules_accepted`.
4. **Validation & Notification**: API verifies date concurrency, records the request in Supabase, and dispatches a notification via Resend.

## Integration Points

| Service | Type | Purpose |
|---------|------|---------|
| Supabase | BaaS | Database, RLS Security, and Dynamic Pricing storage. |
| Resend | API | Automated email notifications for new requests. |

## Technical Debt / Next Steps

- [ ] **Middleware Hardening**: Move IP parsing to Edge middleware.
- [ ] **Admin UI Refinement**: Consolidate pricing and inventory management into a unified dashboard.
- [ ] **Type Hardening**: Re-enable ESLint and replace remaining `any` types in `CoastalRequestModal`.

## Conventions

- **Hydration Safety**: Use `createPortal` for top-level modals.
- **Defensive Scripting**: Use inline guards in `layout.tsx` for mobile wallet compatibility.
- **Naming:** Feature-based organization within `src/components/coastal`.
