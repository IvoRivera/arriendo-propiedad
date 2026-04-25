## Current Position
- **Phase**: 23 (Regression Debugging)
- **Task**: Resolving SSR MODULE_NOT_FOUND error
- **Status**: Paused at 2026-04-25 15:26

## Last Session Summary
Implemented Multi-Property Schema and adapted UI (Phase 23). However, a critical regression occurred: the UI lost all styles and images are rendering as a stacked list. Build passes, but runtime SSR fails with a `MODULE_NOT_FOUND` error in `pages/_document.js`.

## In-Progress Work
- Multi-property pricing engine adaptation.
- Debugging the UI break.
- Database migrations for Phase 23 are committed but might not be fully applied in the environment (detected missing column error in dev logs).

## Blockers
- **Critical UI Regression**: Landing page layout is destroyed.
- **SSR Error**: `MODULE_NOT_FOUND` in `pages/_document.js`.

## Context Dump
### Decisions Made
- Multi-property support: Opted for a `property_id` based filtering in `seasonal_pricing` and `price_overrides`.
- Data Migration: Bootstrapped "Depto Reñaca" as the default property to avoid breaking existing queries.

### Approaches Tried
- Build verification: `npm run build` passes with exit code 0, ruling out simple syntax/import errors.
- Dev server logs: Detected `column seasonal_pricing.property_id does not exist` and `relation "properties" does not exist`. This indicates migrations might not be applied.
- Entry point review: Checked `src/app/page.tsx`, `home-client.tsx`, and `layout.tsx`. All look syntactically correct and follow App Router patterns.

### Current Hypothesis
The `MODULE_NOT_FOUND` error in `pages/_document.js` (a file that doesn't exist in the project) suggests that Next.js is failing over to a Pages Router compatibility mode or an internal fallback because of a hydration error or a missing module in the App Router tree. The "stacked images" and "lost styles" suggest that the CSS chunk and/or JavaScript chunks are not being correctly linked in the SSR output.

### Files of Interest
- `src/app/layout.tsx`: Root layout importing `globals.css`.
- `src/app/page.tsx`: Entry point fetching property data.
- `src/app/home-client.tsx`: Main client-side wrapper.
- `src/lib/systemConfigServer.ts`: New server-side config helper.

## Next Steps
1. **Apply Migrations**: Ensure `properties` table and `property_id` columns exist in the active DB.
2. **Clean Build**: Delete `.next` folder and run `npm run build` again to ensure no cache corruption.
3. **Trace _document**: Investigate why Next.js is reporting an error in `pages/_document.js` when the project is using App Router.
4. **CSS Verification**: Confirm Tailwind classes are being generated (check `.next/static/css`).
