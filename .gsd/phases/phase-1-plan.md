# Phase 1 Plan: Dynamic Sync & Cleanup

> **Goal**: Replace hardcoded pricing and metadata with live values from Supabase via the `systemConfig` service.

## Context
- **Primary Key**: `PROPERTY_RENT_VALUE`
- **Current Source**: `src/data/mockData.ts` -> `heroData.pricePerNight`
- **Target Source**: Supabase `system_config` table.

## Tasks

<task type="auto">
<name>Create ConfigProvider and Integrate in Layout</name>
<files>
- src/components/providers/ConfigProvider.tsx
- src/app/layout.tsx
</files>
<action>
Create a client-side `ConfigProvider` that calls `ensureConfigLoaded()` on mount and exposes a `useConfig()` hook. Wrap `RootLayout` with this provider to ensure global availability.
</action>
<verify>
Check browser console to ensure 'system_config' is fetched successfully on page load.
</verify>
<done>Configuration is loaded into the React context at the application root.</done>
</task>

<task type="auto">
<name>Connect CoastalHero to Live Price</name>
<files>
- src/components/coastal/CoastalHero.tsx
</files>
<action>
Update the `CoastalHero` component to consume `PROPERTY_RENT_VALUE` from the `ConfigProvider`. Format the value (e.g., adding dots for thousands) to match the premium design.
</action>
<verify>
Change the value in the Supabase dashboard and refresh the page; the Hero price should update immediately.
</verify>
<done>Hero section displays the live price from Supabase.</done>
</task>

<task type="auto">
<name>Sync Price in Availability and Request Modal</name>
<files>
- src/components/coastal/CoastalAvailability.tsx
- src/components/coastal/CoastalRequestModal.tsx
</files>
<action>
Update both components to use the live price for their "Stay Summary" calculations. Ensure the `pricePerNight` variable is sourced from the `ConfigProvider` instead of `mockData`.
</done>
<verify>
Select dates in the calendar and verify that the "Total estimado" is calculated using the Supabase price.
</verify>
<done>All guest-facing price calculations use the official configuration.</done>
</task>

<task type="auto">
<name>Cleanup mockData and Verify Flow</name>
<files>
- src/data/mockData.ts
</files>
<action>
Remove or mark as deprecated the `pricePerNight` field in `heroData` to prevent future accidental use. Perform a final end-to-end check of the booking flow.
</action>
<verify>
Search for any remaining hardcoded '80.000' strings in the components.
</verify>
<done>Source code is clean of static pricing references.</done>
</task>
