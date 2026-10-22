import "server-only";
import type { Product } from "@/domain/product";
import { searchProducts } from "@/domain/search";
import { getProducts } from "./products.repository";

const CATALOG_TTL_MS = 5 * 60 * 1000;
export const MAX_SEARCH_RESULTS = 80;

// The catalog changes rarely: keep it in memory briefly so each keystroke
// of a search doesn't hit the database.
let cache: { at: number; products: Product[] } | null = null;

export async function getCachedCatalog(now = Date.now()) {
  if (cache && now - cache.at < CATALOG_TTL_MS) return cache.products;
  const products = await getProducts();
  cache = { at: now, products };
  return products;
}

/** Searches the whole catalog; returns the best matches and the total found. */
export async function searchCatalog(query: string) {
  const matches = searchProducts(await getCachedCatalog(), query);
  return {
    products: matches.slice(0, MAX_SEARCH_RESULTS),
    total: matches.length,
  };
}
