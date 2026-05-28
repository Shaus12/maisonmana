import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  PIECES,
  pieceBySlug,
  METAL_LABELS_HE,
  SHAPE_LABELS_HE,
  SETTING_LABELS_HE,
} from "@/lib/pieces";
import { formatPriceILS, formatCaratLatin } from "@/lib/format";

export function generateStaticParams() {
  return PIECES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const piece = pieceBySlug(slug);
  if (!piece) return {};
  return {
    title: `${piece.nameHe} · ${piece.reference}`,
    description: piece.narrativeHe,
  };
}

export default async function PiecePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const piece = pieceBySlug(slug);
  if (!piece) notFound();

  const related = PIECES.filter((p) => p.collection === piece.collection && p.slug !== piece.slug).slice(0, 2);

  return (
    <article className="bg-paper">
      <div className="mx-auto max-w-[1440px] px-6 pt-12 pb-10 md:px-12 md:pt-16">
        <nav aria-label="פירורי לחם" className="text-[0.8125rem] text-ink-mute">
          <Link href="/" className="hairline-link">הבית</Link>
          <span className="mx-2 text-ink-mute">·</span>
          <Link href="/collections" className="hairline-link">האוספים</Link>
          <span className="mx-2 text-ink-mute">·</span>
          <span className="text-ink-soft">{piece.nameHe}</span>
        </nav>
      </div>

      <div className="mx-auto grid max-w-[1440px] gap-12 px-6 pb-24 md:grid-cols-12 md:gap-16 md:px-12 md:pb-32">
        {/* Image — inline-start on desktop */}
        <div className="md:col-span-7 md:col-start-1">
          <figure className="vellum relative aspect-[4/5] w-full overflow-hidden">
            <Image
              src={piece.image}
              alt={piece.imageAlt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover"
            />
          </figure>
          <p className="mt-4 text-[0.75rem] text-ink-mute italic">
            הצילום אינו מציג את הגודל המלא של היצירה. הגודל המדויק נראה בבית המאזון.
          </p>
        </div>

        {/* Detail panel */}
        <aside className="md:col-span-5 md:col-start-8">
          <p className="section-label">{piece.reference}</p>
          <h1 className="display-he mt-4 text-[3rem] leading-[1.05] text-ink md:text-[4rem]">
            {piece.nameHe}
          </h1>
          <p className="mt-2 display-lat tracking-[0.16em] uppercase text-[0.75rem] text-ink-mute">
            {piece.nameLat}
          </p>

          <p className="mt-10 max-w-md text-ink-soft text-[1.0625rem] leading-relaxed">
            {piece.narrativeHe}
          </p>

          {/* Certificate panel */}
          <div className="mt-12 border border-rule bg-paper-deep">
            <div className="flex items-center justify-between border-b border-rule px-6 py-4">
              <span className="section-label">תעודת היצירה</span>
              <div className="brass-seal" aria-hidden>
                <span className="text-[0.625rem]">MANA</span>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-5 px-6 py-7 text-[0.9375rem]">
              <Row label="חיתוך" value={SHAPE_LABELS_HE[piece.shape]} />
              <Row label="עיגון" value={SETTING_LABELS_HE[piece.setting]} />
              <Row
                label="משקל קראט"
                value={
                  <span className="num text-[1.125rem]">
                    <bdi dir="ltr">{formatCaratLatin(piece.carat)}</bdi>
                    <span className="ms-1 text-[0.75rem] not-italic font-body text-ink-mute">ct</span>
                  </span>
                }
              />
              <Row label="מתכת" value={METAL_LABELS_HE[piece.metal]} />
              <Row label="צבע" value={<bdi dir="ltr">{piece.color}</bdi>} />
              <Row label="ניקיון" value={<bdi dir="ltr">{piece.clarity}</bdi>} />
              <Row
                label="תעודה"
                value={
                  <span>
                    <bdi dir="ltr">{piece.certificate.lab}</bdi>{" "}
                    <span className="text-ink-mute num">
                      <bdi dir="ltr">{piece.certificate.id}</bdi>
                    </span>
                  </span>
                }
                full
              />
            </dl>
          </div>

          {/* Price + CTA */}
          <div className="mt-10 flex flex-col gap-6 border-t border-rule pt-8">
            <div className="flex items-baseline justify-between">
              <span className="section-label">מחיר נוכחי</span>
              <span className="num text-[1.875rem] text-ink not-italic">
                <bdi dir="ltr">{formatPriceILS(piece.priceILS).replace(' ש"ח', "")}</bdi>
                <span className="ms-2 text-[0.9375rem] font-body text-ink-mute">ש"ח</span>
              </span>
            </div>
            <p className="text-[0.8125rem] text-ink-mute">
              המחיר נכון ליום הצגתו ועשוי להשתנות לפי שערי היהלומים והמתכת. אישור סופי ניתן בפגישה.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={`/inquiry?piece=${piece.slug}`}
                className="brass-disc brass-disc--solid"
              >
                להזמנת צפייה פרטית
              </Link>
              <Link href="/atelier" className="hairline-link text-[0.9375rem]">
                לעיצוב גרסה אישית
              </Link>
            </div>
          </div>
        </aside>
      </div>

      <div className="optical-rule h-px w-full" />

      {/* Related pieces */}
      {related.length > 0 && (
        <section className="bg-paper">
          <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-12 md:py-24">
            <header className="mb-10 flex items-end justify-between border-b border-rule pb-6">
              <h2 className="display-he text-[1.75rem] leading-[1.1] text-ink md:text-[2.25rem]">
                מהאוסף הקרוב
              </h2>
              <Link href="/collections" className="hairline-link text-[0.9375rem]">לכל היצירות</Link>
            </header>
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2">
              {related.map((p) => (
                <div key={p.slug}>
                  <Link href={`/collections/${p.slug}`} className="group block">
                    <figure className="vellum relative aspect-[4/5] overflow-hidden">
                      <Image
                        src={p.image}
                        alt={p.imageAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                      />
                    </figure>
                  </Link>
                  <div className="mt-4 flex items-baseline justify-between">
                    <p className="display-he text-[1.5rem] leading-none text-ink">{p.nameHe}</p>
                    <span className="text-[0.6875rem] tracking-[0.18em] uppercase text-ink-mute">{p.reference}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}

function Row({
  label,
  value,
  full = false,
}: {
  label: string;
  value: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "col-span-2" : undefined}>
      <dt className="text-[0.6875rem] tracking-[0.16em] uppercase text-ink-mute">{label}</dt>
      <dd className="mt-1 text-ink">{value}</dd>
    </div>
  );
}
