"use client";

import Magnetic from "./fx/Magnetic";
import { person } from "@/lib/data";

const SIZES = {
  sm: "px-4 py-2 text-[10px] gap-2",
  md: "px-7 py-4 text-xs gap-3",
  lg: "px-8 py-4.5 text-xs gap-3",
} as const;

/**
 * The primary call to action on the site, so it is the one solid ember fill —
 * everything else on the page is outlined or ghosted, which lets this read as
 * the single "do this" without needing to be large.
 *
 * Opens the PDF in a new tab rather than forcing a download: a recruiter
 * skimming on a phone should be able to read it without a file landing in
 * their downloads folder, and the browser viewer still offers Save.
 */
export default function ResumeButton({
  className = "",
  size = "md",
  halo = false,
}: {
  className?: string;
  size?: keyof typeof SIZES;
  /** Breathing glow behind the pill. Reserved for the hero. */
  halo?: boolean;
}) {
  return (
    <span className={`relative inline-flex ${className}`}>
      {halo && (
        <span
          aria-hidden
          className="animate-halo pointer-events-none absolute -inset-3 rounded-full bg-ember/25 blur-xl"
        />
      )}

      <Magnetic strength={26}>
        <a
          href={person.resume}
          target="_blank"
          rel="noreferrer"
          data-cursor="Résumé"
          className={`group relative isolate inline-flex items-center overflow-hidden rounded-full bg-ember font-mono font-semibold tracking-[0.16em] text-ink uppercase shadow-[0_0_34px_-10px_rgba(255,74,28,0.9)] transition-shadow duration-500 hover:shadow-[0_0_46px_-6px_rgba(255,74,28,1)] ${SIZES[size]}`}
        >
          {/* Fills to bone on hover, wiping in from the left. */}
          <span className="absolute inset-0 z-0 -translate-x-full bg-bone transition-transform duration-600 ease-out-expo group-hover:translate-x-0" />

          {/* Periodic light sweep. Hidden on hover so it can't fight the wipe. */}
          <span
            aria-hidden
            className="animate-shimmer pointer-events-none absolute inset-y-0 left-0 z-0 w-1/3 bg-linear-to-r from-transparent via-bone/45 to-transparent group-hover:opacity-0"
          />

          <span className="relative z-10">Résumé</span>
          <span className="relative z-10 text-ink/45">PDF</span>
          <span className="relative z-10 transition-transform duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            ↗
          </span>
        </a>
      </Magnetic>
    </span>
  );
}
