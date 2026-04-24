---
phase: 5
plan: 1
wave: 1
---

# Plan 5.1: Actualizar Narrativa de Contacto

## Objective
Eliminar todas las referencias a contactar vía WhatsApp e instaurar un flujo orientado a "Solicitud de Reserva". El tono debe indicar "Te contactaremos luego de revisar tu solicitud" para mantener el control y reducir fricción.

## Context
- .gsd/SPEC.md
- src/components/coastal/CoastalHero.tsx
- src/components/coastal/CoastalAvailability.tsx
- src/components/coastal/CoastalWhatsApp.tsx
- src/data/mockData.ts

## Tasks

<task type="auto">
  <name>Remover referencias directas a WhatsApp</name>
  <files>src/components/coastal/CoastalWhatsApp.tsx, src/data/mockData.ts</files>
  <action>
    - Si existe un botón flotante de WhatsApp o CTA directo, desactivarlo o cambiar su narrativa.
    - Modificar textos en `mockData.ts` (ej. `availabilityPrompt`, `ctaText`) para decir "Solicitud de reserva" en lugar de "Contactar" o "WhatsApp".
  </action>
  <verify>grep_search("WhatsApp") en componentes visuales principales (excepto los de admin o emails de confirmación que sí lo usan post-reserva)</verify>
  <done>Textos actualizados y no hay CTAs de "Chat por WhatsApp" para iniciar la reserva.</done>
</task>

<task type="auto">
  <name>Actualizar textos de Botones y Modales</name>
  <files>src/components/coastal/CoastalHero.tsx, src/components/coastal/CoastalAvailability.tsx, src/components/coastal/CoastalRequestModal.tsx</files>
  <action>
    - Cambiar el texto del botón principal en Hero y Availability a "Solicitud de Reserva" o "Solicitar Disponibilidad".
    - En el `CoastalRequestModal`, agregar un mensaje claro que indique: "Te contactaremos luego de revisar tu solicitud".
    - Asegurar que los botones usen íconos de calendario o mail (ej. `Calendar`, `Send`) en vez de `MessageCircle` o logo de WA.
  </action>
  <verify>grep_search("Solicitud de Reserva") en los archivos modificados</verify>
  <done>Todos los CTAs principales usan la nueva narrativa de "Solicitud" y el mensaje post-envío es claro sobre los pasos a seguir.</done>
</task>

## Success Criteria
- [ ] No hay menciones de "WhatsApp" en la UI de inicio (landing page).
- [ ] Botones principales dicen "Solicitud de reserva" o similar.
- [ ] Textos del modal de solicitud indican claramente el proceso ("Te contactaremos...").
