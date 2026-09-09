import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    // Banners are added by admins with an arbitrary image URL (e.g. imgur),
    // so any https host is allowed here — this isn't user-generated public
    // content, only the store's own trusted admins can add banners.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
