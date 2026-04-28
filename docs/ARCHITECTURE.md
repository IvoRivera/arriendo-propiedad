# 🏗️ Arquitectura Técnica - Coastal Alchemist

Este documento detalla la arquitectura del sistema, las decisiones técnicas y el flujo operativo de **Coastal Alchemist**, una plataforma premium de gestión de arriendos vacacionales.

---

## 1. Visión General del Sistema

**Coastal Alchemist** está diseñado como una solución *full-stack* moderna que prioriza la velocidad de carga (SEO), la robustez en la lógica de negocio y una estética visual de alta gama. El sistema separa claramente la experiencia pública del huésped de la gestión administrativa interna.

### Diagrama de Alto Nivel (ASCII)
```text
[ Client Browser ] <------> [ Vercel Edge Runtime / Node.js ]
      ^                                  |
      |                                  | (Next.js App Router)
      v                                  v
[ Cloudinary/Supabase Storage ] <--> [ Supabase (PostgreSQL + Auth) ]
      ^                                  |
      |                                  | (Resend API)
      +----------------------------------+------> [ Emails (Huésped/Admin) ]
```

---

## 2. Frontend Architecture

### Next.js App Router
Utilizamos el paradigma de **App Router** para maximizar el uso de **React Server Components (RSC)**.

- **Server Components**: Utilizados para la Landing Page, carga inicial de galerías y configuración del sistema. Reducen el bundle de JS enviado al cliente.
- **Client Components**: Reservados para interactividad compleja:
    - Formulario de solicitud de reserva.
    - Calendarios dinámicos.
    - Paneles de gestión con Drag & Drop (`dnd-kit`).
- **Estado Global vs Local**: 
    - Evitamos Redux/Zustand para estado global complejo, prefiriendo **URL State** para filtros y **React Context** para configuraciones transversales.
    - La "Sincronización de Verdad" se maneja vía **Server Actions** y revalidación de caché de Next.js.

---

## 3. Backend Architecture

### Integración Supabase
- **PostgreSQL**: Motor de base de datos relacional.
- **RLS (Row Level Security)**: Piedra angular de la seguridad. Las políticas aseguran que un usuario anónimo solo vea disponibilidad, mientras que un administrador vea datos sensibles de clientes.
- **Auth**: Autenticación integrada para el panel administrativo basada en roles de email.

### API & Server Actions
- **API Routes**: Utilizadas para integraciones externas y procesos asíncronos (e.g., `api/notify-new-request`).
- **Server Actions**: Preferidas para mutaciones directas desde formularios UI, aprovechando el tipado de TypeScript de extremo a extremo.

---

## 4. Flujo de Reservas End-to-End

1. **Exploración**: El huésped selecciona fechas en el calendario. El cliente consulta el `PricingEngine` en tiempo real.
2. **Validación**: El sistema verifica:
    - Estancia mínima (2 noches).
    - Solapamiento con bloqueos manuales o reservas confirmadas.
3. **Snapshot de Precio**: Al enviar la solicitud, el precio se "congela" y se guarda en la tabla `booking_requests` junto con el desglose (breakdown).
4. **Anti-Fiesta Scoring**: Una lógica en el servidor analiza el "Motivo del viaje" y asigna un nivel de riesgo (Bajo/Medio/Alto).
5. **Notificación**: Se dispara un correo asíncrono al administrador informando sobre la nueva solicitud.

---

## 5. Sistema de Pricing Dinámico (`PricingEngine`)

El motor de precios (`src/lib/pricing-engine.ts`) es una pieza crítica de lógica de negocio:

- **Jerarquía de Reglas**:
    1. Feriados específicos (Alta prioridad).
    2. Reglas estacionales (Temporada alta/media/baja).
    3. Precio Base (Fallback).
- **Lógica de Fin de Semana**: Incrementos automáticos los viernes y sábados.
- **Detección de Feriados Puente**: Identifica días laborables situados entre un feriado y un fin de semana para aplicar tarifas especiales.

---

## 6. Gestión de Disponibilidad

La disponibilidad se calcula de forma agregada:
- **`blocked_dates`**: Fechas bloqueadas manualmente por el dueño (mantenimiento, uso personal).
- **`booking_requests` (status='confirmed')**: Fechas ya vendidas.
- **`booking_requests` (status='pending')**: Se visualizan como "en proceso" para evitar overbooking durante la negociación.

---

## 7. Sistema de Emails

Implementado con **Resend**:
- **Templates React-based**: Los correos se diseñan con componentes React para mantener la marca.
- **Flujos**:
    - `Confirmación de Recepción`: Enviado al cliente inmediatamente.
    - `Notificación de Venta`: Enviado al administrador.
    - `Update de Estado`: Enviado al cliente cuando su reserva es confirmada/rechazada.

---

## 8. Seguridad y Roles

- **Administrador**: Identificado por email en `ALLOWED_ADMIN_EMAILS`. Tiene acceso total a `/admin`.
- **Anónimo**: Solo acceso a lectura de configuración pública y envío de solicitudes.
- **Internal Secret**: Una clave `INTERNAL_SECRET` protege los endpoints de API que deben ser llamados solo por el servidor (webhooks internos).

---

## 9. Arquitectura Agentic

El desarrollo se apoya en un ecosistema de agentes especializados:

| Agente | Responsabilidad | Enfoque |
| :--- | :--- | :--- |
| **Main Agent** | Orquestación general | Implementación de features de punta a punta. |
| **Debugging Agent** | Root Cause Analysis | Análisis de logs de Supabase y errores de Next.js. |
| **UI/UX Agent** | Estética Premium | Implementación de Tailwind CSS y Framer Motion. |
| **SQL Agent** | Persistencia | Escritura de migraciones seguras y políticas RLS. |
| **Security Auditor** | Blindaje | Auditoría de variables de entorno y validación de schemas. |

### Coordinación de Agentes
Se utiliza un **Protocolo de Contexto Compartido**. Cada agente lee el estado actual del proyecto (vía `list_dir` y `grep_search`) y actualiza la documentación técnica para que el siguiente agente tenga contexto fresco.

---

## 10. MCP Servers Recomendados

Para optimizar el flujo agentic, se recomienda el uso de los siguientes MCP Servers:
- **Postgres MCP**: Para introspección directa de la DB de Supabase.
- **Filesystem MCP**: Para manipulación masiva de componentes.
- **Memory MCP**: Para mantener historial de decisiones técnicas complejas a través de sesiones.

---

## 11. Riesgos Técnicos Actuales

1. **Race Conditions**: Posible overbooking si dos usuarios solicitan la misma fecha en el mismo segundo exacto (Mitigado por transacciones en Supabase).
2. **Dependencia de Resend**: Si el servicio de email cae, el flujo de confirmación se rompe.
3. **Caché de Next.js**: Necesidad de purgar la caché de disponibilidad globalmente cuando el administrador hace un bloqueo manual.

---

## 12. Mejoras Futuras

- **Integración con Stripe/Webpay**: Automatizar el pago total o adelanto.
- **Sincronización iCal**: Conectar con Airbnb/Booking.com para sincronización de calendarios bidireccional.
- **IA Customer Support**: Chatbot entrenado con las "Reglas de la casa" para responder dudas frecuentes de huéspedes automáticamente.
