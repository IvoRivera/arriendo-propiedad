---
phase: 18
plan: 1
wave: 1
---

# Plan 18.1: Flow Foundation (Adapter & Environment)

## Objective
Create the core integration layer for Flow.cl, handling the complex HMAC-SHA256 signing required by their API and providing a clean interface for creating payments.

## Context
- `ROADMAP.md` Phase 18
- Flow.cl API Documentation (HMAC signing requirement)
- Next.js API Routes pattern

## Tasks

<task type="auto">
  <name>Create Flow Utility Adapter</name>
  <files>src/lib/flow.ts</files>
  <action>
    Implement a `FlowAdapter` class or utility functions that:
    1. Handles parameter sorting and HMAC-SHA256 signing.
    2. Provides a `createPayment` method that calls `https://www.flow.cl/api/payment/create`.
    3. Handles environment variables for `FLOW_API_KEY` and `FLOW_SECRET_KEY`.
    4. Includes TypeScript interfaces for requests and responses.
  </action>
  <verify>
    Create a temporary test script in `scratch/test-flow-sign.ts` that mocks parameters and verifies the signature matches the expected format.
  </verify>
  <done>
    `src/lib/flow.ts` exists and correctly signs requests.
  </done>
</task>

<task type="auto">
  <name>Define Flow Schemas & Types</name>
  <files>src/lib/types/flow.ts</files>
  <action>
    Define Zod schemas for:
    1. Flow Payment Creation Response.
    2. Flow Status Callback (Webhook) payload.
    Ensures type safety when handling responses from the gateway.
  </action>
  <verify>
    Run a small Zod parse test in the scratch file.
  </verify>
  <done>
    Type definitions and Zod schemas are ready for use in API routes.
  </done>
</task>

## Success Criteria
- [ ] Signature logic correctly implements Flow's requirements.
- [ ] Environment variables are properly typed and accessed.
- [ ] Utility is ready to be consumed by the email API.
