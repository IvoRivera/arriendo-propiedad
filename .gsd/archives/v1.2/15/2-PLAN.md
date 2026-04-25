---
phase: 15
plan: 2
wave: 1
---

# Plan 15.2: Public UI Dynamic Integration

## Objective
Update the public-facing carousels to use the dynamic data from the database, while maintaining mock data as a fallback.

## Context
- src/app/page.tsx
- src/components/coastal/CoastalGallery.tsx
- src/services/image-service.ts

## Tasks

<task type="auto">
  <name>Enable Dynamic Data in Home Page</name>
  <files>src/app/page.tsx</files>
  <action>
    Convert the Home page to fetch dynamic images.
    - Since `Home` is a Client Component, we can either:
      a) Fetch data in a Server Component parent and pass it down.
      b) Fetch data in the client (less ideal for SEO/LCP).
    - Choice: Keep `Home` as a Client Component for its complex state, but create a Server Component wrapper `src/app/home-server.tsx` (or update `page.tsx` directly if possible) to fetch images and pass them to the client.
  </action>
  <verify>grep "getPublicImages" src/app/page.tsx</verify>
  <done>Home page receives dynamic image data from the server.</done>
</task>

<task type="auto">
  <name>Update CoastalGallery with Dynamic Data</name>
  <files>src/components/coastal/CoastalGallery.tsx</files>
  <action>
    Modify `CoastalGallery` to merge dynamic images with mock data.
    - Accept `images` prop.
    - Filter images by category (`property`, `amenities`, `featured`).
    - If dynamic images exist for a category, use them; otherwise, fallback to `galleryData`.
  </action>
  <verify>grep "images?." src/components/coastal/CoastalGallery.tsx</verify>
  <done>Gallery sections display real photos from the admin panel.</done>
</task>

<task type="auto">
  <name>Apply Cache Busting & Optimization</name>
  <files>src/components/coastal/GalleryCarousel.tsx</files>
  <action>
    Ensure images are optimized and bypass old caches.
    - Update `GalleryCarousel` to append `?v=[timestamp]` to Supabase URLs if available.
    - Ensure Next.js `Image` component is used with proper `priority` for above-the-fold content.
  </action>
  <verify>grep "?v=" src/components/coastal/GalleryCarousel.tsx</verify>
  <done>Public images are performant and stay fresh.</done>
</task>

## Success Criteria
- [ ] Public site displays images uploaded via the admin panel.
- [ ] Correct categories are mapped (Property -> Interiors, etc).
- [ ] Fallback to mock data works if the database is empty.
