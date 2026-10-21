"use client";

import { useEffect, useRef } from "react";
import { useInView, animate } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks";

type Props = {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
};

const format = (n: number) => Math.round(n).toLocaleString("en-US");

/**
 * Counts up once when scrolled into view.
 *
 * The tween writes `textContent` imperatively for frame-rate reasons, which
 * means React must not disagree about what belongs there: the JSX children are
 * the *settled* value, so any re-render mid-tween snaps to the final number
 * instead of resetting to zero (and no-JS renders the real figure too).
 */
export default function Counter({
  value,
  prefix = "",
  suffix = "",
  duration = 2,
  className = "",
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  // Vertical-only margin. A bare "-15%" also shrinks the root horizontally,
  // which permanently excludes anything sitting near the left or right edge.
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const write = (n: number) => {
      el.textContent = `${prefix}${format(n)}${suffix}`;
    };

    if (!inView) {
      write(0);
      return;
    }

    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: write,
      onComplete: () => write(value),
    });
    return () => controls.stop();
  }, [inView, value, prefix, suffix, duration, reduced]);

  return (
    <span ref={ref} className={className} suppressHydrationWarning>
      {prefix}
      {format(value)}
      {suffix}
    </span>
  );
}
