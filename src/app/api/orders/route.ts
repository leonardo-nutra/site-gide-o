import { orderInputSchema } from "@/domain/order";
import { AppError } from "@/server/http/errors";
import { apiHandler, clientIp, parseJson } from "@/server/http/handler";
import { createRateLimiter } from "@/server/http/rate-limit";
import { createOrder } from "@/server/orders/orders.service";

const limiter = createRateLimiter({ limit: 10, windowMs: 60_000 });

/** POST /api/orders — records a quote the customer is sending to WhatsApp. */
export const POST = apiHandler("api.orders", async (request) => {
  limiter.check(clientIp(request));

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host || new URL(origin).host !== host)
    throw new AppError("Origem não permitida.", 403, "forbidden");

  await createOrder(await parseJson(request, orderInputSchema));
  return new Response(null, { status: 201 });
});
