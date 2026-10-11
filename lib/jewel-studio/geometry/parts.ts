// The renderer-agnostic description of a piece: metal meshes, instanced
// metal details, individual stones and instanced melee, each with a
// world matrix. Builders produce PieceParts; the scene layer draws them.

import * as THREE from "three";
import type { GemBuild } from "./gem";
import type { SurfaceTexture } from "./textures";

export interface MetalPart {
  geometry: THREE.BufferGeometry;
  matrix: THREE.Matrix4;
  texture?: SurfaceTexture;
}
export interface MetalInstances {
  geometry: THREE.BufferGeometry;
  matrices: THREE.Matrix4[];
}
export interface GemPart {
  gem: GemBuild;
  matrix: THREE.Matrix4;
}
export interface GemInstances {
  gem: GemBuild;
  matrices: THREE.Matrix4[];
  /** Main stones (tennis line, hoops) take the design colour; accent melee stays white. */
  primary?: boolean;
}
export interface PieceParts {
  metal: MetalPart[];
  metalInstances: MetalInstances[];
  gems: GemPart[];
  gemInstances: GemInstances[];
}

export const emptyParts = (): PieceParts => ({ metal: [], metalInstances: [], gems: [], gemInstances: [] });

/** Marks a cached geometry so piece disposal leaves it alone. */
export function shared<T extends THREE.BufferGeometry>(geometry: T): T {
  geometry.userData.shared = true;
  return geometry;
}

/** Shared low-poly primitive for instanced beads and prong tips. */
export const UNIT_SPHERE = shared(new THREE.SphereGeometry(1, 16, 12));

const Y_AXIS = new THREE.Vector3(0, 1, 0);

/** Matrix that moves the origin to `position` and turns local +Y towards `up`. */
export function placeMatrix(position: THREE.Vector3, up: THREE.Vector3, scale: number | THREE.Vector3 = 1, spin = 0) {
  const q = new THREE.Quaternion().setFromUnitVectors(Y_AXIS, up.clone().normalize());
  if (spin) q.multiply(new THREE.Quaternion().setFromAxisAngle(Y_AXIS, spin));
  const s = typeof scale === "number" ? new THREE.Vector3(scale, scale, scale) : scale;
  return new THREE.Matrix4().compose(position, q, s);
}

export function metal(geometry: THREE.BufferGeometry, texture?: SurfaceTexture): MetalPart {
  return { geometry, matrix: new THREE.Matrix4(), texture };
}

/** Concatenates parts, folding instance lists that share a geometry into one draw call. */
export function mergeParts(...list: PieceParts[]): PieceParts {
  const out = emptyParts();
  const metalByGeo = new Map<THREE.BufferGeometry, MetalInstances>();
  const gemsByBuild = new Map<GemBuild, GemInstances>();
  for (const p of list) {
    out.metal.push(...p.metal);
    out.gems.push(...p.gems);
    for (const mi of p.metalInstances) {
      const existing = metalByGeo.get(mi.geometry);
      if (existing) existing.matrices.push(...mi.matrices);
      else {
        const copy = { geometry: mi.geometry, matrices: [...mi.matrices] };
        metalByGeo.set(mi.geometry, copy);
        out.metalInstances.push(copy);
      }
    }
    for (const gi of p.gemInstances) {
      const existing = gemsByBuild.get(gi.gem);
      if (existing) existing.matrices.push(...gi.matrices);
      else {
        const copy = { gem: gi.gem, matrices: [...gi.matrices], primary: gi.primary };
        gemsByBuild.set(gi.gem, copy);
        out.gemInstances.push(copy);
      }
    }
  }
  return out;
}

/** Applies `m` on top of every matrix (geometries are shared, never cloned). */
export function transformParts(parts: PieceParts, m: THREE.Matrix4): PieceParts {
  const pre = (x: THREE.Matrix4) => m.clone().multiply(x);
  return {
    metal: parts.metal.map((p) => ({ ...p, matrix: pre(p.matrix) })),
    metalInstances: parts.metalInstances.map((p) => ({ geometry: p.geometry, matrices: p.matrices.map(pre) })),
    gems: parts.gems.map((p) => ({ gem: p.gem, matrix: pre(p.matrix) })),
    gemInstances: parts.gemInstances.map((p) => ({ gem: p.gem, matrices: p.matrices.map(pre), primary: p.primary })),
  };
}

/** World-space bounding box of everything in the parts list. */
export function partsBox(parts: PieceParts): THREE.Box3 {
  const box = new THREE.Box3();
  const tmp = new THREE.Box3();
  const add = (g: THREE.BufferGeometry, m: THREE.Matrix4) => {
    if (!g.boundingBox) g.computeBoundingBox();
    box.union(tmp.copy(g.boundingBox!).applyMatrix4(m));
  };
  parts.metal.forEach((p) => add(p.geometry, p.matrix));
  parts.gems.forEach((p) => add(p.gem.geometry, p.matrix));
  parts.metalInstances.forEach((p) => p.matrices.forEach((m) => add(p.geometry, m)));
  parts.gemInstances.forEach((p) => p.matrices.forEach((m) => add(p.gem.geometry, m)));
  return box;
}

/** Releases GPU buffers created for this piece; shared cached geometry is kept. */
export function disposeParts(parts: PieceParts) {
  const release = (g: THREE.BufferGeometry) => {
    if (!g.userData.shared) g.dispose();
  };
  parts.metal.forEach((p) => release(p.geometry));
  parts.metalInstances.forEach((p) => release(p.geometry));
  parts.gems.forEach((p) => release(p.gem.geometry));
  parts.gemInstances.forEach((p) => release(p.gem.geometry));
}
