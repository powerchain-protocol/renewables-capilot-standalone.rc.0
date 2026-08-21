import type { NextConfig } from "next";

// Disable Next.js telemetry for dev, build and CI even when .env.local is absent.
process.env.NEXT_TELEMETRY_DISABLED ??= "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["@radix-ui/react-icons"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
