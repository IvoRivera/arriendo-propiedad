# ROADMAP.md

> **Current Milestone**: v1.6 — Integridad de Schema y Runtime Guards
> **Goal**: Garantizar la confiabilidad del sistema mediante la implementación de validación explícita de esquema y "guards" en tiempo de ejecución para prevenir fallos silenciosos en módulos críticos.

## Must-Haves
- [ ] Utilidad centralizada `SchemaValidator` que consulte `information_schema`.
- [ ] Integración de validaciones en el `PricingService`.
- [ ] Runtime guards para los servicios de disponibilidad e imágenes.
- [ ] Logging estructurado para inconsistencias de esquema.
- [ ] Checklist de verificación post-migración obligatorio.

## Phases

### Fase 28: Base de Validación de Schema
**Status**: ⬜ Not Started
**Objective**: Implementación de la capa core para verificar la existencia de tablas y columnas críticas.
**Tasks**:
- [ ] Crear utilidad `SchemaValidator` para consultas a `information_schema.columns`.
- [ ] Definir mapa de columnas críticas para tablas: `properties`, `price_overrides`, `images`, `bookings`.
- [ ] Implementar middleware o guard global de inicialización (opcional/según arquitectura).

### Fase 29: Guards de Resiliencia en Pricing
**Status**: ⬜ Not Started
**Objective**: Seguridad en el motor de precios contra columnas faltantes o datos inconsistentes.
**Tasks**:
- [ ] Integrar `SchemaValidator` en `fetchPricingData`.
- [ ] Implementar logs estructurados `[PricingAPI]` ante fallos de schema.
- [ ] Asegurar que el motor falle explícitamente si falta `property_id` o reglas base.

### Fase 30: Integridad en Disponibilidad y Reservas
**Status**: ⬜ Not Started
**Objective**: Validación de esquema para la lógica de calendario y el flujo de creación de reservas.
**Tasks**:
- [ ] Validar integridad de tabla `bookings` y `availability` antes de cálculos.
- [ ] Prevenir inserciones si el schema de la tabla no coincide con el modelo esperado.

### Fase 31: Guards de Imágenes y Metadatos
**Status**: ⬜ Not Started
**Objective**: Asegurar que el sistema de imágenes falle de forma controlada ante inconsistencias.
**Tasks**:
- [ ] Validar columnas de metadatos y categorías en la tabla `images`.
- [ ] Implementar fallback o error explícito en el admin de imágenes si el schema está incompleto.

### Fase 32: Flujo de Verificación y Manejo de Errores
**Status**: ⬜ Not Started
**Objective**: Estandarización de mensajes de error y finalización de la checklist de migración.
**Tasks**:
- [ ] Crear `MIGRATION_CHECKLIST.md` con los pasos obligatorios.
- [ ] Unificar formato de logs de error de schema.
- [ ] Verificación final de integridad en todo el sistema.
