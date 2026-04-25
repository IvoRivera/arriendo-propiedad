---
phase: 35
plan: 2
wave: 1
---

# Plan 35.2: Services Validation

## Objective
Ensure that Pricing and Image services are fully decoupled from static data and operating on dynamic sources.

## Context
- src/lib/pricingClient.ts
- src/app/api/public/pricing/route.ts
- src/app/api/public/images/route.ts

## Tasks

<task type="auto">
  <name>Validate Pricing and Images API</name>
  <files>
    src/app/api/public/pricing/route.ts,
    src/app/api/public/images/route.ts
  </files>
  <action>
    1. Check if these API routes import anything from `mockData` or `site-content`.
    2. Confirm they are strictly using Supabase via `SchemaGuard`.
  </action>
  <verify>Code review of the API routes.</verify>
  <done>API routes confirmed dynamic.</done>
</task>

<task type="auto">
  <name>Validate Site Configuration Fallbacks</name>
  <files>src/config/site-content.ts</files>
  <action>
    1. Review `SITE_CONTENT` for any "dynamic" data that should be in `system_config`.
    2. Ensure components use `getValue()` where appropriate to allow runtime overrides.
  </action>
  <verify>Check that address, pricing fallbacks, and CTA texts are overrideable via ConfigProvider.</verify>
  <done>Config system is robust with safe defaults.</done>
</task>

## Success Criteria
- [ ] No static data leak in API services.
- [ ] All "live" settings are overrideable via Supabase `system_config`.
