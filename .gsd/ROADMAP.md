# ROADMAP.md

> **Current Milestone**: v1.5 — Multi-Property Adaptive Pricing Engine
> **Goal**: Transform the pricing system into a scalable multi-property engine with global rules and per-property profiles.

## Must-Haves
- [ ] Global Pricing Engine (Chile coastal baseline, national events, weekend logic).
- [ ] Property Pricing Profile (location_type, luxury_tier, seasonal_sensitivity).
- [ ] Rule Composition Engine (Base × Multipliers).
- [ ] Top-Priority Override System (Manual date/property overrides).
- [ ] Admin Layer (Property creation, profile assignment, impact visualization).

## Phases

### Phase 23: Multi-Property Core Schema & Base Data
**Status**: ✅ Complete
**Objective**: Update database schema to support multiple properties and pricing profiles.
**Tasks**:
- [ ] Create `properties` table.
- [ ] Create `pricing_profiles` table.
- [ ] Migrate current single-property data (base price, etc.) to the new schema.
- [ ] Update `system_config` dependencies.

### Phase 24: Global Pricing Engine (Logic Layer)
**Status**: ⬜ Not Started
**Objective**: Refactor pricing logic into a shared engine with global rules.
**Tasks**:
- [ ] Implement Chilean coastal seasonal baseline.
- [ ] Add national holidays and special events logic.
- [ ] Implement weekend and demand multiplier logic.

### Phase 25: Property Profiles & Composition Engine
**Status**: ⬜ Not Started
**Objective**: Connect properties to profiles and implement the multiplier composition.
**Tasks**:
- [ ] Implement `location_type` (coastal/urban) multipliers.
- [ ] Implement `luxury_tier` (standard/premium) multipliers.
- [ ] Build the composition logic: `base * location * seasonal * demand`.

### Phase 26: Override System & Persistence
**Status**: ⬜ Not Started
**Objective**: Enable manual price overrides that take absolute priority.
**Tasks**:
- [ ] Create `price_overrides` table.
- [ ] Implement override detection in the pricing engine.
- [ ] Ensure persistence in Supabase.

### Phase 27: Admin UI & Verification
**Status**: ⬜ Not Started
**Objective**: Build the management interface and verify the system with multiple properties.
**Tasks**:
- [ ] Build Property/Profile management UI.
- [ ] Build Manual Override management UI.
- [ ] Add "Pricing Impact Preview" dashboard.
- [ ] Verify zero logic duplication across multiple test units.
