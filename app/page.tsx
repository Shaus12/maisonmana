import type { Metadata } from "next";
import { HomeContent } from "@/components/HomeContent";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Maison MANA | אטלייה פרטי לעיצוב אישי של טבעות אירוסין ותכשיטי יהלומים",
  description:
    "Maison MANA הוא אטלייה פרטי לעיצוב אישי של תכשיטי יהלומים וטבעות אירוסין. קבעו פגישה פרטית ליצירת התכשיט שלכם.",
  path: "/",
});

export default function Home() {
  return <HomeContent />;
}
