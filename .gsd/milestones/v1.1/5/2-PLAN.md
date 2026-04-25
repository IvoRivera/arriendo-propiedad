---
phase: 5
plan: 2
wave: 1
---

# Plan 5.2: Mejorar Carruseles de Imágenes

## Objective
Resolver los problemas actuales del carrusel de imágenes (especialmente en mobile) agregando navegación clara (flechas/puntos) y mejorando la experiencia del lightbox (botón cerrar grande, swipe to close, tap outside).

## Context
- .gsd/SPEC.md
- src/components/coastal/GalleryCarousel.tsx

## Tasks

<task type="auto">
  <name>Agregar navegación (flechas y puntos/contador)</name>
  <files>src/components/coastal/GalleryCarousel.tsx</files>
  <action>
    - Implementar botones visibles de "Anterior" y "Siguiente" superpuestos en las imágenes (o debajo de ellas).
    - Agregar indicadores de posición (dots o un contador tipo "1 / 8").
    - Asegurar que estos elementos sean grandes y fáciles de tocar en mobile.
  </action>
  <verify>npm run lint && npm run build</verify>
  <done>El carrusel muestra flechas de navegación y un indicador visual de la imagen actual.</done>
</task>

<task type="auto">
  <name>Mejorar UX del Lightbox (Cerrar)</name>
  <files>src/components/coastal/GalleryCarousel.tsx</files>
  <action>
    - Hacer el botón de cierre (X) grande, con buen contraste (ej. fondo semitransparente oscuro) y ubicado en una zona de fácil acceso (ej. top right).
    - Permitir cerrar el lightbox al hacer clic en el fondo oscuro (backdrop) fuera de la imagen.
    - Opcional: Implementar lógica básica de swipe down para cerrar (usando react-use-gesture o Framer Motion drag).
  </action>
  <verify>npm run lint && npm run build</verify>
  <done>El lightbox se puede cerrar tocando fuera de la imagen y el botón (X) es prominentemente visible.</done>
</task>

## Success Criteria
- [ ] Carrusel tiene navegación clara (prev/next y dots/contador).
- [ ] Lightbox se puede cerrar con tap fuera de la imagen.
- [ ] Botón "X" en Lightbox es grande y contrastante.
