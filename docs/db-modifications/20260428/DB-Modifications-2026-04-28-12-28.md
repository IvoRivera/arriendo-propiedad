# 📝 Registro de Modificaciones: Sistema de Roles Profesional (RBAC)

**Fecha:** 2026-04-28 12:28
**Arquitecto:** Supabase Auth Architect (Antigravity)

---

## 1. Arquitectura de Autenticación Profesional

Se ha migrado el sistema de validación de administrador de una lista blanca manual (`ALLOWED_ADMIN_EMAILS`) a un sistema de **Roles basados en Claims de JWT**.

### Problemas de la Arquitectura Anterior:
- **Latencia**: La función `is_admin()` realizaba una sub-query a `system_config` en cada comprobación de RLS, penalizando el rendimiento.
- **Fragilidad**: La seguridad dependía de una entrada de texto en una tabla de configuración pública.
- **Mantenibilidad**: No permitía gestionar múltiples roles ni persistir datos de perfil.

---

## 2. Nueva Estructura RBAC

Se implementó un sistema de perfiles sincronizado con los metadatos de Supabase Auth.

### Componentes:
1.  **Tabla `profiles`**: Almacena el rol (`admin` o `user`) de cada usuario de forma persistente.
2.  **Custom JWT Claims**: Se utiliza un trigger (`handle_role_sync`) que inyecta automáticamente el rol en el campo `app_metadata` del usuario en Supabase Auth. Esto permite que el rol esté disponible en el token JWT del navegador.
3.  **Optimización RLS**: La función `is_admin()` ahora valida el rol directamente desde el JWT (`auth.jwt()`), eliminando por completo la necesidad de consultar la base de datos durante las comprobaciones de seguridad.

---

## 3. Cambios Implementados (SQL)

- **Tipo Enum**: `user_role` ('admin', 'user').
- **Triggers**: 
    - `on_auth_user_created`: Crea un perfil automáticamente al registrarse.
    - `on_profile_role_update`: Sincroniza cambios de rol al JWT en tiempo real.
- **Migración de Datos**: Se identificaron los usuarios actuales cuyo email coincidía con la lista blanca y se les asignó el rol `admin` en la nueva tabla `profiles`.

---

## 4. Plan de Rollback

En caso de fallo crítico en la sesión de los usuarios:
1.  Ejecutar `CREATE OR REPLACE FUNCTION is_admin() ...` con la lógica anterior basada en `system_config`.
2.  Los tokens JWT actuales no tendrían el claim, por lo que el fallback a la tabla aseguraría la continuidad.
3.  Eliminar los triggers `on_profile_role_update` y `on_auth_user_created`.
