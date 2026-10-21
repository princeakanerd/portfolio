"use client";

import type { ReactNode } from "react";

type Props = {
  items: ReactNode[];
  /** Seconds for one full pass. Higher = slower. */
  duration?: number;
  reverse?: boolean;
  separator?: ReactNode;
  className?: string;
  itemClassName?: string;
};

/**
 * Infinite horizontal scroller. The track holds two identical copies and
 * translates by exactly -50%, so the seam always lands off-screen.
 */
export default function Marquee({
  items,
  duration = 42,
  reverse = false,
  separator,
  className = "",
  itemClassName = "",
}: Props) {
  const run = [...items, ...items];

  return (
    <div className={`group relative flex overflow-hidden ${className}`}>
      <div
        className="animate-marquee flex w-max shrink-0 items-center group-hover:[animation-play-state:paused]"
        style={
          {
            "--marquee-duration": `${duration}s`,
            animationDirection: reverse ? "reverse" : "normal",
          } as React.CSSProperties
        }
      >
        {run.map((item, i) => (
          <span key={i} className={`flex items-center ${itemClassName}`}>
            {item}
            {separator ?? (
              <span className="mx-8 inline-block h-1.5 w-1.5 rotate-45 bg-ember/70 md:mx-12" />
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
