## Session: 2026-04-25 10:35

### Objective
Debug and resolve multiple issues related to image management: reordering persistence, Next.js hostname configuration, and robust rendering to prevent console errors.

### Accomplished
- **Image Reordering**: Identified that `.upsert()` requires all `NOT NULL` columns. Fixed `ImageManager.tsx` to pass full objects.
- **Hostname Config**: Added Supabase domain to `next.config.ts` remote patterns.
- **Robustness**: Patched 5+ components to handle empty `src`, missing `alt`, and invalid image arrays.
- **Landing Fix**: Corrected data transformation in `CoastalGallery.tsx` from `string[]` to `CarouselImage[]`.

### Verification
- [x] Configuración de Next.js para Supabase.
- [x] Validación de `src` y `alt` en componentes.
- [x] Mapeo de categorías y estructura en `CoastalGallery`.
- [ ] Verificación final por parte del usuario en el navegador.

### Paused Because
User requested pause / Session objective reached.

### Handoff Notes
The system is now robust against bad data and correctly configured for external images. If carousels still appear empty, verify that there is actually data in the `images` table for the corresponding categories.
