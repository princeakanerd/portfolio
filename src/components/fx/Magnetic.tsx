"use client";

import { useRef, type ReactElement, cloneElement } from "react";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/hooks";

type Props = {
  children: ReactElement<{ ref?: React.Ref<HTMLElement> }>;
  /** How far the element is allowed to chase the pointer, in px. */
  strength?: number;
};

/**
 * Pulls its child toward the pointer while hovered, then springs it home.
 * Uses a CSS transition rather than rAF — the movement is coarse enough that
 * the browser's own interpolation is indistinguishable and far cheaper.
 */
export default function Magnetic({ children, strength = 22 }: Props) {
  const ref = useRef<HTMLElement>(null);
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();

  if (!fine || reduced) return children;

  const onMove = (event: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate3d(${(dx / rect.width) * strength}px, ${
      (dy / rect.height) * strength
    }px, 0)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate3d(0, 0, 0)";
  };

  return (
    <span
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="inline-flex [&>*]:transition-transform [&>*]:duration-500 [&>*]:ease-out-expo"
    >
      {cloneElement(children, { ref })}
    </span>
  );
}
