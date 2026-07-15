import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProductCheckoutClient } from "@/components/ProductCheckoutClient";
import { canCheckoutProduct, products } from "@/lib/products";

export function generateStaticParams() {
  return Object.values(products).map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = Object.values(products).find((candidate) => candidate.slug === slug);

  return {
    title: product ? `השלמת הזמנה | ${product.title.he} | Maison MANA` : "השלמת הזמנה | Maison MANA",
    description: product
      ? `השלמת פרטי הזמנה עבור ${product.title.he} באתר Maison MANA.`
      : "השלמת פרטי הזמנה באתר Maison MANA.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = Object.values(products).find((candidate) => candidate.slug === slug);

  if (!product) {
    notFound();
  }

  if (!canCheckoutProduct(product)) {
    return <CheckoutUnavailable product={product} />;
  }

  const { paymentUrl: _paymentUrl, ...checkoutProduct } = product;

  return (
    <Suspense>
      <ProductCheckoutClient product={checkoutProduct} />
    </Suspense>
  );
}

function CheckoutUnavailable({ product }: { product: (typeof products)[string] }) {
  const image = product.images[0];

  return (
    <section className="min-h-screen bg-paper pt-28 pb-16 md:pt-36 md:pb-24" dir="rtl">
      <div className="mx-auto max-w-[1120px] px-6 md:px-12">
        <Link
          href={`/products/${product.slug}`}
          className="mb-8 inline-flex items-center gap-2 text-[0.875rem] text-ink-mute transition-colors hover:text-ink"
        >
          <span aria-hidden="true">→</span>
          חזרה לפריט
        </Link>

        <div className="grid gap-10 border border-rule bg-paper-deep p-5 md:grid-cols-2 md:p-8 lg:p-10">
          <figure className="relative aspect-[4/5] overflow-hidden bg-velvet">
            {image ? (
              <Image
                src={image.src}
                alt={image.alt.he}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-paper text-ink-mute">
                אין תמונה זמינה
              </div>
            )}
          </figure>

          <div className="flex flex-col justify-center text-right">
            <p className="section-label">{product.category.he}</p>
            <h1 className="display-he mt-4 text-[2rem] leading-[1.1] text-ink md:text-[2.75rem]">
              {product.title.he}
            </h1>
            <p className="mt-4 text-[1.375rem] text-ink">{product.priceLabel}</p>
            <p className="mt-6 text-[1.0625rem] leading-relaxed text-ink-soft">
              פריט זה זמין כעת להזמנה אישית דרך נציג Maison MANA.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/products/${product.slug}`} className="brass-disc brass-disc--solid">
                לבירור והזמנה
              </Link>
              <Link href="/products" className="brass-disc">
                חזרה לקטלוג
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
