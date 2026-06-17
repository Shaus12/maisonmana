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
    <div className="flex flex-col items-start text-start" dir="rtl">
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
          <div className="mt-1 flex flex-wrap gap-x-5 gap-y-2" dir="rtl">
            {collection.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[0.8125rem] tracking-widest text-ink-soft border-b border-ink/10 pb-0.5 hover:text-ink hover:border-ink/40 transition-colors"
              >
                {t(link.labelKey as any)}
              </Link>
            ))}
          </div>
        )}
      </div>
    </ScrollReveal>
  );
}

