---
phase: 18
plan: 1
wave: 1
---

# Plan 18.1: Service Layer & Types Hardening

## Objective
Update the `ImageService` to provide categorized data and ensure strict typing for images.

## Context
- src/services/image-service.ts
- src/lib/supabase.ts

## Tasks

<task type="auto">
  <name>Refactor ImageService Types</name>
  <files>src/services/image-service.ts</files>
  <action>
    Define a strict `DbImage` interface that matches the Supabase schema.
    - Fields: `id`, `url`, `category`, `priority`, `metadata`, `created_at`.
    - Replace `any[]` with `DbImage[]`.
  </action>
  <verify>grep "interface DbImage" src/services/image-service.ts</verify>
  <done>ImageService uses strict types instead of any.</done>
</task>

<task type="auto">
  <name>Implement Categorized Fetching</name>
  <files>src/services/image-service.ts</files>
  <action>
    Add a helper or update `getPublicImages` to return images grouped by category.
    - Goal: Reduce logic needed in frontend components.
  </action>
  <verify>grep "getPublicImages" src/services/image-service.ts</verify>
  <done>Service layer provides data in a structured format.</done>
</task>

## Success Criteria
- [ ] No `any` types in `ImageService`.
- [ ] Service layer correctly fetches and groups data from Supabase.
