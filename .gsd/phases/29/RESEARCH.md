# RESEARCH.md — Phase 29: Guards de Resiliencia en Pricing

## Objective
Integrate the `SchemaValidator` into the Pricing Engine to ensure that any schema inconsistency prevents the execution of pricing logic, avoiding silent errors or incorrect calculations.

## Integration Strategy

### 1. Guard Location
The check should happen at the entry point of critical functions:
- `calculateBookingPrice` in `src/lib/pricing.ts`.
- Possibly in the API route `/api/public/pricing/route.ts` as a middleware-like check.

### 2. Failure Handling
- **Development/Staging**: Throw a descriptive error including the missing columns.
- **Production**: Log the detailed error but return a generic "Service Unavailable" or "Configuration Error" to the user, ensuring the system doesn't operate on partial data.

### 3. Caching (Optional but recommended)
Validation queries `information_schema` via RPC. While fast, we don't want to run it on *every* single pricing request if the traffic is high.
- **Option A**: Run on every request (Safest).
- **Option B**: Cache the result for X minutes/hours.
- **Decision**: Start with **Option A** for maximum integrity as per `SPEC.md`. Optimize later if needed.

## Proposed Changes
- Modify `src/lib/pricing.ts` to import `validateSchema`.
- Add a guard block at the start of `calculateBookingPrice`.
- Ensure the API route handles the potential thrown error.
