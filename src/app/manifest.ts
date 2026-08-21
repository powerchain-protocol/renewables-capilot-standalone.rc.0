import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PowerChain Renewables Copilot",
    short_name: "Renewables Copilot",
    description: "GRIDLLM workspace for renewable energy operations and PowerChain infrastructure.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f8f7",
    theme_color: "#064e3b",
    icons: [
      { src: "/brand/logo-green.png", sizes: "any", type: "image/png" },
      { src: "/brand/logo-white.png", sizes: "any", type: "image/png" },
    ],
  };
}
