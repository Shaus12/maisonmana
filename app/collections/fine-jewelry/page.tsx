import type { Metadata } from "next";
import { buildMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";
import { FineJewelryContent } from "@/components/FineJewelryContent";

export const metadata: Metadata = buildMetadata({
  title: "Fine Jewelry | טבעות יהלום, צמידי טניס ושרשראות | Maison MANA",
  description:
    "קולקציית Fine Jewelry של Maison MANA — טבעות יהלום, צמידי טניס, שרשראות יהלומים ועגילי יהלומים בעיצוב נקי ועל־זמני.",
  path: "/collections/fine-jewelry",
});

export default function FineJewelryPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "דף הבית", url: "/" },
    { name: "אוספים", url: "/collections" },
    { name: "Fine Jewelry", url: "/collections/fine-jewelry" }
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <FineJewelryContent />
    </>
  );
}
