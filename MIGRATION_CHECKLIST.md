# MIGRATION_CHECKLIST.md

Garantizar la integridad del sistema ante cambios en la base de datos (Supabase/PostgreSQL).

## 1. Fase de Preparación (Local/Dev)
- [ ] Definir los cambios de schema (nuevas tablas, columnas, tipos).
- [ ] Verificar si alguna columna existente será eliminada o renombrada.

## 2. Actualización de Integridad (Código)
- [ ] Actualizar `src/lib/schemaValidator.ts`.
- [ ] Añadir las nuevas tablas/columnas a la constante `CRITICAL_SCHEMA`.
- [ ] Si se renombra una columna, actualizar tanto el mapeo como el código que la consume simultáneamente.

## 3. Ejecución de Migración (Supabase)
- [ ] Ejecutar el SQL en el Editor de Supabase o mediante CLI.
- [ ] **NO** desplegar el código antes de ejecutar el SQL.

## 4. Verificación Post-Migración
- [ ] Ejecutar el script de prueba de integridad (si existe uno actualizado).
- [ ] Verificar logs en busca de errores con el prefijo `[SchemaGuard]`.
- [ ] Probar los endpoints críticos afectados:
    - [ ] `/api/public/pricing` (Pricing)
    - [ ] `/api/public/bookings` (Reservas)
    - [ ] Galería de imágenes (Frontend)

## 5. Cierre
- [ ] Confirmar que no hay alertas de `[SchemaGuard]` en la consola de Vercel/Producción.

---
**Nota**: "El sistema nunca debe asumir que el schema es correcto — debe verificarlo o fallar explícitamente."
