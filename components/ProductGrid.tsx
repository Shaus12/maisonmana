"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/products";

export function ProductGrid({ products, title, subtitle }: { products: Product[], title?: string, subtitle?: string }) {
  return (
    <section className="bg-paper border-t border-rule" dir="rtl">
      <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-12 md:py-24">
        <div className="mb-12 md:mb-16 md:text-center">
          <h2 className="display-he text-[2rem] text-ink md:text-[2.75rem]">
            {title || "פריטים זמינים להזמנה"}
          </h2>
          {subtitle && (
            <p className="mt-4 text-[1.0625rem] text-ink-soft max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => {
            const firstImage = product.images[0];
            const imgSrc = typeof firstImage === 'string' ? firstImage : firstImage?.src;
            const imgAlt = typeof firstImage === 'string' ? product.title : (firstImage?.alt || product.title);
            
            const optionsSummary = product.options && product.options.length > 0
              ? `אפשרויות: ${product.options.map(opt => opt.label.replace('בחירת ', '').replace('שם לבחירה', 'שם')).join(', ')}`
              : null;

            return (
              <div key={product.id} className="group flex flex-col">
                <Link href={`/products/${product.slug}`} className="block relative aspect-[4/5] w-full overflow-hidden bg-velvet mb-6">
                  {imgSrc ? (
                    <Image
                      src={imgSrc}
                      alt={imgAlt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-ink-mute bg-paper-deep">
                      אין תמונה
                    </div>
                  )}
                </Link>
                
                <div className="flex flex-col flex-grow">
                  <p className="text-[0.75rem] text-ink-mute tracking-widest uppercase mb-2">
                    {product.category}
                  </p>
                  <h3 className="display-he text-[1.375rem] leading-snug text-ink mb-3">
                    {product.title}
                  </h3>
                  <p className="text-[1.125rem] text-ink-soft mb-6">
                    {product.priceLabel}
                  </p>
                  
                  <ul className="mb-6 space-y-1.5 text-[0.875rem] text-ink-soft flex-grow">
                    {product.specs.slice(0, 4).map((spec, i) => (
                      <li key={i}>
                        <span className="text-ink">{spec.label}:</span> {spec.value}
                      </li>
                    ))}
                  </ul>

                  {optionsSummary && (
                    <p className="text-[0.875rem] text-ink-mute mb-8 border-t border-rule pt-4">
                      {optionsSummary}
                    </p>
                  )}

                  <div className="mt-auto pt-4">
                    <Link
                      href={`/products/${product.slug}`}
                      className="brass-disc brass-disc--solid w-full text-center flex justify-center py-3 text-[0.9375rem]"
                    >
                      צפייה והזמנה
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
