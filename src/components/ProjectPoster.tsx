import type { Project } from "@/lib/data";

/**
 * Generated cover art. No screenshots exist for these, and stock mockups would
 * read as filler — so each project gets a deterministic poster built from its
 * own accent angle: a conic ember sweep, a technical grid, and its index.
 */
export default function ProjectPoster({
  project,
  className = "",
}: {
  project: Project;
  className?: string;
}) {
  const a = project.accentAngle;

  return (
    <div
      className={`relative isolate overflow-hidden bg-ink-2 ${className}`}
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{
          background: `conic-gradient(from ${a}deg at 62% 38%,
            #16130f 0deg, #b32a08 70deg, #ff4a1c 130deg,
            #16130f 210deg, #201b16 300deg, #16130f 360deg)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background: `radial-gradient(70% 60% at ${30 + (a % 40)}% 70%,
            rgba(255,130,86,0.55), transparent 65%)`,
          mixBlendMode: "screen",
        }}
      />
      {/* technical grid */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #f2ede7 1px, transparent 1px), linear-gradient(to bottom, #f2ede7 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />
      <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/25 to-transparent" />

      <div className="relative flex h-full flex-col justify-between p-5">
        <div className="flex items-start justify-between">
          <span className="font-mono text-[10px] tracking-[0.2em] text-bone/80 uppercase">
            {project.kind}
          </span>
          <span className="font-mono text-[10px] tracking-[0.2em] text-bone/80">
            {project.year}
          </span>
        </div>
        <div>
          <span className="block font-mono text-5xl leading-none font-bold text-bone/90">
            {project.index}
          </span>
          <span className="mt-2 block text-sm font-semibold text-bone">
            {project.title}
          </span>
        </div>
      </div>
    </div>
  );
}
