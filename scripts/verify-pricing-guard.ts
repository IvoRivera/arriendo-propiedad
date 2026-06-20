import { calculateBookingPrice } from "../src/lib/pricing";
import * as schemaValidator from "../src/lib/schemaValidator";

function getErrorMessage(err: unknown) {
  return err instanceof Error ? err.message : String(err);
}

async function verifyPricingGuard() {
  console.log("====================================================");
  console.log("[SchemaGuard] Testing pricing service guard");
  console.log("====================================================");

  console.log("\nTest 1: Calculating price with healthy schema...");
  try {
    const result = await calculateBookingPrice("2026-05-01", "2026-05-05");
    console.log(`SUCCESS: Pricing calculated correctly ($${result.totalPrice})`);
  } catch (err) {
    console.error("UNEXPECTED FAILURE:", getErrorMessage(err));
  }

  console.log("\nTest 2: Simulating broken schema...");
  const originalValidate = schemaValidator.validateSchema;
  (schemaValidator as any).validateSchema = async () => ({
    success: false,
    missing: [{ table: "properties", column: "FAKE_CRITICAL_COL", exists: false }],
  });

  try {
    await calculateBookingPrice("2026-05-01", "2026-05-05");
    console.error("FAILURE: Pricing logic should have been blocked.");
  } catch (err) {
    const message = getErrorMessage(err);
    if (message.includes("[SchemaGuard]")) {
      console.log("SUCCESS: Pricing blocked as expected.");
      console.log(`Message: ${message}`);
    } else {
      console.error("WRONG ERROR:", message);
    }
  }

  (schemaValidator as any).validateSchema = originalValidate;
  console.log("\n====================================================");
}

verifyPricingGuard().catch(console.error);
