import type { Metadata } from "next";
import "./globals.css";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { LanguageProvider } from "@/components/LanguageProvider";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  metadataBase: new URL("https://maisonmana.co.il"),
  title: {
    default: "Maison Mana — Bespoke Engagement Rings · Tel Aviv",
    template: "%s · Maison Mana",
  },
  description:
    "Maison Mana is a private jewellery house in Tel Aviv specialising in engagement rings, tennis bracelets, and bespoke pieces. Viewings by appointment only.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Maison Mana",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // dir and lang are updated client-side by LanguageProvider
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600&family=Frank+Ruhl+Libre:wght@300;400;500;700&family=Heebo:wght@300;400;500;700&display=swap"
        />
      </head>
      <body className="bg-paper text-ink antialiased">
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
      </body>
    </html>
  );
}
