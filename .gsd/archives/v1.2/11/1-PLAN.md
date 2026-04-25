---
phase: 11
plan: 1
wave: 1
---

# Plan 11.1: Database Schema & Storage Setup

## Objective
Configure the database and storage infrastructure to support dynamic image management with built-in security and categorization.

## Context
- .gsd/SPEC.md
- .gsd/phases/11/RESEARCH.md
- Supabase project credentials (environment)

## Tasks

<task type="auto">
  <name>Create SQL Migration for Images</name>
  <files>supabase/migrations/20260425000000_create_images_table.sql</files>
  <action>
    Create a new migration file to define the `images` table and RLS policies.
    - Table: `images` with `id`, `url`, `storage_path`, `category`, `priority`, `metadata`.
    - Enable RLS: `SELECT` for public, `ALL` for authenticated admins.
    - Add a trigger for `updated_at`.
  </action>
  <verify>ls supabase/migrations/*.sql</verify>
  <done>Migration file exists with correct schema and RLS policies.</done>
</task>

<task type="auto">
  <name>Storage Bucket & RLS Configuration</name>
  <files>supabase/migrations/20260425000001_storage_setup.sql</files>
  <action>
    Define RLS policies for the `storage.objects` table targeting the `carousel-images` bucket.
    - Public access to `SELECT` (read images).
    - Restricted access to `INSERT`, `UPDATE`, `DELETE` (authenticated admin only).
    - Ensure the bucket name is consistent across tasks.
  </action>
  <verify>grep "carousel-images" supabase/migrations/20260425000001_storage_setup.sql</verify>
  <done>Storage RLS policies defined for the correct bucket.</done>
</task>

## Success Criteria
- [ ] Database schema allows categorizing images by 'property', 'amenities', or 'featured'.
- [ ] RLS prevents non-admin users from modifying images.
- [ ] Migration files are ready for deployment.
