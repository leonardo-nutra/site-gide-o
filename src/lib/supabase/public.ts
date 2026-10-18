import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "./config";
import type { Database } from "./database.types";

/**
 * Plain, cookie-free Supabase client for anonymous/public reads (product
 * catalog on the homepage). Using this instead of the cookie-based server
 * client keeps the homepage static/ISR-cacheable — the cookie-based client
 * would force every request to be dynamic just to read public data.
 */
export function createPublicClient() {
  const { url, anonKey } = getSupabaseConfig();
  return createSupabaseClient<Database>(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
