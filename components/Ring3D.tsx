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
  // For maximum realism, these would be loaded from .glb files.
  // Here we use procedural generation for the 3D prototype.
  
  if (band === "twisted" || band === "twisted-pave" || band === "braided" || band === "rope") {
    // A twisted tubular ring
    const path = new THREE.Curve<THREE.Vector3>();
    path.getPoint = (t: number) => {
      const a = t * Math.PI * 2;
      return new THREE.Vector3(Math.cos(a), Math.sin(a), Math.sin(a * 10) * 0.05);
    };
    // Need to implement custom curve fully to use TubeGeometry, fallback to TorusKnot
    return new THREE.TorusKnotGeometry(1, 0.1, 128, 16, 2, 3);
  }
  
  if (band === "knife-edge") {
    // Torus with fewer segments to make it angular
    return new THREE.TorusGeometry(1, 0.15, 4, 64);
  }

  if (band === "split-shank") {
     // We will just return a thicker band for the placeholder
     return new THREE.TorusGeometry(1, 0.18, 32, 64);
  }

  // Classic fallback
  return new THREE.TorusGeometry(1, 0.12, 64, 128);
}

function Diamond({ carat, shape }: { carat: number, shape: DiamondShape }) {
  // Diamond size scaling based on carat
  const size = 0.4 + carat * 0.1;
  
  return (
    <mesh position={[0, 1.1 + size/2, 0]} castShadow>
      {/* Octahedron provides a faceted look without a complex model */}
      <octahedronGeometry args={[size, 1]} />
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

function RingModel({ band, metalId, setting }: { band: string, metalId: string, setting: string }) {
  const color = getMetalColor(metalId);
  const ringRef = useRef<THREE.Group>(null);
  
  const geometry = useMemo(() => createBandGeometry(band), [band]);
  
  return (
    <group ref={ringRef} dispose={null}>
      <mesh castShadow receiveShadow position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} geometry={geometry}>
        <meshStandardMaterial 
          color={color} 
          metalness={1} 
          roughness={0.05} // Very shiny
          envMapIntensity={2} 
        />
      </mesh>

      {/* Decorative pave stones if applicable */}
      {(band === "pave-band" || band === "twisted-pave" || band === "scalloped-pave") && (
         <group position={[0, 0, 0]}>
           {Array.from({ length: 16 }).map((_, i) => {
             const angle = (i / 15) * Math.PI - Math.PI/2;
             const x = Math.cos(angle) * 1.05;
             const y = Math.sin(angle) * 1.05;
             if (y < 0) return null; // Only top half
             return (
               <mesh key={i} position={[x, y, 0]}>
                 <sphereGeometry args={[0.04, 16, 16]} />
                 <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.1} envMapIntensity={3} />
               </mesh>
             )
           })}
         </group>
      )}
      
      {/* Prongs to hold the diamond */}
      <group position={[0, 1, 0]}>
         {[-1, 1].map(x => 
           [-1, 1].map(z => (
             <mesh key={`${x}${z}`} position={[x * 0.2, 0.2, z * 0.2]} rotation={[-x * 0.2, 0, -z * 0.2]}>
               <cylinderGeometry args={[0.03, 0.02, 0.5]} />
               <meshStandardMaterial color={color} metalness={1} roughness={0.05} />
             </mesh>
           ))
         )}
      </group>
    </group>
  );
}

export function Ring3D({ shape, metal, setting, band, carat }: Props) {
  return (
    <div className="w-full h-[60vh] min-h-[400px] relative rounded-lg overflow-hidden bg-[#161314]">
      {/* Suspense is needed for Drei components like Environment to load HDRI */}
      <React.Suspense fallback={<div className="absolute inset-0 flex items-center justify-center text-[#E1D1C1]/50 text-sm tracking-widest font-serif">טוען סטודיו תלת-ממד...</div>}>
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 1.5, 4], fov: 45 }}>
          <color attach="background" args={["#161314"]} /> {/* Deep velvet backdrop */}
          
          <ambientLight intensity={0.4} />
          <spotLight position={[5, 10, 5]} angle={0.2} penumbra={1} intensity={2} castShadow />
          <spotLight position={[-5, 5, -5]} angle={0.2} penumbra={1} intensity={1} color="#E1D1C1" />
          
          <PresentationControls 
            global 
            rotation={[0.1, -Math.PI / 4, 0]} 
            polar={[-Math.PI / 3, Math.PI / 3]} 
            azimuth={[-Math.PI, Math.PI]}
            config={{ mass: 2, tension: 500 }}
            snap={{ mass: 4, tension: 1500 }}
          >
            <Float rotationIntensity={0.2} floatIntensity={0.1} speed={1.5}>
              <RingModel band={band} metalId={metal.id} setting={setting} />
              <Diamond carat={carat} shape={shape} />
            </Float>
          </PresentationControls>

          <ContactShadows position={[0, -1.5, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color="#000000" />
          
          {/* Photorealistic reflections require an Environment map */}
          <Environment preset="studio" />
        </Canvas>
      </React.Suspense>
      <div className="absolute bottom-6 left-0 right-0 text-center text-[0.65rem] text-[#E1D1C1]/40 pointer-events-none font-serif tracking-[0.2em] uppercase">
        גרור לסובב · 3D Atelier
      </div>
    </div>
  );
}
