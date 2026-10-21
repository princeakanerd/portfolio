"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MaskText, FadeUp, SectionLabel } from "../fx/Reveal";
import ProjectPoster from "../ProjectPoster";
import { useFinePointer, usePrefersReducedMotion, damp, clamp } from "@/lib/hooks";
import { projects, type Project } from "@/lib/data";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ */
/* Poster that trails the pointer while a row is hovered.              */
/* ------------------------------------------------------------------ */

function FloatingPoster({ project }: { project: Project | null }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const enabled = fine && !reduced;

  useEffect(() => {
    if (!enabled) return;
    const el = wrapRef.current;
    if (!el) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...target };
    let tilt = 0;
    let last = performance.now();

    const onMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let frame = 0;
    const render = (now: number) => {
      const dt = now - last;
      last = now;

      const prevX = pos.x;
      pos.x = damp(pos.x, target.x, 100, dt);
      pos.y = damp(pos.y, target.y, 100, dt);

      // Lean into the direction of travel — sells the weight of the card.
      // Normalised per 16ms so the lean doesn't shrink on high-refresh screens.
      const velocity = dt > 0 ? ((pos.x - prevX) / dt) * 16 : 0;
      tilt = damp(tilt, clamp(velocity * 0.9, -12, 12), 110, dt);

      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) rotate(${tilt}deg)`;
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={wrapRef} className="pointer-events-none fixed top-0 left-0 z-70">
      {/* Show/hide lives on a permanently mounted shell, so moving between rows
          only cross-fades the art inside it — the card itself never pops. */}
      <motion.div
        className="relative h-72 w-56"
        initial={false}
        animate={{
          opacity: project ? 1 : 0,
          scale: project ? 1 : 0.9,
        }}
        // Split curves by direction. Out-expo is right for the entrance, but
        // applied to a fade-out it dumps opacity in the first few frames and
        // reads as a snap — so leaving gets a symmetric curve instead.
        transition={
          project
            ? { duration: 0.45, ease: EASE }
            : { duration: 0.34, ease: [0.4, 0, 0.2, 1] }
        }
      >
        <AnimatePresence initial={false}>
          {project && (
            <motion.div
              key={project.slug}
              // Absolute so the incoming poster overlays the outgoing one
              // instead of being laid out beneath it mid-swap.
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <ProjectPoster
                project={project}
                className="h-full w-full rounded-lg shadow-2xl shadow-black/60 ring-1 ring-bone/10"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* One index row + its expanding case study.                           */
/* ------------------------------------------------------------------ */

function ProjectRow({
  project,
  open,
  onToggle,
  onHover,
}: {
  project: Project;
  open: boolean;
  onToggle: () => void;
  onHover: (p: Project | null) => void;
}) {
  return (
    <div
      className="group hairline relative isolate"
      // Leaving is handled by the list, not the row: a per-row leave fires
      // before the next row's enter, blanking the preview between neighbours.
      onPointerEnter={() => onHover(project)}
    >
      {/* Ember wash that wipes in from the left on hover. Asymmetric timing:
          it retracts in 250ms so two neighbouring rows aren't both lit while
          the pointer travels between them, but expands over a lazier 700ms. */}
      <span className="pointer-events-none absolute inset-0 z-0 origin-left scale-x-0 bg-linear-to-r from-ember/10 to-transparent transition-transform duration-250 ease-out group-hover:scale-x-100 group-hover:duration-700 group-hover:ease-out-expo" />

      <button
        onClick={onToggle}
        data-cursor={open ? "Close" : "Open"}
        aria-expanded={open}
        className="relative z-10 flex w-full items-center gap-5 py-7 text-left md:gap-10 md:py-10"
      >
        <span className="label w-8 shrink-0 text-ember transition-transform duration-500 group-hover:translate-x-1 md:w-12">
          {project.index}
        </span>

        <span className="min-w-0 flex-1">
          <span className="display-md block transition-transform duration-250 ease-out group-hover:translate-x-2 group-hover:duration-600 group-hover:ease-out-expo">
            {project.title}
          </span>
          <span className="label mt-2 block md:hidden">{project.kind}</span>
        </span>

        <span className="label hidden w-56 shrink-0 md:block">{project.kind}</span>
        <span className="label hidden w-16 shrink-0 text-right md:block">
          {project.year}
        </span>

        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line transition-all duration-500 group-hover:border-ember group-hover:bg-ember group-hover:text-ink ${
            open ? "rotate-45 border-ember bg-ember text-ink" : ""
          }`}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path
              d="M6 0v12M0 6h12"
              stroke="currentColor"
              strokeWidth="1.4"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.65, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="grid gap-10 pb-14 md:grid-cols-12 md:gap-12">
              <div className="md:col-span-4 lg:col-span-3">
                <ProjectPoster
                  project={project}
                  className="aspect-4/5 w-full rounded-lg ring-1 ring-bone/10"
                />
              </div>

              <div className="md:col-span-8 lg:col-span-8 lg:col-start-5">
                <p className="font-serif text-2xl leading-snug text-ember italic md:text-3xl">
                  “{project.quote}”
                </p>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-ash md:text-lg">
                  {project.summary}
                </p>

                <ul className="mt-8 space-y-4">
                  {project.bullets.map((bullet, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="mt-2.5 h-1 w-1 shrink-0 rotate-45 bg-ember" />
                      <span className="text-sm leading-relaxed text-bone/85 md:text-[15px]">
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-line px-3 py-1.5 font-mono text-[11px] tracking-widest text-ash uppercase"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {project.href && (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="GitHub"
                    className="group/link mt-8 inline-flex items-center gap-3 border-b border-line pb-1 font-mono text-[11px] tracking-[0.16em] uppercase transition-colors hover:border-ember hover:text-ember"
                  >
                    View source
                    <span className="transition-transform duration-400 group-hover/link:translate-x-1">
                      ↗
                    </span>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export default function Work() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [hovered, setHovered] = useState<Project | null>(null);

  // Lighter bottom padding than the usual section rhythm: the lab rail closes
  // on a progress hairline, so it needs less air beneath it.
  return (
    <section id="work" className="relative pt-28 pb-16 md:pt-40 md:pb-24">
      <div className="shell">
        <SectionLabel index="(02)">Selected work</SectionLabel>

        <div className="mt-12 flex flex-wrap items-end justify-between gap-8 md:mt-16">
          <MaskText as="h2" className="display-lg max-w-3xl" text="Things I shipped." />
          <FadeUp delay={0.2}>
            <p className="label max-w-xs leading-relaxed">
              {projects.length} builds · expand any row for the engineering
              detail
            </p>
          </FadeUp>
        </div>

        <div
          className="mt-16 border-b border-line"
          onPointerLeave={() => setHovered(null)}
        >
          {projects.map((project) => (
            <ProjectRow
              key={project.slug}
              project={project}
              open={openSlug === project.slug}
              onToggle={() =>
                setOpenSlug((s) => (s === project.slug ? null : project.slug))
              }
              onHover={setHovered}
            />
          ))}
        </div>
      </div>

      {/* An expanded row shows its own poster, so suppress the floating one
          for that row only — hovering the others still previews. */}
      <FloatingPoster
        project={hovered && hovered.slug !== openSlug ? hovered : null}
      />
    </section>
  );
}
