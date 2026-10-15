import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/dashboard/*",
          "/technician",
          "/technician/*",
          "/manager",
          "/manager/*",
          "/admin",
          "/admin/*",
          "/notifications",
          "/payment",
          "/payment/*",
          "/premium",
          "/premium/*",
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
