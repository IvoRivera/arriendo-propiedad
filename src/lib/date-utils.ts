import { format, parseISO } from 'date-fns';

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
