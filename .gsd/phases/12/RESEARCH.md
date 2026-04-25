# Research: Admin Dashboard & CRUD Security (Phase 12)

## Objective
Extend the existing admin dashboard to include a secure image management interface.

## Findings

### 1. Existing Admin Structure
- **Location**: `src/app/admin/page.tsx`.
- **Navigation**: Uses a button group to toggle `activeView` state (`inbox`, `availability`, `config`, `pricing`).
- **Auth**: Uses `supabaseAdmin` to check the session. If no session, redirects to `/admin/login`.
- **Components**: UI blocks are abstracted into components like `SystemConfigPanel`, `DateBlockingManager`, and `PricingManager`.

### 2. Integration Strategy
- **New View**: Add `'images'` to the `activeView` union type.
- **Navigation**: Add an "Imágenes" button to the header navigation bar.
- **Component**: Create `src/components/admin/ImageManager.tsx` to handle the gallery, categorization, and deletion.

### 3. Security & Validation
- **Client-side**: Ensure the `ImageService` calls are only made when the user is authenticated (already handled by the admin page wrapper).
- **Destructive Actions**: Use `window.confirm` or a custom modal for deletions.
- **Server-side (RLS)**: The migration in Phase 11 already ensures only authenticated users can modify the `images` table and `carousel-images` bucket.

### 4. Admin Roles
- The current implementation redirects to login if no session exists.
- `supabaseAdmin` is used, which suggests administrative privilege is required for the session to be valid for these operations.

## Decisions
- **Tab Name**: "Imágenes".
- **Icon**: `Image` or `Camera` from `lucide-react`.
- **Component Placement**: `src/components/admin/ImageManager.tsx`.
