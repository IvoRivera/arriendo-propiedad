# Research: Infrastructure & Consistency Strategy (Phase 11)

## Objective
Establish a reliable storage and database foundation for dynamic image management, ensuring no orphaned files and secure access.

## Findings

### 1. Supabase Storage Setup
- **Bucket**: Create a public bucket `carousel-images` (or keep private if using signed URLs, but for public carousels, public bucket is more efficient).
- **RLS**: 
  - `SELECT`: Public (if public bucket) or Authenticated.
  - `INSERT/UPDATE/DELETE`: `service_role` or specific Admin check in RLS (e.g., `auth.jwt() ->> 'role' = 'admin'`).

### 2. Database Schema (`images`)
```sql
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL, -- 'property', 'amenities', 'featured'
  priority INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 3. Consistency Strategy
- **Source of Truth**: The `images` table.
- **Atomic-ish Flow**:
  1. Upload to Storage.
  2. Insert to DB.
  3. If DB insert fails, delete from Storage immediately (client-side attempt).
- **The Reaper (Orphan Cleanup)**:
  - Since this is a low-traffic admin-only feature, a simple cleanup script or Edge Function is preferred.
  - Logic: Find files in `storage.objects` under `carousel-images/` that are NOT in `images.storage_path`.
  - Safety: Only delete files older than 24 hours to avoid deleting files currently being uploaded.

### 4. Admin Role Verification
- Verify that `auth.users` has a metadata field or role for `admin`.
- In Next.js, use Middleware or Server Component checks.

## Decisions
- **Bucket**: Public `carousel-images`.
- **Reordering**: Dense integer `priority` field.
- **Consistency**: Immediate client-side cleanup + Weekly "Reaper" Edge Function.
