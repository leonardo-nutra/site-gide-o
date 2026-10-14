/**
 * Anonymous record of what visitors do on the site (opened a product, added to
 * the quote, searched, clicked WhatsApp). It answers "do people look around or
 * give up?" and is read in the admin, under "Análise".
 *
 * No names, e-mails or cookies: just a random id that lives while the tab is open.
 * To keep your own visits out of the numbers, open the site once with
 * `?notrack=1` in the address (use `?notrack=0` to count yourself again).
 */
export type SiteEvent =
  | "visit"
  | "product_view"
  | "add_to_cart"
  | "cart_open"
  | "whatsapp_click"
  | "search";

type EventData = {
  productId?: string;
  productName?: string;
  query?: string;
  value?: number;
};

const SESSION_KEY = "gideao-sid";
const NO_TRACK_KEY = "gideao-no-track";
const UTM_KEY = "gideao-utm";

function safeStorage(kind: "session" | "local") {
  try {
    return kind === "session" ? window.sessionStorage : window.localStorage;
  } catch {
    return null;
  }
}

function sessionId() {
  const store = safeStorage("session");
  let id = store?.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    store?.setItem(SESSION_KEY, id);
  }
  return id;
}

/** Applies ?notrack=1 / ?notrack=0 from the address and says whether tracking is off. */
export function trackingDisabled() {
  if (typeof window === "undefined") return true;
  const local = safeStorage("local");
  const flag = new URLSearchParams(window.location.search).get("notrack");
  if (flag === "1") local?.setItem(NO_TRACK_KEY, "1");
  if (flag === "0") local?.removeItem(NO_TRACK_KEY);
  return local?.getItem(NO_TRACK_KEY) === "1";
}

function readUtm() {
  try {
    const raw = safeStorage("local")?.getItem(UTM_KEY);
    return raw
      ? (JSON.parse(raw) as {
          source?: string;
          medium?: string;
          campaign?: string;
        })
      : null;
  } catch {
    return null;
  }
}

export function logEvent(event: SiteEvent, data: EventData = {}) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (typeof window === "undefined" || !url || !key || trackingDisabled())
    return;

  const utm = readUtm();
  const row = {
    session_id: sessionId(),
    event,
    path: window.location.pathname.slice(0, 200),
    product_id: data.productId,
    product_name: data.productName?.slice(0, 200),
    query: data.query?.slice(0, 80),
    value: data.value,
    device: window.matchMedia("(max-width: 767px)").matches
      ? "mobile"
      : "desktop",
    utm_source: utm?.source?.slice(0, 80),
    utm_medium: utm?.medium?.slice(0, 80),
    utm_campaign: utm?.campaign?.slice(0, 120),
  };

  // Plain fetch (no library) keeps the page light; keepalive lets it finish
  // even when the click opens WhatsApp in another tab.
  fetch(`${url}/rest/v1/site_events`, {
    method: "POST",
    keepalive: true,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(row),
  }).catch(() => {
    // Never let tracking break the page.
  });
}

/** Logs one "visit" per browser tab session. */
export function logVisitOnce() {
  const store = safeStorage("session");
  if (store?.getItem("gideao-visit-logged")) return;
  store?.setItem("gideao-visit-logged", "1");
  logEvent("visit");
}
