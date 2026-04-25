# Technology Stack

> Updated on 2026-04-24 (Post-Milestone v1.1 Stabilization)

## Runtime

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.1.7 | Core Framework (App Router) |
| React | 19.0.0 | UI Library |
| Node.js | ^20 | Server Environment |
| TypeScript | ^5 | Language |

## Dependencies (Pinned for Stability)

### Production
| Package | Version | Purpose |
|---------|---------|---------|
| `@supabase/supabase-js` | ^2.45.0 | Database & Authentication |
| `framer-motion` | 11.18.2 | Premium Animations & Transitions |
| `react-day-picker` | 9.4.0 | Interactive Booking Calendars |
| `react-hook-form` | ^7.53.0 | Performant Form Handling |
| `zod` | ^3.23.8 | Schema Validation & Type Safety |
| `resend` | ^4.0.0 | Transactional Email Delivery |
| `date-fns` | ^4.1.0 | Date Manipulation |
| `lucide-react` | ^0.440.0 | Icon System |

### Development
| Package | Version | Purpose |
|---------|---------|---------|
| `tailwindcss` | ^3.4.1 | Styling (Utility First) |
| `eslint-config-next`| 15.1.7 | Framework-aware Linting |
| `typescript` | ^5 | Language |

## Infrastructure

| Service | Provider | Purpose |
|---------|----------|---------|
| Database | Supabase | PostgreSQL storage for requests, config, and seasonal pricing. |
| Hosting | Vercel | Production deployment. |
| Email | Resend | Dispatching booking requests. |

## Configuration

| Variable | Purpose | Location |
|----------|---------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase endpoint | `.env.local` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public client key | `.env.local` |
| `SUPABASE_SERVICE_ROLE_KEY` | Private admin key | `.env.local` |
| `RESEND_API_KEY` | Email provider key | `.env.local` |
| `SYSTEM_CONFIG` | Dynamic settings | Supabase Table |
| `seasonal_pricing` | Dynamic rates | Supabase Table |
