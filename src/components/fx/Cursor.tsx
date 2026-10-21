"use client";

import { useEffect, useRef } from "react";
import { useFinePointer, usePrefersReducedMotion, damp } from "@/lib/hooks";

/**
 * Two-part cursor: a hard ember dot that tracks 1:1, and a lagging ring that
 * swells into a labelled pill over anything carrying `data-cursor`.
 *
 * Everything is written straight to the DOM inside one rAF loop — routing this
 * through React state would re-render the tree on every mouse move.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const labelTextRef = useRef<HTMLSpanElement>(null);

  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const enabled = fine && !reduced;

  useEffect(() => {
    if (!enabled) return;

    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const label = labelRef.current!;
    const labelText = labelTextRef.current!;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...target };
    let ringScale = 1;
    let targetScale = 1;
    let pressed = false;
    let visible = false;
    let currentLabel = "";
    let last = performance.now();

    const applyVisibility = () => {
      const shown = visible ? "1" : "0";
      ring.style.opacity = shown;
      label.style.opacity = shown;
      // The dot would sit right on top of the label text, so it stands down
      // whenever the ring is carrying a word.
      dot.style.opacity = visible && !currentLabel ? "1" : "0";
    };

    const onMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;

      if (!visible) {
        visible = true;
        ringPos.x = target.x;
        ringPos.y = target.y;
      }

      const hit = (event.target as HTMLElement)?.closest?.<HTMLElement>(
        "[data-cursor], a, button",
      );
      const nextLabel = hit?.dataset?.cursor ?? "";

      targetScale = nextLabel ? 2.1 : hit ? 1.7 : 1;

      if (nextLabel !== currentLabel) {
        currentLabel = nextLabel;
        labelText.textContent = nextLabel;
        labelText.style.opacity = nextLabel ? "1" : "0";
        ring.dataset.filled = nextLabel ? "true" : "false";
      }
      applyVisibility();
    };

    const onLeave = () => {
      visible = false;
      applyVisibility();
    };

    const onDown = () => {
      pressed = true;
    };
    const onUp = () => {
      pressed = false;
    };

    let frame = 0;
    const render = (now: number) => {
      const dt = now - last;
      last = now;

      ringPos.x = damp(ringPos.x, target.x, 66, dt);
      ringPos.y = damp(ringPos.y, target.y, 66, dt);
      ringScale = damp(ringScale, targetScale * (pressed ? 0.82 : 1), 58, dt);

      const at = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;
      dot.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `${at} scale(${ringScale})`;
      // The label rides the ring but is never scaled, so the type stays crisp
      // instead of being a 4px glyph blown up 2x.
      label.style.transform = at;

      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      root.classList.remove("has-custom-cursor");
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-9999">
      <div
        ref={ringRef}
        data-filled="false"
        className="absolute top-0 left-0 h-9 w-9 rounded-full border border-bone/45 opacity-0 transition-[background-color,border-color,opacity] duration-300 data-[filled=true]:border-ember data-[filled=true]:bg-ember"
      />
      <div
        ref={labelRef}
        className="absolute top-0 left-0 flex items-center justify-center opacity-0 transition-opacity duration-300"
      >
        <span
          ref={labelTextRef}
          className="font-mono text-[10px] font-bold tracking-widest whitespace-nowrap text-ink uppercase opacity-0 transition-opacity duration-200"
        />
      </div>
      <div
        ref={dotRef}
        className="absolute top-0 left-0 h-1.5 w-1.5 rounded-full bg-ember opacity-0 transition-opacity duration-200"
      />
    </div>
  );
}
