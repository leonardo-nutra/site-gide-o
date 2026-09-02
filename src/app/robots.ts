import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://site-gide-o.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
