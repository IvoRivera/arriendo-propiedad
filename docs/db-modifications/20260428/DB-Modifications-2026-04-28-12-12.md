# 📝 Registro de Modificaciones en Base de Datos (Supabase)

**Fecha:** 2026-04-28 12:12
**Proyecto:** `arriendo-ls` (gbelcihimvuodnpjwelf)
**Auditor:** Senior Supabase Security Engineer (Antigravity)

---

## 1. Auditoría de Seguridad (Detección)

Se realizó una auditoría profunda de las políticas de Row Level Security (RLS) en la tabla `booking_requests`.

### Hallazgos Críticos:
- **Política `admin_can_read_requests`**: Permitía `SELECT` a cualquier usuario autenticado (`authenticated`) sin verificar si era administrador.
- **Política `admin_can_update_requests`**: Permitía `UPDATE` a cualquier usuario autenticado sin validación de roles.
- **Riesgo**: Fuga de datos de clientes (email, teléfono, nombres) y manipulación de reservas por parte de cualquier usuario registrado.

---

## 2. Modificaciones Realizadas

Se aplicó una migración SQL para endurecer la seguridad y eliminar redundancias inseguras.

### Cambios en RLS (`booking_requests`):
- **ELIMINADO**: `DROP POLICY "admin_can_read_requests" ON "public"."booking_requests"`
- **ELIMINADO**: `DROP POLICY "admin_can_update_requests" ON "public"."booking_requests"`
- **MANTENIDO/ASEGURADO**: 
    - `Admin manage bookings`: Control total (`ALL`) restringido por la función `is_admin()`.
    - `anon_can_insert_requests`: Permite inserción pública (`INSERT`) para el flujo de reserva del huésped.

### Código SQL Aplicado:
```sql
-- 1. Eliminar políticas inseguras
DROP POLICY IF EXISTS "admin_can_read_requests" ON "public"."booking_requests";
DROP POLICY IF EXISTS "admin_can_update_requests" ON "public"."booking_requests";

-- 2. Asegurar política administrativa única
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'booking_requests' AND policyname = 'Admin manage bookings') THEN
        CREATE POLICY "Admin manage bookings" ON "public"."booking_requests"
        FOR ALL TO authenticated
        USING (is_admin())
        WITH CHECK (is_admin());
    END IF;
END $$;
```

---

## 3. Verificación de Estado Final

### Políticas Actuales en `booking_requests`:
1. `anon_can_insert_requests` (Roles: `{anon}`, Cmd: `INSERT`)
2. `Admin manage bookings` (Roles: `{authenticated}`, Cmd: `ALL`, Qual: `is_admin()`)

### Resultados de la Prueba de Roles:
- **Anon**: Solo puede crear nuevas solicitudes. No puede leer ni editar.
- **Authenticated (No Admin)**: Acceso denegado a todas las operaciones.
- **Admin**: Acceso total restaurado y verificado.

---

## 4. Próximos Pasos Identificados
- Investigar error 401 en Vercel (Handshake/JWT issue).
- Optimizar índices en `booking_requests` para performance.
- Corregir `NULL` values en `weekend_price` dentro de `seasonal_pricing`.
