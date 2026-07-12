"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
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

type CatalogCategory = "all" | "necklaces" | "rings" | "earrings" | "bracelets";
type PriceFilter = "all" | "under-3000" | "3000-4999" | "5000-6999" | "7000-plus";
type SortFilter = "featured" | "price-low" | "price-high" | "name";

const MAIN_CATEGORIES: { id: CatalogCategory; labelKey: StringKey }[] = [
  { id: "all", labelKey: "catalog_filter_all" },
  { id: "rings", labelKey: "catalog_main_rings" },
  { id: "bracelets", labelKey: "catalog_main_bracelets" },
  { id: "necklaces", labelKey: "catalog_main_necklaces" },
  { id: "earrings", labelKey: "catalog_main_earrings" },
];

const CATEGORY_GROUPS: Record<CatalogCategory, ProductGroup[]> = {
  all: GROUP_ORDER,
  necklaces: [],
  rings: ["rings"],
  earrings: [],
  bracelets: ["tennis", "bangles", "personalized", "bracelets"],
};

const PRICE_FILTERS: { id: PriceFilter; labelKey: StringKey; min?: number; max?: number }[] = [
  { id: "all", labelKey: "catalog_price_all" },
  { id: "under-3000", labelKey: "catalog_price_under_3000", max: 2999 },
  { id: "3000-4999", labelKey: "catalog_price_3000_4999", min: 3000, max: 4999 },
  { id: "5000-6999", labelKey: "catalog_price_5000_6999", min: 5000, max: 6999 },
  { id: "7000-plus", labelKey: "catalog_price_7000_plus", min: 7000 },
];

const SORT_FILTERS: { id: SortFilter; labelKey: StringKey }[] = [
  { id: "featured", labelKey: "catalog_sort_featured" },
  { id: "price-low", labelKey: "catalog_sort_price_low" },
  { id: "price-high", labelKey: "catalog_sort_price_high" },
  { id: "name", labelKey: "catalog_sort_name" },
];

export function ProductCatalog() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const categoryParam = parseCategoryParam(searchParams.get("category"));
  const [activeCategory, setActiveCategory] = useState<CatalogCategory>(categoryParam);
  const [activeGroup, setActiveGroup] = useState<ProductGroup | "all">(
    categoryParam === "rings" ? "rings" : "all"
  );
  const [activePrice, setActivePrice] = useState<PriceFilter>("all");
  const [activeSort, setActiveSort] = useState<SortFilter>("featured");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);

  const allProducts = useMemo(() => Object.values(products), []);

  useEffect(() => {
    setActiveCategory(categoryParam);
    setActiveGroup(categoryParam === "rings" ? "rings" : "all");
  }, [categoryParam]);

  useEffect(() => {
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, [categoryParam]);

  const availableGroups = GROUP_ORDER.filter((group) =>
    CATEGORY_GROUPS[activeCategory].includes(group) && allProducts.some((p) => p.group === group)
  );

  const filtered = allProducts.filter((product) => {
    const categoryMatches = CATEGORY_GROUPS[activeCategory].includes(product.group);
    const groupMatches = activeGroup === "all" || product.group === activeGroup;
    const priceFilter = PRICE_FILTERS.find((filter) => filter.id === activePrice);
    const minMatches = priceFilter?.min === undefined || product.price >= priceFilter.min;
    const maxMatches = priceFilter?.max === undefined || product.price <= priceFilter.max;

    return categoryMatches && groupMatches && minMatches && maxMatches;
  });

  const sortedProducts = [...filtered].sort((a, b) => {
    if (activeSort === "price-low") return a.price - b.price;
    if (activeSort === "price-high") return b.price - a.price;
    if (activeSort === "name") return a.title.he.localeCompare(b.title.he, "he");

    return 0;
  });

  const applyCategory = (category: CatalogCategory) => {
    setActiveCategory(category);
    setActiveGroup(category === "rings" ? "rings" : "all");
  };

  const clearFilters = () => {
    setActiveCategory("all");
    setActiveGroup("all");
    setActivePrice("all");
  };

  const sortLabel = SORT_FILTERS.find((filter) => filter.id === activeSort)?.labelKey ?? "catalog_sort_featured";

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

        <div className="mt-10">
          <div className="flex gap-3 md:hidden">
            <button
              type="button"
              onClick={() => setMobileFilterOpen((open) => !open)}
              className="flex-1 border border-rule px-5 py-3 text-[0.9375rem] text-ink transition-colors hover:border-ink-mute"
              aria-expanded={mobileFilterOpen}
            >
              {t("catalog_filter_button")}
            </button>
            <button
              type="button"
              onClick={() => setMobileSortOpen((open) => !open)}
              className="flex-1 border border-rule px-5 py-3 text-[0.9375rem] text-ink transition-colors hover:border-ink-mute"
              aria-expanded={mobileSortOpen}
            >
              {t("catalog_sort_short")}
            </button>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-2 md:hidden" role="tablist" aria-label="Product categories">
            {MAIN_CATEGORIES.map((category) => (
              <FilterChip
                key={category.id}
                active={activeCategory === category.id}
                onClick={() => applyCategory(category.id)}
                label={t(category.labelKey)}
                compact
              />
            ))}
          </div>

          <div className="hidden items-center justify-between gap-6 md:flex" dir="rtl">
            <div className="flex flex-wrap justify-end gap-3" role="tablist" aria-label="Product categories">
              {MAIN_CATEGORIES.map((category) => (
                <FilterChip
                  key={category.id}
                  active={activeCategory === category.id}
                  onClick={() => applyCategory(category.id)}
                  label={t(category.labelKey)}
                />
              ))}
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setAdvancedOpen((open) => !open)}
                className={`border px-5 py-2.5 text-[0.9375rem] transition-colors duration-[280ms] ${
                  advancedOpen || activePrice !== "all" || activeGroup !== "all"
                    ? "border-brass bg-paper-deep text-ink"
                    : "border-rule text-ink-soft hover:border-ink-mute hover:text-ink"
                }`}
                aria-expanded={advancedOpen}
              >
                {t("catalog_advanced")}
              </button>
              <SortSelect
                label={t("catalog_sort_short")}
                value={activeSort}
                onChange={setActiveSort}
              />
            </div>
          </div>

          {mobileFilterOpen && (
            <div className="mt-5 border-y border-rule py-6 md:hidden">
              <AdvancedFilters
                availableGroups={availableGroups}
                activeCategory={activeCategory}
                activeGroup={activeGroup}
                activePrice={activePrice}
                onCategoryChange={applyCategory}
                onGroupChange={setActiveGroup}
                onPriceChange={setActivePrice}
                onClear={clearFilters}
              />
            </div>
          )}

          {mobileSortOpen && (
            <div className="mt-5 border-y border-rule py-6 md:hidden">
              <SortSelect
                label={t("catalog_sort_short")}
                value={activeSort}
                onChange={setActiveSort}
                fullWidth
              />
              <p className="mt-3 text-[0.8125rem] text-ink-mute">{t(sortLabel)}</p>
            </div>
          )}

          {advancedOpen && (
            <div className="mt-6 hidden border-y border-rule py-6 md:block">
              <AdvancedFilters
                availableGroups={availableGroups}
                activeCategory={activeCategory}
                activeGroup={activeGroup}
                activePrice={activePrice}
                onCategoryChange={applyCategory}
                onGroupChange={setActiveGroup}
                onPriceChange={setActivePrice}
                onClear={clearFilters}
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        {sortedProducts.length > 0 ? (
          <ProductGrid products={sortedProducts} showHeader={false} />
        ) : (
          <div className="mx-auto max-w-[1440px] border-t border-rule px-6 py-16 text-ink-soft md:px-12">
            {t("catalog_empty")}
          </div>
        )}
      </div>
    </div>
  );
}

function AdvancedFilters({
  availableGroups,
  activeCategory,
  activeGroup,
  activePrice,
  onCategoryChange,
  onGroupChange,
  onPriceChange,
  onClear,
}: {
  availableGroups: ProductGroup[];
  activeCategory: CatalogCategory;
  activeGroup: ProductGroup | "all";
  activePrice: PriceFilter;
  onCategoryChange: (category: CatalogCategory) => void;
  onGroupChange: (group: ProductGroup | "all") => void;
  onPriceChange: (price: PriceFilter) => void;
  onClear: () => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="grid gap-8 text-start md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-start">
      <div>
        <p className="mb-3 text-[0.75rem] uppercase tracking-[0.18em] text-ink-mute">
          {t("catalog_price_label")}
        </p>
        <div className="flex flex-wrap gap-3" role="tablist" aria-label="Product prices">
          {PRICE_FILTERS.map((filter) => (
            <FilterChip
              key={filter.id}
              active={activePrice === filter.id}
              onClick={() => onPriceChange(filter.id)}
              label={t(filter.labelKey)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-[0.75rem] uppercase tracking-[0.18em] text-ink-mute">
          {t("catalog_subcategory_label")}
        </p>
        <div className="mb-3 flex flex-wrap gap-3 md:hidden" role="tablist" aria-label="Product categories">
          {MAIN_CATEGORIES.map((category) => (
            <FilterChip
              key={category.id}
              active={activeCategory === category.id}
              onClick={() => onCategoryChange(category.id)}
              label={t(category.labelKey)}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-3" role="tablist" aria-label="Product subcategories">
          <FilterChip
            active={activeGroup === "all"}
            onClick={() => onGroupChange("all")}
            label={t("catalog_filter_all")}
          />
          {availableGroups.map((group) => (
            <FilterChip
              key={group}
              active={activeGroup === group}
              onClick={() => onGroupChange(group)}
              label={t(GROUP_LABEL_KEYS[group])}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onClear}
        className="self-end border border-rule px-5 py-2.5 text-[0.9375rem] text-ink-soft transition-colors hover:border-ink-mute hover:text-ink md:mt-8"
      >
        {t("catalog_clear_filters")}
      </button>
    </div>
  );
}

function SortSelect({
  label,
  value,
  onChange,
  fullWidth = false,
}: {
  label: string;
  value: SortFilter;
  onChange: (value: SortFilter) => void;
  fullWidth?: boolean;
}) {
  const { t } = useLanguage();

  return (
    <label className={`flex items-center gap-3 text-start ${fullWidth ? "w-full" : ""}`}>
      <span className="shrink-0 text-[0.75rem] uppercase tracking-[0.18em] text-ink-mute">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as SortFilter)}
        className={`border border-rule bg-paper px-4 py-2.5 text-[0.9375rem] text-ink transition-colors focus:border-brass focus:outline-none ${
          fullWidth ? "w-full" : "min-w-[210px]"
        }`}
      >
        {SORT_FILTERS.map((filter) => (
          <option key={filter.id} value={filter.id}>
            {t(filter.labelKey)}
          </option>
        ))}
      </select>
    </label>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  compact = false,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`shrink-0 border transition-colors duration-[280ms] ${
        compact ? "px-4 py-2 text-[0.8125rem]" : "px-5 py-2.5 text-[0.9375rem]"
      } ${
        active
          ? "border-brass bg-paper-deep text-ink"
          : "border-rule text-ink-soft hover:border-ink-mute hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}

function parseCategoryParam(value: string | null): CatalogCategory {
  if (
    value === "necklaces" ||
    value === "rings" ||
    value === "earrings" ||
    value === "bracelets"
  ) {
    return value;
  }

  return "all";
}
