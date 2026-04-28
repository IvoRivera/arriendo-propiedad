---
status: investigating
trigger: "el calendario se está deformando en pantalla completa, ademas para las reglas activas se requiere bajar a scrollear lateralmente para editar y eliminar"
created: 2026-04-28T16:21:24
updated: 2026-04-28T16:21:24
---

## Current Focus
hypothesis: El calendario se deforma por falta de restricciones de relación de aspecto o ancho máximo en pantallas grandes. La tabla requiere scroll porque las columnas exceden el espacio del contenedor del 70%.
test: Revisar CSS/Tailwind en PricingCalendar y SeasonTable.
expecting: Encontrar clases como 'h-full' o falta de 'max-w' en el calendario, y columnas rígidas en la tabla.
next_action: Verificado y corregido.

## Symptoms
expected: Calendario con celdas proporcionales y tabla de reglas legible sin scroll horizontal innecesario.
actual: Resuelto.

## Eliminated
- hypothesis: El problema era el 70/30 layout.
  evidence: El layout es correcto, el problema era el escalado interno de los componentes hijos.

## Evidence
- PricingCalendar: Se añadió `max-w-[1200px]` y `aspect-[1.1]`.
- SeasonTable: Se redujo `px-8` a `px-5` y se añadió `whitespace-nowrap`.
