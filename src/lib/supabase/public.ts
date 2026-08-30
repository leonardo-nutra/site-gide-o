import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Plain, cookie-free Supabase client for anonymous/public reads (product
 * catalog on the homepage). Using this instead of the cookie-based server
 * client keeps the homepage static/ISR-cacheable — the cookie-based client
 * would force every request to be dynamic just to read public data.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
