import { calculateBookingPrice } from '../src/lib/pricing';
import * as schemaValidator from '../src/lib/schemaValidator';

async function verifyPricingGuard() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(' [SchemaGuard] TESTING PRICING SERVICE GUARD');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // 1. Test Positive Case (Schema should be OK)
  console.log('\n 🧪 Test 1: Calculating price with healthy schema...');
  try {
    const result = await calculateBookingPrice('2026-05-01', '2026-05-05');
    console.log(` ✅ SUCCESS: Pricing calculated correctly ($${result.totalPrice})`);
  } catch (err) {
    console.error(' ❌ UNEXPECTED FAILURE:', err.message);
  }

  // 2. Test Negative Case (Injecting a fake missing column)
  console.log('\n 🧪 Test 2: Simulating broken schema (injecting missing column)...');
  
  // Mock the validateSchema function to return failure
  const originalValidate = schemaValidator.validateSchema;
  (schemaValidator as any).validateSchema = async () => ({
    success: false,
    missing: [{ table: 'properties', column: 'FAKE_CRITICAL_COL', exists: false }]
  });

  try {
    await calculateBookingPrice('2026-05-01', '2026-05-05');
    console.error(' ❌ FAILURE: Pricing logic should have been blocked!');
  } catch (err) {
    if (err.message.includes('[SchemaGuard]')) {
      console.log(' ✅ SUCCESS: Pricing blocked as expected.');
      console.log(`    Message: ${err.message}`);
    } else {
      console.error(' ❌ WRONG ERROR:', err.message);
    }
  }

  // Restore original function
  (schemaValidator as any).validateSchema = originalValidate;
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

verifyPricingGuard().catch(console.error);
