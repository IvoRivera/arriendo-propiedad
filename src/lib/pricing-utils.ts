import { DEFAULT_BASE_PRICE } from './constants';

/**
 * Shared pricing calculation utilities.
 */

/**
 * Parses the base price from a config string (e.g., "$ 80.000").
 */
export function parseBasePrice(configValue: string | undefined): number {
  if (!configValue) return DEFAULT_BASE_PRICE;
  const parsed = parseInt(configValue.replace(/\D/g, ''));
  return isNaN(parsed) ? DEFAULT_BASE_PRICE : parsed;
}

/**
 * Calculates a new price based on a mode and value.
 */
export function calculateDynamicPrice(base: number, mode: 'fixed' | 'percentage', value: number): number {
  if (mode === 'fixed') return value;
  const multiplier = 1 + (value / 100);
  return Math.max(1, Math.round(base * multiplier));
}
