"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { MaskText, FadeUp, SectionLabel } from "../fx/Reveal";
import { experience, skillGroups } from "@/lib/data";

export default function Path() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 65%", "end 60%"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 26 });

  return (
    <section id="path" className="shell py-28 md:py-40">
      <SectionLabel index="(03)">Path & toolkit</SectionLabel>

      <div className="mt-12 md:mt-16">
        <MaskText
          as="h2"
          className="display-lg max-w-4xl"
          text="Where the habits came from."
        />
      </div>

      {/* Timeline */}
      <div ref={timelineRef} className="relative mt-20 pl-8 md:pl-0">
        {/* rail */}
        <div className="absolute top-2 bottom-2 left-0 w-px bg-line md:left-[22%]">
          <motion.div
            className="absolute inset-x-0 top-0 origin-top bg-ember"
            style={{ scaleY: fill, height: "100%" }}
          />
        </div>

        <div className="space-y-16 md:space-y-24">
          {experience.map((item, i) => (
            <FadeUp key={item.role} delay={i * 0.05}>
              <div className="relative grid gap-4 md:grid-cols-[22%_1fr] md:gap-12">
                {/* node */}
                <span className="absolute top-2 -left-8 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border border-ember bg-ink md:left-[22%]" />

                <p className="label pt-1 md:text-right md:pr-12">{item.period}</p>

                <div className="md:pl-12">
                  <h3 className="text-xl font-semibold md:text-2xl">{item.role}</h3>
                  <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-mono text-xs tracking-[0.14em] text-ember uppercase">
                      {item.org}
                    </span>
                    <span className="label text-ash-dim">{item.place}</span>
                  </p>
                  <ul className="mt-5 space-y-3">
                    {item.points.map((point, j) => (
                      <li key={j} className="flex gap-4">
                        <span className="mt-2.5 h-1 w-1 shrink-0 rotate-45 bg-ash-dim" />
                        <span className="max-w-2xl text-sm leading-relaxed text-ash md:text-[15px]">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>

      {/* Toolkit */}
      <div className="mt-32 md:mt-40">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <MaskText as="h3" className="display-md" text="The toolkit." />
          <FadeUp>
            <p className="label">
              {skillGroups.length} groups ·{" "}
              {skillGroups.reduce((n, g) => n + g.items.length, 0)} skills
            </p>
          </FadeUp>
        </div>

        <div className="mt-10 border-t border-line-strong">
          {skillGroups.map((group, gi) => (
            <FadeUp key={group.title} delay={gi * 0.04}>
              <div
                className={`group grid gap-4 border-b py-7 md:grid-cols-[22%_1fr] md:gap-12 ${
                  "highlight" in group && group.highlight
                    ? "relative -mx-4 rounded-lg border border-ember/30 bg-ember/6 px-4 md:-mx-6 md:px-6"
                    : "border-line"
                }`}
              >
                <p
                  className={`font-mono text-xs tracking-[0.16em] uppercase transition-colors duration-400 group-hover:text-ember ${
                    "highlight" in group && group.highlight ? "flex items-center gap-2 text-ember" : "text-ash"
                  }`}
                >
                  {"highlight" in group && group.highlight && (
                    <span className="animate-ember-pulse h-1.5 w-1.5 rounded-full bg-ember" />
                  )}
                  {group.title}
                </p>
                <div className="flex flex-wrap gap-x-2 gap-y-2.5">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className={`rounded-full border px-3.5 py-1.5 text-sm transition-all duration-400 hover:-translate-y-0.5 ${
                        "highlight" in group && group.highlight
                          ? "border-ember/50 bg-ember/12 font-medium text-bone hover:bg-ember hover:text-ink"
                          : "border-line text-bone/80 hover:border-ember/50 hover:bg-ember/8 hover:text-ember-soft"
                      }`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
