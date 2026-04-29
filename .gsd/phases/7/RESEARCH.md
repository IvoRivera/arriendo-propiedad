# Research: Phase 7 — Refined Navigation & Smooth Scrolling

## Context
The user wants a "premium" scroll animation from the Hero button to the Calendar section. This requires a custom easing function that is slower at the start and end, and faster in the middle.

## Findings
- `framer-motion`'s `animate` function is ideal for this.
- We need to calculate the target scroll position accurately, accounting for current scroll and potential sticky headers (none currently, but good practice).
- We should disable `scroll-behavior: smooth` temporarily or permanently when using JS-driven scroll to avoid conflicts.

## Proposed Solution
1. Create a `smoothScrollTo` utility.
2. Replace `scrollToId` in `HomeClient` with this utility.
3. Use a quintic or custom cubic-bezier easing for the premium feel.

## Technical Details
```typescript
const smoothScrollTo = (targetId: string) => {
  const target = document.getElementById(targetId);
  if (!target) return;

  const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
  const startPosition = window.pageYOffset;
  
  animate(startPosition, targetPosition, {
    type: "tween",
    duration: 1.5,
    ease: [0.65, 0, 0.35, 1], // easeInOutQuint-ish
    onUpdate: (latest) => window.scrollTo(0, latest)
  });
};
```
