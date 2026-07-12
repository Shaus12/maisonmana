import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { AboutContent } from "@/components/AboutContent";

export const metadata: Metadata = buildMetadata({
  title: "אודות | אטלייה תכשיטים ועיצוב אישי | Maison MANA",
  description:
    "בית תכשיטים פרטי. אטלייה תכשיטים המתמחה ביהלומים ועיצוב אישי של טבעות אירוסין ותכשיטי חתימה, המותאם ללקוח בפגישה אישית.",
  path: "/about",
});

export default function AboutPage() {
  return <AboutContent />;
}
