import "server-only";
import type { Banner, BannerPlacement } from "@/domain/banner";
import { createPublicClient } from "../db/public";
import { logger } from "../observability/logger";

/** Active banners of one home page slot, in the admin's order. Empty if none (or on any failure). */
export async function getBanners(
  placement: BannerPlacement,
): Promise<Banner[]> {
  try {
    const { data, error } = await createPublicClient()
      .from("banners")
      .select("id, title, image, link")
      .eq("active", true)
      .eq("placement", placement)
      .order("sort_order", { ascending: true });

    if (error) {
      logger.warn("banners.read_failed", {
        placement,
        code: error.code,
        message: error.message,
      });
      return [];
    }
    return data ?? [];
  } catch (error) {
    logger.error("banners.unreachable", error, { placement });
    return [];
  }
}
