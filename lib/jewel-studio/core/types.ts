// Public types for Jewel Studio — a brand-agnostic 3D jewelry configurator.
// Nothing in this folder may import from the host application.

export type GemShape =
  | "round"
  | "oval"
  | "cushion"
  | "princess"
  | "emerald"
  | "pear"
  | "marquise"
  | "radiant"
  | "asscher"
  | "heart";

export type GemColor =
  | "colorless"
  | "yellow"
  | "pink"
  | "blue"
  | "green"
  | "black"
  | "brown"
  | "red";

export type MetalId = "yellow-gold" | "white-gold" | "rose-gold" | "platinum";
export type MetalFinish = "polished" | "satin";

export type PieceType = "ring" | "necklace" | "bracelet" | "earring";

/** How the centre stone is held (rings and pendants). */
export type HeadStyle = "solitaire" | "three-stone" | "halo" | "hidden-halo" | "pave" | "bezel";

export type EarringStyle = "stud" | "hoop";

export type BandStyle =
  | "classic"
  | "knife-edge"
  | "twisted"
  | "pave-band"
  | "split-shank"
  | "bypass"
  | "twisted-pave"
  | "infinity"
  | "braided"
  | "milgrain"
  | "tapered"
  | "reverse-tapered"
  | "chevron"
  | "vine"
  | "double-band"
  | "euro-shank"
  | "channel-set"
  | "scalloped-pave"
  | "beaded"
  | "vintage-scroll"
  | "concave"
  | "convex"
  | "rope"
  | "hammered";

/**
 * A complete, serialisable jewelry design.
 * - `carat` is the centre-stone weight for rings, pendants and each stud;
 *   for bracelets it is the total carat weight of the line.
 */
export interface JewelDesign {
  type: PieceType;
  shape: GemShape;
  carat: number;
  gemColor: GemColor;
  metal: MetalId;
  finish?: MetalFinish;
  head?: HeadStyle;
  band?: BandStyle;
  earring?: EarringStyle;
  /** EU ring size (inner circumference in mm). Defaults to 52. */
  ringSize?: number;
}

export type StudioView = "hero" | "front" | "side" | "top";
export type StudioQuality = "auto" | "high" | "balanced" | "low";

export interface StudioTheme {
  /** Backdrop colour behind the piece. */
  background: string;
  /** Colour of the soft contact shadow. */
  shadow: string;
  /** Optional radial vignette colour drawn over the canvas edges. */
  vignette?: string;
}

export interface StudioHandle {
  /** Returns the current frame as a PNG data URL, or null if not ready. */
  capture: () => string | null;
  setView: (view: StudioView) => void;
}

/** Real-world stone measurements in millimetres. */
export interface GemDimensions {
  width: number;
  length: number;
  depth: number;
  crownHeight: number;
  girdle: number;
  pavilionDepth: number;
  /** Table width as a fraction of stone width. */
  table: number;
}
