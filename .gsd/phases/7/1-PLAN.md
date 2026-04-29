---
phase: 7
plan: 1
wave: 1
---

# Plan 7.1: Custom Smooth Scroll Implementation

## Objective
Implement a premium ease-in-out scroll animation for the "Explorar disponibilidad" button to replace the snappy default behavior.

## Context
- .gsd/SPEC.md
- .gsd/ROADMAP.md
- src/app/home-client.tsx
- src/app/globals.css

## Tasks

<task type="auto">
  <name>Update globals.css to allow JS-driven scroll</name>
  <files>src/app/globals.css</files>
  <action>
    Modify the `html` selector to only apply `scroll-behavior: smooth` if no-preference or as a fallback, but we'll primarily control it via JS now to avoid double-animations. Actually, we should keep it but ensure JS can override it or just remove it if we want full control.
    - Change `scroll-behavior: smooth` to be conditional or removed to let Framer Motion handle it precisely.
  </action>
  <verify>Check that the file no longer forces smooth scroll at the HTML level.</verify>
  <done>scroll-behavior: smooth removed from src/app/globals.css</done>
</task>

<task type="auto">
  <name>Implement smoothScrollTo in HomeClient</name>
  <files>src/app/home-client.tsx</files>
  <action>
    1. Import `animate` from `framer-motion`.
    2. Replace the `scrollToId` function with a `framer-motion` driven animation.
    3. Use a custom easing `[0.65, 0, 0.35, 1]` and a duration of `1.5s`.
    4. Ensure the animation targets the center of the block as before, or slightly offset for better visibility.
  </action>
  <verify>Click the button in the Hero and check the scroll animation feel.</verify>
  <done>scrollToId uses framer-motion animate with ease-in-out easing.</done>
</task>

## Success Criteria
- [ ] Clicking "Explorar disponibilidad" results in a smooth, non-snappy scroll.
- [ ] The scroll has a visible "slow start, fast middle, slow end" characteristic.
- [ ] The landing position is correct (availability section centered).
