import { Metadata } from "next";
import { CollectionsIntro } from "@/components/collections/CollectionsIntro";
import { CollectionIndex } from "@/components/collections/CollectionIndex";
import { CollectionsBottomCTA } from "@/components/collections/CollectionsBottomCTA";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "אוספים | Maison Mana",
  description:
    "אוספי התכשיטים של Maison Mana — טבעות אירוסין, תכשיטי יהלומים, High Jewelry, עיצוב אישי ופריטי חתימה.",
  path: "/collections",
});

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-paper pt-16 md:pt-[88px]">
      {/* Editorial Intro */}
      <CollectionsIntro />

      {/* Grid */}
      <CollectionIndex />

      <CollectionsBottomCTA />
    </div>
  );
}
