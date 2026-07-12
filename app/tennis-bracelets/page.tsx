import type { Metadata } from "next";
import { CollectionSeoPage } from "@/components/CollectionSeoPage";
import { collectionPages } from "@/lib/collection-pages";
import { buildMetadata } from "@/lib/seo";

const page = collectionPages["tennis-bracelets"];

export const metadata: Metadata = buildMetadata({
  title: page.metaTitle,
  description: page.metaDescription,
  path: "/tennis-bracelets",
});

export default function TennisBraceletsPage() {
  return <CollectionSeoPage page={page} />;
}
