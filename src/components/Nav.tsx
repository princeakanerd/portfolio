"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "motion/react";
import LiveClock from "./LiveClock";
import ResumeButton from "./ResumeButton";
import { useIntro } from "./fx/IntroProvider";
import { useActiveSection } from "@/lib/hooks";
import { person } from "@/lib/data";

const LINKS = [
  { href: "#about", label: "About", index: "01" },
  { href: "#work", label: "Work", index: "02" },
  { href: "#path", label: "Path", index: "03" },
  { href: "#contact", label: "Contact", index: "04" },
];

/* Document order, for the active-section indicator. */
const SECTION_IDS = LINKS.map((l) => l.href.slice(1));

const EASE = [0.76, 0, 0.24, 1] as const;

export default function Nav() {
  const [condensed, setCondensed] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const { ready } = useIntro();
  const active = useActiveSection(SECTION_IDS);

  useMotionValueEvent(scrollY, "change", (v) => setCondensed(v > 80));

  useEffect(() => {
    document.documentElement.classList.toggle("lenis-stopped", open);
    return () => document.documentElement.classList.remove("lenis-stopped");
  }, [open]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-90"
        initial={{ y: -80, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : undefined}
        transition={{ duration: 1, ease: EASE }}
      >
        <div
          className={`transition-all duration-500 ${
            condensed
              ? "border-b border-line bg-ink/70 backdrop-blur-xl"
              : "border-b border-transparent"
          }`}
        >
          <div className="shell flex h-16 items-center justify-between gap-6 md:h-20">
            <a
              href="#top"
              data-cursor="Top"
              className="group flex items-center gap-3"
            >
              <span className="animate-ember-pulse block h-2 w-2 rounded-full bg-ember" />
              <span className="font-mono text-xs tracking-[0.16em] uppercase">
                <span className="text-bone">{person.first}</span>
                <span className="text-ash transition-colors group-hover:text-bone">
                  {" "}
                  {person.last}
                </span>
              </span>
            </a>

            <nav className="hidden items-center gap-8 lg:flex">
              {LINKS.map((link) => {
                const isActive = active === link.href.slice(1);
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "true" : undefined}
                    className={`group relative font-mono text-[11px] tracking-[0.16em] uppercase transition-colors duration-300 hover:text-bone ${
                      isActive ? "text-bone" : "text-ash"
                    }`}
                  >
                    <span
                      className={`mr-1.5 transition-colors duration-300 ${
                        isActive ? "text-ember" : "text-ember/60"
                      }`}
                    >
                      {link.index}
                    </span>
                    {link.label}
                    {/* Hover draws the rule; the active section keeps it. */}
                    <span
                      className={`absolute -bottom-1.5 left-0 h-px bg-ember transition-all duration-400 group-hover:w-full ${
                        isActive ? "w-full" : "w-0"
                      }`}
                    />
                  </a>
                );
              })}
            </nav>

            <div className="flex items-center gap-4 md:gap-5">
              <span className="label hidden items-center gap-2 xl:flex">
                <LiveClock />
                <span className="text-ash-dim">{person.timezoneLabel}</span>
              </span>

              <a
                href="#contact"
                data-cursor="Say hi"
                className="label hidden items-center gap-2 transition-colors duration-300 hover:text-bone md:flex"
              >
                <span className="animate-ember-pulse inline-block h-1.5 w-1.5 rounded-full bg-ember" />
                Available
              </a>

              {/* Visible at every width — it fits beside the logo and burger
                  even at 390px, and it is the one thing worth always offering. */}
              <ResumeButton size="sm" />

              <button
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 lg:hidden"
              >
                <span className="block h-px w-5 bg-bone" />
                <span className="block h-px w-5 bg-bone" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-95 bg-ink-2 lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="shell flex h-16 items-center justify-end md:h-20">
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="font-mono text-[11px] tracking-[0.16em] uppercase"
              >
                Close ✕
              </button>
            </div>
            <nav className="shell mt-10 flex flex-col">
              {LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="hairline flex items-baseline gap-4 py-5"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.6, ease: EASE }}
                >
                  <span className="label text-ember">{link.index}</span>
                  <span className="display-md">{link.label}</span>
                </motion.a>
              ))}
            </nav>
            <motion.div
              className="shell mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6, ease: EASE }}
            >
              <ResumeButton size="md" halo />
            </motion.div>

            <div className="shell mt-12 flex items-center justify-between">
              <span className="label">{person.location}</span>
              <span className="label flex gap-2">
                <LiveClock />
                {person.timezoneLabel}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
