-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    base_price INTEGER NOT NULL DEFAULT 80000,
    location_type TEXT CHECK (location_type IN ('coastal', 'urban')),
    luxury_tier TEXT CHECK (luxury_tier IN ('standard', 'premium', 'luxury')),
    seasonal_sensitivity TEXT CHECK (seasonal_sensitivity IN ('low', 'medium', 'high')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create pricing_profiles table
CREATE TABLE IF NOT EXISTS pricing_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    multipliers JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create price_overrides table
CREATE TABLE IF NOT EXISTS price_overrides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    price INTEGER NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(property_id, date)
);

-- RLS Policies
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_overrides ENABLE ROW LEVEL SECURITY;

-- Simple RLS: Public read, Admin write (assuming 'authenticated' users are admins for now, as per current pattern)
CREATE POLICY "Public read properties" ON properties FOR SELECT USING (true);
CREATE POLICY "Public read pricing_profiles" ON pricing_profiles FOR SELECT USING (true);
CREATE POLICY "Public read price_overrides" ON price_overrides FOR SELECT USING (true);

CREATE POLICY "Admin write properties" ON properties FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write pricing_profiles" ON pricing_profiles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write price_overrides" ON price_overrides FOR ALL USING (auth.role() = 'authenticated');
