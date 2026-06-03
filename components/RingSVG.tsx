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

  let bandWidth = 16;
  if (["pave-band", "split-shank", "twisted-pave", "scalloped-pave", "vintage-scroll"].includes(band)) bandWidth = 22;
  else if (["braided", "double-band"].includes(band)) bandWidth = 26;
  else if (["infinity", "vine", "channel-set", "concave", "convex", "rope"].includes(band)) bandWidth = 20;
  else if (["twisted", "bypass", "milgrain", "beaded", "hammered"].includes(band)) bandWidth = 18;
  else if (["knife-edge"].includes(band)) bandWidth = 14;

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

        {/* --- DYNAMIC BAND DETAILS --- */}
        {band === "twisted" && (
          <path d={`M ${cx - bandRx + 4} ${cy + 2} A ${bandRx - 4} ${bandRy - 4} 0 0 0 ${cx + bandRx - 4} ${cy + 2}`} fill="none" stroke={metal.ring} strokeWidth="2" strokeDasharray="6 6" opacity="0.85" />
        )}

        {(band === "pave-band" || band === "twisted-pave" || band === "channel-set" || band === "scalloped-pave") && (
          <g opacity="0.95">
            {band === "channel-set" && (
               <>
                 <ellipse cx={cx} cy={cy} rx={bandRx - bandWidth/2 + 2} ry={bandRy - bandWidth/2 + 2} fill="none" stroke={metal.glow} strokeWidth="1.5" />
                 <ellipse cx={cx} cy={cy} rx={bandRx + bandWidth/2 - 2} ry={bandRy + bandWidth/2 - 2} fill="none" stroke={metal.glow} strokeWidth="1.5" />
               </>
            )}
            {band === "twisted-pave" && (
               <path d={`M ${cx - bandRx + 4} ${cy + 2} A ${bandRx - 4} ${bandRy - 4} 0 0 0 ${cx + bandRx - 4} ${cy + 2}`} fill="none" stroke={metal.ring} strokeWidth="3" strokeDasharray="8 8" opacity="0.85" />
            )}
            {Array.from({ length: 26 }).map((_, i) => {
              const t = i / 25;
              const angle = Math.PI + t * Math.PI;
              const x = cx + Math.cos(angle) * bandRx;
              const y = cy + Math.sin(angle) * bandRy;
              if (y > cy + 20) return null; // Don't draw stones at the very bottom
              return (
                <circle key={i} cx={x} cy={y} r={band === "scalloped-pave" ? "3" : "2.6"} fill="oklch(0.97 0.005 240)" stroke="oklch(0.6 0.020 240 / 0.6)" strokeWidth="0.4" />
              );
            })}
          </g>
        )}

        {band === "knife-edge" && (
          <path d={`M ${cx - bandRx + 6} ${cy + 1} A ${bandRx - 6} ${bandRy - 6} 0 0 0 ${cx + bandRx - 6} ${cy + 1}`} fill="none" stroke={metal.glow} strokeWidth="0.8" />
        )}

        {band === "double-band" && (
          <ellipse cx={cx} cy={cy} rx={bandRx} ry={bandRy} fill="none" stroke="oklch(0 0 0 / 0.5)" strokeWidth="3" />
        )}

        {band === "milgrain" && (
          <>
            <ellipse cx={cx} cy={cy} rx={bandRx - bandWidth/2 + 1.5} ry={bandRy - bandWidth/2 + 1.5} fill="none" stroke={metal.ring} strokeWidth="1.5" strokeDasharray="2 2" />
            <ellipse cx={cx} cy={cy} rx={bandRx + bandWidth/2 - 1.5} ry={bandRy + bandWidth/2 - 1.5} fill="none" stroke={metal.ring} strokeWidth="1.5" strokeDasharray="2 2" />
          </>
        )}

        {band === "beaded" && (
          <ellipse cx={cx} cy={cy} rx={bandRx} ry={bandRy} fill="none" stroke={metal.glow} strokeWidth="6" strokeDasharray="0 10" strokeLinecap="round" opacity="0.6" />
        )}

        {band === "rope" && (
          <ellipse cx={cx} cy={cy} rx={bandRx} ry={bandRy} fill="none" stroke="oklch(0 0 0 / 0.25)" strokeWidth="4" strokeDasharray="6 4" />
        )}

        {band === "infinity" && (
          <ellipse cx={cx} cy={cy} rx={bandRx} ry={bandRy} fill="none" stroke={metal.glow} strokeWidth="2" strokeDasharray="15 15" opacity="0.6" />
        )}

        {band === "braided" && (
          <>
            <ellipse cx={cx} cy={cy} rx={bandRx} ry={bandRy} fill="none" stroke="oklch(0 0 0 / 0.2)" strokeWidth="4" strokeDasharray="12 12" />
            <ellipse cx={cx} cy={cy} rx={bandRx} ry={bandRy} fill="none" stroke={metal.glow} strokeWidth="2" strokeDasharray="12 12" strokeDashoffset="6" />
          </>
        )}

        {band === "hammered" && (
           <ellipse cx={cx} cy={cy} rx={bandRx} ry={bandRy} fill="none" stroke={metal.glow} strokeWidth="4" strokeDasharray="5 15 10 5 20 10" opacity="0.4" />
        )}

        {band === "concave" && (
           <ellipse cx={cx} cy={cy} rx={bandRx} ry={bandRy} fill="none" stroke="oklch(0 0 0 / 0.15)" strokeWidth="6" />
        )}

        {band === "convex" && (
           <ellipse cx={cx} cy={cy} rx={bandRx} ry={bandRy} fill="none" stroke={metal.glow} strokeWidth="6" opacity="0.4" />
        )}

        {band === "split-shank" && (
          <path d={`M ${cx - bandRx} ${cy} Q ${cx - bandRx + 10} ${cy - bandRy/2} ${cx - 15} ${cy - bandRy} 
                   M ${cx + bandRx} ${cy} Q ${cx + bandRx - 10} ${cy - bandRy/2} ${cx + 15} ${cy - bandRy}`} 
                fill="none" stroke="oklch(0 0 0 / 0.6)" strokeWidth="3" />
        )}

        {band === "bypass" && (
          <path d={`M ${cx - 30} ${cy - bandRy + 15} C ${cx - 10} ${cy - bandRy + 5} ${cx} ${cy - bandRy - 10} ${cx + 15} ${cy - bandRy - 15}
                   M ${cx + 30} ${cy - bandRy + 15} C ${cx + 10} ${cy - bandRy + 5} ${cx} ${cy - bandRy - 10} ${cx - 15} ${cy - bandRy - 15}`} 
                fill="none" stroke="oklch(0 0 0 / 0.5)" strokeWidth="3" />
        )}

        {band === "tapered" && (
           <path d={`M ${cx - 20} ${cy - bandRy - 10} L ${cx - 10} ${cy - bandRy + 20} L ${cx - 40} ${cy - bandRy + 20} Z
                    M ${cx + 20} ${cy - bandRy - 10} L ${cx + 10} ${cy - bandRy + 20} L ${cx + 40} ${cy - bandRy + 20} Z`} 
                 fill="oklch(0 0 0 / 0.2)" />
        )}

        {band === "reverse-tapered" && (
           <path d={`M ${cx - 20} ${cy - bandRy + 20} L ${cx - 10} ${cy - bandRy - 10} L ${cx - 30} ${cy - bandRy - 10} Z
                    M ${cx + 20} ${cy - bandRy + 20} L ${cx + 10} ${cy - bandRy - 10} L ${cx + 30} ${cy - bandRy - 10} Z`} 
                 fill="oklch(0 0 0 / 0.2)" />
        )}

        {band === "chevron" && (
           <path d={`M ${cx - 20} ${cy - bandRy + 10} L ${cx} ${cy - bandRy + 25} L ${cx + 20} ${cy - bandRy + 10}`} 
                 fill="none" stroke={metal.glow} strokeWidth="3" />
        )}

        {band === "vine" && (
          <g opacity="0.8">
            <ellipse cx={cx} cy={cy} rx={bandRx} ry={bandRy} fill="none" stroke={metal.ring} strokeWidth="2" strokeDasharray="20 10" />
            {Array.from({ length: 12 }).map((_, i) => {
              const t = i / 11;
              const angle = Math.PI + t * Math.PI;
              const x = cx + Math.cos(angle) * (bandRx - 2);
              const y = cy + Math.sin(angle) * (bandRy - 2);
              return <ellipse key={i} cx={x} cy={y} rx="4" ry="2" fill={metal.glow} transform={`rotate(${angle * 180 / Math.PI} ${x} ${y})`} />;
            })}
          </g>
        )}

        {band === "euro-shank" && (
           <path d={`M ${cx - bandRx + 10} ${cy + bandRy - 20} L ${cx - 20} ${cy + bandRy + 10} L ${cx + 20} ${cy + bandRy + 10} L ${cx + bandRx - 10} ${cy + bandRy - 20}`} 
                 fill="none" stroke="url(#bandFill)" strokeWidth={bandWidth} strokeLinejoin="round" />
        )}

        {band === "vintage-scroll" && (
          <g opacity="0.7">
             <ellipse cx={cx} cy={cy} rx={bandRx} ry={bandRy} fill="none" stroke="oklch(0 0 0 / 0.4)" strokeWidth="1" strokeDasharray="3 3" />
             {Array.from({ length: 16 }).map((_, i) => {
                const t = i / 15;
                const angle = Math.PI + t * Math.PI;
                const x = cx + Math.cos(angle) * bandRx;
                const y = cy + Math.sin(angle) * bandRy;
                return <circle key={i} cx={x} cy={y} r="3" fill="none" stroke={metal.glow} strokeWidth="1.5" />;
             })}
          </g>
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
