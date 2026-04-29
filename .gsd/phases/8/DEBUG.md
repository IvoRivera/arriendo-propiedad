---
status: investigating
trigger: "al ponerlo de lado se pueda ver ampliada la imagen, pero en su lugar solo se hace mas pequeña, y tampoco me permite hacer zoom"
created: 2026-04-29T19:15:00Z
updated: 2026-04-29T19:15:00Z
---

## Current Focus
hypothesis: The `object-contain` and `h-full` constraints on mobile landscape make portrait images look small. Additionally, lack of touch gesture handling prevents pinch-to-zoom.
test: Implement a gesture-based zoom (pinch) and potentially adjust scaling behavior for landscape.
expecting: Images can be zoomed with fingers, and landscape mode feels more "filled".
next_action: Add pinch-to-zoom logic using Framer Motion and state.

## Symptoms
expected: In landscape, the image should use the available height/width effectively. Pinch-to-zoom should allow detailed viewing.
actual: Image shrinks in landscape (likely due to object-contain constraints). Pinch gestures are ignored.

## Evidence
- `Lightbox.tsx:130` uses `drag="x"`, which might consume touch events.
- No `scale` state or pinch handling in the component.
- `object-contain` preserves aspect ratio but on narrow height (landscape mobile), portrait images become small.
