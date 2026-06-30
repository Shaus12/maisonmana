import { StudioPageContent } from "@/components/StudioPageContent";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "הדמיית תכשיט ועיצוב טבעת אישית | Maison MANA",
  description:
    "עצבו תכשיט או טבעת בעיצוב אישי דרך האטלייה של Maison MANA. קבלו הדמיה ראשונית (הדמיית תכשיט) לפני פגישה פרטית.",
  path: "/atelier",
});

export default function AtelierPage() {
  return <StudioPageContent />;
}
