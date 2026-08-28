export type Product = {
  id: string;
  name: string;
  detail: string;
  price: string;
  unit: string;
  image: string;
  /**
   * Illustrative "as installed" reference photo — a generic environment
   * shot in a similar tone, not a photo of this exact batch/lot. Grouped
   * by light/dark tone until real per-product installation photos exist.
   */
  applicationImage: string;
};

const APPLICATION_IMAGE = {
  brancoGlossy: "/images/ambiente/branco-glossy.jpg",
  begeDourado: "/images/ambiente/bege-dourado.jpg",
  pretoDourado: "/images/ambiente/preto-dourado.jpg",
  marmoreBranco: "/images/ambiente/marmore-branco.jpg",
  brancoColunas: "/images/ambiente/branco-colunas.jpg",
  cinza: "/images/ambiente/cinza.jpg",
};

/**
 * Static fallback catalog. Once the client's product/pricing system is
 * available (API, database export, etc.), replace the body of
 * `getProducts` below with a real fetch — the rest of the site only
 * depends on the `Product` shape and the `getProducts()` signature, so no
 * UI changes should be needed.
 */
const staticProducts: Product[] = [
  {
    id: "piso-1",
    name: "Piso Polido Retificado",
    detail: "Acabamento polido de alto brilho",
    price: "49,90",
    unit: "m²",
    image: "/images/ofertas/crop/piso-1.jpg",
    applicationImage: APPLICATION_IMAGE.brancoGlossy,
  },
  {
    id: "piso-9",
    name: "Piso 45x89 Lume",
    detail: "Mármore claro com veios dourados",
    price: "45,90",
    unit: "m²",
    image: "/images/ofertas/crop/piso-9.jpg",
    applicationImage: APPLICATION_IMAGE.begeDourado,
  },
  {
    id: "piso-4",
    name: "Piso Karina Polido",
    detail: "Preto com veios dourados, alto padrão",
    price: "52,90",
    unit: "m²",
    image: "/images/ofertas/crop/piso-4.jpg",
    applicationImage: APPLICATION_IMAGE.pretoDourado,
  },
  {
    id: "piso-2",
    name: "Piso 75x75 Lumina Bege Karina",
    detail: "Tom bege claro, polido",
    price: "45,90",
    unit: "m²",
    image: "/images/ofertas/crop/piso-2.jpg",
    applicationImage: APPLICATION_IMAGE.marmoreBranco,
  },
  {
    id: "piso-5",
    name: "Piso 75x75 Majestic",
    detail: "Branco com veios pretos e dourados",
    price: "45,90",
    unit: "m²",
    image: "/images/ofertas/crop/piso-5.jpg",
    applicationImage: APPLICATION_IMAGE.brancoColunas,
  },
  {
    id: "piso-7",
    name: "Piso Cerâmico Black Gold HD",
    detail: "Preto com veios dourados HD",
    price: "47,90",
    unit: "m²",
    image: "/images/ofertas/crop/piso-7.jpg",
    applicationImage: APPLICATION_IMAGE.pretoDourado,
  },
  {
    id: "piso-6",
    name: "Piso Extra Onix Blue 75x75",
    detail: "Efeito ônix azulado, polido",
    price: "45,90",
    unit: "m²",
    image: "/images/ofertas/crop/piso-6.jpg",
    applicationImage: APPLICATION_IMAGE.cinza,
  },
  {
    id: "piso-3",
    name: "Piso Polido 60x60",
    detail: "Cinza acinzentado, alta durabilidade",
    price: "39,90",
    unit: "m²",
    image: "/images/ofertas/crop/piso-3.jpg",
    applicationImage: APPLICATION_IMAGE.cinza,
  },
];

export async function getProducts(): Promise<Product[]> {
  return staticProducts;
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
