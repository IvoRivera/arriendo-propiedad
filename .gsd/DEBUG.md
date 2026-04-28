# Debug Session: REDUNDANT_TW_CLASSES_PRICING_MANAGER

## Symptom
IDE warnings indicate that `lg:relative` and `lg:sticky` apply the same CSS properties at the same breakpoint, creating redundancy.

**When:** Constant warning in IDE.
**Expected:** Clean, non-redundant Tailwind classes.
**Actual:** Both `lg:relative` and `lg:sticky` are applied to the sidebar container.

## Evidence
- `PricingManager.tsx:L332`: `className="... lg:relative ... lg:sticky ..."`

## Hypotheses

| # | Hypothesis | Likelihood | Status |
|---|------------|------------|--------|
| 1 | `lg:relative` is redundant because `lg:sticky` already implies the necessary positioning behavior for the element to stay in document flow while gaining sticky capabilities. | 100% | UNTESTED |

## Attempts

### Attempt 1
**Testing:** H1
**Action:** Removed `lg:relative` and `lg:inset-auto` from `PricingManager.tsx` sidebar container.
**Result:** SUCCESS. IDE warnings resolved and layout remains functional as `lg:sticky` handles both positioning reset and sticky behavior.
**Conclusion:** CONFIRMED.

## Resolution

**Root Cause:** Redundant positioning classes (`lg:relative` and `lg:sticky`) were applied to the same element, causing IDE confusion.
**Fix:** Cleaned up the Tailwind class string in `PricingManager.tsx`.
**Verified:** Build successful (`npm run build`).
**Regression Check:** Sidebar still behaves correctly on mobile (fixed overlay) and desktop (sticky column).
