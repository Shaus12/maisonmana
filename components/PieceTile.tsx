import Image from "next/image";
import Link from "next/link";
import type { Piece } from "@/lib/pieces";

type Props = {
  piece: Piece;
  scale?: "lg" | "md" | "sm";
  priority?: boolean;
};

export function PieceTile({ piece, scale = "md", priority = false }: Props) {
  const aspect = scale === "lg" ? "aspect-[3/4]" : "aspect-[4/5]";

  return (
    <Link
      href={`/collections/${piece.slug}`}
      className="group block focus:outline-none"
      aria-label={`${piece.nameHe} — ${piece.reference}`}
    >
      <figure className="vellum relative overflow-hidden">
        <div className={`relative ${aspect} w-full overflow-hidden bg-paper-deep`}>
          <Image
            src={piece.image}
            alt={piece.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.035]"
            priority={priority}
          />
          <div className="pointer-events-none absolute inset-0 bg-paper-deep opacity-0 transition-opacity duration-[700ms] group-hover:opacity-[0.04]" />
          <div className="pointer-events-none absolute inset-0 ring-0 ring-brass ring-inset transition-all duration-[420ms] group-hover:ring-1" />
        </div>

        <figcaption className="flex items-baseline justify-between px-5 py-5">
          <span>
            <span className="display-he text-[1.375rem] leading-none text-ink">{piece.nameHe}</span>
            <span className="ms-3 text-[0.6875rem] tracking-[0.18em] uppercase text-ink-mute display-lat">
              {piece.nameLat}
            </span>
          </span>
          <span className="text-[0.6875rem] tracking-[0.12em] text-ink-mute">{piece.reference}</span>
        </figcaption>
      </figure>
    </Link>
  );
}
