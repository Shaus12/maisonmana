// Compact, URL-safe design encoding so a design can be shared as a link.
// Format: dot-separated fields, each validated against the catalog on decode.

import { BAND_STYLES, EARRING_STYLES, GEM_COLORS, GEM_SHAPES, HEAD_STYLES, METALS, METAL_FINISHES, PIECE_TYPES } from "./catalog";
import { DEFAULT_RING_SIZE, RING_SIZES } from "./dimensions";
import type { JewelDesign } from "./types";

const VERSION = "1";

function pick<T extends string>(list: readonly T[], value: string | undefined): T | undefined {
  return list.find((item) => item === value);
}

export function encodeDesign(design: JewelDesign): string {
  return [
    VERSION,
    design.type,
    design.shape,
    design.carat.toFixed(2),
    design.gemColor,
    design.metal,
    design.finish ?? "polished",
    design.head ?? "-",
    design.band ?? "-",
    design.earring ?? "-",
    String(design.ringSize ?? DEFAULT_RING_SIZE),
  ].join(".");
}

/** Returns null for anything malformed — never trust a URL. */
export function decodeDesign(raw: string | null | undefined): JewelDesign | null {
  if (!raw || raw.length > 200) return null;
  const parts = raw.split(".");
  // "1.50" style carats contain a dot, so re-join the carat field.
  if (parts.length !== 12 || parts[0] !== VERSION) return null;
  const [, type, shape, caratWhole, caratFrac, gemColor, metal, finish, head, band, earring, size] = parts;

  const parsedType = pick(PIECE_TYPES, type);
  const parsedShape = pick(GEM_SHAPES, shape);
  const parsedColor = pick(GEM_COLORS, gemColor);
  const parsedMetal = pick(METALS, metal);
  const carat = Number(`${caratWhole}.${caratFrac}`);
  if (!parsedType || !parsedShape || !parsedColor || !parsedMetal) return null;
  if (!Number.isFinite(carat) || carat < 0.1 || carat > 20) return null;

  const ringSize = Number(size);
  return {
    type: parsedType,
    shape: parsedShape,
    carat,
    gemColor: parsedColor,
    metal: parsedMetal,
    finish: pick(METAL_FINISHES, finish) ?? "polished",
    head: pick(HEAD_STYLES, head),
    band: pick(BAND_STYLES, band),
    earring: pick(EARRING_STYLES, earring),
    ringSize: RING_SIZES.includes(ringSize) ? ringSize : DEFAULT_RING_SIZE,
  };
}
