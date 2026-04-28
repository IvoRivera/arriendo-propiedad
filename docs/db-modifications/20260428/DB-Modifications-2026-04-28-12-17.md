# 📝 Registro de Modificaciones: Solución Error 401 Vercel (SSR)

**Fecha:** 2026-04-28 12:17
**Arquitecto:** Senior Next.js + Supabase SSR Engineer (Antigravity)

---

## 1. Diagnóstico del Error 401

### Causa Raíz:
El proyecto utilizaba autenticación basada exclusivamente en **Client-side Storage (localStorage)** y validación manual de cabeceras `Authorization` en el middleware. 
- **Localhost**: Funcionaba porque el middleware (`src/proxy.ts`) omitía las validaciones de seguridad en desarrollo (`process.env.NODE_ENV !== 'production'`).
- **Vercel (Producción)**: El middleware aplicaba la validación. Como los navegadores no envían la cabecera `Authorization` automáticamente en las navegaciones estándar, el middleware devolvía `401 Unauthorized` antes de que la página o la API pudieran procesar el request.

### Problema Técnico:
Falta de soporte para **Supabase SSR (Cookies)**. El middleware no podía leer la sesión del usuario porque esta no persistía en las cookies de forma compatible con el servidor de Next.js.

---

## 2. Acciones Realizadas

### A. Infraestructura SSR:
1.  Instalación de `@supabase/ssr`.
2.  Creación de utilidades en `src/utils/supabase/`:
    - `server.ts`: Cliente para Server Components y Server Actions.
    - `client.ts`: Cliente para Client Components.
    - `middleware.ts`: Lógica de refresco de sesión vía cookies.

### B. Refactorización de Seguridad:
1.  **`src/proxy.ts`**:
    - Se integró `updateSession` para sincronizar cookies de autenticación en cada request.
    - Se cambió la validación de `/admin` y `/api/admin` para usar el usuario obtenido de las cookies.
    - Ahora el middleware es capaz de identificar al administrador sin necesidad de cabeceras manuales.
2.  **`src/lib/adminAuth.ts`**:
    - Se actualizó `verifyAdminRequest` para priorizar la sesión de cookies sobre las cabeceras.

### C. Actualización de Interfaz:
1.  **`LoginPage`**: Ahora usa el cliente SSR para que el login establezca las cookies `sb-*-auth-token`.
2.  **`AdminPage`**: Migrado al cliente SSR para asegurar que las peticiones a la base de datos se realicen con la identidad del usuario persistida en cookies.

---

## 3. Checklist para Vercel

Asegúrate de que las siguientes variables de entorno estén configuradas en el dashboard de Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`: URL de tu proyecto Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Anon key pública.
- `SUPABASE_SERVICE_ROLE_KEY`: Requerida para operaciones de sistema (mantener privada).
- `ALLOWED_ADMIN_EMAILS`: Lista separada por comas (ej: `ivo.rivera.godoy@gmail.com`).
- `INTERNAL_SECRET`: Secreto para comunicación entre servicios internos.

---

## 4. Validación Post-Deploy

1.  Hacer deploy a Vercel.
2.  Acceder a `/admin/login`.
3.  Iniciar sesión.
4.  Si el login redirige a `/admin` y carga los datos sin errores 401 en la consola de red, la migración SSR ha sido exitosa.
5.  Verificar que las cookies del dominio incluyan `sb-wmlfejtymimtpubfsokq-auth-token` (o similar).
