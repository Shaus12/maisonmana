"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { PIECES } from "@/lib/pieces";
import type { Piece } from "@/lib/pieces";

type Mode = "ring" | "bracelet" | "earring" | "necklace";
type Source = "none" | "photo" | "camera";
type Detection = {
  type: Mode;
  // Coordinates in canvas pixel space
  x: number;
  y: number;
  scale: number;
  angle: number; // radians
} | null;

const MODE_LABEL: Record<Mode, { he: string; lat: string; needs: "hand" | "face" }> = {
  ring:     { he: "טבעת",   lat: "Ring",     needs: "hand" },
  bracelet: { he: "צמיד",   lat: "Bracelet", needs: "hand" },
  earring:  { he: "עגיל",   lat: "Earring",  needs: "face" },
  necklace: { he: "שרשרת",  lat: "Necklace", needs: "face" },
};

// Pieces filtered per mode (from catalog)
const PIECES_BY_MODE: Record<Mode, Piece[]> = {
  ring:     PIECES.filter((p) => p.collection === "engagement" || p.collection === "wedding-bands"),
  bracelet: PIECES.filter((p) => p.collection === "tennis-bracelets"),
  earring:  PIECES.filter((p) => p.collection === "diamond-earrings"),
  necklace: PIECES.filter((p) => p.collection === "solitaire-necklaces"),
};

const WASM_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21/wasm";
const HAND_MODEL = "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";
const FACE_MODEL = "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

export function Mirror() {
  const [mode, setMode] = useState<Mode>("ring");
  const [piece, setPiece] = useState<Piece>(PIECES_BY_MODE.ring[0]);
  const [source, setSource] = useState<Source>("none");
  const [status, setStatus] = useState<string>("");
  const [detection, setDetection] = useState<Detection>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  // Lazy-loaded MediaPipe landmarker references
  const handRef = useRef<any>(null);
  const faceRef = useRef<any>(null);

  // Reset piece when switching mode
  useEffect(() => {
    setPiece(PIECES_BY_MODE[mode][0]);
    setDetection(null);
  }, [mode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }

  async function ensureLandmarker(kind: "hand" | "face") {
    const vision = await import("@mediapipe/tasks-vision");
    const fileset = await vision.FilesetResolver.forVisionTasks(WASM_URL);

    if (kind === "hand" && !handRef.current) {
      handRef.current = await vision.HandLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: HAND_MODEL, delegate: "GPU" },
        runningMode: "IMAGE",
        numHands: 2,
      });
    }
    if (kind === "face" && !faceRef.current) {
      faceRef.current = await vision.FaceLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: FACE_MODEL, delegate: "GPU" },
        runningMode: "IMAGE",
        outputFaceBlendshapes: false,
        numFaces: 1,
      });
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    stopCamera();
    setSource("photo");
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("טוען צילום…");
    const url = URL.createObjectURL(file);
    setImgUrl(url);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = async () => {
      await renderImageToCanvas(img);
      await detectAndOverlay(img);
    };
    img.src = url;
  }

  async function startCamera() {
    setCameraError(null);
    setSource("camera");
    setStatus("מבקש גישה למצלמה…");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 960 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStatus("המראה פעילה — הכניסי את היד או הפנים למסגרת.");
        runCameraLoop();
      }
    } catch (err: any) {
      setCameraError(err?.message ?? "הגישה למצלמה נדחתה.");
      setSource("none");
      setStatus("");
    }
  }

  async function runCameraLoop() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    try {
      await ensureLandmarker(MODE_LABEL[mode].needs);
    } catch (e) {
      setStatus("טעינת מודל הזיהוי נכשלה. נסי לרענן.");
      return;
    }

    const tick = async () => {
      if (!video || video.readyState < 2 || !streamRef.current) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const w = video.videoWidth;
      const h = video.videoHeight;
      canvas.width = w;
      canvas.height = h;
      // Mirror the video horizontally (selfie convention)
      ctx.save();
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, w, h);
      ctx.restore();

      try {
        const needs = MODE_LABEL[mode].needs;
        if (needs === "hand" && handRef.current) {
          const r = handRef.current.detect(video);
          const det = handLandmarksToDetection(r, mode, w, h, /*mirrored*/ true);
          if (det) drawOverlay(ctx, det, piece);
          setDetection(det);
        } else if (needs === "face" && faceRef.current) {
          const r = faceRef.current.detect(video);
          const det = faceLandmarksToDetection(r, mode, w, h, /*mirrored*/ true);
          if (det) drawOverlay(ctx, det, piece);
          setDetection(det);
        }
      } catch {}

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }

  async function renderImageToCanvas(img: HTMLImageElement) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const maxW = 1200;
    const ratio = Math.min(1, maxW / img.naturalWidth);
    canvas.width = Math.round(img.naturalWidth * ratio);
    canvas.height = Math.round(img.naturalHeight * ratio);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }

  async function detectAndOverlay(img: HTMLImageElement) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setStatus("מזהה נקודות…");
    try {
      const needs = MODE_LABEL[mode].needs;
      await ensureLandmarker(needs);
      let det: Detection = null;
      if (needs === "hand") {
        const r = handRef.current.detect(img);
        det = handLandmarksToDetection(r, mode, canvas.width, canvas.height, false);
      } else {
        const r = faceRef.current.detect(img);
        det = faceLandmarksToDetection(r, mode, canvas.width, canvas.height, false);
      }
      setDetection(det);
      if (!det) {
        setStatus(
          needs === "hand"
            ? "לא זוהתה יד בצילום. נסי צילום ברור יותר של היד או הפרק."
            : "לא זוהו פנים בצילום. נסי צילום ברור יותר של הצוואר או האוזניים."
        );
        return;
      }
      drawOverlay(ctx, det, piece);
      setStatus("");
    } catch (e) {
      setStatus("הזיהוי נכשל. נסי צילום אחר או רעני את העמוד.");
    }
  }

  // Re-render overlay when piece changes (for static photos)
  useEffect(() => {
    if (source !== "photo" || !imgUrl) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = async () => {
      await renderImageToCanvas(img);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx || !detection) return;
      drawOverlay(ctx, detection, piece);
    };
    img.src = imgUrl;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [piece]);

  function capture() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `maison-mana-mirror-${Date.now()}.jpg`;
    link.href = canvas.toDataURL("image/jpeg", 0.92);
    link.click();
  }

  const pieceList = useMemo(() => PIECES_BY_MODE[mode], [mode]);

  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-[1440px] px-6 pb-10 md:px-12">
        {/* Mode tabs */}
        <div className="mb-6 flex flex-wrap items-center gap-2 border-y border-rule">
          {(Object.keys(MODE_LABEL) as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`relative px-5 py-4 transition-colors duration-[280ms] ${
                mode === m ? "text-ink" : "text-ink-mute hover:text-ink-soft"
              }`}
            >
              <span className="display-he text-[1.125rem]">{MODE_LABEL[m].he}</span>
              {mode === m && <span aria-hidden className="absolute inset-x-5 bottom-0 h-px bg-brass" />}
            </button>
          ))}
          <div className="ms-auto hidden text-[0.6875rem] tracking-[0.18em] uppercase text-ink-mute md:block display-lat">
            Mirror · {MODE_LABEL[mode].lat}
          </div>
        </div>

        {/* Viewport */}
        <div className="relative bg-velvet" style={{ minHeight: "60vh" }}>
          {/* corner brackets */}
          <Bracket position="top-start" />
          <Bracket position="top-end" />
          <Bracket position="bottom-start" />
          <Bracket position="bottom-end" />

          <div className="relative flex items-center justify-center p-6 md:p-10">
            <canvas
              ref={canvasRef}
              className="block max-h-[70vh] w-auto max-w-full"
              style={{ display: source === "none" ? "none" : "block" }}
            />
            {source === "camera" && (
              <video ref={videoRef} className="hidden" playsInline muted aria-hidden />
            )}

            {source === "none" && <EmptyState onPhoto={() => fileInputRef.current?.click()} onCamera={startCamera} />}
          </div>

          {/* Status strip */}
          {status && (
            <div className="absolute inset-x-0 bottom-0 border-t border-paper/20 bg-velvet/95 px-6 py-3 text-center text-[0.8125rem] text-paper/85">
              {status}
            </div>
          )}
          {cameraError && (
            <div className="absolute inset-x-0 bottom-0 border-t border-paper/20 bg-velvet/95 px-6 py-3 text-center text-[0.8125rem] text-paper/85">
              {cameraError}. נסי להעלות צילום במקום.
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />

        {/* Piece carousel */}
        {source !== "none" && (
          <div className="mt-10">
            <p className="section-label mb-4">בחירת יצירה</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {pieceList.map((p) => (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => setPiece(p)}
                  className={`group relative aspect-[4/5] overflow-hidden border transition-colors duration-[280ms] ${
                    piece.slug === p.slug ? "border-brass" : "border-rule hover:border-ink-mute"
                  }`}
                  aria-pressed={piece.slug === p.slug}
                >
                  <img src={p.image} alt={p.imageAlt} className="absolute inset-0 h-full w-full object-cover" />
                  <span className="absolute inset-x-0 bottom-0 bg-ink/70 px-2 py-1 text-end text-[0.6875rem] text-paper">
                    {p.nameHe}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-rule pt-8">
          <button type="button" onClick={() => fileInputRef.current?.click()} className="brass-disc">
            העלאת צילום
          </button>
          <button type="button" onClick={startCamera} className="brass-disc">
            הפעלת מצלמה
          </button>
          {source !== "none" && (
            <>
              <button type="button" onClick={capture} className="brass-disc brass-disc--solid">
                שמירת הצילום
              </button>
              <Link href="/inquiry" className="hairline-link text-[0.9375rem]">
                לקביעת פגישה לצפייה אמיתית
              </Link>
              <button
                type="button"
                onClick={() => { stopCamera(); setSource("none"); setImgUrl(null); setDetection(null); setStatus(""); }}
                className="ms-auto hairline-link text-[0.8125rem] text-ink-mute"
              >
                איפוס המראה
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onPhoto, onCamera }: { onPhoto: () => void; onCamera: () => void }) {
  return (
    <div className="flex flex-col items-center gap-8 py-24 text-center text-paper">
      <p className="display-he text-[2rem] leading-tight md:text-[2.5rem]">המראה ריקה.</p>
      <p className="max-w-md text-paper/80 text-[1rem]">העלי צילום שלך — של היד, הצוואר או האוזן — או הפעילי את המצלמה כדי לראות את היצירה במקומה.</p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button onClick={onPhoto} className="brass-disc" style={{ color: "oklch(0.985 0.004 75)", borderColor: "oklch(0.88 0.060 82)" }}>
          העלאת צילום
        </button>
        <button onClick={onCamera} className="brass-disc" style={{ color: "oklch(0.985 0.004 75)", borderColor: "oklch(0.88 0.060 82)" }}>
          הפעלת מצלמה
        </button>
      </div>
    </div>
  );
}

function Bracket({ position }: { position: "top-start" | "top-end" | "bottom-start" | "bottom-end" }) {
  const base = "absolute z-10 h-6 w-6";
  const color = "oklch(0.88 0.060 82)";
  const style: React.CSSProperties = {};
  if (position.startsWith("top")) style.top = "12px";
  if (position.startsWith("bottom")) style.bottom = "12px";
  if (position.endsWith("start")) style.insetInlineStart = "12px";
  if (position.endsWith("end")) style.insetInlineEnd = "12px";

  const borders: React.CSSProperties =
    position === "top-start"    ? { borderTop: `1px solid ${color}`, borderInlineStart: `1px solid ${color}` } :
    position === "top-end"      ? { borderTop: `1px solid ${color}`, borderInlineEnd: `1px solid ${color}` } :
    position === "bottom-start" ? { borderBottom: `1px solid ${color}`, borderInlineStart: `1px solid ${color}` } :
                                  { borderBottom: `1px solid ${color}`, borderInlineEnd: `1px solid ${color}` };

  return <span aria-hidden className={base} style={{ ...style, ...borders }} />;
}

// ---------- Detection helpers ----------

function handLandmarksToDetection(
  result: any,
  mode: Mode,
  w: number,
  h: number,
  mirrored: boolean,
): Detection {
  if (!result?.landmarks?.length) return null;
  const lm = result.landmarks[0];
  const toPx = (i: number) => ({
    x: mirrored ? (1 - lm[i].x) * w : lm[i].x * w,
    y: lm[i].y * h,
  });
  if (mode === "ring") {
    const a = toPx(13); // ring MCP
    const b = toPx(14); // ring PIP
    const c = toPx(15); // ring DIP
    const mid = { x: (b.x + c.x) / 2, y: (b.y + c.y) / 2 };
    const angle = Math.atan2(c.y - a.y, c.x - a.x) + Math.PI / 2;
    const len = Math.hypot(c.x - a.x, c.y - a.y);
    // ring scale is roughly the perpendicular finger width — approx 0.45 of segment length
    const scale = len * 0.85;
    return { type: "ring", x: mid.x, y: mid.y, angle, scale };
  }
  if (mode === "bracelet") {
    const wrist = toPx(0);
    const middle = toPx(9);
    const angle = Math.atan2(middle.y - wrist.y, middle.x - wrist.x) + Math.PI / 2;
    const armWidth = Math.hypot(middle.x - wrist.x, middle.y - wrist.y) * 0.9;
    return { type: "bracelet", x: wrist.x, y: wrist.y, angle, scale: armWidth };
  }
  return null;
}

function faceLandmarksToDetection(
  result: any,
  mode: Mode,
  w: number,
  h: number,
  mirrored: boolean,
): Detection {
  if (!result?.faceLandmarks?.length) return null;
  const lm = result.faceLandmarks[0];
  const toPx = (i: number) => ({
    x: mirrored ? (1 - lm[i].x) * w : lm[i].x * w,
    y: lm[i].y * h,
  });
  // 234 — right ear contour, 454 — left ear contour, 152 — chin tip,
  // 10 — forehead top, 168 — between brows. Use 234/454 for earrings; 152 + below for necklace.
  if (mode === "earring") {
    const earR = toPx(234);
    const earL = toPx(454);
    // We pick the closer ear to mid; but for display, two earrings would be ideal.
    // Return left ear's position; caller draws two by mirroring.
    const headW = Math.hypot(earL.x - earR.x, earL.y - earR.y);
    const angle = 0;
    return { type: "earring", x: earL.x, y: earL.y + 18, angle, scale: headW * 0.08, /* anchor at left ear */ };
  }
  if (mode === "necklace") {
    const chin = toPx(152);
    const earR = toPx(234);
    const earL = toPx(454);
    const headW = Math.hypot(earL.x - earR.x, earL.y - earR.y);
    return {
      type: "necklace",
      x: chin.x,
      y: chin.y + headW * 0.55,
      angle: 0,
      scale: headW,
    };
  }
  return null;
}

// ---------- Drawing ----------

function drawOverlay(ctx: CanvasRenderingContext2D, det: NonNullable<Detection>, piece: Piece) {
  ctx.save();
  ctx.translate(det.x, det.y);
  ctx.rotate(det.angle);

  if (det.type === "ring") drawRing(ctx, det.scale, piece);
  if (det.type === "bracelet") drawBracelet(ctx, det.scale, piece);
  if (det.type === "earring") {
    ctx.restore();
    // earrings — draw two (left + mirror to right around face center)
    drawEarringAt(ctx, det.x, det.y, det.scale, piece);
    return;
  }
  if (det.type === "necklace") drawNecklace(ctx, det.scale, piece);

  ctx.restore();
}

function metalFillForPiece(piece: Piece): { stroke: string; fill: string; glow: string } {
  const m = piece.metal;
  if (m === "yellow-gold") return { fill: "oklch(0.84 0.130 85)", stroke: "oklch(0.62 0.110 75)", glow: "oklch(0.94 0.090 90)" };
  if (m === "rose-gold")   return { fill: "oklch(0.82 0.080 35)", stroke: "oklch(0.60 0.075 30)", glow: "oklch(0.92 0.070 40)" };
  if (m === "white-gold")  return { fill: "oklch(0.92 0.005 240)", stroke: "oklch(0.68 0.010 240)", glow: "oklch(0.98 0.005 240)" };
  return                   { fill: "oklch(0.89 0.005 250)", stroke: "oklch(0.65 0.008 250)", glow: "oklch(0.97 0.004 250)" };
}

function drawRing(ctx: CanvasRenderingContext2D, scale: number, piece: Piece) {
  const m = metalFillForPiece(piece);
  const bandH = Math.max(6, scale * 0.18);
  const ringW = Math.max(40, scale * 1.05);
  // The band (ellipse approximating finger wrap)
  ctx.lineWidth = bandH;
  ctx.strokeStyle = m.fill;
  ctx.beginPath();
  ctx.ellipse(0, 0, ringW / 2, bandH / 1.4, 0, 0, Math.PI * 2);
  ctx.stroke();
  // highlight
  ctx.lineWidth = bandH * 0.35;
  ctx.strokeStyle = m.glow;
  ctx.beginPath();
  ctx.ellipse(0, -bandH * 0.18, ringW / 2 - 1, bandH / 2, 0, Math.PI, 0);
  ctx.stroke();
  // crown / stone
  const stoneR = Math.max(8, scale * 0.32);
  drawDiamondCircle(ctx, 0, -bandH - stoneR * 0.35, stoneR, piece);
}

function drawBracelet(ctx: CanvasRenderingContext2D, scale: number, piece: Piece) {
  const m = metalFillForPiece(piece);
  const w = Math.max(80, scale * 1.4);
  const h = Math.max(10, scale * 0.22);
  // back band (darker tone)
  ctx.lineWidth = h;
  ctx.strokeStyle = m.fill;
  ctx.beginPath();
  ctx.ellipse(0, 0, w / 2, h / 1.2, 0, 0, Math.PI * 2);
  ctx.stroke();
  // bezel stones along front
  const count = 11;
  for (let i = 0; i < count; i++) {
    const t = (i + 1) / (count + 1);
    const x = -w / 2 + t * w;
    const y = h * 0.18;
    drawDiamondCircle(ctx, x, y, h * 0.55, piece);
  }
}

function drawEarringAt(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, piece: Piece) {
  // Draw two earrings — left ear position, and mirror across vertical center of canvas
  const cw = ctx.canvas.width;
  const mirrorX = cw - x; // approximate symmetric position
  drawSingleEarring(ctx, x, y, scale, piece);
  drawSingleEarring(ctx, mirrorX, y, scale, piece);
}

function drawSingleEarring(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, piece: Piece) {
  // Stud-style or hoop-style based on setting
  const r = Math.max(8, scale * 1.6);
  if (piece.setting === "hoop") {
    const m = metalFillForPiece(piece);
    ctx.lineWidth = r * 0.18;
    ctx.strokeStyle = m.fill;
    ctx.beginPath();
    ctx.arc(x, y + r, r, 0, Math.PI * 2);
    ctx.stroke();
    // micro stones around
    const count = 10;
    for (let i = 0; i < count; i++) {
      const a = Math.PI / 2 + (i - count / 2) * (Math.PI / count);
      const px = x + Math.cos(a) * r;
      const py = y + r + Math.sin(a) * r;
      drawDiamondCircle(ctx, px, py, r * 0.13, piece);
    }
  } else {
    drawDiamondCircle(ctx, x, y + r, r, piece);
  }
}

function drawNecklace(ctx: CanvasRenderingContext2D, scale: number, piece: Piece) {
  const m = metalFillForPiece(piece);
  const w = Math.max(140, scale * 1.6);
  const drop = Math.max(40, scale * 0.5);
  // Chain — curve from upper left to upper right via lowest center point
  ctx.strokeStyle = m.fill;
  ctx.lineWidth = Math.max(1.4, scale * 0.012);
  ctx.beginPath();
  ctx.moveTo(-w / 2, -drop);
  ctx.quadraticCurveTo(0, drop * 0.4, w / 2, -drop);
  ctx.stroke();
  // Pendant — solitaire diamond
  drawDiamondCircle(ctx, 0, drop * 0.36, Math.max(10, scale * 0.10), piece);
}

function drawDiamondCircle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, piece: Piece) {
  // body — radial white
  const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
  g.addColorStop(0, "oklch(1 0 0)");
  g.addColorStop(0.6, "oklch(0.93 0.010 240)");
  g.addColorStop(1, "oklch(0.72 0.025 240)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  // facet lines
  ctx.strokeStyle = "oklch(0.55 0.025 240 / 0.55)";
  ctx.lineWidth = Math.max(0.5, r * 0.04);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
    ctx.stroke();
  }
  // sparkle
  ctx.fillStyle = "oklch(1 0 0 / 0.85)";
  ctx.beginPath();
  ctx.ellipse(x - r * 0.3, y - r * 0.35, r * 0.28, r * 0.12, -0.6, 0, Math.PI * 2);
  ctx.fill();
}
