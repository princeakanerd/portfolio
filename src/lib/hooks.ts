"use client";

import { useEffect, useState } from "react";

/** True when the OS asks for reduced motion. Starts false so SSR matches. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

/** True only on devices with a precise pointer — gates the custom cursor. */
export function useFinePointer() {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return fine;
}

/**
 * Which of the given section ids currently owns the middle of the viewport.
 *
 * The root margin collapses the root to a thin band across the centre, so a
 * section counts as "active" only once it actually dominates the screen rather
 * than the moment its top edge peeks in.
 */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;

    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        setActive(ids.find((id) => visible.has(id)) ?? null);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);

  return active;
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

/**
 * Frame-rate independent exponential smoothing.
 *
 * A fixed per-frame lerp closes the gap twice as fast on a 120Hz display as on
 * 60Hz, so the same follow feels different per machine. This closes half the
 * remaining distance every `halfLife` milliseconds instead, which is stable
 * across refresh rates. `dt` is clamped so returning to a backgrounded tab
 * doesn't teleport anything.
 */
export const damp = (
  current: number,
  target: number,
  halfLife: number,
  dt: number,
) => target + (current - target) * Math.pow(2, -Math.min(dt, 64) / halfLife);
