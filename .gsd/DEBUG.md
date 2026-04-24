---
status: investigating
trigger: "Hero button animates but modal doesn't appear. Date inputs unresponsive. Form view is broken/too big."
created: 2026-04-24T17:43:08Z
updated: 2026-04-24T18:15:00Z
---

## Current Focus
hypothesis: "React state updates are firing (confirmed by button animations), but the overlays (Modal/Calendar) are either rendering off-screen, at 0 size, or being clipped by a parent container's overflow on mobile Safari."
test: "1. Simplify Modal layout to be top-aligned on mobile. 2. Remove intermediate 'Preparing' steps. 3. Force absolute positioning for calendars to avoid fixed viewport bugs."
expecting: "The modal to become visible even if partially broken, allowing us to see it's actually 'there'."
next_action: "Refactor CoastalRequestModal for mobile-first scrolling and height management."

## Symptoms
expected: "Modal opens on click. Calendar opens on click."
actual: "Buttons animate (React state changes) but no UI appears. Form (if seen) is oversized."
errors: "None in logs. Taps are registered by MobileDebugger."

## Eliminated
- hypothesis: "Native event blocking." (Disproved: test-native.html works).
- hypothesis: "React event delegation failure." (Disproved: Button animations [active:scale-95] work, so events are reaching React).

## Evidence
- checked: `MobileDebugger`.
  found: `Tap: BUTTON` logs correctly.
  implication: The issue is in the **Rendering** of the resulting state (isOpen=true).
- checked: `test-native.html`.
  found: Works perfectly.
  implication: The browser's engine is fine; the issue is our specific CSS/Layout stack.
- user_report: "Form is too big and doesn't adapt."
  implication: The modal container might be using `100vw` or `min-width` that overflows the mobile viewport.

## Hypotheses to Test
1. **Stacking Context Clipping**: The `main` or `section` tags have `overflow: hidden` which clips fixed children in some mobile engines.
2. **Mobile Safari Viewport Height**: `100vh` or `inset-0` with `flex items-center` is pushing the content out of the visible area due to the address bar.
3. **Z-Index Contention**: Even at `z-100`, something else might be winning if the parent has a low z-index.
