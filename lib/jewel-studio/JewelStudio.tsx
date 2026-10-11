"use client";

// <JewelStudio> — the public, brand-agnostic 3D viewer.
// Feed it a JewelDesign; it builds real-scale geometry, lights it in a
// procedural studio and renders ray-traced stones. Exposes capture/setView.

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, PerformanceMonitor } from "@react-three/drei";
import type * as THREE from "three";
import { buildPiece } from "./assembly";
import { disposeParts } from "./geometry/parts";
import type { JewelDesign, StudioHandle, StudioQuality, StudioTheme, StudioView } from "./core/types";
import { CameraRig } from "./scene/CameraRig";
import { PieceRenderer } from "./scene/PieceRenderer";
import { PostFX } from "./scene/PostFX";
import { StudioLighting, type LightingPreset } from "./scene/StudioLighting";

type Tier = Exclude<StudioQuality, "auto">;
const TIERS: Record<Tier, { dpr: [number, number]; bounces: number; bloom: boolean; msaa: number }> = {
  high: { dpr: [1, 2], bounces: 5, bloom: true, msaa: 4 },
  balanced: { dpr: [1, 1.5], bounces: 3, bloom: true, msaa: 2 },
  low: { dpr: [1, 1], bounces: 2, bloom: false, msaa: 2 },
};
const DOWNGRADE: Record<Tier, Tier> = { high: "balanced", balanced: "low", low: "low" };

export const DEFAULT_THEME: StudioTheme = { background: "#efeae3", shadow: "#5e554b", vignette: "rgba(120, 108, 95, 0.18)" };

export interface JewelStudioProps {
  design: JewelDesign;
  view?: StudioView;
  /** false = metal-only "skeleton" view. */
  showStones?: boolean;
  quality?: StudioQuality;
  lighting?: LightingPreset;
  theme?: Partial<StudioTheme>;
  autoRotate?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

function initialTier(quality: StudioQuality): Tier {
  if (quality !== "auto") return quality;
  if (typeof window === "undefined") return "balanced";
  const coarse = window.matchMedia?.("(pointer: coarse)").matches;
  return coarse || window.innerWidth < 900 ? "balanced" : "high";
}

export const JewelStudio = forwardRef<StudioHandle, JewelStudioProps>(function JewelStudio(
  { design, view = "hero", showStones = true, quality = "auto", lighting = "studio", theme, autoRotate = true, className, style },
  ref,
) {
  const palette = { ...DEFAULT_THEME, ...theme };
  const glRef = useRef<THREE.WebGLRenderer | null>(null);
  const [currentView, setCurrentView] = useState<StudioView>(view);
  const [tier, setTier] = useState<Tier>(() => initialTier(quality));
  const settings = TIERS[tier];

  useEffect(() => setCurrentView(view), [view]);

  // Only fields that change geometry; metal and colour swap materials in place.
  const { type, shape, carat, head, band, earring, ringSize } = design;
  const build = useMemo(
    () => buildPiece({ ...design }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [type, shape, carat, head, band, earring, ringSize],
  );
  useEffect(() => () => disposeParts(build.parts), [build]);

  useImperativeHandle(ref, () => ({
    capture: () => glRef.current?.domElement.toDataURL("image/png") ?? null,
    setView: setCurrentView,
  }), []);

  const grounded = type === "ring" || type === "bracelet";

  return (
    <div className={className} style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: palette.background, ...style }}>
      <Canvas
        flat
        dpr={settings.dpr}
        gl={{ antialias: false, preserveDrawingBuffer: true, powerPreference: "high-performance", alpha: false }}
        camera={{ fov: 28, near: 0.5, far: 2000, position: [0, 20, 80] }}
        onCreated={({ gl }) => { glRef.current = gl; }}
        style={{ touchAction: "none" }}
      >
        <color attach="background" args={[palette.background]} />
        <PerformanceMonitor onDecline={() => setTier((t) => DOWNGRADE[t])} flipflops={2} />
        <StudioLighting preset={lighting}>
          <PieceRenderer
            parts={build.parts}
            metal={design.metal}
            finish={design.finish ?? "polished"}
            gemColor={design.gemColor}
            showStones={showStones}
            bounces={settings.bounces}
          />
          {grounded && (
            <ContactShadows
              key={`${type}-${shape}-${carat}-${head}-${band}-${ringSize}`}
              position={[build.focus.center.x, build.floorY - 0.02, build.focus.center.z]}
              scale={build.focus.radius * 4.2}
              far={build.focus.radius * 1.6}
              blur={2.6}
              opacity={0.42}
              resolution={1024}
              color={palette.shadow}
              frames={1}
            />
          )}
        </StudioLighting>
        <CameraRig focus={build.focus} view={currentView} type={type} autoRotate={autoRotate} />
        <PostFX bloom={settings.bloom} multisampling={settings.msaa} />
      </Canvas>
      {palette.vignette && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: `radial-gradient(ellipse at 50% 45%, transparent 55%, ${palette.vignette} 100%)`,
          }}
        />
      )}
    </div>
  );
});
