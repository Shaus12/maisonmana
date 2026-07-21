"use client";

import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, ContactShadows, Lightformer, MeshTransmissionMaterial, PresentationControls } from "@react-three/drei";
import * as THREE from "three";
import type { DiamondShape } from "@/lib/pieces";
import type { MetalOption, JewelryType } from "@/lib/atelier-options";

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

const METAL_PRESETS: Record<string, { color: string; roughness: number; envMapIntensity: number; clearcoat: number }> = {
  "yellow-gold": { color: "#E2B53C", roughness: 0.23, envMapIntensity: 2.25, clearcoat: 0.14 },
  "white-gold":  { color: "#F0EEE9", roughness: 0.24, envMapIntensity: 2.45, clearcoat: 0.1 },
  "rose-gold":   { color: "#CF8D82", roughness: 0.22, envMapIntensity: 2.25, clearcoat: 0.14 },
  platinum:       { color: "#E7E8E9", roughness: 0.23, envMapIntensity: 2.4, clearcoat: 0.08 },
};

function MetalMaterial({ metalId, textured = false, skeleton = false }: { metalId: string; textured?: boolean; skeleton?: boolean }) {
  const preset = METAL_PRESETS[metalId] ?? {
    color: getMetalColor(metalId),
    roughness: 0.18,
    envMapIntensity: 2.15,
    clearcoat: 0.18,
  };
  return (
    <meshPhysicalMaterial
      color={preset.color}
      metalness={1}
      roughness={skeleton ? 0.25 : textured ? 0.22 : preset.roughness}
      envMapIntensity={skeleton ? 1.35 : preset.envMapIntensity}
      clearcoat={skeleton ? 0.05 : preset.clearcoat}
      clearcoatRoughness={0.3}
    />
  );
}

function GemMaterial({ color, small = false }: { color: string; small?: boolean }) {
  if (small) {
    return <meshPhysicalMaterial color={color} metalness={0} roughness={0.025} transmission={0.96} ior={2.42} thickness={0.08} envMapIntensity={1.65} clearcoat={0.35} />;
  }
  return (
    <MeshTransmissionMaterial
      color={color}
      transmission={0.98}
      roughness={0.015}
      ior={2.42}
      thickness={0.32}
      chromaticAberration={0.012}
      anisotropy={0.04}
      distortion={0.015}
      distortionScale={0.08}
      temporalDistortion={0}
      samples={4}
      resolution={256}
    />
  );
}

function StudioEnvironment({ skeleton }: { skeleton: boolean }) {
  return (
    <Environment resolution={128} background={false} frames={1}>
      {/* A neutral cyclorama fill prevents fully metallic surfaces from
          reflecting the virtual scene's default black between light cards. */}
      <color attach="background" args={[skeleton ? "#d2ccc4" : "#a39a90"]} />
      <Lightformer form="rect" intensity={skeleton ? 3.2 : 4.8} color="#ffffff" scale={[5, 8, 1]} position={[-5, 1, 3]} rotation={[0, 0.55, 0]} />
      <Lightformer form="rect" intensity={skeleton ? 3.0 : 4.4} color="#fffdfa" scale={[5, 8, 1]} position={[5, 1, 3]} rotation={[0, -0.55, 0]} />
      <Lightformer form="rect" intensity={skeleton ? 2.6 : 3.8} color="#ffffff" scale={[7, 3, 1]} position={[0, 6, 1]} rotation={[Math.PI / 2, 0, 0]} />
      <Lightformer form="rect" intensity={1.6} color="#f5f1eb" scale={[3, 3, 1]} position={[0, 0, 5]} />
      <Lightformer form="rect" intensity={0.5} color="#6f6a64" scale={[1.2, 7, 1]} position={[0, 1, -4]} rotation={[0, Math.PI, 0]} />
    </Environment>
  );
}

// ─────────────────────────────────────────────────────────────
// Band geometry factory
// ─────────────────────────────────────────────────────────────
function createBandGeometry(band: string): THREE.BufferGeometry {
  if (["twisted", "twisted-pave", "braided", "rope"].includes(band))
    return new THREE.TorusKnotGeometry(BAND_RADIUS, 0.09, 48, 8, 2, 3);

  if (band === "knife-edge")
    return new THREE.TorusGeometry(BAND_RADIUS, 0.15, 4, 32);

  if (["split-shank", "bypass"].includes(band))
    return new THREE.TorusGeometry(BAND_RADIUS, 0.18, 16, 32);

  if (band === "chevron")
    return new THREE.TorusGeometry(BAND_RADIUS, 0.12, 12, 16);

  if (band === "concave")
    return new THREE.TorusGeometry(BAND_RADIUS, 0.12, 8, 32);

  return new THREE.TorusGeometry(BAND_RADIUS, BAND_TUBE, 24, 64);
}

// ─────────────────────────────────────────────────────────────
// Diamond Mesh Component (Supports all 10 shapes & custom colors)
// ─────────────────────────────────────────────────────────────
function Diamond({ size, shape, color, rotation = [0, 0, 0] }: { size: number; shape: DiamondShape; color: string; rotation?: [number, number, number] }) {
  const geometry = useMemo<THREE.BufferGeometry>(() => {
    switch (shape) {
      case "princess":
        return new THREE.OctahedronGeometry(size * 0.85, 0);

      case "emerald":
        return new THREE.BoxGeometry(size * 0.9, size * 0.55, size * 0.7);

      case "pear": {
        const s = new THREE.Shape();
        s.moveTo(0, size);
        s.quadraticCurveTo(size * 0.8, size * 0.2, size * 0.5, -size * 0.5);
        s.quadraticCurveTo(0, -size * 0.8, -size * 0.5, -size * 0.5);
        s.quadraticCurveTo(-size * 0.8, size * 0.2, 0, size);
        return new THREE.ExtrudeGeometry(s, {
          depth: size * 0.45, bevelEnabled: true,
          bevelSegments: 2, steps: 1, bevelSize: 0.05, bevelThickness: 0.05,
        });
      }

      case "marquise": {
        const s = new THREE.Shape();
        s.moveTo(0, size);
        s.quadraticCurveTo(size * 0.7, 0, 0, -size);
        s.quadraticCurveTo(-size * 0.7, 0, 0, size);
        return new THREE.ExtrudeGeometry(s, {
          depth: size * 0.38, bevelEnabled: true,
          bevelSegments: 2, steps: 1, bevelSize: 0.05, bevelThickness: 0.05,
        });
      }

      case "heart": {
        const s = new THREE.Shape();
        const hx = 0, hy = 0;
        s.moveTo(hx + 0.25 * size, hy + 0.25 * size);
        s.bezierCurveTo(hx + 0.25 * size, hy + 0.25 * size, hx + 0.2 * size, hy, hx, hy);
        s.bezierCurveTo(hx - 0.3 * size, hy, hx - 0.3 * size, hy + 0.35 * size, hx - 0.3 * size, hy + 0.35 * size);
        s.bezierCurveTo(hx - 0.3 * size, hy + 0.55 * size, hx - 0.1 * size, hy + 0.77 * size, hx + 0.25 * size, hy + 0.95 * size);
        s.bezierCurveTo(hx + 0.6 * size, hy + 0.77 * size, hx + 0.8 * size, hy + 0.55 * size, hx + 0.8 * size, hy + 0.35 * size);
        s.bezierCurveTo(hx + 0.8 * size, hy + 0.35 * size, hx + 0.8 * size, hy, hx + 0.5 * size, hy);
        s.bezierCurveTo(hx + 0.35 * size, hy, hx + 0.25 * size, hy + 0.25 * size, hx + 0.25 * size, hy + 0.25 * size);
        return new THREE.ExtrudeGeometry(s, {
          depth: size * 0.38, bevelEnabled: true,
          bevelSegments: 2, steps: 1, bevelSize: 0.05, bevelThickness: 0.05,
        });
      }

      case "oval":
        return new THREE.CylinderGeometry(size, 0, size * 1.2, 16, 2);

      case "cushion":
        return new THREE.CylinderGeometry(size, 0, size * 1.2, 4, 2);

      case "radiant":
        return new THREE.BoxGeometry(size * 1.1, size * 0.6, size * 0.9);

      case "asscher":
        return new THREE.BoxGeometry(size * 0.95, size * 0.6, size * 0.95);

      case "round":
      default:
        return new THREE.CylinderGeometry(size, 0, size * 1.2, 16, 2);
    }
  }, [shape, size]);

  const scale: [number, number, number] = useMemo(() => {
    if (shape === "oval") return [1.35, 1, 0.95];
    if (shape === "cushion") return [1.1, 1, 1.1];
    return [1, 1, 1];
  }, [shape]);

  return (
    <mesh castShadow geometry={geometry} scale={scale} rotation={rotation}>
      <GemMaterial color={color} />
    </mesh>
  );
}

// ─────────────────────────────────────────────────────────────
// Ring Model
// ─────────────────────────────────────────────────────────────
function RingModel({
  band, metalId, setting, carat, showSkeleton, diamondColor, shape
}: {
  band: string;
  metalId: string;
  setting: string;
  carat: number;
  showSkeleton: boolean;
  diamondColor: string;
  shape: DiamondShape;
}) {
  const size = 0.4 + carat * 0.1;
  const ringRef = useRef<THREE.Group>(null);
  const geometry = useMemo(() => createBandGeometry(band), [band]);

  const prongHeight = 0.35 + size * 0.65;
  const prongTopY = size * 0.45;

  const isExtruded = ["pear", "marquise", "heart"].includes(shape);
  const diamondRotation: [number, number, number] = isExtruded
    ? [-Math.PI / 2, 0, 0]
    : [0, 0, 0];
  const diamondPositionY = isExtruded
    ? BAND_TOP_Y + size * 0.18
    : BAND_TOP_Y + size * 0.6;

  return (
    <group ref={ringRef} dispose={null}>
      {/* Band */}
      <mesh castShadow receiveShadow geometry={geometry}>
        <MetalMaterial metalId={metalId} textured={band === "hammered" || band === "vintage-scroll"} skeleton={showSkeleton} />
      </mesh>

      {/* Pave stones on band */}
      {["pave-band", "twisted-pave", "scalloped-pave", "channel-set"].includes(band) && (
        <group>
          {Array.from({ length: 20 }).map((_, i) => {
            const angle = (i / 19) * Math.PI - Math.PI / 2;
            const r = band === "channel-set" ? 0.98 : 1.05;
            const px = Math.cos(angle) * r;
            const py = Math.sin(angle) * r;
            if (py < 0.2) return null;
            return (
              <mesh key={i} position={[px, py, 0]} rotation={[Math.PI / 2, angle, 0]}>
                <cylinderGeometry args={[0.04, showSkeleton ? 0.04 : 0, 0.02, 8]} />
                {showSkeleton
                  ? <MetalMaterial metalId={metalId} skeleton />
                  : <GemMaterial color="#ffffff" small />
                }
              </mesh>
            );
          })}
        </group>
      )}

      {/* Setting */}
      <group position={[0, BAND_TOP_Y - 0.05, 0]}>
        {/* Prongs */}
        {setting !== "bezel" && (
          [-1, 1].flatMap(x =>
            [-1, 1].map(z => (
              <mesh
                key={`prong-${x}${z}`}
                position={[x * (size * 0.38), prongTopY, z * (size * 0.38)]}
                rotation={[-x * 0.18, 0, -z * 0.18]}
              >
                <cylinderGeometry args={[0.025, 0.018, prongHeight]} />
                <MetalMaterial metalId={metalId} skeleton={showSkeleton} />
              </mesh>
            ))
          )
        )}

        {/* Bezel */}
        {setting === "bezel" && (
          <mesh position={[0, size * 0.15, 0]}>
            <cylinderGeometry args={[size * 0.68, size * 0.58, size * 0.55, 32]} />
            <MetalMaterial metalId={metalId} skeleton={showSkeleton} />
          </mesh>
        )}

        {/* Hidden halo */}
        {setting === "hidden-halo" && (
          <group position={[0, size * 0.5, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[size * 0.58, 0.02, 16, 32]} />
              <MetalMaterial metalId={metalId} skeleton={showSkeleton} />
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
                    ? <MetalMaterial metalId={metalId} skeleton />
                    : <GemMaterial color="#ffffff" small />
                  }
                </mesh>
              );
            })}
          </group>
        )}

        {/* Three-stone */}
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
                    <GemMaterial color="#ffffff" small />
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
                      <MetalMaterial metalId={metalId} skeleton={showSkeleton} />
                    </mesh>
                  ))
                )}
              </group>
            ))}
          </>
        )}
      </group>

      {/* Main stone */}
      {!showSkeleton && (
        <group position={[0, diamondPositionY, 0]}>
          <Diamond size={size} shape={shape} color={diamondColor} rotation={diamondRotation} />
        </group>
      )}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
// Necklace Model
// ─────────────────────────────────────────────────────────────
function NecklaceModel({
  metalId, carat, showSkeleton, diamondColor, shape
}: {
  metalId: string;
  carat: number;
  showSkeleton: boolean;
  diamondColor: string;
  shape: DiamondShape;
}) {
  const size = 0.4 + carat * 0.1;
  const isExtruded = ["pear", "marquise", "heart"].includes(shape);
  const diamondRotation: [number, number, number] = isExtruded
    ? [0, 0, 0]
    : [Math.PI / 2, 0, 0];

  const chainCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.8, 1.2, 0),
      new THREE.Vector3(-0.9, 0.1, 0.1),
      new THREE.Vector3(0, -0.4, 0.15),
      new THREE.Vector3(0.9, 0.1, 0.1),
      new THREE.Vector3(1.8, 1.2, 0),
    ]);
  }, []);

  return (
    <group position={[0, 0.2, 0]}>
      {/* Chain */}
      <mesh castShadow receiveShadow>
        <tubeGeometry args={[chainCurve, 64, 0.016, 8, false]} />
        <MetalMaterial metalId={metalId} skeleton={showSkeleton} />
      </mesh>

      {/* Pendant Setting */}
      <group position={[0, -0.42, 0.15]}>
        {/* Bail Loop */}
        <mesh position={[0, 0.08, -0.02]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.06, 0.014, 8, 16]} />
          <MetalMaterial metalId={metalId} skeleton={showSkeleton} />
        </mesh>

        {/* Basket */}
        <mesh position={[0, -0.08, 0]}>
          <cylinderGeometry args={[size * 0.55, size * 0.45, size * 0.25, 16]} />
          <MetalMaterial metalId={metalId} skeleton={showSkeleton} />
        </mesh>

        {/* Prongs */}
        {[-1, 1].flatMap(x =>
          [-1, 1].map(z => (
            <mesh
              key={`p-${x}-${z}`}
              position={[x * size * 0.36, size * 0.05, z * size * 0.36]}
              rotation={[-x * 0.1, 0, -z * 0.1]}
            >
              <cylinderGeometry args={[0.018, 0.012, size * 0.55]} />
              <MetalMaterial metalId={metalId} skeleton={showSkeleton} />
            </mesh>
          ))
        )}

        {/* Diamond */}
        {!showSkeleton && (
          <group position={[0, size * 0.06, 0.02]}>
            <Diamond size={size} shape={shape} color={diamondColor} rotation={diamondRotation} />
          </group>
        )}
      </group>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
// Bracelet Model (Tennis Bracelet)
// ─────────────────────────────────────────────────────────────
function BraceletModel({
  metalId, carat, showSkeleton, diamondColor
}: {
  metalId: string;
  carat: number;
  showSkeleton: boolean;
  diamondColor: string;
}) {
  return (
    <group rotation={[Math.PI / 2.3, 0, 0]} position={[0, -0.2, 0]}>
      {/* Bracelet Band */}
      <mesh castShadow receiveShadow>
        <torusGeometry args={[1.35, 0.05, 16, 96]} />
        <MetalMaterial metalId={metalId} skeleton={showSkeleton} />
      </mesh>

      {/* Tennis Diamonds */}
      {Array.from({ length: 32 }).map((_, i) => {
        const angle = (i / 32) * Math.PI * 2;
        const bx = Math.cos(angle) * 1.35;
        const bz = Math.sin(angle) * 1.35;

        return (
          <group key={i} position={[bx, 0, bz]} rotation={[0, -angle, 0]}>
            {/* Setting basket */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.065, 0.05, 0.06, 8]} />
              <MetalMaterial metalId={metalId} skeleton={showSkeleton} />
            </mesh>

            {/* Diamond */}
            {!showSkeleton && (
              <mesh position={[0, 0, 0.045]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.055, 0, 0.065, 8]} />
                <GemMaterial color={diamondColor} small />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
// Earrings Model (Studs or Hoops)
// ─────────────────────────────────────────────────────────────
function EarringsModel({
  metalId, setting, carat, showSkeleton, diamondColor, shape
}: {
  metalId: string;
  setting: string;
  carat: number;
  showSkeleton: boolean;
  diamondColor: string;
  shape: DiamondShape;
}) {
  const size = 0.4 + carat * 0.1;
  const isExtruded = ["pear", "marquise", "heart"].includes(shape);
  const diamondRotation: [number, number, number] = isExtruded
    ? [0, 0, 0]
    : [Math.PI / 2, 0, 0];

  return (
    <group position={[0, 0.2, 0]}>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.9, 0, 0]}>
          {setting === "hoop" ? (
            <>
              {/* Hoop Ring */}
              <mesh rotation={[0, Math.PI / 2, 0]}>
                <torusGeometry args={[0.45, 0.035, 12, 48]} />
                <MetalMaterial metalId={metalId} skeleton={showSkeleton} />
              </mesh>

              {/* Front Pavé Diamonds */}
              {Array.from({ length: 8 }).map((_, idx) => {
                const angle = (idx / 7) * Math.PI - Math.PI / 2; // front half
                const hx = Math.cos(angle) * 0.45;
                const hy = Math.sin(angle) * 0.45;
                return (
                  <mesh key={idx} position={[0, hy, hx]} rotation={[0, 0, angle]}>
                    <cylinderGeometry args={[0.025, 0, 0.03, 8]} />
                    <GemMaterial color={diamondColor} small />
                  </mesh>
                );
              })}
            </>
          ) : (
            <>
              {/* Stud Setting */}
              {/* backing post */}
              <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.15]}>
                <cylinderGeometry args={[0.012, 0.012, 0.25]} />
                <MetalMaterial metalId={metalId} skeleton={showSkeleton} />
              </mesh>
              <mesh position={[0, 0, -0.25]}>
                <cylinderGeometry args={[0.06, 0.06, 0.02]} />
                <MetalMaterial metalId={metalId} skeleton={showSkeleton} />
              </mesh>

              {/* Basket */}
              <mesh position={[0, 0, -0.02]}>
                <cylinderGeometry args={[size * 0.55, size * 0.45, size * 0.25, 16]} />
                <MetalMaterial metalId={metalId} skeleton={showSkeleton} />
              </mesh>

              {/* Prongs */}
              {[-1, 1].flatMap(px =>
                [-1, 1].map(pz => (
                  <mesh
                    key={`prong-${px}-${pz}`}
                    position={[px * size * 0.36, pz * size * 0.36, size * 0.15]}
                    rotation={[-px * 0.1, 0, -pz * 0.1]}
                  >
                    <cylinderGeometry args={[0.018, 0.012, size * 0.55]} />
                    <MetalMaterial metalId={metalId} skeleton={showSkeleton} />
                  </mesh>
                ))
              )}

              {/* Stud Diamond */}
              {!showSkeleton && (
                <group position={[0, 0, size * 0.12]}>
                  <Diamond size={size} shape={shape} color={diamondColor} rotation={diamondRotation} />
                </group>
              )}
            </>
          )}
        </group>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
// Smooth rotation wrapper controlled by arrow buttons
// ─────────────────────────────────────────────────────────────
function RotatableGroup({ rotY, rotX, children }: { rotY: number; rotX: number; children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const current = useRef({ x: 0, y: 0 });

  useFrame(() => {
    if (!groupRef.current) return;
    current.current.y += (rotY - current.current.y) * 0.08;
    current.current.x += (rotX - current.current.x) * 0.08;
    groupRef.current.rotation.y = current.current.y;
    groupRef.current.rotation.x = current.current.x;
  });

  return <group ref={groupRef}>{children}</group>;
}

// ─────────────────────────────────────────────────────────────
// Exported 3D Component
// ─────────────────────────────────────────────────────────────
export function Ring3D({
  jewelryType = "ring",
  shape,
  metal,
  setting,
  band,
  carat,
  diamondColor = "#ffffff",
  showSkeleton = false,
}: {
  jewelryType?: JewelryType;
  shape: DiamondShape;
  metal: MetalOption;
  setting: string;
  band: string;
  carat: number;
  diamondColor?: string;
  showSkeleton?: boolean;
}) {
  const [arrowRotY, setArrowRotY] = useState(0);
  const [arrowRotX, setArrowRotX] = useState(0);
  const STEP = Math.PI / 6; // 30° per tap

  const camera = {
    ring:     { position: [0, 0.24, 5.8] as [number, number, number], fov: 40 },
    necklace: { position: [0, 0.05, 5.4] as [number, number, number], fov: 40 },
    bracelet: { position: [0, 0.05, 5.2] as [number, number, number], fov: 39 },
    earring:  { position: [0, 0.05, 5.0] as [number, number, number], fov: 39 },
  }[jewelryType];

  const openingRotation: [number, number, number] = {
    ring: [0.82, -0.32, 0.03],
    necklace: [0.08, -0.2, 0],
    bracelet: [0.12, -0.35, 0.05],
    earring: [0.08, -0.28, 0],
  }[jewelryType] as [number, number, number];

  const shadowY = jewelryType === "necklace" ? -1.02 : jewelryType === "earring" ? -0.85 : -1.42;
  const studioBackground = showSkeleton
    ? "radial-gradient(circle at 50% 42%, #F6F3EE 0%, #E7E2DA 52%, #D4CDC3 100%)"
    : "radial-gradient(circle at 50% 42%, #F3EFE8 0%, #DED8CF 55%, #C8C0B5 100%)";

  return (
    <div
      className="w-[96%] mx-auto h-[40vh] min-h-[300px] md:w-full md:h-[64vh] md:min-h-[440px] relative rounded-xl overflow-hidden cursor-grab active:cursor-grabbing shadow-inner touch-none overscroll-contain select-none"
      style={{ background: studioBackground }}
    >
      {/* Rotation arrow buttons */}
      <button
        type="button"
        onClick={() => setArrowRotY(r => r + STEP)}
        aria-label="Rotate left"
        className="absolute start-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/45 backdrop-blur-sm border border-stone-700/15 text-stone-700/65 hover:text-stone-900 hover:bg-white/70 transition-all active:scale-90"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
          <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => setArrowRotY(r => r - STEP)}
        aria-label="Rotate right"
        className="absolute end-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/45 backdrop-blur-sm border border-stone-700/15 text-stone-700/65 hover:text-stone-900 hover:bg-white/70 transition-all active:scale-90"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
          <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => setArrowRotX(r => Math.max(r - STEP, -Math.PI / 3))}
        aria-label="Tilt up"
        className="absolute top-3 start-1/2 -translate-x-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/45 backdrop-blur-sm border border-stone-700/15 text-stone-700/65 hover:text-stone-900 hover:bg-white/70 transition-all active:scale-90"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
          <path fillRule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832l-3.71 3.938a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clipRule="evenodd" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => setArrowRotX(r => Math.min(r + STEP, Math.PI / 3))}
        aria-label="Tilt down"
        className="absolute bottom-10 start-1/2 -translate-x-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/45 backdrop-blur-sm border border-stone-700/15 text-stone-700/65 hover:text-stone-900 hover:bg-white/70 transition-all active:scale-90"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      <React.Suspense
        fallback={
          <div className="absolute inset-0 flex items-center justify-center text-stone-700/50 text-sm tracking-widest">
            Loading 3D Studio…
          </div>
        }
      >
        <Canvas
          key={jewelryType}
          shadows
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
          camera={camera}
        >
          <ambientLight intensity={showSkeleton ? 0.85 : 0.55} color="#fffaf3" />
          <directionalLight position={[0, 3, 5]} intensity={showSkeleton ? 0.75 : 0.55} color="#ffffff" />
          <StudioEnvironment skeleton={showSkeleton} />

          <PresentationControls
            global={false}
            rotation={openingRotation}
            polar={[-Math.PI / 3, Math.PI / 3]}
            azimuth={[-Math.PI, Math.PI]}
            snap={false}
          >
            <RotatableGroup rotY={arrowRotY} rotX={arrowRotX}>
            <Float rotationIntensity={0.15} floatIntensity={0.08} speed={1.4}>
              {jewelryType === "ring" && (
                <RingModel
                  band={band}
                  metalId={metal.id}
                  setting={setting}
                  carat={carat}
                  showSkeleton={showSkeleton}
                  diamondColor={diamondColor}
                  shape={shape}
                />
              )}
              {jewelryType === "necklace" && (
                <NecklaceModel
                  metalId={metal.id}
                  carat={carat}
                  showSkeleton={showSkeleton}
                  diamondColor={diamondColor}
                  shape={shape}
                />
              )}
              {jewelryType === "bracelet" && (
                <BraceletModel
                  metalId={metal.id}
                  carat={carat}
                  showSkeleton={showSkeleton}
                  diamondColor={diamondColor}
                />
              )}
              {jewelryType === "earring" && (
                <EarringsModel
                  metalId={metal.id}
                  setting={setting}
                  carat={carat}
                  showSkeleton={showSkeleton}
                  diamondColor={diamondColor}
                  shape={shape}
                />
              )}
            </Float>
            </RotatableGroup>
          </PresentationControls>

          <ContactShadows
            position={[0, shadowY, 0]}
            opacity={showSkeleton ? 0.14 : 0.2}
            scale={7}
            blur={4.5}
            far={3.5}
            color="#756d64"
          />
        </Canvas>
      </React.Suspense>

      <div className="absolute bottom-4 left-0 right-0 text-center text-[0.65rem] text-stone-700/45 pointer-events-none tracking-[0.2em] uppercase">
        Drag or use arrows · 3D Studio
      </div>
    </div>
  );
}
