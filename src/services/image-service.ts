import { supabaseAdmin } from '@/lib/supabase';
import { unstable_cache } from 'next/cache';

export type ImageCategory = 'property' | 'amenities' | 'featured' | 'hero';

export interface ImageMetadata {
  alt?: string;
  width?: number;
  height?: number;
  [key: string]: any;
}

export interface DbImage {
  id: string;
  url: string;
  category: ImageCategory;
  priority: number;
  metadata: ImageMetadata;
  created_at: string;
  storage_path: string;
}

export class ImageService {
  private static BUCKET_NAME = 'carousel-images';

  /**
   * Uploads an image to storage and creates a database record.
   * If DB insertion fails, attempts to rollback by deleting the storage object.
   */
  static async uploadImage(
    file: File,
    category: ImageCategory,
    priority: number = 0,
    metadata: ImageMetadata = {}
  ) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${category}/${fileName}`;

    // 1. Upload to Storage
    const { data: storageData, error: storageError } = await supabaseAdmin.storage
      .from(this.BUCKET_NAME)
      .upload(filePath, file);

    if (storageError) {
      console.error('Storage upload error:', storageError);
      throw storageError;
    }

    // 2. Get Public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(filePath);

    // 3. Insert into Database
    const { data: dbData, error: dbError } = await supabaseAdmin
      .from('images')
      .insert({
        url: publicUrl,
        storage_path: filePath,
        category,
        priority,
        metadata
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insertion error, rolling back storage:', dbError);
      // Rollback: Delete from storage
      await supabaseAdmin.storage
        .from(this.BUCKET_NAME)
        .remove([filePath]);
      
      throw dbError;
    }

    return dbData;
  }

  /**
   * Deletes an image from the database and storage.
   */
  static async deleteImage(id: string) {
    // 1. Get image info for storage path
    const { data: image, error: fetchError } = await supabaseAdmin
      .from('images')
      .select('storage_path')
      .eq('id', id)
      .single();

    if (fetchError || !image) {
      throw fetchError || new Error('Image not found');
    }

    // 2. Delete from Database
    const { error: dbDeleteError } = await supabaseAdmin
      .from('images')
      .delete()
      .eq('id', id);

    if (dbDeleteError) {
      throw dbDeleteError;
    }

    // 3. Delete from Storage
    const { error: storageDeleteError } = await supabaseAdmin.storage
      .from(this.BUCKET_NAME)
      .remove([image.storage_path]);

    if (storageDeleteError) {
      console.warn('Image record deleted but storage file cleanup failed:', storageDeleteError);
      // We don't throw here to ensure the UI thinks it's deleted, but we log the orphan
    }

    return true;
  }

  /**
   * Updates priorities for a batch of images.
   * Note: We use upsert with onConflict 'id'. This requires passing all NOT NULL columns 
   * even if we are only updating, due to Postgres INSERT...ON CONFLICT requirements.
   */
  static async reorderImages(updates: Partial<DbImage>[]) {
    const { error } = await supabaseAdmin
      .from('images')
      .upsert(updates, { onConflict: 'id' });

    if (error) {
      console.error('Error reordering images:', error.message, error.details, error);
      throw error;
    }
    return true;
  }

  /**
   * Fetches all images for public consumption, cached by Next.js.
   */
  static getPublicImages = unstable_cache(
    async (): Promise<DbImage[]> => {
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
    { tags: ['images-all'], revalidate: 3600 } // 1 hour stale fallback
  );

  /**
   * Groups images by category for easier consumption.
   */
  static categorizeImages(images: DbImage[]) {
    return {
      hero: images.filter(img => img.category === 'hero'),
      featured: images.filter(img => img.category === 'featured'),
      property: images.filter(img => img.category === 'property'),
      amenities: images.filter(img => img.category === 'amenities'),
    };
  }
}
