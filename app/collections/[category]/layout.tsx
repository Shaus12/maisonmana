import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

const categoryMetadata = {
  rings: {
    title: "טבעות אירוסין וטבעות יהלום | Maison Mana",
    description:
      "טבעות אירוסין וטבעות יהלום של Maison Mana בעיצוב אישי, עם יהלומים טבעיים או יהלומי מעבדה ותיאום פגישה פרטית.",
  },
  necklaces: {
    title: "שרשראות יהלומים | Maison Mana",
    description:
      "שרשראות ותליוני יהלומים של Maison Mana בעיצוב אישי ובצפייה פרטית באטלייה.",
  },
  earrings: {
    title: "עגילי יהלומים | Maison Mana",
    description:
      "עגילי יהלומים של Maison Mana בעיצוב נקי ומדויק, כחלק מאוספי תכשיטי היהלומים של האטלייה.",
  },
} as const;

type Params = Promise<{ category: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category } = await params;
  const item = categoryMetadata[category as keyof typeof categoryMetadata];

  if (!item) {
    return buildMetadata({
      title: "אוספים | Maison Mana",
      description:
        "אוספי התכשיטים של Maison Mana — טבעות אירוסין, תכשיטי יהלומים, High Jewelry, עיצוב אישי ופריטי חתימה.",
      path: "/collections",
    });
  }

  return buildMetadata({
    ...item,
    path: `/collections/${category}`,
  });
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
