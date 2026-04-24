# Phase 4 Implementation Plan: Polish & Performance

This phase focuses on elevating the user experience through performance optimizations and aesthetic refinements, ensuring a premium feel across all devices.

## 1. Image Optimization (Hero Section)
*   **Goal**: Zero-latency perception for the Hero background.
*   **Action**: Use `next/image` with `priority` and a blurred placeholder for `CoastalHero.tsx`.
*   **File**: `src/components/coastal/CoastalHero.tsx`

## 2. Animation Refinement (Mobile UX)
*   **Goal**: Smooth, buttery transitions that feel "high-end".
*   **Action**: 
    *   Adjust `Framer Motion` spring settings for modal transitions.
    *   Optimize calendar open/close animations to avoid layout shifts.
*   **Files**: `src/components/coastal/CoastalAvailability.tsx`, `src/components/coastal/CoastalRequestModal.tsx`

## 3. E2E Booking Flow Validation
*   **Goal**: Guarantee a bug-free experience from guest to owner.
*   **Action**:
    *   Verify data flow: Guest Selection -> Request Submission -> Admin Inbox.
    *   Verify notification sync: Status Change -> Email Sent -> Calendar Blocked.

---

## Execution Steps

### Step 1: Optimize CoastalHero
- Replace standard `<img>` or CSS background with `next/image`.
- Set `priority={true}` to ensure it's the first thing loaded.

### Step 2: Refine Transitions
- Add subtle micro-animations to the "Disponibilidad" calendar buttons.
- Ensure the modal background overlay has a smooth fade-in/out.

### Step 3: Performance Audit
- Run a quick check on core web vitals (LCP specifically).
