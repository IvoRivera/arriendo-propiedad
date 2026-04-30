---
phase: 16
plan: 1
wave: 1
---

# Plan 16.1: Admin Navigation Drawer & Trigger Implementation

## Objective
Replace the horizontal tab-based navigation in the Admin Panel with a premium, mobile-first hamburger menu (Drawer) that aligns with the "Internal Sanctuary" aesthetic.

## Context
- .gsd/SPEC.md
- docs/design/DESIGN.md
- src/app/admin/page.tsx

## Tasks

<task type="auto">
  <name>Create AdminNavigationDrawer Component</name>
  <files>
    - src/components/admin/AdminNavigationDrawer.tsx
  </files>
  <action>
    - Build a high-fidelity drawer component using `framer-motion`.
    - Use `Warm Sand` (#faf7f2) as the base and `Warm Sand Secondary` (#f5f0e8) for active states.
    - Typography: Use `font-serif-luxury` (Newsreader Italic) for the "Menú" title and `font-sans-luxury` with `tracking-luxury` for links.
    - Include all current sections: Inbox, Availability, System, Pricing, Images.
    - Add a "Logout" button at the bottom of the drawer.
    - Ensure smooth enter/exit animations.
  </action>
  <verify>Check file existence and syntax.</verify>
  <done>Component created with framer-motion and luxury tokens.</done>
</task>

<task type="auto">
  <name>Implement Hamburger Trigger and Integrate Drawer</name>
  <files>
    - src/app/admin/page.tsx
  </files>
  <action>
    - Remove the horizontal tab bar (`flex bg-white border...`).
    - Add a state variable `isNavOpen` to manage drawer visibility.
    - Implement a clean hamburger trigger button in the header (Capsule shape or minimal icon).
    - Position the trigger prominently on mobile and desktop.
    - Integrate the `AdminNavigationDrawer` and pass the `setActiveView` and `onClose` props.
    - Ensure the layout remains balanced with the new trigger.
  </action>
  <verify>Run npm run dev and verify visual consistency.</verify>
  <done>Old navigation removed, new trigger and drawer functional.</done>
</task>

## Success Criteria
- [ ] Admin panel uses a hamburger menu instead of tabs.
- [ ] Navigation drawer feels premium and editorial (animations, typography).
- [ ] Menu is fully responsive and "amigable en móvil".
