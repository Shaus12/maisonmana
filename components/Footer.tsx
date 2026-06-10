import Link from "next/link";

const collectionLinks = [
  { href: "/engagement-rings", label: "טבעות אירוסין" },
  { href: "/wedding-rings", label: "טבעות נישואין" },
  { href: "/diamond-rings", label: "טבעות יהלום" },
  { href: "/tennis-bracelets", label: "צמידי טניס" },
  { href: "/diamond-necklaces", label: "שרשראות יהלומים" },
  { href: "/diamond-earrings", label: "עגילי יהלומים" },
  { href: "/mens-jewelry", label: "תכשיטי גברים" },
  { href: "/high-jewelry", label: "High Jewelry" },
  { href: "/signature", label: "Signature Collection" },
];

const serviceLinks = [
  { href: "/atelier", label: "הדמיה אישית" },
  { href: "/atelier", label: "עיצוב תכשיט אישי" },
  { href: "/inquiry", label: "תיאום פגישה פרטית" },
  { href: "/diamonds", label: "ייעוץ יהלומים" },
  { href: "/about", label: "הסיפור שלנו" },
];

const diamondLinks = [
  { href: "/diamonds", label: "מדריך היהלומים" },
  { href: "/diamonds#natural-lab", label: "יהלומים טבעיים" },
  { href: "/diamonds#natural-lab", label: "יהלומי מעבדה" },
  { href: "/diamonds#certificates", label: "יהלומים עם תעודה" },
];

export function Footer() {
  return (
    <footer className="mt-40 bg-paper-deep">
      <div className="optical-rule h-px w-full" />
      <div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-16 md:grid-cols-5 md:px-12 md:py-20">
        <div className="md:col-span-2">
          <p className="display-lat text-[2rem] leading-none text-ink">Maison Mana</p>
          <p className="mt-2 text-[0.6875rem] tracking-[0.22em] text-ink-mute uppercase">
            Atelier
          </p>
          <p className="mt-8 max-w-md text-ink-soft text-[0.9375rem] leading-relaxed">
            בית פרטי לתכשיטי כלולות. כל יצירה נעשית בידיים, בבורסת היהלומים שברמת גן, על פי בקשת לקוח.
          </p>
        </div>

        <FooterGroup title="אוספים" links={collectionLinks} />
        <FooterGroup title="שירותים" links={serviceLinks} />
        <FooterGroup title="יהלומים" links={diamondLinks} />

        <div className="md:col-span-2">
          <p className="section-label">בית המאזון</p>
          <address className="mt-4 not-italic text-[0.9375rem] text-ink leading-relaxed">
            בורסת היהלומים
            <br />
            רמת גן · ישראל
            <br />
            <span className="text-ink-mute">בתיאום מראש בלבד</span>
          </address>
          <div className="mt-5 space-y-2 text-[0.9375rem]">
            <a href="mailto:salon@maisonmana.co.il" className="hairline-link">
              salon@maisonmana.co.il
            </a>
            <br />
            <a href="https://wa.me/972507099933" target="_blank" rel="noopener noreferrer" className="hairline-link">
              WhatsApp · +972 50-709-9933
            </a>
          </div>
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

function FooterGroup({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="section-label">{title}</p>
      <ul className="mt-4 space-y-2 text-[0.9375rem]">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link href={link.href} className="hairline-link">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
