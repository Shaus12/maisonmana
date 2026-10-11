"use client";

// Draws PieceParts: one shared physical material per metal finish, ray-traced
// refraction for stones (single meshes and instanced melee).

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { MeshRefractionMaterial } from "@react-three/drei";
import * as THREE from "three";
import { GEM_TINTS, METAL_PRESETS } from "../core/catalog";
import type { GemColor, MetalFinish, MetalId } from "../core/types";
import type { GemBuild } from "../geometry/gem";
import type { PieceParts } from "../geometry/parts";
import { surfaceNormalMap, type SurfaceTexture } from "../geometry/textures";
import { useStudioEnv } from "./StudioLighting";

interface RendererProps {
  parts: PieceParts;
  metal: MetalId;
  finish: MetalFinish;
  gemColor: GemColor;
  showStones: boolean;
  bounces: number;
}

function useMetalMaterials(metal: MetalId, finish: MetalFinish) {
  const materials = useMemo(() => {
    const preset = METAL_PRESETS[metal];
    const make = (texture?: SurfaceTexture) => {
      const m = new THREE.MeshPhysicalMaterial({
        color: preset.color,
        metalness: 1,
        roughness: preset.roughness[finish] + (texture === "hammered" ? 0.03 : 0),
        envMapIntensity: 1,
        specularIntensity: 1,
      });
      if (texture) {
        m.normalMap = surfaceNormalMap(texture);
        m.normalScale.setScalar(texture === "hammered" ? 0.7 : 0.9);
      }
      return m;
    };
    return { plain: make(), hammered: make("hammered"), scroll: make("scroll") };
  }, [metal, finish]);

  useEffect(() => () => Object.values(materials).forEach((m) => m.dispose()), [materials]);
  return materials;
}

function GemMaterial({ color, bounces }: { color: GemColor; bounces: number }) {
  const env = useStudioEnv();
  const size = useThree((s) => s.size);
  const dpr = useThree((s) => s.viewport.dpr);
  const tint = GEM_TINTS[color];
  if (tint.opaque || !env) {
    return <meshPhysicalMaterial color="#070707" roughness={0.025} metalness={0} clearcoat={1} clearcoatRoughness={0.02} envMapIntensity={1.7} />;
  }
  // `resolution` must be in drawing-buffer pixels (drei defaults to CSS pixels).
  const extra = { resolution: [size.width * dpr, size.height * dpr] } as Record<string, unknown>;
  return (
    <MeshRefractionMaterial
      envMap={env}
      bounces={bounces}
      ior={2.42}
      fresnel={0.45}
      aberrationStrength={0.014}
      fastChroma
      color={tint.tint}
      toneMapped
      {...extra}
    />
  );
}

function Instanced({ geometry, matrices, children }: { geometry: THREE.BufferGeometry; matrices: THREE.Matrix4[]; children: React.ReactNode }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    matrices.forEach((m, i) => mesh.setMatrixAt(i, m));
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [matrices]);
  return (
    <instancedMesh ref={ref} args={[geometry, undefined, matrices.length]}>
      {children}
    </instancedMesh>
  );
}

function Stone({ gem, matrix, color, bounces }: { gem: GemBuild; matrix: THREE.Matrix4; color: GemColor; bounces: number }) {
  return (
    <mesh geometry={gem.geometry} matrix={matrix} matrixAutoUpdate={false}>
      <GemMaterial color={color} bounces={bounces} />
    </mesh>
  );
}

export function PieceRenderer({ parts, metal, finish, gemColor, showStones, bounces }: RendererProps) {
  const materials = useMetalMaterials(metal, finish);
  return (
    <group>
      {parts.metal.map((p, i) => (
        <mesh key={`m${i}-${p.geometry.uuid}`} geometry={p.geometry} matrix={p.matrix} matrixAutoUpdate={false} material={materials[p.texture ?? "plain"]} />
      ))}
      {parts.metalInstances.map((p, i) => (
        <Instanced key={`mi${i}-${p.geometry.uuid}-${p.matrices.length}`} geometry={p.geometry} matrices={p.matrices}>
          <primitive object={materials.plain} attach="material" />
        </Instanced>
      ))}
      {showStones && parts.gems.map((p, i) => (
        // Keyed by geometry so the refraction BVH is rebuilt when the stone changes.
        <Stone key={`g${i}-${p.gem.geometry.uuid}-${gemColor}`} gem={p.gem} matrix={p.matrix} color={gemColor} bounces={bounces} />
      ))}
      {showStones && parts.gemInstances.map((p, i) => (
        <Instanced key={`gi${i}-${p.gem.geometry.uuid}-${p.matrices.length}-${gemColor}`} geometry={p.gem.geometry} matrices={p.matrices}>
          <GemMaterial color={p.primary || gemColor === "black" ? gemColor : "colorless"} bounces={Math.min(bounces, 3)} />
        </Instanced>
      ))}
    </group>
  );
}
