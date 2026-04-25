# SPEC.md — Project Specification

> **Status**: FINALIZED

## Vision
Garantizar la consistencia entre base de datos, backend y frontend mediante un sistema de validación de schema y sincronización, evitando errores silenciosos en producción (como pricing roto o datos incompletos). El sistema debe ser resiliente a cambios de modelo de datos, especialmente en un entorno multi-propiedad con lógica dinámica.

## Goals
1. **Data Integrity (Core)**: Asegurar que todas las tablas, columnas y relaciones necesarias existen y están sincronizadas con el código en runtime.
2. **Schema Validation Layer**: Implementar validaciones automáticas que detecten discrepancias entre el schema esperado y el real.
3. **Error Visibility**: Eliminar fallos silenciosos en APIs (ej. pricing devolviendo vacío sin error claro).
4. **Developer Workflow**: Estandarizar un flujo de migraciones seguro y verificable antes de considerar cambios como “completos”.
5. **Backend Resilience**: Asegurar que endpoints críticos (pricing, availability, images) fallen de forma explícita y controlada si hay inconsistencias.
6. **Scalability Support**: Preparar el sistema para cambios frecuentes de schema sin romper funcionalidades existentes.

## Non-Goals (Out of Scope)
- **Full Migration Framework**: No se implementará un sistema complejo de versionado automático de migraciones.
- **Auto-healing Database**: El sistema no modificará automáticamente la base de datos, solo detectará inconsistencias.
- **Frontend Refactor**: No se abordarán cambios de UI fuera de validaciones necesarias.

## Users
- **Owner/Admin (Developer Mode)**: Necesita detectar rápidamente errores de schema y evitar bugs en producción.
- **System (Runtime)**: Debe validar integridad de datos antes de ejecutar lógica crítica.

## Constraints
- **Tech Stack**: Next.js 15 (App Router), Supabase (PostgreSQL), TypeScript.
- **Environment**: Desarrollo rápido con cambios frecuentes en schema.
- **Requirement**: Bajo overhead, sin introducir complejidad excesiva.

## System Components
1. **Schema Validation Layer**
   - Validación al iniciar endpoints críticos (/api/public/pricing, /availability, etc.)
   - Verificación de existencia de columnas clave (ej: property_id)
   - Uso de `information_schema.columns` para checks

2. **Runtime Guards (Backend)**
   - Validaciones defensivas en servicios: pricing engine, image service, availability logic
   - Logs explícitos en consola cuando hay inconsistencias
   - Prevención de respuestas vacías sin explicación

3. **Migration Verification Workflow**
   - Checklist obligatorio antes de considerar una migración como válida:
     - Ejecutar SQL en Supabase
     - Verificar columnas con `information_schema`
     - Probar endpoint afectado
     - Confirmar respuesta correcta en frontend

4. **Error Handling Strategy**
   - Reemplazar errores silenciosos por:
     - logs estructurados ([PricingAPI], [SchemaGuard])
     - mensajes claros en desarrollo
   - Evitar `catch {}` vacíos

5. **Critical Tables Coverage**
   - El sistema debe validar integridad mínima en:
     - properties
     - price_overrides
     - seasonal_pricing
     - images
     - bookings

## Key Principle
“El sistema nunca debe asumir que el schema es correcto — debe verificarlo o fallar explícitamente.”

## Expected Outcome
- Eliminación de bugs por migraciones incompletas
- APIs que fallan de forma clara en vez de silenciosa
- Reducción drástica de tiempo de debugging
- Mayor confianza al escalar el sistema (multi-propiedad, pricing dinámico, etc.)

## Success Criteria
- [ ] El sistema detecta automáticamente columnas faltantes en runtime
- [ ] APIs críticas no devuelven datos vacíos sin logging explícito
- [ ] Existe un flujo claro de validación post-migración
- [ ] Errores de schema se detectan antes de afectar frontend
- [ ] No vuelven a ocurrir bugs por “query no ejecutada” o schema incompleto
- [ ] Logs permiten identificar problemas en menos de 1 minuto
- [ ] Pricing y availability nunca operan sobre datos incompletos