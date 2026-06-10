import type { Metadata } from "next";

export const siteUrl = "https://maisonmana.co.il";
export const siteName = "Maison Mana";

type MetadataInput = {
  title: string;
  description: string;
  path: string;
};

export function buildMetadata({ title, description, path }: MetadataInput): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      locale: "he_IL",
      siteName,
      title,
      description,
      url: path,
    },
  };
}

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  url: siteUrl,
  inLanguage: "he",
};

export const jewelryStoreJsonLd = {
  "@context": "https://schema.org",
  "@type": "JewelryStore",
  name: siteName,
  description: "בית תכשיטים פרטי המתמחה בטבעות אירוסין, תכשיטי יהלומים ועיצוב אישי.",
  areaServed: "Israel",
  availableLanguage: "Hebrew",
  url: siteUrl,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ramat Gan",
    addressCountry: "IL",
  },
  telephone: "+972507099933",
  email: "salon@maisonmana.co.il",
};
