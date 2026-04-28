# 🌊 Coastal Alchemist - Plataforma de Arriendo Vacacional

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-DB%20%2B%20Auth-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

Plataforma integral de gestión y reserva para un departamento de lujo ubicado en primera línea en La Serena, Chile. Diseñada para ofrecer una experiencia premium tanto al huésped como al administrador.

---

## 🎯 El Problema que Resuelve

Tradicionalmente, los arriendos directos sufren de falta de transparencia en precios, calendarios desactualizados y procesos de reserva manuales tediosos. **Coastal Alchemist** centraliza la operación, automatiza la lógica de precios complejos (feriados, temporadas, fines de semana) y profesionaliza el contacto con el cliente, reduciendo la fricción operativa del dueño y mejorando la confianza del huésped.

## ✨ Funcionalidades Principales

### 🏠 Experiencia del Huésped (Pública)
- **Landing Page de Alto Impacto**: Diseño inmersivo con estética costera, optimizado para conversión.
- **Calendario de Disponibilidad Real**: Consulta de fechas sincronizada con la base de datos.
- **Explorador de Tarifas**: Cálculo dinámico de precios según fechas seleccionadas.
- **Formulario de Solicitud**: Captura de datos de clientes, motivo del viaje y preferencias.
- **Galería Dinámica**: Visualización premium de espacios, amenidades y entorno.

### 🔐 Panel Administrativo (Privado)
- **Dashboard de Solicitudes**: Gestión centralizada de leads y estados de reserva.
- **Motor de Precios Dinámicos**:
    - Tarifas base por temporada.
    - Recargos automáticos por fin de semana.
    - Detección de "Feriados Puente" (Sándwich) con lógica de negocio aplicada.
- **Gestión de Disponibilidad**: Bloqueo manual de fechas y visualización de calendario.
- **Administrador de Galería**: Carga y reordenamiento de imágenes mediante Drag & Drop.
- **Notificaciones**: Sistema de correos automáticos vía Resend para confirmar recepción de solicitudes.

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS, Framer Motion (animaciones).
- **Backend/BaaS**: Supabase (PostgreSQL, Auth, Storage).
- **Lenguaje**: TypeScript (Strict mode).
- **Emails**: Resend.
- **Validación**: Zod + React Hook Form.
- **Utilidades**: date-fns (fechas), dnd-kit (drag & drop).

---

## 🏗️ Arquitectura General

El proyecto sigue una arquitectura de **Next.js App Router** moderna:

- **Server Components**: Para fetching de datos eficiente y SEO optimizado.
- **Server Actions**: Para mutaciones de datos (reservas, actualizaciones de precios).
- **Client Components**: Solo donde la interactividad es estrictamente necesaria (formularios, galerías).
- **Service Layer**: Lógica de negocio aislada en `src/services` para interactuar con Supabase.
- **Shared Libs**: Utilidades compartidas en `src/lib` (formateadores, clientes de API).

---

## 📁 Estructura de Carpetas Recomendada

```bash
src/
├── app/              # Rutas, layouts y server actions
│   ├── admin/        # Dashboard privado
│   ├── api/          # Endpoints internos (webhooks, proxies)
│   └── guest/        # Vistas orientadas al cliente
├── components/       # Componentes de UI atómicos y modulares
│   ├── admin/        # UI específica del panel de control
│   └── coastal/      # UI con diseño temático de la marca
├── config/           # Constantes y contenido estático (Single Source of Truth)
├── lib/              # Clientes de SDKs (Supabase, Resend) y utilidades
├── services/         # Capa de abstracción de datos y lógica de negocio
├── types/            # Definiciones de TypeScript e interfaces de base de datos
└── supabase/         # Migraciones SQL y scripts de semillas
```

---

## ⚙️ Variables de Envío (Entorno)

Crea un archivo `.env.local` en la raíz con las siguientes claves:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# Email (Resend)
RESEND_API_KEY=re_tu_api_key

# Seguridad y Admin
ALLOWED_ADMIN_EMAILS=email1@gmail.com,email2@gmail.com
INTERNAL_SECRET=tu_secreto_para_endpoints_criticos
```

---

## 🚀 Instalación Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/departamento-ls.git
   cd departamento-ls
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar Supabase:**
   - Crea un proyecto en [Supabase](https://supabase.com).
   - Ejecuta las migraciones ubicadas en `supabase/migrations` en el editor SQL de Supabase.

4. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:3000`.

---

## 📜 Scripts npm Relevantes

- `npm run dev`: Inicia el entorno de desarrollo con Hot Module Replacement (HMR).
- `npm run build`: Genera el bundle optimizado para producción.
- `npm run start`: Inicia la aplicación construida.
- `npm run lint`: Ejecuta el linter para asegurar calidad de código.

---

## 🚢 Flujo de Despliegue

El proyecto está optimizado para **Vercel**:

1. Conecta tu repo de GitHub a Vercel.
2. Configura las variables de entorno en el dashboard de Vercel.
3. El despliegue es automático en cada `push` a la rama `main`.
4. **Importante**: Asegúrate de que las RLS (Row Level Security) en Supabase estén activas en producción.

---

## 🛡️ Seguridad Básica

- **RLS (Row Level Security)**: Todas las tablas en Supabase tienen políticas estrictas que impiden acceso no autorizado.
- **Middleware de Autenticación**: Las rutas `/admin` están protegidas a nivel de Next.js Middleware.
- **Server Actions**: Validación de inputs con Zod en el servidor para prevenir inyecciones.
- **Sanitización**: Los datos sensibles no se exponen en el cliente.

---

## 🤖 Filosofía Agentic

Este proyecto ha sido desarrollado bajo una **Arquitectura Agentic**. Esto significa:
- **Mantenimiento Inteligente**: El código está diseñado para ser legible y auto-explicativo para IAs de codificación.
- **Herramientas de Soporte**: Incluye scripts de validación y diagnóstico que permiten a agentes autónomos realizar tareas de mantenimiento con alta fidelidad.
- **Evolución Continua**: La estructura modular facilita que nuevos agentes entiendan el contexto rápidamente para añadir funcionalidades.

---

## 🛣️ Roadmap Futuro

- [ ] Integración con pasarelas de pago (Webpay/Mercado Pago).
- [ ] Sistema de check-in digital con firma electrónica.
- [ ] Exportación de reportes mensuales en PDF para contabilidad.
- [ ] Panel de métricas de ocupación y ROI.

---

## 🤝 Contribución y Buenas Prácticas

1. **Tipado Estricto**: No uses `any`. Define interfaces para cada respuesta de la base de datos.
2. **Componentes Puros**: Mantén la lógica de negocio en `services` y la UI en `components`.
3. **Commits Semánticos**: Usa `feat:`, `fix:`, `refactor:`, etc.
4. **Performance**: Usa `next/image` para todas las fotografías para asegurar carga progresiva.

---

Desarrollado con ❤️ para elevar el estándar de los arriendos vacacionales en Chile.
