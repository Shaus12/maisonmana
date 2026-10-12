// Lazy MediaPipe hand tracking. Runs fully on-device (WebAssembly + GPU);
// camera frames never leave the browser.

import type { HandLandmarker, HandLandmarkerResult } from "@mediapipe/tasks-vision";
import type { Landmark } from "./ringPose";

const WASM_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21/wasm";
const HAND_MODEL = "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

export interface HandFrame {
  image: Landmark[];
  /** The person's actual hand, as MediaPipe labels raw (unmirrored) frames. */
  rightHand: boolean;
}

export interface HandTracker {
  detectVideo(video: HTMLVideoElement, timeMs: number): HandFrame | null;
  detectImage(image: HTMLImageElement): Promise<HandFrame | null>;
  close(): void;
}

function firstHand(result: HandLandmarkerResult): HandFrame | null {
  if (!result.landmarks?.length) return null;
  const label = result.handedness?.[0]?.[0]?.categoryName;
  return { image: result.landmarks[0], rightHand: label === "Right" };
}

export async function createHandTracker(): Promise<HandTracker> {
  const vision = await import("@mediapipe/tasks-vision");
  const fileset = await vision.FilesetResolver.forVisionTasks(WASM_URL);
  const make = (runningMode: "VIDEO" | "IMAGE") =>
    vision.HandLandmarker.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: HAND_MODEL, delegate: "GPU" },
      runningMode,
      numHands: 1,
      minHandDetectionConfidence: 0.6,
      minHandPresenceConfidence: 0.6,
      minTrackingConfidence: 0.5,
    });

  const video = await make("VIDEO");
  let image: HandLandmarker | null = null;
  let lastTime = -1;

  return {
    detectVideo(el, timeMs) {
      // MediaPipe requires strictly increasing timestamps.
      const t = Math.max(timeMs, lastTime + 1);
      lastTime = t;
      return firstHand(video.detectForVideo(el, t));
    },
    async detectImage(el) {
      image ??= await make("IMAGE");
      return firstHand(image.detect(el));
    },
    close() {
      video.close();
      image?.close();
    },
  };
}
