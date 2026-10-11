// A pair of earrings: four-claw studs with posts and butterfly backs,
// or pavé hoops set on the front face.

import * as THREE from "three";
import type { JewelDesign } from "../core/types";
import { buildGem, meleeStone } from "../geometry/gem";
import { buildClawHead, headBaseY } from "../geometry/head";
import { emptyParts, mergeParts, metal, placeMatrix, transformParts, type PieceParts } from "../geometry/parts";
import { superProfile, sweepClosed, type Station } from "../geometry/sweep";
import { FACE_VIEWER } from "./pendant";

function stud(design: JewelDesign) {
  const gem = buildGem(design.shape, design.carat);
  const local = buildClawHead(gem);
  const base = headBaseY(gem);
  const post = new THREE.CylinderGeometry(0.42, 0.42, 9.5, 14);
  post.translate(0, base - 4.6, 0);
  // Butterfly back: small and tucked behind the stone, as in product photography.
  const back = new THREE.SphereGeometry(1.9, 32, 16);
  back.scale(1, 0.32, 1);
  back.translate(0, base - 7.2, 0);
  local.metal.push(metal(post), metal(back));
  const piece = transformParts(local, FACE_VIEWER);
  piece.gems.push({ gem, matrix: FACE_VIEWER.clone() });
  return { piece, halfWidth: Math.max(gem.dims.width, gem.dims.length) / 2, gem };
}

function hoop(design: JewelDesign) {
  const d = Math.min(1.9, Math.max(1.0, 0.9 + design.carat * 0.35));
  const R = 8 + design.carat * 1.6;
  const halfR = 1.05, halfZ = d * 0.62;
  const stations: Station[] = Array.from({ length: 160 }, (_, i) => {
    const a = (i / 160) * Math.PI * 2;
    const n: [number, number, number] = [Math.sin(a), Math.cos(a), 0];
    return {
      origin: [n[0] * R, n[1] * R, 0],
      n,
      b: [0, 0, 1],
      profile: superProfile(halfR, halfZ, { outer: 3, inner: 3.5, dome: 0, segments: 24 }),
    };
  });
  const piece = emptyParts();
  piece.metal.push(metal(sweepClosed(stations)));

  const gap = 0.42;
  const stones: THREE.Matrix4[] = [];
  const front = new THREE.Vector3(0, 0, 1);
  const step = (d * 1.08) / R;
  for (let a = gap; a < Math.PI * 2 - gap; a += step) {
    const p = new THREE.Vector3(Math.sin(a) * R, Math.cos(a) * R, halfZ - d * 0.05);
    stones.push(placeMatrix(p, front, d));
  }
  piece.gemInstances.push({ gem: meleeStone(), matrices: stones, primary: true });

  const post = new THREE.CylinderGeometry(0.4, 0.4, 7, 12);
  post.rotateX(Math.PI / 2);
  post.translate(0, R + halfR * 0.6, -2.5);
  piece.metal.push(metal(post));
  return { piece, halfWidth: R + halfR, gem: null };
}

export function buildEarrings(design: JewelDesign) {
  const isHoop = design.earring === "hoop";
  const single = isHoop ? hoop(design) : stud(design);
  const spacing = single.halfWidth + (isHoop ? 3 : 4);
  // Studs are angled as a mirrored pair; hoops are shown matching, both turned
  // the same way so neither collapses edge-on.
  const pair: PieceParts[] = [1, -1].map((side) => {
    const turn = isHoop ? -0.38 : -side * 0.2;
    const m = new THREE.Matrix4().makeTranslation(side * spacing, 0, 0)
      .multiply(new THREE.Matrix4().makeRotationY(turn));
    return transformParts(single.piece, m);
  });
  return { parts: mergeParts(...pair), gem: single.gem };
}
