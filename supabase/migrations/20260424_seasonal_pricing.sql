-- Seasonal pricing table
CREATE TABLE IF NOT EXISTS seasonal_pricing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  price_per_night NUMERIC NOT NULL,
  season_name TEXT NOT NULL,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT positive_price CHECK (price_per_night > 0),
  CONSTRAINT valid_range CHECK (start_date <= end_date)
);

-- Index for date lookups
CREATE INDEX IF NOT EXISTS idx_seasonal_pricing_dates ON seasonal_pricing (start_date, end_date);

-- Update reservation_requests to include snapshots
ALTER TABLE reservation_requests 
ADD COLUMN IF NOT EXISTS total_price NUMERIC,
ADD COLUMN IF NOT EXISTS price_breakdown JSONB;
