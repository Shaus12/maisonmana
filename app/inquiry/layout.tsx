import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "תיאום פגישה פרטית | Maison Mana",
  description:
    "תיאום פגישה פרטית עם Maison Mana לעיצוב טבעת אירוסין, תכשיט אישי, ייעוץ יהלומים או צפייה באוספים.",
  path: "/inquiry",
});

export default function InquiryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
