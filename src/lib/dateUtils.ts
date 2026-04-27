/**
 * Date Utility functions for the booking system
 */

/**
 * Validates if a stay duration is acceptable.
 * Global Rule: Minimum 2 nights stay.
 * 
 * @param startDate Check-in date
 * @param endDate Check-out date
 * @returns boolean true if the stay is valid
 */
export function isValidStay(startDate: Date | string | null | undefined, endDate: Date | string | null | undefined): boolean {
  if (!startDate || !endDate) return false;

  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  // Ensure valid date objects
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;

  // Checkout must be after check-in
  if (end <= start) return false;

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  return diffDays >= 2;
}

/**
 * Calculates the number of nights between two dates.
 * 
 * @param startDate Check-in date
 * @param endDate Check-out date
 * @returns number of nights
 */
export function calculateNights(startDate: Date | string | null | undefined, endDate: Date | string | null | undefined): number {
  if (!startDate || !endDate) return 0;

  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
  if (end <= start) return 0;

  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Checks if any date within the given range [startDate, endDate] is in the blockedDates list.
 * 
 * @param startDate Check-in date
 * @param endDate Check-out date
 * @param blockedDateStrings Array of YYYY-MM-DD strings
 * @returns boolean true if the range overlaps with any blocked date
 */
export function isRangeBlocked(
  startDate: Date | string | null | undefined, 
  endDate: Date | string | null | undefined, 
  blockedDateStrings: string[]
): boolean {
  if (!startDate || !endDate || !blockedDateStrings || blockedDateStrings.length === 0) return false;

  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;

  const curr = new Date(start);
  // We check from check-in up to check-out
  while (curr <= end) {
    const year = curr.getFullYear();
    const month = String(curr.getMonth() + 1).padStart(2, '0');
    const day = String(curr.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    if (blockedDateStrings.includes(dateStr)) return true;
    curr.setDate(curr.getDate() + 1);
  }

  return false;
}

// Internal helper for string parsing if not using library
function parseISO(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}
