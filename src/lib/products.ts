export type Product = {
  id: string;
  name: string;
  detail: string;
  price: string;
  unit: string;
  image: string;
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
  },
  {
    id: "piso-9",
    name: "Piso 45x89 Lume",
    detail: "Mármore claro com veios dourados",
    price: "45,90",
    unit: "m²",
    image: "/images/ofertas/crop/piso-9.jpg",
  },
  {
    id: "piso-4",
    name: "Piso Karina Polido",
    detail: "Preto com veios dourados, alto padrão",
    price: "52,90",
    unit: "m²",
    image: "/images/ofertas/crop/piso-4.jpg",
  },
  {
    id: "piso-2",
    name: "Piso 75x75 Lumina Bege Karina",
    detail: "Tom bege claro, polido",
    price: "45,90",
    unit: "m²",
    image: "/images/ofertas/crop/piso-2.jpg",
  },
  {
    id: "piso-5",
    name: "Piso 75x75 Majestic",
    detail: "Branco com veios pretos e dourados",
    price: "45,90",
    unit: "m²",
    image: "/images/ofertas/crop/piso-5.jpg",
  },
  {
    id: "piso-7",
    name: "Piso Cerâmico Black Gold HD",
    detail: "Preto com veios dourados HD",
    price: "47,90",
    unit: "m²",
    image: "/images/ofertas/crop/piso-7.jpg",
  },
  {
    id: "piso-6",
    name: "Piso Extra Onix Blue 75x75",
    detail: "Efeito ônix azulado, polido",
    price: "45,90",
    unit: "m²",
    image: "/images/ofertas/crop/piso-6.jpg",
  },
  {
    id: "piso-3",
    name: "Piso Polido 60x60",
    detail: "Cinza acinzentado, alta durabilidade",
    price: "39,90",
    unit: "m²",
    image: "/images/ofertas/crop/piso-3.jpg",
  },
];

export async function getProducts(): Promise<Product[]> {
  return staticProducts;
}
