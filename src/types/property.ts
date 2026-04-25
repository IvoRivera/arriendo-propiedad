export type LocationType = 'coastal' | 'urban';
export type LuxuryTier = 'standard' | 'premium' | 'luxury';
export type SeasonalSensitivity = 'low' | 'medium' | 'high';

export interface Property {
  id: string;
  name: string;
  slug: string;
  base_price: number;
  location_type: LocationType;
  luxury_tier: LuxuryTier;
  seasonal_sensitivity: SeasonalSensitivity;
  created_at: string;
  updated_at: string;
}
