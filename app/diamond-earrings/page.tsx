import type { Metadata } from "next";
import { CollectionSeoPage } from "@/components/CollectionSeoPage";
import { collectionPages } from "@/lib/collection-pages";
import { buildMetadata } from "@/lib/seo";

const page = collectionPages["diamond-earrings"];

export const metadata: Metadata = buildMetadata({
  title: page.metaTitle,
  description: page.metaDescription,
  path: "/diamond-earrings",
});

export default function DiamondEarringsPage() {
  return <CollectionSeoPage page={page} />;
}

