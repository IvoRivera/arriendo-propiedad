# Summary 35.2: Services Validation

## Deliverables
- Confirmed that Pricing and Image services are fully dynamic.
- Validated that `SchemaGuard` is protecting critical API routes.

## Findings
- **Pricing API**: Uses `SchemaGuard` and fetches from `seasonal_pricing`, `price_overrides` and `system_config`. No dependencies on static data.
- **Image Service**: Uses `SchemaGuard` and fetches from `images` table. Fully dynamic management (upload, delete, reorder).
- **Fallbacks**: `CoastalHero` and other components use `ConfigProvider.getValue()` as a primary source, falling back to `SITE_CONTENT`.

## Verification
- API routes reviewed for static data leaks: None found.
- DB services confirm dynamic operation.
