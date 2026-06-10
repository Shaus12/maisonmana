import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/catalog";
import { collectionPageSlugs } from "@/lib/collection-pages";
import { siteUrl } from "@/lib/seo";

const publicRoutes = [
  "/",
  "/collections",
  "/collections/rings",
  "/collections/necklaces",
  "/collections/earrings",
  "/atelier",
  "/diamonds",
  "/mirror",
  "/about",
  "/inquiry",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const productRoutes = PRODUCTS.filter((product) =>
    ["rings", "necklaces", "earrings"].includes(product.category),
  ).map((product) => `/collections/${product.category}/${product.id}`);

  const collectionSeoRoutes = collectionPageSlugs.map((slug) => `/${slug}`);

  return [...publicRoutes, ...collectionSeoRoutes, ...productRoutes].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.8,
  }));
}
