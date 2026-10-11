"use client";

// Orbit camera with eased view presets, auto-framing on the piece and a slow
// turntable that starts once the visitor stops interacting.

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import * as THREE from "three";
import type { PieceType, StudioView } from "../core/types";

type Controls = React.ComponentRef<typeof CameraControls>;

// camera-controls ACTION values (kept local to avoid importing a transitive dependency).
const ACTION = { NONE: 0, ROTATE: 1, TOUCH_ROTATE: 64, TOUCH_DOLLY_ROTATE: 32768 } as const;

/** [azimuth, polar] per piece family. Rings: finger axis is Z, head is +Y. */
const VIEWS: Record<"upright" | "flat" | "facing", Record<StudioView, [number, number]>> = {
  upright: { hero: [0.55, 1.12], front: [0, 1.48], side: [Math.PI / 2, 1.42], top: [0, 0.14] },
  flat: { hero: [0.45, 0.92], front: [0, 1.28], side: [Math.PI / 2, 1.28], top: [0, 0.1] },
  facing: { hero: [0.32, 1.42], front: [0, Math.PI / 2], side: [1.15, 1.5], top: [0, 0.62] },
};

function family(type: PieceType) {
  if (type === "bracelet") return "flat";
  if (type === "necklace" || type === "earring") return "facing";
  return "upright";
}

export function CameraRig({ focus, view, type, autoRotate }: { focus: THREE.Sphere; view: StudioView; type: PieceType; autoRotate: boolean }) {
  const ref = useRef<Controls>(null);
  const lastInput = useRef(0);
  const dragging = useRef(false);
  const canvas = useThree((s) => s.gl.domElement);

  // A plain wheel scrolls the page (the stage must never trap scrolling);
  // trackpad pinch and Ctrl/⌘ + wheel zoom the camera.
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const c = ref.current;
      if (!c || !(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      lastInput.current = performance.now();
      const step = Math.max(-0.2, Math.min(0.2, -e.deltaY * 0.0012));
      void c.dolly(c.distance * step, true);
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
  }, [canvas]);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    c.mouseButtons.right = ACTION.NONE;
    c.mouseButtons.middle = ACTION.NONE;
    c.mouseButtons.wheel = ACTION.NONE;
    c.touches.one = ACTION.TOUCH_ROTATE;
    c.touches.two = ACTION.TOUCH_DOLLY_ROTATE;
    c.touches.three = ACTION.NONE;
    c.minPolarAngle = 0.05;
    c.maxPolarAngle = Math.PI * 0.64;
    c.smoothTime = 0.42;
    c.draggingSmoothTime = 0.1;
    c.azimuthRotateSpeed = 0.55;
    c.polarRotateSpeed = 0.55;
    c.dollySpeed = 0.5;
  }, []);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const [azimuth, polar] = VIEWS[family(type)][view];
    // Rings fill their sphere vertically; flatter pieces can be framed tighter.
    // The target is raised a touch so the piece sits below the overlay chips.
    const fill = { ring: 1.0, bracelet: 0.64, necklace: 1.2, earring: 0.82 }[type];
    const centre = focus.center.clone();
    centre.y += focus.radius * (type === "ring" ? 0.08 : 0.04);
    const framed = new THREE.Sphere(centre, focus.radius * fill);
    c.minDistance = focus.radius * 0.9;
    c.maxDistance = focus.radius * 7;
    c.normalizeRotations();
    void c.rotateTo(azimuth, polar, true);
    void c.fitToSphere(framed, true);
    lastInput.current = performance.now();
  }, [focus, view, type]);

  useFrame((_, delta) => {
    const c = ref.current;
    if (!c || !autoRotate || dragging.current) return;
    if (performance.now() - lastInput.current < 4000) return;
    c.rotate(delta * 0.16, 0, false);
  });

  return (
    <CameraControls
      ref={ref}
      makeDefault
      onControlStart={() => { dragging.current = true; lastInput.current = performance.now(); }}
      onControlEnd={() => { dragging.current = false; lastInput.current = performance.now(); }}
    />
  );
}
