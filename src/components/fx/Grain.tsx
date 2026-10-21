"use client";

/**
 * Fixed film grain + a slow vignette. Sits above everything except the cursor
 * and ties the flat vectors to the shader work underneath.
 */
export default function Grain() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-80">
      <svg className="absolute h-0 w-0">
        <filter id="grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>
      <div
        className="absolute inset-0 hidden opacity-[0.16] mix-blend-overlay pointer-fine:block"
        style={{ filter: "url(#grain-filter)" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 40%, transparent 40%, rgba(8,7,6,0.55) 100%)",
        }}
      />
    </div>
  );
}
