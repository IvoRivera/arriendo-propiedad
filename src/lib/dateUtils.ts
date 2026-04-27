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
