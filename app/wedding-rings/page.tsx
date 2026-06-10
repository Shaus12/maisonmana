import type { Metadata } from "next";
import { CollectionSeoPage } from "@/components/CollectionSeoPage";
import { collectionPages } from "@/lib/collection-pages";
import { buildMetadata } from "@/lib/seo";

const page = collectionPages["wedding-rings"];

export const metadata: Metadata = buildMetadata({
  title: page.metaTitle,
  description: page.metaDescription,
  path: "/wedding-rings",
});

export default function WeddingRingsPage() {
  return <CollectionSeoPage page={page} />;
}

