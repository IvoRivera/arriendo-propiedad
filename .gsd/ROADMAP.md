# ROADMAP.md

> **Current Milestone**: v1.3 — Image System Migration (Static → Database Driven)
> **Goal**: Full migration of the image system from static assets to Supabase, removing all dependencies on local public assets and mockData for visual content.

## Must-Haves
- [ ] Complete data migration of existing static images to Supabase.
- [ ] Zero dependency on `public/images/` for gallery categories.
- [ ] `mockData.ts` cleaned of all image references.
- [ ] Consistent ordering and metadata preservation from the current layout.
- [ ] Robust fallback and error handling for DB fetches.

## Phases

### Phase 16: Static Asset Mapping & Migration Script
**Status**: ✅ Complete
**Objective**: Map existing local images to database entries and create a migration script for automated upload.

### Phase 17: Migration Execution & Storage Sync
**Status**: ✅ Complete
**Objective**: Execute the migration script to upload assets to Supabase Storage and sync the `images` table.

### Phase 18: Backend Data Layer Hardening
**Status**: ⬜ Not Started
**Objective**: Refactor the service layer to remove mock data fallbacks and ensure strict typing for image objects.

### Phase 19: Full Frontend Decoupling
**Status**: ⬜ Not Started
**Objective**: Refactor `CoastalGallery` and `CoastalHero` to consume data exclusively from Supabase, removing local asset references.

### Phase 20: Asset Removal & Final Audit
**Status**: ⬜ Not Started
**Objective**: Delete migrated local assets from `/public/images/` and perform a final performance audit.
