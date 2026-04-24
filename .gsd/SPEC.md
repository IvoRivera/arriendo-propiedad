# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision
Optimizar la experiencia de reserva del sitio (mobile-first) alineando el flujo a un modelo basado en formulario (no WhatsApp), aumentando claridad, control sobre el huésped y reduciendo fricción y errores. A la vez, mantener un tono humano, claro y sin agresividad, integrando reglas e inventario de forma natural.

## Goals
1. **UX/UI (Front-end)**: Cambiar narrativa a "Solicitud de reserva", mejorar navegación y cierre de carruseles de imágenes (mobile/desktop), y restaurar estado de carga emocional antes del formulario.
2. **Reglas de Negocio**: Límite estricto de 4 huéspedes y visualización preventiva de disponibilidad sin romper el flujo.
3. **Reglas de Alojamiento**: Presentación clara de reglas, aceptación obligatoria (checkbox), y filtros anti-fiesta (ej. pedir "Motivo del viaje").
4. **Sistema de Inventario**: Flujo de inventario pre y post estadía para proteger activos mediante confirmación del huésped al check-in y revisión al check-out.
5. **Consideraciones Técnicas**: Optimización mobile-first (inputs grandes), estados del sistema claros (Loading, Error, Success), persistencia de datos (Supabase) y contenido editable a futuro.
6. **Sistema de Precios Dinámicos**: Implementar precios variables por temporada y fechas especiales gestionables desde el admin.

## Non-Goals (Out of Scope)
- **Instant Payment Integration**: Pagos continúan siendo externos/manuales en esta fase; el sistema se preparará para ellos pero no los ejecuta.
- **Multi-Property Support**: Sistema diseñado para un solo departamento.

## Users
- **Guests**: Viajeros buscando descanso y desconexión, que aprecian una experiencia fluida y transparente.
- **Owner**: Administrador que requiere validación de huéspedes, aceptación de reglas y control de inventario.

## Constraints
- **Tech Stack**: Next.js 15 (App Router), Supabase, Framer Motion, Resend.
- **UX Requirement**: Tono humano y amigable, no legal ni hostil.

## Success Criteria
- [ ] No existen referencias a contacto vía WhatsApp para iniciar la reserva.
- [ ] Carruseles tienen navegación clara y botón de cerrar visible/funcional en mobile (swipe/tap).
- [ ] Flujo muestra pantalla de carga emocional antes del formulario.
- [ ] Límite de 4 huéspedes aplicado y disponibilidad visible antes de enviar.
- [ ] Reglas aceptadas obligatoriamente y motivo de viaje capturado.
- [ ] Sistema de confirmación de inventario funcional para el check-in.
- [ ] Precios dinámicos por temporada se reflejan en el calendario y cálculo de reserva.
- [ ] El precio queda congelado en la solicitud de reserva.
