import 'server-only';
import { supabaseAdmin } from '@/lib/supabase';
import { unstable_cache } from 'next/cache';
import { validateSchema } from '@/lib/schemaValidator';
import { DbImage } from '@/services/image-service';

/**
 * Server-only image services.
 * These functions use Next.js server-side features like unstable_cache
 * and internal schema validation.
 */
export class ImageServiceServer {
  /**
   * Fetches all images for public consumption, cached by Next.js.
   * This is strictly server-side.
   */
  static getPublicImages = unstable_cache(
    async (): Promise<DbImage[]> => {
      // [SchemaGuard] Early Integrity Check
      const schema = await validateSchema();
      if (!schema.success) {
        const missing = schema.missing.map(m => `${m.table}.${m.column}`).join(', ');
        throw new Error(`[SchemaGuard] [ImageService] Inconsistencia detectada. Faltan: ${missing}`);
      }

      const { data, error } = await supabaseAdmin
        .from('images')
        .select('*')
        .order('category', { ascending: true })
        .order('priority', { ascending: true });

      if (error) {
        console.error('Error fetching public images:', error);
        return [];
      }
      return data as DbImage[];
    },
    ['public-images'],
    { tags: ['images-all'], revalidate: 3600 }
  );
}
