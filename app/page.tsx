import Image from "next/image";
import Link from "next/link";
import { PieceTile } from "@/components/PieceTile";
import { PIECES } from "@/lib/pieces";

const HOME_FEATURED = ["anna-solitaire", "tennis-classique", "adria-tear"];

export default function Home() {
  const featured = HOME_FEATURED.map(
    (slug) => PIECES.find((p) => p.slug === slug)!
  );

  return (
    <>
      {/* HERO — full-screen with video background */}
      <section className="hero-section relative flex h-[75vh] min-h-[480px] max-h-[800px] items-center justify-center overflow-hidden">
        {/* Background video — replace src with your video file */}
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1200&q=80"
          className="absolute inset-0 h-full w-full object-cover"
        >
          {/* <source src="/video/hero.mp4" type="video/mp4" /> */}
        </video>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Hero content — centered */}
        <div className="relative z-10 flex flex-col items-center px-6 text-center">
          <p className="hero-label display-lat text-[0.75rem] tracking-[0.3em] uppercase text-white/70 fade-in">
            Bespoke Bridal Jewelry · Tel Aviv
          </p>
          <h1 className="display-he mt-6 text-[2.75rem] leading-[1.08] text-white md:text-[4.5rem] lg:text-[5.5rem] fade-in">
            Maison Mana
          </h1>
          <p className="mt-6 max-w-lg text-[1.0625rem] leading-relaxed text-white/80 fade-in-delayed">
            בית תכשיטים פרטי המתמחה בטבעות אירוסין, צמידי טניס ויצירות בהזמנה אישית.
            <br />
            צפייה בתיאום מראש בלבד.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-5 fade-in-delayed">
            <Link href="/inquiry" className="hero-btn-solid">
              לקביעת פגישה
            </Link>
            <Link href="/atelier" className="hero-btn-outline">
              להתחלת יצירה
            </Link>
          </div>

        </div>
      </section>

      {/* MAISON STATEMENT */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-16 md:grid-cols-12 md:gap-12 md:px-12 md:py-20">
          <div className="md:col-span-3">
            <p className="section-label">בית המאזון</p>
          </div>
          <div className="md:col-span-7 md:col-start-5 editorial">
            <p className="display-he text-[1.75rem] leading-[1.45] text-ink md:text-[2rem]">
              &ldquo;מאזון מנא נבנה על שלושה כללים: שלא נמכור דבר שלא נלבש בעצמנו; שלא נחפוז להציע מה שלא הקשבנו לו; ושכל יהלום שיוצא מן הסדנה יישא תעודה, ושם, ושעה.&rdquo;
            </p>
            <p className="mt-8 text-ink-mute text-[0.9375rem]">
              — אנרי מנא, צורף, מייסד הבית, 2016
            </p>
          </div>
        </div>
        <div className="optical-rule h-px w-full" />
      </section>

      {/* SIGNATURE PIECES — asymmetric three-up */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-12 md:py-24">
          <header className="flex items-end justify-between gap-8 pb-12">
            <div>
              <p className="section-label">חלון התצוגה</p>
              <h2 className="display-he mt-4 text-[2.25rem] leading-[1.1] text-ink md:text-[2.75rem]">
                שלוש יצירות שנבחרו לעונה
              </h2>
            </div>
            <Link href="/collections" className="hairline-link text-[0.9375rem] whitespace-nowrap">
              לכל האוספים
            </Link>
          </header>

          <div className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-12">
            <div className="md:col-span-4 md:col-start-1 md:mt-0">
              <PieceTile piece={featured[0]} scale="lg" />
              <p className="mt-5 max-w-sm text-ink-soft text-[0.9375rem] leading-relaxed">
                סוליטר עגול שתי קראט על להקה דקה מפלטינה. הטבעת שאליה חוזרים אחרי שמסתכלים בכל השאר.
              </p>
            </div>
            <div className="md:col-span-4 md:col-start-5 md:mt-16">
              <PieceTile piece={featured[1]} scale="lg" />
              <p className="mt-5 max-w-sm text-ink-soft text-[0.9375rem] leading-relaxed">
                שבעים ושתיים אבנים ביד אחת של אומן. הקלאסי שכולם רוצים להעתיק ואף אחד לא מצליח.
              </p>
            </div>
            <div className="md:col-span-4 md:col-start-9 md:mt-8">
              <PieceTile piece={featured[2]} scale="lg" />
              <p className="mt-5 max-w-sm text-ink-soft text-[0.9375rem] leading-relaxed">
                יהלום אגס תלוי על שלוש מצולות. נוטה קלות קדימה, כדי לתפוס את האור הראשון של הבוקר.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* THE ATELIER — velvet break */}
      <section className="relative overflow-hidden bg-velvet text-paper">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% -10%, oklch(0.42 0.040 280 / 0.85), transparent 60%)",
          }}
        />
        <div className="relative mx-auto grid max-w-[1440px] gap-10 px-6 py-20 md:grid-cols-12 md:gap-10 md:px-12 md:py-28">
          <div className="md:col-span-5 md:col-start-1">
            <p className="section-label text-paper/65">חדר היצירה</p>
            <h2 className="display-he mt-6 text-[2.5rem] leading-[1.08] text-paper md:text-[3.75rem]">
              האטלייה
            </h2>
            <p className="mt-8 max-w-md text-[1.0625rem] leading-relaxed text-paper/85">
              עיצוב מלא של טבעת כלולות בהזמנה אישית, צעד אחר צעד — בסיס, יהלום, מתכת, להקה. הבחירה שלך הופכת לתעודה אחת, ולפגישה אחת עם הצורף שיוציא אותה לפועל.
            </p>
            <div className="mt-10">
              <Link
                href="/atelier"
                className="brass-disc"
                style={{ background: "transparent", color: "oklch(0.985 0.004 75)", borderColor: "oklch(0.88 0.060 82)" }}
              >
                לכניסה לאטלייה
              </Link>
            </div>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "א", he: "בסיס" },
                { label: "ב", he: "יהלום" },
                { label: "ג", he: "מתכת" },
              ].map((step) => (
                <div
                  key={step.label}
                  className="border border-paper/20 bg-velvet-soft/30 px-6 py-10 text-center backdrop-blur-sm"
                >
                  <span className="display-he text-[2.5rem] leading-none text-brass-leaf">{step.label}</span>
                  <span className="mt-3 block text-[0.6875rem] tracking-[0.2em] uppercase text-paper/75">
                    {step.he}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-[0.8125rem] tracking-[0.04em] text-paper/65">
              שלב רביעי: בחירת להקה. סיום בפגישה פרטית עם הצורף.
            </p>
          </div>
        </div>
      </section>

      {/* THE MIRROR */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-20 md:grid-cols-12 md:gap-10 md:px-12 md:py-28">
          <div className="md:col-span-5 md:col-start-1">
            <figure className="vellum relative aspect-[4/5] max-h-[420px] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=900&q=80"
                alt="תליון יהלום על שרשרת דקה — מבט אישי"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <Bracket position="top-start" />
              <Bracket position="top-end" />
              <Bracket position="bottom-start" />
              <Bracket position="bottom-end" />
            </figure>
          </div>
          <div className="md:col-span-5 md:col-start-8 md:self-center">
            <p className="section-label">מראה</p>
            <h2 className="display-he mt-6 text-[2.5rem] leading-[1.08] text-ink md:text-[3.5rem]">
              המראה
            </h2>
            <p className="mt-8 max-w-md text-[1.0625rem] leading-relaxed text-ink-soft">
              צילום אחד שלך, מהמצלמה או מהגלריה, ויצירה אחת מן הקטלוג — והמראה מציגה כיצד הן נראות יחד. הצילום לא יוצא מן המכשיר שלך. דבר אינו נשלח, דבר אינו נשמר.
            </p>
            <div className="mt-10">
              <Link href="/mirror" className="brass-disc">
                לכניסה למראה
              </Link>
            </div>
          </div>
        </div>
        <div className="optical-rule h-px w-full" />
      </section>

      {/* SHOWROOM */}
      <section className="bg-paper-deep">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-24 md:grid-cols-12 md:px-12 md:py-32">
          <div className="md:col-span-5">
            <p className="section-label">בית המאזון</p>
            <h2 className="display-he mt-6 text-[2.25rem] leading-[1.1] text-ink md:text-[2.75rem]">
              צפייה בתיאום מראש
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7 editorial">
            <p>
              בית מאזון מנא ממוקם בבורסת היהלומים שברמת גן, בקומה שלישית, מאחורי דלת ללא שלט. הכניסה היא בליווי, והפגישה היא של עד שעתיים: בה תתקבלי בכוס תה, יוצגו לך שלוש יצירות שנבחרו לפי שאלון מוקדם, וניתן לך הזמן לראות, למדוד, ולחזור.
            </p>
            <p className="text-ink-soft">
              אם רכישה תהיה — היא תיעשה אחרי. אם לא — לא קרה דבר.
            </p>
            <Link href="/inquiry" className="brass-disc brass-disc--solid mt-8">
              לקביעת המועד
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Bracket({ position }: { position: "top-start" | "top-end" | "bottom-start" | "bottom-end" }) {
  const base = "absolute h-5 w-5 border-brass";
  const map = {
    "top-start":    `${base} top-3 start-3 border-t border-s`,
    "top-end":      `${base} top-3 end-3 border-t border-e`,
    "bottom-start": `${base} bottom-3 start-3 border-b border-s`,
    "bottom-end":   `${base} bottom-3 end-3 border-b border-e`,
  };
  return <span aria-hidden className={map[position]} />;
}
