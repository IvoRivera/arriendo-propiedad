# RESEARCH.md — Phase 23: Multi-Property Core Schema

## Current State Analysis
- **Pricing**: Currently relies on a global `PROPERTY_RENT_VALUE` in `system_config` and a `seasonal_pricing` table that doesn't distinguish between properties.
- **Images**: Already support categories, but might need property association soon.
- **Bookings**: Currently assume a single property.

## Proposed Schema Evolution

### 1. `properties` Table
Essential for identifying different units.
| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | Primary Key |
| `name` | `text` | Display name (e.g., "Depto Reñaca") |
| `slug` | `text` | Unique identifier for URLs/Lookups |
| `base_price` | `integer` | Base price per night |
| `location_type` | `text` | 'coastal' \| 'urban' |
| `luxury_tier` | `text` | 'standard' \| 'premium' \| 'luxury' |
| `seasonal_sensitivity` | `text` | 'low' \| 'medium' \| 'high' |

### 2. `pricing_profiles` Table (Optional but recommended)
Templates for shared multipliers.
| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | Primary Key |
| `name` | `text` | e.g., "Coastal Standard" |
| `multipliers` | `jsonb` | Multiplier values for seasons/weekends |

### 3. Migrating `seasonal_pricing`
We need to decide if `seasonal_pricing` remains for "Special Events" or if it's subsumed by the new engine.
- **Decision**: Keep it for "Override-like" seasonal adjustments that apply to specific properties or globally. Add `property_id` (nullable).

### 4. `price_overrides` Table
Highest priority layer.
| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | Primary Key |
| `property_id` | `uuid` | Foreign Key |
| `date` | `date` | Specific date |
| `price` | `integer` | Final price for that date |

## Migration Strategy
1. Create new tables.
2. Insert a default property representing the current "Depto Reñaca".
3. Move `PROPERTY_RENT_VALUE` from `system_config` to the new property's `base_price`.
4. Update existing `seasonal_pricing` and `bookings` to point to this new default property.
5. Update `pricing.ts` to accept an optional `propertyId` (defaulting to the first one for backward compatibility).

## Technical Risks
- **Backward Compatibility**: Existing bookings must not break.
- **Config Dependencies**: Many parts of the app might rely on `getLiveConfigServer()`. We need a way to fetch "Property Config" vs "System Config".
