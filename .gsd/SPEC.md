# SPEC: Project Audit, Refactoring & Hardening [FINALIZED]

## Goal
Systematically audit the "departamento-ls" codebase to eliminate technical debt, consolidate redundant logic, decouple components, and harden the architecture for production-grade reliability.

## Must-Haves
- **Structural Integrity**:
    - Clean, predictable directory structure.
    - No dead imports or orphaned files.
    - Consistently named files and variables.
- **Logic Consolidation**:
    - Centralized pricing logic (no duplication).
    - Shared utilities consolidated in `src/lib` or `src/utils`.
- **Code Quality**:
    - No "giant files" (> 300 lines). Break down large components and pages.
    - Zod validation for all API inputs and outputs.
    - Removal of `console.log` and debug leftovers.
- **Robustness**:
    - Decoupled components (props-based instead of internal state fetching where possible).
    - Fragile features (like date parsing) made resilient.
- **Premium UX**:
    - Smooth, eased scroll transitions for key CTAs (e.g., Hero to Calendar).
    - Avoid "snappy" browser default scroll behaviors.

## Problem Areas (User Identified)
1. **Disordered Structure**: Root and `src` directories need cleanup.
2. **Giant Files**: `PricingManager.tsx`, `DateBlockingManager.tsx`, `Admin/Page.tsx`.
3. **Repeated Logic**: Pricing calculations and date formatting.
4. **Silent Technical Debt**: Fallback prices, hardcoded strings, weak error handling.
5. **Coupled Components**: Admin UI tightly coupled to Supabase directly in sub-components.
6. **Duplicate Utilities**: Multiple ways to format dates and currency.
7. **Inconsistent Names**: Mixing snake_case and camelCase in props/state.
8. **Dead Imports**: Unused libraries and files.
9. **Fragile Features**: Manual string manipulation for dates.

## Proposed Changes

### Phase 1: Foundation & Mapping
- [ ] Deep scan for dead code and dead imports.
- [ ] Standardize naming conventions (camelCase for JS/TS, snake_case only for DB fields).
- [ ] Create a consolidated `src/lib/constants.ts` for all magic numbers and strings.

### Phase 2: Logic Consolidation
- [ ] Refactor `src/lib/pricing-engine.ts` to be the single source of truth.
- [ ] Extract shared date utilities to `src/lib/date-utils.ts`.
- [ ] Extract currency formatting to `src/lib/formatters.ts`.

### Phase 3: Component Decoupling & Giant File Splitting
- [ ] Split `PricingManager.tsx` into smaller components (e.g., `SeasonTable`, `PriceForm`, `ConfigPanel`).
- [ ] Split `DateBlockingManager.tsx` into `CalendarView`, `BlockingActions`, `BlockedList`.
- [ ] Refactor `Admin/Page.tsx` to use layout-based navigation or smaller sub-pages.

### Phase 4: API & Security Hardening
- [ ] Implement Zod schemas for all API routes.
- [ ] Centralize error response handling.
- [ ] Transition from email whitelisting to a more robust RBAC if necessary (though out of scope for "cleanup", it's a security hardening goal).

## Success Criteria
- [ ] `npm run lint` passes with 0 warnings.
- [ ] No file in `src` exceeds 300 lines.
- [ ] Pricing logic exists in exactly ONE place.
- [ ] All API routes use Zod for validation.
- [ ] All components are decoupled from direct data fetching (use hooks or props).
