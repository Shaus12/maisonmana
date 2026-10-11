// Option registries and physical presets. IDs only — display labels belong
// to the host application so the studio can be white-labelled.

import type { BandStyle, EarringStyle, GemColor, GemShape, HeadStyle, MetalFinish, MetalId, PieceType } from "./types";

export const PIECE_TYPES: readonly PieceType[] = ["ring", "necklace", "bracelet", "earring"];

export const GEM_SHAPES: readonly GemShape[] = [
  "round", "oval", "cushion", "princess", "emerald",
  "pear", "marquise", "radiant", "asscher", "heart",
];

export const GEM_COLORS: readonly GemColor[] = [
  "colorless", "yellow", "pink", "blue", "green", "black", "brown", "red",
];

export const METALS: readonly MetalId[] = ["yellow-gold", "white-gold", "rose-gold", "platinum"];
export const METAL_FINISHES: readonly MetalFinish[] = ["polished", "satin"];

export const HEAD_STYLES: readonly HeadStyle[] = ["solitaire", "three-stone", "halo", "hidden-halo", "pave", "bezel"];
export const PENDANT_HEAD_STYLES: readonly HeadStyle[] = ["solitaire", "halo", "bezel"];
export const EARRING_STYLES: readonly EarringStyle[] = ["stud", "hoop"];

export const BAND_STYLES: readonly BandStyle[] = [
  "classic", "knife-edge", "twisted", "pave-band", "split-shank", "bypass",
  "twisted-pave", "infinity", "braided", "milgrain", "tapered", "reverse-tapered",
  "chevron", "vine", "double-band", "euro-shank", "channel-set", "scalloped-pave",
  "beaded", "vintage-scroll", "concave", "convex", "rope", "hammered",
];

/** Bands that already carry their own melee stones. */
export const STONE_SET_BANDS: ReadonlySet<BandStyle> = new Set<BandStyle>([
  "pave-band", "twisted-pave", "channel-set", "scalloped-pave",
]);

/**
 * Physically based metal reflectance (sRGB) tuned for neutral tone mapping.
 * Roughness per finish; polished jewelry is close to a mirror.
 */
export const METAL_PRESETS: Record<MetalId, { color: string; roughness: Record<MetalFinish, number> }> = {
  "yellow-gold": { color: "#F1D08F", roughness: { polished: 0.07, satin: 0.34 } },
  "white-gold":  { color: "#E2E2DE", roughness: { polished: 0.06, satin: 0.32 } },
  "rose-gold":   { color: "#F3C1AA", roughness: { polished: 0.07, satin: 0.34 } },
  platinum:      { color: "#D9D6D0", roughness: { polished: 0.08, satin: 0.36 } },
};

/** Body tint applied to the refracted light. `opaque` stones are rendered as polished black. */
export const GEM_TINTS: Record<GemColor, { tint: string; opaque?: boolean }> = {
  colorless: { tint: "#ffffff" },
  yellow:    { tint: "#ffe07a" },
  pink:      { tint: "#ffb3c4" },
  blue:      { tint: "#9cc4ff" },
  green:     { tint: "#a8f0bf" },
  black:     { tint: "#0a0a0a", opaque: true },
  brown:     { tint: "#e8c08a" },
  red:       { tint: "#ff7a86" },
};

export type CutFamily = "brilliant" | "step";

/**
 * Shape proportions. `ratio` is length/width, `depth` is total depth/width,
 * `weight` is the industry carat-estimation factor (ct = L·W·D·weight, mm).
 */
export const SHAPE_PROPORTIONS: Record<GemShape, {
  cut: CutFamily;
  ratio: number;
  depth: number;
  weight: number;
  table: number;
  crown: number;
}> = {
  round:    { cut: "brilliant", ratio: 1.0,  depth: 0.615, weight: 0.0061,  table: 0.57, crown: 0.150 },
  oval:     { cut: "brilliant", ratio: 1.38, depth: 0.60,  weight: 0.0062,  table: 0.58, crown: 0.140 },
  cushion:  { cut: "brilliant", ratio: 1.06, depth: 0.66,  weight: 0.0081,  table: 0.60, crown: 0.135 },
  princess: { cut: "brilliant", ratio: 1.0,  depth: 0.70,  weight: 0.0083,  table: 0.68, crown: 0.100 },
  emerald:  { cut: "step",      ratio: 1.45, depth: 0.65,  weight: 0.0085,  table: 0.64, crown: 0.110 },
  pear:     { cut: "brilliant", ratio: 1.6,  depth: 0.60,  weight: 0.00615, table: 0.58, crown: 0.140 },
  marquise: { cut: "brilliant", ratio: 2.0,  depth: 0.58,  weight: 0.0058,  table: 0.57, crown: 0.135 },
  radiant:  { cut: "brilliant", ratio: 1.22, depth: 0.66,  weight: 0.0081,  table: 0.66, crown: 0.120 },
  asscher:  { cut: "step",      ratio: 1.0,  depth: 0.66,  weight: 0.0080,  table: 0.62, crown: 0.115 },
  heart:    { cut: "brilliant", ratio: 1.0,  depth: 0.58,  weight: 0.0059,  table: 0.56, crown: 0.135 },
};
