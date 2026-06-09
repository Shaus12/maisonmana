"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CollectionItem } from "@/lib/collections";
import { ScrollReveal } from "@/components/ScrollReveal";

export function CollectionCard({ collection, index }: { collection: CollectionItem, index: number }) {
  const [imgError, setImgError] = useState(false);
  const isLarge = index < 2;

  return (
    <ScrollReveal delay={(index % 2) * 0.1}>
      <Link href={collection.href} className="group block w-full outline-none">
        <div
          className={`relative w-full overflow-hidden border border-ink/10 mb-6 ${collection.imagePadding ? "bg-paper p-8 md:p-12" : "bg-velvet"
            } text-paper h-[300px] md:h-[420px]`}
        >
          {!imgError ? (
            <Image
              src={collection.image}
              alt={collection.title}
              fill
              className={`transition-transform duration-[1400ms] ease-out group-hover:scale-[1.03] ${collection.imageFit === "contain" ? "object-contain" : "object-cover"
                }`}
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
        <div className="flex flex-col items-start text-start" dir="rtl">
          <span className="text-[0.625rem] tracking-[0.22em] uppercase text-ink-soft mb-3 font-body" dir="ltr">
            {collection.label}
          </span>
          <h3 className="text-[1.375rem] font-serif text-ink mb-3 group-hover:text-ink-soft transition-colors">
            {collection.title}
          </h3>
          <p className="text-[0.9375rem] leading-relaxed text-ink-soft mb-5 max-w-md">
            {collection.description}
          </p>
          <span className="inline-flex border-b border-ink/20 pb-0.5 text-[0.8125rem] tracking-widest text-ink group-hover:border-ink transition-colors">
            {collection.linkText}
          </span>
        </div>
      </Link>
    </ScrollReveal>
  );
}
