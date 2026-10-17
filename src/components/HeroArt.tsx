"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function HeroArt({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    function onMove(event: PointerEvent) {
      const frame = ref.current;
      if (!frame) return;
      const rect = frame.getBoundingClientRect();
      const x = Math.max(-12, Math.min(12, (event.clientX - rect.left) / rect.width - 0.5) * 24);
      const y = Math.max(-12, Math.min(12, (event.clientY - rect.top) / rect.height - 0.5) * 24);
      frame.style.transform = `translate(${x}px, ${y}px)`;
    }

    function onLeave() {
      if (ref.current) ref.current.style.transform = "";
    }

    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerleave", onLeave);
    return () => {
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <figure ref={ref} className="rd-hero-art">
      {children}
    </figure>
  );
}
