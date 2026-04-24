# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision
A premium, trust-based rental booking platform for a boutique property in La Serena. The system eliminates transactional friction in favor of a curated, high-end guest experience, utilizing a dynamic configuration backend to maintain site-wide consistency.

## Goals
1. **Live Data Synchronization**: Transition the UI from static mock data to a fully dynamic state, pulling prices and availability directly from the Supabase configuration tables.
2. **Premium Interaction Design**: Maintain and enhance the "Boutique Coastal" aesthetic with smooth transitions, automated booking steps, and editorial-grade typography.
3. **Administrative Security**: Harden the admin configuration routes with robust middleware to protect the property's pricing and settings integrity.

## Non-Goals (Out of Scope)
- **Instant Payment Integration**: Payments are handled externally (e.g., WhatsApp/Transfer); the platform only manages the request and trust-validation flow.
- **Multi-Property Support**: The system is purpose-built for a single boutique unit.

## Users
- **Guests**: High-end travelers looking for a curated stay who value privacy and direct contact.
- **Owner**: Admin user who needs to update seasonal pricing and block dates via a simple, secure dashboard.

## Constraints
- **Tech Stack**: Next.js 16 (App Router), Supabase, Framer Motion, Resend.
- **Budget/Timeline**: Focus on "Day 1" operational stability and visual excellence.

## Success Criteria
- [ ] No hardcoded prices remain in `mockData.ts` or component defaults.
- [ ] The Hero section and Booking Modal display the identical live price from Supabase.
- [ ] Admin routes are protected by production-grade IP/Auth middleware.
- [ ] Booking requests are successfully delivered via Resend with the correct estimated totals.
