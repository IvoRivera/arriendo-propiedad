---
phase: 6
plan: 1
wave: 1
---

# Plan 6.1: Sticky CTA Transition Experience

## Objective
Implement a premium scroll-triggered transition for the "Explorar Disponibilidad" button, turning it into a minimalist sticky CTA at the bottom of the screen as the user scrolls away from the Hero section.

## Context
- `src/app/home-client.tsx`: Main page logic and floating button container.
- `src/components/coastal/CoastalHero.tsx`: Source of the primary CTA.
- `framer-motion`: For fluid layout and state transitions.

## Tasks

<task type="auto">
  <name>Refactor Floating CTA Trigger Logic</name>
  <files>
    <file>src/app/home-client.tsx</file>
  </files>
  <action>
    - Replace the hardcoded `600px` scroll threshold with a more dynamic logic.
    - Improve the `showFloating` logic to trigger exactly when the Hero button leaves the viewport.
    - Ensure the floating button is hidden when the user is at the very bottom (Footer CTA visible).
  </action>
  <verify>Scroll down until the Hero button disappears; the floating button should appear immediately.</verify>
  <done>Floating button visibility is synced with Hero button visibility.</done>
</task>

<task type="auto">
  <name>Redesign & Animate Floating CTA</name>
  <files>
    <file>src/app/home-client.tsx</file>
  </files>
  <action>
    - Update the floating button's design to be more "minimalist" and "premium":
      - Use a slim, elegant pill shape.
      - Refine the gradient and shadow to match the project's premium aesthetic.
      - Center it at the bottom of the screen for better reachability on mobile.
    - Enhance the animation:
      - Use a "pop" or "morph" transition.
      - Add subtle micro-animations (e.g., pulse or hover scaling).
  </action>
  <verify>Visual check of the new button design and transition animation.</verify>
  <done>Sticky button is minimalist, centered at the bottom, and has a premium animation.</done>
</task>

## Success Criteria
- [ ] Hero CTA transitions smoothly into a sticky mini-CTA upon scrolling.
- [ ] Sticky CTA is centered at the bottom and easily clickable.
- [ ] Animation feels premium and intentional.
- [ ] Sticky CTA disappears when the Footer CTA is in view.
