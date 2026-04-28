import { format, parseISO, isSaturday, isSunday, addDays, subDays } from 'date-fns';

/**
 * Shared date utilities to ensure consistency across the app.
 */

/**
 * Returns a date string in YYYY-MM-DD format.
 */
export function toISODate(date: Date | string): string {
  const d = typeof date === 'string' ? parseSafeISO(date) : date;
  return format(d, 'yyyy-MM-dd');
}

/**
 * Parses an ISO date string safely, ensuring it's treated as local noon 
 * to avoid timezone shifting issues.
 */
export function parseSafeISO(dateStr: string): Date {
  if (!dateStr) return new Date();
  const normalized = dateStr.includes('T') ? dateStr : `${dateStr}T12:00:00`;
  return parseISO(normalized);
}

/**
 * Checks if a date is a holiday based on a provided set of holiday dates (YYYY-MM-DD).
 */
export function isDateHoliday(date: Date, holidaysSet: Set<string>): boolean {
  return holidaysSet.has(toISODate(date));
}

/**
 * Checks if a date is part of a long weekend (puente).
 * Saturday/Sunday are bridge if Friday/Monday are holidays.
 */
export function isLongWeekend(date: Date, holidaysSet: Set<string>): boolean {
  if (isDateHoliday(date, holidaysSet)) return false;

  const isSat = isSaturday(date);
  const isSun = isSunday(date);

  if (!isSat && !isSun) return false;

  const prevFriday = isSat ? subDays(date, 1) : subDays(date, 2);
  const nextMonday = isSun ? addDays(date, 1) : addDays(date, 2);

  const hasPrevFridayHoliday = isDateHoliday(prevFriday, holidaysSet);
  const hasNextMondayHoliday = isDateHoliday(nextMonday, holidaysSet);

  return hasPrevFridayHoliday || hasNextMondayHoliday;
}
