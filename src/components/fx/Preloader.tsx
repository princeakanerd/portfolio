"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, animate } from "motion/react";
import { useIntro } from "./IntroProvider";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { person } from "@/lib/data";

const GREETINGS = ["Hello", "नमस्ते", "Hola", "Bonjour", "こんにちは", "Olá"];
const COLUMNS = 6;
const EASE = [0.76, 0, 0.24, 1] as const;

export default function Preloader() {
  const { finish } = useIntro();
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [greeting, setGreeting] = useState(0);
  // Touch devices skip the intro: on a phone it is ~4s of locked screen
  // before the hero, which reads as a slow site rather than a flourish.
  const [skip, setSkip] = useState(false);

  // Lock scroll for the duration so the hero can't be scrolled past mid-wipe.
  useEffect(() => {
    if (!visible) return;
    window.scrollTo(0, 0);
    document.documentElement.classList.add("lenis-stopped");
    return () => document.documentElement.classList.remove("lenis-stopped");
  }, [visible]);

  useEffect(() => {
    // Reduced motion and touch devices skip the whole sequence. Deferred by
    // a frame so the state change lands outside the effect that scheduled it.
    if (reduced || !window.matchMedia("(pointer: fine)").matches) {
      const id = requestAnimationFrame(() => {
        setSkip(true);
        setVisible(false);
        finish();
      });
      return () => cancelAnimationFrame(id);
    }

    const counter = animate(0, 100, {
      duration: 2.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setProgress(v),
      onComplete: () => setVisible(false),
    });

    const cycle = window.setInterval(
      () => setGreeting((g) => (g + 1) % GREETINGS.length),
      380,
    );

    return () => {
      counter.stop();
      window.clearInterval(cycle);
    };
  }, [reduced, finish]);

  if (reduced || skip) return null;

  return (
    <AnimatePresence onExitComplete={finish}>
      {visible && (
        <motion.div
          className="fixed inset-0 z-200 overflow-hidden"
          exit="out"
          initial="in"
          animate="in"
        >
          {/* Column wipe — each panel clears upward with a trailing stagger. */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: COLUMNS }).map((_, i) => (
              <motion.div
                key={i}
                className="h-full flex-1 bg-ink"
                variants={{
                  in: { y: "0%" },
                  out: {
                    y: "-100%",
                    transition: {
                      duration: 0.95,
                      ease: EASE,
                      delay: 0.06 * (COLUMNS - 1 - i),
                    },
                  },
                }}
              />
            ))}
          </div>

          <motion.div
            className="relative flex h-full flex-col justify-between p-5 md:p-10"
            variants={{
              in: { opacity: 1 },
              out: { opacity: 0, transition: { duration: 0.35, ease: "easeIn" } },
            }}
          >
            <div className="label flex items-center justify-between">
              <span>
                {person.first} {person.last}
              </span>
              <span className="hidden sm:inline">{person.timezoneLabel}</span>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="animate-ember-pulse mb-2 inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-ember md:mb-4" />
              {/* Keyed remount rather than AnimatePresence — an exit animation
                  longer than the swap interval leaves the slot visibly empty. */}
              <div className="line-clip">
                <motion.span
                  key={greeting}
                  className="display-lg block font-serif italic"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{ duration: 0.42, ease: EASE }}
                >
                  {GREETINGS[greeting]}
                </motion.span>
              </div>
            </div>

            <div>
              <div className="mb-4 h-px w-full bg-line">
                <div
                  className="h-full bg-ember"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-end justify-between">
                <span className="label">Loading portfolio</span>
                <span className="font-mono text-[13vw] leading-[0.8] font-bold tracking-tighter tabular-nums md:text-[9vw]">
                  {String(Math.round(progress)).padStart(3, "0")}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
