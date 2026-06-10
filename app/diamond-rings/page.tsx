import type { Metadata } from "next";
import { CollectionSeoPage } from "@/components/CollectionSeoPage";
import { collectionPages } from "@/lib/collection-pages";
import { buildMetadata } from "@/lib/seo";

const page = collectionPages["diamond-rings"];

export const metadata: Metadata = buildMetadata({
  title: page.metaTitle,
  description: page.metaDescription,
  path: "/diamond-rings",
});

export default function DiamondRingsPage() {
  return <CollectionSeoPage page={page} />;
}

