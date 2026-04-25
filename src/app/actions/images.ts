"use server";

import { revalidateTag } from "next/cache";

/**
 * Revalidates the public images cache.
 * Call this after any image modification (upload, delete, reorder).
 */
export async function revalidateImages() {
  revalidateTag("images-all");
  console.log("Images cache revalidated");
}
