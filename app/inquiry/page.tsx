import { InquirySheet } from "@/components/InquirySheet";
import { pieceBySlug } from "@/lib/pieces";

export const metadata = {
  title: "יצירת קשר — בקשת פגישה פרטית",
  description: "תיאום פגישה פרטית בבית מאזון מנא ברמת גן.",
};

export default async function InquiryPage({
  searchParams,
}: {
  searchParams?: Promise<{ piece?: string; bespoke?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const piece = sp.piece ? pieceBySlug(sp.piece) : undefined;
  const presetPiece = piece ? `${piece.nameHe} · ${piece.reference}` : undefined;
  const presetBespoke = sp.bespoke;

  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-[1440px] px-6 pt-28 pb-12 md:px-12 md:pt-36 md:pb-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="section-label">פנייה</p>
            <h1 className="display-he mt-6 text-[3rem] leading-[1.05] text-ink md:text-[4.25rem]">
              לקביעת מועד
            </h1>
          </div>
          <div className="md:col-span-6 md:col-start-7 md:self-end editorial">
            <p>
              נחזור אליך תוך יום עסקים אחד, על פי פרטי הקשר שתשאירי. הפגישה תתואם לפי לוח הזמנים שלך, ולא להפך. אנו מקבלים פגישה אחת בלבד בכל שעה — כדי שתהיה הזמן.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-paper-deep py-20 md:py-28">
        <div className="px-6 md:px-12">
          <InquirySheet presetPiece={presetPiece} presetBespoke={presetBespoke} />
        </div>
      </div>

      <div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-20 md:grid-cols-3 md:px-12">
        <ContactBlock label="בית המאזון">
          בורסת היהלומים<br />רמת גן, ישראל<br />קומה שלישית, ללא שלט
        </ContactBlock>
        <ContactBlock label="שעות קבלה">
          ראשון–חמישי · 10:00–19:00<br />שישי · 9:30–13:00<br /><span className="text-ink-mute">בתיאום מראש בלבד</span>
        </ContactBlock>
        <ContactBlock label="התכתבות פרטית">
          <a href="mailto:salon@maisonmana.co.il" className="hairline-link">salon@maisonmana.co.il</a>
          <br />
          <a href="https://wa.me/972500000000" className="hairline-link">WhatsApp · התכתבות פרטית</a>
        </ContactBlock>
      </div>
    </section>
  );
}

function ContactBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-rule pt-6">
      <p className="section-label">{label}</p>
      <div className="mt-4 text-[0.9375rem] text-ink leading-relaxed">{children}</div>
    </div>
  );
}
