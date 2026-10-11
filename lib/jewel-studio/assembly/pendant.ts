// Solitaire / halo / bezel pendant on a cable chain. The stone faces the
// viewer (+Z) with its length vertical; the chain threads the bail along X.

import * as THREE from "three";
import type { JewelDesign } from "../core/types";
import { buildGem } from "../geometry/gem";
import { buildBezel, buildClawHead, buildHalo, prongRadius } from "../geometry/head";
import { emptyParts, mergeParts, metal, placeMatrix, shared, transformParts, UNIT_SPHERE, type PieceParts } from "../geometry/parts";

/** Local stone frame → viewer-facing frame (table → +Z, stone length → +Y). */
export const FACE_VIEWER = new THREE.Matrix4()
  .makeRotationZ(Math.PI)
  .multiply(new THREE.Matrix4().makeRotationX(Math.PI / 2));

let linkCache: THREE.BufferGeometry | null = null;
/** One oval cable link, long axis along +Y, lying in the XY plane. */
function chainLink() {
  if (linkCache) return linkCache;
  const len = 1.7, wid = 1.0, wire = 0.25;
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    const x = Math.cos(a) * (wid / 2 - wire);
    const y = Math.sin(a) * (len / 2 - wire) * (1 + 0.15 * Math.abs(Math.sin(a)));
    pts.push(new THREE.Vector3(x, y, 0));
  }
  linkCache = shared(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 64, wire, 8, true));
  return linkCache;
}

/** Cable chain following a curve, alternate links turned 90°. */
export function cableChain(curve: THREE.Curve<THREE.Vector3>): PieceParts {
  const parts = emptyParts();
  const step = 1.7 * 0.78;
  const count = Math.floor(curve.getLength() / step);
  const matrices = Array.from({ length: count }, (_, i) => {
    const t = (i + 0.5) / count;
    return placeMatrix(curve.getPointAt(t), curve.getTangentAt(t), 1, i % 2 ? Math.PI / 2 : 0);
  });
  parts.metalInstances.push({ geometry: chainLink(), matrices });
  return parts;
}

export function buildPendant(design: JewelDesign) {
  const gem = buildGem(design.shape, design.carat);
  const head = design.head ?? "solitaire";
  const local: PieceParts[] = [];
  if (head === "bezel") local.push(buildBezel(gem));
  else {
    local.push(buildClawHead(gem));
    if (head === "halo") local.push(buildHalo(gem));
  }

  // Bail above the stone's top (local +Z), loop in the local YZ plane.
  const r = prongRadius(gem);
  let topZ = 0;
  for (let i = 0; i < 64; i++) topZ = Math.max(topZ, gem.outline.at((i / 64) * Math.PI * 2)[1]);
  topZ += head === "halo" ? Math.min(1.5, Math.max(0.9, gem.dims.width * 0.13)) * 1.3 + r : r;
  const halfH = 1.9, halfD = 1.05, wire = 0.42;
  const bailPts = Array.from({ length: 40 }, (_, i) => {
    const a = (i / 40) * Math.PI * 2;
    return new THREE.Vector3(0, Math.sin(a) * halfD, topZ + halfH + Math.cos(a) * halfH);
  });
  const bail = emptyParts();
  bail.metal.push(metal(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(bailPts, true), 64, wire, 10, true)));
  bail.metalInstances.push({ geometry: UNIT_SPHERE, matrices: [placeMatrix(new THREE.Vector3(0, 0, topZ + 0.15), new THREE.Vector3(0, 1, 0), 0.62)] });
  local.push(bail);

  const pendant = transformParts(mergeParts(...local), FACE_VIEWER);
  pendant.gems.push({ gem, matrix: FACE_VIEWER.clone() });

  const bc = topZ + halfH * 1.75; // threading point near the top of the bail
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-38, bc + 46, -10),
    new THREE.Vector3(-18, bc + 17, -5),
    new THREE.Vector3(-6.5, bc + 4.2, -1.4),
    new THREE.Vector3(0, bc, 0),
    new THREE.Vector3(6.5, bc + 4.2, -1.4),
    new THREE.Vector3(18, bc + 17, -5),
    new THREE.Vector3(38, bc + 46, -10),
  ], false, "centripetal");

  return { parts: mergeParts(pendant, cableChain(curve)), focus: pendant, gem };
}
