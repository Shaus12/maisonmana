"use client";

// HDR pipeline: the scene renders in linear half-float, bloom picks up only
// values above 1.0 (the hot spots caught by facets), then neutral tone mapping.

import { Bloom, EffectComposer, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import * as THREE from "three";

export function PostFX({ bloom, multisampling }: { bloom: boolean; multisampling: number }) {
  return (
    <EffectComposer multisampling={multisampling} frameBufferType={THREE.HalfFloatType} enableNormalPass={false}>
      {bloom ? <Bloom mipmapBlur luminanceThreshold={1.05} luminanceSmoothing={0.3} intensity={0.55} radius={0.62} /> : <></>}
      <ToneMapping mode={ToneMappingMode.NEUTRAL} />
    </EffectComposer>
  );
}
