import type { DiamondShape } from "@/lib/pieces";

type Props = {
  shape: DiamondShape;
  size?: number;
  className?: string;
};

const FACET_STROKE = "oklch(0.62 0.020 240 / 0.55)";
const FACET_STROKE_SOFT = "oklch(0.70 0.020 240 / 0.35)";

// Round to 4 decimal places to keep server/client HTML identical.
const r = (n: number) => Math.round(n * 1e4) / 1e4;
const BODY_GRAD_ID_PREFIX = "diamond-body-";
const HIGHLIGHT_ID_PREFIX = "diamond-highlight-";

export function DiamondSVG({ shape, size = 200, className }: Props) {
  const id = `${BODY_GRAD_ID_PREFIX}${shape}`;
  const hid = `${HIGHLIGHT_ID_PREFIX}${shape}`;

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={`חיתוך יהלום ${shape}`}
    >
      <defs>
        <radialGradient id={id} cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="oklch(0.99 0.005 240)" />
          <stop offset="35%" stopColor="oklch(0.93 0.012 240)" />
          <stop offset="80%" stopColor="oklch(0.78 0.020 240)" />
          <stop offset="100%" stopColor="oklch(0.62 0.030 240)" />
        </radialGradient>
        <linearGradient id={hid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(1 0 0 / 0.8)" />
          <stop offset="60%" stopColor="oklch(1 0 0 / 0.1)" />
          <stop offset="100%" stopColor="oklch(1 0 0 / 0)" />
        </linearGradient>
      </defs>

      {shape === "round" && <RoundCut id={id} hid={hid} />}
      {shape === "oval" && <OvalCut id={id} hid={hid} />}
      {shape === "cushion" && <CushionCut id={id} hid={hid} />}
      {shape === "emerald" && <EmeraldCut id={id} hid={hid} />}
      {shape === "pear" && <PearCut id={id} hid={hid} />}
      {shape === "marquise" && <MarquiseCut id={id} hid={hid} />}
      {shape === "radiant" && <RadiantCut id={id} hid={hid} />}
    </svg>
  );
}

type SubProps = { id: string; hid: string };

function RoundCut({ id, hid }: SubProps) {
  return (
    <g>
      <circle cx="100" cy="100" r="78" fill={`url(#${id})`} stroke={FACET_STROKE} strokeWidth="1" />
      {/* facet lines — 8-fold rotational */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        const x = r(100 + Math.cos(a) * 78);
        const y = r(100 + Math.sin(a) * 78);
        return (
          <line
            key={i}
            x1="100" y1="100" x2={x} y2={y}
            stroke={FACET_STROKE_SOFT} strokeWidth="0.6"
          />
        );
      })}
      {/* inner star */}
      <circle cx="100" cy="100" r="30" fill="none" stroke={FACET_STROKE} strokeWidth="0.8" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
        const x1 = r(100 + Math.cos(a) * 30);
        const y1 = r(100 + Math.sin(a) * 30);
        const x2 = r(100 + Math.cos(a) * 78);
        const y2 = r(100 + Math.sin(a) * 78);
        return <line key={`o${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={FACET_STROKE_SOFT} strokeWidth="0.5" />;
      })}
      <ellipse cx="92" cy="78" rx="32" ry="14" fill={`url(#${hid})`} />
    </g>
  );
}

function OvalCut({ id, hid }: SubProps) {
  return (
    <g>
      <ellipse cx="100" cy="100" rx="58" ry="86" fill={`url(#${id})`} stroke={FACET_STROKE} strokeWidth="1" />
      <ellipse cx="100" cy="100" rx="24" ry="40" fill="none" stroke={FACET_STROKE} strokeWidth="0.7" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        const x = r(100 + Math.cos(a) * 58);
        const y = r(100 + Math.sin(a) * 86);
        return <line key={i} x1="100" y1="100" x2={x} y2={y} stroke={FACET_STROKE_SOFT} strokeWidth="0.6" />;
      })}
      <ellipse cx="92" cy="68" rx="24" ry="20" fill={`url(#${hid})`} />
    </g>
  );
}

function CushionCut({ id, hid }: SubProps) {
  return (
    <g>
      <rect x="26" y="26" width="148" height="148" rx="36" fill={`url(#${id})`} stroke={FACET_STROKE} strokeWidth="1" />
      <rect x="58" y="58" width="84" height="84" rx="14" fill="none" stroke={FACET_STROKE} strokeWidth="0.7" />
      <line x1="26" y1="26" x2="58" y2="58" stroke={FACET_STROKE_SOFT} strokeWidth="0.6" />
      <line x1="174" y1="26" x2="142" y2="58" stroke={FACET_STROKE_SOFT} strokeWidth="0.6" />
      <line x1="174" y1="174" x2="142" y2="142" stroke={FACET_STROKE_SOFT} strokeWidth="0.6" />
      <line x1="26" y1="174" x2="58" y2="142" stroke={FACET_STROKE_SOFT} strokeWidth="0.6" />
      <ellipse cx="92" cy="78" rx="30" ry="14" fill={`url(#${hid})`} />
    </g>
  );
}

function EmeraldCut({ id, hid }: SubProps) {
  return (
    <g>
      <polygon
        points="50,30 150,30 175,55 175,145 150,170 50,170 25,145 25,55"
        fill={`url(#${id})`} stroke={FACET_STROKE} strokeWidth="1"
      />
      <polygon
        points="68,52 132,52 152,72 152,128 132,148 68,148 48,128 48,72"
        fill="none" stroke={FACET_STROKE} strokeWidth="0.7"
      />
      <polygon
        points="80,72 120,72 138,90 138,110 120,128 80,128 62,110 62,90"
        fill="none" stroke={FACET_STROKE_SOFT} strokeWidth="0.6"
      />
      <rect x="60" y="48" width="60" height="22" fill={`url(#${hid})`} />
    </g>
  );
}

function PearCut({ id, hid }: SubProps) {
  return (
    <g>
      <path
        d="M100 18 C 152 18, 172 80, 172 120 C 172 156, 140 184, 100 184 C 60 184, 28 156, 28 120 C 28 80, 48 18, 100 18 Z"
        fill={`url(#${id})`} stroke={FACET_STROKE} strokeWidth="1"
      />
      <path
        d="M100 50 C 132 50, 148 96, 148 124 C 148 146, 128 162, 100 162 C 72 162, 52 146, 52 124 C 52 96, 68 50, 100 50 Z"
        fill="none" stroke={FACET_STROKE_SOFT} strokeWidth="0.7"
      />
      <line x1="100" y1="18" x2="100" y2="184" stroke={FACET_STROKE_SOFT} strokeWidth="0.5" />
      <line x1="28" y1="120" x2="172" y2="120" stroke={FACET_STROKE_SOFT} strokeWidth="0.5" />
      <ellipse cx="92" cy="60" rx="22" ry="16" fill={`url(#${hid})`} />
    </g>
  );
}

function MarquiseCut({ id, hid }: SubProps) {
  return (
    <g>
      <path
        d="M100 16 C 152 56, 162 100, 162 100 C 162 100, 152 144, 100 184 C 48 144, 38 100, 38 100 C 38 100, 48 56, 100 16 Z"
        fill={`url(#${id})`} stroke={FACET_STROKE} strokeWidth="1"
      />
      <ellipse cx="100" cy="100" rx="32" ry="60" fill="none" stroke={FACET_STROKE_SOFT} strokeWidth="0.7" />
      <line x1="100" y1="16" x2="100" y2="184" stroke={FACET_STROKE_SOFT} strokeWidth="0.5" />
      <line x1="38" y1="100" x2="162" y2="100" stroke={FACET_STROKE_SOFT} strokeWidth="0.5" />
      <ellipse cx="92" cy="60" rx="18" ry="22" fill={`url(#${hid})`} />
    </g>
  );
}

function RadiantCut({ id, hid }: SubProps) {
  return (
    <g>
      <polygon
        points="40,30 160,30 178,48 178,152 160,170 40,170 22,152 22,48"
        fill={`url(#${id})`} stroke={FACET_STROKE} strokeWidth="1"
      />
      <polygon
        points="62,52 138,52 156,70 156,130 138,148 62,148 44,130 44,70"
        fill="none" stroke={FACET_STROKE_SOFT} strokeWidth="0.7"
      />
      {/* fan facets from corners */}
      <line x1="40" y1="30" x2="62" y2="52" stroke={FACET_STROKE_SOFT} strokeWidth="0.5" />
      <line x1="160" y1="30" x2="138" y2="52" stroke={FACET_STROKE_SOFT} strokeWidth="0.5" />
      <line x1="160" y1="170" x2="138" y2="148" stroke={FACET_STROKE_SOFT} strokeWidth="0.5" />
      <line x1="40" y1="170" x2="62" y2="148" stroke={FACET_STROKE_SOFT} strokeWidth="0.5" />
      <line x1="22" y1="100" x2="178" y2="100" stroke={FACET_STROKE_SOFT} strokeWidth="0.4" />
      <line x1="100" y1="30" x2="100" y2="170" stroke={FACET_STROKE_SOFT} strokeWidth="0.4" />
      <rect x="60" y="48" width="64" height="22" fill={`url(#${hid})`} />
    </g>
  );
}
