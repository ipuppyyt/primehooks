import type { MetadataRoute } from "next";
import { config } from "@/config";
import { source } from "@/lib/source";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = source.getPages();

  const docPages = pages.map((page) => ({
    url: `${config.DOMAIN}${page.url}`,
    lastModified: page.data.lastModified || new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: config.DOMAIN,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
  ];

  return [...staticPages, ...docPages];
}
