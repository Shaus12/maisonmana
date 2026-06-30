import type { Metadata } from "next";

export const siteUrl = "https://masonmana-il.com";
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
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
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
