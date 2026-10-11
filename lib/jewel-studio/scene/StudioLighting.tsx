"use client";

// A procedural photo studio rendered once into an HDR cube map: dark cyclorama,
// large softboxes and small hot spots. Diamonds read their brilliance from this
// map (contrast between dark surround and bright cards) and metals reflect it.
// No image assets — nothing to license when the studio is resold.

import { createContext, useContext, useLayoutEffect, useState, type ReactNode } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export type LightingPreset = "studio" | "salon";

const EnvContext = createContext<THREE.CubeTexture | null>(null);
export const useStudioEnv = () => useContext(EnvContext);

const linear = (v: number) => new THREE.Color().setRGB(v, v, v, THREE.LinearSRGBColorSpace);

function cyclorama(top: number, horizon: number, bottom: number) {
  const material = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: { top: { value: linear(top) }, horizon: { value: linear(horizon) }, bottom: { value: linear(bottom) } },
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() { vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform vec3 top; uniform vec3 horizon; uniform vec3 bottom;
      varying vec3 vDir;
      void main() {
        float h = vDir.y;
        vec3 c = h > 0.0 ? mix(horizon, top, pow(h, 0.7)) : mix(horizon, bottom, pow(-h, 0.45));
        gl_FragColor = vec4(c, 1.0);
      }`,
  });
  return new THREE.Mesh(new THREE.SphereGeometry(60, 48, 24), material);
}

function softbox(scene: THREE.Scene, size: [number, number], position: [number, number, number], intensity: number, color = "#fff6ec", disc = false) {
  const geometry = disc ? new THREE.CircleGeometry(size[0], 32) : new THREE.PlaneGeometry(size[0], size[1]);
  const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.lookAt(0, 0, 0);
  scene.add(mesh);
}

function flag(scene: THREE.Scene, size: [number, number], position: [number, number, number]) {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(size[0], size[1]),
    new THREE.MeshBasicMaterial({ color: linear(0.004), side: THREE.DoubleSide }),
  );
  mesh.position.set(...position);
  mesh.lookAt(0, 0, 0);
  scene.add(mesh);
}

/** Light-tent for metal: bright sweep, black flags cut the lines that define its form. */
function buildMetalStudio(preset: LightingPreset) {
  const scene = new THREE.Scene();
  const warm = preset === "salon";
  scene.add(cyclorama(warm ? 0.95 : 0.85, warm ? 0.5 : 0.42, 0.14));
  flag(scene, [7, 11], [-19, 0, -5]);
  flag(scene, [7, 11], [19, -1, -8]);
  flag(scene, [22, 3.5], [0, 1.5, -21]);
  flag(scene, [4, 9], [-6, -2, 19]);
  flag(scene, [18, 6], [0, -16, 4]);
  const tone = warm ? "#ffeedd" : "#fff6ec";
  softbox(scene, [16, 16], [0, 20, 0], warm ? 2.4 : 2.0, tone);
  softbox(scene, [5, 18], [-16, 5, 10], 5.2, tone);
  softbox(scene, [5, 18], [16, 5, 10], 4.2, tone);
  softbox(scene, [3, 16], [-10, 4, -16], 3.4);
  softbox(scene, [3, 16], [10, 4, -16], 3.4);
  softbox(scene, [14, 5], [0, 3, 20], warm ? 1.5 : 1.1, tone);
  return scene;
}

/**
 * Gem studio: near-black surround with a ring of softboxes at mid elevation
 * and a dark zenith (the viewer's obstruction). Light returning face-up
 * alternates between cards and darkness — the black/white facet mosaic.
 * Tiny hot spots far above 1.0 become the sparkle picked up by bloom.
 */
function buildGemStudio(preset: LightingPreset) {
  const scene = new THREE.Scene();
  const warm = preset === "salon";
  scene.add(cyclorama(0.16, 0.14, 0.02));
  const tone = warm ? "#fff0e0" : "#ffffff";
  const r = 20;
  const ring = (count: number, elevation: (i: number) => number, size: [number, number], intensity: (i: number) => number, phase = 0) => {
    for (let i = 0; i < count; i++) {
      const a = ((i + phase) / count) * Math.PI * 2;
      const e = elevation(i);
      softbox(scene, size, [Math.cos(a) * r * Math.cos(e), r * Math.sin(e), Math.sin(a) * r * Math.cos(e)], intensity(i), tone);
    }
  };
  ring(12, (i) => (i % 2 ? 0.42 : 0.78), [7, 10], (i) => (i % 2 ? 4 : 7));
  // Low ring: oblique views (a step-cut table seen from the side) catch light too.
  ring(8, () => 0.1, [6, 4], () => 3, 0.5);
  softbox(scene, [6, 6], [0, 20, 0], 1.6, tone); // dim zenith keeps a small dark obstruction
  softbox(scene, [4, 16], [-18, 2, 6], 4.5, tone);
  softbox(scene, [4, 16], [18, 2, 6], 4.5, tone);
  softbox(scene, [20, 3], [0, -5, -18], 1.4);
  softbox(scene, [20, 3], [0, -5, 18], 1.2);
  const spots: [number, number, number][] = [
    [7, 14, 8], [-7, 14, 8], [12, 9, -6], [-12, 9, -6], [0, 12, -12],
    [4, 17, -3], [-4, 17, -3], [0, 9, 15], [14, 13, 4], [-14, 12, 2],
  ];
  spots.forEach((p) => softbox(scene, [0.6, 0.6], p, 30, "#ffffff", true));
  return scene;
}

function renderCube(gl: THREE.WebGLRenderer, studio: THREE.Scene, size: number) {
  const target = new THREE.WebGLCubeRenderTarget(size, {
    type: THREE.HalfFloatType,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
    magFilter: THREE.LinearFilter,
  });
  new THREE.CubeCamera(0.1, 200, target).update(gl, studio);
  studio.traverse((o) => {
    if (o instanceof THREE.Mesh) {
      o.geometry.dispose();
      (o.material as THREE.Material).dispose();
    }
  });
  return target;
}

export function StudioLighting({ preset = "studio", children }: { preset?: LightingPreset; children: ReactNode }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const [texture, setTexture] = useState<THREE.CubeTexture | null>(null);

  useLayoutEffect(() => {
    const metalEnv = renderCube(gl, buildMetalStudio(preset), 256);
    const gemEnv = renderCube(gl, buildGemStudio(preset), 512);
    scene.environment = metalEnv.texture;
    setTexture(gemEnv.texture);
    return () => {
      if (scene.environment === metalEnv.texture) scene.environment = null;
      metalEnv.dispose();
      gemEnv.dispose();
    };
  }, [gl, scene, preset]);

  return <EnvContext.Provider value={texture}>{texture ? children : null}</EnvContext.Provider>;
}
