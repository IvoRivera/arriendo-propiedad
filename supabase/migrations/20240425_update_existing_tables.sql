-- Add property_id to existing tables
ALTER TABLE seasonal_pricing ADD COLUMN IF NOT EXISTS property_id UUID REFERENCES properties(id);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS property_id UUID REFERENCES properties(id);
ALTER TABLE images ADD COLUMN IF NOT EXISTS property_id UUID REFERENCES properties(id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_seasonal_pricing_property_id ON seasonal_pricing(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_property_id ON bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_images_property_id ON images(property_id);
