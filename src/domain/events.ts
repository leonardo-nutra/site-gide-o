/** Visitor behaviour events recorded anonymously (see docs/BACKEND.md, "Análise"). */
export const SITE_EVENTS = [
  "visit",
  "product_view",
  "add_to_cart",
  "cart_open",
  "whatsapp_click",
  "search",
] as const;

export type SiteEvent = (typeof SITE_EVENTS)[number];
