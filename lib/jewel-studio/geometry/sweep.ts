// Sweeps a closed 2D profile along a closed path — used for ring shanks,
// bezels, halo frames and hoops. Each station carries its own profile so
// width, thickness and shape can vary continuously around the path.

import * as THREE from "three";

export type P2 = [number, number];
export type P3 = [number, number, number];

export interface Station {
  origin: P3;
  /** Profile x axis (usually the outward direction). Unit length. */
  n: P3;
  /** Profile y axis (usually across the band). Unit length. */
  b: P3;
  profile: P2[];
}

/**
 * Rounded profile: a superellipse with independent exponents for the outer
 * (+x) and inner (−x) halves, plus an optional dome/dish on the outer face.
 */
export function superProfile(
  halfX: number,
  halfY: number,
  opts: { outer?: number; inner?: number; dome?: number; segments?: number } = {},
): P2[] {
  const { outer = 3, inner = 4, dome = 0, segments = 28 } = opts;
  const pts: P2[] = [];
  for (let i = 0; i < segments; i++) {
    // Start on the inner face so the UV seam never runs along a visible surface.
    const phi = Math.PI + (i / segments) * Math.PI * 2;
    const c = Math.cos(phi);
    const s = Math.sin(phi);
    const e = c >= 0 ? outer : inner;
    let x = halfX * Math.sign(c) * Math.abs(c) ** (2 / e);
    const y = halfY * Math.sign(s) * Math.abs(s) ** (2 / e);
    if (c > 0 && dome) x += dome * halfX * (1 - (y / halfY) ** 2) * Math.min(1, c * 3);
    pts.push([x, y]);
  }
  return pts;
}

export function circleProfile(radius: number, segments = 16): P2[] {
  return superProfile(radius, radius, { outer: 2, inner: 2, segments });
}

/**
 * Builds an indexed, smooth-shaded tube. The first station and first profile
 * point are duplicated at the end so UVs run 0→1 without a wrap seam; seam
 * normals are averaged afterwards so the join is invisible.
 */
export function sweepClosed(
  stations: Station[],
  uvRepeat: P2 = [1, 1],
  opts: { minY?: number } = {},
): THREE.BufferGeometry {
  const S = stations.length;
  const M = stations[0].profile.length;
  const positions = new Float32Array((S + 1) * (M + 1) * 3);
  const uvs = new Float32Array((S + 1) * (M + 1) * 2);

  for (let i = 0; i <= S; i++) {
    const st = stations[i % S];
    for (let j = 0; j <= M; j++) {
      const [px, py] = st.profile[j % M];
      const k = i * (M + 1) + j;
      positions[k * 3] = st.origin[0] + st.n[0] * px + st.b[0] * py;
      const y = st.origin[1] + st.n[1] * px + st.b[1] * py;
      positions[k * 3 + 1] = opts.minY === undefined ? y : Math.max(opts.minY, y);
      positions[k * 3 + 2] = st.origin[2] + st.n[2] * px + st.b[2] * py;
      uvs[k * 2] = (i / S) * uvRepeat[0];
      uvs[k * 2 + 1] = (j / M) * uvRepeat[1];
    }
  }

  const indices: number[] = [];
  for (let i = 0; i < S; i++) {
    for (let j = 0; j < M; j++) {
      const a = i * (M + 1) + j;
      const b = (i + 1) * (M + 1) + j;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  // Orient outward: the profile point furthest along +n must face +n.
  const st0 = stations[0];
  let far = 0;
  for (let j = 1; j < M; j++) if (st0.profile[j][0] > st0.profile[far][0]) far = j;
  const nrm = geometry.getAttribute("normal") as THREE.BufferAttribute;
  if (nrm.getX(far) * st0.n[0] + nrm.getY(far) * st0.n[1] + nrm.getZ(far) * st0.n[2] < 0) {
    const index = geometry.getIndex()!;
    for (let t = 0; t < index.count; t += 3) {
      const tmp = index.getX(t + 1);
      index.setX(t + 1, index.getX(t + 2));
      index.setX(t + 2, tmp);
    }
    geometry.computeVertexNormals();
  }

  averageSeams(geometry, S, M);
  geometry.computeBoundingSphere();
  return geometry;
}

function averageSeams(geometry: THREE.BufferGeometry, S: number, M: number) {
  const n = geometry.getAttribute("normal") as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  const merge = (a: number, b: number) => {
    v.set(n.getX(a) + n.getX(b), n.getY(a) + n.getY(b), n.getZ(a) + n.getZ(b)).normalize();
    n.setXYZ(a, v.x, v.y, v.z);
    n.setXYZ(b, v.x, v.y, v.z);
  };
  for (let j = 0; j <= M; j++) merge(j, S * (M + 1) + j); // path seam
  for (let i = 0; i <= S; i++) merge(i * (M + 1), i * (M + 1) + M); // profile seam
  n.needsUpdate = true;
}

/** Stations for a planar closed path in the XZ plane (bezels, halo frames). */
export function stationsAlongXZ(points: P2[], normals: P2[], y: number, profile: (i: number) => P2[]): Station[] {
  return points.map(([x, z], i) => ({
    origin: [x, y, z],
    n: [normals[i][0], 0, normals[i][1]],
    b: [0, 1, 0],
    profile: profile(i),
  }));
}
