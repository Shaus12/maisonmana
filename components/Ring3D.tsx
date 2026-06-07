"use client";

import React, { useRef, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, MeshTransmissionMaterial, Float, ContactShadows, PresentationControls } from "@react-three/drei";
import * as THREE from "three";
import type { DiamondShape } from "@/lib/pieces";
import type { MetalOption, SettingOption, BandOption } from "@/lib/atelier-options";

// ─────────────────────────────────────────────────────────────
// Constants — ring geometry
// ─────────────────────────────────────────────────────────────
const BAND_RADIUS   = 1.0;   // major torus radius
const BAND_TUBE     = 0.12;  // tube radius
const BAND_TOP_Y    = BAND_RADIUS + BAND_TUBE;  // 1.12 — top of ring band

// ─────────────────────────────────────────────────────────────
// Metal colours
// ─────────────────────────────────────────────────────────────
function getMetalColor(metalId: string): string {
  switch (metalId) {
    case "yellow-gold": return "#E5B80B";
    case "white-gold":  return "#E8E9CE";
    case "rose-gold":   return "#B76E79";
    case "platinum":    return "#E5E4E2";
    default:            return "#E5B80B";
  }
}

// ─────────────────────────────────────────────────────────────
// Band geometry factory
// ─────────────────────────────────────────────────────────────
function createBandGeometry(band: string): THREE.BufferGeometry {
  if (["twisted", "twisted-pave", "braided", "rope"].includes(band))
    return new THREE.TorusKnotGeometry(BAND_RADIUS, 0.10, 128, 16, 2, 3);

  if (band === "knife-edge")
    return new THREE.TorusGeometry(BAND_RADIUS, 0.15, 4, 64);

  if (["split-shank", "bypass"].includes(band))
    return new THREE.TorusGeometry(BAND_RADIUS, 0.18, 32, 64);

  if (band === "chevron")
    return new THREE.TorusGeometry(BAND_RADIUS, 0.12, 16, 16);

  if (band === "concave")
    return new THREE.TorusGeometry(BAND_RADIUS, 0.12, 12, 64);

  return new THREE.TorusGeometry(BAND_RADIUS, BAND_TUBE, 64, 128);
}

// ─────────────────────────────────────────────────────────────
// Diamond mesh
// ─────────────────────────────────────────────────────────────
function Diamond({ carat, shape }: { carat: number; shape: DiamondShape }) {
  const size = 0.4 + carat * 0.1;

  const geometry = useMemo<THREE.BufferGeometry>(() => {
    switch (shape) {
      case "princess":
        // Octahedron — pointed top and bottom, square profile
        return new THREE.OctahedronGeometry(size * 0.85, 0);

      case "emerald":
        // Flat rectangular step cut
        return new THREE.BoxGeometry(size * 0.9, size * 0.55, size * 0.7);

      case "pear": {
        const s = new THREE.Shape();
        s.moveTo(0, size);
        s.quadraticCurveTo( size * 0.8,  size * 0.2,  size * 0.5, -size * 0.5);
        s.quadraticCurveTo( 0,          -size * 0.8, -size * 0.5, -size * 0.5);
        s.quadraticCurveTo(-size * 0.8,  size * 0.2,  0,           size);
        return new THREE.ExtrudeGeometry(s, {
          depth: size * 0.45, bevelEnabled: true,
          bevelSegments: 2, steps: 1, bevelSize: 0.05, bevelThickness: 0.05,
        });
      }

      case "marquise": {
        const s = new THREE.Shape();
        s.moveTo(0, size);
        s.quadraticCurveTo( size * 0.7, 0, 0, -size);
        s.quadraticCurveTo(-size * 0.7, 0, 0,  size);
        return new THREE.ExtrudeGeometry(s, {
          depth: size * 0.38, bevelEnabled: true,
          bevelSegments: 2, steps: 1, bevelSize: 0.05, bevelThickness: 0.05,
        });
      }

      case "heart": {
        const s = new THREE.Shape();
        const hx = 0, hy = 0;
        s.moveTo(hx + 0.25 * size, hy + 0.25 * size);
        s.bezierCurveTo(hx + 0.25 * size, hy + 0.25 * size, hx + 0.2 * size, hy,              hx,              hy);
        s.bezierCurveTo(hx - 0.3 * size,  hy,              hx - 0.3 * size, hy + 0.35 * size, hx - 0.3 * size, hy + 0.35 * size);
        s.bezierCurveTo(hx - 0.3 * size,  hy + 0.55 * size, hx - 0.1 * size, hy + 0.77 * size, hx + 0.25 * size, hy + 0.95 * size);
        s.bezierCurveTo(hx + 0.6 * size,  hy + 0.77 * size, hx + 0.8 * size, hy + 0.55 * size, hx + 0.8 * size, hy + 0.35 * size);
        s.bezierCurveTo(hx + 0.8 * size,  hy + 0.35 * size, hx + 0.8 * size, hy,               hx + 0.5 * size, hy);
        s.bezierCurveTo(hx + 0.35 * size, hy,               hx + 0.25 * size, hy + 0.25 * size, hx + 0.25 * size, hy + 0.25 * size);
        return new THREE.ExtrudeGeometry(s, {
          depth: size * 0.38, bevelEnabled: true,
          bevelSegments: 2, steps: 1, bevelSize: 0.05, bevelThickness: 0.05,
        });
      }

      case "round":
      default:
        // Inverted cone = round brilliant silhouette (table on top, culet below)
        return new THREE.CylinderGeometry(size, 0, size * 1.2, 16, 2);
    }
  }, [shape, size]);

  // ── Positioning ──────────────────────────────────────────────
  // For CylinderGeometry(size, 0, size*1.2):
  //   top (table/widest) = posY + size*0.6
  //   bottom (culet)     = posY - size*0.6
  // We place the culet exactly at BAND_TOP_Y so the stone
  // appears to emerge from the setting rather than floating.
  //
  // For extruded shapes their local Y runs roughly [-size*0.8 … +size].
  // Bottom of shape ≈ posY - size*0.8 → set to BAND_TOP_Y.

  const isExtruded = ["pear", "marquise", "heart"].includes(shape);

  // All shapes face the camera (no rotation needed):
  // — Round/princess/emerald: cylinder/box show side profile ✓
  // — Extruded shapes in XY plane: face visible from camera at z=4 ✓
  const rotation: [number, number, number] = [0, 0, 0];

  const positionY = isExtruded
    ? BAND_TOP_Y + size * 0.8   // bottom of extruded shape at band top
    : BAND_TOP_Y + size * 0.6;  // culet of round/princess/emerald at band top

  return (
    <mesh position={[0, positionY, 0]} rotation={rotation} castShadow geometry={geometry}>
      <MeshTransmissionMaterial
        backside
        backsideThickness={0.1}
        thickness={size}
        chromaticAberration={0.15}
        anisotropy={0.1}
        distortion={0.2}
        distortionScale={0.3}
        temporalDistortion={0}
        iridescence={1}
        iridescenceIOR={1}
        iridescenceThicknessRange={[0, 1400]}
        color="#ffffff"
        clearcoat={1}
        transmission={1}
        ior={2.42}
        roughness={0}
      />
    </mesh>
  );
}

// ─────────────────────────────────────────────────────────────
// Ring model — band + setting + pave
// ─────────────────────────────────────────────────────────────
function RingModel({
  band, metalId, setting, carat, showSkeleton,
}: {
  band: string;
  metalId: string;
  setting: string;
  carat: number;
  showSkeleton: boolean;
}) {
  const color  = getMetalColor(metalId);
  const size   = 0.4 + carat * 0.1;
  const ringRef = useRef<THREE.Group>(null);
  const geometry = useMemo(() => createBandGeometry(band), [band]);

  // Prong dimensions scale with stone size
  const prongHeight = 0.35 + size * 0.65;   // taller for larger stones
  const prongTopY   = size * 0.45;           // prong midpoint inside-to-top shifts up

  return (
    <group ref={ringRef} dispose={null}>

      {/* ── Band ─────────────────────────────────────────── */}
      {/* NO rotation — torus lies in XY plane (vertical ring).
          Top of ring = BAND_TOP_Y = 1.12.
          Setting group and diamond are both calibrated to this Y. */}
      <mesh castShadow receiveShadow geometry={geometry}>
        <meshStandardMaterial
          color={color}
          metalness={1}
          roughness={band === "hammered" || band === "vintage-scroll" ? 0.20 : 0.05}
          envMapIntensity={2}
          flatShading={band === "hammered"}
        />
      </mesh>

      {/* ── Pave stones on band ──────────────────────────── */}
      {["pave-band", "twisted-pave", "scalloped-pave", "channel-set"].includes(band) && (
        <group>
          {Array.from({ length: 20 }).map((_, i) => {
            // Positions along the top arc of the VERTICAL ring (XY plane)
            const angle = (i / 19) * Math.PI - Math.PI / 2;
            const r = band === "channel-set" ? 0.98 : 1.05;
            const px = Math.cos(angle) * r;
            const py = Math.sin(angle) * r;
            if (py < 0.2) return null;   // top half only
            return (
              <mesh key={i} position={[px, py, 0]} rotation={[Math.PI / 2, angle, 0]}>
                <cylinderGeometry args={[0.04, showSkeleton ? 0.04 : 0, 0.02, 8]} />
                {showSkeleton
                  ? <meshBasicMaterial color="#111" />
                  : <MeshTransmissionMaterial color="#ffffff" transmission={0.9} ior={2.4} roughness={0} thickness={0.1} />
                }
              </mesh>
            );
          })}
        </group>
      )}

      {/* ── Setting — sits at band top ────────────────────── */}
      {/* BAND_TOP_Y = 1.12 — inner base of the setting matches ring surface */}
      <group position={[0, BAND_TOP_Y - 0.05, 0]}>

        {/* Prongs (solitaire / three-stone / hidden-halo / pave) */}
        {setting !== "bezel" && (
          [-1, 1].flatMap(x =>
            [-1, 1].map(z => (
              <mesh
                key={`prong-${x}${z}`}
                position={[x * (size * 0.38), prongTopY, z * (size * 0.38)]}
                rotation={[-x * 0.18, 0, -z * 0.18]}
              >
                <cylinderGeometry args={[0.025, 0.018, prongHeight]} />
                <meshStandardMaterial color={color} metalness={1} roughness={0.05} />
              </mesh>
            ))
          )
        )}

        {/* Bezel — wraps around the stone base */}
        {setting === "bezel" && (
          <mesh position={[0, size * 0.15, 0]}>
            <cylinderGeometry args={[size * 0.68, size * 0.58, size * 0.55, 32]} />
            <meshStandardMaterial color={color} metalness={1} roughness={0.05} />
          </mesh>
        )}

        {/* Hidden halo — small pave ring just below the stone girdle */}
        {setting === "hidden-halo" && (
          <group position={[0, size * 0.5, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[size * 0.58, 0.02, 16, 32]} />
              <meshStandardMaterial color={color} metalness={1} roughness={0.05} />
            </mesh>
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2;
              return (
                <mesh
                  key={`halo-${i}`}
                  position={[Math.cos(a) * size * 0.58, 0, Math.sin(a) * size * 0.58]}
                  rotation={[Math.PI / 2, 0, 0]}
                >
                  <cylinderGeometry args={[0.018, showSkeleton ? 0.018 : 0, 0.01, 8]} />
                  {showSkeleton
                    ? <meshBasicMaterial color="#111" />
                    : <MeshTransmissionMaterial color="#ffffff" transmission={0.9} ior={2.4} roughness={0} thickness={0.1} />
                  }
                </mesh>
              );
            })}
          </group>
        )}

        {/* Three-stone — side stones flanking the main stone */}
        {setting === "three-stone" && (
          <>
            {[-1, 1].map(side => (
              <group
                key={`side-${side}`}
                position={[side * (size * 0.88), size * 0.1, 0]}
                rotation={[0, 0, side * -0.28]}
              >
                {!showSkeleton && (
                  <mesh>
                    <octahedronGeometry args={[size * 0.32, 0]} />
                    <MeshTransmissionMaterial color="#ffffff" transmission={1} ior={2.42} roughness={0} />
                  </mesh>
                )}
                {[-1, 1].flatMap(sx =>
                  [-1, 1].map(sz => (
                    <mesh
                      key={`sp-${sx}${sz}`}
                      position={[sx * 0.10, size * 0.18, sz * 0.10]}
                      rotation={[-sx * 0.18, 0, -sz * 0.18]}
                    >
                      <cylinderGeometry args={[0.014, 0.010, 0.28]} />
                      <meshStandardMaterial color={color} metalness={1} roughness={0.05} />
                    </mesh>
                  ))
                )}
              </group>
            ))}
          </>
        )}
      </group>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
// Exported component
// ─────────────────────────────────────────────────────────────
export function Ring3D({
  shape,
  metal,
  setting,
  band,
  carat,
  showSkeleton = false,
}: {
  shape: DiamondShape;
  metal: MetalOption;
  setting: string;
  band: string;
  carat: number;
  showSkeleton?: boolean;
}) {
  return (
    <div className="w-full h-[40vh] min-h-[240px] md:h-[60vh] md:min-h-[380px] relative rounded-lg overflow-hidden bg-[#161314] cursor-grab active:cursor-grabbing">
      <React.Suspense
        fallback={
          <div className="absolute inset-0 flex items-center justify-center text-[#E1D1C1]/50 text-sm tracking-widest">
            Loading 3D Studio…
          </div>
        }
      >
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 0.8, 4.2], fov: 42 }}
        >
          <color attach="background" args={["#161314"]} />

          <ambientLight intensity={0.35} />
          <spotLight position={[4, 8, 5]}  angle={0.22} penumbra={1} intensity={2.2} castShadow />
          <spotLight position={[-5, 4, -4]} angle={0.22} penumbra={1} intensity={0.9} color="#E1D1C1" />

          <PresentationControls
            global
            rotation={[0.12, -Math.PI / 4, 0]}
            polar={[-Math.PI / 3, Math.PI / 3]}
            azimuth={[-Math.PI, Math.PI]}
            snap={true}
          >
            <Float rotationIntensity={0.15} floatIntensity={0.08} speed={1.4}>
              <RingModel
                band={band}
                metalId={metal.id}
                setting={setting}
                carat={carat}
                showSkeleton={showSkeleton}
              />
              {!showSkeleton && <Diamond carat={carat} shape={shape} />}
            </Float>
          </PresentationControls>

          <ContactShadows
            position={[0, -1.4, 0]}
            opacity={0.55}
            scale={10}
            blur={2.8}
            far={4}
            color="#000000"
          />
          <Environment preset="studio" />
        </Canvas>
      </React.Suspense>

      <div className="absolute bottom-6 left-0 right-0 text-center text-[0.65rem] text-[#E1D1C1]/40 pointer-events-none tracking-[0.2em] uppercase">
        Drag to rotate · 3D Studio
      </div>
    </div>
  );
}
