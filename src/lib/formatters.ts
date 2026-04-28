/**
 * Shared formatting utilities.
 */

/**
 * Formats a number as Chilean Peso (CLP).
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(value);
}
