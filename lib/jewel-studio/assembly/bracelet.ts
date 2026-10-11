// Line (tennis) bracelet lying on its side: a closed oval of four-claw
// box links, each holding one round brilliant facing up.

import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { lineBraceletLayout } from "../core/dimensions";
import type { JewelDesign } from "../core/types";
import { buildGemByWidth } from "../geometry/gem";
import { emptyParts, placeMatrix } from "../geometry/parts";

/** One link at unit scale (stone diameter = 1), stone girdle at y = 0. */
function linkGeometry() {
  const pieces: THREE.BufferGeometry[] = [];
  const basket = new RoundedBoxGeometry(1.04, 0.52, 1.04, 2, 0.1);
  basket.translate(0, -0.34, 0);
  pieces.push(basket);
  for (const x of [-1, 1]) {
    for (const z of [-1, 1]) {
      const post = new THREE.CylinderGeometry(0.085, 0.1, 0.36, 10);
      post.translate(x * 0.42, -0.05, z * 0.42);
      pieces.push(post);
      const tip = new THREE.SphereGeometry(0.12, 12, 8);
      tip.translate(x * 0.4, 0.12, z * 0.4);
      pieces.push(tip);
    }
  }
  const hinge = new THREE.CylinderGeometry(0.12, 0.12, 0.62, 10);
  hinge.rotateZ(Math.PI / 2);
  hinge.translate(0.5, -0.52, 0);
  pieces.push(hinge);
  // RoundedBoxGeometry is non-indexed; merging requires a uniform layout.
  const flat = pieces.map((p) => (p.index ? p.toNonIndexed() : p));
  const merged = mergeGeometries(flat)!;
  new Set([...pieces, ...flat]).forEach((p) => p.dispose());
  merged.computeBoundingBox();
  return merged;
}

export function buildBracelet(design: JewelDesign) {
  const { diameter: d, count } = lineBraceletLayout(design.carat);
  const gem = buildGemByWidth("round", d, 2);
  const a = 31, b = 25;

  const n = 1200;
  const pts = Array.from({ length: n + 1 }, (_, i) => {
    const t = (i / n) * Math.PI * 2;
    return new THREE.Vector3(Math.cos(t) * a, 0, Math.sin(t) * b);
  });
  const cum = [0];
  for (let i = 1; i <= n; i++) cum.push(cum[i - 1] + pts[i].distanceTo(pts[i - 1]));
  const total = cum[n];

  const parts = emptyParts();
  const up = new THREE.Vector3(0, 1, 0);
  const stones: THREE.Matrix4[] = [];
  const links: THREE.Matrix4[] = [];
  let j = 0;
  for (let k = 0; k < count; k++) {
    const target = (k / count) * total;
    while (cum[j + 1] < target) j++;
    const f = (target - cum[j]) / (cum[j + 1] - cum[j]);
    const p = pts[j].clone().lerp(pts[j + 1], f);
    const tangent = pts[j + 1].clone().sub(pts[j]).normalize();
    const spin = Math.atan2(-tangent.z, tangent.x);
    stones.push(placeMatrix(p, up, 1, spin));
    links.push(placeMatrix(p, up, d, spin));
  }
  parts.gemInstances.push({ gem, matrices: stones, primary: true });
  parts.metalInstances.push({ geometry: linkGeometry(), matrices: links });
  return { parts, gem };
}
