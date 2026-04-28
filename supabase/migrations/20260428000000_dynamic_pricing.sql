-- Create holidays table
CREATE TABLE IF NOT EXISTS holidays (
  date DATE PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT -- civil, religioso, irrenunciable
);

-- Add weekend_price to seasonal_pricing to support different rates within a single season rule
ALTER TABLE seasonal_pricing ADD COLUMN IF NOT EXISTS weekend_price NUMERIC;

-- Enable RLS on holidays
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;

-- Allow public read to holidays (since it's public info)
CREATE POLICY "Allow public read holidays" ON holidays FOR SELECT USING (true);

-- Admin can manage holidays
CREATE POLICY "Allow admin manage holidays" ON holidays FOR ALL USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = id AND (raw_user_meta_data->>'role') = 'admin'
  )
);
