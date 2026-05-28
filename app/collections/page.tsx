import Link from "next/link";
import { PieceTile } from "@/components/PieceTile";
import { COLLECTIONS, piecesByCollection } from "@/lib/pieces";
import type { Collection } from "@/lib/pieces";

export const metadata = {
  title: "האוספים",
  description:
    "אוספי תכשיטי הכלולות של מאזון מנא — טבעות אירוסין, צמידי טניס, שרשרות סוליטר, עגילי יהלום ולהקות נישואין.",
};

export default function CollectionsPage({
  searchParams,
}: {
  searchParams?: Promise<{ filter?: string }>;
}) {
  return <CollectionsView />;
}

function CollectionsView() {
  return (
    <>
      <section className="bg-paper">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-6 pt-20 pb-24 md:grid-cols-12 md:px-12 md:pt-28 md:pb-32">
          <div className="md:col-span-5">
            <p className="section-label">קטלוג הבית</p>
            <h1 className="display-he mt-6 text-[2.75rem] leading-[1.05] text-ink md:text-[4.25rem]">
              האוספים
            </h1>
          </div>
          <div className="md:col-span-6 md:col-start-7 md:self-end editorial">
            <p>
              כל יצירה בקטלוג מוצגת בעבודת יד, נושאת תעודה, ומלווה בסיפור. מספר היצירה הוא מספר התעודה הפנימית של הבית. המחירים אינם פתוחים ברשת מתוך כבוד לעבודת הצורף ולפרטיות הקונה, ונאמרים בפגישה.
            </p>
          </div>
        </div>
        <div className="optical-rule h-px w-full" />
      </section>

      {COLLECTIONS.map((col, idx) => (
        <CollectionStrip key={col.slug} slug={col.slug} title={col.he} lead={col.lead} alt={idx % 2 === 1} />
      ))}
    </>
  );
}

function CollectionStrip({
  slug,
  title,
  lead,
  alt,
}: {
  slug: Collection;
  title: string;
  lead: string;
  alt: boolean;
}) {
  const pieces = piecesByCollection(slug);

  return (
    <section className={alt ? "bg-paper-deep" : "bg-paper"}>
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-12 md:py-28">
        <header className="mb-12 flex items-end justify-between gap-8 border-b border-rule pb-8">
          <div>
            <p className="section-label">אוסף</p>
            <h2 className="display-he mt-3 text-[2rem] leading-[1.1] text-ink md:text-[2.75rem]">
              {title}
            </h2>
            <p className="mt-3 max-w-md text-ink-soft text-[1rem]">{lead}</p>
          </div>
          <span className="text-[0.6875rem] tracking-[0.18em] uppercase text-ink-mute display-lat hidden md:block">
            {pieces.length.toString().padStart(2, "0")} pieces
          </span>
        </header>

        <div className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {pieces.map((p) => (
            <PieceTile key={p.slug} piece={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
