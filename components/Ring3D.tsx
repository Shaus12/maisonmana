"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, MeshTransmissionMaterial, Float, ContactShadows, PresentationControls } from "@react-three/drei";
import * as THREE from "three";
import type { DiamondShape } from "@/lib/pieces";
import type { MetalOption, SettingOption, BandOption } from "@/lib/atelier-options";

type Props = {
  shape: DiamondShape;
  metal: MetalOption;
  setting: SettingOption["id"];
  band: BandOption["id"];
  carat: number;
};

// Map the custom metal options to realistic PBR color values
function getMetalColor(metalId: string) {
  switch (metalId) {
    case "yellow-gold": return "#E5B80B";
    case "white-gold": return "#E8E9CE";
    case "rose-gold": return "#B76E79";
    case "platinum": return "#E5E4E2";
    default: return "#E5B80B";
  }
}

// Complex procedural generation for the bands
function createBandGeometry(band: string) {
  if (band === "twisted" || band === "twisted-pave" || band === "braided" || band === "rope") {
    // A twisted tubular ring
    return new THREE.TorusKnotGeometry(1, 0.1, 128, 16, 2, 3);
  }
  
  if (band === "knife-edge") {
    // Torus with fewer segments to make it angular
    return new THREE.TorusGeometry(1, 0.15, 4, 64);
  }

  if (band === "split-shank" || band === "bypass") {
     // Thicker torus to approximate the width of a split shank / bypass
     return new THREE.TorusGeometry(1, 0.18, 32, 64);
  }
  
  if (band === "chevron") {
     // An angular base
     return new THREE.TorusGeometry(1, 0.12, 16, 16);
  }
  
  if (band === "concave") {
     // A shape with high horizontal segments but few vertical to look a bit flat
     return new THREE.TorusGeometry(1, 0.12, 12, 64);
  }

  // Classic and others
  return new THREE.TorusGeometry(1, 0.12, 64, 128);
}

function Diamond({ carat, shape }: { carat: number, shape: DiamondShape }) {
  // Diamond size scaling based on carat
  const size = 0.4 + carat * 0.1;
  
  // Choose geometry based on diamond shape
  const geometry = useMemo(() => {
    switch (shape) {
      case "princess":
        // Square cut (Octahedron without detail looks like a square pyramid)
        return new THREE.OctahedronGeometry(size, 0);
      case "emerald":
        // Rectangular step cut
        return new THREE.BoxGeometry(size * 0.8, size * 0.6, size);
      case "pear":
        // Teardrop shape (procedural approximation using cone and sphere)
        // Here we'll use an ExtrudeGeometry with a custom shape for simplicity
        const pearShape = new THREE.Shape();
        pearShape.moveTo(0, size);
        pearShape.quadraticCurveTo(size * 0.8, size * 0.2, size * 0.5, -size * 0.5);
        pearShape.quadraticCurveTo(0, -size * 0.8, -size * 0.5, -size * 0.5);
        pearShape.quadraticCurveTo(-size * 0.8, size * 0.2, 0, size);
        return new THREE.ExtrudeGeometry(pearShape, { depth: size * 0.5, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 });
      case "marquise":
        // Boat shape
        const marqShape = new THREE.Shape();
        marqShape.moveTo(0, size);
        marqShape.quadraticCurveTo(size * 0.7, 0, 0, -size);
        marqShape.quadraticCurveTo(-size * 0.7, 0, 0, size);
        return new THREE.ExtrudeGeometry(marqShape, { depth: size * 0.4, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 });
      case "heart":
        // Heart shape
        const heartShape = new THREE.Shape();
        const x = 0, y = 0;
        heartShape.moveTo(x + 0.25 * size, y + 0.25 * size);
        heartShape.bezierCurveTo(x + 0.25 * size, y + 0.25 * size, x + 0.2 * size, y, x, y);
        heartShape.bezierCurveTo(x - 0.3 * size, y, x - 0.3 * size, y + 0.35 * size, x - 0.3 * size, y + 0.35 * size);
        heartShape.bezierCurveTo(x - 0.3 * size, y + 0.55 * size, x - 0.1 * size, y + 0.77 * size, x + 0.25 * size, y + 0.95 * size);
        heartShape.bezierCurveTo(x + 0.6 * size, y + 0.77 * size, x + 0.8 * size, y + 0.55 * size, x + 0.8 * size, y + 0.35 * size);
        heartShape.bezierCurveTo(x + 0.8 * size, y + 0.35 * size, x + 0.8 * size, y, x + 0.5 * size, y);
        heartShape.bezierCurveTo(x + 0.35 * size, y, x + 0.25 * size, y + 0.25 * size, x + 0.25 * size, y + 0.25 * size);
        return new THREE.ExtrudeGeometry(heartShape, { depth: size * 0.4, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 });
      case "round":
      default:
        // Round brilliant cut approximation
        return new THREE.CylinderGeometry(size, 0, size * 1.2, 16, 2);
    }
  }, [shape, size]);

  // Adjust position and rotation for extruded 2D shapes
  const isExtruded = ["pear", "marquise", "heart"].includes(shape);
  const rotation: [number, number, number] = isExtruded ? [Math.PI / 2, 0, 0] : [0, 0, 0];
  const positionY = isExtruded ? 1.1 + size : 1.1 + size / 2;
  
  return (
    <mesh position={[0, positionY, 0]} rotation={rotation} castShadow geometry={geometry}>
      {/* Photorealistic Diamond Shader */}
      <MeshTransmissionMaterial
        backside
        backsideThickness={0.1}
        thickness={size}
        chromaticAberration={0.15}
        anisotropy={0.1}
        distortion={0.2}
        distortionScale={0.3}
        temporalDistortion={0.0}
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

function RingModel({ band, metalId, setting, showSkeleton }: { band: string, metalId: string, setting: string, showSkeleton: boolean }) {
  const color = getMetalColor(metalId);
  const ringRef = useRef<THREE.Group>(null);
  
  const geometry = useMemo(() => createBandGeometry(band), [band]);
  
  return (
    <group ref={ringRef} dispose={null}>
      {/* Main Band */}
      <mesh castShadow receiveShadow position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} geometry={geometry}>
        <meshStandardMaterial 
          color={color} 
          metalness={1} 
          roughness={band === "hammered" || band === "vintage-scroll" ? 0.2 : 0.05}
          envMapIntensity={2} 
          flatShading={band === "hammered"}
        />
      </mesh>

      {/* Decorative pave stones on the band if applicable */}
      {(band === "pave-band" || band === "twisted-pave" || band === "scalloped-pave" || band === "channel-set") && (
         <group position={[0, 0, 0]}>
           {Array.from({ length: 20 }).map((_, i) => {
             const angle = (i / 19) * Math.PI - Math.PI/2;
             const x = Math.cos(angle) * (band === "channel-set" ? 0.98 : 1.05);
             const y = Math.sin(angle) * (band === "channel-set" ? 0.98 : 1.05);
             if (y < 0.2) return null; // Only top part
             return (
               <mesh key={i} position={[x, y, 0]} rotation={[Math.PI/2, angle, 0]}>
                 <cylinderGeometry args={[0.04, showSkeleton ? 0.04 : 0, 0.02, 8]} />
                 {showSkeleton ? (
                   <meshBasicMaterial color="#111" />
                 ) : (
                   <MeshTransmissionMaterial color="#ffffff" transmission={0.9} ior={2.4} roughness={0} thickness={0.1} />
                 )}
               </mesh>
             )
           })}
         </group>
      )}

      {/* Setting (שיבוץ) */}
      <group position={[0, 1, 0]}>
        
        {/* Prongs (for solitaire, three-stone, hidden-halo, pave) */}
        {setting !== "bezel" && (
           [-1, 1].map(x => 
             [-1, 1].map(z => (
               <mesh key={`prong-${x}${z}`} position={[x * 0.2, 0.2, z * 0.2]} rotation={[-x * 0.2, 0, -z * 0.2]}>
                 <cylinderGeometry args={[0.03, 0.02, 0.5]} />
                 <meshStandardMaterial color={color} metalness={1} roughness={0.05} />
               </mesh>
             ))
           )
        )}

        {/* Bezel Setting */}
        {setting === "bezel" && (
           <mesh position={[0, 0.2, 0]}>
             <cylinderGeometry args={[0.35, 0.25, 0.3, 32]} />
             <meshStandardMaterial color={color} metalness={1} roughness={0.05} />
           </mesh>
        )}

        {/* Hidden Halo */}
        {setting === "hidden-halo" && (
           <group position={[0, 0.1, 0]}>
             <mesh rotation={[Math.PI / 2, 0, 0]}>
               <torusGeometry args={[0.25, 0.02, 16, 32]} />
               <meshStandardMaterial color={color} metalness={1} roughness={0.05} />
             </mesh>
             {/* Micro pave on halo */}
             {Array.from({ length: 12 }).map((_, i) => {
               const angle = (i / 12) * Math.PI * 2;
               return (
                 <mesh key={`halo-${i}`} position={[Math.cos(angle) * 0.25, 0, Math.sin(angle) * 0.25]} rotation={[Math.PI/2, 0, 0]}>
                   <cylinderGeometry args={[0.02, showSkeleton ? 0.02 : 0, 0.01, 8]} />
                   {showSkeleton ? (
                     <meshBasicMaterial color="#111" />
                   ) : (
                     <MeshTransmissionMaterial color="#ffffff" transmission={0.9} ior={2.4} roughness={0} thickness={0.1} />
                   )}
                 </mesh>
               )
             })}
           </group>
        )}

        {/* Three Stone (Side stones) */}
        {setting === "three-stone" && (
           <>
             {[-1, 1].map(side => (
               <group key={`side-stone-${side}`} position={[side * 0.45, 0.1, 0]} rotation={[0, 0, side * -0.3]}>
                  {/* Side Diamond */}
                  {!showSkeleton && (
                    <mesh>
                      <octahedronGeometry args={[0.2, 0]} />
                      <MeshTransmissionMaterial color="#ffffff" transmission={1} ior={2.42} roughness={0} />
                    </mesh>
                  )}
                  {/* Side Prongs */}
                  {[-1, 1].map(x => 
                     [-1, 1].map(z => (
                       <mesh key={`sprong-${x}${z}`} position={[x * 0.12, 0.1, z * 0.12]} rotation={[-x * 0.2, 0, -z * 0.2]}>
                         <cylinderGeometry args={[0.015, 0.01, 0.3]} />
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
    <div className="w-full h-[60vh] min-h-[400px] relative rounded-lg overflow-hidden bg-[#161314] cursor-grab active:cursor-grabbing">
      <React.Suspense fallback={<div className="absolute inset-0 flex items-center justify-center text-[#E1D1C1]/50 text-sm tracking-widest font-serif">טוען סטודיו תלת-ממד...</div>}>
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 1.5, 4], fov: 45 }}>
          <color attach="background" args={["#161314"]} />
          
          <ambientLight intensity={0.4} />
          <spotLight position={[5, 10, 5]} angle={0.2} penumbra={1} intensity={2} castShadow />
          <spotLight position={[-5, 5, -5]} angle={0.2} penumbra={1} intensity={1} color="#E1D1C1" />
          
          <PresentationControls 
            global 
            rotation={[0.1, -Math.PI / 4, 0]} 
            polar={[-Math.PI / 3, Math.PI / 3]} 
            azimuth={[-Math.PI, Math.PI]}
            snap={true}
          >
            <Float rotationIntensity={0.2} floatIntensity={0.1} speed={1.5}>
              <RingModel band={band} metalId={metal.id} setting={setting} showSkeleton={showSkeleton} />
              {!showSkeleton && (
                <Diamond carat={carat} shape={shape} />
              )}
            </Float>
          </PresentationControls>

          <ContactShadows position={[0, -1.5, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color="#000000" />
          <Environment preset="studio" />
        </Canvas>
      </React.Suspense>
      <div className="absolute bottom-6 left-0 right-0 text-center text-[0.65rem] text-[#E1D1C1]/40 pointer-events-none font-serif tracking-[0.2em] uppercase">
        גרור לסובב · 3D Atelier
      </div>
    </div>
  );
}
