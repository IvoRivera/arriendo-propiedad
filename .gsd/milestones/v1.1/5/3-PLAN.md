---
phase: 5
plan: 3
wave: 2
---

# Plan 5.3: Estado de Carga Emocional

## Objective
Reintroducir un estado intermedio de carga emocional luego de la selección de fechas y antes de mostrar el formulario de solicitud, para generar expectativa positiva y suavizar la transición.

## Context
- .gsd/SPEC.md
- src/components/coastal/CoastalAvailability.tsx
- src/components/coastal/CoastalRequestModal.tsx

## Tasks

<task type="auto">
  <name>Implementar pantalla intermedia de "Preparando"</name>
  <files>src/components/coastal/CoastalRequestModal.tsx</files>
  <action>
    - Crear un estado interno `isPreparing` (boolean) que se active al montar el modal o al recibir fechas.
    - Durante 1.5 - 2.5 segundos, mostrar una pantalla centrada con el texto "Estamos preparando tu estadía..." y un spinner o animación suave.
    - Incluir microcopy emocional (ej. "Verificando disponibilidad frente al mar...").
    - Luego del delay, revelar el formulario real de la solicitud con una transición suave (Framer Motion).
  </action>
  <verify>npm run lint && npm run build</verify>
  <done>Al iniciar una solicitud, el usuario ve una animación de carga de ~2s antes de poder llenar el formulario.</done>
</task>

## Success Criteria
- [ ] Se muestra un loading state emocional ("Estamos preparando tu estadía...").
- [ ] Hay un delay artificial (aprox 2s) para mostrar el formulario.
- [ ] Animaciones suaves acompañan la transición de "carga" a "formulario".
