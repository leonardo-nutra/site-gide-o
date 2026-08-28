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
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
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

/** Fires the Meta Pixel Lead event, tagged with the stored campaign data. */
export function trackLead() {
  if (typeof window === "undefined" || !window.fbq) return;
  const utm = getStoredUtm();
  window.fbq("track", "Lead", {
    content_name: "WhatsApp",
    utm_source: utm?.source,
    utm_medium: utm?.medium,
    utm_campaign: utm?.campaign,
  });
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
