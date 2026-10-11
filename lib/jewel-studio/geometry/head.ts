// Stone settings, built in the stone's local frame (girdle at y = 0, table +Y):
// claw prongs that follow the pavilion and curl over the crown, gallery
// rails, a bezel cup, a visible halo and a hidden (under-girdle) halo.

import * as THREE from "three";
import type { GemShape } from "../core/types";
import { meleeStone, type GemBuild } from "./gem";
import { emptyParts, metal, placeMatrix, UNIT_SPHERE, type PieceParts } from "./parts";
import { superProfile, sweepClosed, type P2, type Station } from "./sweep";

const TAU = Math.PI * 2;
const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

/** Outline parameters where claws sit; V-claws protect pointed tips. */
export function prongLayout(shape: GemShape): { u: number[]; v: number[] } {
  const q = Math.PI / 4;
  switch (shape) {
    case "pear": return { u: [-0.25, Math.PI + 0.25, 1.5 * Math.PI - 0.75, 1.5 * Math.PI + 0.75], v: [Math.PI / 2] };
    case "marquise": return { u: [0, Math.PI], v: [Math.PI / 2, 1.5 * Math.PI] };
    case "heart": return { u: [0.45, Math.PI - 0.45], v: [1.5 * Math.PI] };
    default: return { u: [q, 3 * q, 5 * q, 7 * q], v: [] };
  }
}

export function prongRadius(gem: GemBuild) {
  return Math.min(0.62, Math.max(0.3, gem.dims.width * 0.068));
}

/** The lowest point of a claw head, below the culet. */
export function headBaseY(gem: GemBuild) {
  return gem.culetY - prongRadius(gem) * 2.2;
}

function offsetPoint(gem: GemBuild, u: number, s: number, out: number): [number, number] {
  const [x, z] = gem.pointAt(u, s);
  const [nx, nz] = gem.outline.normal(u);
  return [x + nx * out, z + nz * out];
}

function claw(gem: GemBuild, u: number, r: number, baseY: number) {
  const [bx, bz] = gem.pointAt(u, 0.3);
  const [px, pz] = offsetPoint(gem, u, 0.62, r * 1.05);
  const [gx, gz] = offsetPoint(gem, u, 1, r * 0.55);
  const [tx, tz] = gem.pointAt(u, 0.9);
  const tipY = gem.crownY(0.9) + r * 0.55;
  const curve = new THREE.CatmullRomCurve3(
    [V(bx, baseY, bz), V(px, gem.pavilionY(0.62), pz), V(gx, 0, gz), V(tx, tipY, tz)],
    false,
    "centripetal",
  );
  return { geometry: new THREE.TubeGeometry(curve, 36, r, 12, false), tip: V(tx, tipY, tz) };
}

function rail(gem: GemBuild, s: number, out: number, y: number, radius: number) {
  const pts = Array.from({ length: 64 }, (_, i) => {
    const [x, z] = offsetPoint(gem, (i / 64) * TAU, s, out);
    return V(x, y, z);
  });
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true, "centripetal"), 128, radius, 10, true);
}

/** Claw head: prongs + two gallery rails + a seat ring under the culet. */
export function buildClawHead(gem: GemBuild, opts: { gallery?: boolean } = {}): PieceParts {
  const parts = emptyParts();
  const r = prongRadius(gem);
  const baseY = headBaseY(gem);
  const { u, v } = prongLayout(gem.shape);
  const tips: THREE.Matrix4[] = [];
  const place = (uu: number, rr: number) => {
    const c = claw(gem, uu, rr, baseY);
    parts.metal.push(metal(c.geometry));
    tips.push(placeMatrix(c.tip, V(0, 1, 0), rr * 1.02));
  };
  u.forEach((uu) => place(uu, r));
  v.forEach((uu) => { place(uu - 0.07, r * 0.95); place(uu + 0.07, r * 0.95); });
  parts.metalInstances.push({ geometry: UNIT_SPHERE, matrices: tips });

  if (opts.gallery ?? true) {
    parts.metal.push(metal(rail(gem, 0.8, r * 0.75, gem.pavilionY(0.8), r * 0.5)));
    parts.metal.push(metal(rail(gem, 0.42, r * 0.7, gem.pavilionY(0.42), r * 0.45)));
  }
  return parts;
}

/** Bezel: a rounded rim hugging the girdle over a tapered cup. */
export function buildBezel(gem: GemBuild): PieceParts {
  const parts = emptyParts();
  const wall = Math.min(0.8, Math.max(0.45, gem.dims.width * 0.085));
  const yTop = Math.min(0.38, gem.dims.crownHeight * 0.45);
  const yBottom = gem.pavilionY(0.72);
  const count = 120;
  const stations: Station[] = [];
  const cup: Station[] = [];
  for (let i = 0; i < count; i++) {
    const u = (i / count) * TAU;
    const [x, z] = offsetPoint(gem, u, 1, wall * 0.5 - 0.05);
    const [nx, nz] = gem.outline.normal(u);
    stations.push({
      origin: [x, (yTop + yBottom) / 2, z],
      n: [nx, 0, nz],
      b: [0, 1, 0],
      profile: superProfile(wall / 2, (yTop - yBottom) / 2, { outer: 4, inner: 6, dome: 0.05, segments: 24 }),
    });
    // Cup wall from under the rim towards a seat below the culet.
    const [sx, sz] = gem.pointAt(u, 0.38);
    const inward = Math.hypot(x - sx, z - sz);
    cup.push({
      origin: [x, 0, z],
      n: [nx, 0, nz],
      b: [0, 1, 0],
      profile: capsule([wall * 0.25, yBottom + 0.1], [-inward, gem.culetY - 0.35], 0.26),
    });
  }
  parts.metal.push(metal(sweepClosed(stations)));
  parts.metal.push(metal(sweepClosed(cup)));
  return parts;
}

/** A rounded slab between two points in the profile plane. */
function capsule(a: P2, b: P2, radius: number, segments = 10): P2[] {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const ang = Math.atan2(dy, dx);
  const pts: P2[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = ang + Math.PI / 2 + (i / segments) * Math.PI;
    pts.push([b[0] + Math.cos(t) * radius, b[1] + Math.sin(t) * radius]);
  }
  for (let i = 0; i <= segments; i++) {
    const t = ang - Math.PI / 2 + (i / segments) * Math.PI;
    pts.push([a[0] + Math.cos(t) * radius, a[1] + Math.sin(t) * radius]);
  }
  return pts;
}

/** Equal arc-length samples along the girdle outline offset outward by `out`. */
function arcSamples(gem: GemBuild, out: number, spacing: number) {
  const n = 480;
  const raw = Array.from({ length: n }, (_, i) => {
    const u = (i / n) * TAU;
    const [x, z] = offsetPoint(gem, u, 1, out);
    return { x, z, u };
  });
  const cum = [0];
  for (let i = 1; i <= n; i++) {
    const a = raw[i - 1], b = raw[i % n];
    cum.push(cum[i - 1] + Math.hypot(b.x - a.x, b.z - a.z));
  }
  const total = cum[n];
  const count = Math.max(8, Math.floor(total / spacing));
  const samples: { x: number; z: number; nx: number; nz: number }[] = [];
  let j = 0;
  for (let k = 0; k < count; k++) {
    const target = (k / count) * total;
    while (cum[j + 1] < target) j++;
    const f = (target - cum[j]) / Math.max(1e-6, cum[j + 1] - cum[j]);
    const a = raw[j], b = raw[(j + 1) % n];
    const u = a.u + f * (((b.u - a.u) + TAU) % TAU);
    const [nx, nz] = gem.outline.normal(u);
    samples.push({ x: a.x + (b.x - a.x) * f, z: a.z + (b.z - a.z) * f, nx, nz });
  }
  return samples;
}

/** Visible halo: a frame of melee around the girdle, beaded on both edges. */
export function buildHalo(gem: GemBuild): PieceParts {
  const parts = emptyParts();
  const r = prongRadius(gem);
  const d = Math.min(1.5, Math.max(0.9, gem.dims.width * 0.13));
  const y = -d * 0.18;
  const ring = arcSamples(gem, r * 0.9 + d * 0.55, d * 1.07);
  const gems: THREE.Matrix4[] = [];
  const beads: THREE.Matrix4[] = [];
  ring.forEach((p, i) => {
    const up = V(p.nx * 0.14, 1, p.nz * 0.14).normalize();
    gems.push(placeMatrix(V(p.x, y, p.z), up, d));
    const q = ring[(i + 1) % ring.length];
    const mx = (p.x + q.x) / 2, mz = (p.z + q.z) / 2;
    for (const side of [1, -1]) {
      beads.push(placeMatrix(V(mx + p.nx * side * d * 0.5, y + d * 0.08, mz + p.nz * side * d * 0.5), V(0, 1, 0), d * 0.15));
    }
  });
  parts.gemInstances.push({ gem: meleeStone(), matrices: gems });
  parts.metalInstances.push({ geometry: UNIT_SPHERE, matrices: beads });

  const frame: Station[] = ring.map((p) => ({
    origin: [p.x, y - d * 0.62, p.z],
    n: [p.nx, 0, p.nz],
    b: [0, 1, 0],
    profile: superProfile(d * 0.62, d * 0.34, { outer: 4, inner: 4, dome: 0, segments: 20 }),
  }));
  parts.metal.push(metal(sweepClosed(frame)));
  return parts;
}

/** Hidden halo: melee under the girdle, tilted outward so it shows in profile. */
export function buildHiddenHalo(gem: GemBuild): PieceParts {
  const parts = emptyParts();
  const r = prongRadius(gem);
  const d = Math.min(1.25, Math.max(0.8, gem.dims.width * 0.11));
  const y = gem.pavilionY(0.88) - d * 0.15;
  const ring = arcSamples(gem, r * 0.6, d * 1.08);
  parts.gemInstances.push({
    gem: meleeStone(),
    matrices: ring.map((p) => placeMatrix(V(p.x, y, p.z), V(p.nx, 0.75, p.nz).normalize(), d)),
  });
  const frame: Station[] = ring.map((p) => ({
    origin: [p.x - p.nx * d * 0.35, y - d * 0.35, p.z - p.nz * d * 0.35],
    n: [p.nx, 0, p.nz],
    b: [0, 1, 0],
    profile: superProfile(d * 0.32, d * 0.3, { outer: 3, inner: 3, dome: 0, segments: 16 }),
  }));
  parts.metal.push(metal(sweepClosed(frame)));
  return parts;
}

/** Outward reach of the setting from the stone centre (for framing and clearances). */
export function headFootprint(gem: GemBuild, halo: boolean) {
  const r = prongRadius(gem);
  const base = Math.max(gem.dims.width, gem.dims.length) / 2 + r;
  return halo ? base + Math.min(1.5, Math.max(0.9, gem.dims.width * 0.13)) * 1.2 : base;
}
