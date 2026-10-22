import "server-only";
import type { OrderInput } from "@/domain/order";
import { parsePrice } from "@/domain/money";
import { getCachedCatalog } from "../catalog/catalog.service";
import { createPublicClient } from "../db/public";
import { UpstreamError } from "../http/errors";
import { logger } from "../observability/logger";

/**
 * Prices come from the catalog, not from whatever the browser sent: a tampered
 * cart can't record a different price. Unknown items keep the price they came with.
 */
export function priceOrderItems(
  items: OrderInput["items"],
  catalog: { id: string; price: string }[],
) {
  const priceById = new Map(
    catalog.map((product) => [product.id, parsePrice(product.price)]),
  );

  const priced = items.map((item) => {
    const catalogPrice = priceById.get(item.id);
    return catalogPrice === undefined
      ? item
      : { ...item, unitPrice: catalogPrice };
  });

  const subtotal = priced.reduce(
    (sum, item) => sum + (item.unitPrice ?? 0) * item.qty,
    0,
  );
  return {
    items: priced,
    subtotal: Math.round(subtotal * 100) / 100,
    hasUnpricedItems: priced.some((item) => item.unitPrice === undefined),
  };
}

/** Records a quote submitted from the cart so it isn't lost if WhatsApp never gets the message. */
export async function createOrder(input: OrderInput) {
  const { items, subtotal, hasUnpricedItems } = priceOrderItems(
    input.items,
    await getCachedCatalog(),
  );

  if (Math.abs(subtotal - input.subtotal) > 0.01) {
    logger.warn("orders.subtotal_corrected", {
      sent: input.subtotal,
      computed: subtotal,
    });
  }

  const { error } = await createPublicClient()
    .from("orders")
    .insert({
      customer_name: input.customerName,
      payment_method: input.paymentMethod,
      delivery_method: input.deliveryMethod,
      address_street: input.addressStreet,
      address_number: input.addressNumber,
      address_cep: input.addressCep,
      address_reference: input.addressReference,
      items,
      subtotal,
      has_unpriced: hasUnpricedItems,
      utm_source: input.utmSource ?? null,
      utm_medium: input.utmMedium ?? null,
      utm_campaign: input.utmCampaign ?? null,
    });

  if (error) {
    logger.error("orders.insert_failed", new Error(error.message), {
      code: error.code,
    });
    throw new UpstreamError("Não foi possível registrar o orçamento.");
  }
}
