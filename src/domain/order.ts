import { z } from "zod";

/** Statuses an order moves through in the admin. */
export const ORDER_STATUSES = [
  "novo",
  "em atendimento",
  "fechado",
  "perdido",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

const text = (max: number) => z.string().trim().max(max);

const orderItemSchema = z.object({
  id: z.string().trim().min(1).max(120),
  name: z.string().trim().min(1).max(200),
  detail: text(500).optional(),
  unit: text(20).optional(),
  unitPrice: z.number().min(0).max(1_000_000).optional(),
  qty: z.number().positive().max(1_000_000),
});

/** What the cart sends when a customer submits a quote. Validated again on the server. */
export const orderInputSchema = z.object({
  items: z
    .array(orderItemSchema)
    .min(1, "O orçamento está vazio.")
    .max(100, "Itens demais."),
  subtotal: z.number().min(0).max(100_000_000),
  hasUnpricedItems: z.boolean(),
  customerName: text(120).default(""),
  paymentMethod: text(40).default(""),
  deliveryMethod: text(40).default(""),
  addressStreet: text(200).default(""),
  addressNumber: text(20).default(""),
  addressCep: text(20).default(""),
  addressReference: text(200).default(""),
  utmSource: text(120).nullish(),
  utmMedium: text(120).nullish(),
  utmCampaign: text(120).nullish(),
});

export type OrderInput = z.infer<typeof orderInputSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
