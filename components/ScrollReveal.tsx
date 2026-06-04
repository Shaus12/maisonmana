"use client";
import { useEffect, useRef, type ReactNode } from "react";

type Direction = "up" | "left" | "right" | "scale";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: 0 | 1 | 2 | 3 | 4 | 5;
  direction?: Direction;
  threshold?: number;
  as?: "div" | "section" | "article" | "header" | "li";
};

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  threshold = 0.1,
  as: Tag = "div",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Immediately visible if already in view on mount
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in-view");
          obs.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -48px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  const dirClass = direction !== "up" ? ` reveal--${direction}` : "";
  const delayClass = delay ? ` reveal-delay-${delay}` : "";

  return (
    // @ts-expect-error — dynamic tag with ref
    <Tag ref={ref} className={`reveal${dirClass}${delayClass}${className ? ` ${className}` : ""}`}>
      {children}
    </Tag>
  );
}
