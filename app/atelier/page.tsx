import { StudioPageContent } from "@/components/StudioPageContent";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "עיצוב תכשיט אישי | Maison Mana",
  description:
    "עצבו תכשיט אישי עם Maison Mana — בחירת סגנון, אבן, מתכת והדמיה ראשונית לפני פגישה פרטית באטלייה.",
  path: "/atelier",
});

export default function AtelierPage() {
  return <StudioPageContent />;
}
