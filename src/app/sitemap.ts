import type { MetadataRoute } from "next";
import { categories } from "@/config/site";

const base = "https://site-gide-o.vercel.app";

/** Home, every department page and the privacy policy: what search engines should index. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    ...categories.map((category) => ({
      url: `${base}/departamento/${category.id}`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    { url: `${base}/privacidade`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
