# Phase 6 Plan: Definitive Business Rules, Compliance & Inventory

> **Goal**: Entregar una versión ejecutable sin ambigüedades que consolide el flujo de reservas, proteja los activos mediante reglas estrictas e inventario persistido, y asegure la calidad de los leads mediante validaciones robustas.

---

## 1. Orden de Implementación (Crítico)

El orden de ejecución ha sido estructurado para prevenir retrabajo y lógica circular:

1. **Disponibilidad (Fechas)**: Base del flujo. Las fechas provienen de Supabase. Si las fechas fallan, la reserva es inválida. Centralizar la fuente de verdad es el paso cero.
2. **Reglas y Compliance**: Una vez con fechas válidas, aseguramos que el usuario cumpla las condiciones de borde (límite de huéspedes, reglas de la casa).
3. **Validaciones y Calidad de Leads**: Filtramos intenciones maliciosas (scoring anti-fiestas), manejamos errores y pulimos la comunicación post-envío.
4. **Sistema de Inventario (MVP)**: Infraestructura post-reserva. Se construye al final porque depende de que exista una reserva válida aprobada.

---

## 2. Flujo Unificado de Fechas (Disponibilidad y UX)

### 2.1 Fuente Única de Verdad y Estrategia de Estados
- **OBLIGATORIO**: La única fuente de verdad es la base de datos en **Supabase** (tablas `blocked_dates` gestionadas por el admin + reservas confirmadas).
- `mockData.ts` **NO** se usará para disponibilidad real.
- **Estrategia "Pendiente vs Bloqueado"**:
  - Las solicitudes en estado **Pendiente** (recién enviadas) **NO bloquean** las fechas. Esto evita sobrecarga de solicitudes duplicadas bloqueando oportunidades reales.
  - Las fechas **SOLO** se bloquean automáticamente cuando la administración **aprueba** una reserva, o mediante un bloqueo manual explícito.

### 2.2 Definición Estricta del Endpoint (`/api/public/availability`)
- El servidor retornará fechas en formato estricto ISO `YYYY-MM-DD` tratadas como UTC absolutos para evitar desplazamientos por huso horario.
- **Formato esperado de Respuesta**:
  ```json
  {
    "success": true,
    "data": {
      "blockedDates": ["2026-05-01", "2026-05-02"],
      "lastUpdated": "2026-04-24T20:00:00Z"
    }
  }
  ```

### 2.3 Flujo Completo y Unificado
1. **Punto de Entrada A (`CoastalAvailability`)**: Muestra calendario (Loading -> Fetch desde API -> Success). Seleccionar fechas abre el Modal.
2. **Punto de Entrada B (Botón Directo)**: Abre Modal, carga `DayPicker` interno que consume la misma API.
3. **Regla de Componente**: Uso exclusivo de `DayPicker` para bloquear in-situ días ocupados. Cero inputs nativos.

---

## 3. Reglas y Compliance (UX + Backend)

### 3.1 Reglas de la Casa
- **Data**: Definir `houseRules` (Ej: Límite estricto 4 personas, No fiestas, No mascotas, Horarios de silencio).
- **UX**: Sección visual dentro de `CoastalRequestModal.tsx` previa al botón "Enviar".
- **Validación**: Checkbox `z.literal(true)` en Zod (`Acepto las reglas de la casa y confirmo el motivo de mi viaje`). Submit deshabilitado si no se marca.

---

## 4. Validaciones, Anti-Fiesta y Manejo de Errores

### 4.1 Sistema Anti-Fiesta (Scoring)
- Lógica en el servidor al recibir la solicitud.
- **Keywords**: "fiesta", "cumpleaños", "carrete", "celebración", "evento", "despedida".
- **Score Automático**:
  - *Bajo Riesgo*: Perfil normal.
  - *Medio Riesgo*: Texto muy corto o evasivo.
  - *Alto Riesgo*: Match directo con keywords.
- **Resultado**: NO bloquear automáticamente al usuario. Guardar el flag en la BD (`risk_score`) para hacerlo visible en el panel de administración, emitiendo una alerta para el revisor.

### 4.2 Prevención de Concurrencia (CRÍTICO)
- **El Problema**: Dos usuarios ven fechas disponibles. Usuario B las reserva (y se le aprueba). Usuario A envía su formulario obsoleto.
- **Solución Obligatoria (Backend)**: Antes de ejecutar el `insert` de una solicitud de reserva, el backend **debe re-consultar Supabase**. Si las fechas ya no están libres, se debe abortar la operación y retornar HTTP 409 Conflict.
- **Solución Obligatoria (Frontend)**: Si ocurre un 409, el modal debe mostrar un mensaje claro: *"Lo sentimos, las fechas que seleccionaste acaban de ser reservadas. Por favor, elige nuevas fechas."*

### 4.3 Manejo de Errores Generales y Estados de UI
- **Errores de Formulario (Zod)**: Textos rojos bajo cada campo en tiempo real.
- **Fallo de Red / Backend**: Mensaje tipo banner: *"Hubo un problema de conexión al enviar tu solicitud. Por favor, intenta nuevamente."*. Permitir *retry* manteniendo los datos.
- **Estado de Fetch Vacío**: Si no hay fechas futuras, mostrar: *"Actualmente no hay fechas disponibles en la temporada."*

### 4.4 Mensaje Post-Envío (Claridad de Canales)
- El mensaje de éxito debe ser explícito:
  *"Te contactaremos vía email o WhatsApp (según disponibilidad) en menos de 24 horas para confirmar tu reserva."*

### 4.5 Estado de Carga Emocional (Definición Técnica)
- **Ubicación**: `CoastalRequestModal.tsx`.
- **Trigger**: Apertura del modal (`isOpen === true`).
- **Duración**: `setTimeout` exacto de 2000ms.
- **Prevención de rotura**: Controlado por un `useEffect` que depende únicamente de `isOpen` para evitar que re-renders causados por inputs del usuario reinicien o rompan el estado de carga.

---

## 5. Sistema de Inventario (Definición Completa)

### 5.1 Persistencia (Supabase - OBLIGATORIO)
- **Tabla**: `inventory_logs` (o similar).
- **Campos Mínimos**:
  - `id` (uuid, PK)
  - `booking_id` (uuid, FK)
  - `inventory_snapshot` (jsonb, el listado del inventario aceptado en ese momento)
  - `accepted_at` (timestamp, null si el huésped aún no firma)
  - `checked_out_at` (timestamp, null si no han salido)
  - `differences` (jsonb, opcional MVP, para registro de daños)

### 5.2 Flujo Completo End-to-End
1. **Reserva Aprobada**: El administrador aprueba en el panel -> Se crea un registro en `inventory_logs`.
2. **Acceso**: El sistema envía (o permite generar) un link único para el huésped.
3. **Check-in Digital (Huésped)**: El huésped abre el link al llegar, visualiza el `inventory_snapshot`, y marca una casilla de confirmación ("Confirmo que el estado coincide..."). Se guarda `accepted_at`.
4. **Check-out (Admin)**: Al salir, el admin abre el registro, compara, y marca `checked_out_at`.

### 5.3 MVP vs Futuro (V2)
| Scope | Funcionalidad |
| :--- | :--- |
| **MVP (Fase 6)** | Inventario base editable en código/BD. Confirmación simple por parte del huésped (checkbox). Persistencia de tiempos (`accepted_at`, `checked_out_at`). Diseño enfocado en "protección mutua" sin hostilidad. |
| **Futuro (V2)** | Fotos integradas por ítem, reportes de daño con subida de imágenes, cobros de garantía automáticos. |

---

## Siguientes Pasos
Validar este documento. Una vez aprobado, se comenzará la ejecución estricta siguiendo el orden definido en la Sección 1.
