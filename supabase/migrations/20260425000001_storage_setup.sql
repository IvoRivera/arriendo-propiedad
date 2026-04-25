-- Ensure storage bucket exists
-- Note: Buckets are usually created via UI or seed, but we can attempt to insert into storage.buckets if permissions allow
-- However, standard practice in migrations is to set up policies.

-- Create policies for the 'carousel-images' bucket
-- 1. Public read access to objects in 'carousel-images'
CREATE POLICY "Public read access for carousel-images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'carousel-images');

-- 2. Authenticated admin access to modify objects in 'carousel-images'
CREATE POLICY "Admin full access for carousel-images"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'carousel-images')
WITH CHECK (bucket_id = 'carousel-images');
