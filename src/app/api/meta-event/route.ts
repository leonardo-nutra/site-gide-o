import { apiHandler, clientIp, parseJson } from "@/server/http/handler";
import { AppError } from "@/server/http/errors";
import { createRateLimiter } from "@/server/http/rate-limit";
import {
  isMetaCapiConfigured,
  metaEventSchema,
  sendMetaEvent,
} from "@/server/marketing/meta-capi";

const limiter = createRateLimiter({ limit: 30, windowMs: 60_000 });

/** GET: whether server-side tracking is set up (reveals nothing secret). */
export const GET = apiHandler("api.meta_event.status", async () =>
  Response.json({ configured: isMetaCapiConfigured() }),
);

/** POST: forwards a visitor event (currently "Lead") to Meta's Conversions API. */
export const POST = apiHandler("api.meta_event", async (request) => {
  limiter.check(clientIp(request));

  // Only pages of this same site may send events.
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host || new URL(origin).host !== host)
    throw new AppError("Origem não permitida.", 403, "forbidden");

  const input = await parseJson(request, metaEventSchema);
  await sendMetaEvent(input, {
    ip: clientIp(request),
    userAgent: request.headers.get("user-agent") ?? undefined,
  });

  return new Response(null, { status: 204 });
});
