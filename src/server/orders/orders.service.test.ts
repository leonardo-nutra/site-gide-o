import { describe, expect, it } from "vitest";
import { orderInputSchema } from "@/domain/order";
import { priceOrderItems } from "./orders.service";

const catalog = [
  { id: "piso-a", price: "17,90" },
  { id: "tinta-b", price: "1.234,50" },
];

describe("priceOrderItems", () => {
  it("takes prices from the catalog, ignoring what the browser sent", () => {
    const result = priceOrderItems(
      [
        { id: "piso-a", name: "Piso A", unitPrice: 1, qty: 10 }, // tampered price
        { id: "tinta-b", name: "Tinta B", unitPrice: 999, qty: 2 },
      ],
      catalog,
    );

    expect(result.items.map((item) => item.unitPrice)).toEqual([17.9, 1234.5]);
    expect(result.subtotal).toBe(2648); // 17,90 x 10 + 1.234,50 x 2
    expect(result.hasUnpricedItems).toBe(false);
  });

  it("keeps items it does not know and flags the ones without a price", () => {
    const result = priceOrderItems(
      [
        { id: "desconhecido", name: "Sob consulta", qty: 3 },
        { id: "piso-a", name: "Piso A", qty: 1 },
      ],
      catalog,
    );

    expect(result.subtotal).toBe(17.9);
    expect(result.hasUnpricedItems).toBe(true);
  });

  it("rounds to cents", () => {
    const result = priceOrderItems(
      [{ id: "x", name: "X", unitPrice: 0.1, qty: 3 }],
      [],
    );
    expect(result.subtotal).toBe(0.3);
  });
});

describe("orderInputSchema", () => {
  const valid = {
    items: [{ id: "piso-a", name: "Piso A", unitPrice: 17.9, qty: 10 }],
    subtotal: 179,
    hasUnpricedItems: false,
  };

  it("accepts a normal quote and fills the optional fields", () => {
    const parsed = orderInputSchema.parse(valid);
    expect(parsed.customerName).toBe("");
    expect(parsed.addressStreet).toBe("");
  });

  it("rejects empty quotes, absurd quantities and oversized texts", () => {
    expect(orderInputSchema.safeParse({ ...valid, items: [] }).success).toBe(
      false,
    );
    expect(
      orderInputSchema.safeParse({
        ...valid,
        items: [{ ...valid.items[0], qty: 0 }],
      }).success,
    ).toBe(false);
    expect(
      orderInputSchema.safeParse({ ...valid, customerName: "x".repeat(500) })
        .success,
    ).toBe(false);
  });
});
