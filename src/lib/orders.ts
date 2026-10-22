import { getStoredUtm } from "@/lib/tracking";
import type { CartItem } from "@/lib/cart-context";

export type OrderDraft = {
  items: CartItem[];
  subtotal: number;
  hasUnpricedItems: boolean;
  customerName: string;
  paymentMethod: string;
  deliveryMethod: string;
  addressStreet?: string;
  addressNumber?: string;
  addressCep?: string;
  addressReference?: string;
};

/**
 * Sends a submitted quote to the server so it isn't lost if the customer never
 * actually sends the WhatsApp message. The server validates it and re-prices the
 * items from the catalog. Best-effort: never blocks or breaks the WhatsApp redirect.
 */
export function saveOrder(draft: OrderDraft) {
  try {
    const utm = getStoredUtm();

    fetch("/api/orders", {
      method: "POST",
      keepalive: true, // lets the request finish even as WhatsApp opens in another tab
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: draft.items,
        subtotal: draft.subtotal,
        hasUnpricedItems: draft.hasUnpricedItems,
        customerName: draft.customerName,
        paymentMethod: draft.paymentMethod,
        deliveryMethod: draft.deliveryMethod,
        addressStreet: draft.addressStreet ?? "",
        addressNumber: draft.addressNumber ?? "",
        addressCep: draft.addressCep ?? "",
        addressReference: draft.addressReference ?? "",
        utmSource: utm?.source ?? null,
        utmMedium: utm?.medium ?? null,
        utmCampaign: utm?.campaign ?? null,
      }),
    }).catch(() => {
      // Offline or blocked: the customer still gets to WhatsApp.
    });
  } catch {
    // Never let order logging get in the way of the quote.
  }
}
