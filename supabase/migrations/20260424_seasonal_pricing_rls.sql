-- Enable RLS
ALTER TABLE seasonal_pricing ENABLE ROW LEVEL SECURITY;

-- Allow public read (for the calendar and public booking flow)
CREATE POLICY "Allow public read access"
ON seasonal_pricing FOR SELECT
TO public
USING (true);

-- Allow authenticated users (admins) all actions
CREATE POLICY "Allow authenticated full access"
ON seasonal_pricing FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
