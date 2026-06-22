import type { Metadata } from "next";
import "./globals.css";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { LanguageProvider } from "@/components/LanguageProvider";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { jewelryStoreJsonLd, websiteJsonLd } from "@/lib/seo";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://maisonmana.co.il"),
  title: {
    default: "Maison Mana | בית תכשיטים פרטי לטבעות אירוסין ותכשיטי יהלומים",
    template: "%s",
  },
  description:
    "Maison Mana הוא בית תכשיטים פרטי המתמחה בטבעות אירוסין, תכשיטי יהלומים ועיצוב אישי בפגישה פרטית.",
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "vJQdRnts0ZbOer0kiPrqb8DaIs5brUIeZBAu2TtpGyA",
  },
  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: "Maison Mana",
    title: "Maison Mana | בית תכשיטים פרטי לטבעות אירוסין ותכשיטי יהלומים",
    description:
      "Maison Mana הוא בית תכשיטים פרטי המתמחה בטבעות אירוסין, תכשיטי יהלומים ועיצוב אישי בפגישה פרטית.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // dir and lang are updated client-side by LanguageProvider
    <html lang="he" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600&family=Frank+Ruhl+Libre:wght@300;400;500;700&family=Heebo:wght@300;400;500;700&display=swap"
        />
      </head>
      <body className="bg-paper text-ink antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jewelryStoreJsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-50 focus:bg-paper focus:text-ink focus:px-3 focus:py-2 focus:border focus:border-rule"
        >
          Skip to content
        </a>
        <LanguageProvider>
          <Masthead />
          <main id="main">{children}</main>
          <Footer />
          <WhatsAppButton />
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
