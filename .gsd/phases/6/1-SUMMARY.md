# Plan 6.1 Summary: Sticky CTA Transition Experience

## Work Completed
- **Refactored Floating CTA Trigger**: Replaced the static scroll listener with `framer-motion`'s `useInView`. The floating button now appears exactly when the Hero section leaves the viewport and disappears when the Footer CTA enters.
- **Redesigned Floating CTA**: Created a minimalist, centered sticky button.
  - **Aesthetics**: Glassmorphism (`backdrop-blur-lg`), slim pill shape, and subtle glossy hover effects.
  - **Animation**: Smooth "pop-up" from the bottom center, synchronized with the Hero CTA's exit.
  - **Ergonomics**: Centered at the bottom for optimal reachability on mobile devices.

## Files Modified
- `src/app/home-client.tsx`

## Verification
- [x] Build successful (`npm run build`).
- [x] Verified logic for `showFloating` using `useInView` for both Hero and Footer.
- [x] Visual design matches "minimalist" and "premium" criteria.
