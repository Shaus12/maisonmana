// Procedural diamond cutter. Builds watertight, flat-shaded faceted stones:
// a 57-facet brilliant topology (table, 8 stars, 8 bezels, 16 upper girdles,
// faceted girdle, 8 pavilion mains, 16 lower girdles) mapped onto any outline,
// and a three-row step cut for emerald/asscher. Units: millimetres.
// Local frame: girdle centred on y = 0, table facing +y.

import * as THREE from "three";
import { SHAPE_PROPORTIONS } from "../core/catalog";
import { gemDimensions, gemDimensionsFromWidth } from "../core/dimensions";
import type { GemDimensions, GemShape } from "../core/types";
import { createOutline, insetOctagon, type Outline, type Vec2 } from "./outline";

type V3 = [number, number, number];

export interface GemBuild {
  shape: GemShape;
  geometry: THREE.BufferGeometry;
  dims: GemDimensions;
  outline: Outline;
  /** y of the table / culet in the stone's local frame. */
  tableY: number;
  culetY: number;
  /** Height of the crown surface at radial fraction s ∈ [table, 1]. */
  crownY(s: number): number;
  /** Height of the pavilion surface at radial fraction s ∈ [0, 1]. */
  pavilionY(s: number): number;
  /** Point at radial fraction s (0 = centre, 1 = girdle) along outline parameter u. */
  pointAt(u: number, s: number): Vec2;
}

class FacetBuilder {
  private positions: number[] = [];
  constructor(private centre: V3) {}

  tri(a: V3, b: V3, c: V3) {
    const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    const n = [ab[1] * ac[2] - ab[2] * ac[1], ab[2] * ac[0] - ab[0] * ac[2], ab[0] * ac[1] - ab[1] * ac[0]];
    const len = Math.hypot(n[0], n[1], n[2]);
    if (len < 1e-10) return; // degenerate (collapsed step row / keel)
    const m = [(a[0] + b[0] + c[0]) / 3 - this.centre[0], (a[1] + b[1] + c[1]) / 3 - this.centre[1], (a[2] + b[2] + c[2]) / 3 - this.centre[2]];
    const outward = n[0] * m[0] + n[1] * m[1] + n[2] * m[2] >= 0;
    const order = outward ? [a, b, c] : [a, c, b];
    for (const p of order) this.positions.push(p[0], p[1], p[2]);
  }

  quad(a: V3, b: V3, c: V3, d: V3) {
    this.tri(a, b, c);
    this.tri(a, c, d);
  }

  fan(centre: V3, ring: V3[]) {
    for (let i = 0; i < ring.length; i++) this.tri(centre, ring[i], ring[(i + 1) % ring.length]);
  }

  build(): THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(this.positions, 3));
    geometry.computeVertexNormals(); // non-indexed → exact flat facet normals
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    return geometry;
  }
}

function frame(dims: GemDimensions, outline: Outline) {
  const gTop = dims.girdle / 2;
  const gBottom = -dims.girdle / 2;
  const tableY = gTop + dims.crownHeight;
  const culetY = gBottom - dims.pavilionDepth;
  const t = dims.table;
  const [cx, cz] = outline.center;
  const pointAt = (u: number, s: number): Vec2 => {
    const [x, z] = outline.at(u);
    return [cx + s * (x - cx), cz + s * (z - cz)];
  };
  const crownY = (s: number) => gTop + dims.crownHeight * Math.min(1, Math.max(0, (1 - s) / (1 - t)));
  const pavilionY = (s: number) => gBottom - dims.pavilionDepth * (1 - Math.min(1, Math.max(0, s)));
  return { gTop, gBottom, tableY, culetY, pointAt, crownY, pavilionY, cx, cz };
}

function buildBrilliant(dims: GemDimensions, outline: Outline, girdleDetail: number) {
  const f = frame(dims, outline);
  const { gTop, gBottom, tableY, culetY, pointAt, crownY, pavilionY } = f;
  const P = (u: number, s: number, y: number): V3 => {
    const [x, z] = pointAt(u, s);
    return [x, y, z];
  };
  const builder = new FacetBuilder([f.cx, (tableY + culetY) / 2, f.cz]);
  const K = 8;
  const main = (k: number) => (k * Math.PI) / 4;
  const mid = (k: number) => main(k) + Math.PI / 8;
  const perSector = 2 * girdleDetail;
  const girdleCount = K * perSector;

  const sStar = dims.table + 0.5 * (1 - dims.table);
  const sLower = 1 - 0.77;
  const T = Array.from({ length: K }, (_, k) => P(main(k), dims.table, tableY));
  const S = Array.from({ length: K }, (_, k) => P(mid(k), sStar, crownY(sStar)));
  const L = Array.from({ length: K }, (_, k) => P(mid(k), sLower, pavilionY(sLower)));
  const girdleU = (j: number) => (j / girdleCount) * Math.PI * 2;
  const GT = Array.from({ length: girdleCount }, (_, j) => P(girdleU(j), 1, gTop));
  const GB = Array.from({ length: girdleCount }, (_, j) => P(girdleU(j), 1, gBottom));
  const culet: V3 = [f.cx, culetY, f.cz];

  builder.fan([f.cx, tableY, f.cz], T);
  for (let k = 0; k < K; k++) {
    const kn = (k + 1) % K;
    const kp = (k + K - 1) % K;
    const g = k * perSector;
    builder.tri(T[k], T[kn], S[k]); // star
    builder.tri(T[k], S[kp], GT[g]); // bezel (kite), two halves
    builder.tri(T[k], GT[g], S[k]);
    for (let j = 0; j < perSector; j++) {
      builder.tri(S[k], GT[(g + j) % girdleCount], GT[(g + j + 1) % girdleCount]); // upper girdles
      builder.tri(L[k], GB[(g + j) % girdleCount], GB[(g + j + 1) % girdleCount]); // lower girdles
    }
    builder.tri(L[kp], GB[g], culet); // pavilion main, two halves
    builder.tri(culet, GB[g], L[k]);
  }
  for (let j = 0; j < girdleCount; j++) {
    const jn = (j + 1) % girdleCount;
    builder.quad(GT[j], GT[jn], GB[jn], GB[j]);
  }
  return { builder, f };
}

function buildStepCut(dims: GemDimensions, outline: Outline) {
  const f = frame(dims, outline);
  const o = outline.octagon!;
  const builder = new FacetBuilder([0, (f.tableY + f.culetY) / 2, 0]);
  const ring = (d: number, y: number): V3[] => insetOctagon(o, d).map(([x, z]) => [x, y, z]);
  const connect = (a: V3[], b: V3[]) => {
    for (let i = 0; i < a.length; i++) {
      const n = (i + 1) % a.length;
      builder.quad(a[i], a[n], b[n], b[i]);
    }
  };

  const tableInset = (dims.width * (1 - dims.table)) / 2;
  const crown = [
    ring(0, f.gTop),
    ring(tableInset * 0.38, f.gTop + dims.crownHeight * 0.45),
    ring(tableInset * 0.7, f.gTop + dims.crownHeight * 0.78),
    ring(tableInset, f.tableY),
  ];
  const half = o.hx;
  const pav = [0, 0.3, 0.58, 0.82, 1].map((d, i) =>
    ring(half * d, f.gBottom - dims.pavilionDepth * [0, 0.38, 0.66, 0.87, 1][i]),
  );

  for (let i = 0; i < crown.length - 1; i++) connect(crown[i], crown[i + 1]);
  builder.fan([0, f.tableY, 0], crown[crown.length - 1]);
  connect(crown[0], pav[0]); // girdle
  for (let i = 0; i < pav.length - 1; i++) connect(pav[i], pav[i + 1]);
  return { builder, f };
}

function assemble(shape: GemShape, dims: GemDimensions, girdleDetail: number): GemBuild {
  const outline = createOutline(shape, dims.width, dims.length);
  const { builder, f } = SHAPE_PROPORTIONS[shape].cut === "step"
    ? buildStepCut(dims, outline)
    : buildBrilliant(dims, outline, girdleDetail);
  return {
    shape,
    geometry: builder.build(),
    dims,
    outline,
    tableY: f.tableY,
    culetY: f.culetY,
    crownY: f.crownY,
    pavilionY: f.pavilionY,
    pointAt: f.pointAt,
  };
}

/** A centre stone of the given carat weight. */
export function buildGem(shape: GemShape, carat: number): GemBuild {
  return assemble(shape, gemDimensions(shape, carat), shape === "round" || shape === "oval" ? 4 : 3);
}

/** A stone of a given width in mm (side stones, melee). */
export function buildGemByWidth(shape: GemShape, width: number, girdleDetail = 2): GemBuild {
  return assemble(shape, gemDimensionsFromWidth(shape, width), girdleDetail);
}

/** Unit melee (1 mm round brilliant), meant to be instanced and scaled. */
let meleeCache: GemBuild | null = null;
export function meleeStone(): GemBuild {
  if (!meleeCache) {
    meleeCache = buildGemByWidth("round", 1, 1);
    meleeCache.geometry.userData.shared = true;
  }
  return meleeCache;
}
