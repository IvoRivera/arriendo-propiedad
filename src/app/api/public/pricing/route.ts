import { NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabaseServer';
import { getLiveConfigServer, validatePropertyRentValue } from '@/lib/systemConfigServer';

export async function GET() {
  try {
    // 1. Fetch base price
    const config = await getLiveConfigServer();
    let basePrice = 80000;
    try {
      basePrice = validatePropertyRentValue(config['PROPERTY_RENT_VALUE']);
    } catch (err) {
      console.warn('[PublicPricingAPI] Could not fetch base price:', err);
    }

    // 2. Fetch active and future seasonal prices
    const { data: seasonalPrices, error } = await supabaseService
      .from('seasonal_pricing')
      .select('start_date, end_date, price_per_night, season_name, priority')
      .gte('end_date', new Date().toISOString().split('T')[0]);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: {
        basePrice,
        seasonalPrices: seasonalPrices || []
      }
    });
  } catch (err: any) {
    console.error('[PublicPricingAPI] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
