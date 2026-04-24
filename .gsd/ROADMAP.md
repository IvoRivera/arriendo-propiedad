# ROADMAP.md

> **Current Phase**: Phase 6: Business Rules & Compliance
> **Milestone**: v1.1 - Booking Experience & Inventory Optimization

## Must-Haves (from SPEC)
- [x] Form-based booking flow (No WhatsApp CTAs)
- [x] Improved Image Carousels (UX/Mobile)
- [x] Emotional Loading State
- [x] Max 4 guests & Availability check before form
- [x] Mandatory House Rules acceptance & Anti-party filter
- [x] Pre/Post Stay Inventory System (MVP)

## Phases

### Phase 1 to 4: v1.0 Live Foundation
**Status**: ✅ Complete
**Objective**: Initial dynamic sync, admin security, owner experience, and mobile stability.

### Phase 5: UX/UI Refinements (Mobile-First & Narrative)
**Status**: ✅ Complete
**Objective**: Update the booking narrative, improve image carousels, and add emotional loading states.

**Tasks**:
- [x] Update narrative to "Solicitud de reserva" and remove WhatsApp CTAs.
- [x] Upgrade GalleryCarousel (dots, arrows, mobile lightbox UX).
- [x] Implement emotional loading screen ("Estamos preparando tu estadía...").


### Phase 6: Business Rules & Compliance
**Status**: ✅ Complete
**Objective**: Enforce capacity limits, display availability, and integrate house rules.
**Tasks**:
- [x] Implement max 4 guests validation (UI and Backend).
- [x] Display availability calendar seamlessly before form submission.
- [x] Add house rules presentation and mandatory acceptance checkbox.
- [x] Add "Trip Reason" field for anti-party filtering.
- [x] Implement server-side concurrency check for dates.

### Phase 7: Inventory Management System (MVP)
**Status**: ✅ Complete
**Objective**: Implement a friendly pre and post-stay inventory validation flow.
**Tasks**:
- [x] Create base inventory data model in `mockData.ts`.
- [x] Implement Digital Check-in page (`/guest/checkin/[id]`) for inventory confirmation.
- [x] Define SQL schema for `inventory_logs`.

### Phase 8: Technical Polish & Data Persistence
**Status**: ⏳ Pending
**Objective**: Ensure mobile-first excellence, clear system states, and data persistence for all new features.
**Tasks**:
- [ ] Review all forms for mobile optimizations (large inputs, simple navigation).
- [ ] Ensure all states (Loading, Error, Success, Empty) are handled.
- [ ] Connect new fields (rules accepted, inventory, trip reason) to Supabase.
