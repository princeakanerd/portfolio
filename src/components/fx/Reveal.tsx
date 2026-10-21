"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Static table of the motion components these primitives can render as.
 *
 * Resolving the tag at module scope is deliberate. Building the component
 * inside a render body — `motion.create(Tag)` — returns a new component *type*
 * on every render, so React unmounts and remounts the entire subtree each
 * time, restarting animations and resetting any `useInView` beneath it. That
 * is what silently pinned the stat counters to zero.
 */
const MOTION_TAGS = {
  span: motion.span,
  div: motion.div,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  ul: motion.ul,
  li: motion.li,
} as const;

type MotionTagName = keyof typeof MOTION_TAGS;

/* ------------------------------------------------------------------ */
/* Word-by-word mask reveal — the signature entrance for headings.     */
/* Each word gets its own clipping box so the type rises out of a slot */
/* rather than simply fading in.                                       */
/* ------------------------------------------------------------------ */

type MaskTextProps = {
  text: string;
  as?: MotionTagName;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
};

export function MaskText({
  text,
  as: Tag = "span",
  className = "",
  wordClassName = "",
  delay = 0,
  stagger = 0.045,
  once = true,
}: MaskTextProps) {
  const words = text.split(" ");
  const MotionTag = MOTION_TAGS[Tag];

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-12% 0px -12% 0px" }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {/* Per-word spans concatenate without whitespace, so expose the intact
          sentence to assistive tech and copy-paste, and hide the split copy. */}
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden
          className="line-clip mr-[0.26em] inline-block"
        >
          <motion.span
            className={`inline-block will-change-transform ${wordClassName}`}
            variants={{
              hidden: { y: "110%", opacity: 0, rotate: 3 },
              visible: {
                y: "0%",
                opacity: 1,
                rotate: 0,
                transition: { duration: 0.95, ease: EASE },
              },
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

/* ------------------------------------------------------------------ */
/* Generic scroll-in wrapper.                                          */
/* ------------------------------------------------------------------ */

type FadeUpProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
};

export function FadeUp({
  children,
  className = "",
  delay = 0,
  y = 28,
  once = true,
}: FadeUpProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.85, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Staggered list container + item.                                    */
/* ------------------------------------------------------------------ */

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export function Stagger({
  children,
  className = "",
  as: Tag = "div",
  amount = 0.15,
}: {
  children: ReactNode;
  className?: string;
  as?: MotionTagName;
  amount?: number;
}) {
  const MotionTag = MOTION_TAGS[Tag];
  return (
    <MotionTag
      className={className}
      variants={listVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerItem({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: MotionTagName;
}) {
  const MotionTag = MOTION_TAGS[Tag];
  return (
    <MotionTag className={className} variants={itemVariants}>
      {children}
    </MotionTag>
  );
}

/* ------------------------------------------------------------------ */
/* Section eyebrow — mono label, index, and a rule that draws itself.  */
/* ------------------------------------------------------------------ */

export function SectionLabel({
  index,
  children,
}: {
  index: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="label text-ember">{index}</span>
      <span className="label">{children}</span>
      <motion.span
        className="h-px flex-1 origin-left bg-line"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 1.2, ease: EASE }}
      />
    </div>
  );
}
