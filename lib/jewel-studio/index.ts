// Jewel Studio public API. This folder is self-contained and can be
// extracted as a package. Two entries:
//   "@/lib/jewel-studio"      — everything, including the 3D viewer
//   "@/lib/jewel-studio/core" — headless (no React / three.js), for light UI code

export { JewelStudio, DEFAULT_THEME, type JewelStudioProps } from "./JewelStudio";
export type { LightingPreset } from "./scene/StudioLighting";
export * from "./core";
export { JewelTryOn, DEFAULT_TRYON_LABELS, type JewelTryOnProps, type TryOnLabels } from "./ar/JewelTryOn";
