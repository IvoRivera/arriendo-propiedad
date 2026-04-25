import { NextRequest, NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabaseServer';
import { getPropertyBaseConfig, validatePropertyRentValue } from '@/lib/systemConfigServer';
import { validateSchema } from '@/lib/schemaValidator';

export async function GET(request: NextRequest) {
  try {
    // [SchemaGuard] Early Integrity Check
    const schema = await validateSchema();
    if (!schema.success) {
      const missing = schema.missing.map(m => `${m.table}.${m.column}`).join(', ');
      throw new Error(`[SchemaGuard] [PricingAPI] Inconsistencia detectada. Faltan: ${missing}`);
    }

    const searchParams = request.nextUrl.searchParams;
    const propertyId = searchParams.get('propertyId') || undefined;
    const propertySlug = searchParams.get('propertySlug') || undefined;

    // 1. Fetch property base config
    const property = await getPropertyBaseConfig(
      propertyId ? { id: propertyId } : (propertySlug ? { slug: propertySlug } : undefined)
    );
    
    const basePrice = validatePropertyRentValue(property?.base_price ?? 80000);

    // 2. Fetch active and future seasonal prices (for this property OR global)
    let seasonalQuery = supabaseService
      .from('seasonal_pricing')
      .select('start_date, end_date, price_per_night, season_name, priority, property_id')
      .gte('end_date', new Date().toISOString().split('T')[0]);
    
    if (property?.id) {
      seasonalQuery = seasonalQuery.or(`property_id.eq.${property.id},property_id.is.null`);
    } else {
      seasonalQuery = seasonalQuery.is('property_id', null);
    }

    const { data: seasonalPrices, error } = await seasonalQuery;
    if (error) throw error;

    // 3. Fetch overrides
    const { data: overrides } = await supabaseService
      .from('price_overrides')
      .select('date, price, reason')
      .eq('property_id', property?.id)
      .gte('date', new Date().toISOString().split('T')[0]);

    return NextResponse.json({
      success: true,
      data: {
        property: property ? { id: property.id, name: property.name, slug: property.slug } : null,
        basePrice,
        seasonalPrices: seasonalPrices || [],
        overrides: overrides || []
      }
    });
  } catch (err: any) {
    console.error('[PublicPricingAPI] Error:', err);
    
    if (err.message.includes('[SchemaGuard]')) {
      return NextResponse.json(
        { success: false, error: err.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
