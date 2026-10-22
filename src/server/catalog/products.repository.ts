import "server-only";
import {
  PLACEHOLDER_IMAGE,
  type Product,
  type ProductSpec,
} from "@/domain/product";
import { formatPrice } from "@/domain/money";
import { createPublicClient } from "../db/public";
import { logger } from "../observability/logger";
import { fallbackProducts } from "./fallback-products";

const COLUMNS =
  "slug, name, detail, price, unit, image, application_image, video, category, featured, material, measure, specs";

/**
 * Active catalog, in the admin's display order. Reads as an anonymous visitor
 * (RLS only exposes active rows). If the database can't be reached, the page
 * still renders with a small built-in sample instead of failing.
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await createPublicClient()
      .from("products")
      .select(COLUMNS)
      .eq("active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      logger.warn("catalog.read_failed", {
        code: error.code,
        message: error.message,
      });
      return fallbackProducts;
    }
    if (!data || data.length === 0) return fallbackProducts;

    return data.map((row) => {
      const specs = Array.isArray(row.specs)
        ? (row.specs as ProductSpec[])
        : [];
      const structuredSpecs: ProductSpec[] = [
        ...(row.material ? [{ label: "Material", value: row.material }] : []),
        ...(row.measure ? [{ label: "Medida", value: row.measure }] : []),
      ];

      return {
        id: row.slug,
        name: row.name,
        detail: row.detail,
        price: formatPrice(Number(row.price)),
        unit: row.unit,
        image: row.image || PLACEHOLDER_IMAGE,
        applicationImage:
          row.application_image || row.image || PLACEHOLDER_IMAGE,
        video: row.video ?? "",
        category: row.category ?? "pisos",
        featured: Boolean(row.featured),
        specs: [...structuredSpecs, ...specs],
      };
    });
  } catch (error) {
    logger.error("catalog.unreachable", error);
    return fallbackProducts;
  }
}
