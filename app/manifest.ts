import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GasoCerca - Gasolineras baratas",
    short_name: "GasoCerca",
    description: "Precios oficiales de carburantes y la gasolinera más barata cerca de ti.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#16a34a",
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
