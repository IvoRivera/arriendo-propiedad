# Debug Session: Calendar UX & Modal Overlap

## Symptom
1. **DayPicker UX**: Occupied dates are barely distinguishable from available ones (black vs slightly gray). [RESOLVED]
2. **Modal Overlap**: In `CoastalRequestModal.tsx`, the mobile phone input and guests select are overlapping/superimposed. [RESOLVED]
3. **Phone Validation**: The phone number field does not correctly validate the format (e.g., users can enter invalid numbers and it still passes).

**When:** During form submission in `CoastalRequestModal`.
**Expected:** The phone number should follow a specific format (e.g., matching the country's pattern) and show an error if invalid.
**Actual:** Validation is too loose or non-existent for the specific number format.

## Resolution

**Root Cause:**
1. **Calendar UX**: Default DayPicker styles for disabled dates were too subtle (just gray).
2. **Modal Overlap**: Grid columns were switching to 2 columns too early (`sm`) and had insufficient gap.
3. **Phone Validation**: Validation was only checking for a minimum of 7 characters, ignoring country-specific formats.

**Fix:**
1. **Calendar UX**: Added custom CSS for `.rdp-day_disabled` using dark red and strikethrough.
2. **Modal Overlap**: Switched to `md:grid-cols-2` and `gap-8`.
3. **Phone Validation**: 
   - Added `pattern` and `error` fields to the `countries` array.
   - Implemented `superRefine` in `requestSchema` to validate the `phone` field against the regex of the selected `country_code`.
   - Added error message display in the UI.

**Verified:** 
- Phone numbers now correctly validate against country formats (e.g., 9XXXXXXXX for Chile).
- Clear error messages are shown for invalid formats.

# Debug Session: Infinite Loading in Availability (Incognito/Mobile)

## Symptom
When accessing the site for the first time in an incognito window on mobile, the availability section shows "Cargando Disponibilidad..." infinitely.

**When:** First load, incognito mode, mobile devices (Safari/Chrome).
**Expected:** Availability data should load and the calendar should be interactive within a few seconds.
**Actual:** The loading overlay never disappears, and the "solicitud de reserva" button remains disabled.

## Evidence
- Server logs show `/api/public/availability` returning 200 OK multiple times (indicating repeated requests).
- Component uses `cache: 'no-store'` in the `fetch` call, which can hang in some private browsing modes on iOS.
- Initial state of `status` is `'loading'`.

## Hypotheses

| # | Hypothesis | Likelihood | Status |
|---|------------|------------|--------|
| 1 | `cache: 'no-store'` is causing the fetch to hang or behave unpredictably in incognito Safari. | 70% | CONFIRMED |
| 2 | Hydration mismatch: The server renders the loading state, and the client-side `useEffect` is not firing or being interrupted. | 20% | ELIMINATED |
| 3 | Race condition with Strict Mode: Repeated mounts cause multiple fetches, and the last one to finish is setting an incorrect state or they are all being aborted. | 10% | ELIMINATED |

# Debug Session: GalleryCarousel UX & Interactivity

## Symptom
1. **Swipe Conflict (Mobile)**: Attempting to swipe the carousel triggers the lightbox immediately.
2. **Lightbox Navigation**: Navigation controls are hidden on mobile; no clear way to move between images.
3. **Focus/Aesthetics**: The overlay doesn't isolate the image enough, and navigation buttons are hard to use.
4. **Interactivity**: Dragging vs Clicking is not correctly distinguished.

**When:** Interacting with the Gallery section on mobile or desktop.
**Expected:** Swipe should scroll the carousel; tap/click should open the lightbox. Inside lightbox, navigation should be possible via arrows, swipe, or keys.
**Actual:** Lightbox opens accidentally on swipe; lightbox is "stuck" on a single image on mobile.

## Evidence
- `GalleryCarousel.tsx` uses `onPointerDown` which fires immediately on touch, overriding any scroll intent.
- Lightbox buttons use `hidden md:flex`, making them invisible on mobile.
- `bg-black/98` is very dark but might lack the depth or focus the user expects.

## Hypotheses

| # | Hypothesis | Likelihood | Status |
|---|------------|------------|--------|
| 1 | `onPointerDown` is the cause of accidental lightbox openings on mobile. | 100% | CONFIRMED |
| 2 | `hidden md:flex` is preventing mobile navigation in the lightbox. | 100% | CONFIRMED |
| 3 | Lack of a dedicated "isDragging" state in the carousel leads to click/drag confusion. | 80% | CONFIRMED |

## Resolution

**Root Cause:**
1. **Event Conflict**: Using `onPointerDown` triggered the lightbox immediately on touch, before the browser could distinguish between a tap and a scroll/swipe intent.
2. **Responsive Hiding**: Navigation arrows in the lightbox were explicitly hidden on mobile using Tailwind's `hidden md:flex` classes.
3. **Aesthetics**: The overlay lacked sufficient blur and contrast to truly isolate the image, and the navigation controls were too small for comfortable touch use.

**Fix:**
1. **Interactivity Guard**: 
   - Removed `onPointerDown` from carousel items.
   - Implemented an `onScroll` timestamp check to prevent `onClick` from firing if the user was recently scrolling.
2. **Mobile Navigation**: 
   - Enabled navigation arrows on all devices.
   - Optimized arrow size and positioning for touch targets (10x10cm equivalent on mobile).
   - Added `backdrop-blur-md` and better styling to the lightbox counter and buttons.
3. **Visual Polish**:
   - Increased backdrop opacity to 95% and added `backdrop-blur-2xl` for maximum isolation.
   - Added `drop-shadow-2xl` to the images and captions to improve depth.
4. **Accessibility**:
   - Added `aria-label` to all controls.
   - Ensured keyboard ESC and swipe gestures are reliable.

**Verified:** 
- Mobile swipe now scrolls the carousel without opening the lightbox.
- Lightbox provides a fully immersive, navigable experience on both mobile and desktop.
- Navigation arrows are visible and functional on touch devices.

## Resolution

**Root Cause:**
1. **iOS/Incognito Cache Issue**: Using `cache: 'no-store'` in same-origin fetches within an incognito Safari window can sometimes cause the request to hang indefinitely.
2. **Missing Timeouts**: The fetch implementation lacked an `AbortController` timeout, meaning any stalled request would leave the UI in a permanent "loading" state.
3. **Response Validation**: Lack of explicit `res.ok` checks meant that if the server returned an error (e.g., 500) that wasn't valid JSON, the component might fail to transition to the error state properly.

**Fix:**
1. **Cache Busting**: Replaced `cache: 'no-store'` with a query parameter timestamp (`?t=${Date.now()}`) to ensure freshness without triggering browser private-mode fetch bugs.
2. **AbortController**: Implemented a 10-second timeout for availability fetches and an 8-second timeout for concurrency checks.
3. **Robustness**: Added explicit `res.ok` checks and more detailed error logging.
4. **Global Application**: Applied these fixes to both `CoastalAvailability.tsx` and `CoastalRequestModal.tsx`.

**Verified:** 
- Fetch logic now includes a safety timeout.
- Cache busting ensures fresh data across all devices/modes.
- Error states are triggered correctly if the network or server fails.
