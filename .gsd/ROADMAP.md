# ROADMAP.md

> **Current Phase**: Phase 5: UX/UI Refinements (Mobile-First & Narrative)
> **Milestone**: v1.1 - Booking Experience & Inventory Optimization

## Must-Haves (from SPEC)
- [ ] Form-based booking flow (No WhatsApp CTAs)
- [ ] Improved Image Carousels (UX/Mobile)
- [ ] Emotional Loading State
- [ ] Max 4 guests & Availability check before form
- [ ] Mandatory House Rules acceptance & Anti-party filter
- [ ] Pre/Post Stay Inventory System

## Phases

### Phase 1 to 4: v1.0 Live Foundation
**Status**: ✅ Complete
**Objective**: Initial dynamic sync, admin security, owner experience, and mobile stability.

### Phase 5: UX/UI Refinements (Mobile-First & Narrative)
**Status**: ⏳ Pending
**Objective**: Update the booking narrative, improve image carousels, and add emotional loading states.
**Tasks**:
- [ ] Update narrative to "Solicitud de reserva" and remove WhatsApp CTAs.
- [ ] Upgrade GalleryCarousel (dots, arrows, mobile lightbox UX).
- [ ] Implement emotional loading screen ("Estamos preparando tu estadía...").

### Phase 6: Business Rules & Compliance
**Status**: ⏳ Pending
**Objective**: Enforce capacity limits, display availability, and integrate house rules.
**Tasks**:
- [ ] Implement max 4 guests validation (UI and Backend).
- [ ] Display availability calendar seamlessly before form submission.
- [ ] Add house rules presentation and mandatory acceptance checkbox.
- [ ] Add "Trip Reason" field for anti-party filtering.

### Phase 7: Inventory Management System
**Status**: ⏳ Pending
**Objective**: Implement a friendly pre and post-stay inventory validation flow.
**Tasks**:
- [ ] Create base inventory data model and UI for check-in confirmation.
- [ ] Implement post-stay (check-out) difference logging and host notification.

### Phase 8: Technical Polish & Data Persistence
**Status**: ⏳ Pending
**Objective**: Ensure mobile-first excellence, clear system states, and data persistence for all new features.
**Tasks**:
- [ ] Review all forms for mobile optimizations (large inputs, simple navigation).
- [ ] Ensure all states (Loading, Error, Success, Empty) are handled.
- [ ] Connect new fields (rules accepted, inventory, trip reason) to Supabase.
