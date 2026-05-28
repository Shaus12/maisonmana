import { DiamondSVG } from "./DiamondSVG";
import type { DiamondShape } from "@/lib/pieces";
import type { MetalOption, SettingOption, BandOption } from "@/lib/atelier-options";

type Props = {
  shape: DiamondShape;
  metal: MetalOption;
  setting: SettingOption["id"];
  band: BandOption["id"];
  carat: number;
  width?: number;
};

// Side-profile rendering of a ring, with the diamond crown set into the chosen
// metal band. Renders procedurally so any combination of options is valid.
export function RingSVG({ shape, metal, setting, band, carat, width = 520 }: Props) {
  const height = Math.round(width * 0.78);
  const cx = 260;
  const cy = 220;
  const bandRx = 158;
  const bandRy = 116;

  const bandWidth =
    band === "pave-band" ? 22 : band === "twisted" ? 18 : band === "knife-edge" ? 14 : 16;

  // Diamond scale by carat (visual only)
  const diamondScale = 0.7 + Math.min(carat, 4.5) * 0.18;
  const diamondSize = Math.round(96 * diamondScale);

  return (
    <svg viewBox={`0 0 520 ${height}`} width={width} height={height} role="img" aria-label="תצוגת טבעת">
      <defs>
        <radialGradient id="bandFill" cx="50%" cy="32%" r="70%">
          <stop offset="0%" stopColor={metal.glow} />
          <stop offset="55%" stopColor={metal.swatch} />
          <stop offset="100%" stopColor={metal.ring} />
        </radialGradient>
        <linearGradient id="bandSpec" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(1 0 0 / 0.5)" />
          <stop offset="55%" stopColor="oklch(1 0 0 / 0)" />
        </linearGradient>
        <linearGradient id="prongGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={metal.glow} />
          <stop offset="100%" stopColor={metal.ring} />
        </linearGradient>
        <filter id="ringSoftShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
          <feOffset dy="6" />
          <feComponentTransfer><feFuncA type="linear" slope="0.18" /></feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Spotlight pool on velvet */}
      <ellipse cx={cx} cy={cy + bandRy + 16} rx="200" ry="22" fill="oklch(0 0 0 / 0.35)" />

      {/* Outer band */}
      <g filter="url(#ringSoftShadow)">
        <ellipse
          cx={cx}
          cy={cy}
          rx={bandRx}
          ry={bandRy}
          fill="none"
          stroke="url(#bandFill)"
          strokeWidth={bandWidth}
        />
        {/* Spec highlight */}
        <path
          d={`M ${cx - bandRx + 8} ${cy} A ${bandRx - 4} ${bandRy - 4} 0 0 1 ${cx + bandRx - 8} ${cy}`}
          fill="none"
          stroke="url(#bandSpec)"
          strokeWidth={Math.max(2, bandWidth / 4)}
        />

        {band === "twisted" && (
          <path
            d={`M ${cx - bandRx + 4} ${cy + 2} A ${bandRx - 4} ${bandRy - 4} 0 0 0 ${cx + bandRx - 4} ${cy + 2}`}
            fill="none"
            stroke={metal.ring}
            strokeWidth="2"
            strokeDasharray="6 6"
            opacity="0.85"
          />
        )}

        {band === "pave-band" && (
          <g opacity="0.95">
            {Array.from({ length: 22 }).map((_, i) => {
              const t = i / 21;
              const angle = Math.PI + t * Math.PI;
              const x = cx + Math.cos(angle) * bandRx;
              const y = cy + Math.sin(angle) * bandRy;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="2.6"
                  fill="oklch(0.97 0.005 240)"
                  stroke="oklch(0.6 0.020 240 / 0.6)"
                  strokeWidth="0.4"
                />
              );
            })}
          </g>
        )}

        {band === "knife-edge" && (
          <path
            d={`M ${cx - bandRx + 6} ${cy + 1} A ${bandRx - 6} ${bandRy - 6} 0 0 0 ${cx + bandRx - 6} ${cy + 1}`}
            fill="none"
            stroke={metal.glow}
            strokeWidth="0.8"
          />
        )}
      </g>

      {/* Hidden halo — ring of micro stones beneath the crown, visible from this side */}
      {setting === "hidden-halo" && (
        <g transform={`translate(${cx} ${cy - bandRy + 8})`}>
          <ellipse rx={diamondSize / 2 + 14} ry="8" fill={metal.swatch} stroke={metal.ring} strokeWidth="0.6" />
          {Array.from({ length: 9 }).map((_, i) => {
            const t = (i + 1) / 10;
            const x = -((diamondSize / 2 + 12)) + t * (diamondSize + 24);
            return <circle key={i} cx={x} cy="0" r="2.4" fill="oklch(0.97 0.005 240)" />;
          })}
        </g>
      )}

      {/* Crown — diamond mounted above */}
      <g transform={`translate(${cx} ${cy - bandRy - diamondSize / 2 + 14})`}>
        {/* Three-stone side stones */}
        {setting === "three-stone" && (
          <>
            <g transform={`translate(-${diamondSize * 0.65}, 4)`}>
              <DiamondSVGInline shape={shape === "round" ? "round" : "round"} size={diamondSize * 0.55} />
            </g>
            <g transform={`translate(${diamondSize * 0.65}, 4)`}>
              <DiamondSVGInline shape={shape === "round" ? "round" : "round"} size={diamondSize * 0.55} />
            </g>
          </>
        )}

        {/* Bezel — full metal collar */}
        {setting === "bezel" && (
          <ellipse rx={diamondSize / 2 + 4} ry={diamondSize / 2 + 4} fill={metal.swatch} stroke={metal.ring} strokeWidth="1" />
        )}

        {/* Center stone */}
        <g transform={`translate(-${diamondSize / 2} -${diamondSize / 2})`}>
          <DiamondSVG shape={shape} size={diamondSize} />
        </g>

        {/* Prongs — for solitaire / three-stone / hidden-halo / pave */}
        {(setting === "solitaire" || setting === "three-stone" || setting === "hidden-halo" || setting === "pave") && (
          <>
            {[-1, 1].map((sx) =>
              [-1, 1].map((sy) => (
                <ellipse
                  key={`${sx}${sy}`}
                  cx={sx * (diamondSize / 2 - 3)}
                  cy={sy * (diamondSize / 2 - 3)}
                  rx="3.4"
                  ry="5"
                  fill="url(#prongGrad)"
                  stroke={metal.ring}
                  strokeWidth="0.5"
                />
              ))
            )}
          </>
        )}

        {/* Pavé shoulders */}
        {setting === "pave" && (
          <g>
            {Array.from({ length: 6 }).map((_, i) => {
              const x = -(diamondSize / 2 + 8) - i * 9;
              return <circle key={`l${i}`} cx={x} cy={diamondSize / 2 + 12} r="2.4" fill="oklch(0.97 0.005 240)" />;
            })}
            {Array.from({ length: 6 }).map((_, i) => {
              const x = (diamondSize / 2 + 8) + i * 9;
              return <circle key={`r${i}`} cx={x} cy={diamondSize / 2 + 12} r="2.4" fill="oklch(0.97 0.005 240)" />;
            })}
          </g>
        )}
      </g>
    </svg>
  );
}

// Inline helper: render the diamond at a centered offset
function DiamondSVGInline({ shape, size }: { shape: DiamondShape; size: number }) {
  return (
    <g transform={`translate(${-size / 2} ${-size / 2})`}>
      <DiamondSVG shape={shape} size={size} />
    </g>
  );
}
