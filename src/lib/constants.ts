/**
 * Centralized constants for the property management system.
 */

// Default pricing fallbacks
export const DEFAULT_BASE_PRICE = 80000;

// Config keys
export const CONFIG_KEYS = {
  PROPERTY_RENT_VALUE: 'PROPERTY_RENT_VALUE',
} as const;

// Preset pricing colors for consistency
export const PRICING_COLORS = [
  { name: 'Baja', hex: '#e2d9cc' },   // Sand/Surface High
  { name: 'Media', hex: '#6b7c4a' },  // Pine
  { name: 'Alta', hex: '#c8883a' },   // Warm Gold
  { name: 'Feriado', hex: '#00628f' }, // Sea Blue
  { name: 'Puente', hex: '#5a6a3d' },  // Deep Pine
];
