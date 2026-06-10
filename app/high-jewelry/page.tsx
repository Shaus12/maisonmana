import type { Metadata } from "next";
import { CollectionSeoPage } from "@/components/CollectionSeoPage";
import { collectionPages } from "@/lib/collection-pages";
import { buildMetadata } from "@/lib/seo";

const page = collectionPages["high-jewelry"];

export const metadata: Metadata = buildMetadata({
  title: page.metaTitle,
  description: page.metaDescription,
  path: "/high-jewelry",
});

export default function HighJewelryPage() {
  return <CollectionSeoPage page={page} />;
}

