import type { MetadataRoute } from "next";
import { config } from "@/config";

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${config.DOMAIN}/sitemap.xml`,
    host: config.DOMAIN,
  };
}
