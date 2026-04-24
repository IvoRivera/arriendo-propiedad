# ROADMAP.md

> **Current Phase**: Phase 1: Dynamic Sync
> **Milestone**: v1.0 - Live Foundation

## Must-Haves (from SPEC)
- [ ] Direct Supabase Price Sync (Hero + Modal)
- [ ] Admin Middleware Hardening
- [ ] Automated Stay Summary Transition
- [ ] Owner Notification Engine (Resend)

## Phases

### Phase 1: Dynamic Sync & Cleanup
**Status**: ⬜ Not Started
**Objective**: Eliminate mock data dependency and ensure the UI reflects the real-time Supabase configuration.
**Tasks**:
- Integrate `systemConfig` into `CoastalHero`.
- Refactor `CoastalAvailability` to use live price from context/props.
- Verify price consistency between Home and Modal.

### Phase 2: Administrative Security
**Status**: ⬜ Not Started
**Objective**: Secure the admin panel and configuration routes for production use.
**Tasks**:
- Implement Edge middleware for `api/admin` routes.
- Harden IP validation logic.
- Audit Supabase RLS policies for the `system_config` table.

### Phase 3: Owner Experience
**Status**: ⬜ Not Started
**Objective**: Provide the owner with tools to manage the calendar and bookings effectively.
**Tasks**:
- Implement a simple date-blocking UI in the Admin panel.
- Update `CoastalAvailability` to reflect blocked dates from the DB.
- Refine email templates for owner notifications.

### Phase 4: Polish & Performance
**Status**: ⬜ Not Started
**Objective**: Final aesthetic refinements and performance optimization.
**Tasks**:
- Optimize image loading for the Hero section.
- Refine Framer Motion transitions for mobile.
- Final E2E testing of the booking flow.
