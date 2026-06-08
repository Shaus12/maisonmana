"use client";

import React, { useRef, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, MeshTransmissionMaterial, Float, ContactShadows, PresentationControls } from "@react-three/drei";
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
        color={color}
        clearcoat={1}
        transmission={1}
        ior={2.42}
        roughness={0}
      />
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
  const color = getMetalColor(metalId);
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
        <meshStandardMaterial
          color={color}
          metalness={1}
          roughness={band === "hammered" || band === "vintage-scroll" ? 0.20 : 0.05}
          envMapIntensity={2}
          flatShading={band === "hammered"}
        />
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
                  ? <meshBasicMaterial color="#111" />
                  : <MeshTransmissionMaterial color="#ffffff" transmission={0.9} ior={2.4} roughness={0} thickness={0.1} />
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
                <meshStandardMaterial color={color} metalness={1} roughness={0.05} />
              </mesh>
            ))
          )
        )}

        {/* Bezel */}
        {setting === "bezel" && (
          <mesh position={[0, size * 0.15, 0]}>
            <cylinderGeometry args={[size * 0.68, size * 0.58, size * 0.55, 32]} />
            <meshStandardMaterial color={color} metalness={1} roughness={0.05} />
          </mesh>
        )}

        {/* Hidden halo */}
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
  const color = getMetalColor(metalId);
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
        <meshStandardMaterial color={color} metalness={1} roughness={0.1} />
      </mesh>

      {/* Pendant Setting */}
      <group position={[0, -0.42, 0.15]}>
        {/* Bail Loop */}
        <mesh position={[0, 0.08, -0.02]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.06, 0.014, 8, 16]} />
          <meshStandardMaterial color={color} metalness={1} roughness={0.1} />
        </mesh>

        {/* Basket */}
        <mesh position={[0, -0.08, 0]}>
          <cylinderGeometry args={[size * 0.55, size * 0.45, size * 0.25, 16]} />
          <meshStandardMaterial color={color} metalness={1} roughness={0.1} />
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
              <meshStandardMaterial color={color} metalness={1} roughness={0.05} />
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
  const color = getMetalColor(metalId);

  return (
    <group rotation={[Math.PI / 2.3, 0, 0]} position={[0, -0.2, 0]}>
      {/* Bracelet Band */}
      <mesh castShadow receiveShadow>
        <torusGeometry args={[1.35, 0.05, 16, 96]} />
        <meshStandardMaterial color={color} metalness={1} roughness={0.1} />
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
              <meshStandardMaterial color={color} metalness={1} roughness={0.1} />
            </mesh>

            {/* Diamond */}
            {!showSkeleton && (
              <mesh position={[0, 0, 0.045]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.055, 0, 0.065, 8]} />
                <MeshTransmissionMaterial
                  color={diamondColor}
                  transmission={0.9}
                  ior={2.42}
                  roughness={0}
                  thickness={0.05}
                />
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
  const color = getMetalColor(metalId);
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
                <meshStandardMaterial color={color} metalness={1} roughness={0.1} />
              </mesh>

              {/* Front Pavé Diamonds */}
              {Array.from({ length: 8 }).map((_, idx) => {
                const angle = (idx / 7) * Math.PI - Math.PI / 2; // front half
                const hx = Math.cos(angle) * 0.45;
                const hy = Math.sin(angle) * 0.45;
                return (
                  <mesh key={idx} position={[0, hy, hx]} rotation={[0, 0, angle]}>
                    <cylinderGeometry args={[0.025, 0, 0.03, 8]} />
                    <MeshTransmissionMaterial
                      color={diamondColor}
                      transmission={0.9}
                      ior={2.42}
                      roughness={0}
                      thickness={0.02}
                    />
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
                <meshStandardMaterial color={color} metalness={1} roughness={0.1} />
              </mesh>
              <mesh position={[0, 0, -0.25]}>
                <cylinderGeometry args={[0.06, 0.06, 0.02]} />
                <meshStandardMaterial color={color} metalness={1} roughness={0.1} />
              </mesh>

              {/* Basket */}
              <mesh position={[0, 0, -0.02]}>
                <cylinderGeometry args={[size * 0.55, size * 0.45, size * 0.25, 16]} />
                <meshStandardMaterial color={color} metalness={1} roughness={0.1} />
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
                    <meshStandardMaterial color={color} metalness={1} roughness={0.1} />
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
          key={jewelryType}
          shadows
          dpr={[1, 2]}
          camera={{
            position: jewelryType === "ring" ? [0, 0.6, 3.2] : [0, 0.8, 4.0],
            fov: jewelryType === "ring" ? 38 : 42
          }}
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
