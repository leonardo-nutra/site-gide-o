import { waLink } from "./site";

export type UtmData = {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  fbclid?: string;
  capturedAt: string;
};

const STORAGE_KEY = "gideao-utm";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Reads utm_* params (and fbclid) from the current URL and stores them,
 * so later WhatsApp messages and pixel events can carry campaign context.
 * Only overwrites what's already stored when the URL actually has new
 * UTM params — a direct/organic visit later in the session won't erase
 * the campaign that originally brought the visitor in.
 */
export function captureUtm() {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const keys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
  ] as const;
  const hasUtm = keys.some((k) => params.get(k));
  const fbclid = params.get("fbclid");

  if (!hasUtm && !fbclid) return;

  const data: UtmData = {
    source: params.get("utm_source") ?? undefined,
    medium: params.get("utm_medium") ?? undefined,
    campaign: params.get("utm_campaign") ?? undefined,
    term: params.get("utm_term") ?? undefined,
    content: params.get("utm_content") ?? undefined,
    fbclid: fbclid ?? undefined,
    capturedAt: new Date().toISOString(),
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore storage failures (private browsing, quota, etc.)
  }
}

export function getStoredUtm(): UtmData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UtmData) : null;
  } catch {
    return null;
  }
}

function formatUtmForMessage(utm: UtmData) {
  const parts: string[] = [];
  if (utm.source) parts.push(`origem: ${utm.source}`);
  if (utm.medium) parts.push(`mídia: ${utm.medium}`);
  if (utm.campaign) parts.push(`campanha: ${utm.campaign}`);
  if (parts.length === 0) return "";
  return `_(${parts.join(" · ")})_`;
}

function readCookie(name: string) {
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name + "=([^;]*)"),
  );
  return match ? decodeURIComponent(match[1]) : undefined;
}

/**
 * Fires the Meta Lead event, tagged with the stored campaign data. It goes out
 * twice on purpose — from the browser pixel and from our server (Conversions
 * API) — sharing one event id so Meta counts it only once.
 */
export function trackLead() {
  if (typeof window === "undefined") return;
  const utm = getStoredUtm();
  const customData = {
    content_name: "WhatsApp",
    utm_source: utm?.source,
    utm_medium: utm?.medium,
    utm_campaign: utm?.campaign,
  };
  const eventId = crypto.randomUUID();

  window.fbq?.("track", "Lead", customData, { eventID: eventId });

  try {
    navigator.sendBeacon(
      "/api/meta-event",
      new Blob(
        [
          JSON.stringify({
            eventName: "Lead",
            eventId,
            sourceUrl: window.location.href,
            fbp: readCookie("_fbp"),
            fbc: readCookie("_fbc"),
            customData,
          }),
        ],
        { type: "application/json" },
      ),
    );
  } catch {
    // Tracking must never get in the way of opening WhatsApp.
  }
}

/**
 * Builds the final wa.me link for a WhatsApp CTA at click time: fires the
 * Lead pixel event and appends the visitor's campaign origin to the
 * message so it shows up right in the chat. Returns null when there's no
 * UTM context to add (the original href is used as-is in that case).
 */
export function trackWhatsAppClick(message: string): string | null {
  trackLead();
  const utm = getStoredUtm();
  if (!utm) return null;
  const suffix = formatUtmForMessage(utm);
  return suffix ? waLink(`${message}\n\n${suffix}`) : null;
}
