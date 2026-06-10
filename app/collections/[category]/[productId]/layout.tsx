import type { Metadata } from "next";
import { getProductById } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";

type Params = Promise<{ category: string; productId: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category, productId } = await params;
  const product = getProductById(productId);

  if (!product || product.category !== category) {
    return buildMetadata({
      title: "אוספים | Maison Mana",
      description:
        "אוספי התכשיטים של Maison Mana — טבעות אירוסין, תכשיטי יהלומים, High Jewelry, עיצוב אישי ופריטי חתימה.",
      path: "/collections",
    });
  }

  return buildMetadata({
    title: `${product.name} | Maison Mana`,
    description: `${product.description} לתיאום פגישה פרטית עם Maison Mana.`,
    path: `/collections/${category}/${productId}`,
  });
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children;
}
