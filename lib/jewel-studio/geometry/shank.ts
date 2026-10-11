// Ring shanks. The ring lies in the XY plane (finger axis = Z), the head
// sits at the top (+Y). Every band style is described as one or more
// strands swept around the finger, plus optional beads, leaves and melee.

import * as THREE from "three";
import { STONE_SET_BANDS } from "../core/catalog";
import type { BandStyle } from "../core/types";
import { meleeStone } from "./gem";
import { metal, placeMatrix, UNIT_SPHERE, emptyParts, type PieceParts } from "./parts";
import { superProfile, sweepClosed, type Station } from "./sweep";
import type { SurfaceTexture } from "./textures";

export interface ShankOptions {
  style: BandStyle;
  innerRadius: number;
  width: number;
  thickness: number;
  /** Half-angle (radians) at the top kept clear of melee for the head. */
  headClearance: number;
  /** Head style "pave": set melee along plain bands too. */
  addPave: boolean;
}

type Fn = (theta: number) => number;
interface Strand {
  halfW: Fn;
  halfT: Fn;
  z?: Fn;
  r?: Fn;
  outer?: number;
  inner?: number;
  dome?: number;
  segments?: number;
  /** Set melee along this strand's crest. */
  melee?: boolean;
}

const STATIONS = 180;
const MAX_ARC = 1.9; // how far down the shank melee runs (rad from top)

const top: Fn = (t) => (1 + Math.cos(t)) / 2;
const k = (v: number): Fn => () => v;
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function thetaAt(i: number, count = STATIONS) {
  const a = (i / count) * Math.PI * 2;
  return a > Math.PI ? a - Math.PI * 2 : a;
}

function frameAt(ri: number, s: Strand, theta: number) {
  const n = new THREE.Vector3(Math.sin(theta), Math.cos(theta), 0);
  const hT = s.halfT(theta);
  const R = ri + hT + (s.r?.(theta) ?? 0);
  const z = s.z?.(theta) ?? 0;
  return { n, hT, hW: s.halfW(theta), centre: n.clone().multiplyScalar(R).setZ(z) };
}

function sweepStrand(ri: number, s: Strand, minY?: number) {
  const stations: Station[] = [];
  for (let i = 0; i < STATIONS; i++) {
    const theta = thetaAt(i);
    const f = frameAt(ri, s, theta);
    stations.push({
      origin: [f.centre.x, f.centre.y, f.centre.z],
      n: [f.n.x, f.n.y, 0],
      b: [0, 0, 1],
      profile: superProfile(f.hT, f.hW, { outer: s.outer ?? 2.8, inner: s.inner ?? 4.5, dome: s.dome ?? 0.1, segments: s.segments ?? 28 }),
    });
  }
  return sweepClosed(stations, [28, 1], { minY });
}

function helix(count: number, twists: number, amp: number, wire: number, braid = false): Strand[] {
  return Array.from({ length: count }, (_, i) => {
    const phase = (i / count) * Math.PI * 2;
    const a = (t: number) => twists * t + phase;
    return {
      halfW: k(wire),
      halfT: k(wire),
      outer: 2,
      inner: 2,
      dome: 0,
      segments: 18,
      r: braid ? (t) => amp * (1 + Math.cos(2 * a(t))) * 0.5 : (t) => amp * (1 + Math.cos(a(t))),
      z: braid ? (t) => amp * 1.25 * Math.sin(a(t)) : (t) => amp * Math.sin(a(t)),
    };
  });
}

interface BandSpec {
  strands: Strand[];
  texture?: SurfaceTexture;
  flatBottom?: boolean;
  edgeBeads?: number;
  leaves?: boolean;
  spheres?: boolean;
  channel?: boolean;
}

function bandSpec(style: BandStyle, w: number, t: number, wantPave: boolean): BandSpec {
  const w2 = w / 2;
  const t2 = t / 2;
  const plain = (extra: Partial<Strand> = {}): Strand => ({ halfW: k(w2), halfT: k(t2), melee: wantPave, ...extra });
  switch (style) {
    case "knife-edge": return { strands: [plain({ halfW: k(w2 * 1.05), halfT: k(t2 * 1.12), outer: 1.25, inner: 4, dome: 0 })] };
    case "tapered": return { strands: [plain({ halfW: (a) => w2 * (1 - 0.4 * top(a) ** 3), halfT: (a) => t2 * (1 - 0.12 * top(a) ** 2) })] };
    case "reverse-tapered": return { strands: [plain({ halfW: (a) => w2 * (1 + 0.6 * top(a) ** 4) })] };
    case "euro-shank": return { strands: [plain({ halfT: (a) => t2 * (1 + 0.55 * (1 - top(a)) ** 3), outer: 3.5 })], flatBottom: true };
    case "concave": return { strands: [plain({ outer: 4, dome: -0.45 })] };
    case "convex": return { strands: [plain({ outer: 2.2, dome: 0.35 })] };
    case "chevron": return { strands: [plain({ z: (a) => -1.5 * Math.max(0, 1 - Math.abs(a) / 0.8) })] };
    case "split-shank": return {
      strands: [1, -1].map((side) => plain({ halfW: k(w2 * 0.56), z: (a) => side * (w2 * 0.5 + 1.7 * top(a) ** 5) })),
    };
    case "bypass": return {
      strands: [1, -1].map((side) => plain({
        halfW: k(w2 * 0.56),
        z: (a) => side * (w2 * 0.5 + 1.5 * top(a) ** 3 * smooth(-0.35, 0.6, side * a)),
      })),
    };
    case "double-band": return {
      strands: [1, -1].map((side) => plain({ halfW: k(w2 * 0.42), halfT: k(t2 * 0.92), z: k(side * w2 * 0.62) })),
    };
    case "twisted": return { strands: helix(2, 14, w * 0.2, w * 0.28) };
    case "rope": return { strands: helix(3, 22, w * 0.22, w * 0.25) };
    case "braided": return { strands: helix(3, 12, w * 0.24, w * 0.22, true) };
    case "twisted-pave": {
      const strands = helix(2, 9, w * 0.22, w * 0.3);
      strands[1].melee = true;
      return { strands };
    }
    case "infinity": return {
      strands: [1, -1].map((side) => ({
        halfW: k(w * 0.3), halfT: k(t2 * 0.9), outer: 2.4, inner: 3,
        z: (a: number) => side * (w * 0.22 * (1 - top(a)) + w * 0.55 * Math.sin(2.5 * a) * top(a) ** 2),
      })),
    };
    case "milgrain": return { strands: [plain({ outer: 2.4, dome: 0.05 })], edgeBeads: 0.11 };
    case "beaded": return { strands: [{ halfW: k(w * 0.16), halfT: k(w * 0.16), outer: 2, inner: 2, dome: 0, segments: 14 }], spheres: true };
    case "vintage-scroll": return { strands: [plain({ outer: 2.2, dome: 0.04 })], texture: "scroll" };
    case "hammered": return { strands: [plain({ outer: 2.6 })], texture: "hammered" };
    case "vine": return { strands: [plain({ halfW: k(w2 * 0.6), halfT: k(t2 * 0.85) })], leaves: true };
    case "pave-band": return { strands: [plain({ halfW: k(w2 * 1.08), outer: 2.0, dome: 0.02, melee: true })] };
    case "scalloped-pave": return { strands: [plain({ halfW: k(w2 * 1.1), outer: 2.0, dome: 0.02, melee: true })], edgeBeads: 0.17 };
    case "channel-set": return {
      strands: [
        plain({ halfT: k(t2 * 0.82), halfW: k(w2 * 1.1), outer: 3, dome: 0, melee: true }),
        ...[1, -1].map((side) => ({ halfW: k(0.26), halfT: k(t2 * 0.82 + 0.28), z: k(side * (w2 * 1.1 - 0.26)), outer: 3, inner: 4, dome: 0 })),
      ],
      channel: true,
    };
    default: return { strands: [plain({ dome: 0.12 })] };
  }
}

/** Places melee along a strand's crest, outward-facing, avoiding the head. */
function setMelee(parts: PieceParts, ri: number, s: Strand, clearance: number, sunk: boolean) {
  const melee = meleeStone();
  const crestW = s.halfW(0) * 2;
  const d = Math.min(1.45, Math.max(0.9, crestW * 0.72));
  const gems: THREE.Matrix4[] = [];
  const beads: THREE.Matrix4[] = [];
  const sink = sunk ? d * 0.08 : -d * 0.02;
  for (const side of [1, -1]) {
    let theta = clearance + d * 0.5 / (ri + 2);
    while (theta < MAX_ARC) {
      const a = side * theta;
      const f = frameAt(ri, s, a);
      const rOut = f.hT;
      const pos = f.centre.clone().addScaledVector(f.n, rOut - sink);
      gems.push(placeMatrix(pos, f.n, d));
      if (!sunk) {
        const step = (d * 0.56) / (ri + rOut * 2);
        const fb = frameAt(ri, s, a + side * step);
        for (const zs of [1, -1]) {
          const bead = fb.centre.clone().addScaledVector(fb.n, fb.hT + d * 0.06);
          bead.z += zs * d * 0.42;
          beads.push(placeMatrix(bead, fb.n, d * 0.16));
        }
      }
      theta += (d * 1.1) / (ri + rOut * 2);
    }
  }
  parts.gemInstances.push({ gem: melee, matrices: gems });
  if (beads.length) parts.metalInstances.push({ geometry: UNIT_SPHERE, matrices: beads });
}

export function buildShank(o: ShankOptions): PieceParts {
  const parts = emptyParts();
  const ri = o.innerRadius;
  const wantPave = o.addPave && !STONE_SET_BANDS.has(o.style);
  const spec = bandSpec(o.style, o.width, o.thickness, wantPave);
  const minY = spec.flatBottom ? -(ri + o.thickness * 1.15) : undefined;

  for (const s of spec.strands) parts.metal.push(metal(sweepStrand(ri, s, minY), spec.texture));
  for (const s of spec.strands) if (s.melee) setMelee(parts, ri, s, o.headClearance, Boolean(spec.channel));

  const main = spec.strands[0];
  if (spec.edgeBeads) {
    const r = spec.edgeBeads;
    const beads: THREE.Matrix4[] = [];
    const R = ri + main.halfT(0) * 2;
    const count = Math.floor((Math.PI * 2 * R) / (r * 2.3));
    for (let i = 0; i < count; i++) {
      const a = thetaAt(i, count);
      const f = frameAt(ri, main, a);
      for (const zs of [1, -1]) {
        const p = f.centre.clone().addScaledVector(f.n, f.hT * 0.82);
        p.z += zs * (f.hW - r * 0.6);
        beads.push(placeMatrix(p, f.n, r));
      }
    }
    parts.metalInstances.push({ geometry: UNIT_SPHERE, matrices: beads });
  }

  if (spec.spheres) {
    const r = o.width / 2;
    const R = ri + r;
    const count = Math.floor((Math.PI * 2 * R) / (r * 1.96));
    const beads = Array.from({ length: count }, (_, i) => {
      const a = thetaAt(i, count) + Math.PI / count;
      return placeMatrix(new THREE.Vector3(Math.sin(a) * R, Math.cos(a) * R, 0), new THREE.Vector3(Math.sin(a), Math.cos(a), 0), r);
    });
    parts.metalInstances.push({ geometry: UNIT_SPHERE, matrices: beads });
  }

  if (spec.leaves) {
    const leaves: THREE.Matrix4[] = [];
    const R = ri + main.halfT(0) * 2;
    for (let i = 0, a = o.headClearance + 0.12; a < MAX_ARC + 0.4; i++, a += 0.2) {
      for (const side of [1, -1]) {
        const theta = side * a;
        const n = new THREE.Vector3(Math.sin(theta), Math.cos(theta), 0);
        const pos = n.clone().multiplyScalar(R + 0.05);
        pos.z = (i % 2 ? 1 : -1) * main.halfW(0) * 1.05;
        const m = placeMatrix(pos, n, new THREE.Vector3(0.55, 0.16, 1.0), (i % 2 ? 1 : -1) * 0.6 + side * 0.4);
        leaves.push(m);
      }
    }
    parts.metalInstances.push({ geometry: UNIT_SPHERE, matrices: leaves });
  }

  return parts;
}

/** Radius of the band's outer surface at the very top (where the head sits). */
export function shankTopRadius(o: Pick<ShankOptions, "innerRadius" | "thickness">) {
  return o.innerRadius + o.thickness;
}
