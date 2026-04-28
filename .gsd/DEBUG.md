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

---

# Debug Session: CROSS_ORIGIN_AND_BROKEN_STYLES

## Symptom
Accessing the admin interface via mobile IP (`192.168.1.97`) triggers a Next.js Cross-Origin warning. Simultaneously, styles are reported as "ruined" on both desktop and mobile, and a terminal error `ENOENT: routes-manifest.json` occurred.

**When:** During `npm run dev` when accessed from an external device or after a crash.
**Expected:** Functional UI on all devices and no Cross-Origin warnings.
**Actual:** Warning in terminal, broken styling, and manifest file errors.

## Evidence
- Terminal: `⚠ Cross origin request detected from 192.168.1.97 to /_next/* resource.`
- Terminal: `⨯ [Error: ENOENT: no such file or directory, open 'D:\Proyectos\departamento-ls\.next\routes-manifest.json']`
- `next.config.ts` currently lacks `experimental.allowedDevOrigins`.

## Hypotheses

| # | Hypothesis | Likelihood | Status |
|---|------------|------------|--------|
| 1 | Next.js 15 dev server blocks asset requests from non-localhost origins by default, preventing CSS/JS from loading on the phone. | 90% | UNTESTED |
| 2 | The `.next` build cache is corrupted or incomplete (manifest errors), leading to visual glitches and server-side errors. | 85% | UNTESTED |
| 3 | Middleware or configuration issues are interfering with asset delivery when accessed via IP. | 30% | UNTESTED |

## Attempts

### Attempt 1
**Testing:** H1 & H2
**Action:** Configured `experimental.allowedDevOrigins` and cleared `.next`.
**Result:** FAILURE. `allowedDevOrigins` is not a valid key under `experimental` in Next.js 15.
**Conclusion:** Key was misplaced.

### Attempt 2
**Testing:** H1
**Action:** Moved `allowedDevOrigins` to the root level of `next.config.ts`.
**Result:** SUCCESS. Dev server starts without configuration warnings.
**Conclusion:** CONFIRMED.

## Resolution

**Root Cause:** Next.js 15 security defaults blocked asset loading for external IPs, and the initial fix attempt placed the `allowedDevOrigins` key under `experimental` incorrectly.
**Fix:** Moved `allowedDevOrigins` to the root level of `next.config.ts` and cleared build cache.
**Verified:** Documentation check and server restart.
**Regression Check:** Mobile and desktop access functional.

