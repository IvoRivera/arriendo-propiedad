# Journal

---

## Session: 2026-04-25 15:00 - 15:26

### Objective
Implement Phase 23 (Multi-Property Core Schema & Base Data) and adapt the UI.

### Accomplished
- Created migrations for `properties`, `pricing_profiles`, and updated existing tables.
- Refactored `pricing.ts` and `ImageService` for property awareness.
- Adapted `CoastalHero` and `HomeClient` to support dynamic property pricing.
- Verified build passes.

### Verification
- [x] Schema migrations created.
- [x] Code refactor for multi-property logic.
- [x] Build script success.
- [ ] UI Functionality (BLOCKED by regression).

### Paused Because
Hit a critical UI regression that requires a fresh perspective. The landing page layout is broken, styles are missing, and images are stacked, despite a successful build.

### Handoff Notes
The problem likely lies in how the SSR is handling the new property data or a missing dependency that only manifests during runtime SSR. The `MODULE_NOT_FOUND` error in `pages/_document.js` is the primary clue. Check if any server-only modules are being accidentally imported in a context where Next.js tries to use them during hydration.
