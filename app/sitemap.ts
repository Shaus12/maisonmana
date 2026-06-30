import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

const publicRoutes = [
  "/",
  "/collections",
  "/collections/fine-jewelry",
  "/atelier",
  "/mirror",
  "/inquiry",
  "/diamond-rings",
  "/engagement-rings",
  "/wedding-rings",
  "/tennis-bracelets",
  "/diamond-necklaces",
  "/diamond-earrings",
  "/mens-jewelry",
  "/high-jewelry",
  "/signature",
  "/diamonds",
  "/about",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
    url: `${siteUrl}${route === "/" ? "" : route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" || route.startsWith("/collections") || route === "/diamond-rings" ? 1 : 0.8,
  }));
}
