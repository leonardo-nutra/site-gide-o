import type { Product } from "@/lib/products";
import { categories } from "@/lib/site";

const DIACRITICS_PATTERN = new RegExp("[\\u0300-\\u036f]", "g");

function normalize(value: string) {
  return value.normalize("NFD").replace(DIACRITICS_PATTERN, "").toLowerCase();
}

/** Plural/gender-tolerant stem so "torneiras" finds "torneira" and "branca" finds "branco". */
function stem(word: string) {
  if (word.length <= 3) return word;
  const singular = word.replace(/(es|s)$/, "");
  return singular.length > 4 ? singular.replace(/[ao]$/, "") : singular;
}

/**
 * Searches the whole catalog: every word typed must appear somewhere in the
 * product name, description, department, measure or specs, in any order.
 * Products whose name alone matches every word come first.
 */
export function searchProducts(products: Product[], query: string) {
  const words = normalize(query).split(/\s+/).filter(Boolean).map(stem);
  if (words.length === 0) return [];

  return products
    .map((product) => {
      const name = normalize(product.name);
      const department =
        categories.find((c) => c.id === product.category)?.title ?? "";
      const haystack = normalize(
        [
          product.name,
          product.detail,
          department,
          ...product.specs.flatMap((spec) => [spec.label, spec.value]),
        ].join(" "),
      );
      const matchesAll = words.every((word) => haystack.includes(word));
      const inName = words.every((word) => name.includes(word));
      return { product, matchesAll, inName };
    })
    .filter((entry) => entry.matchesAll)
    .sort((a, b) => Number(b.inName) - Number(a.inName))
    .map((entry) => entry.product);
}
