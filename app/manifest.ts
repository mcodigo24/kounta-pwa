import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kounta",
    short_name: "Kounta",
    description:
      "Anotador de puntajes para Truco, Generala, Chin Chon, 10 mil y Comodín. Funciona sin conexión.",
    lang: "es",
    id: "/app",
    start_url: "/app",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#3D3128",
    theme_color: "#3D3128",
    categories: ["games", "utilities"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
