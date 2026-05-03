---
phase: 19
plan: 1
wave: 1
---

# Plan 19.1: Universal Lightbox Zoom Interactions

## Objective
Implement universal zoom interactions (double-click, mouse wheel, and refined pinch-to-zoom) in the Lightbox component so that users can inspect high-resolution gallery images comfortably across desktop and mobile devices.

## Context
- .gsd/SPEC.md
- d:\Proyectos\departamento-ls\src\components\coastal\Lightbox.tsx

## Tasks

<task type="auto">
  <name>Implement Zoom Event Handlers</name>
  <files>
    - d:\Proyectos\departamento-ls\src\components\coastal\Lightbox.tsx
  </files>
  <action>
    Add `onDoubleClick` and `onWheel` event handlers to the Framer Motion image container in `Lightbox.tsx` to control the `scale` MotionValue.
    - `onWheel`: Adjust the scale based on the wheel's `deltaY` (zoom in/out), clamping the value between 1 and 4. Update the `isZoomed` state accordingly.
    - `onDoubleClick`: Toggle the scale between 1 and a zoomed value (e.g., 2.5). Update `isZoomed`.
    - `onTouchMove` / `onTouchStart`: Ensure the existing pinch-to-zoom logic is robust and smooth. 
    - Ensure that when zoomed in, the user can pan around the image using the existing drag properties.
  </action>
  <verify>grep -q "onDoubleClick" src/components/coastal/Lightbox.tsx && grep -q "onWheel" src/components/coastal/Lightbox.tsx</verify>
  <done>Lightbox images zoom seamlessly via double-click and mouse wheel, and the `isZoomed` state toggles panning correctly.</done>
</task>

## Success Criteria
- [ ] Users can double-click an image in the Lightbox to zoom in and out.
- [ ] Users can use the mouse wheel to zoom in and out.
- [ ] Mobile users can pinch to zoom effectively.
- [ ] When zoomed, panning works smoothly and carousel swipe navigation is disabled.
