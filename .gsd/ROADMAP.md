# ROADMAP.md

> **Current Phase**: Phase 4: Polish & Performance
> **Milestone**: v1.0 - Live Foundation

## Must-Haves (from SPEC)
- [x] Direct Supabase Price Sync (Hero + Modal)
- [x] Admin Middleware Hardening
- [x] Automated Stay Summary Transition
- [x] Owner Notification Engine (Resend)

## Phases

### Phase 1: Dynamic Sync & Cleanup
**Status**: ✅ Complete
**Objective**: Eliminate mock data dependency and ensure the UI reflects the real-time Supabase configuration.
**Tasks**:
- [x] Integrate `systemConfig` into `CoastalHero`.
- [x] Refactor `CoastalAvailability` to use live price from context/props.
- [x] Verify price consistency between Home and Modal.

### Phase 2: Administrative Security
**Status**: ✅ Complete
**Objective**: Secure the admin panel and configuration routes for production use.
**Tasks**:
- [x] Implement Edge middleware for `api/admin` routes.
- [x] Harden IP validation logic.
- [x] Audit Supabase RLS policies for the `system_config` table.

### Phase 3: Owner Experience
**Status**: ✅ Complete
**Objective**: Provide the owner with tools to manage the calendar and bookings effectively.
**Tasks**:
- [x] Implement a simple date-blocking UI in the Admin panel.
- [x] Update `CoastalAvailability` to reflect blocked dates from the DB.
- [x] Refine email templates for owner notifications.

### Phase 4: Mobile Interaction & Stability
**Status**: ✅ Complete
**Objective**: Isolate and resolve mobile interaction blocks while ensuring map functionality.
**Tasks**:
- [x] Implement Visual Debugging Layer (highlight fixed/absolute elements).
- [x] Harden Hero & Availability stacking context (z-index + pointer-events).
- [x] Convert interactive divs to native button elements (Mobile Stability).
- [x] Sanitize global CSS (removed hover conflicts).
- [x] Verify full interactivity on iOS/Android physical devices.
