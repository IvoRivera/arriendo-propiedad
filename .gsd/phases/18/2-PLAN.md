---
phase: 18
plan: 2
wave: 1
---

# Plan 18.2: Automated Payment Link & Email Integration

## Objective
Automatically generate a Flow payment link when a booking is pre-approved and include it in the notification email sent to the guest.

## Context
- `src/app/api/send-status-email/route.ts`
- `src/lib/flow.ts` (created in 18.1)

## Tasks

<task type="auto">
  <name>Inject Flow Link Generation in Email API</name>
  <files>src/app/api/send-status-email/route.ts</files>
  <action>
    Modify the `POST` handler:
    1. Import the `FlowAdapter`.
    2. In the `pre_approved` case, call `flow.createPayment()` using the `total_price` and booking details.
    3. Capture the `url` and `token` from the Flow response.
    4. Store the `flow_token` in the `booking_requests` table (needs a new column or use existing metadata).
  </action>
  <verify>
    Mock a successful Flow response and verify the email payload includes a valid URL.
  </verify>
  <done>
    Pre-approved emails now contain a dynamic payment link.
  </done>
</task>

<task type="auto">
  <name>Refine Email Template for Payment</name>
  <files>src/app/api/send-status-email/route.ts</files>
  <action>
    Update the `pre_approved` email text to:
    1. Clearly present the Flow payment link as the primary option.
    2. Keep bank details as a fallback.
    3. Use a clear CTA (Call to Action) text like "Pagar con Webpay/Tarjetas".
  </action>
  <verify>
    Check the generated `text` property in the Resend payload via console.log.
  </verify>
  <done>
    The email is persuasive and clearly offers the new payment method.
  </done>
</task>

## Success Criteria
- [ ] Admin "Pre-aprobar" action triggers a Flow payment creation.
- [ ] Guest receives an email with a clickable payment link.
- [ ] Flow link leads to the official Flow checkout page.
