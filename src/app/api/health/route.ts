import { createPublicClient } from "@/lib/supabase/public";

export const dynamic = "force-dynamic";

/**
 * Health check for uptime monitors: confirms the site is up and can reach the
 * database. Reveals no data or configuration, only "ok" or "degraded".
 */
export async function GET() {
  const startedAt = Date.now();
  let database = false;

  try {
    const { error } = await createPublicClient()
      .from("products")
      .select("id", { head: true, count: "exact" })
      .limit(1);
    database = !error;
  } catch {
    database = false;
  }

  return Response.json(
    {
      status: database ? "ok" : "degraded",
      database,
      responseMs: Date.now() - startedAt,
    },
    { status: database ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}
