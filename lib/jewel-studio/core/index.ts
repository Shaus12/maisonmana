// Headless entry: types, catalog, sizing and share links with no React or
// three.js dependency. Import this from UI code that must stay lightweight;
// load the 3D viewer itself lazily from "@/lib/jewel-studio/JewelStudio".

export * from "./types";
export {
  PIECE_TYPES,
  GEM_SHAPES,
  GEM_COLORS,
  METALS,
  METAL_FINISHES,
  HEAD_STYLES,
  PENDANT_HEAD_STYLES,
  EARRING_STYLES,
  BAND_STYLES,
  STONE_SET_BANDS,
} from "./catalog";
export { gemDimensions, formatGemSize, lineBraceletLayout, RING_SIZES, DEFAULT_RING_SIZE } from "./dimensions";
export { encodeDesign, decodeDesign } from "./share";
