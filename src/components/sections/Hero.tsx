"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import ShaderField from "../fx/ShaderField";
import Marquee from "../fx/Marquee";
import ResumeButton from "../ResumeButton";
import { useIntro } from "../fx/IntroProvider";
import { person, roleMarquee } from "@/lib/data";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Splits a word into per-character clip cells that rise on `ready`. */
function KineticWord({
  word,
  delay = 0,
  className = "",
}: {
  word: string;
  delay?: number;
  className?: string;
}) {
  const { ready } = useIntro();

  return (
    <span className={`flex ${className}`} aria-hidden>
      {word.split("").map((char, i) => (
        <span key={i} className="line-clip group">
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: "108%", rotate: 6, opacity: 0 }}
            animate={ready ? { y: "0%", rotate: 0, opacity: 1 } : undefined}
            transition={{ duration: 1.1, ease: EASE, delay: delay + i * 0.045 }}
          >
            <span className="inline-block transition-transform duration-300 ease-out hover:translate-y-[-0.06em] hover:text-ember">
              {char}
            </span>
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function Meta({
  children,
  delay,
  className = "",
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  const { ready } = useIntro();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      animate={ready ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const fieldScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative isolate flex min-h-svh flex-col justify-between overflow-hidden pt-24 pb-0"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ scale: fieldScale }}
      >
        <ShaderField className="h-full w-full" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-ink to-transparent" />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="shell relative z-10 flex flex-1 flex-col justify-between gap-16"
      >
        {/* Top meta rail — stacks below sm, where the two blocks would collide */}
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-4">
          <Meta delay={0.55}>
            <p className="label max-w-[24ch] leading-relaxed">
              {person.role}
              <br />
              <span className="text-ash-dim">IIIT Gwalior · B.Tech + M.Tech</span>
            </p>
          </Meta>
          <Meta delay={0.62} className="sm:text-right">
            <p className="label flex items-center gap-2 sm:justify-end">
              <span className="animate-ember-pulse inline-block h-1.5 w-1.5 rounded-full bg-ember" />
              Open to 2027 roles
            </p>
            <p className="label mt-1 text-ash-dim">{person.location}</p>
          </Meta>
        </div>

        {/* The name */}
        <div className="relative">
          <h1 className="display-xl sr-only">
            {person.first} {person.last}
          </h1>

          <div className="display-xl flex flex-col">
            <KineticWord word="PRINCE" delay={0.1} />
            <div className="flex flex-wrap items-baseline gap-x-6 md:gap-x-10">
              <KineticWord word="GAJNANI" delay={0.28} className="text-ember" />
              <Meta delay={0.8} className="hidden md:block">
                <span className="font-serif text-[clamp(1.1rem,2vw,2rem)] leading-none font-normal tracking-normal text-ash italic">
                  ({person.role.toLowerCase()})
                </span>
              </Meta>
            </div>
          </div>
        </div>

        {/* Bottom rail: claim + scroll cue */}
        <div className="flex flex-wrap items-end justify-between gap-8 pb-8">
          <Meta delay={0.72} className="max-w-md">
            <p className="text-base leading-relaxed text-ash md:text-lg">
              <span className="text-bone">{person.tagline}</span>{" "}
              {person.taglineSupport}
            </p>
            <div className="mt-7">
              <ResumeButton halo />
            </div>
          </Meta>

          <Meta delay={0.85}>
            <a
              href="#about"
              data-cursor="Scroll"
              className="group flex items-center gap-4"
            >
              <span className="relative block h-14 w-px overflow-hidden bg-line">
                <motion.span
                  className="absolute inset-x-0 top-0 block h-4 bg-ember"
                  animate={{ y: ["-100%", "360%"] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                />
              </span>
              <span className="label transition-colors group-hover:text-bone">
                (Scroll)
              </span>
            </a>
          </Meta>
        </div>
      </motion.div>

      {/* Role ticker anchored to the fold */}
      <Meta delay={0.95} className="relative z-10">
        <div className="hairline border-b border-line bg-ink/40 py-4 backdrop-blur-sm">
          <Marquee
            duration={38}
            items={roleMarquee.map((role) => (
              <span
                key={role}
                className="font-mono text-xs tracking-[0.18em] whitespace-nowrap text-ash uppercase md:text-sm"
              >
                {role}
              </span>
            ))}
          />
        </div>
      </Meta>
    </section>
  );
}
