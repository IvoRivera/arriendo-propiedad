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
