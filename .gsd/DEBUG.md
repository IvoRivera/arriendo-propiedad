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
