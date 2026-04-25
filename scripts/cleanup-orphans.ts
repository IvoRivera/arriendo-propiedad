import { createClient } from '@supabase/supabase-js';

// Load env vars if running locally (e.g. using ts-node or similar)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Needs service role to bypass RLS for cleanup

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials for cleanup script');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const BUCKET_NAME = 'carousel-images';

async function cleanupOrphans(dryRun = true) {
  console.log(`Starting cleanup in ${dryRun ? '[DRY RUN]' : '[LIVE]'} mode...`);

  // 1. List all files in storage
  const { data: storageObjects, error: storageError } = await supabase.storage
    .from(BUCKET_NAME)
    .list('', { limit: 1000 }); // Simplified: handles root, might need recursive if categories are folders

  if (storageError) {
    console.error('Error listing storage objects:', storageError);
    return;
  }

  // 2. Get all image paths from database
  const { data: dbImages, error: dbError } = await supabase
    .from('images')
    .select('storage_path');

  if (dbError) {
    console.error('Error fetching database images:', dbError);
    return;
  }

  const dbPaths = new Set(dbImages.map(img => img.storage_path));
  const orphans: string[] = [];

  // 3. Identify orphans
  // Note: This logic needs to be aware of the folder structure (category/)
  // For simplicity in this placeholder, we'll just check root objects or handle subfolders
  
  // Real implementation would likely iterate through categories or use recursive list
  for (const obj of storageObjects || []) {
    if (!dbPaths.has(obj.name)) {
      // Check age to avoid deleting current uploads
      if (!obj.created_at) continue;
      const created = new Date(obj.created_at);
      const now = new Date();
      const ageHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60);

      if (ageHours > 24) {
        orphans.push(obj.name);
      }
    }
  }

  console.log(`Found ${orphans.length} orphaned files older than 24h.`);

  if (!dryRun && orphans.length > 0) {
    console.log('Deleting orphans...');
    const { error: deleteError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove(orphans);

    if (deleteError) {
      console.error('Error deleting orphans:', deleteError);
    } else {
      console.log('Cleanup complete.');
    }
  } else if (orphans.length > 0) {
    console.log('Orphans identified:', orphans);
    console.log('Run with --live to delete.');
  }
}

// execute if called directly
const isLive = process.argv.includes('--live');
cleanupOrphans(!isLive).catch(console.error);
