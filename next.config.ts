import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    // Product photos rarely change: let the CDN and browsers keep them for a month.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    formats: ["image/avif", "image/webp"],
    // Banners are added by admins with an arbitrary image URL (e.g. imgur),
    // so any https host is allowed here — this isn't user-generated public
    // content, only the store's own trusted admins can add banners.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async headers() {
    return [
      {
        // Static photos/icons: cache for a day, then revalidate in the background.
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
    ];
  },
};

export default nextConfig;
