import type { Metadata } from "next";
import { CollectionSeoPage } from "@/components/CollectionSeoPage";
import { collectionPages } from "@/lib/collection-pages";
import { buildMetadata, siteUrl, buildBreadcrumbJsonLd } from "@/lib/seo";
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
  
  const productJsonLd = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: `${siteUrl}${typeof product.images[0] === 'string' ? product.images[0] : product.images[0].src}`,
    description: product.shortDescription,
    brand: {
      "@type": "Brand",
      name: "Maison MANA"
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "ILS",
      url: `${siteUrl}/diamond-rings`,
      availability: "https://schema.org/InStock"
    }
  } : null;

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "דף הבית", url: "/" },
    { name: "אוספים", url: "/collections" },
    { name: "Fine Jewelry", url: "/collections/fine-jewelry" },
    { name: "טבעות יהלום", url: "/diamond-rings" }
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      <CollectionSeoPage page={page}>
        {product && <ProductFeature product={product} />}
      </CollectionSeoPage>
    </>
  );
}

