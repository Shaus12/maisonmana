import type { Metadata } from "next";
import { CollectionSeoPage } from "@/components/CollectionSeoPage";
import { collectionPages } from "@/lib/collection-pages";
import { buildMetadata } from "@/lib/seo";
import { ProductFeature } from "@/components/ProductFeature";
import { products } from "@/lib/products";

const page = collectionPages["diamond-rings"];

export const metadata: Metadata = buildMetadata({
  title: page.metaTitle,
  description: page.metaDescription,
  path: "/diamond-rings",
});

export default function DiamondRingsPage() {
  const product = products["lab-diamond-ring-2-30ct"];
  
  return (
    <CollectionSeoPage page={page}>
      {product && <ProductFeature product={product} />}
    </CollectionSeoPage>
  );
}

