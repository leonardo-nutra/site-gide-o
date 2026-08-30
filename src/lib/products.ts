import { createPublicClient } from "@/lib/supabase/public";

export type ProductSpec = { label: string; value: string };

export type Product = {
  id: string;
  name: string;
  detail: string;
  price: string;
  unit: string;
  image: string;
  /**
   * Illustrative "as installed" reference photo — a generic environment
   * shot in a similar tone, not a photo of this exact batch/lot.
   */
  applicationImage: string;
  specs: ProductSpec[];
};

/** Used only if the Supabase catalog is unreachable or empty. */
const fallbackProducts: Product[] = [
  {
    id: "piso-1",
    name: "Piso Polido Retificado",
    detail: "Acabamento polido de alto brilho",
    price: "49,90",
    unit: "m²",
    image: "/images/produtos/piso-1.jpg",
    applicationImage: "/images/ambiente/retificado.jpg",
    specs: [
      { label: "Acabamento", value: "Polido de alto brilho" },
      { label: "Tipo", value: "Retificado" },
      { label: "Aplicação", value: "Piso e parede internos" },
    ],
  },
  {
    id: "piso-9",
    name: "Piso 45x89 Lume",
    detail: "Mármore claro com veios dourados",
    price: "45,90",
    unit: "m²",
    image: "/images/produtos/piso-9.jpg",
    applicationImage: "/images/ambiente/lume.jpg",
    specs: [
      { label: "Dimensões", value: "45x89 cm" },
      { label: "Acabamento", value: "Polido" },
      { label: "Cor", value: "Mármore claro com veios dourados" },
      { label: "Aplicação", value: "Piso interno" },
    ],
  },
  {
    id: "piso-4",
    name: "Piso Karina Polido",
    detail: "Preto com veios dourados, alto padrão",
    price: "52,90",
    unit: "m²",
    image: "/images/produtos/piso-4.jpg",
    applicationImage: "/images/ambiente/karina-preto-dourado.jpg",
    specs: [
      { label: "Acabamento", value: "Polido" },
      { label: "Cor", value: "Preto com veios dourados" },
      { label: "Aplicação", value: "Piso interno, alto padrão" },
    ],
  },
  {
    id: "piso-2",
    name: "Piso 75x75 Lumina Bege Karina",
    detail: "Tom bege claro, polido",
    price: "45,90",
    unit: "m²",
    image: "/images/produtos/piso-2.jpg",
    applicationImage: "/images/ambiente/lumina-bege.jpg",
    specs: [
      { label: "Dimensões", value: "75x75 cm" },
      { label: "Acabamento", value: "Polido" },
      { label: "Cor", value: "Bege claro" },
      { label: "Aplicação", value: "Piso interno" },
    ],
  },
  {
    id: "piso-5",
    name: "Piso 75x75 Majestic",
    detail: "Branco com veios pretos e dourados",
    price: "45,90",
    unit: "m²",
    image: "/images/produtos/piso-5.jpg",
    applicationImage: "/images/ambiente/majestic.jpg",
    specs: [
      { label: "Dimensões", value: "75x75 cm" },
      { label: "Acabamento", value: "Polido" },
      { label: "Cor", value: "Branco com veios pretos e dourados" },
      { label: "Aplicação", value: "Piso interno" },
    ],
  },
  {
    id: "piso-7",
    name: "Piso Cerâmico Black Gold HD",
    detail: "Preto com veios dourados HD",
    price: "47,90",
    unit: "m²",
    image: "/images/produtos/piso-7.jpg",
    applicationImage: "/images/ambiente/karina-preto-dourado.jpg",
    specs: [
      { label: "Material", value: "Cerâmico" },
      { label: "Acabamento", value: "HD" },
      { label: "Cor", value: "Preto com veios dourados" },
      { label: "Aplicação", value: "Piso interno" },
    ],
  },
  {
    id: "piso-6",
    name: "Piso Extra Onix Blue 75x75",
    detail: "Efeito ônix azulado, polido",
    price: "45,90",
    unit: "m²",
    image: "/images/produtos/piso-6.jpg",
    applicationImage: "/images/ambiente/onix-blue.jpg",
    specs: [
      { label: "Dimensões", value: "75x75 cm" },
      { label: "Acabamento", value: "Polido" },
      { label: "Efeito", value: "Ônix azulado" },
      { label: "Aplicação", value: "Piso interno" },
    ],
  },
  {
    id: "piso-3",
    name: "Piso Polido 60x60",
    detail: "Cinza acinzentado, alta durabilidade",
    price: "39,90",
    unit: "m²",
    image: "/images/produtos/piso-3.jpg",
    applicationImage: "/images/ambiente/gray.jpg",
    specs: [
      { label: "Dimensões", value: "60x60 cm" },
      { label: "Acabamento", value: "Polido" },
      { label: "Cor", value: "Cinza acinzentado" },
      { label: "Aplicação", value: "Piso interno, alta durabilidade" },
    ],
  },
];

function formatDbPrice(value: number) {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export async function getProducts(): Promise<Product[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("products")
      .select("slug, name, detail, price, unit, image, application_image, specs")
      .eq("active", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) return fallbackProducts;

    return data.map((row) => ({
      id: row.slug,
      name: row.name,
      detail: row.detail,
      price: formatDbPrice(Number(row.price)),
      unit: row.unit,
      image: row.image,
      applicationImage: row.application_image,
      specs: Array.isArray(row.specs) ? (row.specs as ProductSpec[]) : [],
    }));
  } catch {
    return fallbackProducts;
  }
}

function localDateKey(date: Date, timeZone = "America/Sao_Paulo") {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function daysSinceEpoch(date: Date, timeZone = "America/Sao_Paulo") {
  const [year, month, day] = localDateKey(date, timeZone).split("-").map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
}

/**
 * Picks a rotating "deal of the day" index, deterministic for the current
 * calendar day in São Paulo time — same product for every visitor on a
 * given day, cycling through the whole catalog in order (one full lap
 * before any product repeats) rather than jumping around randomly.
 */
export function getDailyIndex(length: number, date = new Date()) {
  if (length === 0) return 0;
  return ((daysSinceEpoch(date) % length) + length) % length;
}

export async function getFeaturedProduct(): Promise<Product> {
  const products = await getProducts();
  return products[getDailyIndex(products.length)];
}
