import "server-only";
import type { Database } from "@/lib/supabase/database.types";
import { createClient } from "../db/session";

type Functions = Database["public"]["Functions"];
export type FunnelDay = Functions["site_funnel_daily"]["Returns"][number];
export type TopProduct = Functions["site_top_products"]["Returns"][number];
export type TopSearch = Functions["site_top_searches"]["Returns"][number];

/**
 * Visitor analytics for the admin. The database functions run as the signed-in
 * user and RLS only lets admins read the events, so a non-admin gets an error.
 */
export async function getAnalytics(days: number) {
  const supabase = await createClient();
  const [funnel, products, searches] = await Promise.all([
    supabase.rpc("site_funnel_daily", { days }),
    supabase.rpc("site_top_products", { days }),
    supabase.rpc("site_top_searches", { days }),
  ]);

  return {
    funnel: funnel.data ?? [],
    topProducts: products.data ?? [],
    topSearches: searches.data ?? [],
    failed: Boolean(funnel.error || products.error || searches.error),
  };
}
