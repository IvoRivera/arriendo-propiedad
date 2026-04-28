# 🗄️ Documentación de Base de Datos - Coastal Alchemist

Este documento detalla el esquema de base de datos PostgreSQL hospedado en **Supabase**, las relaciones entre entidades y las reglas de integridad que gobiernan el sistema de reservas.

---

## 1. Visión General

La base de datos utiliza **PostgreSQL** con un enfoque relacional estricto. La seguridad se gestiona a través de **RLS (Row Level Security)**, permitiendo que la lógica de acceso resida directamente en la capa de datos.

### Motor y Hosting
- **Proveedor**: Supabase.
- **Extensiones**: `uuid-ossp` (para IDs), `pg_trgm` (búsquedas).
- **Acceso**: `anon` para clientes, `service_role` para procesos de servidor (Next.js API).

---

## 2. Tablas Principales
<!-- 
--- Mejora futura, sistema multipropiedad ---
### `properties`
Define las unidades habitacionales gestionadas por el sistema.
- **Propósito**: Almacenar metadatos base de la propiedad.
- **Columnas Clave**:
    - `id` (UUID, PK)
    - `name` (TEXT): Nombre descriptivo.
    - `base_price` (INTEGER): Precio por noche por defecto.
- **Uso**: Configuración inicial y fallback del motor de precios. 
-->

### `booking_requests`
Almacena todas las intenciones de reserva de los huéspedes.
- **Propósito**: Registro de leads y transacciones de reserva.
- **Columnas Clave**:
    - `id` (UUID, PK)
    - `created_at`(timestamptz)
    - `full_name`, `email`, `phone` (TEXT)
    - `check_in`, `check_out` (DATE): Rango de la estancia.
    - `guests_count`(INT4): Numero de huespedes
    - `referred_by` (TEXT): Referencia
    - `total_price` (NUMERIC): Precio total congelado al momento de la solicitud.
    - `internal_notes` (TEXT): Notas internas para el admin
    - `rules_accepted` (BOOL)
    - `price_breakdown` (jsonb): Información desglosada de precios y fechas
    - `status` (request_status): Estado actual de la reserva (ver sección 4).
    - `risk_score` (TEXT): Evaluación automática de riesgo (Bajo/Medio/Alto).
    <!-- Sin uso, implementacion futura 
    - **FK**: `property_id` -> `properties.id`.
    -->

### `seasonal_pricing` (Reglas de Pricing)
Define los precios especiales según temporadas o eventos.
- **Propósito**: Lógica de negocio del `PricingEngine`.
- **Columnas Clave**:
    - `id` (UUID, PK)
    - `season_name` (TEXT)
    - `start_date`, `end_date` (DATE)
    - `price_per_night` (NUMERIC): Precio estándar de la temporada.
    - `weekend_price` (NUMERIC): Precio aplicado en viernes/sábado.
    - `priority` (INTEGER): A mayor valor, la regla sobreescribe a otras.
    <!-- Sin uso, implementacion futura 
    - **FK**: `property_id` -> `properties.id`.
    -->

### `blocked_dates`
Fechas donde la propiedad no está disponible para arriendo.
- **Propósito**: Bloqueos manuales por mantenimiento o uso del propietario.
- **Columnas Clave**:
    - `id` (UUID)
    - `created_at` (timestamptz)
    - `start_date`, `end_date` (DATE)
    - `reason` (TEXT)
    <!-- Sin uso, implementacion futura 
    - **FK**: `property_id` -> `properties.id`.
    -->


### `holidays`
Calendario de feriados nacionales.
- **Propósito**: Insumo para el cálculo de feriados puente y recargos especiales.
- **Columnas**: 
    - `date` (DATE, PK)
    - `name` (TEXT)
    - `type` (TEXT)

### `system_config`
Configuraciones globales en formato Key-Value, incluye:
    - ALLOWED_ADMIN_EMAILS
    - OWNER_BANK_ACCOUNT_NUMBER
    - OWNER_BANK_ACCOUNT_TYPE
    - OWNER_BANK_EMAIL
    - OWNER_BANK_NAME
    - OWNER_BANK_NAME_ENTITY
    - OWNER_BANK_RUT
    - OWNER_EMAIL
    - OWNER_NAME
    - OWNER_PHONE
    - OWNER_WHATSAPP_LINK
    - PROPERTY_RENT_VALUE
- **Propósito**: Evitar hard-coding de variables críticas.
- **Columnas**:
    - `key` (TEXT, PK): Nombre de la variable
    - `value` (TEXT)
    - `updated_at` (timestamptz)
    - `updated_by`(UUID, FK) -> auth.users.id
    - `updated_by_email` (TEXT)

### `system_config_history`
Historial sobre cambios en configuraciones globales.
- **Propósito**: llevar registro de modificaciones de variables críticas.
- **Columnas**:
    - `id` (UUID, PK)
    - `config_key` (TEXT): Nombre de la variable modificada
    - `old_value`, `new_value` (TEXT)
    - `changed_at` (timestamptz)
    - `changed_by` (UUID, FK)
    - `changed_by_email` (TEXT)

### `images`
Almacenamiento de imagenes de la propiedad.
- **Propósito**: Guardar las imagenes usadas en el sitio.
- **Columnas**: 
    - `id` (UUID, PK)
    - `url` (TEXT)
    - `storage_path` (TEXT)
    - `category` (TEXT): featured | amenities | property | hero
    - `priority` (INT4): orden para mostrar de menor a mayor
    - `metadata` (JSONB): texto alternativo
    - `created_at`, `updated_at` (timestamptz)
    <!-- Sin uso, implementacion futura 
    - **FK**: `property_id` -> `properties.id`.
    -->

### Tablas sin usar, creadas para implementaciones futuras:
    - properties: para gestion multipropiedad
    - princing_profiles: para establecer precios diferenciados
    - price_overrides: para gestionar sobre-escritura de precios (actualmente gestionada en seasonal pricing, pendiente separar)
    - inventory_logs: para manejar el registro del inventario de la propiedad (objetos de valor que podrían ser dañados)

    
---

## 3. Estados de la Reserva

El campo `status` en `booking_requests` sigue este flujo de vida:

| Estado | Descripción | Acción del Sistema |
| :--- | :--- | :--- |
| `pending` | Solicitud recién enviada por el huésped. | Bloqueo "suave" en el calendario UI. |
| `approved` | El administrador validó la solicitud. | Envío de datos de pago al huésped. |
| `paid` | Pago verificado por el administrador. | Bloqueo "duro" (indisponible para otros). |
| `rejected` | Rechazada por riesgo o política. | Fecha liberada inmediatamente. |
| `cancelled` | El huésped canceló antes o después del pago. | Aplica políticas de devolución si existen. |
| `completed` | El huésped ya realizó el check-out. | Registro histórico. |

### Flujo de Estados
`pending` -> `approved` -> `paid` -> `completed`
`pending` -> `rejected`
`approved` -> `cancelled`

---

## 4. Reglas de Integridad Críticas

1. **No Sobreventa (Anti-Overlap)**:
   - Antes de insertar en `booking_requests` o actualizar a `paid`, se debe verificar que no exista solapamiento en `blocked_dates` o `booking_requests` con estado `confirmed/paid`.
2. **Mínimo de Noches**:
   - Validado vía `CHECK` constraint o en la capa de API antes del insert.
3. **Consistencia de Precios**:
   - Al crear una reserva, el sistema debe guardar un `price_breakdown` (JSONB). Esto asegura que si el precio base cambia después, la reserva ya pactada mantenga su valor original.

---

## 5. Políticas RLS (Sugeridas/Implementadas)

```sql
-- Los clientes anónimos pueden leer disponibilidad pero no datos personales
CREATE POLICY "Public Read Availability" ON booking_requests
FOR SELECT USING ( status IN ('confirmed', 'paid') );

-- Solo administradores autenticados ven el detalle completo
CREATE POLICY "Admin Full Access" ON booking_requests
FOR ALL TO authenticated
USING ( auth.jwt() ->> 'email' IN (SELECT email FROM admin_users) );

-- El motor de precios es público (solo lectura)
CREATE POLICY "Public Pricing Read" ON seasonal_pricing FOR SELECT TO anon;
```

---

## 6. Queries Frecuentes

### Calcular disponibilidad para un rango:
```sql
SELECT count(*) FROM booking_requests 
WHERE status IN ('paid', 'confirmed')
AND (check_in, check_out) OVERLAPS ('2026-01-01', '2026-01-10');
```

### Obtener ingresos proyectados por mes:
```sql
SELECT sum(total_price) 
FROM booking_requests 
WHERE status = 'paid' 
AND date_trunc('month', check_in) = '2026-03-01';
```

---

## 7. Backups y Recuperación

- **Automáticos**: Supabase realiza backups diarios de la base de datos (Point-in-Time Recovery disponible en planes Pro).
- **Manuales**: Scripts de `pg_dump` programados semanalmente si se requiere redundancia externa.
- **Semillas**: El archivo `supabase/seed_holidays.sql` permite restaurar el calendario de feriados rápidamente.

---

## 8. Riesgos y Mejoras Futuras

- **Riesgo**: Crecimiento de logs de auditoría sin particionamiento.
- **Mejora**: Implementar **Materialized Views** para los reportes de ocupación si el volumen de reservas escala.
- **Mejora**: Automatizar la limpieza de solicitudes `pending` con más de 48 horas sin aprobación para liberar el calendario.
