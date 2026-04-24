# Phase 3 Plan: Owner Experience

> **Goal**: Empower the owner to manage property availability and stay information directly from the database, eliminating the need for manual code updates.

## Context
- **Current Source**: `src/data/mockData.ts` -> `availabilityData.blockedDates`
- **Target Source**: Supabase `blocked_dates` table + `booking_requests` (accepted).
- **UI Target**: `CoastalAvailability` and Admin Dashboard.

## Tasks

<task type="auto">
<name>Create Live Availability Service</name>
<files>
- src/lib/availability.ts
</files>
<action>
Create a service to fetch blocked dates from Supabase. It should provide a function `getLiveBlockedDates()` that aggregates manual blocks and confirmed bookings.
</action>
<verify>
Test the service by adding a date to the database and ensuring it appears in the returned array.
</verify>
<done>A centralized service provides the source of truth for availability.</done>
</task>

<task type="auto">
<name>Connect UI to Dynamic Availability</name>
<files>
- src/components/coastal/CoastalAvailability.tsx
</files>
<action>
Refactor `CoastalAvailability` to fetch blocked dates on mount using the new service. Remove the dependency on `mockData.ts` for the `blockedDates` array.
</action>
<verify>
Verify that dates blocked in the database are correctly disabled (struck through and unselectable) in the guest calendar.
</verify>
<done>The guest-facing calendar reflects real-time availability from Supabase.</done>
</task>

<task type="auto">
<name>Implement Admin Date Blocking UI</name>
<files>
- src/components/admin/DateBlockingManager.tsx
- src/app/admin/page.tsx (or appropriate admin route)
</files>
<action>
Create a simple administrative UI to allow the owner to add manual blocks (single dates or ranges) to the `blocked_dates` table.
</action>
<verify>
Block a date through the new UI and confirm it immediately appears as blocked in the main landing page.
</verify>
<done>The owner can manage availability without technical assistance.</done>
</task>

<task type="auto">
<name>Refine Email Notifications</name>
<files>
- src/app/api/notify-new-request/route.ts
</files>
<action>
Enhance the email notification template to include the "Stay Summary" data (nights count, estimated total) so the owner has full context in the email.
</action>
<verify>
Send a test request and verify the received email contains the correct pricing and night calculations.
</verify>
<done>Owner notifications are comprehensive and professional.</done>
</task>
