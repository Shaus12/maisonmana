"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { CollectionItem } from "@/lib/collections";
import { ScrollReveal } from "@/components/ScrollReveal";

export function CollectionCard({ collection, index }: { collection: CollectionItem, index: number }) {
  const [imgError, setImgError] = useState(false);
  const { t } = useLanguage();

  const imageBlock = (
    <div
      className={`relative w-full overflow-hidden border border-ink/10 mb-6 ${
        collection.imagePadding ? "bg-paper p-8 md:p-12" : "bg-velvet"
      } text-paper h-[300px] md:h-[420px] ${collection.href ? "group-hover:opacity-90 transition-opacity duration-500" : ""}`}
    >
      {!imgError ? (
        <Image
          src={collection.image}
          alt={collection.alt}
          fill
          className={`transition-transform duration-[1400ms] ease-out ${
            collection.href ? "group-hover:scale-[1.03]" : ""
          } ${collection.imageFit === "contain" ? "object-contain" : "object-cover"}`}
          style={{ objectPosition: collection.objectPosition || "center center" }}
          sizes="(max-width: 768px) 100vw, 50vw"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-velvet-soft to-velvet p-6 text-center">
          <span className="text-paper/40 tracking-[0.25em] text-xs uppercase font-body" dir="ltr">
            {collection.label}
          </span>
        </div>
      )}
    </div>
  );

  const titleBlock = (
    <div className="flex flex-col items-start text-start">
      <span className="text-[0.625rem] tracking-[0.22em] uppercase text-ink-soft mb-3 font-body" dir="ltr">
        {collection.label}
      </span>
      <h2 className={`text-[1.375rem] font-serif text-ink mb-3 ${collection.href ? "group-hover:text-ink-soft transition-colors duration-300" : ""}`}>
        {t(collection.titleKey as any)}
      </h2>
      <p className="text-[0.9375rem] leading-relaxed text-ink-soft mb-5 max-w-md">
        {t(collection.descKey as any)}
      </p>
    </div>
  );

  return (
    <ScrollReveal delay={(index % 2) as 0 | 1}>
      <div className="w-full outline-none">
        {collection.href ? (
          <Link href={collection.href} className="group block w-full">
            {imageBlock}
            {titleBlock}
          </Link>
        ) : (
          <div className="group block w-full">
            {imageBlock}
            {titleBlock}
          </div>
        )}
        {collection.links && collection.links.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2.5">
            {collection.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-2 border border-ink/20 px-4 py-2 text-[0.875rem] tracking-wide text-ink hover:border-ink hover:bg-paper-deep transition-colors"
              >
                {t(link.labelKey as any)}
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden>
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </Link>
            ))}
          </div>
        )}
      </div>
    </ScrollReveal>
  );
}

