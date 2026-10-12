"use client";

// The 3D layer of the try-on: the real ring from the engine, posed on the
// tracked finger each frame. An invisible "finger" cylinder writes depth only,
// so the band disappears behind the finger exactly like a real ring.
// Rendered with an orthographic camera in screen pixels over the media.

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { buildPiece } from "../assembly";
import { DEFAULT_RING_SIZE, ringInnerRadius } from "../core/dimensions";
import type { JewelDesign } from "../core/types";
import { disposeParts } from "../geometry/parts";
import { PieceRenderer } from "../scene/PieceRenderer";
import type { HandFrame, HandTracker } from "./handTracker";
import { OneEuro, OneEuroVector } from "./oneEuro";
import { fitFrame, ringPose, type RingPose, type V3 } from "./ringPose";

export type TryOnSource =
  | { kind: "camera"; video: RefObject<HTMLVideoElement | null> }
  | { kind: "photo"; image: HTMLImageElement; hand: HandFrame | null };

const LOST_AFTER_MS = 300;

function orthonormal(axis: V3, up: V3) {
  const z = new THREE.Vector3(...axis).normalize();
  const y = new THREE.Vector3(...up);
  y.sub(z.clone().multiplyScalar(y.dot(z))).normalize();
  const x = new THREE.Vector3().crossVectors(y, z).normalize();
  return { x, y, z };
}

export function TryOnScene({
  design,
  tracker,
  source,
  onTracking,
}: {
  design: JewelDesign;
  tracker: HandTracker | null;
  source: TryOnSource | null;
  onTracking: (tracked: boolean) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const size = useThree((s) => s.size);
  const lastSeen = useRef(0);
  const lastVideoTime = useRef(-1);
  const tracked = useRef(false);
  const filters = useMemo(() => ({
    position: new OneEuroVector(2, 1.2, 0.012),
    scale: new OneEuro(0.8, 0.002),
    frame: new OneEuroVector(6, 1.6, 0.25),
  }), []);

  const { shape, carat, head, band, ringSize } = design;
  const build = useMemo(
    () => buildPiece({ ...design, type: "ring" }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [shape, carat, head, band, ringSize],
  );
  useEffect(() => () => disposeParts(build.parts), [build]);
  const innerDiameter = ringInnerRadius(ringSize ?? DEFAULT_RING_SIZE) * 2;
  const fingerRadius = (innerDiameter / 2) * 0.97;

  useEffect(() => {
    filters.position.reset();
    filters.scale.reset();
    filters.frame.reset();
  }, [source, filters]);

  const report = (now: boolean) => {
    if (now !== tracked.current) {
      tracked.current = now;
      onTracking(now);
    }
  };

  useFrame(() => {
    const g = group.current;
    if (!g || !source) return;
    const now = performance.now();
    let pose: RingPose | null = null;

    if (source.kind === "camera") {
      const video = source.video.current;
      if (!tracker || !video || video.readyState < 2 || !video.videoWidth) return;
      if (video.currentTime === lastVideoTime.current) return; // no new camera frame yet
      lastVideoTime.current = video.currentTime;
      const hand = tracker.detectVideo(video, now);
      if (hand) {
        const map = fitFrame(video.videoWidth, video.videoHeight, size.width, size.height, "cover");
        pose = ringPose(hand.image, hand.rightHand, map, innerDiameter);
      }
    } else if (source.hand) {
      const map = fitFrame(source.image.naturalWidth, source.image.naturalHeight, size.width, size.height, "contain");
      pose = ringPose(source.hand.image, source.hand.rightHand, map, innerDiameter);
    }

    if (!pose) {
      if (now - lastSeen.current > LOST_AFTER_MS) {
        g.visible = false;
        report(false);
      }
      return;
    }
    lastSeen.current = now;

    let { x, y, pxPerMm, axis, up } = pose;
    if (source.kind === "camera") {
      [x, y] = filters.position.filter([x, y], now);
      pxPerMm = filters.scale.filter(pxPerMm, now);
      const f = filters.frame.filter([...axis, ...up], now);
      axis = [f[0], f[1], f[2]];
      up = [f[3], f[4], f[5]];
    }

    const basis = orthonormal(axis, up);
    g.matrix
      .makeBasis(basis.x, basis.y, basis.z)
      .scale(new THREE.Vector3(pxPerMm, pxPerMm, pxPerMm))
      .setPosition(x - size.width / 2, size.height / 2 - y, 0);
    g.matrixWorldNeedsUpdate = true;
    g.visible = true;
    report(true);
  });

  return (
    <group ref={group} matrixAutoUpdate={false} visible={false}>
      {/* The finger: depth only, drawn first, hides the band behind it. */}
      <mesh rotation={[Math.PI / 2, 0, 0]} renderOrder={-1}>
        <cylinderGeometry args={[fingerRadius, fingerRadius, 60, 40]} />
        <meshBasicMaterial colorWrite={false} />
      </mesh>
      <PieceRenderer
        parts={build.parts}
        metal={design.metal}
        finish={design.finish ?? "polished"}
        gemColor={design.gemColor}
        showStones
        bounces={2}
      />
    </group>
  );
}
