// Hebrew-aware number and price formatting for the maison.

const ils = new Intl.NumberFormat("he-IL", {
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function formatPriceILS(value: number): string {
  return `${ils.format(value)} ש"ח`;
}

export function formatCarat(carat: number): string {
  if (Number.isInteger(carat)) return `${carat.toFixed(2)}`;
  return carat.toFixed(2);
}

const caratFmt = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCaratLatin(carat: number): string {
  return caratFmt.format(carat);
}

export function hebrewReference(num: number, prefix = "מ"): string {
  return `${prefix}-${String(num).padStart(4, "0")}`;
}
