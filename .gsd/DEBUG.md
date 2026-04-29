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
