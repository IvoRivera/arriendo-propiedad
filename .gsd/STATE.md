# Project State

## Current Position
- **Phase**: 1 (Audit & Foundation)
- **Status**: Active (resumed 2026-04-28 14:59)

## Last Session Summary
Successfully implemented the GSD framework and executed Phase 1 of the architectural audit.
- **Foundation Consolidation**: Centralized pricing, date, and formatting logic.
- **Component Decoupling**: Refactored the `PricingManager` God Component into atomic units and a custom hook.
- **API Hardening**: Implemented Zod validation on admin pricing routes.
- **Bug Fix**: Resolved a `ReferenceError` in `apply/route.ts` caused by a residual `console.log`.

## In-Progress Work
- Analyzing `src/app/api/public/pricing/route.ts` for logic duplication. It currently uses `getPropertyBaseConfig` and manual parsing which could be replaced by the new `parseBasePrice` utility.

## Context Dump

### Decisions Made
- **Centralized Constants**: Use `src/lib/constants.ts` for all magic numbers (e.g., `80000` base price).
- **Date Handling**: Adopted `parseSafeISO` (local noon normalization) to prevent timezone shifting in booking calculations.
- **GSD Tracking**: Force-adding the `.gsd` directory to Git to ensure audit history is preserved despite `.gitignore`.

### Files of Interest
- `src/lib/pricing-engine.ts`: The core business logic, now refactored.
- `src/components/admin/PricingManager.tsx`: Now a lean orchestrator.
- `src/app/api/public/pricing/route.ts`: Next target for refactoring (Public API parity).

## Next Steps
1. **Refactor Public Pricing API**: Migrate `src/app/api/public/pricing/route.ts` to use `parseBasePrice` and shared utilities.
2. **Phase 2 Planning**: Decompose UI/UX improvements into actionable plans.
3. **Audit Milestone 2**: Verify mobile responsiveness and visual consistency.
