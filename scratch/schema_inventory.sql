-- SQL to create the inventory_logs table in Supabase
-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS inventory_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL UNIQUE, -- Link to booking_requests
  inventory_snapshot JSONB NOT NULL, -- List of items and conditions
  accepted_at TIMESTAMPTZ, -- When the guest confirmed
  checked_out_at TIMESTAMPTZ, -- When the host verified exit
  differences JSONB, -- Damages or missing items (V2)
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read/upsert for guests (simplification for MVP, ideally restricted by booking_id)
CREATE POLICY "Public guest access" ON inventory_logs
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Update booking_requests to support anti-party scoring
ALTER TABLE booking_requests ADD COLUMN IF NOT EXISTS risk_score TEXT DEFAULT 'Bajo';
