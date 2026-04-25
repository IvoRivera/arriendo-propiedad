# ROADMAP.md

> **Current Milestone**: Gap Closure — Image Hero Decoupling
> **Goal**: Separate the Hero image from the gallery system to allow independent management.

## Must-Haves
- [ ] Dedicated `hero` category in database and service layer.
- [ ] Admin UI for managing the Hero image independently.
- [ ] Frontend updated to use `hero` image with controlled fallback.

## Phases

### Phase 21: Hero Image Decoupling (Gap Closure)
**Status**: ⬜ Not Started
**Objective**: Address the gap where Hero image depends on the first "Featured" gallery image.

**Tasks:**
- [ ] Add `hero` category to `ImageCategory` and service layer.
- [ ] Implement independent Hero management in Admin panel.
- [ ] Refactor `CoastalHero` to use the dedicated Hero image.
- [ ] Implement controlled fallback (placeholder/blur) for missing Hero image.
