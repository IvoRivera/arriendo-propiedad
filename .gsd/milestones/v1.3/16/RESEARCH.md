# Research: Static Asset Mapping (Phase 16)

## Objective
Map the current static images in `public/images/` and `mockData.ts` to a structure that can be migrated to the Supabase database.

## Findings

### 1. Categories Mapping
The current project uses these categories in `mockData.ts`, which should be mapped to the `ImageCategory` type in our service:
- `featured` (Destacadas) -> `featured`
- `interiors` (El Departamento) -> `property`
- `amenities` (Amenidades) -> `amenities`

### 2. Data Structure
Each image in `mockData.ts` has:
- `src`: Path in `/public`
- `alt`: Descriptive text

Example:
```typescript
{ src: "/images/destacadas/01-living.webp", alt: "Vista del living y terraza" }
```

### 3. Migration Logic
A script should:
1. Read `src/data/mockData.ts`.
2. For each category:
   - Loop through `images`.
   - Read local file from `public/images/...`.
   - Upload to Supabase Storage bucket `carousel-images`.
   - Insert into `images` table with:
     - `category`: mapped category.
     - `url`: Supabase public URL.
     - `storage_path`: path in bucket.
     - `priority`: index + 1.
     - `metadata`: `{ alt: item.alt }`.

### 4. Technical Constraints
- The `ImageService` already has `uploadImage`, but it takes a `File` object (browser).
- The migration script will run in Node.js, so it needs to use `fs` and the `supabaseAdmin` client directly.
- Next.js 15 requires specific handling for server-side scripts if they import from `@/` aliases.

## Decisions
- Create `scripts/migrate-static-images.ts` using `ts-node` or `tsx`.
- Use `supabaseAdmin` from `src/lib/supabase.ts`.
- Ensure the script is idempotent (don't upload the same file twice or clear the table before starting).
