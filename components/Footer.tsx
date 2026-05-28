import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-40 bg-paper-deep">
      <div className="optical-rule h-px w-full" />
      <div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-16 md:grid-cols-4 md:px-12 md:py-20">
        <div className="md:col-span-2">
          <p className="display-lat text-[2rem] leading-none text-ink">Maison Mana</p>
          <p className="mt-2 text-[0.6875rem] tracking-[0.22em] text-ink-mute uppercase">
            Atelier · Tel Aviv
          </p>
          <p className="mt-8 max-w-md text-ink-soft text-[0.9375rem] leading-relaxed">
            בית פרטי לתכשיטי כלולות. כל יצירה נעשית בידיים, בבורסת היהלומים שברמת גן, על פי בקשת לקוח.
          </p>
        </div>

        <div>
          <h4 className="section-label">בית המאזון</h4>
          <address className="mt-4 not-italic text-[0.9375rem] text-ink leading-relaxed">
            בורסת היהלומים
            <br />
            רמת גן · ישראל
            <br />
            <span className="text-ink-mute">בתיאום מראש בלבד</span>
          </address>
        </div>

        <div>
          <h4 className="section-label">התכתבות</h4>
          <ul className="mt-4 space-y-2 text-[0.9375rem]">
            <li>
              <Link href="/inquiry" className="hairline-link">
                בקשת פגישה פרטית
              </Link>
            </li>
            <li>
              <Link href="/atelier" className="hairline-link">
                תחילת יצירה בהזמנה
              </Link>
            </li>
            <li>
              <a href="mailto:salon@maisonmana.co.il" className="hairline-link">
                salon@maisonmana.co.il
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="optical-rule h-px w-full" />
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-6 py-8 text-[0.75rem] text-ink-mute md:flex-row md:items-center md:justify-between md:px-12">
        <p>© <bdi dir="ltr">{new Date().getFullYear()}</bdi> Maison Mana. כל הזכויות שמורות.</p>
        <p className="display-lat tracking-[0.18em] uppercase text-[0.6875rem]">
          Bespoke · Bridal · Made by Hand
        </p>
      </div>
    </footer>
  );
}
