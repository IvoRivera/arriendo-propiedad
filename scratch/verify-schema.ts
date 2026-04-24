import { createClient } from '@supabase/supabase-js';
// process.env will be loaded via --env-file flag

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
  console.log('Checking seasonal_pricing table...');
  const { data: tableData, error: tableError } = await supabase
    .from('seasonal_pricing')
    .select('*')
    .limit(1);

  if (tableError) {
    console.error('Error fetching seasonal_pricing:', tableError.message);
    if (tableError.code === '42P01') {
      console.log('❌ seasonal_pricing table does not exist.');
    }
  } else {
    console.log('✅ seasonal_pricing table exists.');
  }

  console.log('Checking reservation_requests columns...');
  const { data: resData, error: resError } = await supabase
    .from('reservation_requests')
    .select('total_price, price_breakdown')
    .limit(1);

  if (resError) {
    console.error('Error fetching reservation_requests columns:', resError.message);
  } else {
    console.log('✅ total_price and price_breakdown columns exist in reservation_requests.');
  }
}

verify();
