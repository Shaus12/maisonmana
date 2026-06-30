import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "תיאום פגישה ובירור על תכשיט | Maison MANA",
  description:
    "תיאום פגישה אישית באטלייה של Maison MANA, לבירור על תכשיט או הזמנה אישית של טבעת אירוסין ותכשיטי יהלומים.",
  path: "/inquiry",
});

export default function InquiryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
