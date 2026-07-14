import type { Metadata } from "next";

export const siteUrl = "https://www.masonmana-il.com";
export const siteName = "Maison Mana";
export const instagramUrl = "https://www.instagram.com/maisonmana.diamonds";
export const defaultOgImage = "/og-image.jpg";

type MetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
};

export function buildMetadata({ title, description, path, image }: MetadataInput): Metadata {
  const ogImage = image ?? defaultOgImage;
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
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
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
  availableLanguage: ["Hebrew", "English"],
  url: siteUrl,
  image: `${siteUrl}${defaultOgImage}`,
  priceRange: "₪₪₪",
  sameAs: [instagramUrl],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Israel Diamond Exchange",
    addressLocality: "Ramat Gan",
    addressCountry: "IL",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
      opens: "10:00",
      closes: "19:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Friday",
      opens: "09:30",
      closes: "13:00",
    },
  ],
  telephone: "+972507099933",
  email: "salon@maisonmana.co.il",
};
