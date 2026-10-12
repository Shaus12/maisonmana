"use client";

// <JewelTryOn> — live virtual try-on of a ring on the visitor's own hand.
// Full-screen, brand-agnostic (all copy via `labels`), on-device processing.
// Falls back to a hand photo when there is no camera or access is denied.

import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import type { JewelDesign } from "../core/types";
import { StudioLighting } from "../scene/StudioLighting";
import { createHandTracker, type HandTracker } from "./handTracker";
import { fitFrame } from "./ringPose";
import { TryOnScene, type TryOnSource } from "./TryOnScene";

export interface TryOnLabels {
  title: string;
  loading: string;
  hint: string;
  photoHint: string;
  noHandInPhoto: string;
  privacy: string;
  close: string;
  capture: string;
  switchCamera: string;
  uploadPhoto: string;
  cameraDenied: string;
  unsupported: string;
  modelFailed: string;
  backToCamera: string;
}

export const DEFAULT_TRYON_LABELS: TryOnLabels = {
  title: "Try it on",
  loading: "Preparing the mirror…",
  hint: "Show the back of your hand to the camera",
  photoHint: "Your photo, with the ring on",
  noHandInPhoto: "We couldn't find a hand in this photo. Try one with the back of the hand clearly visible.",
  privacy: "Processed on your device only. No image is sent anywhere.",
  close: "Close",
  capture: "Save photo",
  switchCamera: "Switch camera",
  uploadPhoto: "Use a photo",
  cameraDenied: "Camera access was blocked. You can use a photo of your hand instead.",
  unsupported: "This browser can't open the camera. You can use a photo of your hand instead.",
  modelFailed: "The hand tracker couldn't load. Check your connection and try again.",
  backToCamera: "Back to camera",
};

type Status = "loading" | "live" | "photo" | "error";

export interface JewelTryOnProps {
  design: JewelDesign;
  onClose: () => void;
  labels?: Partial<TryOnLabels>;
  /** Download file name for captured photos. */
  fileName?: string;
}

const pill: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  minHeight: 44,
  padding: "0 18px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.28)",
  background: "rgba(20,18,16,0.5)",
  color: "#fff",
  fontSize: 14,
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  cursor: "pointer",
};

export function JewelTryOn({ design, onClose, labels: custom, fileName = "try-on.png" }: JewelTryOnProps) {
  const labels = { ...DEFAULT_TRYON_LABELS, ...custom };
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const glRef = useRef<THREE.WebGLRenderer | null>(null);
  const [tracker, setTracker] = useState<HandTracker | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState(labels.loading);
  const [facing, setFacing] = useState<"environment" | "user">("environment");
  const [source, setSource] = useState<TryOnSource | null>(null);
  const [tracked, setTracked] = useState(false);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const startCamera = useCallback(async (mode: "environment" | "user") => {
    stopCamera();
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("error");
      setMessage(labels.unsupported);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: mode }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      await video.play();
      // Laptops report "user" even when asked for the rear camera.
      const actual = stream.getVideoTracks()[0]?.getSettings().facingMode;
      setFacing(actual === "user" || (!actual && mode === "user") ? "user" : "environment");
      setSource({ kind: "camera", video: videoRef });
      setStatus("live");
      setMessage(labels.hint);
    } catch (err) {
      setStatus("error");
      setMessage((err as DOMException)?.name === "NotAllowedError" ? labels.cameraDenied : labels.unsupported);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopCamera]);

  useEffect(() => {
    let cancelled = false;
    let created: HandTracker | null = null;
    createHandTracker()
      .then((t) => {
        if (cancelled) return t.close();
        created = t;
        setTracker(t);
        return startCamera("environment");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("error");
        setMessage(labels.modelFailed);
      });
    return () => {
      cancelled = true;
      stopCamera();
      created?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  async function loadPhoto(file: File) {
    if (!tracker) return;
    stopCamera();
    if (source?.kind === "photo") URL.revokeObjectURL(source.image.src);
    const image = new Image();
    image.src = URL.createObjectURL(file);
    await image.decode();
    const hand = await tracker.detectImage(image);
    setSource({ kind: "photo", image, hand });
    setStatus("photo");
    setMessage(hand ? labels.photoHint : labels.noHandInPhoto);
  }

  function capture() {
    const gl = glRef.current;
    if (!gl || !source) return;
    const w = gl.domElement.width;
    const h = gl.domElement.height;
    const out = document.createElement("canvas");
    out.width = w;
    out.height = h;
    const ctx = out.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);
    const mirrored = source.kind === "camera" && facing === "user";
    if (mirrored) {
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
    }
    const media = source.kind === "camera" ? source.video.current : source.image;
    if (media) {
      const mw = media instanceof HTMLVideoElement ? media.videoWidth : media.naturalWidth;
      const mh = media instanceof HTMLVideoElement ? media.videoHeight : media.naturalHeight;
      const fit = fitFrame(mw, mh, w, h, source.kind === "camera" ? "cover" : "contain");
      ctx.drawImage(media, fit.offsetX, fit.offsetY, mw * fit.scale, mh * fit.scale);
    }
    ctx.drawImage(gl.domElement, 0, 0);
    const link = document.createElement("a");
    link.href = out.toDataURL("image/png");
    link.download = fileName;
    link.click();
  }

  const mirrored = status === "live" && facing === "user";
  const photo = source?.kind === "photo" ? source.image : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={labels.title}
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "#0b0a09", color: "#fff", fontFamily: "inherit" }}
    >
      <div style={{ position: "absolute", inset: 0, transform: mirrored ? "scaleX(-1)" : undefined }}>
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: status === "live" ? "block" : "none" }}
        />
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo.src} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }} />
        )}
        <Canvas
          orthographic
          flat
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 2000], near: 1, far: 6000, zoom: 1 }}
          gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.NeutralToneMapping;
            gl.setClearColor(0x000000, 0);
            glRef.current = gl;
          }}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          <StudioLighting preset="daylight">
            <TryOnScene design={design} tracker={tracker} source={source} onTracking={setTracked} />
          </StudioLighting>
        </Canvas>
      </div>

      {/* Top bar */}
      <div style={{ position: "absolute", top: 0, insetInline: 0, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "max(16px, env(safe-area-inset-top)) 16px 16px" }}>
        <span style={{ fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.85 }}>{labels.title}</span>
        <button ref={closeRef} type="button" onClick={onClose} aria-label={labels.close} style={{ ...pill, width: 44, padding: 0, justifyContent: "center" }}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" /></svg>
        </button>
      </div>

      {/* Status / hint: centred while loading or on error, otherwise a caption that keeps the hand clear */}
      {(!tracked || status !== "live") && (
        <div
          role="status"
          style={status === "loading" || status === "error"
            ? { position: "absolute", top: "50%", insetInline: 24, transform: "translateY(-50%)", textAlign: "center", pointerEvents: "none" }
            : { position: "absolute", bottom: "calc(max(20px, env(safe-area-inset-bottom)) + 96px)", insetInline: 24, textAlign: "center", pointerEvents: "none" }}
        >
          <p style={{ display: "inline-block", maxWidth: 420, margin: 0, padding: "12px 18px", borderRadius: 16, background: "rgba(20,18,16,0.55)", backdropFilter: "blur(10px)", fontSize: 15, lineHeight: 1.5 }}>
            {status === "loading" ? labels.loading : message}
          </p>
        </div>
      )}

      {/* Controls */}
      <div style={{ position: "absolute", bottom: 0, insetInline: 0, padding: "16px 16px max(20px, env(safe-area-inset-bottom))", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
          {(status === "live" || status === "photo") && (
            <button type="button" onClick={capture} style={{ ...pill, background: "#fff", color: "#141210", border: "none" }}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><path d="M10 3v10m0 0l-3.5-3.5M10 13l3.5-3.5M4 15.5h12" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {labels.capture}
            </button>
          )}
          {status === "live" && (
            <button type="button" onClick={() => startCamera(facing === "user" ? "environment" : "user")} style={pill}>
              {labels.switchCamera}
            </button>
          )}
          {status === "photo" && (
            <button type="button" onClick={() => startCamera(facing)} style={pill}>{labels.backToCamera}</button>
          )}
          <button type="button" onClick={() => fileRef.current?.click()} disabled={!tracker} style={{ ...pill, opacity: tracker ? 1 : 0.5 }}>
            {labels.uploadPhoto}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void loadPhoto(file);
              e.target.value = "";
            }}
          />
        </div>
        <p style={{ margin: 0, fontSize: 12, opacity: 0.6, textAlign: "center" }}>{labels.privacy}</p>
      </div>
    </div>
  );
}
