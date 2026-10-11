// Real-world sizing: carat → millimetres, ring sizes, line-bracelet layout.

import { SHAPE_PROPORTIONS } from "./catalog";
import type { GemDimensions, GemShape } from "./types";

const GIRDLE_FRACTION = 0.03;

/** Proportions for a stone of a given width (mm). */
export function gemDimensionsFromWidth(shape: GemShape, width: number): GemDimensions {
  const p = SHAPE_PROPORTIONS[shape];
  const depth = width * p.depth;
  const crownHeight = width * p.crown;
  const girdle = width * GIRDLE_FRACTION;
  return {
    width,
    length: width * p.ratio,
    depth,
    crownHeight,
    girdle,
    pavilionDepth: depth - crownHeight - girdle,
    table: p.table,
  };
}

/** Face-up measurements of a stone of the given carat weight. */
export function gemDimensions(shape: GemShape, carat: number): GemDimensions {
  const p = SHAPE_PROPORTIONS[shape];
  const ct = Math.max(0.05, carat);
  const width = Math.cbrt(ct / (p.weight * p.ratio * p.depth));
  return gemDimensionsFromWidth(shape, width);
}

/** Carat weight of a round brilliant of the given diameter (mm). */
export function roundCaratFromDiameter(diameter: number): number {
  const p = SHAPE_PROPORTIONS.round;
  return p.weight * p.depth * diameter ** 3;
}

/** Human readable face-up size, e.g. "6.4" or "8.9 × 6.4". */
export function formatGemSize(dims: GemDimensions): string {
  const w = dims.width.toFixed(1);
  if (Math.abs(dims.length - dims.width) < 0.15) return w;
  return `${dims.length.toFixed(1)} × ${w}`;
}

export const DEFAULT_RING_SIZE = 52;
/** EU sizes (inner circumference, mm) — the standard used by Israeli jewelers. */
export const RING_SIZES: readonly number[] = Array.from({ length: 21 }, (_, i) => 44 + i);

export function ringInnerRadius(size: number = DEFAULT_RING_SIZE): number {
  return size / (2 * Math.PI);
}

/**
 * Lays out a line (tennis) bracelet: finds the stone diameter whose count
 * along `lengthMm` sums to the requested total carat weight.
 */
export function lineBraceletLayout(totalCarat: number, lengthMm = 170, gap = 0.55) {
  let lo = 0.8;
  let hi = 5.5;
  for (let i = 0; i < 40; i++) {
    const d = (lo + hi) / 2;
    const count = Math.floor(lengthMm / (d + gap));
    if (count * roundCaratFromDiameter(d) > totalCarat) hi = d;
    else lo = d;
  }
  const diameter = (lo + hi) / 2;
  return { diameter, count: Math.floor(lengthMm / (diameter + gap)) };
}
