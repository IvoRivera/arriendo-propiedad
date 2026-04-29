# Summary: Plan 7.1 — Custom Smooth Scroll Implementation

## Work Completed
- **globals.css**: Disabled native CSS `scroll-behavior: smooth` to give full control to the JavaScript animation and avoid potential jitter or double-easing.
- **HomeClient.tsx**: 
    - Integrated `animate` from `framer-motion` into the component.
    - Replaced the `scrollToId` utility with a custom animation loop.
    - Implemented a quintic ease-in-out curve (`[0.65, 0, 0.35, 1]`) with a 1.5s duration for a premium, non-snappy feel.
    - Verified that the target calculation correctly uses `getBoundingClientRect` relative to `window.pageYOffset`.

## Verification
- Clicking "Explorar disponibilidad" in the Hero section now triggers a smooth, luxurious scroll to the availability section.
- The animation correctly decelerates as it approaches the target, avoiding the abrupt stop of standard browser smooth scrolling.
