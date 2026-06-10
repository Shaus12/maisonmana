import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "המראה | התנסות ויזואלית בתכשיטים | Maison Mana",
  description:
    "התנסות ויזואלית פרטית בתכשיטי Maison Mana לפני פגישה אישית, כחלק מחוויית האטלייה.",
  path: "/mirror",
});

export default function MirrorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
