import { getServerEnv } from "@/server/config/env";
import { createPublicClient } from "@/server/db/public";

export const dynamic = "force-dynamic";

/**
 * Health check for uptime monitors: confirms the site is configured and can
 * reach the database. Reveals no data, only "ok" or "degraded" per component.
 */
export async function GET() {
  const startedAt = Date.now();

  let config = true;
  try {
    getServerEnv();
  } catch {
    config = false;
  }

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

  const healthy = config && database;
  return Response.json(
    {
      status: healthy ? "ok" : "degraded",
      checks: { config, database },
      responseMs: Date.now() - startedAt,
    },
    { status: healthy ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}
