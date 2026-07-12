import { notFound, redirect } from "next/navigation";

const SHOP_CATEGORY_BY_LEGACY_CATEGORY: Record<string, string> = {
  rings: "rings",
  necklaces: "necklaces",
  earrings: "earrings",
};

export default async function LegacyCollectionProductPage({
  params,
}: {
  params: Promise<{ category: string; productId: string }>;
}) {
  const { category } = await params;
  const shopCategory = SHOP_CATEGORY_BY_LEGACY_CATEGORY[category];

  if (!shopCategory) notFound();

  redirect(`/products?category=${shopCategory}`);
}
