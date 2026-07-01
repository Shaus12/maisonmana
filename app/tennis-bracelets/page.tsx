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
      heroExtraCta={
        <a href="#available-bracelets" className="hairline-link text-[0.9375rem]">
          לצפייה בצמידים הזמינים
        </a>
      }
      afterIntroContent={
        <div id="available-bracelets" className="scroll-mt-24">
          <ProductGrid 
            products={braceletProducts} 
            title="צמידים זמינים להזמנה" 
            subtitle="מבחר צמידי יהלומים וזהב הזמינים להזמנה, עם אפשרות התאמה אישית לפי צבע זהב, צורת יהלום או שיבוץ אישי בהתאם לדגם." 
          />
        </div>
      }
    />
  );
}

