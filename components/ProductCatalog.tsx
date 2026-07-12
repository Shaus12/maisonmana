"use client";

import { useMemo, useState } from "react";
import { products, type ProductGroup } from "@/lib/products";
import { ProductGrid } from "@/components/ProductGrid";
import { useLanguage } from "@/components/LanguageProvider";
import type { StringKey } from "@/lib/i18n";

const GROUP_LABEL_KEYS: Record<ProductGroup, StringKey> = {
  rings: "group_rings",
  tennis: "group_tennis",
  bangles: "group_bangles",
  personalized: "group_personalized",
  bracelets: "group_bracelets",
};

const GROUP_ORDER: ProductGroup[] = ["tennis", "bangles", "personalized", "bracelets", "rings"];

export function ProductCatalog() {
  const { t } = useLanguage();
  const [activeGroup, setActiveGroup] = useState<ProductGroup | "all">("all");

  const allProducts = useMemo(() => Object.values(products), []);
  const availableGroups = GROUP_ORDER.filter((group) =>
    allProducts.some((p) => p.group === group)
  );

  const filtered =
    activeGroup === "all"
      ? allProducts
      : allProducts.filter((p) => p.group === activeGroup);

  return (
    <div className="bg-paper pt-28 md:pt-36">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="max-w-2xl">
          <p className="section-label">{t("catalog_label")}</p>
          <h1 className="display-he mt-5 text-[2.5rem] leading-[1.08] text-ink md:text-[4rem]">
            {t("catalog_title")}
          </h1>
          <p className="mt-6 text-[1.0625rem] leading-relaxed text-ink-soft">
            {t("catalog_body")}
          </p>
        </div>

        {/* Group filter */}
        <div className="mt-10 flex gap-3 overflow-x-auto pb-2 md:flex-wrap" role="tablist" aria-label="Product categories">
          <FilterChip
            active={activeGroup === "all"}
            onClick={() => setActiveGroup("all")}
            label={t("catalog_filter_all")}
          />
          {availableGroups.map((group) => (
            <FilterChip
              key={group}
              active={activeGroup === group}
              onClick={() => setActiveGroup(group)}
              label={t(GROUP_LABEL_KEYS[group])}
            />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <ProductGrid products={filtered} showHeader={false} />
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`shrink-0 border px-5 py-2.5 text-[0.9375rem] transition-colors duration-[280ms] ${
        active
          ? "border-brass bg-paper-deep text-ink"
          : "border-rule text-ink-soft hover:border-ink-mute hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}
