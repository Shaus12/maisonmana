import { notFound } from "next/navigation";
import { Metadata } from "next";
import { products } from "@/lib/products";
import { siteUrl } from "@/lib/seo";
import { ProductDetailClient } from "@/components/ProductDetailClient";

// Generate static routes for all products
export function generateStaticParams() {
  return Object.values(products).map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const product = Object.values(products).find((p) => p.slug === resolvedParams.slug);
  
  if (!product) {
    return { title: "Product Not Found" };
  }

  const title = `${product.title.he} | Maison MANA`;
  const description = product.shortDescription.he;
  const canonicalUrl = `${siteUrl}/products/${product.slug}`;
  const imageUrl = `${siteUrl}${product.images[0]?.src}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: [
        {
          url: imageUrl,
          alt: title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = Object.values(products).find((p) => p.slug === resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const canonicalUrl = `${siteUrl}/products/${product.slug}`;
  const imageUrl = `${siteUrl}${product.images[0]?.src}`;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title.he,
    image: imageUrl,
    description: product.shortDescription.he,
    brand: {
      "@type": "Brand",
      name: "Maison MANA"
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "ILS",
      url: canonicalUrl,
      availability: "https://schema.org/PreOrder"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductDetailClient product={product} />
    </>
  );
}
