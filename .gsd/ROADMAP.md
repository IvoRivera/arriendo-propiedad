# ROADMAP.md

> **Current Milestone**: v1.6 — Integridad de Schema y Runtime Guards
> **Goal**: Garantizar la confiabilidad del sistema mediante la implementación de validación explícita de esquema y "guards" en tiempo de ejecución para prevenir fallos silenciosos en módulos críticos.

## Must-Haves
- [x] Utilidad centralizada `SchemaValidator` que consulte `information_schema`.
- [x] Integración de validaciones en el `PricingService`.
- [x] Runtime guards para los servicios de disponibilidad e imágenes.
- [x] Logging estructurado para inconsistencias de esquema.
- [x] Checklist de verificación post-migración obligatorio.

## Phases

### Fase 28: Base de Validación de Schema
**Status**: ✅ Complete
**Objective**: Implementación de la capa core para verificar la existencia de tablas y columnas críticas.

### Fase 29: Guards de Resiliencia en Pricing
**Status**: ✅ Complete
**Objective**: Seguridad en el motor de precios contra columnas faltantes o datos inconsistentes.

### Fase 30: Integridad en Disponibilidad y Reservas
**Status**: ✅ Complete
**Objective**: Validación de esquema para la lógica de calendario y el flujo de creación de reservas.

### Fase 31: Guards de Imágenes y Metadatos
**Status**: ✅ Complete
**Objective**: Asegurar que el sistema de imágenes falle de forma controlada ante inconsistencias.

### Fase 32: Flujo de Verificación y Manejo de Errores
**Status**: ✅ Complete
**Objective**: Estandarización de mensajes de error y finalización de la checklist de migración.
