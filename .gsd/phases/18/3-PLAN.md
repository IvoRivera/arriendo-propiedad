---
phase: 18
plan: 3
wave: 2
---

# Plan 18.3: Flow Webhook & Status Automation

## Objective
Automatically confirm reservations when a payment is completed through Flow, eliminating the need for manual verification of bank transfers.

## Context
- Flow.cl Webhook specification (POST with `token`)
- Supabase `booking_requests` table
- `src/lib/flow.ts`

## Tasks

<task type="auto">
  <name>Create Flow Webhook Endpoint</name>
  <files>src/app/api/webhooks/flow/route.ts</files>
  <action>
    Implement a `POST` endpoint that:
    1. Receives the `token` from Flow.
    2. Calls `flow.getPaymentStatus(token)` to verify the payment is actually '2' (paid).
    3. Identifies the corresponding booking request.
    4. Updates the request status to `confirmed` in Supabase.
    5. Triggers the confirmation email to the guest (reusing the logic from `send-status-email`).
  </action>
  <verify>
    Use `curl` or Postman to simulate a Flow callback with a dummy token and verify the database update.
  </verify>
  <done>
    Payment confirmation is fully automated.
  </done>
</task>

<task type="auto">
  <name>Add Webhook Logging & Resilience</name>
  <files>src/app/api/webhooks/flow/route.ts</files>
  <action>
    1. Add detailed logging for incoming webhooks.
    2. Implement basic error handling (idempotency check) to avoid sending multiple confirmation emails if Flow retries the webhook.
  </action>
  <verify>
    Simulate duplicate webhook calls and verify only one email is sent.
  </verify>
  <done>
    The webhook handler is robust and production-ready.
  </done>
</task>

## Success Criteria
- [ ] Payment in Flow automatically updates the booking to "Confirmado".
- [ ] Guest receives the confirmation email immediately after paying.
- [ ] Manual confirmation is still possible as a fallback.
