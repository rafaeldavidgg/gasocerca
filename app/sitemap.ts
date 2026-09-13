import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://gasocercamia.vercel.app";
  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/legal`, lastModified: new Date() },
  ];
}
