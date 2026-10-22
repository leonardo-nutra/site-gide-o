import "server-only";
import { z } from "zod";
import { getServerEnv } from "../config/env";
import { UpstreamError } from "../http/errors";
import { logger } from "../observability/logger";

/** Events the browser may ask the server to forward to Meta. */
export const metaEventSchema = z.object({
  eventName: z.enum(["Lead"]),
  eventId: z.string().max(80).optional(),
  sourceUrl: z.string().max(500).optional(),
  fbp: z.string().max(120).optional(),
  fbc: z.string().max(200).optional(),
  customData: z.record(z.string(), z.string().max(120).optional()).optional(),
});

export type MetaEventInput = z.infer<typeof metaEventSchema>;

type RequestContext = { ip?: string; userAgent?: string };

/** Pure: the exact payload Meta's Conversions API expects. */
export function buildMetaPayload(
  input: MetaEventInput,
  context: RequestContext,
  now = Date.now(),
  testEventCode?: string,
) {
  const customData = Object.fromEntries(
    Object.entries(input.customData ?? {}).filter(
      (entry): entry is [string, string] => Boolean(entry[1]),
    ),
  );

  return {
    data: [
      {
        event_name: input.eventName,
        event_time: Math.floor(now / 1000),
        event_id: input.eventId,
        event_source_url: input.sourceUrl,
        action_source: "website",
        user_data: {
          client_ip_address: context.ip,
          client_user_agent: context.userAgent,
          fbp: input.fbp,
          fbc: input.fbc,
        },
        custom_data: customData,
      },
    ],
    ...(testEventCode ? { test_event_code: testEventCode } : {}),
  };
}

/** True when the server-side tracking is configured (token and pixel present). */
export function isMetaCapiConfigured() {
  const env = getServerEnv();
  return Boolean(env.META_CAPI_TOKEN && env.NEXT_PUBLIC_META_PIXEL_ID);
}

/** Sends one event through the Conversions API. Does nothing when it isn't configured. */
export async function sendMetaEvent(
  input: MetaEventInput,
  context: RequestContext,
) {
  const env = getServerEnv();
  if (!env.META_CAPI_TOKEN || !env.NEXT_PUBLIC_META_PIXEL_ID) return false;

  const response = await fetch(
    `https://graph.facebook.com/v21.0/${env.NEXT_PUBLIC_META_PIXEL_ID}/events?access_token=${encodeURIComponent(env.META_CAPI_TOKEN)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        buildMetaPayload(input, context, Date.now(), env.META_TEST_EVENT_CODE),
      ),
    },
  );

  if (!response.ok) {
    logger.error("meta_capi.rejected", new Error(`HTTP ${response.status}`), {
      status: response.status,
    });
    throw new UpstreamError("A Meta recusou o evento.");
  }
  return true;
}
