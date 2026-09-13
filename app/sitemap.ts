import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://gasocerca.vercel.app";
  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/legal`, lastModified: new Date() },
  ];
}
