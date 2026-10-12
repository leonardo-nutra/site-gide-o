/**
 * Sends a Meta (Facebook) "Conversions API" event from the server, so the
 * campaign still gets the lead when the visitor's browser blocks the pixel.
 *
 * Needs two environment variables on the host (never in the code):
 *   META_CAPI_TOKEN        access token generated in Meta Events Manager
 *   META_TEST_EVENT_CODE   optional; only while testing (events then show up in
 *                          the "Test events" tab instead of counting for ads)
 * Without the token this endpoint does nothing.
 */
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const ALLOWED_EVENTS = new Set(["Lead"]);

type Payload = {
  eventName?: string;
  eventId?: string;
  sourceUrl?: string;
  fbp?: string;
  fbc?: string;
  customData?: Record<string, string | undefined>;
};

function clean(value: unknown, max = 300) {
  return typeof value === "string" && value ? value.slice(0, max) : undefined;
}

export async function GET() {
  // Lets you check the setup without exposing anything secret.
  return Response.json({
    configured: Boolean(process.env.META_CAPI_TOKEN && PIXEL_ID),
  });
}

export async function POST(request: Request) {
  const token = process.env.META_CAPI_TOKEN;
  if (!token || !PIXEL_ID) return new Response(null, { status: 204 });

  // Only accept events sent by pages of this same site.
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host || new URL(origin).host !== host) {
    return new Response(null, { status: 403 });
  }

  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return new Response(null, { status: 400 });
  }

  const eventName = clean(body.eventName, 40);
  if (!eventName || !ALLOWED_EVENTS.has(eventName))
    return new Response(null, { status: 400 });

  const custom: Record<string, string> = {};
  for (const [key, value] of Object.entries(body.customData ?? {})) {
    const text = clean(value, 120);
    if (text) custom[key] = text;
  }

  const forwardedFor = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: clean(body.eventId, 80),
        event_source_url: clean(body.sourceUrl, 500),
        action_source: "website",
        user_data: {
          client_ip_address: forwardedFor,
          client_user_agent: request.headers.get("user-agent") ?? undefined,
          fbp: clean(body.fbp, 120),
          fbc: clean(body.fbc, 200),
        },
        custom_data: custom,
      },
    ],
  };
  if (process.env.META_TEST_EVENT_CODE)
    payload.test_event_code = process.env.META_TEST_EVENT_CODE;

  const response = await fetch(
    `https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  return new Response(null, { status: response.ok ? 204 : 502 });
}
