import { createClient } from "@/lib/supabase/client";
import { getStoredUtm } from "@/lib/tracking";
import type { CartItem } from "@/lib/cart-context";

export type OrderInput = {
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
 * Logs a submitted quote to Supabase so it isn't lost if the customer
 * never actually sends the WhatsApp message. Best-effort: never blocks or
 * breaks the WhatsApp redirect if it fails (offline, RLS misconfig, etc).
 */
export function saveOrder(input: OrderInput) {
  try {
    const supabase = createClient();
    const utm = getStoredUtm();

    supabase
      .from("orders")
      .insert({
        customer_name: input.customerName,
        payment_method: input.paymentMethod,
        delivery_method: input.deliveryMethod,
        address_street: input.addressStreet ?? "",
        address_number: input.addressNumber ?? "",
        address_cep: input.addressCep ?? "",
        address_reference: input.addressReference ?? "",
        items: input.items,
        subtotal: input.subtotal,
        has_unpriced: input.hasUnpricedItems,
        utm_source: utm?.source ?? null,
        utm_medium: utm?.medium ?? null,
        utm_campaign: utm?.campaign ?? null,
      })
      .then(({ error }) => {
        if (error) console.error("Falha ao salvar pedido no Supabase:", error.message);
      });
  } catch (err) {
    console.error("Falha ao salvar pedido no Supabase:", err);
  }
}
