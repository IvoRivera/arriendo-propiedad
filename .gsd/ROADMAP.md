# ROADMAP.md

> **Current Milestone**: v1.7 — SAFE REFACTOR + MOCKDATA MIGRATION (CRÍTICO)
> **Goal**: Realizar un refactor estructural + limpieza de código, eliminando la dependencia de `mockData.ts` mediante la migración completa a fuentes de datos reales (Supabase) o configuración estática tipada (`site-content.ts`), sin alterar la UI/UX ni el sistema Coastal.

## Reglas Críticas
- **Ningún dato debe desaparecer**: Todo debe ser reubicado explícitamente.
- **Verificación Visual Inmediata**: Cada cambio debe ser verificable en la landing al instante.
- **Coastal UI Intacta**: Prohibido alterar estructura JSX o clases Tailwind.

## Must-Haves
- [ ] Mapeo exhaustivo de imports (directos e indirectos).
- [ ] `src/config/site-content.ts` con tipado estricto.
- [ ] Migración progresiva de `mockData.ts`.
- [ ] `grep -r "mockData" src` vacío antes de finalizar.
- [ ] Validación funcional total (Pricing, Images, Render).

## Fases

### Fase 33: Descubrimiento y Base de Site Content
**Status**: ✅ Complete
**Objective**: Mapear propiedades de `mockData` a sus destinos y crear la estructura base de `SITE_CONTENT`.
- **Restricción**: NO mover lógica, solo datos.

### Fase 34: Migración de Contenido Estático
**Status**: ✅ Complete
**Objective**: Migrar contenido editorial (hero, amenities) manteniendo props y JSX intactos.
- **Restricción**: Prohibido reestructurar componentes.

### Fase 35: Refactor de Datos Estructurales y Dinámicos
**Status**: ✅ Complete
**Objective**: Reemplazar datos de `mockData` con equivalentes en Supabase o servicios existentes.
- **Regla**: No duplicar fuentes (Config + DB).

### Fase 36: Limpieza de Componentes y Dependencias
**Status**: ✅ Complete
**Objective**: Reemplazar imports residuales y verificar ausencia de "mockData" en el código.

### Fase 37: Verificación Final y Limpieza Técnica
**Status**: ✅ Complete
**Objective**: Eliminar `mockData.ts` y limpiar código muerto (imports, funciones, archivos duplicados).
