import Image from "next/image";
import Link from "next/link";
import { PieceTile } from "@/components/PieceTile";
import { VideoHero } from "@/components/VideoHero";
import { ScrollReveal } from "@/components/ScrollReveal";
import { PIECES } from "@/lib/pieces";

const HOME_FEATURED = ["anna-solitaire", "tennis-classique", "adria-tear"];

export default function Home() {
  const featured = HOME_FEATURED.map(
    (slug) => PIECES.find((p) => p.slug === slug)!
  );

  return (
    <>
      {/* ── 1. FULLSCREEN VIDEO HERO ─────────────────────────────── */}
      <VideoHero />

      {/* ── 2. MAISON STATEMENT ──────────────────────────────────── */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-28 md:grid-cols-12 md:gap-12 md:px-12 md:py-40">
          <ScrollReveal className="md:col-span-3">
            <p className="section-label">בית המאזון</p>
          </ScrollReveal>
          <div className="md:col-span-8 md:col-start-5">
            <ScrollReveal delay={1}>
              <blockquote className="display-he text-[1.625rem] leading-[1.55] text-ink md:text-[2rem]">
                &ldquo;מאזון מנא נבנה על שלושה כללים: שלא נמכור דבר שלא נלבש בעצמנו; שלא נחפוז להציע מה שלא הקשבנו לו; ושכל יהלום שיוצא מן הסדנה יישא תעודה, ושם, ושעה.&rdquo;
              </blockquote>
            </ScrollReveal>
            <ScrollReveal delay={2}>
              <p className="mt-7 text-ink-mute text-[0.875rem] tracking-[0.04em]">
                — אנרי מנא, צורף ומייסד, 2016
              </p>
            </ScrollReveal>
          </div>
        </div>
        <div className="optical-rule h-px w-full" />
      </section>

      {/* ── 3. SIGNATURE PIECES ──────────────────────────────────── */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[1440px] px-6 py-28 md:px-12 md:py-36">
          <ScrollReveal>
            <header className="flex items-end justify-between gap-8 pb-16 border-b border-rule">
              <div>
                <p className="section-label">חלון התצוגה</p>
                <h2 className="display-he mt-4 text-[2rem] leading-[1.1] text-ink md:text-[2.625rem]">
                  שלוש יצירות שנבחרו לעונה
                </h2>
              </div>
              <Link href="/collections/rings" className="hairline-link text-[0.875rem] whitespace-nowrap text-ink-mute">
                לכל האוספים
              </Link>
            </header>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-x-6 gap-y-20 pt-16 md:grid-cols-12">
            <ScrollReveal delay={1} className="md:col-span-5 md:col-start-1">
              <div className="piece-tile-wrap">
                <PieceTile piece={featured[0]} scale="lg" priority />
              </div>
              <p className="mt-5 max-w-sm text-ink-soft text-[0.9375rem] leading-relaxed">
                סוליטר עגול שתי קראט על להקה דקה מפלטינה. הטבעת שאליה חוזרים אחרי שמסתכלים בכל השאר.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={2} className="md:col-span-5 md:col-start-7 md:mt-28">
              <div className="piece-tile-wrap">
                <PieceTile piece={featured[1]} scale="lg" />
              </div>
              <p className="mt-5 max-w-sm text-ink-soft text-[0.9375rem] leading-relaxed">
                שבעים ושתיים אבנים ביד אחת של אומן. הקלאסי שכולם רוצים להעתיק ואף אחד לא מצליח.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={3} className="md:col-span-5 md:col-start-2 md:mt-14">
              <div className="piece-tile-wrap">
                <PieceTile piece={featured[2]} scale="lg" />
              </div>
              <p className="mt-5 max-w-sm text-ink-soft text-[0.9375rem] leading-relaxed">
                יהלום אגס תלוי על שלוש מצולות. נוטה קלות קדימה, כדי לתפוס את האור הראשון של הבוקר.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── 4. THE ATELIER — VELVET BREAK ────────────────────────── */}
      <section className="relative overflow-hidden bg-velvet text-paper">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -5%, oklch(0.38 0.038 280 / 0.75), transparent 62%)",
          }}
        />
        <div className="relative mx-auto grid max-w-[1440px] gap-16 px-6 py-36 md:grid-cols-12 md:gap-12 md:px-12 md:py-44">
          <div className="md:col-span-5 md:col-start-1">
            <ScrollReveal>
              <p className="section-label" style={{ color: "oklch(0.74 0.110 78)" }}>חדר היצירה</p>
              <h2 className="display-he mt-6 text-[2.625rem] leading-[1.07] text-paper md:text-[3.75rem]">
                האטלייה
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={1}>
              <p className="mt-8 max-w-md text-[1.0625rem] leading-relaxed" style={{ color: "oklch(0.985 0.004 75 / 0.82)" }}>
                עיצוב מלא של טבעת כלולות בהזמנה אישית — בסיס, יהלום, מתכת, להקה. הבחירה שלך הופכת לתעודה אחת, ולפגישה אחת עם הצורף שיוציא אותה לפועל.
              </p>
              <div className="mt-10">
                <Link
                  href="/atelier"
                  className="brass-disc"
                  style={{
                    background: "transparent",
                    color: "oklch(0.985 0.004 75)",
                    borderColor: "oklch(0.74 0.110 78 / 0.75)",
                  }}
                >
                  לכניסה לאטלייה
                </Link>
              </div>
            </ScrollReveal>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <ScrollReveal delay={2}>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { num: "א", label: "בסיס" },
                  { num: "ב", label: "יהלום" },
                  { num: "ג", label: "מתכת" },
                ].map((step) => (
                  <div
                    key={step.num}
                    className="border bg-velvet-soft/25 px-5 py-10 text-center backdrop-blur-sm"
                    style={{ borderColor: "oklch(0.985 0.004 75 / 0.16)" }}
                  >
                    <span
                      className="display-he text-[2.5rem] leading-none"
                      style={{ color: "oklch(0.74 0.110 78)" }}
                    >
                      {step.num}
                    </span>
                    <span
                      className="mt-3 block text-[0.625rem] tracking-[0.22em] uppercase"
                      style={{ color: "oklch(0.985 0.004 75 / 0.65)" }}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-[0.8125rem] tracking-[0.04em]" style={{ color: "oklch(0.985 0.004 75 / 0.50)" }}>
                שלב רביעי: להקה. סיום בפגישה פרטית עם הצורף.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── 5. THE MIRROR ────────────────────────────────────────── */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-32 md:grid-cols-12 md:gap-12 md:px-12 md:py-40">
          <ScrollReveal direction="scale" className="md:col-span-6 md:col-start-1">
            <figure className="vellum relative aspect-[4/5] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=1400&q=85"
                alt="תליון יהלום על שרשרת דקה"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-[1400ms] ease-out hover:scale-[1.03]"
              />
              <Bracket position="top-start" />
              <Bracket position="top-end" />
              <Bracket position="bottom-start" />
              <Bracket position="bottom-end" />
            </figure>
          </ScrollReveal>

          <div className="md:col-span-5 md:col-start-8 md:self-center">
            <ScrollReveal direction="right">
              <p className="section-label">מראה</p>
              <h2 className="display-he mt-6 text-[2.5rem] leading-[1.08] text-ink md:text-[3.5rem]">
                המראה
              </h2>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={1}>
              <p className="mt-8 max-w-md text-[1.0625rem] leading-relaxed text-ink-soft">
                צילום אחד שלך, מהמצלמה או מהגלריה, ויצירה אחת מן הקטלוג — והמראה מציגה כיצד הן נראות יחד. הצילום לא יוצא מן המכשיר שלך. דבר אינו נשלח, דבר אינו נשמר.
              </p>
              <div className="mt-10">
                <Link href="/mirror" className="brass-disc">
                  לכניסה למראה
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
        <div className="optical-rule h-px w-full" />
      </section>

      {/* ── 6. SHOWROOM ──────────────────────────────────────────── */}
      <section className="bg-paper-deep">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-28 md:grid-cols-12 md:px-12 md:py-36">
          <ScrollReveal className="md:col-span-4">
            <p className="section-label">בית המאזון</p>
            <h2 className="display-he mt-6 text-[2rem] leading-[1.1] text-ink md:text-[2.5rem]">
              צפייה בתיאום מראש
            </h2>
          </ScrollReveal>
          <div className="md:col-span-6 md:col-start-6">
            <ScrollReveal delay={1} className="editorial">
              <p>
                בית מאזון מנא ממוקם בבורסת היהלומים שברמת גן, בקומה שלישית, מאחורי דלת ללא שלט. הכניסה היא בליווי, והפגישה היא של עד שעתיים: בה תתקבלי בכוס תה, יוצגו לך שלוש יצירות שנבחרו לפי שאלון מוקדם, וניתן לך הזמן לראות, למדוד, ולחזור.
              </p>
              <p className="text-ink-soft">
                אם רכישה תהיה — היא תיעשה אחרי. אם לא — לא קרה דבר.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={2}>
              <Link href="/inquiry" className="brass-disc brass-disc--solid mt-8 inline-flex">
                לקביעת המועד
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}

function Bracket({ position }: { position: "top-start" | "top-end" | "bottom-start" | "bottom-end" }) {
  const base = "absolute h-5 w-5 border-brass";
  const map: Record<string, string> = {
    "top-start":    `${base} top-3 start-3 border-t border-s`,
    "top-end":      `${base} top-3 end-3 border-t border-e`,
    "bottom-start": `${base} bottom-3 start-3 border-b border-s`,
    "bottom-end":   `${base} bottom-3 end-3 border-b border-e`,
  };
  return <span aria-hidden className={map[position]} />;
}
