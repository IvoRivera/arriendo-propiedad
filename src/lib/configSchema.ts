import { z } from 'zod';

/**
 * Centralized Configuration Schema
 * Defines validation rules for all system configuration keys.
 */

export const configSchemaMap = {
  PROPERTY_RENT_VALUE: z.string().refine((val) => {
    const num = parseInt(val.replace(/\D/g, ''));
    return !isNaN(num) && num >= 1000; // Technical minimum
  }, {
    message: "Debe ser un valor numérico válido mayor a 1,000"
  }),
  
  OWNER_EMAIL: z.string().email("Correo electrónico inválido"),
  
  OWNER_PHONE: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Número de teléfono inválido (formato E.164)"),
  
  SYSTEM_MAINTENANCE_MODE: z.enum(['true', 'false']),
  
  EMAIL_FOOTER_TEXT: z.string().min(5, "El pie de firma es muy corto"),
} as const;

export type ConfigKey = keyof typeof configSchemaMap;

/**
 * Validates a configuration value against its schema.
 * @param key The config key
 * @param value The value to validate
 * @param options { force: boolean } - If true, ignores business warnings but still checks technical validity.
 */
export function validateConfigValue(key: string, value: string, options = { force: false }) {
  const schema = configSchemaMap[key as ConfigKey];
  
  if (!schema) {
    // If no schema defined, we allow it but with a warning (optional)
    return { success: true, data: value };
  }

  const result = schema.safeParse(value);
  
    if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0].message
    };
  }

  // Business logic (Soft validations)
  if (key === 'PROPERTY_RENT_VALUE' && !options.force) {
    const num = parseInt(value.replace(/\D/g, ''));
    if (num < 80000) {
      return {
        success: true,
        data: value,
        warning: "El valor es inferior al estándar mínimo de $80,000"
      };
    }
  }

  return { success: true, data: result.data };
}
