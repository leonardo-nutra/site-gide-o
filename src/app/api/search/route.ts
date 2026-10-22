import { searchCatalog } from "@/server/catalog/catalog.service";
import { apiHandler, clientIp } from "@/server/http/handler";
import { createRateLimiter } from "@/server/http/rate-limit";

const limiter = createRateLimiter({ limit: 120, windowMs: 60_000 });

/** GET /api/search?q=...  — searches the whole catalog (name, detail, department, specs). */
export const GET = apiHandler("api.search", async (request) => {
  limiter.check(clientIp(request));

  const query =
    new URL(request.url).searchParams.get("q")?.trim().slice(0, 80) ?? "";
  if (!query) return Response.json({ products: [], total: 0 });

  return Response.json(await searchCatalog(query), {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
});
