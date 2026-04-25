# ROADMAP.md

> **Current Milestone**: v1.2 — Dynamic Admin Image Management
> **Goal**: Full autonomy for the administrator to manage visual content without technical intervention.

## Current Position
- **Milestone**: v1.2 — Dynamic Admin Image Management
- **Phase**: Not started
- **Status**: Milestone planned

## Must-Haves
- [ ] DB ↔ Storage consistency (Cleanup logic for orphan files).
- [ ] Secure upload/delete with Admin roles and destructive action validation.
- [ ] Configurable image processing (optional compression).
- [ ] Persistent reordering with conflict resolution.
- [ ] Public-facing integration with caching/revalidation strategy.

## Phases

### Phase 11: Infrastructure & Consistency Strategy
**Status**: ✅ Complete
**Objective**: Set up Supabase Storage and DB schema with consistency logic for failure handling.

**Tasks**:
- [ ] Create Supabase Storage buckets and RLS policies.
- [ ] Define `images` table schema (category, priority, metadata).
- [ ] Implement consistency layer (Cleanup service for Storage-DB mismatches).

### Phase 12: Admin Dashboard & CRUD Security
**Status**: ⬜ Not Started
**Objective**: Build secure image management UI with role-based validation.

**Tasks**:
- [ ] Implement Admin role validation for all image endpoints.
- [ ] Build Image Gallery view with deletion confirmation.
- [ ] Add server-side validation for destructive operations.

### Phase 13: Flexible Upload System
**Status**: ⬜ Not Started
**Objective**: Implement multi-file upload with optional client-side optimization.

**Tasks**:
- [ ] Build multi-file picker with progress tracking.
- [ ] Implement toggleable client-side compression.
- [ ] Server-side metadata validation and processing.

### Phase 14: Persistent Reordering
**Status**: ⬜ Not Started
**Objective**: Implement Drag & Drop UI with a robust background persistence strategy.

**Tasks**:
- [ ] Integrate Drag & Drop library (e.g., dnd-kit).
- [ ] Implement Optimistic UI updates with background sync.
- [ ] Handle order conflicts (gap-based indexing or similar).

### Phase 15: Public Integration & Performance
**Status**: ⬜ Not Started
**Objective**: Connect public carousels with dynamic data and caching strategies.

**Tasks**:
- [ ] Refactor carousels to consume dynamic image API.
- [ ] Implement Next.js revalidation (tags/time-based).
- [ ] Optimize image delivery (Next/Image + CDN headers).
