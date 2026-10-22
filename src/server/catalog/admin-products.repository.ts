import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "@/lib/supabase/database.types";

export type AdminProduct = Tables<"products">;

export const PRODUCT_FILTERS = [
  "todos",
  "ativos",
  "inativos",
  "ofertas",
  "sem-foto",
  "ilustrativa",
] as const;
export type ProductFilter = (typeof PRODUCT_FILTERS)[number];

export const PAGE_SIZE = 20;

export type DepartmentStats = {
  total: number;
  active: number;
  inactive: number;
  featured: number;
  noPhoto: number;
  illustrative: number;
};

type StatRow = Pick<AdminProduct, "category" | "active" | "featured" | "image">;

const emptyStats = (): DepartmentStats => ({
  total: 0,
  active: 0,
  inactive: 0,
  featured: 0,
  noPhoto: 0,
  illustrative: 0,
});

/** Pure: counts per department (and the overall total under "todos") from light rows. */
export function buildDepartmentStats(
  rows: StatRow[],
): Record<string, DepartmentStats> {
  const stats: Record<string, DepartmentStats> = { todos: emptyStats() };

  for (const row of rows) {
    const bucket = (stats[row.category] ??= emptyStats());
    for (const target of [bucket, stats.todos]) {
      target.total += 1;
      if (row.active) target.active += 1;
      else target.inactive += 1;
      if (row.featured) target.featured += 1;
      if (!row.image) target.noPhoto += 1;
      else if (row.image.includes("/ilustrativa/")) target.illustrative += 1;
    }
  }
  return stats;
}

/** Light read of every product, just enough to count per department. */
export async function getDepartmentStats(supabase: SupabaseClient<Database>) {
  const { data } = await supabase
    .from("products")
    .select("category, active, featured, image")
    .limit(5000);
  return buildDepartmentStats(data ?? []);
}

/** Pure: keeps a search term safe to embed in a PostgREST filter (no operators or wildcards). */
export function sanitizeSearch(term: string) {
  return term
    .replace(/[%,()*\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);
}

export type ProductListOptions = {
  category: string; // department id or "todos"
  filter: ProductFilter;
  search: string;
  page: number;
};

/** One page of products for the admin list, filtered by department, status and search. */
export async function listAdminProducts(
  supabase: SupabaseClient<Database>,
  options: ProductListOptions,
) {
  let query = supabase.from("products").select("*", { count: "exact" });

  if (options.category !== "todos")
    query = query.eq("category", options.category);

  switch (options.filter) {
    case "ativos":
      query = query.eq("active", true);
      break;
    case "inativos":
      query = query.eq("active", false);
      break;
    case "ofertas":
      query = query.eq("featured", true);
      break;
    case "sem-foto":
      query = query.eq("image", "");
      break;
    case "ilustrativa":
      query = query.like("image", "%/ilustrativa/%");
      break;
  }

  const term = sanitizeSearch(options.search);
  if (term) query = query.or(`name.ilike.%${term}%,slug.ilike.%${term}%`);

  const from = (Math.max(1, options.page) - 1) * PAGE_SIZE;
  const { data, count, error } = await query
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true })
    .range(from, from + PAGE_SIZE - 1);

  return { products: data ?? [], total: count ?? 0, failed: Boolean(error) };
}
