import type { Metadata } from "next";
import { CollectionSeoPage } from "@/components/CollectionSeoPage";
import { collectionPages } from "@/lib/collection-pages";
import { buildMetadata } from "@/lib/seo";
import { ProductGrid } from "@/components/ProductGrid";
import { products } from "@/lib/products";

const page = collectionPages["tennis-bracelets"];

export const metadata: Metadata = buildMetadata({
  title: page.metaTitle,
  description: page.metaDescription,
  path: "/tennis-bracelets",
});

export default function TennisBraceletsPage() {
  const braceletProducts = Object.values(products).filter(p => p.id?.startsWith("bracelet-product-"));

  return (
    <CollectionSeoPage
      page={page}
      heroExtraCta={{ href: "#available-bracelets", labelKey: "tb_view_available" }}
      afterIntroContent={
        <div id="available-bracelets" className="scroll-mt-24">
          <ProductGrid
            products={braceletProducts}
            titleKey="tb_grid_title"
            subtitleKey="tb_grid_sub"
          />
        </div>
      }
    />
  );
}

