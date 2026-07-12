import { notFound, redirect } from "next/navigation";

const SEO_PAGE_BY_LEGACY_CATEGORY: Record<string, string> = {
  rings: "/diamond-rings",
  necklaces: "/diamond-necklaces",
  earrings: "/diamond-earrings",
};

export default async function LegacyCollectionCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const target = SEO_PAGE_BY_LEGACY_CATEGORY[category];

  if (!target) notFound();

  redirect(target);
}
