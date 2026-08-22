import type { NextConfig } from "next";

process.env.NEXT_TELEMETRY_DISABLED ??= "1";

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "standalone",
};

export default config;
