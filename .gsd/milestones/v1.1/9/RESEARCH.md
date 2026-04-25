# RESEARCH.md - Phase 9: Dynamic Pricing System

## Context
The current system uses a static `PROPERTY_RENT_VALUE` from the configuration. The user wants to implement seasonal pricing with priorities and date ranges.

## Findings

### 1. Database Schema (Supabase)
We need a new table `seasonal_pricing`.

```sql
CREATE TABLE seasonal_pricing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  price_per_night NUMERIC NOT NULL,
  season_name TEXT NOT NULL,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent negative prices
  CONSTRAINT positive_price CHECK (price_per_night > 0),
  -- Ensure valid date range
  CONSTRAINT valid_range CHECK (start_date <= end_date)
);
```

### 2. Overlap and Priority Logic
The user mentioned two options:
1. Higher priority wins.
2. Most specific wins (shorter range).

**Decision**: Use **Priority** first, then **Most Specific** (shorter range) as a tie-breaker. This gives the admin absolute control via the `priority` field while having a sensible default for nested ranges.

#### Calculation Algorithm (Pseudocode):
```javascript
function calculatePrice(checkIn, checkOut, basePrice) {
  let total = 0;
  let breakdown = [];
  
  for (let d = checkIn; d < checkOut; d++) {
    const applicablePrices = db.query(
      "SELECT * FROM seasonal_pricing WHERE start_date <= d AND end_date >= d ORDER BY priority DESC, (end_date - start_date) ASC LIMIT 1"
    );
    
    const nightPrice = applicablePrices.length > 0 ? applicablePrices[0].price_per_night : basePrice;
    total += nightPrice;
    breakdown.push({ date: d, price: nightPrice, name: applicablePrices[0]?.season_name || "Base" });
  }
  
  return { total, breakdown };
}
```

### 3. Snapshotting Rules
When a reservation request is created, we must store the `total_price` and the `price_breakdown` (JSONB) in the `booking_requests` table to freeze the price.

### 4. Integration Points
- **Backend Utility**: A reusable function `getPricingForRange(start, end)` to be used in API routes.
- **Admin UI**: A new section in the admin dashboard to manage these ranges.
- **Frontend Calendar**: Fetch dynamic prices for the visible month and display them in the `CoastalAvailability` component.

## Recommendations
- Implement a Postgres Function (RPC) to calculate the price range efficiently on the server.
- Add a visual warning in the Admin UI if a new range overlaps with an existing one of higher priority.
- Update `CoastalHero` to show "Desde $minPrice" by querying the minimum price in the current/next 3 months.
