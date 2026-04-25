# Decisions

> Previous milestone decisions archived in `.gsd/milestones/v1.1/DECISIONS.md` (Note: File did not exist in v1.1, starting fresh)

---

## Phase 19 & 20: Fallback & Decoupling Strategy

**Date:** 2026-04-25

### Scope
- **Robust Fallbacks**: Maintain local images as a safety net in case Supabase fails.
- **Extraction from mockData**: Decouple image fallbacks from `mockData.ts` to separate content from configuration.
- **Phase 20 Redefinition**: Changed from "Asset Removal" to "Verification & Fallback Logic". We will NOT delete local assets in `public/images/`.

### Approach
- **Hidden Config**: Create a dedicated `src/config/image-fallbacks.ts` to store static paths.
- **Component Logic**: Refactor `CoastalGallery` and `CoastalHero` to attempt DB fetch first, falling back to the new config on error or empty results.
- **Verification**: Perform "Chaos testing" (simulated DB failure) to ensure the UI remains usable.

### Constraints
- Local assets must remain in the `public/` folder to support the fallback mechanism.
