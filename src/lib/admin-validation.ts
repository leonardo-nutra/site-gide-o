import { z } from "zod";
import { categories } from "@/lib/site";

/** An error whose message is safe and useful to show to the admin. */
export class ActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ActionError";
  }
}

const categoryIds = categories.map((c) => c.id) as [string, ...string[]];
export const ORDER_STATUSES = [
  "novo",
  "em atendimento",
  "fechado",
  "perdido",
] as const;
export const BANNER_PLACEMENTS = [
  "hero",
  "secondary",
  "offers",
  "duo",
] as const;

const money = z
  .string()
  .trim()
  .min(1, "Informe o preço.")
  .transform((value) => Number(value.replace(",", ".")))
  .pipe(
    z
      .number("Preço inválido.")
      .min(0, "O preço não pode ser negativo.")
      .max(1_000_000, "Preço alto demais."),
  );

const sortOrder = z
  .string()
  .trim()
  .transform((value) => (value === "" ? 0 : Number(value)))
  .pipe(
    z
      .number("Ordem inválida.")
      .int("A ordem precisa ser um número inteiro.")
      .min(0)
      .max(1_000_000),
  );

const shortText = (label: string, max: number) =>
  z.string().trim().max(max, `${label}: no máximo ${max} caracteres.`);

/** Only same-site paths or https links: blocks javascript: and other odd schemes. */
const safeLink = z
  .string()
  .trim()
  .max(500, "Link longo demais.")
  .refine(
    (value) =>
      value === "" || value.startsWith("/") || /^https?:\/\//i.test(value),
    {
      message: "O link precisa começar com / (página do site) ou https://.",
    },
  );

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Informe o nome do produto.")
    .max(200, "Nome longo demais."),
  detail: shortText("Detalhe", 500),
  price: money,
  unit: z
    .string()
    .trim()
    .min(1, "Informe a unidade (m², un, kg...).")
    .max(20, "Unidade longa demais."),
  category: z.enum(categoryIds, "Escolha um departamento válido."),
  material: shortText("Material", 120),
  measure: shortText("Medida", 120),
  sort_order: sortOrder,
  active: z.boolean(),
  featured: z.boolean(),
});

export const newProductSchema = productSchema.extend({
  slug: z
    .string()
    .trim()
    .min(2, "Informe o código (slug) do produto.")
    .max(80, "Código longo demais.")
    .regex(
      /^[a-z0-9][a-z0-9_-]*$/,
      "O código só pode ter letras minúsculas sem acento, números, - e _.",
    ),
});

export const bannerSchema = z.object({
  title: shortText("Título", 120),
  image: z
    .string()
    .trim()
    .min(1, "Informe o endereço da imagem.")
    .max(500, "Endereço da imagem longo demais.")
    .refine((value) => value.startsWith("/") || /^https:\/\//i.test(value), {
      message: "A imagem precisa começar com / ou https://.",
    }),
  link: safeLink,
  placement: z.enum(BANNER_PLACEMENTS, "Posição do banner inválida."),
  sort_order: sortOrder,
  active: z.boolean(),
});

export const orderStatusSchema = z.enum(ORDER_STATUSES, "Status inválido.");

/** Reads a form into the plain values the schemas expect (checkboxes become booleans). */
export function readForm(formData: FormData, booleans: string[] = []) {
  const values: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") values[key] = value;
  }
  for (const key of booleans) values[key] = formData.get(key) === "on";
  return values;
}

/** Parses with a schema; throws the first problem as a readable message. */
export function parseOrFail<T extends z.ZodType>(
  schema: T,
  values: unknown,
): z.output<T> {
  const result = schema.safeParse(values);
  if (!result.success) {
    throw new ActionError(
      result.error.issues[0]?.message ?? "Dados inválidos.",
    );
  }
  return result.data;
}

/** Turns the admin's "Rótulo: Valor" lines into the specs jsonb shape. */
export function parseSpecs(raw: string) {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 30)
    .map((line) => {
      const [label, ...rest] = line.split(":");
      return {
        label: label.trim().slice(0, 60),
        value: rest.join(":").trim().slice(0, 120),
      };
    })
    .filter((spec) => spec.label && spec.value);
}

export const MEDIA_LIMITS = {
  images: {
    maxBytes: 5 * 1024 * 1024,
    types: ["image/jpeg", "image/png", "image/webp", "image/avif"],
  },
  videos: {
    maxBytes: 50 * 1024 * 1024,
    types: ["video/mp4", "video/webm", "video/quicktime"],
  },
} as const;
