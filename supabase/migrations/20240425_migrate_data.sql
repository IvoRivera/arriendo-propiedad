-- Bootstrap default property
DO $$
DECLARE
    default_property_id UUID;
    current_rent_value TEXT;
BEGIN
    -- 1. Insert default property
    INSERT INTO properties (name, slug, base_price, location_type, luxury_tier, seasonal_sensitivity)
    VALUES ('Depto Reñaca', 'depto-renaca', 80000, 'coastal', 'standard', 'medium')
    RETURNING id INTO default_property_id;

    -- 2. Try to fetch current rent value from system_config
    SELECT value INTO current_rent_value FROM system_config WHERE key = 'PROPERTY_RENT_VALUE';
    
    IF current_rent_value IS NOT NULL THEN
        UPDATE properties SET base_price = CAST(current_rent_value AS INTEGER) WHERE id = default_property_id;
    END IF;

    -- 3. Link existing data
    UPDATE seasonal_pricing SET property_id = default_property_id WHERE property_id IS NULL;
    UPDATE bookings SET property_id = default_property_id WHERE property_id IS NULL;
    UPDATE images SET property_id = default_property_id WHERE property_id IS NULL;
END $$;
