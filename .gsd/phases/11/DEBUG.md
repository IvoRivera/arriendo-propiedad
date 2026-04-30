---
status: investigating
trigger: "debemos alejarnos del botón gigante que compite con las fotos principales y volver a la idea de una transición sutil."
created: 2026-04-30T10:44:00Z
updated: 2026-04-30T10:44:00Z
---

## Current Focus
hypothesis: The "climax" block is too heavy. Moving the CTA inside the last image with a fade-out effect will improve visual continuity.
test: Refactor EditorialGallery.tsx to use "Revelación Progresiva" concept.
expecting: A more subtle, premium transition to the rest of the page.
next_action: Refactor EditorialGallery.tsx.

## Symptoms
expected: A subtle invitation to see more photos.
actual: A large, competitive block that stops the scroll flow.
errors: None (design feedback).

## Eliminated
- hypothesis: Full-width immersive block is the best climax.
  evidence: User feedback states it competes with photos and breaks flow.

## Evidence
- checked: EditorialGallery.tsx implementation.
  found: Large button block at the bottom.
  implication: Needs to be integrated into the last image.
