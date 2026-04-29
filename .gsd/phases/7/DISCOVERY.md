# Discovery: Custom Smooth Scroll with Framer Motion

## Problem
The current scroll behavior uses `scroll-behavior: smooth` in CSS, which is "snappy" and doesn't allow for custom easing (slow-fast-slow).

## Options

### Option 1: Framer Motion `animate` function
We can use the `animate` function from `framer-motion` to animate the `window` scroll position.
```typescript
import { animate } from "framer-motion";

const target = element.getBoundingClientRect().top + window.pageYOffset;
animate(window.scrollY, target, {
  type: "tween",
  duration: 1.2,
  ease: [0.6, 0.01, -0.05, 0.95], // Custom ease-in-out
  onUpdate: (latest) => window.scrollTo(0, latest)
});
```

### Option 2: Lenis (Smooth Scroll Library)
Lenis is a popular choice for high-end smooth scrolling across the entire site. However, for a single CTA refinement, it might be overkill.

### Option 3: Custom `requestAnimationFrame` Utility
A lightweight utility to handle the scroll easing.

## Recommendation
Use **Option 1 (Framer Motion)** as it's already a dependency and provides excellent easing controls. We can create a reusable utility `scrollTo` in `src/lib/utils.ts` or directly in `HomeClient` if it's only used there.

## Implementation Details
- Target: `CoastalAvailability` section.
- Easing: `[0.6, 0.01, -0.05, 0.95]` (standard premium "slow-fast-slow" curve).
- Duration: ~1.2s to 1.5s for a luxurious feel.
- Fallback: Keep CSS `scroll-behavior: smooth` for browsers with JS disabled, but override it in JS.
