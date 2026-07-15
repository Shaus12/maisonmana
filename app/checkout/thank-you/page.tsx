import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "תודה על ההזמנה | Maison MANA",
  description: "תודה על ההזמנה ב-Maison MANA. ניצור קשר לאישור פרטי ההזמנה וההתאמות.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutThankYouPage() {
  return (
    <section className="min-h-screen bg-paper pt-28 pb-16 md:pt-36 md:pb-24" dir="rtl">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="grid gap-12 border-y border-rule py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-5">
            <p className="section-label">Maison MANA</p>
            <h1 className="display-he mt-6 text-[2.5rem] leading-[1.05] text-ink md:text-[4.25rem]">
              תודה על ההזמנה
            </h1>
          </div>

          <div className="flex flex-col justify-end text-right md:col-span-6 md:col-start-7">
            <p className="text-[1.25rem] leading-relaxed text-ink md:text-[1.5rem]">
              פרטי ההזמנה והתשלום התקבלו.
            </p>
            <p className="mt-6 text-[1.0625rem] leading-relaxed text-ink-soft">
              צוות Maison MANA יצור איתכם קשר לאישור ההתאמות, המידה, הזמינות ומועד האספקה.
            </p>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-mute">
              אם יש לכם בקשה דחופה או שינוי בפרטים, ניתן לפנות אלינו ישירות בוואטסאפ.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/products" className="brass-disc brass-disc--solid">
                חזרה לפריטים
              </Link>
              <a
                href="https://wa.me/972507099933"
                target="_blank"
                rel="noopener noreferrer"
                className="brass-disc"
              >
                התכתבות פרטית
              </a>
            </div>
          </div>
        </div>

        <div className="grid gap-8 py-12 md:grid-cols-3 md:py-16">
          <InfoBlock label="השלב הבא">
            נאמת את פרטי ההזמנה ונעדכן אתכם לפני תחילת ההכנה.
          </InfoBlock>
          <InfoBlock label="התאמות">
            צבע הזהב, אותיות, שם או צורת יהלום יאושרו מולכם באופן אישי.
          </InfoBlock>
          <InfoBlock label="תשלום">
            התשלום בוצע בעמוד המאובטח של SUMIT. פרטי האשראי אינם נשמרים באתר Maison MANA.
          </InfoBlock>
        </div>
      </div>
    </section>
  );
}

function InfoBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-rule pt-6 text-right">
      <p className="section-label">{label}</p>
      <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-soft">{children}</p>
    </div>
  );
}
