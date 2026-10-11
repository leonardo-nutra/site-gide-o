import { getProducts, type Product } from "@/lib/products";
import { searchProducts } from "@/lib/product-search";

const MAX_RESULTS = 80;
const CATALOG_TTL_MS = 5 * 60 * 1000;

// The catalog changes rarely; keep it in memory briefly so each keystroke
// doesn't hit the database.
let cache: { at: number; products: Product[] } | null = null;

async function loadCatalog() {
  if (cache && Date.now() - cache.at < CATALOG_TTL_MS) return cache.products;
  const products = await getProducts();
  cache = { at: Date.now(), products };
  return products;
}

export async function GET(request: Request) {
  const query =
    new URL(request.url).searchParams.get("q")?.trim().slice(0, 80) ?? "";
  if (!query) return Response.json({ products: [], total: 0 });

  const matches = searchProducts(await loadCatalog(), query);

  return Response.json(
    { products: matches.slice(0, MAX_RESULTS), total: matches.length },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    },
  );
}
