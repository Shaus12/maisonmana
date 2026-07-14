import type { Metadata } from "next";
import "./globals.css";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { LanguageProvider } from "@/components/LanguageProvider";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { jewelryStoreJsonLd, websiteJsonLd, defaultOgImage, siteUrl } from "@/lib/seo";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
    google: ["vJQdRnts0ZbOer0kiPrqb8DaIs5brUIeZBAu2TtpGyA", "8KZY_W9pZkbImGHjhdG8tv6xBFBky6mtuAUSff9_F3o"],
  },
  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: "Maison Mana",
    title: "Maison Mana | בית תכשיטים פרטי לטבעות אירוסין ותכשיטי יהלומים",
    description:
      "Maison Mana הוא בית תכשיטים פרטי המתמחה בטבעות אירוסין, תכשיטי יהלומים ועיצוב אישי בפגישה פרטית.",
    images: [{ url: defaultOgImage, width: 1200, height: 630, alt: "Maison Mana" }],
  },
  twitter: {
    card: "summary_large_image",
    images: [defaultOgImage],
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
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');`}
            </Script>
          </>
        )}
        {metaPixelId && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
              n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
              document,'script','https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${metaPixelId}');
              fbq('track', 'PageView');`}
          </Script>
        )}
      </body>
    </html>
  );
}
