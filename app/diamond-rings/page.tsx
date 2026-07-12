import type { Metadata } from "next";
import { CollectionSeoPage } from "@/components/CollectionSeoPage";
import { collectionPages } from "@/lib/collection-pages";
import { buildMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";

const page = collectionPages["diamond-rings"];

export const metadata: Metadata = buildMetadata({
  title: page.metaTitle,
  description: page.metaDescription,
  path: "/diamond-rings",
});

export default function DiamondRingsPage() {
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
      <CollectionSeoPage page={page} />
    </>
  );
}
