import type { Metadata } from "next";
import "./globals.css";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://maisonmana.co.il"),
  title: {
    default: "Maison Mana — תכשיטי כלולות בעבודת יד · תל אביב",
    template: "%s · Maison Mana",
  },
  description:
    "מאזון מנא היא בית תכשיטים פרטי בתל אביב המתמחה בטבעות אירוסין, צמידי טניס ויצירות בהזמנה אישית. צפייה בבית המאזון בתיאום מראש בלבד.",
  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: "Maison Mana",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Frank+Ruhl+Libre:wght@300;400;500;700&family=Heebo:wght@300;400;500;700&display=swap"
        />
      </head>
      <body className="bg-paper text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-50 focus:bg-paper focus:text-ink focus:px-3 focus:py-2 focus:border focus:border-rule"
        >
          דלגי לתוכן הראשי
        </a>
        <Masthead />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
