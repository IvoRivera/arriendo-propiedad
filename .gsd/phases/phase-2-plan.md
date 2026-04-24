# Phase 2 Plan: Administrative Security

> **Goal**: Secure the administrative interface and API routes using Edge Middleware and centralized authentication logic.

## Context
- **Protected Paths**: `/api/admin/*`, `/admin/*`
- **Auth Strategy**: Supabase JWT + Whitelist (`ALLOWED_ADMIN_EMAILS`) + Internal Secret.
- **Current State**: Security logic is embedded directly in route handlers.

## Tasks

<task type="auto">
<name>Implement Edge Middleware</name>
<files>
- src/middleware.ts
</files>
<action>
Create a global `middleware.ts` that matches administrative routes. It should handle initial rate limiting based on headers and verify the presence of an Authorization header or internal secret for protected paths.
</action>
<verify>
Try to access an admin API route without a token; it should return 401/403 before reaching the handler.
</verify>
<done>Administrative routes are intercepted and pre-validated by the Edge Middleware.</done>
</task>

<task type="auto">
<name>Centralize Admin Authentication Logic</name>
<files>
- src/lib/adminAuth.ts
</files>
<action>
Refactor `adminAuth.ts` to include a `verifyAdminRequest(req: Request)` helper. This function will handle token extraction, Supabase user verification, and whitelist checking in a single, reusable call.
</action>
<verify>
Ensure the helper correctly handles both internal secret (SYSTEM mode) and user tokens (USER mode).
</verify>
<done>Authentication logic is modular and reusable across all admin endpoints.</done>
</task>

<task type="auto">
<name>Refactor Admin API Routes</name>
<files>
- src/app/api/admin/config/update/route.ts
- src/app/api/send-status-email/route.ts
</files>
<action>
Simplify the route handlers by replacing the duplicated security blocks with the new `verifyAdminRequest` helper. Ensure consistent error responses (401/403/429).
</action>
<verify>
Perform a successful config update and a failed unauthorized attempt to verify both paths work.
</verify>
<done>API routes are clean, focused on business logic, and consistently secured.</done>
</task>

<task type="manual">
<name>Supabase RLS Audit</name>
<files>
- Database (Supabase Dashboard)
</files>
<action>
Review RLS policies for `system_config` and `booking_requests` tables. Ensure only the service_role or authenticated admins in the whitelist (via RPC) can perform UPDATE/DELETE operations.
</action>
<verify>
Attempt an update via the Supabase SQL editor using a non-admin user role.
</verify>
<done>Database level security is hardened against direct access bypasses.</done>
</task>
