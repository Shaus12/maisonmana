import type { Metadata } from "next";
import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo";
import { ProductCatalog } from "@/components/ProductCatalog";

export const metadata: Metadata = buildMetadata({
  title: "פריטים להזמנה | צמידי יהלומים, טבעות ותכשיטי זהב | Maison MANA",
  description:
    "כל התכשיטים הזמינים להזמנה מבית Maison MANA — צמידי טניס, צמידי בנגל, צמידי שם ואותיות וטבעות יהלום, עם התאמה אישית של צבע זהב וצורת יהלום.",
  path: "/products",
});

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductCatalog />
    </Suspense>
  );
}
