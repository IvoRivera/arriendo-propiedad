-- Create images table
CREATE TABLE IF NOT EXISTS public.images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL,
    storage_path TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL CHECK (category IN ('property', 'amenities', 'featured')),
    priority INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Public can read images
CREATE POLICY "Public read access"
ON public.images
FOR SELECT
USING (true);

-- 2. Admins can do everything
-- Note: Assuming auth.jwt() ->> 'role' = 'admin' for admin identification
-- or checking against a profiles/roles table if it exists.
-- Using a common Supabase pattern:
CREATE POLICY "Admins full access"
ON public.images
FOR ALL
USING (auth.role() = 'authenticated'); -- Simplified for now, can be tightened to specific admin role

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_images_updated_at
BEFORE UPDATE ON public.images
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();
