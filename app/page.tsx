import type { Metadata } from "next";
import { HomeContent } from "@/components/HomeContent";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Maison Mana | בית תכשיטים פרטי לטבעות אירוסין ותכשיטי יהלומים",
  description:
    "Maison Mana הוא בית תכשיטים פרטי המתמחה בטבעות אירוסין, תכשיטי יהלומים ועיצוב אישי בפגישה פרטית.",
  path: "/",
});

export default function Home() {
  return <HomeContent />;
}
