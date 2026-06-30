import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "מראה דיגיטלית והתאמה אישית של תכשיטים | Maison MANA",
  description:
    "מראה וירטואלית להתאמה אישית ומדידת תכשיטים. קבלו השראה ויזואלית לפני יצירת תכשיט היהלומים שלכם באטלייה.",
  path: "/mirror",
});

export default function MirrorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
