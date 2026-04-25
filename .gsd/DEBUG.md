---
status: investigating
trigger: "La página perdió estilos... imágenes se renderizan todas al inicio apiladas verticalmente."
created: 2026-04-25T15:15:00
updated: 2026-04-25T15:15:00
---

## Current Focus
hypothesis: Regression in HomeClient.tsx or CoastalHero.tsx caused by recent property-aware changes, possibly a syntax error or a hydration break.
test: Review current content of HomeClient.tsx and CoastalHero.tsx. Check browser logs if possible (via run_command build).
expecting: Identify missing imports or broken JSX structure.
next_action: view_file src/app/home-client.tsx

## Symptoms
- Layout CSS disappeared.
- Images apiladas verticalmente at the top.
- HTML rendering without design.

## Eliminated
- None yet.

## Evidence
- User reports immediate break after "image system changes" (likely referring to the recent multi-property pricing changes which touched images/hero).
