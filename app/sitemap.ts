import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { products } from "@/lib/products";

const publicRoutes = [
  "/",
  "/collections",
  "/collections/fine-jewelry",
  "/products",
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
  const staticSitemap = publicRoutes.map((route) => ({
    url: `${siteUrl}${route === "/" ? "" : route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly" as any,
    priority: route === "/" || route.startsWith("/collections") || route === "/diamond-rings" ? 1 : 0.8,
  }));

  const dynamicProductsSitemap = Object.values(products).map((product) => ({
    url: `${siteUrl}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as any,
    priority: 0.8,
  }));

  return [...staticSitemap, ...dynamicProductsSitemap];
}
