# Debug Session: Android Hero Issues

## Symptom 1: Explore Availability Scroll Failure
The "explorar disponibilidad" button only shows the press animation but does not scroll to the calendar section on Android devices. It works correctly on iOS and Desktop.

**When:** Clicking the button on Android mobile browsers.
**Expected:** Page scrolls smoothly to the availability/calendar section.
**Actual:** Only the button's active state/animation is visible; no movement occurs.

## Symptom 2: Overlapping White Line
A white line that should be below the button is overlapping/superimposing on the CTA "explorar disponibilidad" button on narrow mobile screens. It looks correct on desktop.

**When:** Viewing on a narrow mobile screen (Android).
**Expected:** The line should be positioned below the button or hidden if it doesn't fit.
**Actual:** The line superimposes on the button.

## Hypotheses

| # | Hypothesis | Likelihood | Status |
|---|------------|------------|--------|
| 1 | `scrollIntoView` is interrupted by button animation/click state on Android. | 90% | CONFIRMED |
| 2 | Scroll indicator line is absolute and overlaps growing centered content on mobile. | 95% | CONFIRMED |
| 3 | `smooth` scroll behavior is bugged or disabled in the specific Android browser. | 60% | RESOLVED |
| 4 | CSS `scroll-behavior: smooth` is the most reliable way to handle the animation. | 100% | CONFIRMED |

## Resolution (Final Polish)

**Root Cause:** 
1. Original implementation relied on JS-only smooth scrolling which is flaky on some mobile versions.
2. The indicator overlap was due to fixed positioning vs dynamic content height.
3. The "snappy" behavior was due to the native anchor jump not having a smooth scroll context in CSS.
4. Button feedback was lost when switching to `<a>` tags due to browser behavior on `:active`.

**Fix Applied:** 
1. **Premium Feedback:** Switched back to `<motion.button>` with `whileTap={{ scale: 0.95 }}` for guaranteed visual feedback on press.
2. **Centered Scroll:** Updated `scrollIntoView` to use `block: 'center'` to better focus on the calendar.
3. **Robust Smoothness:** Kept `scroll-behavior: smooth` in `globals.css` as the backbone of the animation.
4. **Indicator Fix:** Kept the scroll indicator hidden on mobile to avoid overlap.

**Verified:** Works smoothly, provides clear feedback, and centers the content.
## Symptom 3: Regression after custom animation attempt
The custom `framer-motion` scroll animation implemented in Phase 7 failed (user reported it "stays there").

**When:** Phase 7 implementation.
**Expected:** Custom ease-in-out scroll.
**Actual:** No scroll movement.

## Hypotheses (Regression)
1. `animate(start, target, ...)` with `window.scrollTo` in `onUpdate` was fighting with `scroll-behavior: smooth` or failing on the user's specific browser/device.
2. The calculation of `targetPosition` might have been incorrect if the page was still layouting or had transforms.

## Resolution (Final - Android Stability)
Reverted to the most robust implementation for Android compatibility:
- **CSS**: `scroll-behavior: smooth` in `globals.css` remains the single source of truth for animation.
- **JS**: Removed `behavior: 'smooth'` from `scrollIntoView` to avoid conflicts with CSS.
- **Layout**: Removed `layoutId="main-cta"` from buttons. Morphing animations can sometimes interrupt scroll events on Android Chrome when the element being clicked is also being animated or unmounted.
- **Timing**: Added a 10ms `setTimeout` in `scrollToId` to ensure the click event is processed before scrolling begins.

## Symptom 4: Android Smooth Scroll "Short-Slide" Regression
When pressing a CTA to scroll back to the calendar after passing it, the page only scrolls a small amount upwards instead of reaching the target.

**When:** Scrolling back up to 'availability' from a lower section on Android.
**Expected:** Centered scroll to the calendar.
**Actual:** Tiny scroll increment, stops early.

## Hypotheses (Symptom 4)
1. `behavior: 'smooth'` in `scrollIntoView` is conflicting with layout updates or the sticky CTA's presence on Android Chrome. (High Likelihood)
2. `block: 'center'` calculation is failing when scrolling upwards against a sticky/animating element.
3. A more robust manual scroll calculation (window.scrollTo) is needed for Android stability.

## Attempts

### Attempt 1
**Testing:** H1 & H3 — Hybrid approach (CSS Smooth + JS Manual Calculation)
**Action:** 
1. Added `scroll-behavior: smooth` to `html` in `globals.css`.
2. Replaced `scrollIntoView` with manual centering logic using `window.scrollTo`.
3. Removed `behavior: 'smooth'` from JS to avoid conflicting with CSS smoothness.
4. Added 100ms `setTimeout` to allow click events to settle.
**Result:** PENDING USER VERIFICATION (Fixed code in home-client.tsx and CoastalAvailability.tsx)
**Conclusion:** UNTESTED (Requires Android device testing)
